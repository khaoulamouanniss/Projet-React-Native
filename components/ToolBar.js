//Toolbar component : contains the button new puzzle

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from './Button';


const ToolBar = ({ onNewPuzzle, newLabel }) => {
    return (
        <View style={styles.toolBar}>
            <Button 
                title={newLabel} 
                onPress={onNewPuzzle}
                style={{backgroundColor:'transparent'}} //to use the background of the component
                textStyle={styles.buttonText}
            />     
        </View>
    );
};

const styles = StyleSheet.create({
  toolBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#659cbb',
    width: '100%', 
    alignSelf: 'flex-end', //align the component at the bottom
    marginTop:10,
    marginBottom:10,
    borderBottomRightRadius:25,
    borderBottomLeftRadius:25,
    zIndex:10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    marginBottom:-10,
  },
});


export default ToolBar;
