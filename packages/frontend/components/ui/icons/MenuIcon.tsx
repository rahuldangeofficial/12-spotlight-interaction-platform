import React, { FC, useContext } from 'react';
import Menu from '@mui/icons-material/Menu';
import { ThemeContext } from 'styled-components';

interface MenuIconProps {
  width?: string;
  color?: string;
}

const MenuIcon: FC<MenuIconProps> = ({ width, color }) => {
  const theme = useContext(ThemeContext) as any;
  const DEFAULT_WIDTH = '20';
  const DEFAULT_COLOR = theme ? theme.colors.general.textSecondary : '#64676B';

  // Ensure width has units for CSS fontSize
  const size = width ? (isNaN(Number(width)) ? width : `${width}px`) : `${DEFAULT_WIDTH}px`;

  return (
    <Menu
      style={{
        fontSize: size,
        color: theme ? (theme.colors.general[color] || DEFAULT_COLOR) : DEFAULT_COLOR,
      }}
    />
  );
};

export default MenuIcon;
