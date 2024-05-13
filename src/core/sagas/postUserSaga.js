import { takeEvery, put, call, select } from 'redux-saga/effects'
import { POST_USER, postUserSuccess, postUserError } from '../actions/restUserTravelActions'
import { getAllTravelsSuccess, getAllTravelsError } from '../actions/getTravelsActions'
import httpProvider from '../../common/httpProvider'
import { TRAVELS_URL, travelUrl } from '../../common/api'

function* workerLoader() {
  
    const userData = yield select(state => state.restUserTravelReduser.userData)
    const blockId = yield select(state => state.restUserTravelReduser.blockId)
    const numberSeats = yield select(state => state.restUserTravelReduser.numberSeats)
    try {
        // повторный запрос на сервер по наличию свободных мест
        const { data } = yield call(httpProvider.get, TRAVELS_URL)
        const list = Object.keys(data).map(key => ({...data[key], blockId: key}))
        const findBlock = list.find(item => item.blockId === blockId)
    
        if(findBlock?.freeSeats >= numberSeats) {
            try {
            const { data } = yield call(httpProvider.put, travelUrl(blockId), {data: userData})
        
            yield put(postUserSuccess(data))
            } catch (error) {
            yield put(postUserError(error))
            }
        }else{
            yield put(postUserSuccess("На рейсе закончились места!"))
        }

        yield put(getAllTravelsSuccess(data))
    } catch (error) {
      yield put(getAllTravelsError(error))
    }

    
  }

export default function* watcherPostUser() {
  yield takeEvery(POST_USER, workerLoader)
}