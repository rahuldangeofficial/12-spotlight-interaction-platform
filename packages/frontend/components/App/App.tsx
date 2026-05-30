import { FC, ReactNode, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUserNotification, removeUserNotification } from '../../store/auth';
import { RootState } from '../../store';
import { Events, DefaultCommunity } from '../../constants';

import { Alert, GlobalStyle, Loading } from '../ui';
import { useAuth, useFetchSettings, useSocket } from '../../utils';
import currentTheme, { Theme, darkColors } from '../../theme';

interface AppProps {
  children: ReactNode;
  setTheme: (theme?: Theme) => void;
}

const App: FC<AppProps> = ({ children, setTheme }) => {
  const notification = useSelector((state: RootState) => state.notification);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();
  const { authError, isAuthFetching } = useAuth();
  const { isSettingsFetching } = useFetchSettings();
  const socket = useSocket();

  useEffect(() => {
    const updatedTheme = JSON.parse(JSON.stringify(currentTheme));
    if (settings.themeMode === 'dark') {
      updatedTheme.colors = {
        ...updatedTheme.colors,
        ...darkColors,
        general: {
          ...updatedTheme.colors.general,
          ...darkColors.general,
          primary: settings.primaryColor || DefaultCommunity.primaryColor,
        },
      };
    } else {
      updatedTheme.colors.general.primary = settings.primaryColor || DefaultCommunity.primaryColor;
    }
    setTheme(updatedTheme);
  }, [settings.themeMode, settings.primaryColor, setTheme]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const createNotificationListener = (data) => {
      if (!authUser) return;
      if (data.user !== authUser._id) return;
      const exists = authUser.notifications.some((n) => n._id === data._id);
      if (!exists) {
        dispatch(addUserNotification(data));
      }
    };

    const deleteNotificationListener = (data) => {
      if (!authUser) return;
      if (data.user !== authUser._id) return;
      const exists = authUser.notifications.some((n) => n._id === data._id);
      if (exists) {
        dispatch(removeUserNotification(data._id));
      }
    };

    socket.on(Events.CREATE_NOTIFICATION_REQUEST, createNotificationListener);
    socket.on(Events.DELETE_NOTIFICATION_REQUEST, deleteNotificationListener);

    return () => {
      socket.off(Events.CREATE_NOTIFICATION_REQUEST, createNotificationListener);
      socket.off(Events.DELETE_NOTIFICATION_REQUEST, deleteNotificationListener);
    };
  }, [authUser, dispatch, socket]);

  if (isAuthFetching || isSettingsFetching) return <Loading top="md" />;
  if (authError) {
    const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
    if (isDevelopment) {
      console.error(authError);
    }
    const devErrorMessage =
      'Sorry, something went wrong. Please open the browser console to view the detailed error message.';
    const prodErrorMessage = "Sorry, something went wrong. We're working on getting this fixed as soon as we can.";
    return <div>{isDevelopment ? devErrorMessage : prodErrorMessage}</div>;
  }

  return (
    <>
      {children}

      <GlobalStyle />

      {notification.message && (
        <Alert autoClose={notification.autoClose} alignment={notification.alignment} type={notification.type}>
          {notification.message}
        </Alert>
      )}
    </>
  );
};

export default App;
