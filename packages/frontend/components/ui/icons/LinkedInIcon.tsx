import React, { FC, useContext } from 'react';
import LinkedIn from '@mui/icons-material/LinkedIn';
import { ThemeContext } from 'styled-components';

interface LinkedInIconProps {
  width?: string;
  color?: string;
}

const LinkedInIcon: FC<LinkedInIconProps> = ({ width, color }) => {
  const theme = useContext(ThemeContext) as any;
  const DEFAULT_WIDTH = '20';
  const DEFAULT_COLOR = theme ? theme.colors.general.textSecondary : '#64676B';

  // Ensure width has units for CSS fontSize
  const size = width ? (isNaN(Number(width)) ? width : `${width}px`) : `${DEFAULT_WIDTH}px`;

  return (
    <LinkedIn
      style={{
        fontSize: size,
        color: theme ? (theme.colors.general[color] || DEFAULT_COLOR) : DEFAULT_COLOR,
      }}
    />
  );
};

export default LinkedInIcon;
