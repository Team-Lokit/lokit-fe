import styled from '@emotion/styled';

export const Button = styled.button`
  ${({ theme }) => theme.typography.button14Bold};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 8px 0;
  border: 1px dashed ${({ theme }) => theme.colors.text.secondary};
  border-radius: 8px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
