import { takeEvery, put, call } from 'redux-saga/effects'
import { GET_COSTS, getCostsSuccess } from '../actions/getTravelsActions'
import httpProvider from '../../common/httpProvider'
import { COSTS_URL } from '../../common/api'

function* workerLoader() {
    try {
        const { data } = yield call(httpProvider.get, COSTS_URL)
    
        yield put(getCostsSuccess(data))
      } catch (error) {
        yield put(console.log(error))
      }
  }

export default function* watcherGetCosts() {
  yield takeEvery(GET_COSTS, workerLoader)
}
  