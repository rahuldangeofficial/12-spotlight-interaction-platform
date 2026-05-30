import React, { FC, useContext } from 'react';
import PushPinOutlined from '@mui/icons-material/PushPinOutlined';
import { ThemeContext } from 'styled-components';

interface PinnedIconProps {
  width?: string;
  color?: string;
}

const PinnedIcon: FC<PinnedIconProps> = ({ width, color }) => {
  const theme = useContext(ThemeContext) as any;
  const DEFAULT_WIDTH = '20';
  const DEFAULT_COLOR = theme ? theme.colors.general.textSecondary : '#64676B';

  // Ensure width has units for CSS fontSize
  const size = width ? (isNaN(Number(width)) ? width : `${width}px`) : `${DEFAULT_WIDTH}px`;

  return (
    <PushPinOutlined
      style={{
        fontSize: size,
        color: theme ? (theme.colors.general[color] || DEFAULT_COLOR) : DEFAULT_COLOR,
      }}
    />
  );
};

export default PinnedIcon;
