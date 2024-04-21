//ButtonHeader component

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; //To install : npm install react-native-vector-icons
//use icons from https://fontawesome.com/icons

const ButtonHeader = ({ iconName, label, onPress, currentLanguage,  showOptions, onSelectLanguage }) => {
    const languages = {
      'ar': 'العربية',
      'fr': 'Français',
      'en': 'English'
    };
    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.button} 
                onPress={onPress}
            >
            <Icon 
                name={iconName} 
                size={15} 
                style={styles.icon}
            />
            {label && (
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>{currentLanguage? languages[label] :label}</Text>
                </View>
            )}
            </TouchableOpacity>
        
            <View style={styles.triangle} />
            {showOptions && (
                <View style={[styles.optionsContainer,currentLanguage ==='ar'? styles.optionsContainerLeft : styles.optionsContainerRight]}>
                    { Object.entries(languages).map(([key, value]) => (
                        <TouchableOpacity
                            key={key}
                            style={[styles.option, currentLanguage === key ? styles.optionSelected : styles.optionUnselected]}
                            onPress={() => onSelectLanguage(key)}
                        >
                            <Text style={styles.optionText}>{value}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    margin:5,
  },
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d3252f', 
    paddingHorizontal: 5,
    paddingVertical: 5,
    width:39,
    zIndex:20,
  },
  icon: {
    marginBottom: 1, 
    color:"#fff",
  },
  labelContainer: {
    backgroundColor: '#fbf0d4',
    borderRadius: 10,
    marginTop: 4, 
    paddingHorizontal: 3, 
  },
  labelText: {
    color: '#012f47',
    textAlign: 'center',
    fontSize: 6, 
  },
  triangle: {
    backgroundColor: 'transparent', 
    borderStyle: 'solid',
    borderLeftWidth: 19.5,
    borderRightWidth: 19.5,
    borderBottomWidth:10, 
    borderLeftColor: '#d3252f', 
    borderRightColor: '#d3252f',
    borderBottomColor: 'transparent', 
    zIndex:20,
  },
  optionsContainer: {
    position: 'absolute',
    top: -1, 
    paddingVertical: 5,
    minWidth: 100, 
    zIndex: 1,
    maxWidth:50,
  },
  optionsContainerLeft: {
    left: 34,
  },
  optionsContainerRight: {
    right: -16,
  },
  option: {
    paddingVertical: 1,
    paddingHorizontal: 2,
    alignItems: 'center', 
    borderRadius:10,
    },
  optionSelected: {
    backgroundColor: '#780001',
  },
  optionUnselected: {
    backgroundColor: '#d3252f',
  },
  optionText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 8,
  },
  });

export default ButtonHeader;
