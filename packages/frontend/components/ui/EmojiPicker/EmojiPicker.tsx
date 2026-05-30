import React, { FC, useState, useRef } from 'react';
import styled from 'styled-components';
import { useClickOutside } from '../../../utils';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
  '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
  '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
  '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳',
  '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️',
  '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤',
  '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱',
  '😨', '😰', '😥', '😓', '🤗', '🤔', '🫣', '🤭',
  '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
  '👍', '👎', '👌', '🤝', '👏', '🙌', '🙏', '✍️',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
  '🔥', '✨', '🎉', '🚀', '💡', '💯', '🌟', '💥'
];

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  align-self: center;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  opacity: 0.7;
  transition: opacity 0.2s;
  outline: none;

  &:hover {
    opacity: 1;
  }
`;

const Popover = styled.div`
  position: absolute;
  bottom: 40px;
  right: 0;
  width: 240px;
  max-height: 200px;
  background-color: ${(p) => p.theme.colors.general.white};
  border: 1px solid ${(p) => p.theme.colors.border.main};
  border-radius: ${(p) => p.theme.radius.sm};
  box-shadow: ${(p) => p.theme.shadows.md};
  padding: 10px;
  z-index: ${(p) => p.theme.zIndex.xl};
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 6px;

  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${(p) => p.theme.colors.grey[30]};
    border-radius: 4px;
  }
`;

const EmojiButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.1s;

  &:hover {
    background-color: ${(p) => p.theme.colors.grey[10]};
  }
`;

const EmojiPicker: FC<EmojiPickerProps> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, isOpen, () => setIsOpen(false));

  const handleEmojiClick = (emoji: string) => {
    onSelect(emoji);
    setIsOpen(false);
  };

  return (
    <Wrapper ref={containerRef}>
      <ToggleButton type="button" onClick={() => setIsOpen(!isOpen)}>
        😊
      </ToggleButton>
      {isOpen && (
        <Popover>
          {EMOJIS.map((emoji, index) => (
            <EmojiButton
              key={index}
              type="button"
              onClick={() => handleEmojiClick(emoji)}
            >
              {emoji}
            </EmojiButton>
          ))}
        </Popover>
      )}
    </Wrapper>
  );
};

export default EmojiPicker;
