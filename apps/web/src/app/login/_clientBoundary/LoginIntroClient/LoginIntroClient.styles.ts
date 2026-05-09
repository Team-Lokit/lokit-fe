import styled from '@emotion/styled';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

export const Title = styled.h1`
  ${({ theme }) => theme.typography.heading24Bold}
  color: ${({ theme }) => theme.colors.gray[100]};
  text-align: center;
`;

export const MainText = styled.span`
  background: var(--Gradient-mint, linear-gradient(180deg, #d5fffd 0%, #6eeae4 100%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 154px;

  img {
    display: block;
    width: 100%;
    height: auto;
  }

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 100vw;
    height: 40px;
    transform: translateX(-50%);
    background: linear-gradient(180deg, rgba(15, 16, 20, 0) 0%, #0f1014 100%);
    pointer-events: none;
  }
`;
