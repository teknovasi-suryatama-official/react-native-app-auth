import { Alert, Dimensions, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, Grid, XAxis } from 'react-native-svg-charts';
import moment from 'moment';

import FitBitServer from '../../../servers/FitBitServer';
import GoodevaServer from '../../../servers/GoodevaServer';

import {
  refresh,
  revoke,
} from 'react-native-app-auth';

import logoPamaKecil from '../../../assets/logo_pama_kecil.png';
import logoOpa from '.../../../assets/logo_opa_dashboard_hijau.png';
import sleep_moon from '../../../assets/night.png';
import heart_rate from '../../../assets/heart_rate.png';
import pama_transparan_logo from '../../../assets/pama_transparan.png';
import oksigen from '../../../assets/o2.png';
import spo2 from '../../../assets/spo2.png';
import profile1 from '../../../assets/profile_1.png';
import gdv_icon from '../../../assets/gdv_icon_tp.png';
import { parseJSON } from 'date-fns';

const configs = {
  auth0: {
    issuer: 'https://accounts.fitbit.com/login',

    clientId: '23RQR8',
    clientSecret: '10b1f3fd2c4f00272e324c9faac882ef',
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

const Home = ({navigation}) => {

  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Harap tunggu beberapa saat...');

  const [dataProfile, setDataProfile] = useState('');
  const [loop, setLoop] = useState(0);

  const [dateTodayYd, setDateTodayYd] = useState({
    dateToday: '',
    dateYesterday: ''
  });

  const [dataDevice, setDataDevice] = useState({
    battery: '',
    batteryLevel: 0,
    deviceVersion: '',
    id: '',
    lastSyncTime: '',
    mac: '',
    type: ''
  });

  const [form, setForm] = useState({
    hasLoggedInOnce: false,
    provider: '',
    accessToken: '',
    accessTokenExpirationDate: '',
    refreshToken: '',
  });

  const removeData = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Splash');
  };

  /**
   * FUNCTIONS HOME -------------------------------------------------||>
   **/

  const convertTime = (dateToConvert) => {
    var date = moment(dateToConvert)
    .utcOffset('+07:00')
    .format('DD MMMM yyy - HH:mm')

    return date + ' WIB';
  };

  const getDataDashboard = async (id_user, date_get) => { 
    const reqoptUser = { 
      method: 'POST', 
      headers: 
      { 
        'Content-Type': 'application/json' 
      }, 
      body: JSON.stringify(
        { 
          date: date_get,
          id_user_fitbit: id_user,
        }
      ) 
  }; 

  try { 
      await fetch( 
          'https://dev4.goodeva.gss-login.com/api/get-sleep-user-fitbit', reqoptUser) 
          .then(response => { 
              response.json() 
                  .then(data => { 
                      setDataProfile(current =>  ({
                        ...current,
                        total_jam_tidur_td: data?.sleep_data?.total_jam,
                        total_menit_tidur_td: data?.sleep_data?.total_menit,

                        mulai_tidur_td: data?.sleep_data?.start_sleep,
                        selesai_tidur_td: data?.sleep_data?.stop_sleep
                      }));
                  }); 
          }) 
  } 
  catch (error) { 
      console.error(error); 
  } 
};

  const requestUpdateData = async (data_for_update) => { 
        const reqoptUser = { 
          method: 'POST', 
          headers: 
          { 
            'Content-Type': 'application/json' 
          }, 
          body: JSON.stringify(
            { 
              id_user_fitbit: data_for_update?.id_user_fitbit,
              token_access_fitbit: data_for_update?.token_access_fitbit,
              refresh_token_fitbit: data_for_update?.refresh_token_fitbit,

              mac_address_fitbit: data_for_update?.mac_address_fitbit,
              id_gelang_fitbit: data_for_update?.id_gelang_fitbit,
              battery_fitbit: data_for_update?.battery_level_fitbit,
              device_fitbit: data_for_update?.device_fitbit,
              type_fitbit: data_for_update?.type_fitbit,
            }
          ) 
      }; 

      try {
          await fetch( 
              'https://dev4.goodeva.gss-login.com/api/update-user-fitbit', reqoptUser) 
              .then(response => { 
                  response.json() 
                      .then(data => { 
                          setDataProfile(current =>  ({
                            ...current,
                            email_account: data?.data_user_fitbit?.email,
                            device_account: data?.data_user_fitbit?.device_fitbit,
                            battery_level: data?.data_user_fitbit?.battery_fitbit,
                            mac_address_device: data?.data_user_fitbit?.mac_address_fitbit,
                          }));
                          
                          setTimeout(async () => {
                            setIsLoading(false);

                            const dataDeviceFitBit = await AsyncStorage.getItem('GET_DATA_DEVICE_BY_FITBIT');
                            console.log('DATA_DEVICE');
                            console.info(JSON.stringify(dataDeviceFitBit, null, ' '))

                            if (dataDeviceFitBit === null) {

                              getDataDevice(dataProfile?.id_user_fitbit, dataProfile?.token_access_fitbit);

                              const checkOtorisasi = await AsyncStorage.getItem('LOGING-FITBIT');
                              const parseToJSON = JSON.parse(checkOtorisasi);
                          
                              const getTokenAccess = parseToJSON?.accessToken;
                              const getRefreshToken = parseToJSON?.refreshToken;
                              const getAccessTokenExpired = parseToJSON?.accessTokenExpirationDate;
                              const idUserFitBit = parseToJSON?.tokenAdditionalParameters?.user_id;
                              const getTokenType = parseToJSON?.tokenType;
                          
                              const dataArray = {
                                tknAccess: getTokenAccess,
                                tknRefresh: getRefreshToken,
                                tknExpired: getAccessTokenExpired,
                                usrID: idUserFitBit,
                                tknType: getTokenType
                              }

                              loadingMessageTimlaps(dataArray);
                            }
                          }, 1500);
                      }); 
              }) 
      } 
      catch (error) { 
          console.error(error); 
      } 
  };

  const getDataDevice = (id_user, token) => {
    console.info('cekTOKEN: ', token);
    try {
      fetch('https://api.fitbit.com/1/user/' + id_user + '/devices.json', {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token}
      })
      .then(response => response.json()) 
      .then(async json => 
        {
          try {
            console.info('cekdata: ', json)
            for (let i = 0; i < json.length; i++) {
              if (json[i]?.deviceVersion !== 'MobileTrack') {
                const jsonValue = JSON.stringify(json[i]);
                await AsyncStorage.setItem('GET_DATA_DEVICE_BY_FITBIT', jsonValue);

                setDataDevice({
                  battery: json[i]?.battery,
                  batteryLevel: json[i]?.batteryLevel,
                  deviceVersion: json[i]?.deviceVersion,
                  id: json[i]?.id,
                  lastSyncTime: json[i]?.lastSyncTime,
                  mac: json[i]?.mac,
                  type: json[i]?.type
                });
              }
            }
          } catch (e) {
            console.log('getDataDevice > Catch : ', e.message);
          }
        }
      );
    } catch (error) {
      console.info('getDataDevice > Error: ', error.message);
    }
  };

  const requestDataAccountFitBit = (token) => {
    try {
      fetch('https://api.fitbit.com/1/user/-/profile.json', {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token}
      })
      .then(response => response.json()) 
      .then(async json => 
        {
          try {
            const jsonValue = JSON.stringify(json);
            await AsyncStorage.setItem('GET_DATA_PROFILE_FITBIT', jsonValue);
          } catch (e) {
            console.log('requestDataAccountFitBit > Catch : ', e.message);
          }
        }
      );
    } catch (error) {
      console.info('requestDataAccountFitBit > Error: ', error.message);
    }
  };

  const loadingMessageTimlaps = (token_access) => {
    // STEP 1
    setTimeout(async () => {
      console.log('1');
      setLoadingMessage('Konfigurasi data penyimpanan lokal...');

      // STEP 2
      setTimeout(async () => {
        console.log('2');
        const dataProfileFitBit = await AsyncStorage.getItem('GET_DATA_PROFILE_FITBIT');

        if (dataProfileFitBit === null || dataProfileFitBit === undefined) {
    
          console.log('Data tidak ada, request ulang, dan sedang mencoba lagi...');
  
          requestDataAccountFitBit(token_access?.tknAccess);
          loadingMessageTimlaps(token_access?.tknAccess);
        } else {
          const parsingDataProfileFitBit = JSON.parse(dataProfileFitBit);
  
          if (parsingDataProfileFitBit?.errors) {
            console.info('Response error system, request ulang, dan sedang mencoba lagi...');

            const checkOtorisasi = await AsyncStorage.getItem('LOGING-FITBIT');
            const parseToJSON = JSON.parse(checkOtorisasi);
        
            const getTokenAccess = parseToJSON?.accessToken;
            const getRefreshToken = parseToJSON?.refreshToken;
            const getAccessTokenExpired = parseToJSON?.accessTokenExpirationDate;
            const idUserFitBit = parseToJSON?.tokenAdditionalParameters?.user_id;
            const getTokenType = parseToJSON?.tokenType;
        
            const dataArray = {
              tknAccess: getTokenAccess,
              tknRefresh: getRefreshToken,
              tknExpired: getAccessTokenExpired,
              usrID: idUserFitBit,
              tknType: getTokenType
            }
  
            requestDataAccountFitBit(getTokenAccess);
            loadingMessageTimlaps(dataArray);
          } else {
            console.info('Data already exist');
            setLoadingMessage('Penyiapan data Akun Anda...');

            const dataDeviceByFitBit = await AsyncStorage.getItem('GET_DATA_DEVICE_BY_FITBIT');
            const parseToJSON = JSON.parse(dataDeviceByFitBit);

            const todayDate = moment().format('yyyy-MM-DD');
            getDataDashboard(parsingDataProfileFitBit?.user?.encodedId, todayDate);

            getDataDevice(parsingDataProfileFitBit?.user?.encodedId, token_access?.tknAccess);

            const dataArrayProfileFitBit = {
              id_user_fitbit: parsingDataProfileFitBit?.user?.encodedId,
              token_access_fitbit: token_access?.tknAccess,
              refresh_token_fitbit: token_access?.tknRefresh,
              expired_token_date: token_access?.tknExpired,

              display_name: parsingDataProfileFitBit?.user?.displayName,
              date_birth: parsingDataProfileFitBit?.user?.dateOfBirth,
              member_since: parsingDataProfileFitBit?.user?.memberSince,
              tracking_level: parsingDataProfileFitBit?.user?.sleepTracking,
              time_zone:  parsingDataProfileFitBit?.user?.timezone,

              mac_address_fitbit: parseToJSON?.mac,
              id_gelang_fitbit: parseToJSON?.id,
              battery_fitbit: parseToJSON?.battery,
              battery_level_fitbit: parseToJSON?.batteryLevel,
              device_fitbit: parseToJSON?.deviceVersion,
              type_fitbit: parseToJSON?.type,
              last_sync_device: parseToJSON?.lastSyncTime
            };

            setDataProfile(dataArrayProfileFitBit);

            requestUpdateData(dataArrayProfileFitBit);
          }
        }
      }, 3000);
    }, 3500);
  };

  // 01 - LOAD DATA HOME --------------------------------------------||>
  const loadAuthorize = async () => {
    const todayDate = moment().format('yyyy-MM-DD');
    const yesterdayDate = moment().subtract(1, 'day').format('yyyy-MM-DD');

    setDateTodayYd({ ...dateTodayYd, dateToday: todayDate, dateYesterday: yesterdayDate })

    const checkOtorisasi = await AsyncStorage.getItem('LOGING-FITBIT');
    const parseToJSON = JSON.parse(checkOtorisasi);

    const getTokenAccess = parseToJSON?.accessToken;
    const getRefreshToken = parseToJSON?.refreshToken;
    const getAccessTokenExpired = parseToJSON?.accessTokenExpirationDate;
    const idUserFitBit = parseToJSON?.tokenAdditionalParameters?.user_id;
    const getTokenType = parseToJSON?.tokenType;

    const dataArray = {
      tknAccess: getTokenAccess,
      tknRefresh: getRefreshToken,
      tknExpired: getAccessTokenExpired,
      usrID: idUserFitBit,
      tknType: getTokenType
    }

    setForm({ 
      ...form, 
      hasLoggedInOnce: true,
      provider: 'auth0',
      accessToken: dataArray?.tknAccess,
      refreshToken: dataArray?.tknRefresh,
      accessTokenExpirationDate: dataArray?.tknExpired,
      tokenAdditionalParameters: dataArray?.usrID,
      tokenType: dataArray?.tknType
    });

    loadingMessageTimlaps(dataArray);
  };

  // 02 - HANDLE REFRESH TOKEN ACCESS -------------------------------||>
  const handleRefresh = useCallback(async () => {
    setForm({
      hasLoggedInOnce: false,
      provider: '',
      accessToken: '',
      accessTokenExpirationDate: '',
      refreshToken: '',
    });

    console.log('HANDLE REFRESH : ', form?.provider);
    try {
      const config = configs[form?.provider];
      const newAuthState = await refresh(config, {
        refreshToken: form?.refreshToken,
      });

      setForm(current => ({
        ...current,
        ...newAuthState,
        refreshToken: newAuthState.refreshToken || current.refreshToken,
      }));

      try {
        const jsonValue = JSON.stringify(newAuthState);
        await AsyncStorage.setItem('LOGING-FITBIT', jsonValue);
        navigation.navigate('Splash');
      } catch (e) {
        console.log('AUTORIZE-SAFE-RESPONSE-CATCH: ', e.message);
        Alert.alert('Failed to refresh token', e.message);
      }
      
    } catch (error) {
      // Alert.alert('Failed to refresh token', error.message);
      Alert.alert('Gagal Memproses!!!!', 'Akun Anda diakses di device yang lain! lakukan prosedur revoke access dengan mengkonfirmasi tombol dibawah ini.', [
        {text: 'Revoke Access', onPress: () => handleRevoke()},
      ])
    }
  }, [form]);

  // 03 - HANDLE REVOKE TOKEN ACCESS --------------------------------||>
  const handleRevoke = useCallback(async () => {
    try {
      const config = configs[form.provider];
      await revoke(config, {
        tokenToRevoke: form.accessToken,
        sendClientId: true,
      });

      setForm({
        provider: '',
        accessToken: '',
        accessTokenExpirationDate: '',
        refreshToken: '',
      });

      removeData();
    } catch (error) {
      // Alert.alert('Failed to revoke token', error.message);
      Alert.alert('Gagal Memproses!!!!', 'Akun Anda diakses di device yang lain! lakukan prosedur revoke access dengan mengkonfirmasi tombol dibawah ini.', [
        {text: 'Revoke Access', onPress: () => handleRevoke()},
      ])
    }
  }, [form]);

  // STARTER FUNCTION ON LOAD ---------------------------------------||>
  useEffect(() => {
    loadAuthorize();
  }, []);

  // CONTAIN --------------------------------------------------------||>
  const containHome = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ScrollView>
              {/* SECTION #1: Logo & Versi */}
              <View
                style={{ flexDirection: 'row', height: 350, backgroundColor: '#133337' }}
              >
                <View
                  style={{ 
                    flex: 1.5,
                    alignItems: 'flex-start',
                    margin: 10, marginTop: 20
                  }}
                >
                  <Image
                      source={gdv_icon}
                      style={{width: 20, height: 23}}
                    />
                </View>
                <View
                  style={{ 
                    flex: 2,
                    alignItems: 'flex-end',
                    margin: 10, marginTop: 20
                  }}
                >
                  <View
                    style={{ backgroundColor: '#f4ff26', height: 24, borderRadius: 4 }}
                  >
                    <Text style={{ color: '#133337', paddingLeft: 10, paddingRight: 12, fontWeight: 'bold' }}>goodeva-p.o.c-v1.1-alpha</Text>
                  </View>
                </View>
              </View>

              {/* SECTION #2: Info User & Shift */}
              <View
                style={{ marginLeft: 12, marginTop: -280, alignItems: 'center' }}
              >
                <Image
                  source={profile1}
                  style={{width: 55, height: 55}}
                />
                <View style={{ marginTop: 20, justifyContent: 'center', }}>
                  <View>
                    <Text style={{ color: '#fff', marginTop: -6, fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>{dataProfile?.display_name}</Text>
                    <Text style={{ color: '#ffde26', fontWeight: 'bold', textAlign: 'center', marginTop: 10 }}>Email: {dataProfile?.email_account === undefined ? 'Initiating...' : dataProfile?.email_account}</Text>
                    <Text style={{ color: '#ffde26', fontWeight: 'bold', textAlign: 'center' }}>ID User FitBit: {dataProfile?.id_user_fitbit === '' ? 'Initiating...' : dataProfile?.id_user_fitbit}</Text>
                    <Text style={{ color: '#ffde26', fontWeight: 'bold', textAlign: 'center' }}>Device: {dataDevice?.deviceVersion === '' ? 'Initiating...' : dataDevice?.deviceVersion + ' (' + dataDevice?.batteryLevel + '% ' + dataDevice?.battery + ')' + ' ~ ' + dataDevice?.mac}</Text>
                    <Text style={{ color: '#ffde26', fontWeight: 'bold', textAlign: 'center' }}>Last Sync: {dataDevice?.lastSyncTime}</Text>
                    <Text style={{ color: '#ffde26', fontWeight: 'bold', textAlign: 'center' }}>Expired Session: {dataProfile?.expired_token_date === undefined ? 'Initiating...' : dataProfile?.expired_token_date}</Text>
                  </View>
                </View>
              </View>

              {/* SECTION #3: Card Total Tidur hari ini */}
              <View
                style={{ backgroundColor: '#fff', shadowColor: '#000', marginLeft: 13, marginTop: 30, marginRight: 13, borderRadius: 5, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, elevation: 1, }}
              >
                <View style={{ padding: 10, paddingBottom: 0 }}>
                  <View
                    style={{ flexDirection: 'row' }}
                  >
                    <Text style={{ color: '#133337', fontWeight: 'bold', fontSize: 16, flex: 1 }}>Total Tidur</Text>
                    <View
                      style={{ flex: 0, backgroundColor: '#133337', alignItems: 'center', paddingLeft: 10, paddingRight: 10, borderRadius: 4 }}
                    >
                      <Text style={{ color: '#fff' }}>{dateTodayYd?.dateYesterday + ' - ' + dateTodayYd?.dateToday}</Text>
                    </View>
                  </View>
                  <Text style={{ color: '#133337', fontSize: 15}}>Data Hari Ini</Text>
                </View>

                <View
                  style={{ flexDirection: 'row' }}
                >
                  <View style={{ padding: 10, paddingTop: 0, flexDirection: 'row', flex: 1 }}>
                    <View
                      style={{ flexDirection: 'row' }}
                    >
                      <Text style={{ color: '#133337', fontWeight: 'bold', fontSize: 70 }}>{dataProfile?.total_jam_tidur_td}</Text>
                      <View
                        style={{ justifyContent: 'center' }}
                      >
                        <Text style={{ color: '#133337', marginLeft: 5 }}>Jam</Text>
                      </View>
                    </View>
                    <View
                      style={{ flexDirection: 'row', marginLeft: 10 }}
                    >
                      <Text style={{ color: '#133337', fontWeight: 'bold', fontSize: 70 }}>{dataProfile?.total_menit_tidur_td}</Text>
                      <View
                        style={{ justifyContent: 'center' }}
                      >
                        <Text style={{ color: '#133337', marginLeft: 5 }}>Menit</Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}
                  >
                    <Image
                      source={sleep_moon}
                      style={{width: 60, height: 60, marginRight: 20, marginTop: -10 }}
                    />
                  </View>
                </View>

                {/* SECTION: Total tidur siang dan Malam Hari Ini */}
                <View
                  style={{ height: 50, backgroundColor: '#133337', borderBottomRightRadius: 5, borderBottomLeftRadius: 5 }}
                >
                  <View
                    style={{ flexDirection: 'row' }}
                  >
                    <View
                      style={{ flex: 1, height: 50, alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Text style={{ color: '#fff' }}>Mulai Tidur</Text>
                      <Text style={{ color: '#fff' }}>{dataProfile?.mulai_tidur_td}</Text>
                    </View>
                    <View style={{ width: 2, backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }} />
                    <View
                      style={{ flex: 1, height: 50, alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Text style={{ color: '#fff' }}>Bangun Tidur</Text>
                      <Text style={{ color: '#fff' }}>{dataProfile?.selesai_tidur_td}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* SECTION: Revoke Access */}
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Pressable
                  onPress={() => 
                    Alert.alert('Perhatian!!!', 'Apakah anda ingin batalkan token saat ini? jika Anda mengkonfirmasi, sesi akses terhadap akun akan di hapus!', [
                      {
                        text: 'Batalkan',
                        style: 'cancel',
                      },
                      {text: 'Konfirmasi', onPress: () => handleRevoke()},
                    ])
                }
                  style={{ flex: 1 }}
                >
                  <View
                    style={{ backgroundColor: '#133337', shadowColor: '#000', marginLeft: 13, marginTop: 10, marginRight: 13, borderRadius: 5, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, elevation: 1, paddingBottom: 13 }}
                  >
                    <View style={{ padding: 10, paddingBottom: 0, alignItems: 'center' }}>
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, alignItems: 'center' }}>Revoke Access</Text>
                    </View>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => 
                    Alert.alert('Perhatian!', 'Apakah anda ingin merefresh token saat ini?', [
                      {
                        text: 'Batalkan',
                        style: 'cancel',
                      },
                      {text: 'Konfirmasi', onPress: () => handleRefresh()},
                    ])
                }
                  style={{ flex: 1 }}
                >
                  <View
                    style={{ backgroundColor: '#6942f5', shadowColor: '#000', marginLeft: 0, marginTop: 10, marginRight: 13, borderRadius: 5, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, elevation: 1, paddingBottom: 13 }}
                  >

                    <View style={{ padding: 10, paddingBottom: 0, alignItems: 'center' }}>
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, alignItems: 'center' }}>Refresh Token</Text>
                    </View>
                  </View>
                </Pressable>
              </View>

              {/* SECTION: Logo Pama Transparant Paling Bawah */}
              <View
                style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 50, marginTop: 80 }}
              >
                <Image
                  source={gdv_icon}
                  style={{width: 80, height: 90, marginBottom: 10 }}
                />
              </View>
        </ScrollView>
      </View>
    )
  };
  
  const containtOnLoad = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#e4e3e6' }}>
        <Text style={{ textAlign: 'center', color: '#000', padding: 15 }}>{loadingMessage}</Text>
      </View>
    )
  }

  return (
    <View
      style={{ flex: 1 }}
    >
      {isLoading ? containtOnLoad() : containHome()}
    </View>
  )
};

export default Home;