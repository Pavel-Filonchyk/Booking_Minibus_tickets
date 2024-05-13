import { useEffect, useState, useLayoutEffect } from 'react'
import { Text, View, StyleSheet, Image, Platform, TouchableOpacity, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import PhoneInput from "react-native-phone-number-input"
import RNPickerSelect from 'react-native-picker-select'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import dayjs from 'dayjs'

import { asyncStorage } from '../../constants/index'
import { getAllTravels, getCosts, getDirections, getTravels } from '../../core/actions/getTravelsActions'
import ModalWrapper from '../../wrapers/ModalWrarrer/ModalWrapper'
import Footer from '../Footer/Footer'

export default function Main({ navigation }) {
    const dispatch = useDispatch()

    const cities = useSelector(({getTravelsReducer: { cities }}) => cities)

    const [changeWay, setChangeWay] = useState(true)
    
    const [selectFrom, setSelectFrom] = useState("Туров")
    const [selectTo, setSelectTo] = useState("Гомель")
    const [showDate, setShowDate] = useState(false)
    const [date, setDate] = useState(new Date())

    // modal auth
    const [fullName, setFullName] = useState('Pavel')
    const [phoneNumber, setPhoneNumber] = useState('+37500')
    const [getCode, setGetCode] = useState(false)
    const [code, setCode] = useState('')
    const [showModal, setShowModal] = useState(true)

    useLayoutEffect(() => {
        const getItemStorage = async () => {
            try {
                const value = await AsyncStorage.getItem('auth')
                if(value !== null) {
                    setShowModal(false)
                    return value
                }
            } catch(e) {
                console.log(e)
            }
        }
        getItemStorage()
    }, [])
    
    useEffect(() => {
        dispatch(getAllTravels())
        dispatch(getDirections())
        dispatch(getCosts())
    }, [])

    useEffect(() => {
        if (!changeWay) {
            setSelectFrom(selectTo)
        }else{
            setSelectFrom(selectFrom)
        }
        if (changeWay) {
            setSelectTo(selectTo)
        }else{
            setSelectTo(selectFrom)
        }
        
    }, [changeWay])

    const onConfirmCode = async () => {
        try {
            const jsonValue = JSON.stringify({fullName, phoneNumber})
            await AsyncStorage.setItem('auth', jsonValue)
        } catch (e) {
            console.log(e)
        }
        setGetCode(false)
        setShowModal(false)
    }

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date
        setDate(currentDate)
        setShowDate(false)
    }
    const getRoutes = () => {
        dispatch(getTravels({selectFrom, selectTo, date: dayjs(date).format('DD.MM.YYYY')}))

        navigation.navigate('trips')
    }

    return (
        <View style={styles.container}>
            <View style={{alignItems: 'center'}}>
                <Image 
                    style={styles.logo}
                    source={require('./images/logo10.png')}
                />
                <Text style={styles.tytle}>
                    ПАССАЖИРСКИЕ ПЕРЕВОЗКИ
                </Text>
                <View style={styles.wrapWay}>
                    <Text style={styles.way}>Туров - Житковичи - Гомель</Text>
                </View>
            </View>
            <View style={{alignItems: 'center', width: '100%', marginBottom: 10}}>
                <Text style={styles.bookingTytle}>БРОНИРОВАНИЕ</Text>
                <View style={styles.wrapBooking}>
                    <Text style={styles.textBooking}>Откуда</Text>
                    <RNPickerSelect
                        placeholder={{label: changeWay ? "Туров" : "Гомель", value: changeWay ? "Туров" : "Гомель"}}
                        value={selectFrom}
                        onValueChange={(value) => setSelectFrom(value)}
                        items={cities?.map(item => {return{ label: item.direction, value: item.direction}})}
                        doneText='Выбрать'
                        style={{
                            ...pickerSelectStyles,
                            placeholder: {
                                color: 'gray',
                                fontSize: 18,
                                fontWeight: '800'
                            },
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => setChangeWay(value => !value)}
                        style={styles.touchArrow}
                    >
                        <Image 
                            style={styles.arrows}
                            source={require('./images/arrows2.jpg')}
                        />
                    </TouchableOpacity>
                    <Text style={styles.textBooking}>Куда</Text>
                    <RNPickerSelect
                        placeholder={{label: changeWay ? "Гомель" : "Туров", value: changeWay ? "Гомель" : "Туров"}}
                        value={selectTo}
                        onValueChange={(value) => setSelectTo(value)}
                        items={cities?.map(item => {return{ label: item.direction, value: item.direction}})}
                        doneText='Выбрать'
                        style={{
                            ...pickerSelectStyles,
                            placeholder: {
                                color: 'gray',
                                fontSize: 18,
                                fontWeight: '800'
                            },
                        }}
                    />
                    {   Platform.OS === 'android' && (
                            <View style={styles.wrapShowDate}>
                                <TouchableOpacity 
                                    style={styles.btnDate}
                                    onPress={() => setShowDate(true)}
                                >
                                    <Text style={styles.textBtnDate}>Дата поездки</Text>
                                </TouchableOpacity>
                                <View style={styles.wrapTextDate}>
                                    <Text style={styles.textDate}>: {dayjs(date).format('DD.MM.YYYY')}</Text>
                                </View>
                                
                                {
                                    showDate ? <RNDateTimePicker 
                                        value={date} 
                                        onChange={onChangeDate}
                                        minimumDate={new Date()}
                                        locale="ru-RU"
                                    /> : ''
                                }
                            </View>
                        )
                    }
                    {
                        Platform.OS === 'ios' && (
                            <>
                                <Text style={styles.textDateIOS}>Дата поездки</Text>
                                <RNDateTimePicker 
                                    value={date} 
                                    style={{marginTop: 10, marginLeft: 16, fontWeight: '800'}}
                                    onChange={onChangeDate}
                                    minimumDate={new Date()}
                                    locale="ru-RU"
                                />
                            </>
                        )
                    }
                </View>
                <TouchableOpacity 
                    style={styles.btnShowTrip}
                    onPress={getRoutes}
                >
                    <Text style={styles.textBtnShowTrip}>Посмотреть рейсы</Text>
                </TouchableOpacity>
            </View>

            <ModalWrapper showModal={showModal}>
                <View style={styles.wrapModal}>
                    <View style={styles.wrapTitle}>
                        <Text style={styles.title}>РЕГИСТРАЦИЯ</Text>
                    </View>
                    
                    <Text style={styles.label}>Введите имя и фамилию</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(e) => setFullName(e)}
                        value={fullName}
                    />
                    <Text style={styles.label}>Телефон</Text>
                    <PhoneInput
                        defaultValue={phoneNumber}
                        defaultCode="BY"
                        onChangeFormattedText={(number) => {
                            setPhoneNumber(number)
                        }}
                        placeholder=' '
                        containerStyle={{height: 45, width: '90%', borderRadius: 6, textAlign: 'center'}}
                        textInputStyle={{fontSize: 14, fontWeight: '800', color:'#1B5583'}}
                        codeTextStyle={{fontSize: 14, fontWeight: '800', color:'#1B5583'}}
                    
                    />
                     <Text style={styles.label}>Введите полученный код</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(e) => setCode(e)}
                        value={code}
                    />
                    <View style={styles.wrapBtns}>
                        {
                            !getCode
                            ?  
                                <TouchableOpacity
                                    style={styles.btnAuth}
                                    onPress={() => setGetCode(true)}
                                >
                                    <Text style={styles.textBtnAuth}>Получить код</Text>
                                </TouchableOpacity>
                            
                            :   
                                <TouchableOpacity
                                    style={styles.btnAuth}
                                    onPress={() => onConfirmCode()}
                                >
                                    <Text style={styles.textBtnAuth}>Подтвердить</Text>
                                </TouchableOpacity>
    
                        }
                    </View>
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
    logo: {
        marginTop: 40,
        width: 125,
        height: 76,
    },
    tytle: {
        fontSize: 29,
        color: 'white',
        marginTop: 22,
        textAlign: 'center',
        fontWeight: '900'
    },
    wrapWay: {
        marginTop: 20,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 8,
    },
    way: {
        fontSize: 19,
        margin: 6,
        color: 'white',
        fontWeight: '900'
    },
    bookingTytle: {
        fontSize: 18,
        marginTop: 20,
        color: 'red',
        fontWeight: '800'
    },
    wrapBooking: {
        width: '80%',
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 12,
        alignItems: 'start',
        justifyContent: 'start',
        ...Platform.select({
            ios: {
                height: 245,
            },
            android: {
                height: 204,
            },
        }),
    },
    textBooking: {
        fontSize: 18,
        fontWeight: '800',
        marginTop: 10,
        ...Platform.select({
            ios: {
                marginLeft: 20,
                marginBottom: 5
            },
            android: {
                marginLeft: 16
            },
        }),
    },
    touchArrow: {
        width: 30,
        height: 36,
        position: 'absolute',
        right: 8,
        ...Platform.select({
            ios: {
                top: 98
            },
            android: {
                top: 78
            },
        }), 
    },
    arrows: {
        width: 30,
        height: 36,
    },
    wrapShowDate: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 18,
    },
    btnDate : {
        borderWidth: 2,
        borderColor: 'gray',
        borderRadius: 4,
        width: 140,
        height: 30,
        marginLeft: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBtnDate: {
        fontSize: 16,
        fontWeight: '800',
    },
    wrapTextDate: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    textDate: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '800'
    },
    textDateIOS: {
        fontSize: 18,
        marginLeft: 20,
        marginTop: 5,
        fontWeight: '800'
    },
    btnShowTrip: {
        width: 220,
        height: 40,
        borderRadius: 8,
        marginTop: 14,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBtnShowTrip: {
        color: "white",
        fontSize: 18,
        fontWeight: '900'
    },

    // modal
    wrapModal: {
        height: '100%',
        width: '100%',
        justifyContent: 'space-between',
        padding: 18
    },
    wrapTitle: {
        width: '100%',
        alignItems: 'center'
    },
    title: {
        fontSize: 18,
        color: 'white',
        fontWeight: '800',
    },
    label: {
        fontSize: 16,
        color: 'white',
        fontWeight: '800',
        marginTop: 14
    },
    textInput: {
        height: 30, 
        width: '100%',
        borderColor: 'white', 
        borderBottomWidth: 2,
        fontSize: 16,
        color: 'white',
        fontWeight: '800'
    },
    wrapBtns: {
        width: '90%',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    btnAuth: {
        width: 168,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBtnAuth: {
        fontSize: 18,
        color: "white",
        fontWeight: '900'
    },
})
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        width: '82%',
        fontSize: 18,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderBottomWidth: 2,
        borderColor: 'gray',
        borderRadius: 4,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        color: 'gray',
        fontWeight: '800'
    },
    inputAndroid: {
        width: '90%',
        height: 30,
        fontSize: 20,
        color: 'black',
        fontWeight: '800',
        marginBottom: 5,
    },
})

// https://snack.expo.dev/@lfkwtz/react-native-picker-select