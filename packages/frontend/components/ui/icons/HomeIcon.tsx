import React, { FC, useContext } from 'react';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import { ThemeContext } from 'styled-components';

interface HomeIconProps {
  width?: string;
  color?: string;
}

const HomeIcon: FC<HomeIconProps> = ({ width, color }) => {
  const theme = useContext(ThemeContext) as any;
  const DEFAULT_WIDTH = '20';
  const DEFAULT_COLOR = theme ? theme.colors.general.textSecondary : '#64676B';

  // Ensure width has units for CSS fontSize
  const size = width ? (isNaN(Number(width)) ? width : `${width}px`) : `${DEFAULT_WIDTH}px`;

  return (
    <HomeOutlined
      style={{
        fontSize: size,
        color: theme ? (theme.colors.general[color] || DEFAULT_COLOR) : DEFAULT_COLOR,
      }}
    />
  );
};

export default HomeIcon;
