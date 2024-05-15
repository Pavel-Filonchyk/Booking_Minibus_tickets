import {Provider} from 'react-redux'
import store from './src/core/store'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import 'react-native-reanimated'
import Main from './src/components/Main/Main'
import Trips from './src/components/Trips/Trips'
import Order from './src/components/Order/Order'
import Check from './src/components/Check/Check'
import Profile from './src/components/Profile/Profile'
import Auth from './src/components/Auth/Auth'

const Stack = createNativeStackNavigator()

export default function App() {

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="auth">
          <Stack.Screen name="auth" component={Auth} options={{ headerShown: false }}/>
          <Stack.Screen name="profile" component={Profile} options={{ headerShown: false }}/>
          <Stack.Screen name="main" component={Main} options={{ headerShown: false }}/>
          <Stack.Screen name="trips" component={Trips} options={{ headerShown: false }}/>
          <Stack.Screen name="order" component={Order} options={{ headerShown: false }}/>
          <Stack.Screen name="check" component={Check} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}


