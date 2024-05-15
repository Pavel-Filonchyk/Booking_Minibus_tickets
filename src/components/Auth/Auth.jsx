import { useEffect, useState, useLayoutEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native'
import { useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Auth({ navigation }) {
    
    const dispatch = useDispatch()

    const [fullName, setFullName] = useState('Pavel')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [getCode, setGetCode] = useState(false)
    const [code, setCode] = useState('')

    useLayoutEffect(() => {
        const getItemStorage = async () => {
            try {
                const value = await AsyncStorage.getItem('auth')
                if(value !== null) {
                    navigation.navigate('main')
                    return value
                }
            } catch(e) {
                console.log(e)
            }
        }
        getItemStorage()
    }, [])

    const onConfirmCode = async () => {
        try {
            const jsonValue = JSON.stringify({fullName, phoneNumber: `+375${phoneNumber}`})
            await AsyncStorage.setItem('auth', jsonValue)
        } catch (e) {
            console.log(e)
        }
        setGetCode(false)
    }

    return (
        <View style={styles.container}>
            <View style={styles.wrapAuth}>
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
                <View style={styles.wrapPhoneNumber}>
                    <Text style={styles.textPhoneNumber}>+375</Text>
                    <TextInput
                        style={styles.phoneInput}
                        onChangeText={(e) => setPhoneNumber(e)}
                        value={phoneNumber}
                    />
                </View>
                {/* <PhoneInput
                    defaultValue={phoneNumber}
                    defaultCode='BY'
                    onChangeFormattedText={(number) => {
                        setPhoneNumber(number)
                    }}
                    placeholder=' '
                    containerStyle={{height: 45, width: '90%', borderRadius: 6, textAlign: 'center'}}
                    textInputStyle={{fontSize: 14, fontWeight: '800', color:'#1B5583'}}
                    codeTextStyle={{fontSize: 14, fontWeight: '800', color:'#1B5583'}}
                
                /> */}
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1B5583',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    wrapAuth: {
        marginTop: 'auto',
        marginBottom: 'auto',
        width: '80%',
        alignItems: 'flex-start',
    },
    wrapTitle: {
        width: '100%',
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        color: 'white',
        fontWeight: '800',
        marginBottom: 14
    },
    label: {
        fontSize: 16,
        color: 'white',
        fontWeight: '800',
        marginTop: 14
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
        marginTop: 10,
        width: 55
    },
    phoneInput: {
        width: '100%',
        borderColor: 'white', 
        borderBottomWidth: 2,
        fontSize: 16,
        color: 'white',
        fontWeight: '800',
        marginTop: 10
    },
    textInput: {
        height: 30, 
        width: '100%',
        borderColor: 'white', 
        borderBottomWidth: 2,
        fontSize: 16,
        color: 'white',
        fontWeight: '800',
        marginTop: 10
    },
    wrapBtns: {
        width: '100%',
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnAuth: {
        width: 168,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#008080',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBtnAuth: {
        fontSize: 18,
        color: "white",
        fontWeight: '900'
    },
})
