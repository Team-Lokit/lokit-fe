import styled from '@emotion/styled';

export const InputRow = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  /* Modal.Content gap(12px)과 합쳐 버튼 영역까지 24px (피그마 기준) */
  margin-bottom: 12px;
`;

export const InputBlock = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 0;
  padding: 10px 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.blueWhiteOpacity.bg5};
`;

export const Input = styled.input<{ $charCount: number }>`
  ${({ theme }) => theme.typography.body16Regular};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.grayScale[100]};
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  text-align: right;
  width: ${({ $charCount }) => $charCount}ch;

  &:placeholder-shown {
    text-align: center;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.grayScale[400]};
  }
`;

export const Suffix = styled.span`
  ${({ theme }) => theme.typography.body16Regular};
  color: ${({ theme }) => theme.colors.grayScale[100]};
`;
