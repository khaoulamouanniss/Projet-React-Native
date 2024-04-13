//Selector component

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; //Install using: npm install @react-native-picker/picker

const Selector = ({ selectedValue, onValueChange, items }) => (
    <View style={styles.container}>
        <Picker
            selectedValue={selectedValue}
            onValueChange={(item) => onValueChange(item)}
            style={styles.picker}
        >
            <Picker.Item label="Sélectionnez un cours" value="" />
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
