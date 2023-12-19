import React, {useState, useCallback, useMemo} from 'react';
import {Alert, Image, Pressable, ScrollView, Text, View} from 'react-native';
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

import logoPamaKecil from './assets/logo_pama_kecil.png';
import logoOpa from './assets/logo_opa_dashboard_hijau.png';
import driver from './assets/driver.png';
import sleep_moon from './assets/sleep.png';
import warning from './assets/warning.png';
import heart_rate from './assets/heart_rate.png';
import pama_transparan_logo from './assets/pama_transparan.png';

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

  return (
    <Page>
      {authState.accessToken ? (
        <View>
          <View>
            {console.info('cekauthkey: ', authState.accessToken)}
            <ScrollView>
                {/* SECTION #1: Logo & Versi */}
                <View
                  style={{ flexDirection: 'row', height: 240, backgroundColor: '#253C7F' }}
                >
                  <View
                    style={{ 
                      flex: 1, margin: 10, marginTop: 20
                    }}
                  >
                    <Image
                      source={logoPamaKecil}
                      style={{width: 30, height: 23, }}
                    />
                  </View>
                  <View
                    style={{ 
                      flex: 1,
                      alignItems: 'center',
                      margin: 10, marginTop: 20
                    }}
                  >
                    <Image
                      source={logoOpa}
                      style={{width: 60, height: 25}}
                    />
                  </View>
                  <View
                    style={{ 
                      flex: 1,
                      alignItems: 'flex-end',
                      margin: 10, marginTop: 20
                    }}
                  >
                    <View
                      style={{ backgroundColor: '#f4ff26', height: 24, borderRadius: 4 }}
                    >
                      <Text style={{ color: '#253C7F', marginTop: 1, paddingLeft: 10, paddingRight: 10, fontWeight: 'bold' }}>v1.0</Text>
                    </View>
                  </View>
                </View>

                {/* SECTION #2: Info User & Shift */}
                <View
                  style={{ marginLeft: 12, marginTop: -170, flexDirection: 'row' }}
                >
                  <Image
                    source={driver}
                    style={{width: 50, height: 50}}
                  />
                  <View
                    style={{ marginLeft: 15 }}
                  >
                    <View>
                      <Text style={{ color: '#fff', marginTop: 1, fontWeight: 'bold', fontSize: 18 }}>Asep Septiadi</Text>
                      <Text style={{ color: '#ffde26', fontWeight: 'bold' }}>Shift 1</Text>
                    </View>
                  </View>
                </View>

                {/* SECTION #3: Card Total Tidur hari ini */}
                <View
                  style={{ backgroundColor: '#fff', shadowColor: '#000', marginLeft: 13, marginTop: 30, marginRight: 13, borderRadius: 5, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, elevation: 4, }}
                >
                  <View style={{ padding: 10, paddingBottom: 0 }}>
                    <View
                      style={{ flexDirection: 'row' }}
                    >
                      <Text style={{ color: '#253C7F', fontWeight: 'bold', fontSize: 16, flex: 1 }}>Total Tidur</Text>
                      <View
                        style={{ flex: 0, backgroundColor: '#253C7F', alignItems: 'center', paddingLeft: 10, paddingRight: 10, borderRadius: 4 }}
                      >
                        <Text style={{ color: '#fff' }}>30 November 2023</Text>
                      </View>
                    </View>
                    <Text style={{ color: '#253C7F', fontSize: 15}}>Data Hari Ini</Text>
                  </View>

                  <View
                    style={{ flexDirection: 'row' }}
                  >
                    <View style={{ padding: 10, paddingTop: 0, flexDirection: 'row', flex: 1 }}>
                      <View
                        style={{ flexDirection: 'row' }}
                      >
                        <Text style={{ color: '#253C7F', fontWeight: 'bold', fontSize: 70 }}>0</Text>
                        <View
                          style={{ justifyContent: 'center' }}
                        >
                          <Text style={{ color: '#253C7F', marginLeft: 5 }}>Jam</Text>
                        </View>
                      </View>
                      <View
                        style={{ flexDirection: 'row', marginLeft: 10 }}
                      >
                        <Text style={{ color: '#253C7F', fontWeight: 'bold', fontSize: 70 }}>0</Text>
                        <View
                          style={{ justifyContent: 'center' }}
                        >
                          <Text style={{ color: '#253C7F', marginLeft: 5 }}>Menit</Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}
                    >
                      <Image
                        source={sleep_moon}
                        style={{width: 60, height: 60, marginRight: 20 }}
                      />
                    </View>
                  </View>

                  {/* SECTION: Total tidur siang dan Malam Hari Ini */}
                  <View
                    style={{ height: 50, backgroundColor: '#253C7F', borderBottomRightRadius: 5, borderBottomLeftRadius: 5 }}
                  >
                    <View
                      style={{ flexDirection: 'row' }}
                    >
                      <View
                        style={{ flex: 1, height: 50, alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Text style={{ color: '#fff' }}>Tidur Siang</Text>
                        <Text style={{ color: '#fff' }}>0 Jam 0 Menit</Text>
                      </View>
                      <View style={{ width: 2, backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }} />
                      <View
                        style={{ flex: 1, height: 50, alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Text style={{ color: '#fff' }}>Tidur Malam</Text>
                        <Text style={{ color: '#fff' }}>0 Jam 0 Menit</Text>
                      </View>
                    </View>
                  </View>
                </View>
                
                {/* SECTION #3: Card Total Tidur Kemarin */}
                <View
                  style={{ backgroundColor: '#fff', shadowColor: '#000', marginLeft: 13, marginTop: 15, marginRight: 13, borderRadius: 5, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, elevation: 4, }}
                >
                  <View style={{ padding: 10, paddingBottom: 0 }}>
                    <View
                      style={{ flexDirection: 'row' }}
                    >
                      <Text style={{ color: '#253C7F', fontWeight: 'bold', fontSize: 16, flex: 1 }}>Total Tidur</Text>
                      <View
                        style={{ flex: 0, backgroundColor: '#253C7F', alignItems: 'center', paddingLeft: 10, paddingRight: 10, borderRadius: 4 }}
                      >
                        <Text style={{ color: '#fff' }}>29 November 2023</Text>
                      </View>
                    </View>
                    <Text style={{ color: '#253C7F', fontSize: 15}}>TIdur Kemarin</Text>
                  </View>

                  <View
                    style={{ flexDirection: 'row' }}
                  >
                    <View style={{ padding: 10, paddingTop: 0, flexDirection: 'row', flex: 1 }}>
                      <View
                        style={{ flexDirection: 'row' }}
                      >
                        <Text style={{ color: '#253C7F', fontWeight: 'bold', fontSize: 70 }}>0</Text>
                        <View
                          style={{ justifyContent: 'center' }}
                        >
                          <Text style={{ color: '#253C7F', marginLeft: 5 }}>Jam</Text>
                        </View>
                      </View>
                      <View
                        style={{ flexDirection: 'row', marginLeft: 10 }}
                      >
                        <Text style={{ color: '#253C7F', fontWeight: 'bold', fontSize: 70 }}>0</Text>
                        <View
                          style={{ justifyContent: 'center' }}
                        >
                          <Text style={{ color: '#253C7F', marginLeft: 5 }}>Menit</Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}
                    >
                      <Image
                        source={sleep_moon}
                        style={{width: 60, height: 60, marginRight: 20 }}
                      />
                    </View>
                  </View>

                  {/* SECTION: Total tidur siang dan Malam Hari Ini */}
                  <View
                    style={{ height: 50, backgroundColor: '#253C7F', borderBottomRightRadius: 5, borderBottomLeftRadius: 5 }}
                  >
                    <View
                      style={{ flexDirection: 'row' }}
                    >
                      <View
                        style={{ flex: 1, height: 50, alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Text style={{ color: '#fff' }}>Tidur Siang</Text>
                        <Text style={{ color: '#fff' }}>0 Jam 0 Menit</Text>
                      </View>
                      <View style={{ width: 2, backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }} />
                      <View
                        style={{ flex: 1, height: 50, alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Text style={{ color: '#fff' }}>Tidur Malam</Text>
                        <Text style={{ color: '#fff' }}>0 Jam 0 Menit</Text>
                      </View>
                    </View>
                  </View>
                </View>
                
                {/* SECTION #3: Waktu Terjaga */}
                <View
                  style={{ backgroundColor: '#fff', shadowColor: '#000', marginLeft: 13, marginTop: 15, marginRight: 13, borderRadius: 5, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, elevation: 4, }}
                >
                  <View style={{ padding: 10, paddingBottom: 0 }}>
                    <View
                      style={{ flexDirection: 'row' }}
                    >
                      <Text style={{ color: '#253C7F', fontWeight: 'bold', fontSize: 16, flex: 1 }}>Waktu Terjaga</Text>
                    </View>
                  </View>

                  <View
                    style={{ flexDirection: 'row' }}
                  >
                    <View style={{ padding: 10, paddingTop: 0, flexDirection: 'row', flex: 1 }}>
                      <View
                        style={{ flexDirection: 'row' }}
                      >
                        <Text style={{ color: '#253C7F', fontWeight: 'bold', fontSize: 70 }}>0</Text>
                        <View
                          style={{ justifyContent: 'center' }}
                        >
                          <Text style={{ color: '#253C7F', marginLeft: 5 }}>Jam</Text>
                        </View>
                      </View>
                      <View
                        style={{ flexDirection: 'row', marginLeft: 10 }}
                      >
                        <Text style={{ color: '#253C7F', fontWeight: 'bold', fontSize: 70 }}>0</Text>
                        <View
                          style={{ justifyContent: 'center' }}
                        >
                          <Text style={{ color: '#253C7F', marginLeft: 5 }}>Menit</Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}
                    >
                      <Image
                        source={warning}
                        style={{width: 60, height: 60, marginRight: 20 }}
                      />
                    </View>
                  </View>
                </View>
                
                {/* SECTION #3: Heart Rate */}
                <View
                  style={{ backgroundColor: '#fff', shadowColor: '#000', marginLeft: 13, marginTop: 15, marginRight: 13, borderRadius: 5, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, elevation: 4 }}
                >
                  <View style={{ padding: 10, paddingBottom: 0 }}>
                    <View
                      style={{ flexDirection: 'row' }}
                    >
                      <Text style={{ color: '#253C7F', fontWeight: 'bold', fontSize: 16, flex: 1 }}>Detak Jantung</Text>
                    </View>
                  </View>

                  <View
                    style={{ flexDirection: 'row' }}
                  >
                    <View style={{ padding: 10, paddingTop: 0, flex: 1 }}>
                      <View
                        style={{ marginTop: 10, flexDirection: 'row' }}
                      >
                        <Text style={{ color: '#253C7F', fontWeight: 'bold' }}>Minimum</Text>
                        <View style={{ width: 13.5 }}></View>
                        <Image
                          source={heart_rate}
                          style={{width: 10, height: 10, marginTop: 5, marginRight: 5 }}
                        />
                        <Text style={{ color: '#253C7F', fontWeight: 'bold' }}>52 bpm</Text>
                      </View>
                      <View
                        style={{ flexDirection: 'row', marginTop: 0 }}
                      >
                        <Text style={{ color: '#253C7F', fontWeight: 'bold' }}>Maximum</Text>
                        <View style={{ width: 10 }}></View>
                        <Image
                          source={heart_rate}
                          style={{width: 10, height: 10, marginTop: 5, marginRight: 5 }}
                        />
                        <Text style={{ color: '#253C7F', fontWeight: 'bold' }}>103 bpm</Text>
                      </View>
                    </View>
                    <View
                      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginLeft: 50, marginTop: -15}}
                    >
                      <Text style={{ fontWeight: 'bold', fontSize: 50, color: '#ed114f' }}>77</Text>
                      <Text style={{ fontWeight: 'bold', color: '#ed114f' }}>bpm</Text>
                    </View>
                    <View
                      style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}
                    >
                      <Image
                        source={heart_rate}
                        style={{width: 60, height: 60, marginRight: 20, marginBottom: 10 }}
                      />
                    </View>
                  </View>
                </View>

                {/* SECTION: Tombol Cuti */}
                <View
                  style={{ backgroundColor: '#e843e8', shadowColor: '#000', marginLeft: 13, marginTop: 15, marginRight: 13, borderRadius: 5, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, elevation: 4, paddingBottom: 13 }}
                >
                  <View style={{ padding: 10, paddingBottom: 0 }}>
                    <View
                      style={{ flexDirection: 'row' }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, flex: 1 }}>Absen Cuti</Text>
                    </View>
                  </View>
                </View>

                {/* SECTION: Tombol Absen Ulang */}
                <View
                  style={{ backgroundColor: '#6e3dff', shadowColor: '#000', marginLeft: 13, marginTop: 10, marginRight: 13, borderRadius: 5, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, elevation: 4, paddingBottom: 13 }}
                >
                  <View style={{ padding: 10, paddingBottom: 0 }}>
                    <View
                      style={{ flexDirection: 'row' }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, flex: 1 }}>Absen Ulang</Text>
                    </View>
                  </View>
                </View>

                {/* SECTION: Sign out */}
                <View
                  style={{ backgroundColor: '#ff3d4a', shadowColor: '#000', marginLeft: 13, marginTop: 10, marginRight: 13, borderRadius: 5, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, elevation: 4, paddingBottom: 13 }}
                >
                  <View style={{ padding: 10, paddingBottom: 0 }}>
                    <View
                      style={{ flexDirection: 'row' }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, flex: 1 }}>Sign Out</Text>
                    </View>
                  </View>
                </View>

                {/* SECTION: Logo Pama Transparant Paling Bawah */}
                <View
                  style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 170, marginTop: 25 }}
                >
                  <Image
                    source={pama_transparan_logo}
                    style={{width: 80, height: 90, marginBottom: 10 }}
                  />
                </View>
            </ScrollView>
          </View>
        </View>
      ) : (
        <View style={{ marginLeft: 10, marginTop: 20 }}>
          <Text style={{ color: '#000', textAlign: 'center' }}>Good bye!</Text>
        </View>
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
