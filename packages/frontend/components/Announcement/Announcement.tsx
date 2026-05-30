import React, { FC } from 'react';
import { Cookies, setCookie } from '../../utils';

import { Root, StyledButton, Link } from './style';

interface AnnouncementProps {
  setIsAnnouncementOpen: (isOpen: boolean) => void;
}

const Announcement: FC<AnnouncementProps> = ({ setIsAnnouncementOpen }) => {
  const onCloseClick = () => {
    setCookie(Cookies.Announcement_Disabled, 'true');
    setIsAnnouncementOpen(false);
  };

  return (
    <Root>
      <div>
        ✦ Crafted with Precision by {' '}
        <Link href="https://github.com/rahuldangeofficial" target="__blank" rel="noreferrer noopener">
          Rahul Dange
        </Link>{' '}
        ✦
      </div>

      <div>
       
      </div>

      <StyledButton ghost color="white" onClick={onCloseClick}>
        ✕
      </StyledButton>
    </Root>
  );
};

export default Announcement;
