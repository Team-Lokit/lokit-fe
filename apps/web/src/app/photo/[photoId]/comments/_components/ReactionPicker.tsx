import { createPortal } from 'react-dom';
import EmojiPicker, {
  type EmojiClickData,
  SuggestionMode,
  Theme,
} from 'emoji-picker-react';
import koEmojiData from 'emoji-picker-react/dist/data/emojis-ko';
import * as S from './ReactionPicker.styles';

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const ReactionPicker = ({ onSelect, onClose }: ReactionPickerProps) => {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onSelect(emojiData.emoji);
    onClose();
  };

  return createPortal(
    <>
      <S.Overlay onClick={onClose} />
      <S.SheetWrapper>
        <S.HandleBar>
          <div className="handle" />
        </S.HandleBar>

        <S.PickerWrapper>
          <EmojiPicker
            open
            theme={Theme.DARK}
            emojiData={koEmojiData}
            searchPlaceHolder="검색"
            suggestedEmojisMode={SuggestionMode.FREQUENT}
            previewConfig={{ showPreview: false }}
            skinTonesDisabled
            width="100%"
            height="60vh"
            onEmojiClick={handleEmojiClick}
          />
        </S.PickerWrapper>
      </S.SheetWrapper>
    </>,
    modalRoot,
  );
};

export default ReactionPicker;
