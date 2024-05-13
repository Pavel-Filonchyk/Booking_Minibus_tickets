let userData = null

export const asyncStorage = (data) => {
    if (data?.key === 'setItem') {
        userData = data.value
        return 'SUCCESS'
    }
    if (data?.key === 'getItem') {
        return userData
    } else return null
}