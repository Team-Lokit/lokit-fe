import { useGetMyPageSuspense } from '@repo/api-client';
import * as S from './ProfileClient.style';
import KakaoIcon from '@/assets/images/kakao.svg';

// TODO: 연결된 계정 및 버전 정보 api 연결 필요
export default function ProfileClient() {
  const { data } = useGetMyPageSuspense();

  return (
    <S.Wrapper>
      <S.Row>
        <S.RowTitle>이름</S.RowTitle>
        <S.RowValue>{data.myName}</S.RowValue>
      </S.Row>
      <S.Row>
        <S.RowTitle>연결된 계정</S.RowTitle>
        <S.RowValue>
          <S.KakaoIconContainer>
            <KakaoIcon width={10} height={10} />
          </S.KakaoIconContainer>
          카카오
        </S.RowValue>
      </S.Row>
      <S.Row>
        <S.RowTitle>나의 버전 정보</S.RowTitle>
        <S.RowValue>1.0.0</S.RowValue>
      </S.Row>
    </S.Wrapper>
  );
}
