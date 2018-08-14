'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.__ = exports.getAumJwt = exports.getAuthorizationHeader = exports.base64Encode = exports.getTraceId = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _uuid = require('uuid');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let AUM_JWT;

const getTraceId = exports.getTraceId = () => {
    return `IDS-ODM:${(0, _uuid.v1)()}`;
};

const base64Encode = exports.base64Encode = () => {
    return new Buffer(`${process.env.IRIS_AUM_APP_KEY}:${process.env.IRIS_AUM_APP_SECRET}`).toString('base64');
};

const getAuthorizationHeader = exports.getAuthorizationHeader = async (poisonCache = false) => {
    if (poisonCache || !AUM_JWT) AUM_JWT = await __.getAumJwt();

    return `Bearer ${AUM_JWT}`;
};

const getAumJwt = exports.getAumJwt = async () => {
    try {
        const response = await _axios2.default.post(process.env.IRIS_AUM_SERVER_URL + '/login/', { "Type": "Server" }, {
            headers: {
                "trace-id": getTraceId(),
                Authorization: 'Basic ' + base64Encode()
            }
        });
        return response.data.Token;
    } catch (err) {
        throw err;
    }
};

// this is a hack to enable jest mocks see 
// https://luetkemj.github.io/170421/mocking-modules-in-jest/
const __ = exports.__ = {
    getAumJwt
};
//# sourceMappingURL=aum.js.map