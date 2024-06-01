import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import RNPickerSelect from 'react-native-picker-select'
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-uuid' 

import Footer from '../Footer/Footer'
import { sendUser } from '../../core/actions/restUserTravelActions'

export default function Order({ navigation }) {

    const dispatch = useDispatch()

    const dataTravels = useSelector(({getTravelsReducer: { dataTravels }}) => dataTravels)
    const choiceRoutes = useSelector(({getTravelsReducer: { choiceRoutes }}) => choiceRoutes)
    const costs = useSelector(({getTravelsReducer: { costs }}) => costs)

    const [userData, setUserData] = useState('')
   
    const [wayStart, setSelectWayStart] = useState("")
    const [wayStop, setSelectWayStop] = useState("")
    const [numberSeats, setNumberSeats] = useState(1)
    const [error, setError] = useState(false)
  
    const timeStart = choiceRoutes[0]?.cities.filter(item => item.city === dataTravels?.selectFrom)[0]
        ?.busstops.filter(elem => elem.busstop === wayStart)[0]?.time
    const timeStop = choiceRoutes[0]?.cities.filter(item => item.city === dataTravels?.selectTo)[0]
        ?.busstops.filter(elem => elem.busstop === wayStop)[0]?.time

    let costRoute
    for (let item of costs) {
        const findCost = () => {
            if(item.wayFrom === dataTravels?.selectFrom && item.wayTo === dataTravels?.selectTo){
                return item.cost
            }else{return null}
        }
        if(findCost() !== null){
            costRoute = findCost()
        } 
    }
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
    const onSendOrder = () => {
        if (!wayStart || !wayStop) {
            setError(true)
        }
        if (wayStart && wayStop) {
            dispatch(sendUser({
                choiceRoutes,
                selectFrom: dataTravels?.selectFrom,
                wayStart,
                selectTo: dataTravels?.selectTo,
                wayStop,
                timeStart,
                timeStop,
                numberSeats,
                cost: costRoute ? costRoute * numberSeats : '-',
                fullName: userData?.fullName,
                phoneNumber: userData?.phoneNumber,
                id: uuid(),
            }))
            setError(false)
            navigation.navigate('check')
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
            <View style={styles.wrapOrder}>
                <View style={styles.wrapFilling}>
                    <View style={styles.blockTrips}>
                        <Text style={styles.textTrips}>Маршрутка до:</Text>
                        <Text style={styles.getTextTrips}>{choiceRoutes[0]?.tripTo}</Text>
                    </View>
                    <View style={styles.blockTrips}>
                        <Text style={styles.textTrips}>Посадка - Высадка:</Text>
                        <Text style={styles.getTextTrips}>{dataTravels?.selectFrom} - {dataTravels?.selectTo}</Text>
                    </View>
                    <View style={styles.blockTrips}>
                        <Text style={styles.textTrips}>Дата отправления:</Text>
                        <Text style={styles.getTextTrips}>{choiceRoutes[0]?.dateTrip}</Text>
                    </View>
                    <View style={styles.blockTrips}>
                        <Text style={styles.textTrips}>Время отправления:</Text>
                        <Text style={styles.getTextTrips}>{timeStart}</Text>
                    </View>
                    <View style={styles.blockTrips}>
                        <Text style={styles.textTrips}>Время прибытия:</Text>
                        <Text style={styles.getTextTrips}>{timeStop}</Text>
                    </View>
                    <View style={styles.blockTrips}>
                        <Text style={styles.textTrips}>Цена:</Text>
                        <Text style={styles.getTextTrips}>{costRoute ? costRoute * numberSeats : '-'} б.р.</Text>
                    </View>
                    <Text style={styles.label}>Остановка посадки</Text>
                    <RNPickerSelect
                        placeholder={{label: 'Сделайте выбор', value: 'null'}}
                        value={wayStart}
                        onValueChange={(value) => setSelectWayStart(value)}
                        doneText='Выбрать'
                        items={
                            choiceRoutes[0]?.cities.filter(item => item.city === dataTravels?.selectFrom)[0]
                                ?.busstops?.map(elem => {return(
                                    {label: elem.busstop, value: elem.busstop}
                            )})
                        }
                        style={{
                            ...pickerSelectStyles,
                            placeholder: {
                                color: 'black',
                                fontSize: 18,
                                fontWeight: '800',
                                color: 'white'
                            },
                        }}
                    />
                    <Text style={styles.label}>Остановка высадки</Text>
                    <RNPickerSelect
                        placeholder={{label: 'Сделайте выбор', value: 'null'}}
                        value={wayStop}
                        onValueChange={(value) => setSelectWayStop(value)}
                        doneText='Выбрать'
                        items={
                            choiceRoutes[0]?.cities.filter(item => item.city === dataTravels?.selectTo)[0]
                                ?.busstops?.map(elem => {return(
                                    {label: elem.busstop, value: elem.busstop}
                            )})
                        }
                        style={{
                            ...pickerSelectStyles,
                            placeholder: {
                                color: 'black',
                                fontSize: 18,
                                fontWeight: '800',
                                color: 'white'
                            },
                        }}
                    />
                    <Text style={styles.label}>Количество мест</Text>
                    <RNPickerSelect
                        placeholder={{label: '1', value: ''}}
                        value={numberSeats}
                        onValueChange={(value) => setNumberSeats(value)}
                        doneText='Выбрать'
                        items={
                            choiceRoutes[0]?.freeSeats >= 3
                            ? 
                                [
                                    {label: '1', value: 1},
                                    {label: '2', value: 2},
                                    {label: '3', value: 3}
                                ]
                            : Array(choiceRoutes[0]?.freeSeats).fill(0).map((item, index) => {return (
                                    {label: `${index +1}`, value: index +1}
                                )})
                         }
                        style={{
                            ...pickerSelectStyles,
                            placeholder: {
                                color: 'white',
                                fontSize: 18,
                                fontWeight: '800'
                            },
                        }}
                    />
                </View>
                <Text style={{...textError, display: error ? 'flex' : 'none' }}>Необходимо заполнить все поля</Text>
                <View style={styles.wrapBtns}>
                    <TouchableOpacity
                        style={styles.btnOrder}
                        onPress={() => onSendOrder()}
                    >
                        <Text style={styles.textBtnOrder}>Забронировать</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btnBack}
                        onPress={() => navigation.navigate('main')}
                    >
                        <Text style={styles.textBtnOrder}>Назад</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    wrapOrder: {
        marginTop: 'auto',
        marginBottom: 'auto',
        width: '100%',
        alignItems: 'center',
    },
    wrapFilling: {
        width: '85%',
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
    label: {
        fontSize: 16,
        marginTop: 10,
        color: 'white',
        fontWeight: '800'
    },
    wrapBtns: {
        width: '85%',
        marginTop: 20,
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
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        width: '100%',
        fontSize: 18,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderBottomWidth: 2,
        borderColor: 'white',
        borderRadius: 4,
        marginRight: 10,
        marginBottom: 5,
        color: 'white',
        fontWeight: '800'
    },
    inputAndroid: {
        width: '100%',
        height: 30,
        fontSize: 20,
        color: 'white',
        marginBottom: 5,
        fontWeight: '800',
        fontSize: 18,
    },
})
const textError = StyleSheet.create({
    fontSize: 16,
    marginTop: 10,
    color: 'red',
    paddingLeft: 20,
    paddingRight: 20,
    fontWeight: '800'
})
