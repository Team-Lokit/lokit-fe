'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getMyStatus, saveCoupleStatusCookie, useGetMyPage } from '@repo/api-client';
import Button from '@/components/buttons/button/Button';
import { BackHeader } from '@/components/header';
import QaSkipCoupleButton from './_components/QaSkipCoupleButton/QaSkipCoupleButton';
import CodeInput from './_components/CodeInput/CodeInput';
import CodeMismatchModal from './_components/CodeMismatchModal/CodeMismatchModal';
import { useInviteCode } from './_hooks/useInviteCode';
import { useCodeVerification } from './_hooks/useCodeVerification';
import { useToast } from '@/components/toast';
import { ROUTES } from '@/constants/routes';
import { KAKAO_TEMPLATE_ID } from '@/constants/kakao';
import { INVITE_CODE_LENGTH } from '@/constants/onboarding';
import { track } from '@/lib/analytics';
import CopySvg from '@/assets/images/copy.svg';
import KakaoSvg from '@/assets/images/kakao.svg';
import ClockSvg from '@/assets/images/clock.svg';
import { formatTimeLeft } from './_utils/formatTimeLeft';
import { toCoupleConnectErrorType } from './_utils/toCoupleConnectErrorType';
import * as S from './page.styles';

const COUPLE_STATUS_POLLING_INTERVAL = 3000;
const CONNECT_SUCCESS_MESSAGE = '연결에 성공했어요';

export default function ConnectPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [expiryTime, setExpiryTime] = useState('');
  const [partnerCode, setPartnerCode] = useState('');
  const [isMismatchModalOpen, setIsMismatchModalOpen] = useState(false);
  const previousCodeRef = useRef<string | null>(null);
  const hasNavigatedRef = useRef(false);
  // 내가 코드로 연결하는 중에는 폴링이 같은 연결을 성공으로 중복 처리하지 않게 막는다
  const isJoiningRef = useRef(false);
  const { data: myPageData } = useGetMyPage();
  const { inviteCode, createCode, copyCode } = useInviteCode();
  const { joinCode, isJoining } = useCodeVerification();

  // 상대방이 내 코드로 연결하면 마이페이지로 이동
  useEffect(() => {
    const checkCoupleStatus = async () => {
      try {
        const data = await getMyStatus();
        if (data.isCoupled && !hasNavigatedRef.current && !isJoiningRef.current) {
          hasNavigatedRef.current = true;
          showToast(CONNECT_SUCCESS_MESSAGE, 3000, 'success');
          track('couple_connect_success', {
            invite_method: 'link',
            // TODO: days_since_signup은 클라이언트가 알 수 없어 제외 (백엔드 응답에 가입일 추가 후 적용)
          });
          await saveCoupleStatusCookie().catch(() => {});
          router.replace(ROUTES.MYPAGE);
        }
      } catch (error) {
        console.error('연결 상태 확인 실패:', error);
      }
    };

    checkCoupleStatus();
    const interval = setInterval(checkCoupleStatus, COUPLE_STATUS_POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [router, showToast]);

  // 코드가 자동으로 갱신되었을 때 토스트 표시
  useEffect(() => {
    if (previousCodeRef.current && previousCodeRef.current !== inviteCode?.code) {
      showToast('초대코드가 변경되었어요', 3000, 'warn');
    }
    previousCodeRef.current = inviteCode?.code || null;
  }, [inviteCode?.code, showToast]);

  // 페이지 진입 시 코드 생성
  useEffect(() => {
    createCode();
  }, [createCode]);

  // 남은 시간 표시
  useEffect(() => {
    if (!inviteCode?.expiresAt) return;

    const update = () => setExpiryTime(formatTimeLeft(inviteCode.expiresAt));
    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [inviteCode?.expiresAt]);

  const handleShareKakao = useCallback(() => {
    const kakao = window.Kakao;
    if (!kakao || !inviteCode?.code) return;

    try {
      const isDev = process.env.NEXT_PUBLIC_APP_ENV !== 'production';
      const templateId = isDev ? KAKAO_TEMPLATE_ID.DEV : KAKAO_TEMPLATE_ID.PROD;

      if (!templateId) {
        console.error('카카오톡 템플릿 ID가 설정되지 않았습니다.');
        return;
      }

      kakao.Share.sendCustom({
        templateId,
        templateArgs: {
          userName: myPageData?.myName || '사용자',
          inviteCode: inviteCode.code,
          link: window.location.origin,
        },
      });
    } catch (error) {
      console.error('카카오톡 공유 실패:', error);
    }
  }, [inviteCode, myPageData]);

  const handleConnectClick = useCallback(async () => {
    if (partnerCode.length !== INVITE_CODE_LENGTH || isJoining) return;

    isJoiningRef.current = true;
    const result = await joinCode(partnerCode);
    isJoiningRef.current = false;

    if (result.success) {
      hasNavigatedRef.current = true;
      track('couple_connect_success', {
        invite_method: 'code',
        // TODO: days_since_signup은 클라이언트가 알 수 없어 제외 (백엔드 응답에 가입일 추가 후 적용)
      });
      showToast(CONNECT_SUCCESS_MESSAGE, 3000, 'success');
      router.replace(ROUTES.MYPAGE);
      return;
    }

    track('couple_connect_fail', {
      error_type: toCoupleConnectErrorType(result.errorCode),
    });

    if (result.errorCode === 'INVITE_002') {
      showToast('만료된 코드예요', 3000, 'warn');
      setPartnerCode('');
    } else if (result.errorCode === 'COUPLE_001') {
      showToast('이미 연결된 계정이에요', 3000, 'warn');
      router.replace(ROUTES.MYPAGE);
    } else {
      setPartnerCode('');
      setIsMismatchModalOpen(true);
    }
  }, [partnerCode, isJoining, joinCode, showToast, router]);

  const handleRetry = useCallback(() => {
    setIsMismatchModalOpen(false);
  }, []);

  return (
    <S.Wrapper>
      <BackHeader />
      <S.Content>
        <S.TitleGroup>
          <S.Title>함께 사진을 채워봐요</S.Title>
          <S.Description>로킷을 함께할 사람과 연결해주세요</S.Description>
        </S.TitleGroup>

        <S.InviteSection>
          <S.SectionHeader>
            <S.SectionTitle>내 초대코드</S.SectionTitle>
            {expiryTime && (
              <S.ExpiryText>
                <ClockSvg aria-hidden />
                {expiryTime}
              </S.ExpiryText>
            )}
          </S.SectionHeader>
          <S.CodeDisplay>
            <span>{inviteCode?.code || '000000'}</span>
            <S.CopyIconButton onClick={copyCode} aria-label="초대코드 복사">
              <CopySvg />
            </S.CopyIconButton>
          </S.CodeDisplay>
          <S.KakaoShareButton onClick={handleShareKakao}>
            <S.KakaoIcon>
              <KakaoSvg />
            </S.KakaoIcon>
            카카오톡으로 공유하기
          </S.KakaoShareButton>
        </S.InviteSection>

        <S.Section>
          <S.SectionTitle>상대방에게 받은 코드를 입력해주세요</S.SectionTitle>
          <CodeInput value={partnerCode} onChange={setPartnerCode} />
          <S.ConnectButtonWrapper>
            <Button
              text="코드로 연결하기"
              variant="highlight"
              size="large"
              onClick={handleConnectClick}
              disabled={partnerCode.length !== INVITE_CODE_LENGTH || isJoining}
            />
          </S.ConnectButtonWrapper>
        </S.Section>
      </S.Content>

      <S.Footer>
        <QaSkipCoupleButton />
      </S.Footer>

      <CodeMismatchModal isOpen={isMismatchModalOpen} onRetry={handleRetry} />
    </S.Wrapper>
  );
}
