import React, { useState, useEffect } from 'react';
import { View, Text, Modal, ScrollView, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
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
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedSession, setSelectedSession] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState({ error1: '', error2: '', error3: '' });
    const [language, setLanguage] = useState(Localization.getLocales()[0].languageCode);
    const [showLanguageOptions, setShowLanguageOptions] = useState(false);
    //const languageOptions = [{ label: 'English', value: 'en' }];
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

    const checkStudentExists = (id) => {
        const student = students.find(student => student.student_id === id);
        if (!student) {
            setError({ error1: translate.t("No student ID!") });
            return null;
        } else {
            setError({ error1: `${translate.t("Student")}: ${student.name}`, error2: translate.t("Please confirm your selection") });
            return student;
        }
    };

    const handleSelectStudent = (id) => {
        const student = checkStudentExists(id);
        if (!student) {
            setSelectedStudent(null);
            setError({ error2: '' });
            
        } else {
          setSelectedStudent(student);
          setSelectedSession(renderSessionLabelById(student.session));
          setError({ error2:translate.t("Student selected")});
        }
    };

    const handleRegisterCourse = () => {
      if (!selectedCourse) {
          setError({ error3: translate.t("No courses selected") });
          return;
      }
      // Utilisez la fonction pour obtenir l'ID du cours à partir du label
      const courseId = selectedCourse;
      if (!courseId || selectedStudent.courses.includes(courseId)) {
          setError({ error3: translate.t("The student is already enrolled in this course") });
          return;
      }
      if (selectedStudent.courses.length >= 5) {
          setError({ error3: translate.t("A student cannot be enrolled in more than 5 courses") });
          return;
      }
      const updatedCourses = [...selectedStudent.courses, courseId];
      const updatedStudent = {
          ...selectedStudent,
          courses: updatedCourses,
      };
      setStudents(students.map(student => student.student_id === selectedStudent.student_id ? updatedStudent : student));
      setSelectedStudent(updatedStudent);
      setSelectedCourse('');
      setError({ error3: '' });
  };

    const changeLanguage = (selectedLanguage) => {
        setLanguage(selectedLanguage);
        setShowLanguageOptions(false);
        setError({error1:'', error2:'', error3:''});
    };

    // Gestion des sélections et enregistrement...

    const renderCourseLabelById = (courseId) => {
      const course = availableCourses.find(course => course.course_id === courseId);
      return course ? course.label : '';
  };

  const renderSessionLabelById = (sessionId) => {
      const session = sessions.find(session => session.session_id === sessionId);
      return session ? session.label : '';
  };

    return (
      <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
            <Title text={translate.t("REGISTRATION FOR COURSES")} />
            
            <TouchableOpacity onPress={() => setShowLanguageOptions(!showLanguageOptions)} style={styles.languageSelector}>
                <Text>{language.toUpperCase()}</Text>
            </TouchableOpacity>
            {showLanguageOptions && (
                <View style={styles.languageOptionsContainer}>
                    {['fr', 'en', 'ar'].map((lang, index) => (
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
                <CustomTextInput placeholder={translate.t("Student ID")} value={studentId} onChangeText={(text) => {setStudentId(text); checkStudentExists(text)}} />
                <Text style={styles.errorMessage}>{error.error1}</Text>
                <Button title={translate.t("Select a student")} onPress={() => handleSelectStudent(studentId)} />
                <Text style={styles.confirmation}>{error.error2}</Text>
            </View>
            {selectedStudent && (
              <>
                
                    <View style={styles.section}>
                    <Selector
  selectedValue={selectedSession}
  onValueChange={setSelectedSession}
  items={sessions.map(session => ({
    value: session.session_id, // Utilisez session_id comme valeur
    label: translate.t(`sessions.${session.label}`), // Traduisez le label pour l'affichage
  }))}
/>
<Selector
  selectedValue={selectedCourse}
  onValueChange={setSelectedCourse}
  items={availableCourses.map(course => ({
    value: course.course_id, // Utilisez course_id comme valeur
    label: translate.t(`courses.${course.label}`), // Traduisez le label pour l'affichage
  }))}
/>

                        <Text style={styles.errorMessage}>{error.error3}</Text>
                    </View>
                    <View style={styles.section}>
                        <Button title={translate.t("Save")} onPress={handleRegisterCourse} />
                        <Button title={translate.t("Display")} onPress={() => setModalVisible(true)} />
                    </View>

                    <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
                        <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{translate.t("Student informations:")}</Text>
                        {selectedStudent && (
                        <>
                        <Text style={styles.modalText}>{translate.t("ID")} {selectedStudent.student_id}</Text>
                        <Text style={styles.modalText}>{translate.t("Name")} {selectedStudent.name}</Text>
                            <Text style={styles.modalText}>{`${translate.t("Session")}: ${translate.t(`sessions.${renderSessionLabelById(selectedStudent.session)}`)}`}</Text>
                            <Text style={styles.modalText}>{translate.t("Enrolled courses")}</Text>
                            {selectedStudent.courses.map((courseId, index) => (
                                <Text key={index} style={styles.modalText}>
                                    {translate.t(`courses.${renderCourseLabelById(courseId)}`)}
                                </Text>
                            ))}
                        </>
                    )}
                            <Button title={translate.t('Close')} onPress={() => setModalVisible(false)} />
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
        top: 70,
        right: 45,
        flexDirection: 'row',
        backgroundColor: 'white',
        //justifyContent:'space-around',
        //borderRadius: 6,
        padding: 5, // Augmentez le padding pour plus d'espace autour des options
        
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
        top: 80,
        right: 20,
    },
});
