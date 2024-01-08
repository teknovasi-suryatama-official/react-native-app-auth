import React from 'react';

import Home from './src/screen/Home/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screen/Login';
import Splash from './src/screen/Splash';
import Homepage from './src/screen/Smartsafety/Homepage';
import Upload from './src/screen/Smartsafety/Upload';

const App = () => {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Splash" 
          component={Splash} 
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="Homepage" 
          component={Homepage} 
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="UploadPresence" 
          component={Upload} 
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
