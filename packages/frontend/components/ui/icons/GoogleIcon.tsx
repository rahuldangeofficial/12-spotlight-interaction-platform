import React, { FC, useContext } from 'react';
import Google from '@mui/icons-material/Google';
import { ThemeContext } from 'styled-components';

interface GoogleIconProps {
  width?: string;
  color?: string;
}

const GoogleIcon: FC<GoogleIconProps> = ({ width, color }) => {
  const theme = useContext(ThemeContext) as any;
  const DEFAULT_WIDTH = '20';
  const DEFAULT_COLOR = theme ? theme.colors.general.textSecondary : '#64676B';

  // Ensure width has units for CSS fontSize
  const size = width ? (isNaN(Number(width)) ? width : `${width}px`) : `${DEFAULT_WIDTH}px`;

  return (
    <Google
      style={{
        fontSize: size,
        color: theme ? (theme.colors.general[color] || DEFAULT_COLOR) : DEFAULT_COLOR,
      }}
    />
  );
};

export default GoogleIcon;
