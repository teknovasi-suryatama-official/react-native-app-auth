import React, {useState, useCallback, useMemo} from 'react';
import {Alert, Text, View} from 'react-native';
import {
  authorize,
  refresh,
  revoke,
  prefetchConfiguration,
} from 'react-native-app-auth';
import {
  Page,
  Button,
  ButtonContainer,
  Form,
  FormLabel,
  FormValue,
  Heading,
} from './components';
import moment from "moment";

const configs = {
  identityserver: {
    issuer: 'https://demo.duendesoftware.com',
    clientId: 'interactive.public',
    redirectUrl: 'io.identityserver.demo:/oauthredirect',
    additionalParameters: {},
    scopes: ['openid', 'profile', 'email', 'offline_access'],

    // serviceConfiguration: {
    //   authorizationEndpoint: 'https://demo.duendesoftware.com/connect/authorize',
    //   tokenEndpoint: 'https://demo.duendesoftware.com/connect/token',
    //   revocationEndpoint: 'https://demo.duendesoftware.com/connect/revoke'
    // }
  },
  auth0: {
    issuer: 'https://accounts.fitbit.com/login',

    clientId: '23RFP5',
    clientSecret: '3c72a622ee8c73cc24caa063fdf3567f',
    redirectUrl: 'com.goodeva.hub://oauthredirect',
    scopes: [
      'activity',
      'heartrate',
      'location',
      'nutrition',
      'oxygen_saturation',
      'profile',
      'respiratory_rate',
      'settings',
      'sleep',
      'social',
      'temperature',
      'weight',
    ],
    serviceConfiguration: {
      authorizationEndpoint: 'https://www.fitbit.com/oauth2/authorize',
      tokenEndpoint: 'https://api.fitbit.com/oauth2/token',
      revocationEndpoint: 'https://api.fitbit.com/oauth2/revoke',
    },
  },
};

const defaultAuthState = {
  hasLoggedInOnce: false,
  provider: '',
  accessToken: '',
  accessTokenExpirationDate: '',
  refreshToken: '',
};

const App = () => {
  const [authState, setAuthState] = useState(defaultAuthState);
  React.useEffect(() => {
    prefetchConfiguration({
      warmAndPrefetchChrome: true,
      connectionTimeoutSeconds: 5,
      ...configs.auth0,
    });
  }, []);

  const handleAuthorize = useCallback(async provider => {
    try {
      const config = configs[provider];
      const newAuthState = await authorize({
        ...config,
        connectionTimeoutSeconds: 5,
        iosPrefersEphemeralSession: true,
      });

      setAuthState({
        hasLoggedInOnce: true,
        provider: provider,
        ...newAuthState,
      });
    } catch (error) {
      Alert.alert('Failed to log in', error.message);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      const config = configs[authState.provider];
      const newAuthState = await refresh(config, {
        refreshToken: authState.refreshToken,
      });

      setAuthState(current => ({
        ...current,
        ...newAuthState,
        refreshToken: newAuthState.refreshToken || current.refreshToken,
      }));
    } catch (error) {
      Alert.alert('Failed to refresh token', error.message);
    }
  }, [authState]);

  const handleRevoke = useCallback(async () => {
    try {
      const config = configs[authState.provider];
      await revoke(config, {
        tokenToRevoke: authState.accessToken,
        sendClientId: true,
      });

      setAuthState({
        provider: '',
        accessToken: '',
        accessTokenExpirationDate: '',
        refreshToken: '',
      });
    } catch (error) {
      Alert.alert('Failed to revoke token', error.message);
    }
  }, [authState]);

  const showRevoke = useMemo(() => {
    if (authState.accessToken) {
      const config = configs[authState.provider];
      if (config.issuer || config.serviceConfiguration.revocationEndpoint) {
        return true;
      }
    }
    return false;
  }, [authState]);

  const generateDate = (dateGet) => {
    return moment(dateGet).utc().format('dddd, DD MMMM YYYY HH:mm:ss') + ' WIB';
  };

  return (
    <Page>
      {authState.accessToken ? (
        <Form style={{ margin: 10 }}>
          <FormLabel>Access Token :</FormLabel>
          <FormValue>{authState.accessToken}</FormValue>
          <FormLabel>Access Token Expired at :</FormLabel>
          <FormValue>
            {generateDate(authState.accessTokenExpirationDate)}
          </FormValue>
          <FormLabel>Refresh Token</FormLabel>
          <FormValue>{authState.refreshToken}</FormValue>
        </Form>
      ) : (
        <Text
          style={{ marginLeft: 10, marginRight: 10, marginTop: 10, color: '#000' }}
        >
          Good bye!
        </Text>
      )}

      <ButtonContainer>
        {!authState.accessToken ? (
          <Button
            onPress={() => handleAuthorize('auth0')}
            text="Sign in"
            color="#0349fc"
          />
        ) : null}
        {authState.refreshToken ? (
          <Button onPress={handleRefresh} text="Refresh Token" color="#24C2CB" />
        ) : null}
        {showRevoke ? (
          <Button onPress={handleRevoke} text="Sign out" color="#EF525B" />
        ) : null}
      </ButtonContainer>
    </Page>
  );
};

export default App;
