import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import AntDesign from '@expo/vector-icons/AntDesign'

import Footer from '../Footer/Footer'
import ModalWrapper from '../../wrapers/ModalWrarrer/ModalWrapper'
import { postUser, closePostSuccess } from '../../core/actions/restUserTravelActions'

export default function Check({ navigation }) {
    const dispatch = useDispatch()

    const userTravel = useSelector(({restUserTravelReduser: { userTravel }}) => userTravel)
    const postSuccess = useSelector(({restUserTravelReduser: { postSuccess }}) => postSuccess )

    const fullName = useSelector(({authReducer: { fullName }}) => fullName)
    const phoneNumber = useSelector(({authReducer: { phoneNumber }}) => phoneNumber)
    
    const [showModal, setShowModal] = useState(false)
   

    useEffect(() => {
        if(postSuccess !== null){
            setShowModal(true)
            setTimeout(() => {
                navigation.navigate('main')
                setShowModal(false)
                dispatch(closePostSuccess())
            },2500)
        }
    }, [postSuccess])

    const onPostUserTravel = () => {
        dispatch(postUser())
        setShowModal
        
    }

    return (
        <View style={styles.container}>
            <View style={styles.wrapImg}>
                <Image 
                    style={styles.belImg}
                    source={require('../Main/images/bel.png')}
                />
            </View>
            <View style={styles.wrapCheck}>
                <Text style={styles.tytleCheck}>ЗАКАЗ</Text>
                <View style={styles.wrapBlockCheck}>
                    <View style={styles.blockTrips}>
                        <Text style={styles.textTrips}>Маршрутка до:</Text>
                        <Text style={styles.getTextTrips}>{userTravel?.choiceRoutes[0].tripTo}</Text>
                    </View>
                    <View style={styles.blockTrips}>
                        <Text style={styles.textTrips}>Посадка:</Text>
                        <Text style={styles.getTextTrips}>{userTravel?.selectFrom}, ост. {userTravel?.wayStart}</Text>
                    </View>
                    <View style={styles.blockTrips}>
                        <Text style={styles.textTrips}>Высадка:</Text>
                        <Text style={styles.getTextTrips}>{userTravel?.selectTo}, ост. {userTravel?.wayStop}</Text>
                    </View>
                    <View style={styles.blockTrips}>
                        <Text style={styles.textTrips}>Дата отправления:</Text>
                        <Text style={styles.getTextTrips}>{userTravel?.choiceRoutes[0].dateTrip}</Text>
                    </View>
                    <View style={styles.blockTrips}>
                        <Text style={styles.textTrips}>Время отправления:</Text>
                        <Text style={styles.getTextTrips}>{userTravel?.timeStart}</Text>
                    </View>
                    <View style={styles.blockTrips}>
                        <Text style={styles.textTrips}>Время прибытия:</Text>
                        <Text style={styles.getTextTrips}>{userTravel?.timeStop}</Text>
                    </View>
                    <View style={styles.blockTrips}>
                        <Text style={styles.textTrips}>Количество мест:</Text>
                        <Text style={styles.getTextTrips}>{userTravel?.numberSeats}</Text>
                    </View>
                    <View style={styles.blockTrips}>
                        <Text style={styles.textTrips}>Цена:</Text>
                        <Text style={styles.getTextTrips}>{userTravel?.cost} б.р.</Text>
                    </View>
                    <View style={styles.blockTrips}>
                        <Text style={styles.textTrips}>Имя и Фамилия:</Text>
                        <Text style={styles.getTextTrips}>{userTravel?.fullName}</Text>
                    </View>
                    <View style={styles.blockTrips}>
                        <Text style={styles.textTrips}>Телефон:</Text>
                        <Text style={styles.getTextTrips}>{userTravel?.phoneNumber}</Text>
                    </View>
                </View>
                <View style={styles.wrapBtns}>
                    <TouchableOpacity
                        style={styles.btnOrder}
                        onPress={onPostUserTravel}
                    >
                        <Text style={styles.textBtnOrder}>Подтвердить</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btnBack}
                        onPress={() => navigation.navigate('main')}
                    >
                        <Text style={styles.textBtnOrder}>Назад</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ModalWrapper showModal={showModal}>
                <View style={styles.wrapTextModal}>
                    {
                        postSuccess === "Бронирование успешно завершено!" ? 
                            <>
                                <Text style={styles.textModal}>Бронирование</Text>
                                <Text style={styles.textModal}>успешно завершено!</Text>
                                <AntDesign name="smileo" size={48} color="white" style={{marginTop: 20}} />
                            </>
                        :   postSuccess === "На рейсе закончились места!" ? 
                            <>
                                <Text style={styles.textModal}>На рейсе</Text>
                                <Text style={styles.textModal}>закончились места!</Text>
                                <AntDesign name="frowno" size={48} color="white" style={{marginTop: 20}} />
                            </>
                        :   postSuccess === 'error' ?
                            <>
                                <Text style={styles.textModal}>Ошибка бронирования</Text>
                                <Text style={styles.textModal}>Попробуйте снова</Text>
                                <AntDesign name="frowno" size={48} color="white" style={{marginTop: 20}} />
                            </>
                        :   ''
                    }
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
        height: 295
    },
    wrapCheck: {
        marginTop: 'auto',
        marginBottom: 'auto',
        width: '100%',
        alignItems: 'center',
    },
    tytleCheck: {
        fontSize: 22,
        marginBottom: 20,
        color: 'white',
        fontWeight: '900'
    },
    wrapBlockCheck: {
        width: '90%',
        height: 340,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 12,
        justifyContent: 'space-around',
        padding: 8
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
    wrapBtns: {
        width: '85%',
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    btnOrder: {
        width: 168,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnBack: {
        width: 120,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#3E5F8A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBtnOrder: {
        fontSize: 18,
        color: "white",
        fontWeight: '900'
    },
    wrapTextModal: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textModal: {
        fontWeight: '600',
        fontSize: 32,
        color: "white",
        lineHeight: 50,
        textAlign: 'center'
    }
})