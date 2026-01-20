import LocationSvg from '@/assets/images/location.svg';
import styled from '@emotion/styled';

export const Container = styled.header<{ transparent?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 56px;
  padding: 0 16px;
  background: ${({ theme, transparent }) =>
    transparent ? 'transparent' : theme.colors.gradient.black1};
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CenterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

export const Title = styled.h1`
  ${({ theme }) => theme.typography.heading18Bold}
  color: ${({ theme }) => theme.colors.gray[100]};
  margin: 0;
`;

export const LocationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const LocationIcon = styled(LocationSvg)`
  width: 16px;
  height: 16px;
  fill: ${({ theme }) => theme.colors.gray[400]};
`;

export const LocationText = styled.span`
  ${({ theme }) => theme.typography.heading18Bold}
  color: ${({ theme }) => theme.colors.gray[100]};
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 10px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.gray[200]};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.blueWhite.bg8};
  }

  &:active {
    background: ${({ theme }) => theme.colors.blueWhite.bg8};
  }
`;

export const TextButton = styled.button<{ disabled?: boolean }>`
  ${({ theme }) => theme.typography.body18Semibold}
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.gray[600] : theme.colors.primary[400]};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.blueWhite.bg8};
  }

  &:active:not(:disabled) {
    background: ${({ theme }) => theme.colors.blueWhite.bg8};
  }
`;

export const ProfileImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
`;
