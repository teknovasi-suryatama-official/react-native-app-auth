import {
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  Image
} from 'react-native';
import React, { 
  useCallback,
} from 'react';
import {
  authorize,
  prefetchConfiguration,
} from 'react-native-app-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

import goodeva from '../../assets/goodeva.png';
import spo2 from '../../assets/spo2.png';

const configs = {
  auth0: {
    issuer: 'https://accounts.fitbit.com/login',

    clientId: '23RQR8',
    clientSecret: '10b1f3fd2c4f00272e324c9faac882ef',
    redirectUrl: 'com.goodeva.smartsafety://oauthredirect',
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

const Login = ({navigation}) => {

  // 01 - HANDLE AUTHORIZE TO GET TOKEN ACCESS ---------------------||>
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

      try {
        const jsonValue = JSON.stringify(newAuthState);
        await AsyncStorage.setItem('LOGING-FITBIT', jsonValue);
        navigation.navigate('Home');
      } catch (e) {
        console.log('AUTORIZE-SAFE-RESPONSE-CATCH: ', e.message);
      }
    } catch (error) {
      console.info('AUTORIZE ERROR: ', error.message);
    }
  }, []);

  const actionOAuth = () => {
    handleAuthorize('auth0');
  };

  const goToHome = () => {
    navigation.navigate('Homepage');
  };

  const showContentHasNoAccess = () => {
    return (
      <>
        <SafeAreaView
          style={{ backgroundColor: 'white', height: 900, justifyContent: 'top', }}
        >
          <View style={{ paddingLeft: 15, backgroundColor: 'white', paddingRight: 15, marginTop: 20 }}>
            <Text style={{ textAlign: 'center', marginBottom: -5, fontWeight: 'bold', fontSize: 30, color: '#000' }}>
              Goodeva Technology
            </Text>
            <Text
              style={{ textAlign: 'center', marginBottom: 150, fontSize: 15, color: '#6a736c' }}
            >
              Deliver more than requirement
            </Text>

            <View style={{ alignItems: 'center', marginBottom: 150 }}>
              <Image
                  source={goodeva}
                  style={{width: 100, height: 100}}
                />
            </View>
            <TouchableOpacity
              style={[styles.buttonPrimary, { backgroundColor: '#fc0349' }]} 
              onPress={actionOAuth}
            >
              <Text style={styles.textButtonLight}>Signin with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonPrimary, { backgroundColor: '#3246a8', marginTop: 10 }]} 
              onPress={goToHome}
            >
              <Text style={styles.textButtonLight}>Go To Home</Text>
            </TouchableOpacity>
            <Text
              style={{ textAlign: 'center', marginBottom: 0, fontSize: 15, marginTop: 210, color: '#968388' }}
            >
             PT. Goodeva Merdeka Teknologi
            </Text>
            <Text
              style={{ textAlign: 'center', marginBottom: 0, fontSize: 10, marginTop: 5, color: '#b5aeb0' }}
            >
             Powered by FitBit
            </Text>
          </View>
        </SafeAreaView>
      </>
    )
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {showContentHasNoAccess()}
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
    container: {
      padding: 0,
      backgroundColor: '#f2eded'
    },
    textInputBasic: {
      height: 40, 
      fontWeight: 'bold',
      borderWidth: 1.5, 
      marginBottom: 10, 
      paddingLeft: 20, 
      paddingRight: 20,
      borderRadius: 5,
      borderColor: '#c0c6cf',
      color: 'black',
    },
    buttonPrimary: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
    },
    textButtonLight: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
  });

export default Login;