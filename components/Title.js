// Title component

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Install using: npx expo install expo-linear-gradient

const Title = ({ text, style}) => (
    <LinearGradient
        colors={['grey', 'darkred']} // Gradient from grey to dark red for the title's background
        start={{ x: 0, y: 0 }} //Top left
        end={{ x: 0, y: 1 }} //The gradient moves vertically, for horizontal use end={{ x: 1, y: 0 }}
        style={[styles.title, style]}
    >
        <View style={styles.container}>
            <Image 
                source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/CollegeLionelGroulx.jpg/500px-CollegeLionelGroulx.jpg" }} 
                style={styles.logo} 
            />
            <Text style={styles.titleText}>{text}</Text>
        </View>
    </LinearGradient>
);

const styles = StyleSheet.create({
  linearGradient: {
    padding: 20, 
    borderRadius: 5,
  },
  container: {
    flexDirection: 'row', // Align horizontally
    alignItems: 'center', // Center vertically
  },
  logo: {
    width: 50, 
    height: 50, 
    marginRight: 10, 
    borderRadius:10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
    padding: 10,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});

export default Title;
