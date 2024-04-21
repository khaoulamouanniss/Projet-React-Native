//Button component

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Button = ({ title, onPress,style, textStyle, iconName, iconStyle }) => (
    <TouchableOpacity 
        onPress={onPress} 
        style={[styles.button, style]}
    >
        {iconName && (
            <Icon 
                name={iconName} 
                size={24} 
                color= '#fbf0d4' 
                style={iconStyle}
            />
        )}
        {title && (
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        )}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#d3252f',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fbf0d4',
    fontWeight: 'bold',
  },
  icon: {
    color: '#fbf0d4',
  }
});

export default Button;
