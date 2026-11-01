import styled from '@emotion/styled';

export const Wrapper = styled.div`
  padding: 0 20px;
`;

export const Banner = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.grayScale[1000]};
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.grayScale[800]};
  }
`;

export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
`;

export const Title = styled.span`
  ${({ theme }) => theme.typography.body16Medium}
  color: ${({ theme }) => theme.colors.grayScale[0]};
`;

export const Description = styled.span`
  ${({ theme }) => theme.typography.body14Regular}
  color: ${({ theme }) => theme.colors.grayScale[300]};
`;

export const ChevronIcon = styled.div`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.grayScale[400]};

  svg {
    display: block;
    overflow: visible;
  }
`;
