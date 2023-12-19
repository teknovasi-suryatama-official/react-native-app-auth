import React from 'react';
import { ImageBackground, StyleSheet, SafeAreaView, Text, View } from 'react-native';

const Page = ({ children }) => (
  <View>
    <SafeAreaView>{children}</SafeAreaView>
  </View>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 40,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});

export default Page;
