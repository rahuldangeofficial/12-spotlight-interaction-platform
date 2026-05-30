import React, { SyntheticEvent, useState, FC } from 'react';
import { StyledButton } from './style';
import { Markdown } from '../ui';

const MAX_CHARACTERS_TO_SHOW = 420;

interface SeeMoreProps {
  children: string;
  maxCharactersToShow?: number;
}

const SeeMore: FC<SeeMoreProps> = ({ children, maxCharactersToShow = MAX_CHARACTERS_TO_SHOW }) => {
  const text = children;
  const [isCollapsed, setIsCollapsed] = useState(text.length > maxCharactersToShow);

  const expandTitle = (e: SyntheticEvent) => {
    e.preventDefault();
    setIsCollapsed(!isCollapsed);
  };

  const displayText = isCollapsed ? `${text.slice(0, maxCharactersToShow)}...` : text;

  return (
    <span>
      <Markdown>{displayText}</Markdown>
      {isCollapsed && (
        <StyledButton ghost onClick={expandTitle}>
          See more
        </StyledButton>
      )}
    </span>
  );
};

export default SeeMore;
