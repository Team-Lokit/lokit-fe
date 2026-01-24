'use client';

import { ChangeEvent } from 'react';
import * as S from './Textarea.styles';

const DEFAULT_MAX_LENGTH = 1000;

interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  /** textarea 값 */
  value: string;
  /** onChange 핸들러 */
  onChange: (value: string) => void;
  /** 최대 글자 수 */
  max?: number;
  /** 에러 상태 */
  isError?: boolean;
  /** 에러 메시지 */
  errorMessage?: string;
}

const Textarea = ({
  value,
  onChange,
  max = DEFAULT_MAX_LENGTH,
  isError = false,
  errorMessage = '',
  ...rest
}: TextareaProps) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= max) {
      onChange(newValue);
    }
  };

  return (
    <S.Container>
      <S.TextareaWrapper isError={isError}>
        <S.StyledTextarea {...rest} value={value} onChange={handleChange} />
        <S.TextareaFooter>
          <S.CharCount>
            {value.length}/{max}
          </S.CharCount>
        </S.TextareaFooter>
      </S.TextareaWrapper>
      {isError && errorMessage && (
        <S.ErrorMessage>{errorMessage}</S.ErrorMessage>
      )}
    </S.Container>
  );
};

export default Textarea;
