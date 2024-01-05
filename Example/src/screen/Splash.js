import { Text, View } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const Splash = ({ navigation }) => {

  const isFocused = useIsFocused();

  const setGlobalData = async () => {
    const accessToken = await AsyncStorage.getItem('LOGING-FITBIT');
    const parseToJSON = JSON.parse(accessToken);
    // console.info('SPLASH: ');
    // console.log(JSON.stringify(parseToJSON, null, ' '));

    setTimeout(() => {
      if (parseToJSON?.accessToken) {
        navigation.navigate('Home');
      } else {
        navigation.navigate('Homepage');
      }
    }, 1500);
  };

  useEffect(() => {
    setGlobalData();
  }, [isFocused]);

  return (
    <View style={{ backgroundColor: '#1d2463', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 30, fontFamily: 'Helvetica' }}>Smartsafety</Text>
    </View>
  )
}

export default Splash;