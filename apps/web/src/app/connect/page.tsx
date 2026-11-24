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
import { CONNECT_FROM_MYPAGE, CONNECT_FROM_PARAM, INVITE_CODE_LENGTH } from './constants';
import { track } from '@/lib/analytics';
import CopySvg from '@/assets/images/copy.svg';
import KakaoSvg from '@/assets/images/kakao.svg';
import ClockSvg from '@/assets/images/clock.svg';
import { formatTimeLeft } from './_utils/formatTimeLeft';
import { toCoupleConnectErrorType } from './_utils/toCoupleConnectErrorType';
import { formatDeadline } from '@/utils/formatDeadline';
import * as S from './page.styles';

const COUPLE_STATUS_POLLING_INTERVAL = 3000;
const CONNECT_SUCCESS_MESSAGE = '연결에 성공했어요';

export default function ConnectPage() {
  const router = useRouter();
  // 마이페이지 배너로 들어왔으면 그 마이페이지로 돌아가고, URL 직접 진입 등 다른 경로면 마이페이지로 replace한다.
  // history 개수만으로는 바로 앞 화면이 마이페이지인지 알 수 없어 진입 경로를 쿼리로 표시한다.
  const goBackToMyPage = useCallback(() => {
    const from = new URLSearchParams(window.location.search).get(CONNECT_FROM_PARAM);
    if (from === CONNECT_FROM_MYPAGE && window.history.length > 1) {
      router.back();
      return;
    }
    router.replace(ROUTES.MYPAGE);
  }, [router]);
  const { showToast } = useToast();
  const [expiryTime, setExpiryTime] = useState('');
  const [partnerCode, setPartnerCode] = useState('');
  const [isMismatchModalOpen, setIsMismatchModalOpen] = useState(false);
  const hasNavigatedRef = useRef(false);
  // 내가 코드로 연결하는 중에는 폴링이 같은 연결을 성공으로 중복 처리하지 않게 막는다
  const isJoiningRef = useRef(false);
  const { data: myPageData } = useGetMyPage();
  const reconnectDeadline = formatDeadline(myPageData?.reconnectDeadline);
  const { inviteCode, createCode, refreshCode, copyCode } = useInviteCode();
  // 같은 코드에 대해 재발급을 한 번만 요청하기 위해 마지막으로 재발급을 요청한 만료 시각을 기억한다
  const refreshedExpiresAtRef = useRef<string | null>(null);
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
          goBackToMyPage();
        }
      } catch (error) {
        console.error('연결 상태 확인 실패:', error);
      }
    };

    checkCoupleStatus();
    const interval = setInterval(checkCoupleStatus, COUPLE_STATUS_POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [goBackToMyPage, showToast]);

  // 페이지 진입 시 코드 생성
  useEffect(() => {
    createCode();
  }, [createCode]);

  // 남은 시간 표시, 만료되면 새 코드 재발급
  useEffect(() => {
    const expiresAt = inviteCode?.expiresAt;
    if (!expiresAt) return;

    const update = () => {
      setExpiryTime(formatTimeLeft(expiresAt));

      const isExpired = new Date(expiresAt).getTime() <= Date.now();
      // 재발급이 실패하거나 기기 시계가 서버보다 빨라 같은 코드가 다시 오더라도 반복 요청하지 않는다
      if (isExpired && refreshedExpiresAtRef.current !== expiresAt) {
        refreshedExpiresAtRef.current = expiresAt;
        void refreshCode();
      }
    };
    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [inviteCode?.expiresAt, refreshCode]);

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
      goBackToMyPage();
      return;
    }

    const errorType = toCoupleConnectErrorType(result.errorCode);

    // 코드 문제가 아닌 실패(요청 제한, 동시 요청 충돌, 네트워크 등)는 다시 시도하도록 안내한다
    if (!errorType) {
      showToast('잠시 후 다시 시도해주세요', 3000, 'warn');
      return;
    }

    track('couple_connect_fail', { error_type: errorType });
    setPartnerCode('');

    if (errorType === 'expired') {
      showToast('만료된 코드예요', 3000, 'warn');
    } else if (errorType === 'already_connected') {
      // 내가 이미 커플이면 합류 API가 성공으로 응답하므로, 이 경우는 코드 주인이 이미 연결된 경우다
      showToast('이미 다른 사람과 연결된 코드예요', 3000, 'warn');
    } else {
      setIsMismatchModalOpen(true);
    }
  }, [partnerCode, isJoining, joinCode, showToast, goBackToMyPage]);

  const handleRetry = useCallback(() => {
    setIsMismatchModalOpen(false);
  }, []);

  return (
    <S.Wrapper>
      <BackHeader />
      <S.Content>
        <S.TitleGroup>
          <S.Title>함께 사진을 채워봐요</S.Title>
          <S.Description>
            {reconnectDeadline === null
              ? '로킷을 함께할 사람과 연결해주세요'
              : `${reconnectDeadline}까지 기존 파트너와 재연결하면\n업로드한 사진들을 다시 복구할 수 있어요`}
          </S.Description>
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
          <S.SectionHeader>
            <S.SectionTitle>상대방에게 받은 코드를 입력해주세요</S.SectionTitle>
          </S.SectionHeader>
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
