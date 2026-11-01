import styled from '@emotion/styled';

export const List = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LoadingMore = styled.p`
  padding: 16px 0;
  text-align: center;
  ${({ theme }) => theme.typography.body14Regular}
  color: ${({ theme }) => theme.colors.grayScale[600]};
`;

export const SectionTitle = styled.div`
  padding: 24px 20px 0;
  ${({ theme }) => theme.typography.body16Semibold}
  color: ${({ theme }) => theme.colors.grayScale[0]};
`;

export const Footer = styled.p`
  padding: 16px 0;
  text-align: center;
  ${({ theme }) => theme.typography.body14Regular}
  color: ${({ theme }) => theme.colors.grayScale[600]};
`;
