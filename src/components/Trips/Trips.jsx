import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import AntDesign from '@expo/vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage'

import Footer from '../Footer/Footer'
import ModalWrapper from '../../wrapers/ModalWrarrer/ModalWrapper'
import { sendRoute } from '../../core/actions/getTravelsActions'
import { postQueue, closePostSuccess } from '../../core/actions/restUserTravelActions'

export default function Trips({ navigation }) {
    const dispatch = useDispatch()

    const travels = useSelector(({getTravelsReducer: { travels }}) => travels)
    const dataTravels = useSelector(({getTravelsReducer: { dataTravels }}) => dataTravels)
    const getError = useSelector(({getTravelsReducer: { getError }}) => getError)
    const postQueueSuccess = useSelector(({restUserTravelReduser: { postQueueSuccess }}) => postQueueSuccess )
    
    const [userData, setUserData] = useState('')
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        const getData = async () => {
             try {
                const value = await AsyncStorage.getItem('auth')
                const jsonValue = JSON.parse(value)
                if(value !== null) {
                    setUserData({phoneNumber: jsonValue?.phoneNumber, fullName: jsonValue?.fullName})
                }
            } catch(e) {
                console.log(e)
            }
         }
         getData()
     }, [])
    useEffect(() => {
        if (postQueueSuccess !== null){
            setShowModal(true)
            setTimeout(() => {
                setShowModal(false)
                navigation.navigate('main')
                dispatch(closePostSuccess())
            },2500)
        } 
    }, [postQueueSuccess])

    const onChoiceRoute = (blockId) => {
        const route = travels?.filter(item => item.blockId === blockId)
        dispatch(sendRoute(route))
        navigation.navigate('order')
    }
    const onPostQueue = (dataTrip) => {
        dispatch(postQueue({
            ...dataTrip, phoneNumber: userData?.phoneNumber
        }))
    }
   
    return (
        <View style={styles.container}>
            <View style={styles.wrapImg}>
                <Image 
                    style={styles.belImg}
                    source={require('../Main/images/bel.png')}
                />
            </View>
            <View style={styles.wrapTrips}>
                <Text style={styles.tytleTrips}>РЕЙСЫ</Text>
                <View style={{display: travels.length > 0 || getError ? 'none' : 'flex', alignItems: 'center', marginTop: 40}}>
                    <Text style={{...styleTextNotice, color: 'white', marginBottom: 30}}>На выбранные даты рейсов нет</Text>
                    <TouchableOpacity
                        style={styles.btnBack}
                        onPress={() => navigation.navigate('main')}
                    >
                        <Text style={styles.textBtnGetOrder}>Назад</Text>
                    </TouchableOpacity>
                </View>
                <View style={{display: getError ? 'flex' : 'none', alignItems: 'center', maxWidth: '80%', marginTop: 40}}>
                    <Text style={{...styleTextNotice, color: 'white', marginBottom: 30}}>Ошибка запроса рейсов. Попробуйте позже еще раз.</Text>
                    <TouchableOpacity
                        style={styles.btnBack}
                        onPress={() => navigation.navigate('main')}
                    >
                        <Text style={styles.textBtnGetOrder}>Назад</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                <View style={{width: '100%', alignItems: 'center', padding: 5}}>
                    {
                        travels?.map(item => {return (
                            <>
                                <View style={styles.wrapBlockTrips} key={item?.blockId}>
                                    <View style={styles.blockTrips}>
                                        <Text style={styles.textTrips}>Отправление:</Text>
                                        <Text style={styles.getTextTrips}>
                                            {
                                                item.cities.filter(elem => elem.city === dataTravels?.selectFrom)[0]?.city
                                            }
                                        </Text>
                                    </View>
                                    <View style={styles.blockTrips}>
                                        <Text style={styles.textTrips}>Прибытие:</Text>
                                        <Text style={styles.getTextTrips}>
                                            {
                                                item.cities.filter(elem => elem.city === dataTravels?.selectTo)[0]?.city
                                            }
                                        </Text>
                                    </View>
                                    <View style={styles.blockTrips}>
                                        <Text style={styles.textTrips}>Дата отправления:</Text>
                                        <Text style={styles.getTextTrips}>{item.dateTrip}</Text>
                                    </View>
                                    <View style={styles.blockTrips}>
                                        <Text style={styles.textTrips}>Время отправления:</Text>
                                        <Text style={styles.getTextTrips}>
                                            {
                                                item.cities.filter(elem => elem.city === dataTravels?.selectFrom)[0]?.busstops[0]?.time
                                            }
                                        </Text>
                                    </View>
                                    <View style={styles.blockTrips}>
                                        <Text style={styles.textTrips}>Время прибытия:</Text>
                                        <Text style={styles.getTextTrips}>
                                            {
                                                item.cities.filter(elem => elem.city === dataTravels?.selectTo)[0]?.busstops[0]?.time
                                            }
                                        </Text>
                                    </View>
                                    <View style={styles.blockTrips}>
                                        <Text style={{...styleTextNotice, display: item.freeSeats === 0 ? 'flex' : 'none'}}>Нет свободных мест</Text>
                                    </View>
                                    <View style={styles.blockTrips}>
                                        <Text style={styles.textTrips}>Количество свободных мест:</Text>
                                        <Text style={styles.getTextTrips}>
                                            {item.freeSeats >= 3 ? '3+' : item.freeSeats}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{display: item.freeSeats === 0 ? 'flex' : 'none', width: '85%', marginTop: 16}} >
                                    <Text style={{...styleTextNotice, color: 'white'}}>Как только появятся свободные места, мы вам сообщим</Text>
                                </View>
                                <View style={styles.wrapBtns}>
                                    {
                                        item.freeSeats === 0 
                                        ?
                                            <TouchableOpacity
                                                style={styles.btnPostQueue}
                                                onPress={() => onPostQueue(
                                                    {
                                                        tripFrom: item.cities.filter(elem => elem.city === dataTravels?.selectFrom)[0]?.city,
                                                        tripTo: item.cities.filter(elem => elem.city === dataTravels?.selectTo)[0]?.city,
                                                        dateTrip: item.dateTrip,
                                                        time: item.cities.filter(elem => elem.city === dataTravels?.selectFrom)[0]?.busstops[0]?.time,
                                                    })}
                                            >
                                                <Text style={styles.textBtnGetOrder}>Стать в</Text>
                                                <Text style={styles.textBtnGetOrder}>очередь</Text>
                                            </TouchableOpacity>
                                        : 
                                            <TouchableOpacity
                                                style={styles.btnGetOrder}
                                                onPress={() => onChoiceRoute(item.blockId)}
                                            >
                                                <Text style={styles.textBtnGetOrder}>Заказать</Text>
                                            </TouchableOpacity>
                                    }
                                    <TouchableOpacity
                                        style={styles.btnBack}
                                        onPress={() => navigation.navigate('main')}
                                    >
                                        <Text style={styles.textBtnGetOrder}>Назад</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )})
                    }
                </View>
            </ScrollView>
            <Footer
               navigation={navigation} 
            />
            <ModalWrapper showModal={showModal}>
                <View style={styles.wrapTextModal}>
                    {
                        postQueueSuccess === 'ok' ? 
                            <>
                                <Text style={styles.textModal}>Вы успешно</Text>
                                <Text style={styles.textModal}>стали в очередь</Text>
                                <AntDesign name="smileo" size={48} color="white" style={{marginTop: 20}} />
                            </>
                        
                        :   postQueueSuccess === 'error' ?
                            <>
                                <Text style={styles.textModal}>Ошибка бронирования</Text>
                                <Text style={styles.textModal}>Попробуйте снова</Text>
                                <AntDesign name="frowno" size={48} color="white" style={{marginTop: 20}} />
                            </>
                        :   <Text style={styles.textModal}>NULL</Text>
                    }
                </View>
            </ModalWrapper>
            
        </View>  
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4F9BDE',
        alignItems: 'center',
        justifyContent: 'space-between',
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
        height: 320
    },
    wrapTrips: {
        marginTop: 50,
        width: '100%',
        alignItems: 'center',
    },
    tytleTrips: {
        fontWeight: '800',
        fontSize: 22,
        marginBottom: 20,
        color: 'white',
    },
    wrapBlockTrips: {
        width: '95%',
        height: 260,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 12,
        justifyContent: 'space-around',
    },
    blockTrips: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    textTrips: {
        width: '60%',
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
        width: '100%',
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 25,

    },
    btnGetOrder: {
        width: 140,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnPostQueue : {
        width: 140,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnBack: {
        width: 140,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#3E5F8A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBtnGetOrder: {
        fontWeight: '900',
        fontSize: 18,
        color: "white",

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
const styleTextNotice = StyleSheet.create({
    fontSize: 18,
    fontWeight: '800', 
    color: 'red'
})