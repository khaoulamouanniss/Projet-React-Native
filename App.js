/**
 * 
 * Fait par : Khaoula El mouanniss
 * Le 20 avril 2024
 * color palette used : #780001, #d3252f, #fbf0d4, #012f47, #659cbb
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Image, Modal, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, BackHandler  } from 'react-native';
import { I18n } from 'i18n-js'; //npx expo install i18n-js
import * as Localization from 'expo-localization'; //npx expo install expo-localization 
import translation from './js/translation';
import CustomTextInput from './components/CustomTextInput';
import Selector from './components/Selector';
import Button from './components/Button';
import Title from './components/Title';
import availableCourses from './js/courses';
import sessions from './js/sessions';
import PuzzleGame from './components/PuzzleGame';
import ButtonHeader from './components/ButtonHeader';
import { useFonts } from 'expo-font'; //npx expo install expo-font
import * as SplashScreen from 'expo-splash-screen';
//npx expo install expo-app-loading (depricated)  
//npm install expo-splash-screen
/** * add in app.json dans plugins:
 * "plugins": [
      "expo-localization",
      "expo-font",
      {
        "fonts": ["path/to/file.ttf"]
      }
      and look for the font we need in google fonts, download it and put it in the project folder (for this project the folder's name is fonts)
 */


//App starting      
export default function App() {

    // State hooks
    
    const [students, setStudents] = useState([]); //list of students : array of objects
    const [studentId, setStudentId] = useState(''); //The id entered by user
    const [selectionState, setSelectionState] = useState({ 
        selectedStudent: null, 
        selectedCourse: '',
        filteredCourses: [] //list of courses of the session of the student selected
    });
    const [error, setError] = useState({ 
        error1: '', 
        error2: '', 
        error3: '' 
    });
    const [modalVisible, setModalVisible] = useState(false); //the showing modal
    const [language, setLanguage] = useState(Localization.getLocales()[0].languageCode); //language initialised with the default language of the device
    const [showLanguageOptions, setShowLanguageOptions] = useState(false);
    const [showPuzzleGame, setShowPuzzleGame] = useState(false);
    const [appIsReady, setAppIsReady] = useState(false); //for the font

    const [fontsLoaded] = useFonts({
        Handlee: require('./fonts/Handlee-Regular.ttf'),  // Assurez-vous que le chemin est correct
    });
    const translate = new I18n(translation);
    translate.locale = language;

    // Effect for initializing the app
    useEffect(() => {
        async function prepare() {
            try {
                // Keep the splash screen visible while we fetch resources
                await SplashScreen.preventAutoHideAsync();
                // Artificially delay for demonstration purposes
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (e) {
                console.warn(e);
            } finally {
                // When everything is ready, hide the splash screen
                await SplashScreen.hideAsync();
                setAppIsReady(true);  // Set appIsReady to true here
            }
        }
    
        prepare();
    }, []);

    //Effect for loading student data
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/khaoulamouanniss/Projet-React-Native/main/students.json')
            .then(response => response.json())
            .then(data => setStudents(data))
            .catch(error => {
                setError({ error1: translate.t("errorLoading") });
            });
    }, []);

    
    //Effect for updating courses when the selected student changes
    useEffect(() => {
        if (selectionState.selectedStudent) {
            const session = sessions.find(session => session.session_id === selectionState.selectedStudent.session);
            const availableCoursesForSession = session ? session.courses.map(courseId => availableCourses.find(course => course.course_id === courseId)) : []; //.filter(Boolean)
            setSelectionState(prev => ({ ...prev, filteredCourses: availableCoursesForSession }));
        }
    }, [selectionState.selectedStudent]);
    
    // Conditionally rendering content based on the app readiness
    if (!appIsReady) {
        return null; // Return null while preparing the app
    }

    /**
     * check if a student id exists in the list of students
     * @param {*} students list of the students
     * @param {*} id the input id we're looking for
     * @returns the students if it exists or null if it doesnt
     */
    const checkStudentExists = (id) => {
        const student = students.find(s => s.student_id === id);
        if (!student) {
            setError({ error1: translate.t("noStudentId") });
            return null;
        } else {
            setError({ error1: `${translate.t("student")}: ${student.name}`, error2: translate.t("confirmSelection") });
            return student;
        }
      };

    /**
       * the function we call once clicking on select the student, it the student exists we update the selected student
       * @param {*} id the input id we're looking for
    */
    const handleSelectStudent = (id) => {
        const student = checkStudentExists(id);
        if (student) {
            setSelectionState({
                selectedStudent: student,
                selectedCourse: '',
                filteredCourses: []
            });
            //updateFilteredCourses(student.session);
            setError({ error2: translate.t("studentSelected") });
        } else {
            setSelectionState({ selectedStudent: null, selectedCourse: '', filteredCourses: [] });
            setError({ error2: '' });
        }
      };

    /**
     * the function we call once clicking on register a course, it verifies the course is already enrolled, if the student is already registered to 5, if not the course is added to the liste of courses of the student
     */
    const handleRegisterCourse = () => {
        const { selectedCourse, selectedStudent } = selectionState;
        if (!selectedCourse) {
            setError({ error3: translate.t("noCoursesSelected") });
            return;
        }
        if (selectedStudent.courses.includes(selectedCourse)) {
            setError({ error3: translate.t("studentEnrolledInCourse") });
            return;
        }
        if (selectedStudent.courses.length >= 5) {
            setError({ error3: translate.t("studentEnrollmentLimit") });
            return;
        }
        const updatedStudent = {
            ...selectedStudent,
            courses: [...selectedStudent.courses, selectedCourse]
        };
        setSelectionState(prev => ({ ...prev, selectedStudent: updatedStudent }));
        setStudents(students.map(s => s.student_id === updatedStudent.student_id ? updatedStudent : s));
        setError({ error3: translate.t("courseAdded") });
    };

    
    /**
     * the function which handle when we change the selection of course in the selector, and update the selectedCourse by the new id
     * @param {*} newCourseId the new course selected id
     */
    const handleSelectCourseChange = (newCourseId) => {
        setError({ error3: '' });
        setSelectionState(prevState => ({
            ...prevState,
            selectedCourse: newCourseId
        }));
    };

    /**
     * this function change the current language of the app
     * @param {*} selectedLanguage the language that we are changing into
     */
    const changeLanguage = (selectedLanguage) => {
        setLanguage(selectedLanguage);
        setShowLanguageOptions(false);
        setError({error1:'', error2:'', error3:''});
    };
   
    // Main render function of the App
    return (
        
        <KeyboardAvoidingView 
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
        {/*This component is used to automatically adjust the keyboard so that it does not block the input fields on the screen when the user needs to type something. 
        (for iOS): Adds padding to the bottom of the view when the keyboard appears
        (for Android): Changes the height of the view so that the contents above the keyboard are visible.
        keyboardVerticalOffset:This offset ensures that the content is not only above the keyboard but also has a little extra space for better visibility and interaction.*/}

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>

                <View style={styles.container}>
                    {/**The header containing the logo, the language button and the exit button */}
                    <View style={styles.header}>

                        <View style={[styles.headerButtons, language === 'ar' ? styles.leftButtons : styles.rightButtons]}>
                            {/*The button to choose the language*/}
                            <ButtonHeader
                                iconName="language"
                                label={language}
                                onPress={() => setShowLanguageOptions(!showLanguageOptions)}
                                currentLanguage={language}
                                showOptions={showLanguageOptions}
                                languages={{
                                    'ar': 'العربية',
                                    'fr': 'Français',
                                    'en': 'English'
                                }}
                                onSelectLanguage={changeLanguage}
                            />
                            {/**The button Exit */}
                            <ButtonHeader
                                iconName="power-off"
                                label="Exit"
                                onPress={BackHandler.exitApp}
                            />
                        </View>

                        {/**The logo */}
                        <Image source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/CollegeLionelGroulx.jpg/500px-CollegeLionelGroulx.jpg" }} style={styles.headerImage} />
        
                    </View>
                    
                    {!showPuzzleGame && (
                        <>
                            {/*The title of the app using the component Title*/}
                            <Title text={translate.t("registrationForCourses")} style={styles.titleBackground} language={language} iconName="address-card"/>

                            {/*The first section that contains the input text for the id and the button select student*/}
                            <View style={styles.section}>
                                <CustomTextInput 
                                    placeholder={translate.t("studentId")} 
                                    value={studentId} 
                                    onChangeText={(text) => {setStudentId(text); checkStudentExists(text)}} 
                                />
                                <Text style={styles.errorMessage}>{error.error1}</Text>
                                
                                <Button 
                                    title={translate.t("selectAStudent")} 
                                    onPress={() => handleSelectStudent(studentId) } 
                                />
                                <Text style={styles.confirmation}>{error.error2}</Text>
                            </View>

                            {selectionState.selectedStudent && (
                                <>
                                    {/*The second section, will be showed only if a student is selected, contains id and the name of student selected , a text input of the session of the student and a selector of the courses available in this session*/}
                                    <View style={styles.section}>
                                        <Text style={[styles.studentInfo,{textAlign:language === 'ar' ? 'right' : 'left'}]}>
                                        {language === 'ar' ?
                                        `${selectionState.selectedStudent.name} ,${selectionState.selectedStudent.student_id}`
                                        :`${selectionState.selectedStudent.student_id}, ${selectionState.selectedStudent.name}`}
                                        </Text>

                                        <Text style={styles.studentInfo}>
                                            {translate.t("inSession")} :
                                        </Text>
                                        <View style={styles.sessionDisplay}>
                                            <Text style={styles.sessionText}>
                                                {translate.t(`sessions.${(selectionState.selectedStudent.session)}`)}
                                            </Text>
                                        </View>

                                        <Text style={styles.studentInfo}>
                                        {translate.t("registerCourse")} :
                                        </Text>
                                        <Selector
                                            selectedValue={selectionState.selectedCourse}
                                            onValueChange={handleSelectCourseChange}
                                            items={selectionState.filteredCourses.map(course => ({
                                                value: course.course_id, 
                                                label: translate.t(`courses.${course.course_id}`),
                                            }))}
                                            item0={translate.t("selectCourse")}
                                        />

                                        <Text style={styles.errorMessage}>{error.error3}</Text>
                                    </View>

                                    {/*The third section, will be showed also only if a student is selected, contains two buttons : Register and show. Register is for registering the student to the selected course and show is for showing the student informations*/}
                                    <View style={styles.section}>
                                        <Button title={translate.t("save")} onPress={handleRegisterCourse} />
                                        <Button title={translate.t("display")} onPress={() => setModalVisible(true)} />
                                    </View>

                                    {/*The modal that contains the student informations*/}
                                    <Modal 
                                        visible={modalVisible} 
                                        transparent 
                                        animationType="slide" 
                                        onRequestClose={() => setModalVisible(false)}
                                    >
                                        <View style={styles.modalContent}>
                                            <Text style={[styles.modalText, {fontWeight: 'bold', fontSize: 18}]}>
                                                {translate.t("studentInfos")}
                                            </Text>
                                            {selectionState.selectedStudent && (
                                                <>
                                                    <Text style={styles.modalText}>
                                                        {translate.t("id")} {selectionState.selectedStudent.student_id}
                                                    </Text>
                                                    <Text style={styles.modalText}>
                                                        {translate.t("name")} {selectionState.selectedStudent.name}
                                                    </Text>
                                                    <Text style={[styles.modalText, {fontWeight: 'bold'}]}>
                                                        {`${translate.t("session")}:`}
                                                    </Text>
                                                    <Text style={styles.modalText}> 
                                                        {translate.t(`sessions.${selectionState.selectedStudent.session}`)}
                                                    </Text>
                                                    <Text style={[styles.modalText, {fontWeight: 'bold'}]}>
                                                        {`${translate.t("enrolledCourses")} :`}
                                                    </Text>

                                                    {selectionState.selectedStudent.courses.map((courseId, index) => (
                                                        <Text key={index} style={[styles.modalText, language === 'ar' ? styles.modalTextAlignRight : styles.modalTextAlign]}>
                                                            {translate.t(`courses.${courseId}`)}
                                                        </Text>
                                                    ))}
                                                </>
                                            )}
                                            <Button 
                                                title={translate.t('close')} 
                                                onPress={() => setModalVisible(false)} 
                                            />
                                        </View>
                                    </Modal>
                                </>
                            )}

                            {/**The button to show the game */}
                            <Button 
                                iconName="gamepad" 
                                onPress={() => setShowPuzzleGame(true)}
                                style={styles.buttonGame}
                            />
                                {/* Autres éléments de l'interface principale */}
                        </>
                    )}
                    {showPuzzleGame && (
                        <View style={{marginTop:30, height:"98%"}}>

                            <PuzzleGame 
                                titleLabel = {translate.t('puzzleGame')}
                                bestLabel = {translate.t('best')}
                                worstLabel = {translate.t('worst')}
                                currentLabel = {translate.t('current')}
                                newLabel = {translate.t('newGame')}
                                msgLabel = {translate.t('bravo')}
                                language = {language}
                            />
                            
                            {/**The button to go back to registration */}
                            <Button 
                                iconName="home" 
                                onPress={() => setShowPuzzleGame(false)}
                                style={styles.buttonGame}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    section: {
      flex:1,
    marginVertical: 10,
    },
    buttonContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    errorMessage: {
        color: '#012f47',
    },
    languageOptionsContainer: {
        position: 'absolute',
        top: 20,
        right: 75,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        padding: 5, 
        zIndex: 1000,
    },
    languageOption: {
        padding: 5,
        marginLeft: 5,
    },
    selectedLanguageOption: {
        backgroundColor: '#012f47', 
        borderColor: '#000', 
        borderWidth: 1,
        borderRadius: 5,
        
    },
    languageOptionText: {
        textAlign: 'center',
        
    },
    modalContent: {
        margin: 20,
        backgroundColor: '#f8f3f9',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        width: '80%',
    },
    modalTextAlign: {
        textAlign: 'left',
    },
    modalTextAlignRight: {
        textAlign: 'right',
    },
    modalCloseButton: {
        backgroundColor: 'lightgrey',
        padding: 10,
        borderRadius: 20,
        width: 100,
        alignItems: 'center',
    },
    modalCloseButtonText: {
        color: 'black',
    },
    confirmation: {
        color: '#012f47',
    },
    languageSelector: {
        position: 'absolute',  
        top: 25,              
        right: 70, 
        backgroundColor: '#012f47',
        padding: 5,            
        zIndex: 1000,
    },
    sessionDisplay: {
        marginBottom: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        height: 50,
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white', 
    },
    sessionText: {
        fontSize: 16,
    },
    quitButton: {        
        backgroundColor: '#d3252f',
        padding: 5,            
        zIndex: 1000,
    },
    
    quitButtonText: {
        fontWeight: 'bold',
    },
    titleBackground: {
        marginTop: 50,  
        backgroundColor: '#780001',  
        width: '100%',  
        textAlign: 'center',
        padding: 10,  
        borderRadius: 10 
      },
      studentInfo: {
        fontSize: 16,
        fontWeight: 'bold', 
        marginVertical: 4, 
    },
    iconButton: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        position: 'absolute',
        top: 20,
        width: '100%',
        paddingHorizontal: 10, 
        zIndex: 10,
    },
    headerImage: {
        width: 150, 
        height:100,
        resizeMode: 'contain',
        marginBottom: -100,
        zIndex: 0,
    },
    leftButtons: {
        left: -15,
        flexDirection:'row-reverse'
    },
    rightButtons: {
        right: -15,
    },
    buttonGame: {
        width:50, 
        alignSelf:'center', 
        borderRadius:50,
        backgroundColor: '#780001',
    }
    
});
