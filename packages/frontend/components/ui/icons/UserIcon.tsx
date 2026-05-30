import React, { FC, useContext } from 'react';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import { ThemeContext } from 'styled-components';

interface UserIconProps {
  width?: string;
  color?: string;
}

const UserIcon: FC<UserIconProps> = ({ width, color }) => {
  const theme = useContext(ThemeContext) as any;
  const DEFAULT_WIDTH = '20';
  const DEFAULT_COLOR = theme ? theme.colors.general.textSecondary : '#64676B';

  // Ensure width has units for CSS fontSize
  const size = width ? (isNaN(Number(width)) ? width : `${width}px`) : `${DEFAULT_WIDTH}px`;

  return (
    <PersonOutlined
      style={{
        fontSize: size,
        color: theme ? (theme.colors.general[color] || DEFAULT_COLOR) : DEFAULT_COLOR,
      }}
    />
  );
};

export default UserIcon;
