const initialState = {
    userTravel: {},
    userData: [],
    phoneNumber: '',   
    travels: '',

    // postUser - booking
    blockId: '',
    numberSeats: '',
    postSuccess: null,

    // getUser - profile
    getUserData: [],

    // daleteUser - profile
    blockIdDelete: '',
    deleteUserData: [],
    deleteUserSuccess: false,

    // очередь
    postQueue: {},
    postQueueSuccess: null,
    phoneNumber: '',
    userQueue: [],
    blockIdQueue: '',
    deleteQueueSuccess: false
}

const restUserTravelReduser = (state = initialState, action) => {
    switch (action.type){ 
        case 'SEND_USER':
            return {
                ...state,
                userTravel: action.payload
            }
        case 'POST_USER':
            
            const cities = state.userTravel?.choiceRoutes[0]?.cities
            const freeSeats = state.userTravel?.choiceRoutes[0]?.freeSeats - state.userTravel?.numberSeats
            const blockId = state.userTravel?.choiceRoutes[0]?.blockId

            // рейс со всеми пассажирами и вновь добавленным
            const userData = {
                cities,
                tripFrom: state.userTravel?.choiceRoutes[0]?.tripFrom, tripTo: state.userTravel?.choiceRoutes[0]?.tripTo, dateTrip: state.userTravel?.choiceRoutes[0]?.dateTrip, timeTrips: state.userTravel?.choiceRoutes[0]?.timeTrips,
                freeSeats,  blockId,
                persons: [
                    ...state.userTravel?.choiceRoutes[0]?.persons,
                    {
                        blockId, email: '', id: state.userTravel?.id, fullName: state.userTravel?.fullName, tripFrom: state.userTravel?.selectFrom, tripTo: state.userTravel?.selectTo, wayStart: state.userTravel?.wayStart, wayStop: state.userTravel.wayStop, 
                        dateTrip: state.userTravel?.choiceRoutes[0]?.dateTrip, phoneNumber: state.userTravel?.phoneNumber, numberSeats: state.userTravel?.numberSeats, 
                        timeStart: state.userTravel?.timeStart, timeStop: state.userTravel?.timeStop, cost: state.userTravel?.cost
                    }
                ]
            }
            return {
                ...state,
                blockId,
                userData,
                numberSeats: state.userTravel?.numberSeats,
                postSuccess: false
            }

        case 'POST_USER_SUCCESS':
            if(action.payload === "На рейсе закончились места!"){
                return {
                    ...state,
                    postSuccess: "На рейсе закончились места!",
                }
            }else{
                return {
                    ...state,
                    postSuccess: "Бронирование успешно завершено!",
                }
            }
        case 'GET_USER':
            return {
                ...state,
                phoneNumber: action.payload.phoneNumber,
            }
        case 'GET_USER_SUCCESS':
            const list = Object.keys(action.payload).map(key => ({...action.payload[key], blockId: key}))
            let peoples = []
            for (let i of list) {
                for (let s of i.persons) {
                    peoples.push(s)
                }
            }
            const getUserData = peoples.filter(item => item?.phoneNumber === state.phoneNumber)
            return {
                ...state,
                getUserData,
                travels: action.payload
            }
        case 'DELETE_USER':
            const blockIdDelete = action.payload?.blockId
            const id = action.payload?.id
            console.log(action.payload)
            const numberSeats = action.payload?.numberSeats
            // удаление из массива на экране
            //const newUserData = state.getUserData.filter(item => item.id !== id)
          
            // изменение на сервере 
            const findBlockId = state.travels[blockIdDelete]
            const freeSeatsDelete = findBlockId?.freeSeats + Number(numberSeats)
            //console.log(findBlockId?.persons.filter(item => item.id === id))
            const findItem = []
            for (let i of findBlockId) {
                console.log(i)
                //findItem.push(i.persons.filter(item => item.id !== id)[0])
            }
            console.log(findItem)
            //const index = findBlockId?.persons.findIndex(item => item.id === id)
            //console.log(findBlockId)
            let deleteUserData
            if (findBlockId?.persons.length > 1){
                deleteUserData = {
                    cities: findBlockId?.cities,
                    tripFrom: findBlockId?.tripFrom, tripTo: findBlockId?.tripTo, dateTrip: findBlockId?.dateTrip, timeTrips: findBlockId?.timeTrips, blockId: blockIdDelete,
                    freeSeats: freeSeatsDelete, 
                    //persons: findBlockId?.persons.filter(item => item.id !== id)
                    // persons:  [
                    //     ...findBlockId?.persons.splice(0, index),
                    //     ...findBlockId?.persons.splice(index + 1)
                    // ]
                }
            }
            return {
                ...state,
                blockIdDelete,
                //getUserData: newUserData,
                deleteUserData,
            }
        case 'DELETE_USER_SUCCESS':   
        //console.log(action.payload)
        return {
            ...state,
            //travels: action.payload,
            deleteUserSuccess: true
            }

        case 'POST_QUEUE':
            return {
                ...state,
                postQueue: action.payload
            }

        case 'POST_QUEUE_SUCCESS':
            return {
                ...state,
                postQueueSuccess: 'ok'
            } 
        case 'POST_QUEUE_ERROR':
            return {
                ...state,
                postQueueSuccess: 'error'
            }
        case 'GET_QUEUE':
            return {
                ...state,
                phoneNumber: action.payload.phoneNumber
            }
        case 'GET_QUEUE_SUCCESS':
            const listQueue = Object.keys(action.payload).map(key => ({...action.payload[key], blockId: key}))
            const findUserQueue = listQueue?.filter(item => item.phoneNumber === state.phoneNumber)
            return {
                ...state,
                userQueue: findUserQueue
            }
        case 'DELETE_QUEUE':
            const deleteQueue = state.userQueue?.filter(item => item.blockId !== action.payload)
            return {
                ...state,
                blockIdQueue: action.payload,
                userQueue: deleteQueue
            }
        case 'DELETE_QUEUE_SUCCESS':
            return {
                ...state,
                //userQueue: deleteQueue
            }
        case 'CLOSE_POST_SUCCESS':
            return {
                ...state,
                postQueueSuccess: null,
                postSuccess: null
            }
            
        default: 
        return state;  
    }
}

export default restUserTravelReduser
