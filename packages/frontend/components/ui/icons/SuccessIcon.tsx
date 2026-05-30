import React, { FC, useContext } from 'react';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import { ThemeContext } from 'styled-components';

interface SuccessIconProps {
  width?: string;
  color?: string;
}

const SuccessIcon: FC<SuccessIconProps> = ({ width, color }) => {
  const theme = useContext(ThemeContext) as any;
  const DEFAULT_WIDTH = '20';
  const DEFAULT_COLOR = theme ? theme.colors.general.textSecondary : '#64676B';

  // Ensure width has units for CSS fontSize
  const size = width ? (isNaN(Number(width)) ? width : `${width}px`) : `${DEFAULT_WIDTH}px`;

  return (
    <CheckCircleOutlined
      style={{
        fontSize: size,
        color: theme ? (theme.colors.general[color] || DEFAULT_COLOR) : DEFAULT_COLOR,
      }}
    />
  );
};

export default SuccessIcon;
