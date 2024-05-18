import { all } from 'redux-saga/effects'

import watcherGetDirections from './getDirectionsSaga'
import watcherGetCosts from './getCostsSaga'
import watcherGetTravels from './getTravelsSaga'
import watcherPostUser from './postUserSaga'
import watcherDeleteUser from './deleteUserSaga'
import watcherGetUser from './getUserSaga'
import watcherPostQueue from './postQueueSaga'
import watcherGetQueue from './getQueueSaga'
import watcherDeleteQueue from './deleteQueueSaga'
import watcherGetCode from './getCodeSaga'
import watcherPostMessage from './postMessageSaga'

export default function* rootSaga() {
    yield all([
        watcherGetDirections(),
        watcherGetCosts(),
        watcherGetTravels(),
        watcherPostUser(),
        watcherGetUser(),
        watcherDeleteUser(),
        watcherPostQueue(),
        watcherGetQueue(),
        watcherDeleteQueue(),
        watcherGetCode(),

    ])
}