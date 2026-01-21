'use client';

import { useState, ChangeEvent } from 'react';
import * as S from './Input.styles';
import { DEFAULT_MAX_LENGTH, INPUT_TYPE, InputType } from './Input.constants';

interface InputProps {
  /** 인풋 타입 */
  type?: InputType;
  /** 인풋 name */
  name: string;
  /** placeholder */
  placeholder?: string;
  /** onChange 핸들러 */
  onChange: (value: string) => void;
  /** 최대 글자 수 */
  max?: number;
  /** 에러 상태 */
  isError?: boolean;
  /** 에러 메시지 */
  errorMessage?: string;
}

const Input = ({
  type = INPUT_TYPE.INPUT,
  name,
  placeholder = '',
  onChange,
  max = DEFAULT_MAX_LENGTH,
  isError = false,
  errorMessage = '',
}: InputProps) => {
  const [value, setValue] = useState('');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    if (newValue.length <= max) {
      setValue(newValue);
      onChange(newValue);
    }
  };

  const handleReset = () => {
    setValue('');
    onChange('');
  };

  const renderInput = () => {
    if (type === INPUT_TYPE.TEXTAREA) {
      return (
        <S.TextAreaWrapper isError={isError}>
          <S.StyledTextArea
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
          />
          <S.TextAreaFooter>
            <S.CharCount>
              {value.length}/{max}
            </S.CharCount>
          </S.TextAreaFooter>
        </S.TextAreaWrapper>
      );
    }

    return (
      <S.InputWrapper isError={isError}>
        {type === INPUT_TYPE.SEARCH && <S.SearchIcon />}
        <S.StyledInput
          id={name}
          name={name}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
        <S.CharCount>
          {value.length}/{max}
        </S.CharCount>
        {value.length > 0 && (
          <S.ResetButton onClick={handleReset} type="button">
            <S.ResetIcon />
          </S.ResetButton>
        )}
      </S.InputWrapper>
    );
  };

  return (
    <S.Container>
      {renderInput()}
      {isError && errorMessage && (
        <S.ErrorMessage>{errorMessage}</S.ErrorMessage>
      )}
    </S.Container>
  );
};

export default Input;
