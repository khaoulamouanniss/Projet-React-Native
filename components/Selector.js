//Selector component : used to select the course to register for

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; //Install using: npm install @react-native-picker/picker
import RNPickerSelect from 'react-native-picker-select'; //Install npm install react-native-picker-select

const Selector = ({ selectedValue, onValueChange, items, item0, style, pickerStyle }) => (
    <View style={[styles.container, style]}>
       {/* <Picker
            selectedValue={selectedValue}
            onValueChange={(item) => onValueChange(item)}
            style={[styles.picker, pickerStyle]}
        >
            <Picker.Item label={item0} value=""  />
            {items.map((item) => (
                <Picker.Item key={item.value} label={item.label} value={item.value} />
            ))}
            </Picker>*/}
        <RNPickerSelect
            onValueChange={onValueChange}
            items={items.map(item => ({ key:item.value,label: item.label, value: item.value }))}
            value={selectedValue}
            placeholder={{ label: item0, value: null }}
            style={{...pickerStyle, inputIOS: styles.picker, inputAndroid: styles.picker}}        />
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
    backgroundColor: 'white',
  },
});

export default Selector;
