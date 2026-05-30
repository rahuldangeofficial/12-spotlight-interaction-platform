import axios from 'axios';
import theme, { Theme } from '../theme';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCommunityName,
  setCommunityLogo,
  setPrimaryColor,
  setCommunityLogoPublicId,
  setIsEmailVerificationRequired,
  setFacebookLoginEnabled,
  setGoogleLoginEnabled,
  setGithubLoginEnabled,
} from '../store/settings';
import { RootState } from '../store';

interface useFetchSettingsPayload {
  isSettingsFetching: boolean;
}

const useFetchSettings = (): useFetchSettingsPayload => {
  const dispatch = useDispatch();
  const [isSettingsFetching, setIsSettingsFetching] = useState(true);
  const [values, setValues] = useState({
    communityLogo: null,
    communityName: null,
    primaryColor: null,
    communityLogoPublicId: null,
    isEmailVerificationRequired: null,
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get('/settings');
        const {
          communityLogo,
          communityName,
          primaryColor,
          communityLogoPublicId,
          isEmailVerificationRequired,
          facebookLoginEnabled,
          googleLoginEnabled,
          githubLoginEnabled,
        } = data;
        setValues({
          communityLogo,
          communityName,
          primaryColor,
          communityLogoPublicId,
          isEmailVerificationRequired,
        });

        if (!communityLogo && !communityName && !primaryColor) {
          return;
        }

        if (primaryColor) {
          dispatch(setPrimaryColor(primaryColor));
        }

        if (communityName) {
          dispatch(setCommunityName(communityName));
        }

        if (communityLogo) {
          dispatch(setCommunityLogo(communityLogo));
        }

        if (communityLogoPublicId) {
          dispatch(setCommunityLogoPublicId(communityLogoPublicId));
        }

        if (typeof isEmailVerificationRequired == 'boolean') {
          dispatch(setIsEmailVerificationRequired(isEmailVerificationRequired));
        }

        if (typeof facebookLoginEnabled === 'boolean') {
          dispatch(setFacebookLoginEnabled(facebookLoginEnabled));
        }

        if (typeof googleLoginEnabled === 'boolean') {
          dispatch(setGoogleLoginEnabled(googleLoginEnabled));
        }

        if (typeof githubLoginEnabled === 'boolean') {
          dispatch(setGithubLoginEnabled(githubLoginEnabled));
        }
      } catch (error) {
        console.log('Fetching settings failed: ', error);
      } finally {
        setIsSettingsFetching(false);
      }
    };

    fetch();
  }, [dispatch]);

  return { isSettingsFetching, ...values };
};

export default useFetchSettings;
