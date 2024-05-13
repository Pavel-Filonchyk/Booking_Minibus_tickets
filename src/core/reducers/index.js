import authReducer from './authReducer'
import getTravelsReducer from './getTravelsReducer'
import restUserTravelReduser from './restUserTravelReduser'

export const rootReducer = () => {
    return { getTravelsReducer, restUserTravelReduser, authReducer }
}