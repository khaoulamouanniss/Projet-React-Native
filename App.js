import React, { useState, useEffect } from 'react';
import { View, Text, Modal, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import translation from './js/translation';
import CustomTextInput from './components/CustomTextInput';
import Selector from './components/Selector';
import Button from './components/Button';
import Title from './components/Title';
import availableCourses from './js/courses';
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
    const languageOptions = [{ label: 'English', value: 'en' }];
    const translate = new I18n(translation);
    translate.locale = language;

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/khaoulamouanniss/student_list/main/students.json')
            .then(response => response.json())
            .then(data => setStudents(data))
            .catch(error => {
                console.error(error);
                setError({ error1: "Error loading students." });
            });
    }, []);

    const checkStudentExists = (id) => {
        const student = students.find(student => student.student_id === id);
        if (!student) {
            setError({ error1: "No student ID found." });
            return null;
        } else {
            setError({ error1: `Student: ${student.name}`, error2: "Please confirm your selection" });
            return student;
        }
    };

    const handleSelectStudent = (id) => {
        const student = checkStudentExists(id);
        if (student) {
            setSelectedStudent(student);
            setSelectedSession(student.session);
            setError({ error2: "Student selected" });
        } else {
            setSelectedStudent(null);
            setError({ error2: '' });
        }
    };

    const handleRegisterCourse = () => {
        if (!selectedCourse) {
            setError({ error3: "No course selected" });
            return;
        }
        if (selectedStudent.courses.includes(selectedCourse)) {
            setError({ error3: "The student is already enrolled in this course" });
            return;
        }
        if (selectedStudent.courses.length >= 5) {
            setError({ error3: "A student cannot be enrolled in more than 5 courses" });
            return;
        }
        const updatedStudent = {
            ...selectedStudent,
            courses: [...selectedStudent.courses, selectedCourse],
            session: selectedSession,
        };
        setStudents(students.map(student => student.student_id === selectedStudent.student_id ? updatedStudent : student));
        setSelectedStudent(updatedStudent);
        setSelectedCourse('');
        setError({ error3: '' });
    };

    const changeLanguage = (selectedLanguage) => {
        setLanguage(selectedLanguage);
        setShowLanguageOptions(false);
    };

    return (
        <View style={styles.container}>
            <Title text={translate.t('title')} />
            <TouchableOpacity onPress={() => setShowLanguageOptions(!showLanguageOptions)} style={styles.languageSelector}>
                <Text>{language.toUpperCase()}</Text>
            </TouchableOpacity>
            {showLanguageOptions && (
                <View style={styles.languageOptionsContainer}>
                    {languageOptions.map((option) => (
                        <TouchableOpacity key={option.value} style={styles.languageOption} onPress={() => changeLanguage(option.value)}>
                            <Text style={styles.languageOptionText}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            <View style={styles.section}>
                <CustomTextInput placeholder={translate.t('studentId')} value={studentId} onChangeText={setStudentId} />
                <Text style={styles.errorMessage}>{error.error1}</Text>
                <Button title={translate.t('select')} onPress={() => handleSelectStudent(studentId)} />
                <Text style={styles.confirmation}>{error.error2}</Text>
            </View>
            {selectedStudent && (
                <>
                    <View style={styles.section}>
                        <Selector selectedValue={selectedSession} onValueChange={setSelectedSession} options={sessions} />
                        <Selector selectedValue={selectedCourse} onValueChange={setSelectedCourse} options={availableCourses} />
                        <Text style={styles.errorMessage}>{error.error3}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title={translate.t('save')} onPress={handleRegisterCourse} />
                        <Button title={translate.t('display')} onPress={() => setModalVisible(true)} />
                    </View>
                    <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>{translate.t('studentInfo')}</Text>
                            <Text style={styles.modalText}>{`${translate.t('id')}: ${selectedStudent.student_id}`}</Text>
                            <Text style={styles.modalText}>{`${translate.t('name')}: ${selectedStudent.name}`}</Text>
                            <Text style={styles.modalText}>{`${translate.t('session')}: ${selectedSession}`}</Text>
                            <Text style={styles.modalText}>{translate.t('enrolledCourses')}:</Text>
                            <FlatList
                                data={selectedStudent.courses}
                                renderItem={({ item }) => <Text style={styles.modalText}>{item}</Text>}
                                keyExtractor={(_, index) => String(index)}
                            />
                            <Button title={translate.t('close')} onPress={() => setModalVisible(false)} />
                        </View>
                    </Modal>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    section: {
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    errorMessage: {
        color: 'red',
    },
    languageOptionsContainer: {
        position: 'absolute',
        top: 72,
        right: 50,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 6,
        padding: 3,
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
