//Selector component : used to select the course to register for

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; //Install using: npm install @react-native-picker/picker

const Selector = ({ selectedValue, onValueChange, items, item0, style, pickerStyle }) => (
    <View style={[styles.container, style]}>
        <Picker
            selectedValue={selectedValue}
            onValueChange={(item) => onValueChange(item)}
            style={[styles.picker, pickerStyle]}
        >
            <Picker.Item label={item0} value=""  />
            {items.map((item) => (
                <Picker.Item key={item.value} label={item.label} value={item.value} />
            ))}
        </Picker>
    </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default Selector;
