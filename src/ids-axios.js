import axios from 'axios'
import path from 'path'
import { getAuthorizationHeader, getTraceId } from './aum'

const CLASSES = 'classes'
const QUERY = 'query'

export const requestInterceptor = async config => {
    config.headers.Authorization = await getAuthorizationHeader()
    config.headers['trace-id'] = getTraceId();
    config.url = path.join(config.url, 'userid', process.env.IRIS_IDS_USERID)
    return config;
}

// setup our 401 error handler
export const responseErrorInterceptor = async (err) => {
    // check to see if 401 from iris
    if (err.response && err.response.status &&
        err.response.status === 401 && !err.config.__isRetryRequest) {
        // save off the original request
        const orgRes = { ...err.config }
        orgRes.__isRetryRequest = true;
        orgRes.headers.Authorization = await getAuthorizationHeader(true)
        // replay the last request
        return axios(orgRes);

    } else {
        // we pass the error back to the calling party
        return Promise.reject(err);
    }
}

export const responseSuccessInterceptor = results => results

//
// internal helpers
// 

export const getPath = (...params) => {
    return (params.length > 0) ? '/' + params.join('/') : ''
}

export const transformResults = results => {
    // if ids doesn't find anything
    // it returns a 204
    if (results.status === 204)
        return undefined
    // return data
    return results.data
}

export const sanitize = (data) => {
    const payload = { ...data }
    delete payload.objectId
    delete payload.createdAt
    delete payload.updatedAt
    return payload
}

export const http = axios.create({ baseURL: process.env.IRIS_IDS_SERVER_URL })

// this is a hack to enable jest mocks see 
// https://luetkemj.github.io/170421/mocking-modules-in-jest/
export const __ = {
    http,
    requestInterceptor,
    responseErrorInterceptor,
    responseSuccessInterceptor,
    transformResults,
    sanitize,
    getPath
}

// we defined http 1st then exported
// so we have a place holder
http.interceptors.request.use(__.requestInterceptor)
http.interceptors.response.use(__.responseSuccessInterceptor, __.responseErrorInterceptor)

//
// high level api
//

export const create = async (collectionName, data) => {
    return await __.http.post(__.getPath(CLASSES, collectionName), __.sanitize(data))
        .then(__.transformResults)
}

export const update = async (collectionName, id, data) => {
    return await __.http.put(__.getPath(CLASSES, collectionName, id), __.sanitize(data))
        .then(__.transformResults)
}

export const createOrUpdate = async (collectionName, q, data) => {
    return await __.http.put(__.getPath(CLASSES, collectionName),
        { query: q, object: __.sanitize(data) })
        .then(__.transformResults)
}

export const count = async (collectionName) => {
    return await __.http.get(__.getPath(CLASSES, collectionName, 'count'))
        .then(__.transformResults)
}

export const get = async (collectionName, id) => {
    return await __.http.get(__.getPath(CLASSES, collectionName, id))
        .then(__.transformResults)
}

export const all = async (collectionName) => {
    return await __.http.get(__.getPath(CLASSES, collectionName))
        .then(__.transformResults)
}

export const query = async (collectionName, q) => {
    return await __.http.post(__.getPath(QUERY, collectionName), { query: q })
        .then(__.transformResults)
}

export const destroy = async (collectionName, id) => {
    return await __.http.delete(__.getPath(CLASSES, collectionName, id))
        .then(__.transformResults)
}