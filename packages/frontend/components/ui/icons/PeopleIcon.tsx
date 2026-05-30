import React, { FC, useContext } from 'react';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import { ThemeContext } from 'styled-components';

interface PeopleIconProps {
  width?: string;
  color?: string;
}

const PeopleIcon: FC<PeopleIconProps> = ({ width, color }) => {
  const theme = useContext(ThemeContext) as any;
  const DEFAULT_WIDTH = '20';
  const DEFAULT_COLOR = theme ? theme.colors.general.textSecondary : '#64676B';

  // Ensure width has units for CSS fontSize
  const size = width ? (isNaN(Number(width)) ? width : `${width}px`) : `${DEFAULT_WIDTH}px`;

  return (
    <PeopleOutlined
      style={{
        fontSize: size,
        color: theme ? (theme.colors.general[color] || DEFAULT_COLOR) : DEFAULT_COLOR,
      }}
    />
  );
};

export default PeopleIcon;
