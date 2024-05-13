import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native'
import { useDispatch } from 'react-redux'
import PhoneInput from "react-native-phone-number-input"
//import RNCAsyncStorage from '@react-native-community/async-storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ModalWrapper from '../../wrapers/ModalWrarrer/ModalWrapper'
import { asyncStorage } from '../../constants/index'
import { authData } from '../../core/actions/authActions'

export default function Auth({ navigation }) {

    const dispatch = useDispatch()

    const [fullName, setFullName] = useState('Pavel')
    const [phoneNumber, setPhoneNumber] = useState('+37500')
    const [getCode, setGetCode] = useState(false)
    const [code, setCode] = useState('')
    const [showModal, setShowModal] = useState(true)

    useEffect(() => {
        if (asyncStorage({key: 'getItem'}) !== null) {
            //navigation.navigate('home') 
        }
    }, [])
   
    const onConfirmCode = () => {
        dispatch(authData({fullName, phoneNumber}))
        
        asyncStorage({key: 'setItem', value: {fullName, phoneNumber}})
        //navigation.navigate('home')
        setGetCode(false)
    }
    return (
        <View style={styles.container}>
            {/* <View style={styles.wrapImg}>
                <Image 
                    style={styles.belImg}
                    source={require('../Main/images/bel.png')}
                />
            </View>
            <View style={styles.wrapAuth}>
                <Text style={styles.tytleAuth}>АВТОРИЗАЦИЯ</Text>
                <View style={styles.wrapBlockAuth}>
                    <Text style={styles.label}>Введите имя и фамилию</Text>
                    <TextInput
                        style={styles.inputFullName}
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
                        containerStyle={{height: 50, width: '100%', borderRadius: 6, textAlign: 'center'}}
                        textInputStyle={{fontSize: 15, fontWeight: '800', color:'#1B5583'}}
                        codeTextStyle={{fontSize: 15, fontWeight: '800', color:'#1B5583'}}
                        //autoFocus
                    />
                </View>
                {
                    !getCode
                    ?    <View style={styles.wrapTextInfo}>
                            <Text style={styles.textInfo}>Для подтверждения авторизации необходимо получить код на телефон</Text>
                        </View>
                    :   <View style={styles.wrapTextInfo}>
                            <Text style={styles.textInfo}>На номер был выслан код подтверждения.
                                Введите код в поле и после подтверждения сможете завершить авторизацию.</Text>
                        </View>

                }
                
                <View style={styles.wrapBtns}>
                    {
                        !getCode
                        ?   <>
                                <TouchableOpacity
                                    style={styles.btnAuth}
                                    onPress={() => setGetCode(true)}
                                >
                                    <Text style={styles.textBtnAuth}>Получить код</Text>
                                </TouchableOpacity>
                            </>
                        :   <>
                                <TouchableOpacity
                                    style={styles.btnAuth}
                                    onPress={() => onConfirmCode()}
                                >
                                    <Text style={styles.textBtnAuth}>Подтвердить</Text>
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.inputCode}
                                    onChangeText={(e) => setCode(e)}
                                    value={code}
                                />
                            </>
                    }
                </View>

                
            </View> */}

            <ModalWrapper showModal={showModal}>
                <View style={styles.wrapModal}>
                    <View style={styles.wrapTitle}>
                        <Text style={styles.title}>РЕГИСТРАЦИЯ</Text>
                    </View>
                    
                    <Text style={styles.label}>Введите имя и фамилию</Text>
                    <TextInput
                        style={styles.inputFullName}
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
                        style={styles.inputCode}
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
    wrapAuth: {
        marginTop: 'auto',
        marginBottom: 'auto',
        width: '100%',
        alignItems: 'center',
    },
    tytleAuth: {
        fontSize: 22,
        marginBottom: 10,
        color: 'white',
        fontWeight: '900'
    },
    wrapBlockAuth: {
        width: '90%',
        height: 180,
        justifyContent: 'space-around'
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
    inputFullName: {
        height: 30, 
        width: '100%',
        borderColor: 'white', 
        borderBottomWidth: 2,
        fontSize: 16,
        color: 'white',
        fontWeight: '800'
    },
    wrapTextInfo: {
        width: '90%',
        marginTop: 10
    },
    textInfo: {
        marginRight: 10,
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
    btnBack: {
        width: 120,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'rgb(38, 166, 190)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBtnAuth: {
        fontSize: 18,
        color: "white",
        fontWeight: '900'
    },
    inputCode: {
        borderBottomWidth: 2,
        borderBottomColor: 'white',
        width: '100%',
        marginRight: 10,
        color: 'white',
        marginTop: 10,
        fontWeight: '800',
        fontSize: 16,
    },
    wrapModal: {
        height: '100%',
        width: '100%',
        justifyContent: 'space-between',
        padding: 18
    }
})
