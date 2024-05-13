import { takeEvery, put, call } from 'redux-saga/effects'
import { GET_DIRECTIONS, getDirectionsSuccess } from '../actions/getTravelsActions'
import httpProvider from '../../common/httpProvider'
import { DIRECTIONS_URL } from '../../common/api'

function* workerLoader() {
    try {
        const { data } = yield call(httpProvider.get, DIRECTIONS_URL)
        yield put(getDirectionsSuccess(data))
        
      } catch (error) {
        yield put(console.log(error))
      }
  }

export default function* watcherGetDirections() {
  yield takeEvery(GET_DIRECTIONS, workerLoader)
}
  