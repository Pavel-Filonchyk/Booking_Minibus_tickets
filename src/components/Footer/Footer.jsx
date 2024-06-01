import { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image, Linking, Platform } from 'react-native';

export default function Footer({ navigation }) {

    const [showPhone, setShowPhone] = useState(false)

    const onChangePage = (arg) => {
        setShowPhone(false)
        
        navigation.navigate(arg === 'main' ? 'main' : 'profile')
    }

    return (
        <View style={styles.footer}>
            <View style={{display: showPhone ? 'flex' : 'none', width: '100%', alignItems: 'center', position: 'absolute', bottom: 50, backgroundColor: '#1B5583'}}>
                <TouchableOpacity
                    onPress={() => Linking.openURL(Platform.OS !== 'android' ? 'telprompt:+375259802774' : 'tel:+375259802774')}
                >
                    <Text style={styles.phoneNumber}>Life +375(25)980-2774</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => Linking.openURL(Platform.OS !== 'android' ? 'telprompt:+375259802774' : 'tel:+375259802774')}
                >
                    <Text style={styles.phoneNumber}>Life +375(25)980-2774</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.panelFooter}>
                <TouchableOpacity style={{marginRight: 30}}
                    onPress={() => onChangePage('main')}
                >
                    <Image 
                        style={styles.btnFooter}
                        source={require('./images/home.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setShowPhone(item => !item)}
                >
                    <Image 
                        style={styles.btnFooter}
                        source={require('./images/phone.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: 30}}
                    onPress={() => onChangePage('profile')}
                >
                    <Image 
                        style={styles.btnFooter}
                        source={require('./images/user.png')}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    footer: {
        width: '100%',
    },
    phoneNumber: {
        fontSize: 18,
        color: 'white',
        margin: 6,
        fontWeight: '900'
    },
    panelFooter: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    btnFooter: {
        height: 28,
        width: 28,
        marginBottom: 5
    }
})
