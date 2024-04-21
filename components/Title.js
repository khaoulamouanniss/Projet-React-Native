// Title component

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Install using: npx expo install expo-linear-gradient
import Icon from 'react-native-vector-icons/FontAwesome';//Install npm install react-native-vector-icons

const Title = ({ text, style,iconName, language}) => {
    const isArabic = language === 'ar';
    return (
        <View style={[styles.container, isArabic ? { flexDirection: 'row-reverse' } : { flexDirection: 'row' }, style]}>
            {/*if the language is arabic we display with raw-reverse so as to the pic will be on the right of the text */}
            {iconName && (
                <Icon 
                    name={iconName} 
                    size={25} 
                    color="#fbf0d4" 
                    style={styles.icon} 
                />
            )}
            <Text style={styles.titleText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  
  container: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: 10,
    width: '100%',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10, 
    marginLeft: 10,
  },
  titleText: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#fbf0d4',
  },
});

export default Title;
