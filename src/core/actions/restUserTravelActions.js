export const sendUser = (data) => {
    return {
        type: 'SEND_USER',
        payload: data 
    } 
}
export const getUser = (data) => {
    return {
        type: 'GET_USER',
        payload: data 
    } 
}
export const GET_USER = 'GET_USER'
export const getUserSuccess = (data) => {
    return {
        type: 'GET_USER_SUCCESS',
        payload: data 
    } 
}
export const getUserError = (data) => {
    return {
        type: 'GET_USER_ERROR',
        payload: data 
    } 
}

export const postUser = (data) => {
    return {
        type: 'POST_USER',
        payload: data 
    } 
}
export const POST_USER = 'POST_USER'

export const postUserSuccess = (data) => {
    return {
        type: 'POST_USER_SUCCESS',
        payload: data 
    } 
}
export const postUserError = (data) => {
    return {
        type: 'POST_USER_ERROR',
        payload: data 
    } 
}
export const deleteUser = (data) => {
    return {
        type: 'DELETE_USER',
        payload: data 
    } 
}
export const DELETE_USER = 'DELETE_USER'
export const deleteUserSuccess = (data) => {
    return {
        type: 'DELETE_USER_SUCCESS',
        payload: data 
    } 
}

export const postQueue = (data) => {
    return {
        type: 'POST_QUEUE',
        payload: data 
    } 
}
export const POST_QUEUE = 'POST_QUEUE'
export const postQueueSuccess = (data) => {
    return {
        type: 'POST_QUEUE_SUCCESS',
        payload: data 
    } 
}
export const postQueueError = (data) => {
    return {
        type: 'POST_QUEUE_ERROR',
        payload: data 
    } 
}
export const getQueue = (data) => {
    return {
        type: 'GET_QUEUE',
        payload: data 
    } 
}
export const GET_QUEUE = 'GET_QUEUE'
export const getQueueSuccess = (data) => {
    return {
        type: 'GET_QUEUE_SUCCESS',
        payload: data 
    } 
}
export const getQueueError = (data) => {
    return {
        type: 'GET_QUEUE_ERROR',
        payload: data 
    } 
}
export const deleteQueue = (data) => {
    return {
        type: 'DELETE_QUEUE',
        payload: data 
    } 
}
export const DELETE_QUEUE = 'DELETE_QUEUE'
export const deleteQueueSuccess = (data) => {
    return {
        type: 'DELETE_QUEUE_SUCCESS',
        payload: data 
    } 
}
export const deleteQueueError = (data) => {
    return {
        type: 'DELETE_QUEUE_ERROR',
        payload: data 
    } 
}
export const closePostSuccess = (data) => {
    return {
        type: 'CLOSE_POST_SUCCESS',
        payload: data 
    } 
}