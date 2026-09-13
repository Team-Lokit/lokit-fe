import * as S from './Toggle.styles';

interface ToggleProps {
  /** on/off 여부 */
  checked: boolean;
  /** 상태 변경 핸들러 */
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Toggle = ({ checked, onChange, disabled }: ToggleProps) => {
  return (
    <S.Wrapper checked={checked} disabled={disabled}>
      <S.InputContainer
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <S.Thumb checked={checked} />
    </S.Wrapper>
  );
};

export default Toggle;
