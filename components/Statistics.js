//Statistics component : to show the best, worst and current score

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Statistics = ({ bestLabel, worstLabel, currentLabel, best, worst, current, language }) => {
    return (
        <View style={styles.statistics}>
            <View style={[styles.statistic, styles.statisticLeft]}>
                {language === 'ar' ? ( //if selected language is arabic, we switch the order, didn't use flexDirection because of the style (the border)
                    <>
                        <Text style={styles.label}>{currentLabel}</Text>
                        <Text style={styles.value}>{current}</Text>
                    </>
                ) : (
                    <>
                        <Text style={styles.label}>{bestLabel}</Text>
                        <Text style={styles.value}>{best}</Text>
                    </>
                )}
            </View>
            <View style={styles.statistic}>
                <Text style={styles.label}>{worstLabel}</Text>
                <Text style={styles.value}>{worst}</Text>
            </View>
            <View style={[styles.statistic, styles.statisticRight]}>
                {language === 'ar' ? ( //same, we switch and the middle one stays at its order
                    <>
                        <Text style={styles.label}>{bestLabel}</Text>
                        <Text style={styles.value}>{best === Infinity ? "N/A" : best}</Text>
                    </>
                ) : (
                    <>
                        <Text style={styles.label}>{currentLabel}</Text>
                        <Text style={styles.value}>{current}</Text>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  statistics: {
    flexDirection: 'row',
    marginBottom:10,
  },
  statistic: {
    flex: 1, 
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 0, 
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#ffffff', 
    backgroundColor: '#659cbb',
  },
  statisticLeft: {
    borderTopLeftRadius: 25, 
    borderRightWidth: 0.5, 
  },
  statisticRight: {
    borderTopRightRadius: 25, 
    borderRightWidth: 0, 
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#012f47',
    marginBottom: 5, 

  },
  value: {
    fontSize: 18,
    fontWeight: 'bold', 
    color: '#012f47',
  },
});

export default Statistics;
