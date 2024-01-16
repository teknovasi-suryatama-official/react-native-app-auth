import { 
  Image,
  ScrollView,
  Text, 
  View 
} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

import smart_safety_ic from '../../../assets/smart_safety/ic_smart_safety.png';

const Upload = () => {
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

          {/* SECTION 02 : PRESENCE SLEEP */}
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
                style={{ flexDirection: 'column' }}
              >
                <Text
                  style={{ 
                    flex: 1,
                    fontSize: 19,
                    fontWeight: 'bold',
                    color: '#1D2E69',
                    marginTop: -3
                  }}
                >
                  Absen Tidur 07 November 2023
                </Text>
                <Text
                  style={{ 
                    flex: 1,
                    fontSize: 15,
                    fontWeight: '600',
                    color: '#1D2E69',
                    marginTop: 3
                  }}
                >
                  Asep Septiadi - NRP 9001815
                </Text>
                
                <View
                  style={{ 
                    flexDirection: 'row',
                    marginTop: 20
                   }}
                >
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
                        style={{ flexDirection: 'row', marginTop: -9, paddingLeft: 16 }}
                      >
                        <Text
                          style={{ 
                            fontSize: 30,
                            flex: 1,
                            fontWeight: 'bold',
                            color: '#142653'
                          }}
                        >
                          08
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
                            flex: 3.5,
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
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Upload;