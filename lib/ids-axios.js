'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.destroy = exports.query = exports.all = exports.get = exports.count = exports.createOrUpdate = exports.update = exports.create = exports.__ = exports.http = exports.sanitize = exports.transformResults = exports.getPath = exports.responseSuccessInterceptor = exports.responseErrorInterceptor = exports.requestInterceptor = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _aum = require('./aum');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CLASSES = 'classes';
const QUERY = 'query';

const requestInterceptor = exports.requestInterceptor = async config => {
    config.headers.Authorization = await (0, _aum.getAuthorizationHeader)();
    config.headers['trace-id'] = (0, _aum.getTraceId)();
    config.url = _path2.default.join(config.url, 'userid', process.env.IRIS_IDS_USERID);
    return config;
};

// setup our 401 error handler
const responseErrorInterceptor = exports.responseErrorInterceptor = async err => {
    // check to see if 401 from iris
    if (err.response && err.response.status && err.response.status === 401 && !err.config.__isRetryRequest) {
        // save off the original request
        const orgRes = _extends({}, err.config);
        orgRes.__isRetryRequest = true;
        orgRes.headers.Authorization = await (0, _aum.getAuthorizationHeader)(true);
        // replay the last request
        return (0, _axios2.default)(orgRes);
    } else {
        // we pass the error back to the calling party
        return Promise.reject(err);
    }
};

const responseSuccessInterceptor = exports.responseSuccessInterceptor = results => results;

//
// internal helpers
// 

const getPath = exports.getPath = (...params) => {
    return params.length > 0 ? '/' + params.join('/') : '';
};

const transformResults = exports.transformResults = results => {
    // if ids doesn't find anything
    // it returns a 204
    if (results.status === 204) return undefined;
    // return data
    return results.data;
};

const sanitize = exports.sanitize = data => {
    const payload = _extends({}, data);
    delete payload.objectId;
    delete payload.createdAt;
    delete payload.updatedAt;
    return payload;
};

const http = exports.http = _axios2.default.create({ baseURL: process.env.IRIS_IDS_SERVER_URL });

// this is a hack to enable jest mocks see 
// https://luetkemj.github.io/170421/mocking-modules-in-jest/
const __ = exports.__ = {
    http,
    requestInterceptor,
    responseErrorInterceptor,
    responseSuccessInterceptor,
    transformResults,
    sanitize,
    getPath

    // we defined http 1st then exported
    // so we have a place holder
};http.interceptors.request.use(__.requestInterceptor);
http.interceptors.response.use(__.responseSuccessInterceptor, __.responseErrorInterceptor);

//
// high level api
//

const create = exports.create = async (collectionName, data) => {
    return await __.http.post(__.getPath(CLASSES, collectionName), __.sanitize(data)).then(__.transformResults);
};

const update = exports.update = async (collectionName, id, data) => {
    return await __.http.put(__.getPath(CLASSES, collectionName, id), __.sanitize(data)).then(__.transformResults);
};

const createOrUpdate = exports.createOrUpdate = async (collectionName, q, data) => {
    return await __.http.put(__.getPath(CLASSES, collectionName), { query: q, object: __.sanitize(data) }).then(__.transformResults);
};

const count = exports.count = async collectionName => {
    return await __.http.get(__.getPath(CLASSES, collectionName, 'count')).then(__.transformResults);
};

const get = exports.get = async (collectionName, id) => {
    return await __.http.get(__.getPath(CLASSES, collectionName, id)).then(__.transformResults);
};

const all = exports.all = async collectionName => {
    return await __.http.get(__.getPath(CLASSES, collectionName)).then(__.transformResults);
};

const query = exports.query = async (collectionName, q) => {
    return await __.http.post(__.getPath(QUERY, collectionName), { query: q }).then(__.transformResults);
};

const destroy = exports.destroy = async (collectionName, id) => {
    return await __.http.delete(__.getPath(CLASSES, collectionName, id)).then(__.transformResults);
};
//# sourceMappingURL=ids-axios.js.map