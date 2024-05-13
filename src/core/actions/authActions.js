const authData = (data) => {
    return {
        type: 'AUTH-DATA',
        payload: data 
    } 
}

export {
    authData
}