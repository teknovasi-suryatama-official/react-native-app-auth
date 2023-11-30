import React from 'react';
import { StyleSheet, View } from 'react-native';

const ButtonContainer = props => <View style={styles.view} {...props} />;

const styles = StyleSheet.create({
  view: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    margin: 5,
  }
});

export default ButtonContainer;
