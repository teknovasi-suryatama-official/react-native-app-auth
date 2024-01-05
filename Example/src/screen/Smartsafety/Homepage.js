import { 
  Image, 
  ScrollView, 
  Text, 
  View 
} from 'react-native'
import React from 'react'
import { 
  SafeAreaView 
} from 'react-native-safe-area-context';

import smart_safety_ic from '../../../assets/smart_safety/ic_smart_safety.png';
import person_ic from '../../../assets/smart_safety/ic_person.png';
import upload_ic from '../../../assets/smart_safety/ic_upload.png';
import cuti_ic from '../../../assets/smart_safety/ic_cuti.png';
import refresh_ic from '../../../assets/smart_safety/ic_refresh.png';
import sleep_today_ic_ from '../../../assets/smart_safety/ic_sleep_today.png';
import night_ic from '../../../assets/smart_safety/ic_night.png';
import day_ic from '../../../assets/smart_safety/ic_day.png';
import hr_ic from '../../../assets/smart_safety/ic_heart_rate.png';
import spo2_ic from '../../../assets/smart_safety/ic_spo2.png';

import banner_1 from '../../../assets/smart_safety/ic_banner.png';

const Homepage = ({navigation}) => {
  return (
    <SafeAreaView
      style={{ 
        backgroundColor: '#E8EAF3'
       }}
    >
      <ScrollView> 
        <View>
          {/* SECTION 01 : ICON SMART SAFETY */}
          <View
            style={{ flexDirection: 'row', padding: 20 }}
          >
            <Image 
              source={smart_safety_ic}
              style={{ width: '50%', height: 46, flex: 1.3 }}
            />
            <View
              style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}
            >
              <View
                style={{ flexDirection: 'row' }}
              >
                <View 
                  style={{ borderRadius: 30, backgroundColor: '#08C428', width: 15, height: 15 }}
                />
                <View>
                  <Text
                    style={{ fontSize: 15, fontWeight: 'bold', paddingLeft: 5 }}
                  >
                    v3.1
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* SECTION 02 : PROFILE ANNOUNCEMENT */}
          <View
            style={{ 
              padding: 20,
              paddingTop: -10
            }}
          >
            <View
              style={{ 
                backgroundColor: '#1E2F6A',
                borderRadius: 10,
                flexDirection: 'row'
              }}
            >
              <View
                style={{ 
                  flex: 1
                }}
              >
                <Image 
                  source={person_ic}
                  style={{ width: '66%', height: 150, marginTop: 10, marginLeft: 30 }}
                />
              </View>
              <View
                style={{ 
                  flex: 1.1,
                  justifyContent: 'center',
                  marginLeft: 10
                }}
              >
                <View>
                  <Text
                    style={{ 
                      color: '#fff',
                      fontSize: 25,
                      fontWeight: 'bold'
                    }}
                  >
                    Asep Septiadi
                  </Text>
                  <Text
                    style={{ 
                      color: '#F8C301',
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginTop: 5
                    }}
                  >
                    Shift 1
                  </Text>

                  <View
                    style={{ 
                      backgroundColor: '#08C428',
                      marginRight: 25,
                      borderRadius: 20,
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{ 
                        color: '#fff',
                        padding: 10,
                        fontSize: 15,
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      Fitbit - Charge 6
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* SECTION 03 : MENU UPLOAD, CUTI & REFRESH */}
          <View
            style={{ 
              flexDirection: 'row', padding: 15, marginTop: -15
            }}
          >
            {/* UPLOAD */}
            <View
              style={{ 
                flex: 1,
                marginRight: 10,
                marginLeft: 10
              }}
            >
              <View>
                <View
                  style={{ borderWidth: 1.5, padding: 5, borderRadius: 8, alignItems: 'center', backgroundColor: '#FFFFFF', marginLeft: 20, marginRight: 20, borderColor: '#9EA5BE' }}
                >
                  <Image 
                    source={upload_ic}
                    style={{ width: 35, height: 30 , marginTop: 10, marginBottom: 10}}
                  />
                </View>
                <Text
                  style={{ 
                    marginTop: 10,
                    textAlign: 'center',
                    fontWeight: '500',
                    color: '#1D2E69', 
                  }}
                >
                  Upload
                </Text>
              </View>
            </View>

            {/* LEAVE */}
            <View
              style={{ 
                flex: 1,
                marginRight: 10
              }}
            >
              <View>
                <View
                  style={{ borderWidth: 1.5, padding: 5, borderRadius: 8, alignItems: 'center', backgroundColor: '#FFFFFF', marginLeft: 20, marginRight: 20, borderColor: '#9EA5BE' }}
                >
                  <Image 
                    source={cuti_ic}
                    style={{ width: 30, height: 30 , marginTop: 10, marginBottom: 10}}
                  />
                </View>
                <Text
                  style={{ 
                    marginTop: 10,
                    textAlign: 'center',
                    fontWeight: '500'
                  }}
                >
                  Cuti
                </Text>
              </View>
            </View>

            {/* REFRESH */}
            <View
              style={{ 
                flex: 1,
                marginRight: 10
              }}
            >
              <View>
                <View
                  style={{ borderWidth: 1.5, padding: 5, borderRadius: 8, alignItems: 'center', backgroundColor: '#FFFFFF', marginLeft: 20, marginRight: 20, borderColor: '#9EA5BE' }}
                >
                  <Image 
                    source={refresh_ic}
                    style={{ width: 30, height: 30 , marginTop: 10, marginBottom: 10}}
                  />
                </View>
                <Text
                  style={{ 
                    marginTop: 10,
                    textAlign: 'center',
                    fontWeight: '500'
                  }}
                >
                  Refresh
                </Text>
              </View>
            </View>
          </View>

          {/* SECTION 04 : SLEEP TODAY */}
          <View
              style={{ 
                padding: 15, 
                backgroundColor: '#ffffff',
                borderRadius: 15,
                marginLeft: 20,
                marginRight: 20
              }}
          >
            <View
              style={{ 
                flexDirection: 'row', 
              }}
            >
              <View
                style={{ flex: 1, marginTop: 10 }}
              >
                <Text
                  style={{ 
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#1D2E69'
                  }}
                >
                  Tidur Hari Ini
                </Text>
                <Text
                  style={{ 
                    fontSize: 15,
                    fontWeight: '600',
                    marginTop: 5,
                    color: '#1D2E69'
                  }}
                >
                  04 Feb 2024
                </Text>
              </View>
              <View
                style={{ flex: 1, marginTop: 15, justifyContent: 'center', alignItems: 'flex-end' }}
              >
                <View
                  style={{ 
                    backgroundColor: '#1D2E69', width: 100, borderRadius: 20,
                  }}
                >
                  <Text
                    style={{ 
                      fontSize: 15,
                      color: '#ffffff',
                      padding: 4,
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    Shift 1
                  </Text>
                </View>
              </View>
            </View>

            {/* SEPARATOR */}
            <View 
              style={{ 
                height: 2,
                backgroundColor: '#3F338A66',
                marginTop: 15,
                marginBottom: 0
              }}
            />

            <View
              style={{ 
                flexDirection: 'row',
                marginTop: 10
              }}
            >
              <View
                style={{ 
                  flex: 1,
                  marginLeft: 30
                }}
              >
                <Image 
                  source={sleep_today_ic_}
                  style={{ width: '78%', height: 120 }}
                />
              </View>

              <View
                style={{ 
                  flex: 1.7,
                  justifyContent: 'center',
                  marginRight: 20,
                  marginLeft: -15
                }}
              >
                <View
                  style={{ flexDirection: 'row' }}
                >
                  <Text
                    style={{ 
                      fontSize: 50,
                      flex: 1,
                      fontWeight: 'bold',
                      color: '#142653'
                    }}
                  >
                    6
                    <Text
                      style={{ 
                        fontSize: 14,
                        fontWeight: '600',
                        color: '#142653'
                       }}
                    >
                      Jam
                    </Text>
                  </Text>
                  <Text
                    style={{ 
                      fontSize: 50,
                      flex: 1.7,
                      fontWeight: 'bold',
                      color: '#142653'
                    }}
                  >
                    35
                    <Text
                      style={{ 
                        fontSize: 14,
                        fontWeight: '600',
                        color: '#142653'
                       }}
                    >
                      Menit
                    </Text>
                  </Text>
                </View>
              </View>
            </View>

            {/* NIGHT SLEEP */}
            <View
              style={{ 
                paddingLeft: 20,
                paddingRight: 20,
                backgroundColor: '#E8EAF3',
                paddingTop: 20,
                paddingBottom: 13,
                borderRadius: 10,
                marginTop: 10
              }}
            >
              <View
                style={{ 
                  flexDirection: 'row'
                }}
              >
                <View
                  style={{ flex: 1 }}
                >
                  <View
                    style={{ 
                      flexDirection: 'row'
                     }}
                  >
                    <Image 
                      source={night_ic}
                      style={{ width: '14%', height: 21, marginTop: -1.5 }}
                    />
                    <Text
                      style={{ 
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#1D2E69', 
                        marginLeft: 10
                       }}
                    >
                      Tidur Malam
                    </Text>
                  </View>
                </View>

                <View
                  style={{ flex: 1 }}
                >
                  <View
                    style={{ 
                      flex: 1.7,
                      justifyContent: 'center',
                      marginLeft: -15
                    }}
                  >
                    <View
                      style={{ flexDirection: 'row', marginTop: -9, marginLeft: 50 }}
                    >
                      <Text
                        style={{ 
                          fontSize: 30,
                          flex: 1,
                          fontWeight: 'bold',
                          color: '#142653'
                        }}
                      >
                        3
                        <Text
                          style={{ 
                            fontSize: 10,
                            fontWeight: '600',
                            color: '#142653'
                          }}
                        >
                          Jam
                        </Text>
                      </Text>
                      <Text
                        style={{ 
                          fontSize: 30,
                          flex: 1.5,
                          fontWeight: 'bold',
                          color: '#142653'
                        }}
                      >
                        00
                        <Text
                          style={{ 
                            fontSize: 10,
                            fontWeight: '600',
                            color: '#142653'
                          }}
                        >
                          Menit
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* DAY SLEEP */}
            <View
              style={{ 
                paddingLeft: 20,
                paddingRight: 20,
                backgroundColor: '#E8EAF3',
                paddingTop: 20,
                paddingBottom: 13,
                borderRadius: 10,
                marginTop: 10,
                marginBottom: 10
              }}
            >
              <View
                style={{ 
                  flexDirection: 'row'
                }}
              >
                <View
                  style={{ flex: 1 }}
                >
                  <View
                    style={{ 
                      flexDirection: 'row'
                    }}
                  >
                    <Image 
                      source={day_ic}
                      style={{ width: '14%', height: 21, marginTop: -1.5 }}
                    />
                    <Text
                      style={{ 
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#1D2E69', marginLeft: 10
                      }}
                    >
                      Tidur Siang
                    </Text>
                  </View>
                </View>

                <View
                  style={{ flex: 1 }}
                >
                  <View
                    style={{ 
                      flex: 1.7,
                      justifyContent: 'center',
                      marginLeft: -15
                    }}
                  >
                    <View
                      style={{ flexDirection: 'row', marginTop: -9, marginLeft: 50 }}
                    >
                      <Text
                        style={{ 
                          fontSize: 30,
                          flex: 1,
                          fontWeight: 'bold',
                          color: '#142653'
                        }}
                      >
                        3
                        <Text
                          style={{ 
                            fontSize: 10,
                            fontWeight: '600',
                            color: '#142653'
                          }}
                        >
                          Jam
                        </Text>
                      </Text>
                      <Text
                        style={{ 
                          fontSize: 30,
                          flex: 1.5,
                          fontWeight: 'bold',
                          color: '#142653'
                        }}
                      >
                        55
                        <Text
                          style={{ 
                            fontSize: 10,
                            fontWeight: '600',
                            color: '#142653'
                          }}
                        >
                          Menit
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* SECTION 05 : POLA TIDUR */}
          <View
            style={{ 
              marginLeft: 20,
              marginRight: 20
             }}
          >
            <View
              style={{ 
                backgroundColor: '#fff',
                padding: 20, 
                borderRadius: 10,
                marginTop: 15
               }}
            >
              <View
                style={{ flexDirection: 'row' }}
              >
                <Text
                  style={{ 
                    flex: 1,
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#1D2E69'
                   }}
                >
                  Pola Tidur
                </Text>
                <View
                  style={{ 
                    flex: 1,
                    justifyContent: 'center'
                  }}
                >
                  <Text
                    style={{ 
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: '#1D2E69'
                    }}
                  >
                    7 Hari Terakhir
                  </Text>
                </View>
              </View>
              
              {/* SEPARATOR */}
              <View 
                style={{ 
                  height: 2,
                  backgroundColor: '#3F338A66',
                  marginTop: 15,
                  marginBottom: 0
                }}
              />

              <View
                style={{ 
                  width: '100%'
                 }}
              >
                <View
                  style={{ 
                    flexDirection: 'row',
                    marginTop: 10,
                    marginLeft: -1
                  }}
                >
                  {/* DATE 1 */}
                  <View
                    style={{ 
                      height: 250,
                      justifyContent: 'flex-end'
                    }}
                  >
                    <Text
                      style={{ textAlign: 'center', marginBottom: 5, fontSize: 10 }}
                    >
                      3h
                    </Text>
                    <View
                      style={{ 
                        width: 35,
                        backgroundColor: '#253C7F',
                        height: 30,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                       }}
                    />
                    <Text
                      style={{ textAlign: 'center', marginTop: 10, fontSize: 10 }}
                    >
                      01 Nov
                    </Text>
                  </View>

                  {/* DATE 2 */}
                  <View
                    style={{ 
                      height: 250,
                      justifyContent: 'flex-end', 
                      marginLeft: 15
                    }}
                  >
                    <Text
                      style={{ textAlign: 'center', marginBottom: 5, fontSize: 10 }}
                    >
                      9h
                    </Text>
                    <View
                      style={{ 
                        width: 35,
                        backgroundColor: '#253C7F',
                        height: 180,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                       }}
                    />
                    <Text
                      style={{ textAlign: 'center', marginTop: 10, fontSize: 10 }}
                    >
                      02 Nov
                    </Text>
                  </View>

                  {/* DATE 3 */}
                  <View
                    style={{ 
                      height: 250,
                      justifyContent: 'flex-end', 
                      marginLeft: 15
                    }}
                  >
                    <Text
                      style={{ textAlign: 'center', marginBottom: 5, fontSize: 10 }}
                    >
                      4h
                    </Text>
                    <View
                      style={{ 
                        width: 35,
                        backgroundColor: '#253C7F',
                        height: 80,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                      }}
                    />
                    <Text
                      style={{ textAlign: 'center', marginTop: 10, fontSize: 10 }}
                    >
                      03 Nov
                    </Text>
                  </View>

                  {/* DATE 4 */}
                  <View
                    style={{ 
                      height: 250,
                      justifyContent: 'flex-end', 
                      marginLeft: 15
                    }}
                  >
                    <Text
                      style={{ textAlign: 'center', marginBottom: 5, fontSize: 10 }}
                    >
                      6h
                    </Text>
                    <View
                      style={{ 
                        width: 35,
                        backgroundColor: '#253C7F',
                        height: 130,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                      }}
                    />
                    <Text
                      style={{ textAlign: 'center', marginTop: 10, fontSize: 10 }}
                    >
                      04 Nov
                    </Text>
                  </View>

                  {/* DATE 5 */}
                  <View
                    style={{ 
                      height: 250,
                      justifyContent: 'flex-end', 
                      marginLeft: 15
                    }}
                  >
                    <Text
                      style={{ textAlign: 'center', marginBottom: 5, fontSize: 10 }}
                    >
                      7h
                    </Text>
                    <View
                      style={{ 
                        width: 35,
                        backgroundColor: '#253C7F',
                        height: 150,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                      }}
                    />
                    <Text
                      style={{ textAlign: 'center', marginTop: 10, fontSize: 10 }}
                    >
                      05 Nov
                    </Text>
                  </View>

                  {/* DATE 6 */}
                  <View
                    style={{ 
                      height: 250,
                      justifyContent: 'flex-end', 
                      marginLeft: 15
                    }}
                  >
                    <Text
                      style={{ textAlign: 'center', marginBottom: 5, fontSize: 10 }}
                    >
                      8h
                    </Text>
                    <View
                      style={{ 
                        width: 35,
                        backgroundColor: '#253C7F',
                        height: 170,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                      }}
                    />
                    <Text
                      style={{ textAlign: 'center', marginTop: 10, fontSize: 10 }}
                    >
                      06 Nov
                    </Text>
                  </View>

                  {/* DATE 7 */}
                  <View
                    style={{ 
                      height: 250,
                      justifyContent: 'flex-end', 
                      marginLeft: 15
                    }}
                  >
                    <Text
                      style={{ textAlign: 'center', marginBottom: 5, fontSize: 10 }}
                    >
                      1h
                    </Text>
                    <View
                      style={{ 
                        width: 35,
                        backgroundColor: '#253C7F',
                        height: 10,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                      }}
                    />
                    <Text
                      style={{ textAlign: 'center', marginTop: 10, fontSize: 10 }}
                    >
                      07 Nov
                    </Text>
                  </View>
                </View>

                <View
                  style={{ 
                    flexDirection: 'row',
                    marginTop: 15
                  }}
                >
                  <View
                    style={{ 
                      backgroundColor: '#E8EAF3',
                      width: '100%',
                      flex: 1,
                      marginRight: 10,
                      borderRadius: 5
                    }}
                  >
                    <View>
                      <Text
                        style={{ 
                          textAlign: 'center',
                          paddingTop: 10,
                          fontWeight: 'bold',
                          color: '#1D2E69', 
                        }}
                      >
                        Tidur Siang
                      </Text>
                      <Text
                        style={{ 
                          textAlign: 'center',
                          paddingBottom: 10
                        }}
                      >
                        29 Jam
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{ 
                      backgroundColor: '#E8EAF3',
                      width: '100%',
                      flex: 1,
                      marginLeft: 10,
                      borderRadius: 5
                    }}
                  >
                    <View>
                      <Text
                        style={{ 
                          textAlign: 'center', 
                          paddingTop: 10,
                          fontWeight: 'bold',
                          color: '#1D2E69', 
                        }}
                      >
                        Rata-rata
                      </Text>
                      <Text
                        style={{ 
                          textAlign: 'center',
                          paddingBottom: 10
                        }}
                      >
                        5 Jam
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* SECTION 06 : HEART RATE */}
          <View
            style={{ 
              marginLeft: 20,
              marginRight: 20
            }}
          >
            <View
              style={{ 
                backgroundColor: '#fff',
                padding: 20, 
                borderRadius: 10,
                marginTop: 15
              }}
            >
              <View
                style={{ flexDirection: 'row' }}
              >
                <Text
                  style={{ 
                    flex: 1,
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#1D2E69'
                  }}
                >
                  Detak Jantung
                </Text>
                <View
                  style={{ 
                    flex: 1,
                    justifyContent: 'center'
                  }}
                >
                  <Text
                    style={{ 
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: '#1D2E69'
                    }}
                  >
                    7 Hari Terakhir
                  </Text>
                </View>
              </View>
              
              <View
              style={{ width: '100%', marginTop: 15 }}>
                <Image 
                  source={hr_ic}
                  style={{ width: '100%', height: 120, marginBottom: 15 }}
                />
              </View>

              <View
                style={{ flexDirection: 'row' }}
              >
                <View
                  style={{ flex: 1 }}
                >
                  <Text style={{ textAlign: 'center', fontSize: 17, color: '#142653' }}>Min</Text>
                  <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#F95463' }}>74 <Text style={{ fontWeight: 'normal' }}>bpm</Text></Text>
                </View>
                <View
                  style={{
                    width: 1,
                    backgroundColor: '#BFBFBF'
                  }}
                />
                <View
                  style={{ flex: 1 }}
                >
                  <Text style={{ textAlign: 'center', fontSize: 17, color: '#142653' }}>Max</Text>
                  <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#F95463' }}>132 <Text style={{ fontWeight: 'normal' }}>bpm</Text></Text>
                </View>
                <View
                  style={{
                    width: 1,
                    backgroundColor: '#BFBFBF'
                  }}
                />
                <View
                  style={{ flex: 1 }}
                >
                  <Text style={{ textAlign: 'center', fontSize: 17, color: '#142653' }}>Avg</Text>
                  <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#F95463' }}>91 <Text style={{ fontWeight: 'normal' }}>bpm</Text></Text>
                </View>
              </View>
            </View>
          </View>

          {/* SECTION 07 : SPo2 */}
          <View
            style={{ 
              marginLeft: 20,
              marginRight: 20
            }}
          >
            <View
              style={{ 
                backgroundColor: '#fff',
                padding: 20, 
                borderRadius: 10,
                marginTop: 15
              }}
            >
              <View
                style={{ flexDirection: 'row' }}
              >
                <Text
                  style={{ 
                    flex: 1,
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#1D2E69'
                  }}
                >
                  Oxygen (SPo2)
                </Text>
                <View
                  style={{ 
                    flex: 1,
                    justifyContent: 'center'
                  }}
                >
                  <Text
                    style={{ 
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: '#1D2E69'
                    }}
                  >
                    {/* EMPTY */}
                  </Text>
                </View>
              </View>

              <View
                style={{ flexDirection: 'row' }}
              >
                <View
                  style={{ flex: 1, marginTop: 10 }}
                >
                  <View 
                    style={{ 
                      flexDirection: 'row'
                     }}
                  >
                    <View
                      style={{ flex: 1 }}
                    >
                      <View 
                        style={{ width: 5, height: 40, backgroundColor: '#4E68C1', borderRadius: 5 }}
                      />
                    </View>
                    <View
                      style={{ flex: 4, marginTop: 2, marginLeft: -20 }}
                    >
                      <Text style={{ color: '#111B57', fontWeight: 'bold' }}>Maksimum</Text>
                      <Text style={{ color: '#14265399' }}>94 SPo2</Text>
                    </View>
                  </View>
                  <View 
                    style={{ 
                      flexDirection: 'row', marginTop: 10
                     }}
                  >
                    <View
                      style={{ flex: 1 }}
                    >
                      <View 
                        style={{ width: 5, height: 40, backgroundColor: '#4E68C1', borderRadius: 5 }}
                      />
                    </View>
                    <View
                      style={{ flex: 4, marginTop: 2, marginLeft: -20 }}
                    >
                      <Text style={{ color: '#111B57', fontWeight: 'bold' }}>Minimum</Text>
                      <Text style={{ color: '#14265399' }}>82 SPo2</Text>
                    </View>
                  </View>
                  <View 
                    style={{ 
                      flexDirection: 'row', marginTop: 10
                     }}
                  >
                    <View
                      style={{ flex: 1 }}
                    >
                      <View 
                        style={{ width: 5, height: 40, backgroundColor: '#4E68C1', borderRadius: 5 }}
                      />
                    </View>
                    <View
                      style={{ flex: 4, marginTop: 2, marginLeft: -20 }}
                    >
                      <Text style={{ color: '#111B57', fontWeight: 'bold' }}>Average</Text>
                      <Text style={{ color: '#14265399' }}>88 SPo2</Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{ flex: 1, justifyContent: 'center', marginTop: 25 }}
                >
                  <View
                    style={{ alignItems: 'center', marginLeft: 30 }}
                  >
                    <View
                      style={{ marginBottom: -86 }}
                    >
                      <Text style={{ color: '#1D2E69', fontSize: 35 }}>94</Text>
                      <Text style={{ textAlign: 'center', marginTop: -5, color: '#1D2E69' }}>SPo2</Text>
                    </View>
                    <Image 
                      source={spo2_ic}
                      style={{ width: 72, height: 91, marginTop: 10 }}
                    />
                    <View
                      style={{ marginTop: 10, borderWidth: 2, padding: 8, borderRadius: 20 }}
                    >
                      <Text style={{ color: '#111B57', fontWeight: 'bold' }}>7 February 2024</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View>
            <Image 
              source={banner_1}
              style={{ width: '100%', marginTop: 20, height: 290 }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
};

export default Homepage;