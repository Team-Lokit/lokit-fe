import styled from '@emotion/styled';

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const RowTitle = styled.span`
  ${({ theme }) => theme.typography.body16Medium}
  color: ${({ theme }) => theme.colors.gray['400']};
`;

export const RowValue = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  ${({ theme }) => theme.typography.body16Semibold}
  color: ${({ theme }) => theme.colors.gray['200']};
`;

export const KakaoIconContainer = styled.div`
  display: flex;
  width: 20px;
  height: 20px;
  padding: 5px;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;

  border-radius: 544.909px;
  border: 0.545px solid rgba(255, 255, 255, 0.1);
  background: #fee500;
  backdrop-filter: blur(2.7272725105285645px);
`;
