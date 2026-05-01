import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import MenuIcon from '@/assets/images/menu.svg';
import * as S from './AlbumMenu.styles';

interface AlbumMenuProps {
  onRename: () => void;
  onDelete: () => void;
  triggerElement?: React.ReactNode;
}

const AlbumMenu = ({ onRename, onDelete, triggerElement }: AlbumMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const parentEl = wrapperRef.current.closest('[data-album-list-item]');
      const right = parentEl
        ? window.innerWidth - parentEl.getBoundingClientRect().right
        : window.innerWidth - rect.right;
      setDropdownPos({ top: rect.bottom + 4, right });
    }
    setIsOpen((prev) => !prev);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    onRename();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    onDelete();
  };

  return (
    <S.Wrapper ref={wrapperRef} onClick={handleToggle}>
      {triggerElement ?? (
        <S.Button>
          <MenuIcon width={16} height={16} />
        </S.Button>
      )}
      {isOpen &&
        createPortal(
          <>
            <S.Backdrop onClick={handleBackdropClick} />
            <S.Dropdown style={{ top: dropdownPos.top, right: dropdownPos.right }}>
              <S.Item onClick={handleRename}>앨범 이름 변경</S.Item>
              <S.Item variant="danger" onClick={handleDelete}>
                앨범 삭제
              </S.Item>
            </S.Dropdown>
          </>,
          document.body,
        )}
    </S.Wrapper>
  );
};

export default AlbumMenu;
