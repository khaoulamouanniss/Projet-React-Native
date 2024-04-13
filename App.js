import React, { useState, useEffect } from 'react';
import { View, Text, Modal, ScrollView, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, BackHandler, Keyboard  } from 'react-native';
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import translation from './js/translation';
import CustomTextInput from './components/CustomTextInput';
import Selector from './components/Selector';
import Button from './components/Button';
import Title from './components/Title';
import availableCourses from './js/Courses';
import sessions from './js/sessions';

export default function App() {
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState('');
    const [selectionState, setSelectionState] = useState({
        selectedStudent: null,
        selectedCourse: '',
        filteredCourses: []
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState({ error1: '', error2: '', error3: '' });
    const [language, setLanguage] = useState(Localization.getLocales()[0].languageCode);
    const [showLanguageOptions, setShowLanguageOptions] = useState(false);
    const translate = new I18n(translation);
    translate.locale = language;

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/khaoulamouanniss/Projet-React-Native/main/students.json')
            .then(response => response.json())
            .then(data => setStudents(data))
            .catch(error => {
                console.error(error);
                setError({ error1: translate.t("Error when loading students.") });
            });
    }, []);

    useEffect(() => {
        if (selectionState.selectedStudent) {
            const session = sessions.find(session => session.session_id === selectionState.selectedStudent.session);
            const availableCoursesForSession = session ? session.courses.map(courseId => availableCourses.find(course => course.course_id === courseId)).filter(Boolean) : [];
            setSelectionState(prev => ({ ...prev, filteredCourses: availableCoursesForSession }));
        }
    }, [selectionState.selectedStudent]);

    const updateFilteredCourses = (sessionId) => {
        const session = sessions.find(session => session.session_id === sessionId);
        const courses = session ? session.courses.map(courseId => availableCourses.find(course => course.course_id === courseId)).filter(Boolean) : [];
        setSelectionState(prev => ({ ...prev, filteredCourses: courses }));
    };
    const handleSelectStudent = (id) => {
        Keyboard.dismiss();
        const student = checkStudentExists(id);
        if (student) {
            setSelectionState({
                selectedStudent: student,
                selectedCourse: '',
                filteredCourses: []
            });
            updateFilteredCourses(student.session);
            setError({ error2: translate.t("studentSelected") });
        } else {
            setSelectionState({ selectedStudent: null, selectedCourse: '', filteredCourses: [] });
            setError({ error2: '' });
        }
    };
      
    
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
    const handleSelectCourseChange = (newCourseId) => {
        setError({ error3: '' });
        setSelectionState(prevState => ({
            ...prevState,
            selectedCourse: newCourseId
        }));
    };
    const changeLanguage = (selectedLanguage) => {
        setLanguage(selectedLanguage);
        setShowLanguageOptions(false);
        setError({error1:'', error2:'', error3:''});
    };

    const renderSessionLabelById = (sessionId) => {
        const session = sessions.find(session => session.session_id === sessionId);
        return session ? translate.t(`sessions.${sessionId}`) : '';
    };

    const renderCourseLabelById = (courseId) => {
      const course = availableCourses.find(course => course.course_id === courseId);
      return course ? translate.t(`courses.${courseId}`) : '';
  };

  

    return (
      <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
        <Button 
        title="X" 
        onPress={() => BackHandler.exitApp()} 
        style={styles.quitButton} 
        textStyle={styles.quitButtonText}
      />


            <Title text={translate.t("registrationForCourses")} style={styles.titleBackground}/>
            

            <TouchableOpacity onPress={() => setShowLanguageOptions(!showLanguageOptions)} style={styles.languageSelector}>
                <Text>{language.toUpperCase()}</Text>
            </TouchableOpacity>
            {showLanguageOptions && (
                <View style={styles.languageOptionsContainer}>
                    {['fr', 'en', 'ar'].filter(lang => lang !== language).map((lang, index) => (
  <TouchableOpacity 
    key={index}
    style={styles.languageOption}
    onPress={() => changeLanguage(lang)} >
    <Text style={styles.languageOptionText}>{lang.toUpperCase()}</Text>
  </TouchableOpacity>
))}

                </View>
            )}
            <View style={styles.section}>
                <CustomTextInput placeholder={translate.t("studentId")} value={studentId} onChangeText={(text) => {setStudentId(text); checkStudentExists(text)}} />
                <Text style={styles.errorMessage}>{error.error1}</Text>
                <Button title={translate.t("selectAStudent")} onPress={() => handleSelectStudent(studentId) } />
                <Text style={styles.confirmation}>{error.error2}</Text>
            </View>
    

            {selectionState.selectedStudent && (
              <>
                
                    <View style={styles.section}>
                        <Text>{selectionState.selectedStudent.student_id} {selectionState.selectedStudent.name}</Text>
                        <View style={styles.sessionDisplay}>
  <Text style={styles.sessionText}>
    {translate.t(`sessions.${(selectionState.selectedStudent.session)}`)}
  </Text>
</View>
<Selector
  selectedValue={selectionState.selectedCourse}
  onValueChange={handleSelectCourseChange}
  items={selectionState.filteredCourses.map(course => ({
    value: course.course_id, 
    label: translate.t(`courses.${course.course_id}`),
  }))}
/>

                        <Text style={styles.errorMessage}>{error.error3}</Text>
                    </View>
                    <View style={styles.section}>
                        <Button title={translate.t("save")} onPress={handleRegisterCourse} />
                        <Button title={translate.t("display")} onPress={() => setModalVisible(true)} />
                    </View>

                    <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
                        <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{translate.t("studentInfos")}</Text>
                        {selectionState.selectedStudent && (
                        <>
                        <Text style={styles.modalText}>{translate.t("id")} {selectionState.selectedStudent.student_id}</Text>
                        <Text style={styles.modalText}>{translate.t("name")} {selectionState.selectedStudent.name}</Text>
                            <Text style={styles.modalText}>{`${translate.t("session")}: ${translate.t(`sessions.${selectionState.selectedStudent.session}`)}`}</Text>
                            <Text style={styles.modalText}>{translate.t("enrolledCourses")}</Text>
                            {selectionState.selectedStudent.courses.map((courseId, index) => (
                                <Text key={index} style={styles.modalText}>
                                    {translate.t(`courses.${courseId}`)}
                                </Text>
                            ))}
                        </>
                    )}
                            <Button title={translate.t('close')} onPress={() => setModalVisible(false)} />
                        </View>
                    </Modal>
                </>
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
        color: 'red',
    },
    languageOptionsContainer: {
        position: 'absolute',
        top: 110,
        right: 45,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        //justifyContent:'space-around',
        //borderRadius: 6,
        padding: 5, 
        
    },
    languageOption: {
        padding: 5,
        marginLeft: 5,
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
        color: 'black',
    },
    languageSelector: {
        position: 'absolute',
        top: 120,
        right: 20,
    },
    sessionDisplay: {
        marginBottom: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        height: 50,
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white',  // Assurez-vous que c'est le style que vous voulez
      },
      sessionText: {
        fontSize: 16,
      },
      quitButton: {
        position: 'absolute',  // Position absolue pour le placer spécifiquement
        top: 25,               // Ajustez selon les besoins pour la marge du haut
        right: 20,              // Ajustez selon les besoins pour la marge gauche
        padding: 5,            // Petit padding pour faciliter la touche
        zIndex:1000,
      },
      quitButtonText: {
         // Taille du texte
        fontWeight: 'bold'     // Gras pour le caractère 'X'
      },
      titleBackground: {
        marginTop: 50,  // Ajoutez plus de marge en haut pour éviter la superposition
        backgroundColor: '#eaeaea',  // Un arrière-plan gris clair, choisissez la couleur que vous préférez
        width: '100%',  // Assurez que le titre prend toute la largeur
        textAlign: 'center',
        padding: 10,  // Padding pour un meilleur look
        borderRadius: 10  // Bords arrondis pour l'esthétique
      }
});
