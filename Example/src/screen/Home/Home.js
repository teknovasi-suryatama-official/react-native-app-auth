import { Alert, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
// import {
//   LineChart,
//   BarChart,
//   PieChart,
//   ProgressChart,
//   ContributionGraph,
//   StackedBarChart
// } from "react-native-chart-kit";
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import moment from 'moment';

import {
  refresh,
  revoke,
} from 'react-native-app-auth';

import logoPamaKecil from '../../../assets/logo_pama_kecil.png';
import logoOpa from '.../../../assets/logo_opa_dashboard_hijau.png';
import sleep_moon from '../../../assets/sleep.png';
import heart_rate from '../../../assets/heart_rate.png';
import pama_transparan_logo from '../../../assets/pama_transparan.png';
import oksigen from '../../../assets/o2.png';
import spo2 from '../../../assets/spo2.png';
import profile1 from '../../../assets/driver.png';

const configs = {
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

const Home = ({navigation}) => {

  const [getTodayTotal, setTodayTotal] = useState({
    totHour: 0,
    totMinute: 0
  });

  const [getDtSPo2, setDtSPo2] = useState({
    avgSPo: 0,
    minSPo: 0,
    maxSPo: 0
  });

  const [getStartEndSleep, setStartEndSleep] = useState({
    startSleep: '',
    endSleep: ''
  });

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
    setDataDevice({
      battery: '',
      batteryLevel: 0,
      deviceVersion: '',
      id: '',
      lastSyncTime: '',
      mac: '',
      type: ''
    });

    await AsyncStorage.clear();
    navigation.navigate('Splash');
  };

  const convertTime = (dateToConvert) => {
    var date = moment(dateToConvert)
    .utcOffset('+07:00')
    .format('YYYY-MM-DD HH:mm')

    return date;
  };

  const convertMinutesToHour = (minutes) => {
    let time = minutes
    var retHour = Math.floor(time / 60)
    var retMinutes = time % 60

    return [retHour, retMinutes];
  }

  const loadAuthorize = async () => {
    const todayDate = moment().format('yyyy-MM-DD');
    const yesterdayDate = moment().subtract(1, 'day').format('yyyy-MM-DD');

    setDateTodayYd({ ...dateTodayYd, dateToday: todayDate, dateYesterday: yesterdayDate })

    const checkOtorisasi = await AsyncStorage.getItem('LOGING-FITBIT');
    const parseToJSON = JSON.parse(checkOtorisasi);
    setForm({ 
      ...form, 
      hasLoggedInOnce: true,
      provider: 'auth0',
      accessToken: parseToJSON?.accessToken,
      refreshToken: parseToJSON?.refreshToken,
      accessTokenExpirationDate: parseToJSON?.accessTokenExpirationDate,
      tokenAdditionalParameters: parseToJSON?.tokenAdditionalParameters?.user_id,
      tokenType: parseToJSON?.tokenType
    });

    const getDataDeviceStr = await AsyncStorage.getItem('DATA_DEVICE_STR');
    const parseToJSONDevice = JSON.parse(getDataDeviceStr);

    if (parseToJSONDevice === null) {
      console.info('0.1. GETDEVICE FROM API');
      getDevice(parseToJSON?.tokenAdditionalParameters?.user_id, parseToJSON?.accessToken);
    } else {
      console.info('0.2. GETDEVICE-FROM-STORAGE');
      setDataDevice({
        battery: parseToJSONDevice[0]?.battery,
        batteryLevel: parseToJSONDevice[0]?.batteryLevel,
        deviceVersion: parseToJSONDevice[0]?.deviceVersion,
        id: parseToJSONDevice[0]?.id,
        lastSyncTime: parseToJSONDevice[0]?.lastSyncTime,
        mac: parseToJSONDevice[0]?.mac,
        type: parseToJSONDevice[0]?.type
      });

      const checkDataSleepTd = await AsyncStorage.getItem('DATA_SLEEP_TODAY');
      const parseToJSONTd = JSON.parse(checkDataSleepTd);
      const dateFromStorageTd = parseToJSONTd?.sleep[0]?.dateOfSleep;
      const checkReadyDataSleepTd = parseToJSONTd?.sleep;

      if (dateFromStorageTd === todayDate) {

        const resultConvert = convertMinutesToHour(parseToJSONTd?.summary?.totalMinutesAsleep);
        setTodayTotal({
          ...getTodayTotal,
          totHour: resultConvert[0],
          totMinute: resultConvert[1]
        });

        setStartEndSleep({
          ...getStartEndSleep,
          startSleep: checkReadyDataSleepTd[0]?.startTime,
          endSleep: checkReadyDataSleepTd[0]?.endTime
        });

        const checkDataSPo2 = await AsyncStorage.getItem('DATA_SPO2');
        const parseToJSONSPo2 = JSON.parse(checkDataSPo2);

        if (parseToJSONSPo2 === null) {
          getDataSPo2(parseToJSON?.tokenAdditionalParameters?.user_id, parseToJSON?.accessToken, moment().format('yyyy-MM-DD'));
        } else {
          setDtSPo2({
            ...getDtSPo2,
            avgSPo: parseToJSONSPo2?.value?.avg,
            minSPo: parseToJSONSPo2?.value?.min,
            maxSPo: parseToJSONSPo2?.value?.max
          })
        }
      } else if (checkReadyDataSleepTd !== '[]') {
        console.log('2.2. DATA SLEEP HARI INI TIDAK TERSEDIA');
        getDataSleepToday(form?.tokenAdditionalParameters, form?.accessToken, todayDate);
      } else {
        console.log('PENYIAPAN DATA SLEEP HARI INI...');
        getDataSleepToday(form?.tokenAdditionalParameters, form?.accessToken, todayDate);
      }
    }
  };

  const getDevice = async (iduser, tokenaccess) => {
    const todayDate = moment().format('yyyy-MM-DD');
    const yesterdayDate = moment().subtract(1, 'day').format('yyyy-MM-DD');

    setDateTodayYd({ ...dateTodayYd, dateToday: todayDate, dateYesterday: yesterdayDate })

    if (dataDevice?.mac) {
      console.log('1. DATA DEVICE SUDAH TERSEDIA ✅');

      const checkDataSleepTd = await AsyncStorage.getItem('DATA_SLEEP_TODAY');
      const parseToJSONTd = JSON.parse(checkDataSleepTd);
      const dateFromStorageTd = parseToJSONTd?.sleep[0]?.dateOfSleep;
      const checkReadyDataSleepTd = parseToJSONTd?.sleep;

      if (dateFromStorageTd === todayDate) {
        console.log('2.1. DATA SLEEP LOG HARI INI TERSEDIA ✅');

        const resultConvert = convertMinutesToHour(parseToJSONTd?.summary?.totalMinutesAsleep);
        setTodayTotal({
          ...getTodayTotal,
          totHour: resultConvert[0],
          totMinute: resultConvert[1]
        });

        setStartEndSleep({
          ...getStartEndSleep,
          startSleep: checkReadyDataSleepTd[0]?.startTime,
          endSleep: checkReadyDataSleepTd[0]?.endTime
        });
      } else if (checkReadyDataSleepTd !== '[]') {
        console.log('2.2. DATA SLEEP HARI INI TIDAK TERSEDIA');
      } else {
        console.log('PENYIAPAN DATA SLEEP HARI INI...');
        getDataSleepToday(form?.tokenAdditionalParameters, form?.accessToken, todayDate);
      }

      const checkDataSleepYd = await AsyncStorage.getItem('DATA_SLEEP_YESTERDAY');
      const parseToJSONYd = JSON.parse(checkDataSleepYd);
      const dateFromStorageYd = parseToJSONYd?.sleep[0]?.dateOfSleep;
      const checkReadyDataSleepYd = parseToJSONYd?.sleep;

      if (dateFromStorageYd === yesterdayDate) {
        console.log('3.1. DATA SLEEP LOG KEMARIN TERSEDIA');
      } else if (checkReadyDataSleepYd !== '[]') {
        console.log('3.2. DATA SLEEP KEMARIN TIDAK TERSEDIA ❌');
      } else {
        console.log('PENYIAPAN DATA SLEEP KEMARIN...');
        getDataSleepYesterday(form?.tokenAdditionalParameters, form?.accessToken, yesterdayDate);
      }

    } else {
      console.log('PENYIAPAN DATA DEVICE...');
      try {
        fetch('https://api.fitbit.com/1/user/' + iduser + '/devices.json', {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + tokenaccess}
        })
        .then(response => response.json()) 
        .then(async json => 
          {
            try {
              const jsonValue = JSON.stringify(json);
              await AsyncStorage.setItem('DATA_DEVICE_STR', jsonValue);
              console.info(JSON.stringify(json, null,  ' '));
            } catch (e) {
              console.log('AUTORIZE-SAFE-RESPONSE-CATCH-TD: ', e.message);
            }
          }
        );
      } catch (error) {
        console.info('ERROR: ', error.message);
      }

      getDataSleepToday(iduser, tokenaccess, todayDate);
      getDataSleepYesterday(iduser, tokenaccess, yesterdayDate);
      // getDataHeartRate(iduser, tokenaccess, todayDate);
      getDataSPo2(iduser, tokenaccess, todayDate);
    }
  };

  const getDataSleepToday = async (iduser, tokenaccess, today) => {
    console.info('GETDATASLEEP TODAY');
    try {
      fetch('https://api.fitbit.com/1.2/user/' + iduser + '/sleep/date/' + today + '.json', {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + tokenaccess}
      })
      .then(response => response.json()) 
      .then(async json => {
        try {
          const jsonValue = JSON.stringify(json);
          await AsyncStorage.setItem('DATA_SLEEP_TODAY', jsonValue);
        } catch (e) {
          console.log('AUTORIZE-SAFE-RESPONSE-CATCH-TD: ', e.message);
        }
      });
    } catch (error) {
      console.info('ERROR: ', error.message);
    }
  }; 

  const getDataHeartRate = async (iduser, tokenaccess, today) => {
    console.info('GET DATA HEART RATE TODAY');
    try {
      fetch('https://api.fitbit.com/1/user/' + iduser + '/activities/heart/date/' + today + '/1d.json', {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + tokenaccess}
      })
      .then(response => response.json()) 
      .then(async json => {
        try {
          const jsonValue = JSON.stringify(json);
          await AsyncStorage.setItem('DATA_HEART_RATE', jsonValue);
        } catch (e) {
          console.log('AUTORIZE-SAFE-RESPONSE-CATCH-TD: ', e.message);
        }
      });
    } catch (error) {
      console.info('ERROR: ', error.message);
    }
  }; 

  const getDataSPo2 = async (iduser, tokenaccess, today) => {
    console.info('GET DATA SPo2 TODAY...');
    try {
      fetch('https://api.fitbit.com/1/user/' + iduser + '/spo2/date/' + today + '.json', {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + tokenaccess}
      })
      .then(response => response.json()) 
      .then(async json => 
        {
          try {
            const jsonValue = JSON.stringify(json);
            await AsyncStorage.setItem('DATA_SPO2', jsonValue);
          } catch (e) {
            console.log('AUTORIZE-SAFE-RESPONSE-CATCH-TD: ', e.message);
          }
        }
      );
    } catch (error) {
      console.info('ERROR: ', error.message);
    }
  }; 

  const getDataSleepYesterday = async (iduser, tokenaccess, yesterday) => {
    console.info('GETDATASLEEP YESTERDAY');
    try {
      fetch('https://api.fitbit.com/1.2/user/' + iduser + '/sleep/date/' + yesterday + '.json', {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + tokenaccess}
      })
      .then(response => response.json()) 
      .then(async json => {
        try {
          const jsonValue = JSON.stringify(json);
          await AsyncStorage.setItem('DATA_SLEEP_YESTERDAY', jsonValue);
        } catch (e) {
          console.log('AUTORIZE-SAFE-RESPONSE-CATCH-YD: ', e.message);
        }
      });
    } catch (error) {
      console.info('ERROR: ', error.message);
    }
  };

  const minValue = 80;

  function* yLabel() {
    yield * ['', 'DEEP', 'LIGHT', 'REM', 'AWAKE'];
  }

  const yLabelIterator = yLabel();

  const data = { 
      labels: ["23:00", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "05:20"],
      datasets: [
          {
              data: [50, 40, 40, 30, 30, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 10, 10, 10, 10],
              colors: [
                  () => `#fc6f3d`,
                  () => `#fc6f3d`,
                  () => `#fc6f3d`,
                  () => `#e30763`,
                  () => `#e30763`,
                  () => `#7773ff`,
                  () => `#7773ff`,
                  () => `#7773ff`,
                  () => `#7773ff`,
                  () => `#7773ff`,
                  () => `#7773ff`,
                  () => `#7773ff`,
                  () => `#7773ff`,
                  () => `#7773ff`,
                  () => `#7773ff`,
                  () => `#7773ff`,
                  () => `#23204f`,
                  () => `#23204f`,
                  () => `#23204f`,
                  () => `#23204f`,
              ]
          } 
      ]
  }; 

  const fill = 'rgb(134, 65, 244)'
  const dataNewBar = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 20, 20, 20, 20, 20, 20, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 10, 10, 10, 10, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
 
  // AWAKE DATA
  var awakeData1 = [
    {
        value: 3,
        svg: {
            fill: '#e73360',
        },
    },
  ];
  var awakeData2 = [
    {
        value: 3,
        svg: {
            fill: '#e73360',
        },
    },
    {
        value: 3,
        svg: {
            fill: '#e73360',
        },
    },
  ];

  // REM DATA
  var remData = [
    {
        value: 20,
        svg: {
            fill: '#7ec4ff',
        },
    },
    {
        value: 20,
        svg: {
            fill: '#7ec4ff',
        },
    },
  ];

  // LIGHT DATA
  var lightData1 = [
    {
        value: 2,
        svg: {
            fill: '#3f8dff',
        },
    },
    {
        value: 2,
        svg: {
            fill: '#3f8dff',
        },
    },
    {
        value: 2,
        svg: {
            fill: '#3f8dff',
        },
    },
  ];
  var lightData2 = [
    {
        value: 2,
        svg: {
            fill: '#3f8dff',
        },
    },
  ];
  var lightData3 = [
    {
        value: 2,
        svg: {
            fill: '#3f8dff',
        },
    },
    {
        value: 2,
        svg: {
            fill: '#3f8dff',
        },
    },
    {
        value: 2,
        svg: {
            fill: '#3f8dff',
        },
    },
  ];
  var lightData4 = [
    {
        value: 2,
        svg: {
            fill: '#3f8dff',
        },
    },
  ];
  var lightData5 = [
    {
        value: 2,
        svg: {
            fill: '#3f8dff',
        },
    },
  ];

  // DEEP DATA
  var deepData1 = [
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
  ];
  var deepData2 = [
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 3,
        svg: {
            fill: '#e73360',
        },
    },
    {
        value: 3,
        svg: {
            fill: '#e73360',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 3,
        svg: {
            fill: '#e73360',
        },
    },
    {
        value: 3,
        svg: {
            fill: '#e73360',
        },
    },
    {
        value: 3,
        svg: {
            fill: '#e73360',
        },
    },
    {
        value: 3,
        svg: {
            fill: '#e73360',
        },
    },
    {
        value: 3,
        svg: {
            fill: '#e73360',
        },
    },
    {
        value: 3,
        svg: {
            fill: '#e73360',
        },
    },
    {
        value: 3,
        svg: {
            fill: '#e73360',
        },
    },
    {
        value: 3,
        svg: {
            fill: '#e73360',
        },
    },
    {
        value: 3,
        svg: {
            fill: '#e73360',
        },
    },
    {
        value: 3,
        svg: {
            fill: '#e73360',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
  ];

  var deepData3 = [
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
  ];

  var deepData4 = [
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
  ];

  var deepData5 = [
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
    {
        value: 1,
        svg: {
            fill: '#154ba6',
        },
    },
  ];

  const dataNewBar2 = [].concat(awakeData1, lightData1, deepData1, lightData2, deepData2, lightData3, deepData3, lightData4, deepData4, lightData5, deepData5, awakeData2);

  const chartConfig = {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 0,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726"
    }
  };

  /**
   * FUNCTIONS HOME -------------------------------------------------||>
   **/

  // 02 - HANDLE REFRESH TOKEN ACCESS -------------------------------||>
  const handleRefresh = useCallback(async () => {
    console.log('CEKAUTH: ', form?.provider);
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
        const jsonValue = JSON.stringify(form);
        await AsyncStorage.setItem('LOGING-FITBIT', jsonValue);
        navigation.navigate('Splash');
      } catch (e) {
        console.log('AUTORIZE-SAFE-RESPONSE-CATCH: ', e.message);
      }
      
    } catch (error) {
      Alert.alert('Failed to refresh token', error.message);
    }
  }, [form]);

  // 03 - HANDLE REVOKE TOKEN ACCESS -------------------------------||>
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
      Alert.alert('Failed to revoke token', error.message);
    }
  }, [form]);

  // STARTER FUNCTION ON LOAD --------------------------------------||>
  useEffect(() => {
    loadAuthorize();
  }, []);

  return (
    <SafeAreaView>
      <View>
        {/* {console.info(JSON.stringify(form, null, ' '))} */}
        {/* {console.info(JSON.stringify(gabungArray(), null, ' '))} */}
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
                  style={{width: 60, height: 25, marginLeft: 50}}
                />
              </View>
              <View
                style={{ 
                  flex: 1.5,
                  alignItems: 'flex-end',
                  margin: 10, marginTop: 20
                }}
              >
                <View
                  style={{ backgroundColor: '#f4ff26', height: 24, borderRadius: 4 }}
                >
                  <Text style={{ color: '#253C7F', marginTop: 2.5, paddingLeft: 10, paddingRight: 12, fontWeight: 'bold' }}>poc-v1.0-alpha</Text>
                </View>
              </View>
            </View>

            {/* SECTION #2: Info User & Shift */}
            <View
              style={{ marginLeft: 12, marginTop: -170, flexDirection: 'row' }}
            >
              <Image
                source={profile1}
                style={{width: 50, height: 50}}
              />
              <View
                style={{ marginLeft: 15 }}
              >
                <View>
                  <Text style={{ color: '#fff', marginTop: -3, fontWeight: 'bold', fontSize: 18 }}>Asep Septiadi</Text>
                  <Text style={{ color: '#ffde26', fontWeight: 'bold' }}>Device: {dataDevice?.deviceVersion}</Text>
                  <Text style={{ color: '#ffde26', fontWeight: 'bold' }}>Last Sync: {convertTime(dataDevice?.lastSyncTime)} WIB</Text>
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
                  <Text style={{ color: '#253C7F', fontWeight: 'bold', fontSize: 16, flex: 1 }}>Total Tidur</Text>
                  <View
                    style={{ flex: 0, backgroundColor: '#253C7F', alignItems: 'center', paddingLeft: 10, paddingRight: 10, borderRadius: 4 }}
                  >
                    <Text style={{ color: '#fff' }}>{dateTodayYd?.dateYesterday + ' - ' + dateTodayYd?.dateToday}</Text>
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
                    <Text style={{ color: '#253C7F', fontWeight: 'bold', fontSize: 70 }}>{getTodayTotal?.totHour}</Text>
                    <View
                      style={{ justifyContent: 'center' }}
                    >
                      <Text style={{ color: '#253C7F', marginLeft: 5 }}>Jam</Text>
                    </View>
                  </View>
                  <View
                    style={{ flexDirection: 'row', marginLeft: 10 }}
                  >
                    <Text style={{ color: '#253C7F', fontWeight: 'bold', fontSize: 70 }}>{getTodayTotal?.totMinute}</Text>
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
                    style={{width: 60, height: 60, marginRight: 20, marginTop: -10 }}
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
                    <Text style={{ color: '#fff' }}>Mulai Tidur</Text>
                    <Text style={{ color: '#fff' }}>{convertTime(getStartEndSleep?.startSleep)}</Text>
                  </View>
                  <View style={{ width: 2, backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }} />
                  <View
                    style={{ flex: 1, height: 50, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ color: '#fff' }}>Bangun Tidur</Text>
                    <Text style={{ color: '#fff' }}>{convertTime(getStartEndSleep?.endSleep)}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* SECTION #3: Heart Rate */}
            <View
              style={{ backgroundColor: '#fff', shadowColor: '#000', marginLeft: 13, marginTop: 15, marginRight: 13, borderRadius: 5, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, elevation: 1,  }}
            >
              <View style={{ padding: 10, paddingBottom: 0 }}>
                <View
                  style={{ flexDirection: 'row' }}
                >
                  <Text style={{ color: '#253C7F', fontWeight: 'bold', fontSize: 16, flex: 1 }}>Resting Heart Rate</Text>
                </View>
              </View>

              <View
                style={{ flexDirection: 'row' }}
              >
                <View
                  style={{ flex: 1, alignItems: 'left', flexDirection: 'row', marginTop: -5, marginLeft: 10}}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 50, color: '#ed114f' }}>0</Text>
                  <Text style={{ fontWeight: 'bold', color: '#ed114f', marginTop: 20, marginLeft: 5 }}>bpm</Text>
                </View>
                <View
                  style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}
                >
                  <Image
                    source={heart_rate}
                    style={{width: 60, height: 60, marginRight: 20, marginBottom: 10, marginTop: -10 }}
                  />
                </View>
              </View>
            </View>
            
            {/* SECTION #4: SPo2 (Saturasi Oksigen dalam Darah) */}
            <View
              style={{ backgroundColor: '#fff', shadowColor: '#000', marginLeft: 13, marginTop: 15, marginRight: 13, borderRadius: 5, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, elevation: 1,  }}
            >
              <View style={{ padding: 10, paddingBottom: 0 }}>
                <View
                  style={{ flexDirection: 'row' }}
                >
                  <Text style={{ color: '#253C7F', fontWeight: 'bold', fontSize: 16, flex: 1 }}>Saturasi Oksigen</Text>
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
                      source={oksigen}
                      style={{width: 10, height: 10, marginTop: 5, marginRight: 5 }}
                    />
                    <Text style={{ color: '#253C7F', fontWeight: 'bold' }}>{getDtSPo2?.minSPo}%</Text>
                  </View>
                  <View
                    style={{ flexDirection: 'row', marginTop: 0 }}
                  >
                    <Text style={{ color: '#253C7F', fontWeight: 'bold' }}>Maximum</Text>
                    <View style={{ width: 10 }}></View>
                    <Image
                      source={oksigen}
                      style={{width: 10, height: 10, marginTop: 5, marginRight: 5 }}
                    />
                    <Text style={{ color: '#253C7F', fontWeight: 'bold' }}>{getDtSPo2?.maxSPo}%</Text>
                  </View>
                </View>
                <View
                  style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginLeft: 50, marginTop: -15}}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 50, color: '#4287f5' }}>{getDtSPo2?.avgSPo}</Text>
                  <Text style={{ fontWeight: 'bold', color: '#4287f5', marginTop: 20, marginLeft: 0 }}>%</Text>
                </View>
                <View
                  style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}
                >
                  <Image
                    source={spo2}
                    style={{width: 60, height: 60, marginRight: 20, marginBottom: 10, marginTop: -10 }}
                  />
                </View>
              </View>
            </View>

            <View
              style={{ backgroundColor: '#fff', shadowColor: '#000', marginLeft: 13, marginTop: 15, marginRight: 13, borderRadius: 5, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, elevation: 1,  }}
            >
              <View style={{ backgroundColor: '#ffffff' }}>
              {/* <BarChart 
                style={{
                  marginLeft: 10,
                  marginTop: 25,
                }}
                data={data}
                formatYLabel = {(label) => {
                  const labelVal = Number(label);
                  if(labelVal >=40) return 'DEEP';
                  if(labelVal >=30) return '';
                  if(labelVal >=20) return 'LIGHT';
                  if(labelVal >=10) return 'REM';
                  if(labelVal >=0) return 'AWAKE';
                  return label;
                }}
                width={300}
                height={300} 
                chartConfig={{ 
                  backgroundGradientTo: 0,
                  backgroundGradientFromOpacity: 0,
                  backgroundGradientFrom: 0,
                  backgroundGradientToOpacity: 0,
                  color: () => `#23204f`,
                  barPercentage: 0.23,
                  barRadius : 0,
                  decimalPlaces: 0,
                  formatYLabel: () => yLabelIterator.next().value,
                }}
              withHorizontalLabels={true}
              fromZero={true}
              withCustomBarColorFromData={true}
              flatColor={true}
              withInnerLines={true}
              showBarTops={false}
              showValuesOnTopOfBars={false}
              /> */}
              {/* <BarChart 
                style={{ height: 200, width: '100%' }} 
                data={dataNewBar} 
                svg={{ fill }} 
                contentInset={{ top: 30, bottom: 30 
              }}>
                  <Grid />
              </BarChart> */}
              <BarChart
              withHorizontalLabels={true}
                style={{ height: 200, marginLeft: 30, marginRight: 30, marginTop: 20 }}
                data={dataNewBar2}
                gridMin={0}
                svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                yAccessor={({ item }) => item.value}
                contentInset={{ top: 20, bottom: 20 }}
                horizontal={false}
              >
                  <Grid/>
              </BarChart>

            <YAxis
                style={{ marginTop: 10 }}
                data={ dataNewBar2 }
                svg={{fontSize:10,fill:"grey"}}
                formatLabel={ (value, index) => index }
                labelStyle={ { color: 'black' } }
            />
              </View>
            </View>

            {/* SECTION: Revoke Access */}
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Pressable
                onPress={handleRevoke}
                style={{ flex: 1 }}
              >
                <View
                  style={{ backgroundColor: '#ff3d4a', shadowColor: '#000', marginLeft: 13, marginTop: 10, marginRight: 13, borderRadius: 5, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, elevation: 1, paddingBottom: 13 }}
                >
                  <View style={{ padding: 10, paddingBottom: 0, alignItems: 'center' }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, alignItems: 'center' }}>Revoke Access</Text>
                  </View>
                </View>
              </Pressable>
              <Pressable
                onPress={handleRefresh}
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
                source={pama_transparan_logo}
                style={{width: 80, height: 90, marginBottom: 10 }}
              />
            </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
};

export default Home;