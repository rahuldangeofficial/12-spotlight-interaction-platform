import { FC, FormEvent, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useMutation } from 'react-query';
import styled from 'styled-components';
import { RootState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Divider, H2, InputText, Spacing, Text, Toggle, P } from '../../ui';
import { AlertTypes, openAlert } from '../../../store/alert';
import { setAuthUser } from '../../../store/auth';

const LabelAndToggle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

interface AccountSettings {
  fullName: string;
  username: string;
  emailPreferences?: {
    messages: boolean;
    comments: boolean;
  };
}

const updateAccountSettings = async (settings: AccountSettings) => {
  const updatedSettings = await axios.put('/settings/update-user', settings);
  return updatedSettings.data;
};

const SettingsAccount: FC = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [apiError, setApiError] = useState('');
  const [formTouched, setFormTouched] = useState(false);

  const [values, setValues] = useState({
    fullName: authUser.fullName,
    username: authUser.username || '',
    emailPreferences: {
      messages: authUser.emailPreferences?.messages !== false,
      comments: authUser.emailPreferences?.comments !== false,
    },
  });
  const [errors, setErrors] = useState({
    fullName: null,
    username: null,
  });
  const { mutateAsync, isLoading } = useMutation(updateAccountSettings);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setApiError('');
    try {
      await mutateAsync({
        fullName: values.fullName,
        username: values.username,
        emailPreferences: values.emailPreferences,
      });
      dispatch(
        setAuthUser({
          ...authUser,
          fullName: values.fullName,
          username: values.username,
          emailPreferences: values.emailPreferences,
        })
      );
      dispatch(
        openAlert({
          type: AlertTypes.Success,
          message: 'Profile updated successfully.',
        })
      );
    } catch (error) {
      console.log('An error occurred while updating your profile: ', error);
      setApiError(error.response.data);
    }
  };

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    if (!formTouched) {
      setFormTouched(true);
    }
    const { name, value, checked } = e.target as HTMLInputElement;
    if (name === 'emailMessages' || name === 'emailComments') {
      setValues({
        ...values,
        emailPreferences: {
          ...values.emailPreferences,
          messages: name === 'emailMessages' ? checked : values.emailPreferences.messages,
          comments: name === 'emailComments' ? checked : values.emailPreferences.comments,
        },
      });
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  const validateFullName = useCallback(() => {
    if (values.fullName === '') {
      setErrors((prevErrors) => ({ ...prevErrors, fullName: 'Full name is a required field.' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, fullName: null }));
    }
  }, [values.fullName]);

  const validateUsername = useCallback(() => {
    if (values.username === '') {
      setErrors((prevErrors) => ({ ...prevErrors, username: 'Username is a required field.' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, username: null }));
    }
  }, [values.username]);

  useEffect(() => {
    validateFullName();
    validateUsername();
  }, [validateFullName, validateUsername]);

  return (
    <div>
      <H2>Account Settings</H2>
      <Divider spacing="sm" />

      <form onSubmit={onSubmit}>
        <Spacing top="md" />
        <InputText
          name="fullName"
          label="Full name"
          description="Example: John doe"
          value={values.fullName}
          error={errors.fullName}
          onChange={onChange}
        />

        <Spacing top="md" />

        <InputText
          name="username"
          label="Username"
          description="Example: john"
          value={values.username}
          error={formTouched && errors.username}
          onChange={onChange}
        />

        <Spacing top="lg" />
        <P weight="bold">Email Notification Settings</P>
        <Divider spacing="xs" />

        <Spacing top="md" />
        <LabelAndToggle>
          <div>
            <P weight="bold">Message Notifications</P>
            <Spacing top="xs">
              <P color="textSecondary">Receive email notifications for new private messages.</P>
            </Spacing>
          </div>
          <Toggle name="emailMessages" checked={values.emailPreferences.messages} onChange={onChange} />
        </LabelAndToggle>

        <Spacing top="md" />
        <LabelAndToggle>
          <div>
            <P weight="bold">Comment Notifications</P>
            <Spacing top="xs">
              <P color="textSecondary">Receive email notifications when someone comments on your posts.</P>
            </Spacing>
          </div>
          <Toggle name="emailComments" checked={values.emailPreferences.comments} onChange={onChange} />
        </LabelAndToggle>

        <Spacing top="md" bottom="md">
          {apiError && <Text color="error">{apiError}</Text>}
        </Spacing>

        <Button color="primary" type="submit" disabled={errors.fullName || errors.username || isLoading}>
          Save changes
        </Button>
      </form>
    </div>
  );
};

export default SettingsAccount;
