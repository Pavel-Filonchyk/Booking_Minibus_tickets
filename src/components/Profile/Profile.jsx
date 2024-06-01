import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AntDesign from '@expo/vector-icons/AntDesign'
import PhoneInput from "react-native-phone-number-input"
import _ from 'lodash'

import Footer from '../Footer/Footer'
import ModalWrapper from '../../wrapers/ModalWrarrer/ModalWrapper'
import { getUser, deleteUser, getQueue, deleteQueue } from '../../core/actions/restUserTravelActions'
import { sendCodeData, resetErrorCode } from '../../core/actions/authActions'

export default function Profile({ navigation }) {

    const dispatch = useDispatch() 

    const getUserData = useSelector(({restUserTravelReduser: { getUserData }}) => getUserData)
    const userQueue = useSelector(({restUserTravelReduser: { userQueue }}) => userQueue)

    const [choiceSettings, setChoiceSettings] = useState(true)

    // settings
    const getCode = useSelector(({authReducer: { getCode }}) => getCode)
    const errorCode = useSelector(({authReducer: { errorCode }}) => errorCode)

    const [fullName, setFullName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState(null)
    const [createCode, setCreateCode] = useState(null)
    const [writeCode, setWriteCode] = useState('')
    const [showBtn, setShowBtn] = useState(false)
    const [errorTextPhone, setErrorTextPhone] = useState(false)
    const [errorTextCode, setErrorTextCode] = useState(false)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        const getData = async () => {
            try {
              const value = await AsyncStorage.getItem('auth')
              const jsonValue = JSON.parse(value)
              if(value !== null) {
                dispatch(getUser({phoneNumber: jsonValue?.phoneNumber}))
                dispatch(getQueue())
                setFullName(jsonValue?.fullName)
              }
            } catch(e) {
              console.log(e)
            }
        }
        getData()
    }, [])

    const onSettings = (arg) => {
        if (arg === 'booking') {
            setChoiceSettings(true)
        }
        if (arg === 'settings') {
            setChoiceSettings(false)
        }
    }
    const onDeleteUser = (data) => {
        dispatch(deleteUser(data))
    }
    const onDeleteQueue = (blockId) => {
        dispatch(deleteQueue(blockId))
    }
    
    // settings 
    useEffect(() => {
        if (createCode !== null) {
            dispatch(sendCodeData({code: createCode.toString(), phoneNumber: `+375${phoneNumber}`}))
        }
    }, [createCode])
    useEffect(() => {
        if(getCode === true) {
            setShowBtn(item => !item)
        }
    }, [getCode])

    const onSendCode = () => {
        if(phoneNumber !== null){
            dispatch(resetErrorCode())
            setCreateCode(Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000)
            setErrorTextPhone(false)
        }else{
            setErrorTextPhone(true)
        }
    }
    const onConfirmCode = async () => {
        if (createCode.toString() === writeCode.toString()){
            try {
                const jsonValue = JSON.stringify({fullName, phoneNumber: `+375${phoneNumber}`})
                await AsyncStorage.setItem('auth', jsonValue)
            } catch (e) {
                console.log(e)
            }
            setShowModal(true)
            setTimeout(() => {
                setShowModal(false)
            },1500)
            setShowBtn(item => !item)
            setErrorTextCode(false)
            setCreateCode(null)
            setPhoneNumber(null)
            setWriteCode('')
        }
        if (createCode.toString() !== writeCode.toString()){
            setErrorTextCode(true)
        }
    }
 
    return (
        <View style={styles.container}>
            <View style={styles.wrapImg}>
                <Image 
                    style={styles.belImg}
                    source={require('../Main/images/bel.png')}
                />
            </View>
            
            <View style={styles.wrapHeader}>
                <Text style={styles.name}>{fullName}</Text>
                <View style={styles.wrapChoiceSettings}>
                    <TouchableOpacity style={{ marginTop: 20, marginBottom: 15, borderBottomWidth: 2, borderBottomColor: choiceSettings ? 'red' : 'white'}}
                        onPress={() => onSettings('booking')}
                    >
                        <Text style={styles.settingsText}>Брони / Очереди</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginTop: 20, marginBottom: 15, borderBottomWidth: 2, borderBottomColor: choiceSettings ? 'white' : 'red'}}
                        onPress={() => onSettings('settings')}
                    >
                        <Text style={styles.settingsText}>Настройки</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {
                choiceSettings 
                ?
                    (
                        // booking
                        <ScrollView>
                            <Text style={styles.bookingText}>Брони:</Text>
                            <Text style={{...textWithoutBooking, display: getUserData?.length === 0 ? 'flex' : 'none'}}>У вас пока нет броней.</Text>
                            {
                                getUserData?.map(item => {
                                    return (
                                        <View style={styles.wrapCheck} key={item.id}>
                                            <View style={styles.wrapBlockCheck}>
                                                <View style={styles.blockTrips}>
                                                    <Text style={styles.textTrips}>Маршрутка до:</Text>
                                                    <Text style={styles.getTextTrips}>{item.tripTo}</Text>
                                                </View>
                                                <View style={styles.blockTrips}>
                                                    <Text style={styles.textTrips}>Посадка:</Text>
                                                    <Text style={styles.getTextTrips}>{item.tripFrom}, ост. {item.wayStart}</Text>
                                                </View>
                                                <View style={styles.blockTrips}>
                                                    <Text style={styles.textTrips}>Высадка:</Text>
                                                    <Text style={styles.getTextTrips}>{item.tripTo}, ост. {item.wayStop}</Text>
                                                </View>
                                                <View style={styles.blockTrips}>
                                                    <Text style={styles.textTrips}>Дата отправления:</Text>
                                                    <Text style={styles.getTextTrips}>{item.dateTrip}</Text>
                                                </View>
                                                <View style={styles.blockTrips}>
                                                    <Text style={styles.textTrips}>Время отправления:</Text>
                                                    <Text style={styles.getTextTrips}>{item.timeStart}</Text>
                                                </View>
                                                <View style={styles.blockTrips}>
                                                    <Text style={styles.textTrips}>Время прибытия:</Text>
                                                    <Text style={styles.getTextTrips}>{item.timeStop}</Text>
                                                </View>
                                                <View style={styles.blockTrips}>
                                                    <Text style={styles.textTrips}>Количество мест:</Text>
                                                    <Text style={styles.getTextTrips}>{item.numberSeats}</Text>
                                                </View>
                                                <View style={styles.blockTrips}>
                                                    <Text style={styles.textTrips}>Цена:</Text>
                                                    <Text style={styles.getTextTrips}>{item.cost} б.р.</Text>
                                                </View>
                                                <View style={styles.blockTrips}>
                                                    <Text style={styles.textTrips}>Имя и Фамилия:</Text>
                                                    <Text style={styles.getTextTrips}>{item.fullName}</Text>
                                                </View>
                                                <View style={styles.blockTrips}>
                                                    <Text style={styles.textTrips}>Телефон:</Text>
                                                    <Text style={styles.getTextTrips}>{item.phoneNumber}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.wrapBtns}>
                                                <TouchableOpacity
                                                    style={styles.btnOrder}
                                                    onPress={() => onDeleteUser({blockId: item.blockId, id: item.id, numberSeats: item.numberSeats})}
                                                >
                                                    <Text style={styles.textBtnOrder}>Удалить</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.btnBack}
                                                    onPress={() => navigation.navigate('main')}
                                                >
                                                    <Text style={styles.textBtnOrder}>Назад</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                            
                                    )
                                })
                            }
                            <Text style={styles.bookingText}>Очереди:</Text>
                            <Text style={{...textWithoutBooking, display: userQueue?.length === 0 ? 'flex' : 'none'}}>Вы пока не стоите в очереди.</Text>
                            {
                                userQueue?.map(item => {
                                    return (
                                        <View style={styles.wrapCheck} key={item.blockId}>
                                            <View style={styles.wrapBlockQueue}>
                                                <View style={styles.blockTrips}>
                                                    <Text style={styles.textTrips}>Отправление:</Text>
                                                    <Text style={styles.getTextTrips}>{item.tripFrom}</Text>
                                                </View>
                                                <View style={styles.blockTrips}>
                                                    <Text style={styles.textTrips}>Прибытие:</Text>
                                                    <Text style={styles.getTextTrips}>{item.tripTo}</Text>
                                                </View>
                                                <View style={styles.blockTrips}>
                                                    <Text style={styles.textTrips}>Дата отправления:</Text>
                                                    <Text style={styles.getTextTrips}>{item.dateTrip}</Text>
                                                </View>
                                                <View style={styles.blockTrips}>
                                                    <Text style={styles.textTrips}>Время отправления:</Text>
                                                    <Text style={styles.getTextTrips}>{item.time}</Text>
                                                </View>
                                                <View style={styles.blockTrips}>
                                                    <Text style={styles.textTrips}>Имя и Фамилия:</Text>
                                                    <Text style={styles.getTextTrips}>{item.fullName}</Text>
                                                </View>
                                                <View style={styles.blockTrips}>
                                                    <Text style={styles.textTrips}>Телефон:</Text>
                                                    <Text style={styles.getTextTrips}>{item.phoneNumber}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.wrapBtns}>
                                                <TouchableOpacity
                                                    style={styles.btnOrder}
                                                    onPress={() => onDeleteQueue(item.blockId)}
                                                >
                                                    <Text style={styles.textBtnOrder}>Удалить</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.btnBack}
                                                    onPress={() => navigation.navigate('main')}
                                                >
                                                    <Text style={styles.textBtnOrder}>Назад</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                            
                                    )
                                })
                            }
                        </ScrollView>
                    )            
                : 
                    // settings
                    <View style={styles.wrapSettings}>
                        <Text style={styles.tytleSettings}>Изменить</Text>
                        <View style={styles.wrapBlockSettings}>
                            <Text style={styles.label}>Имя и фамилию</Text>
                            <TextInput
                                style={styles.inputFullName}
                                onChangeText={(e) => setFullName(e)}
                                value={fullName}
                                placeholder={fullName}
                                placeholderTextColor="white"
                            />
                            <Text style={styles.label}>Телефон</Text>
                            <View style={styles.wrapPhoneNumber}>
                                <Text style={styles.textPhoneNumber}>+375</Text>
                                <TextInput
                                    //keyboardType="numeric"
                                    style={styles.phoneInput}
                                    onChangeText={(e) => setPhoneNumber(e)}
                                    value={phoneNumber}
                                />
                            </View>
                        </View>
                        <View style={styles.wrapTextInput}>
                            <Text style={styles.label}>Введите полученный код,</Text>
                            <Text style={styles.label}>чтобы подтвердить изменения</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(e) => setWriteCode(e)}
                                value={writeCode}
                            />
                        </View>
                        
                        <Text style={{...textError, display: errorTextPhone ? 'flex' : 'none'}}>Заполните поле номера телефона</Text>
                        <Text style={{...textError, display: errorCode ? 'flex' : 'none'}}>Проверьте номер телефона</Text>
                        <Text style={{...textError, display: errorTextCode ? 'flex' : 'none'}}>Неверно введен код</Text>
                        
                        <View style={styles.wrapBtns}>
                            {
                                !showBtn 
                                ?  
                                    <TouchableOpacity
                                        style={styles.btnAuth}
                                        onPress={onSendCode}
                                    >
                                        <Text style={styles.textBtnOrder}>Получить код</Text>
                                    </TouchableOpacity>
                                
                                :   
                                    <TouchableOpacity
                                        style={styles.btnAuth}
                                        onPress={() => onConfirmCode()}
                                    >
                                        <Text style={styles.textBtnOrder}>Подтвердить</Text>
                                    </TouchableOpacity>

                            }
                        </View>
                    </View>
            }
            <ModalWrapper showModal={showModal}>
                <View style={styles.wrapTextModal}>
                    <>
                        <Text style={styles.textModal}>Успешно</Text>
                        <Text style={styles.textModal}>изменены данные!</Text>
                        <AntDesign name="smileo" size={48} color="white" style={{marginTop: 20}} />
                    </>
                </View>
            </ModalWrapper>
            <Footer
               navigation={navigation} 
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4F9BDE',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    wrapImg: {
        width: '100%', 
        height: '85%',
        alignItems: 'center',
        opacity: 0.6,
        position: 'absolute',
        top: '23%'
    },
    belImg: {
        width: '95%',
        height: 330
    },
    wrapHeader: {
        marginTop: 40,
        width: '100%',
    },
    name: {
        fontSize: 20,
        marginTop: 5,
        marginLeft: 20,
        color: 'white',
        fontWeight: '800'
    },
    wrapChoiceSettings: {
        borderTopWidth: 2,
        borderTopColor: 'white',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    settingsText: {
        fontSize: 18,
        paddingBottom: 5,
        color: 'white',
        fontWeight: '800'
    },

    // booking
    bookingText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '800',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 10,
        marginTop: 10
    },
    wrapCheck: {
        //marginTop: 'auto',
        marginBottom: 'auto',
        minWidth: '90%',
        alignItems: 'center',
        marginBottom: 30,
        marginRight: 10,
        marginLeft: 10
    },
    wrapBlockCheck: {
        width: '100%',
        height: 330,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 12,
        padding: 10,
        justifyContent: 'space-around'
    },
    wrapBlockQueue: {
        width: '100%',
        height: 220,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 12,
        padding: 10,
        justifyContent: 'space-around'
    },
    blockTrips: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    textTrips: {
        width: '58%',
        fontSize: 16,
        color: 'white',
        fontWeight: '800'
    },
    getTextTrips: {
        flex: 1,
        fontSize: 16,
        flexWrap: 'wrap',
        color: 'white',
        fontWeight: '800'
    },
    blockCheck: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    textCheck: {
        width: '58%',
        fontSize: 16,
        color: 'white',
        fontWeight: '800'
    },
    getTextCheck: {
        flex: 1,
        fontSize: 16,
        flexWrap: 'wrap',
        color: 'white',
        fontWeight: '800'
    },
    wrapBtns: {
        width: '95%',
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    btnOrder: {
        width: 168,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10
    },
    btnBack: {
        width: 120,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#3E5F8A',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10
    },
    textBtnOrder: {
        fontSize: 18,
        color: "white",
        fontWeight: '900'
    },

    // settings
    wrapSettings: {
        marginBottom: 'auto',
        width: '100%',
        alignItems: 'center',
    },
    tytleSettings: {
        fontSize: 18,
        marginBottom: 5,
        marginTop: 10,
        color: 'white',
        fontWeight: '800'
    },
    wrapBlockSettings: {
        width: '90%',
        height: 210,
        justifyContent: 'space-around'
    },
    label: {
        fontSize: 16,
        marginTop: 10,
        color: 'white',
        fontWeight: '800'
    },
    inputFullName: {
        height: 30, 
        width: '100%',
        borderColor: 'white', 
        borderBottomWidth: 2,
        fontSize: 16,
        color: 'white',
        fontWeight: '800'
    },
    wrapTextInput: {
        marginTop: 10,
        alignItems: 'center',
        width: '90%'
    },
    wrapPhoneNumber: {
        maxWidth: '100%',
        flexDirection: 'row',
        overflow: 'hidden'
    },
    textPhoneNumber: {
        fontSize: 16,
        color: 'white',
        fontWeight: '800',
        width: 55
    },
    phoneInput: {
        width: '100%',
        borderColor: 'white', 
        borderBottomWidth: 2,
        fontSize: 16,
        color: 'white',
        fontWeight: '800',
    },
    textInput: {
        height: 30, 
        width: '50%',
        borderColor: 'white', 
        borderBottomWidth: 2,
        fontSize: 16,
        color: 'white',
        fontWeight: '800',
        marginTop: 10
    },
    btnAuth: {
        width: 168,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#008080',
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapTextModal: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textModal: {
        fontWeight: '600',
        fontSize: 31,
        color: "white",
        lineHeight: 50,
        textAlign: 'center'
    }
})

const textWithoutBooking = StyleSheet.create({
    marginBottom: 'auto',
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 30,
    fontWeight: '800'
})
const textError = StyleSheet.create({
    color: 'red',
    marginTop: 20,
    fontWeight: '800',
    fontSize: 16
})

