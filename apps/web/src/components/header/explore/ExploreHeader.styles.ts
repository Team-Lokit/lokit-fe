import styled from '@emotion/styled';
import LocationArrowSvg from '@/assets/images/locationArrow.svg';

export const LocationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
`;

export const LocationArrowIcon = styled(LocationArrowSvg)`
  width: 16px;
  height: 16px;
  display: block;
  color: ${({ theme }) => theme.colors.grayScale[100]};
`;

export const LocationText = styled.span`
  ${({ theme }) => theme.typography.heading18Bold}
  color: ${({ theme }) => theme.colors.grayScale[100]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  width: 100%;
  text-align: center;
`;

export const ProfileImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
`;
