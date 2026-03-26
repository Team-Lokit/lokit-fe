import { forwardRef } from 'react';
import * as S from './CircleButton.styles';

interface CircleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 아이콘 or 이미지 */
  children: React.ReactNode;
}

const CircleButton = forwardRef<HTMLButtonElement, CircleButtonProps>(
  ({ children, onClick, ...rest }, ref) => {
    return (
      <S.Wrapper ref={ref} type="button" onClick={onClick} {...rest}>
        {children}
      </S.Wrapper>
    );
  },
);

CircleButton.displayName = 'CircleButton';

export default CircleButton;
