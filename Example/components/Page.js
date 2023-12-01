import React from 'react';
import {SafeAreaView, View } from 'react-native';

const Page = ({ children }) => (
  <View>
    <SafeAreaView>{children}</SafeAreaView>
  </View>
);

export default Page;
