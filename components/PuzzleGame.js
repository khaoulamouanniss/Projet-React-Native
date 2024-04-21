//PuzzleGame component

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ImageBackground,TouchableWithoutFeedback } from 'react-native';

import Title from './Title';
import Puzzle from './Puzzle';
import Statistics from './Statistics';
import Banner from './Banner'; 
import ToolBar from './ToolBar';
import SizeSelector from './SizeSelector';
import { generatePuzzle, newPuzzle, move_cb } from '../js/utils';
const backImage = require('../pics/back-app.jpg');

export default  PuzzleGame = ({titleLabel, bestLabel, worstLabel, currentLabel, newLabel, msgLabel, language}) => {

    // State hooks
    const [params,setParams] = useState({maxLine:3,maxColumn:3,empty:''}) //the params of the puzzle
    const [puzzle2D, setPuzzle2D] = useState(generatePuzzle(params.maxLine,params.maxColumn,params.empty)); 
    const [selectionMoves, setSelectionMoves] = useState({moves:0, bestMoves:0, worstMoves:0})
    const [isSolved, setIsSolved] = useState(false); // if the puzzle is resolved or not
    const [sizeSelectorVisible, setSizeSelectorVisible] = useState(false);

    useEffect(() => {
        newPuzzle(params, setPuzzle2D, setSelectionMoves, setIsSolved);  // Generate a new puzzle when the component mounts
    }, [params]);

    /**
     * Function to handle changes in puzzle size
     * @param {*} size the new size of the column or the line
     * @param {*} type column or line
     */
    const handleSizeChange = (size, type) => {
        if (type === 'line') {
            setParams(prev => ({ ...prev, maxLine: parseInt(size) }));
        } else if (type === 'column') {
            setParams(prev => ({ ...prev, maxColumn: parseInt(size) }));
        }
    };

    /**
     * handle outside taps to close any open selectors
     */
    const handleOutsideTap = () => {
      setSizeSelectorVisible(null); // close any opened selector
    };

    /**
     * toggle visibility of the size selector
     * @param {*} selectorType line selector or column selector
     */
    const toggleVisibility = (selectorType) => {
      setSizeSelectorVisible(prev => prev === selectorType ? null : selectorType);
    };

    const numbers = ['3', '4', '5'];


    return (

        <TouchableWithoutFeedback onPress={handleOutsideTap}>
          {/**This component is used to detect and handle touch interactions without any feedback */}
            <View style={styles.app}>

                <Title 
                    style= {styles.titleBackground} 
                    text = {titleLabel} 
                    iconName="puzzle-piece" 
                    language={language}
                />
            
                <View> 
                    <Statistics 
                        bestLabel={bestLabel} 
                        worstLabel={worstLabel} 
                        currentLabel={currentLabel} 
                        best={selectionMoves.bestMoves} 
                        worst={selectionMoves.worstMoves} 
                        current={selectionMoves.moves} 
                        language={language} 
                    />
                </View>

                <ImageBackground 
                    source={backImage} 
                    style={styles.backImage}
                >
                    <View>
                        <Banner 
                            isVisible={isSolved} 
                            message={msgLabel} 
                        /> 
                    </View>

                    <View style={styles.game}>
                        <Puzzle 
                            puzzle2D={puzzle2D} 
                            usrOnPress_cb={(l, c) => move_cb(l, c, puzzle2D, params, setPuzzle2D, selectionMoves, setSelectionMoves, setIsSolved)} 
                            dim ={params.maxLine * params.maxColumn} 
                        />
                    </View>

                    <View style={styles.sizeSelectorConainers}>
                        <SizeSelector
                            iconName="bars"
                            onSizeChange={handleSizeChange}
                            initialSize={params.maxLine.toString()}
                            type="line"
                            isVisible={sizeSelectorVisible === 'line'}
                            setIsVisible={setSizeSelectorVisible}
                            toggleVisibility={() => toggleVisibility('line')}
                        />
                        <SizeSelector
                            iconName="bars"
                            onSizeChange={handleSizeChange}
                            initialSize={params.maxColumn.toString()}
                            iconStyle= {{ transform: [{ rotate: '90deg' }] }}
                            type="column"
                            isVisible={sizeSelectorVisible === 'column'}
                            setIsVisible={setSizeSelectorVisible}
                            toggleVisibility={() => toggleVisibility('column')}
                        />
                    </View> 
                </ImageBackground>

                <ToolBar 
                    onNewPuzzle={newPuzzle} 
                    newLabel={newLabel} 
                />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
  app: {
    height:'85%', 
  },
  game: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'column',
  },
  titleBackground: {
    marginTop: 20,  
    backgroundColor: '#780001',  
    width: '100%',  
    textAlign: 'center',
    padding: 10,  
    borderRadius: 25 
  },
  backImage: {
    flex:1,
    borderTopLeftRadius:25,
    borderTopRightRadius:25,
    justifyContent: 'space-between',
  },
  button: {
    width: 50,
    alignSelf: 'center',
    borderRadius: 50,
    backgroundColor: '#780001',
    padding: 10,
    zIndex:20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    top: -1, 
    left:120,
    paddingVertical: 5,
    minWidth: 40, 
    zIndex: 1,
    maxWidth:50,
  },
  optionsContainerLeft: {
    left: 34,
  },
  optionsContainerRight: {
    right: -16,
  },
  optionSelected: {
    backgroundColor: '#d3252f',
  },
  optionUnselected: {
    backgroundColor: '#780001',
  },
  option: {
    paddingVertical: 1,
    paddingHorizontal: 2,
    alignItems: 'center', 
    borderRadius:10,
  },
  optionText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
  },
  sizeSelectorConainers: {
    flexDirection:'row', 
    justifyContent:'space-around',
  },
});
