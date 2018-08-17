'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.runTransformers = exports.idTransformer = exports.dateTransformer = exports.toDate = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const toDate = exports.toDate = (obj, prop) => {
    if (obj && obj[prop] && !_moment2.default.isDate(obj[prop]) && !_moment2.default.isMoment(obj[prop])) obj[prop] = _moment2.default.utc(obj[prop]);
};

const dateTransformer = exports.dateTransformer = obj => {
    toDate(obj, 'updatedAt');
    toDate(obj, 'createdAt');
};

const idTransformer = exports.idTransformer = obj => {
    if (obj && obj.id) {
        const { id } = obj;
        delete obj.id;
        obj.objectId = id;
    }
};

const runTransformers = exports.runTransformers = obj => {
    idTransformer(obj);
    dateTransformer(obj);
};
//# sourceMappingURL=utils.js.map