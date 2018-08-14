import axios from 'axios'
import { v1 as uuid } from 'uuid'

let AUM_JWT

export const getTraceId = () => {
    return `IDS-ODM:${uuid()}`
}

export const base64Encode = () => {
    return new Buffer(`${process.env.IRIS_AUM_APP_KEY}:${process.env.IRIS_AUM_APP_SECRET}`).toString('base64')
}


export const getAuthorizationHeader = async (poisonCache = false) => {
    if (poisonCache || !AUM_JWT)
        AUM_JWT = await __.getAumJwt()

    return `Bearer ${AUM_JWT}`
}

export const getAumJwt = async () => {
    try {
        const response = await axios.post(
            process.env.IRIS_AUM_SERVER_URL + '/login/',
            { "Type": "Server" },
            {
                headers: {
                    "trace-id": getTraceId(),
                    Authorization: 'Basic ' + base64Encode()
                }
            }
        )
        return response.data.Token
    } catch (err) {
        throw err;
    }
}

// this is a hack to enable jest mocks see 
// https://luetkemj.github.io/170421/mocking-modules-in-jest/
export const __ = {
    getAumJwt
}