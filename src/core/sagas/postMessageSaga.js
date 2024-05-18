import { takeEvery, put, call, select } from 'redux-saga/effects'
import { POST_USER_SUCCESS } from '../actions/restUserTravelActions'
import { postMessageSuccess, postMessageError } from '../actions/authActions'
import httpProvider from '../../common/httpProvider'
import { AUTH_URL } from '../../common/api'

function* workerLoader() {
    const token = 'eee5c109f44cc564cddcb00732f0834a'
    const alphaname_id = '5074'
    const phoneNumber = yield select(state => state.authReducer.phoneNumber)
    const ticketData = yield select(state => state.postUserReducer.ticketData)
    
    const message = `Ваш рейс: ${ticketData?.choiceRoutes[0].dateTrip} в ${ticketData?.timeStart}. Посадка: ${ticketData?.selectFrom}, ост. ${ticketData?.wayStart}. К оплате: ${ticketData?.costRoute} б.р. www.poleski-region.by/`

    try {
      const { data } = yield call(httpProvider.post, AUTH_URL, {
        data: {
          token, 
          alphaname_id,
          phone: phoneNumber,
          message
          
        }
      })
      yield put(postMessageSuccess(data))
    } catch (error) {
      yield put(postMessageError(error))
    }
  }

export default function* watcherPostMessage() {
  yield takeEvery(POST_USER_SUCCESS, workerLoader)
}
