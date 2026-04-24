import styled from '@emotion/styled';

export const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 12px;
  background: none;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.blueWhite.bg8};
  }

  p {
    margin: 0;
  }
`;

export const ButtonText = styled.p`
  flex: 1;
  min-width: 0;
  ${({ theme }) => theme.typography.body16Medium}
  color: ${({ theme }) => theme.colors.gray[200]};
  text-align: left;
`;

export const ChevronIcon = styled.div`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.gray[400]};

  svg {
    display: block;
    overflow: visible;
  }
`;

export const Title = styled.h2`
  ${({ theme }) => theme.typography.heading18Bold};
  color: ${({ theme }) => theme.colors.gray[100]};
  text-align: center;
  margin-bottom: 12px;
`;
