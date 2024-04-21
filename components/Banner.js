//Banner Component : The message that will be showed once the puzzle is solved

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

    
const Banner = ({ isVisible, message }) => {

  return (
    <View style={styles.banner}>
    <Text style={[styles.bannerText, { opacity: isVisible ? 1 : 0 }]}>{message}</Text>
  </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    marginTop:10,
    zIndex: 1,
    backgroundColor: 'transparent',
    marginBottom:-10,
  },
  bannerText: {
    color: '#012f47',
    fontSize: 40,
    textAlign: 'center',
    fontFamily: 'Handlee',
  },
});

export default Banner;
