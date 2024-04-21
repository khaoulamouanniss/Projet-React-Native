//Puzzle component

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Line = ({ children }) => {
    return <View style={styles.line}>{children}</View>;
}

const Box = ({ value, usrOnPress_cb,size, fontSize }) => {
    const isEmpty = value === "" || value === null || value === 0;
    return (
        <TouchableOpacity 
            style={[styles.box,{ width: size, height: size }, !isEmpty ? styles.nonEmptyBox : styles.emptyBox]} 
            onPress={usrOnPress_cb}
        >
            <Text style={[styles.value, { fontSize: fontSize }]}>{value}</Text>
        </TouchableOpacity>
    );
}

const Puzzle = ({ puzzle2D, usrOnPress_cb, dim }) => {

    const baseSize = 50; // for 3x3 puzzles
    const scaleFactor = Math.sqrt(dim) / 3.5; // scaling down as the number of boxes increases
    const boxSize = baseSize / scaleFactor;
    const fontSize = boxSize / 2.5;

    return (
        <View style={styles.puzzle}>
            {puzzle2D.map((line, l) => (
                <Line key={l}>
                    {line.map((value, c) => (
                        <Box
                            key={c}
                            value={value}
                            usrOnPress_cb={() => usrOnPress_cb(l, c)}
                            size={boxSize}
                            fontSize={fontSize}
                        />
                    ))}
                </Line>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
  puzzle: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:-50,
  },
  line: {
    flexDirection: 'row',
  },
  box: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderStyle: 'solid',
    backgroundColor: '#780001',
    margin: 2, 
    borderRadius: 5,
  },
  emptyBox: {
    backgroundColor: 'transparent',
    borderWidth: 0,  
  },
  nonEmptyBox: {
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, 
    shadowRadius: 5,
    elevation: 10,  
  },
  value: {
    fontSize: 24,
    fontWeight:'bold',
    color:'#fbf0d4'
  },
});

export default Puzzle;
