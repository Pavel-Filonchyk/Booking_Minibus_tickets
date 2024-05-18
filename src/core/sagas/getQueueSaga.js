import { takeEvery, put, call } from 'redux-saga/effects'
import { GET_QUEUE, getQueueSuccess, getQueueError } from '../actions/restUserTravelActions'
import httpProvider from '../../common/httpProvider'
import { QUEUES_URL } from '../../common/api'

function* workerLoader() {
    try {
        const { data } = yield call(httpProvider.get, QUEUES_URL)
    
        yield put(getQueueSuccess(data))
      } catch (error) {
        yield put(getQueueError(error))
      }
  }

export default function* watcherGetQueue() {
  yield takeEvery(GET_QUEUE, workerLoader)
}