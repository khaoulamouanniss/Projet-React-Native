//CustomTextInput component (id)

import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const CustomTextInput = (props) => (
    <TextInput
        style={styles.input}
        {...props}  //same properties of TextInput
    />
);

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

export default CustomTextInput;
