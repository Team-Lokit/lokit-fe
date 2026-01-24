import ChevronLeftIcon from '@/assets/images/chevronLeft.svg';
import { ICON_SIZE } from '../base/Header.constants';
import * as BaseS from '../base/Header.styles';
import HeaderBase from '../base/HeaderBase';
import * as S from './DefaultHeader.styles';

export interface DefaultHeaderProps {
  /** 헤더 타이틀 */
  title: string;
  /** 뒤로가기 버튼 클릭 이벤트 */
  onClickBack: () => void;
  /** 텍스트 버튼 클릭 이벤트 */
  onClickButton?: () => void;
  /** 텍스트 버튼 텍스트 */
  buttonText?: string;
  /** 텍스트 버튼 비활성화 여부 */
  disabled?: boolean;
}

const DefaultHeader = ({
  title,
  onClickBack,
  onClickButton,
  buttonText,
  disabled = false,
}: DefaultHeaderProps) => {
  return (
    <HeaderBase
      transparent
      left={
        <S.IconButton type="button" onClick={onClickBack}>
          <ChevronLeftIcon width={ICON_SIZE} height={ICON_SIZE} />
        </S.IconButton>
      }
      center={<BaseS.Title>{title}</BaseS.Title>}
      right={
        buttonText && (
          <S.TextButton type="button" onClick={onClickButton} disabled={disabled}>
            {buttonText}
          </S.TextButton>
        )
      }
    />
  );
};

export default DefaultHeader;
