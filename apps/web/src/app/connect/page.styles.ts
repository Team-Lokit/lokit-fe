import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.blackOpacity[100]};
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  padding-bottom: 24px;
  gap: 48px;
  animation: ${fadeIn} 0.8s ease-in-out both;
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 24px 0;
`;

export const Title = styled.h1`
  ${({ theme }) => theme.typography.heading24Bold};
  color: ${({ theme }) => theme.colors.grayScale[100]};
  margin: 0;
`;

export const Description = styled.p`
  ${({ theme }) => theme.typography.body16Regular};
  color: ${({ theme }) => theme.colors.grayScale[300]};
  margin: 0;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 20px;
  gap: 12px;

  > button {
    width: 100%;
  }
`;

/** 내 초대코드 섹션: 제목–코드 8px, 코드–카카오 공유 20px */
export const InviteSection = styled(Section)`
  gap: 8px;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SectionTitle = styled.h2`
  ${({ theme }) => theme.typography.body15Semibold};
  color: ${({ theme }) => theme.colors.grayScale[200]};
  margin: 0;
`;

export const ExpiryText = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  ${({ theme }) => theme.typography.body15Semibold};
  color: ${({ theme }) => theme.colors.grayScale[300]};
  font-variant-numeric: tabular-nums;
  margin: 0;

  svg {
    width: 12px;
    height: 12px;

    path {
      fill: ${({ theme }) => theme.colors.grayScale[400]};
    }
  }
`;

export const CodeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  width: 100%;
  height: 46px;
  background-color: ${({ theme }) => theme.colors.blueWhiteOpacity.bg5};
  border-radius: 12px;
  ${({ theme }) => theme.typography.body16Regular};
  color: ${({ theme }) => theme.colors.grayScale[100]};
`;

export const CopyIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    opacity: 0.8;
  }
`;

export const KakaoShareButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  gap: 9px;
  margin-top: 12px;
  ${({ theme }) => theme.typography.body16Semibold};
  color: ${({ theme }) => theme.colors.grayScale[200]};
`;

export const KakaoIcon = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  padding: 4px;
  border-radius: 50%;
  background: #fee500;
`;

export const ConnectButtonWrapper = styled.div`
  margin-top: 4px;

  button {
    width: 100%;
  }
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px 20px 42px;

  &:empty {
    display: none;
  }
`;
