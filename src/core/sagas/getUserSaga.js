import { takeEvery, put, call } from 'redux-saga/effects'
import { GET_USER, getUserSuccess, getUserError } from '../actions/restUserTravelActions'
import httpProvider from '../../common/httpProvider'
import { TRAVELS_URL } from '../../common/api'

function* workerLoader() {
    try {
        const { data } = yield call(httpProvider.get, TRAVELS_URL)
    
        yield put(getUserSuccess(data))
      } catch (error) {
        yield put(getUserError(error))
      }
  }

export default function* watcherGetUser() {
  yield takeEvery(GET_USER, workerLoader)
}