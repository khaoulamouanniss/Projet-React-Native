//Button component

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ title, onPress,style, textStyle }) => (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'darkred',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Button;
