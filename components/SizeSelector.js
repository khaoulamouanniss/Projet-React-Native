//SizeSelector component

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Button from './Button';  

const SizeSelector = ({ iconName, onSizeChange, initialSize = '3', iconStyle, type,isVisible, toggleVisibility }) => {
    
    const [selectedSize, setSelectedSize] = useState(initialSize);
    const sizes = ['3', '4', '5'];

    return (
        <View style={styles.container}>
            <Button
                iconName={iconName}
                onPress={toggleVisibility}
                style={styles.button}
                iconStyle={iconStyle}
            />

            {isVisible && (
                <View style={[styles.optionsContainer,type ==='line'? styles.optionsContainerRight : styles.optionsContainerLeft]}>
                    {sizes.map(size => (
                        <TouchableOpacity
                            key={size}
                            style={[styles.option, selectedSize === size ? styles.optionSelected : styles.optionUnselected]}
                            onPress={() => {
                                setSelectedSize(size);
                                onSizeChange(size, type);
                                toggleVisibility();
                            }}
                        >
                            <Text style={styles.optionText}>{size}</Text>
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
    },
    button: {
      width: 50,
      alignSelf: 'center',
      borderRadius: 50,
      backgroundColor: '#d3252f',
      padding: 10,
      zIndex:20,
    },
    optionsContainer: {
        position: 'absolute',
        top: 5,
        flexDirection:'row',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        padding: 5,
        borderRadius: 10,
        maxWidth: 100,
        zIndex: 20000,
    },
    optionsContainerLeft: {
      left: -70,
    },
    optionsContainerRight: {
      right: -70,
    },
    option: {
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 5,
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
        fontSize: 16,
    },
});

export default SizeSelector;
