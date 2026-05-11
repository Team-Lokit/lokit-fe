import * as S from './Check.styles';
import CheckIcon from '@/assets/images/check.svg';

interface CheckProps {
  /** 체크 여부 */
  checked: boolean;
  /** 체크박스 상태 변경 핸들러 */
  onChange: (checked: boolean) => void;
}

const Check = ({ checked, onChange }: CheckProps) => {
  return (
    <S.Wrapper checked={checked}>
      <S.InputContainer
        type="checkbox"
        onChange={(e) => onChange(e.target.checked)}
        hidden
      />
      {checked && <CheckIcon />}
    </S.Wrapper>
  );
};

export default Check;
