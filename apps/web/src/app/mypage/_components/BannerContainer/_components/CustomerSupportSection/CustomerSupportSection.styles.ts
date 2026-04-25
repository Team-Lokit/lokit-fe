import styled from '@emotion/styled';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
  align-self: stretch;
  padding: 14px 8px 8px 8px;
  border-radius: 16px;
  border: 1px solid rgba(226, 230, 255, 0.1);
  background: ${({ theme }) => theme.colors.blueWhite.bg5};
  backdrop-filter: ${({ theme }) => theme.effects.backdropBlur[40]};
`;

export const SectionTitle = styled.span`
  ${({ theme }) => theme.typography.body14Semibold}
  padding: 0 12px;
  color: ${({ theme }) => theme.colors.gray[200]};
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

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

export const LinkButton = styled.a`
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
  text-decoration: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.blueWhite.bg8};
  }

  p {
    margin: 0;
  }
`;

export const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    overflow: visible;
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
