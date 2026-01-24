import LocationSvg from '@/assets/images/location.svg';
import styled from '@emotion/styled';

export const LocationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const LocationIcon = styled(LocationSvg)`
  width: 16px;
  height: 16px;
  fill: ${({ theme }) => theme.colors.gray[200]};
`;

export const LocationText = styled.span`
  ${({ theme }) => theme.typography.heading18Bold}
  color: ${({ theme }) => theme.colors.gray[100]};
`;

export const ProfileImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
`;
