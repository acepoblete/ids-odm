"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _arguments = arguments;
const wrap = exports.wrap = target => {
    return new Proxy(target, proxyHandler);
};

const proxyHandler = exports.proxyHandler = {
    get: (target, prop, reciever) => {
        if (prop in target) return target[prop];
        if (target.attributes && prop in target.attributes) return target.attributes[prop];
        return Reflect.get.apply(Reflect, _arguments);
    },
    set: (target, prop, value) => {
        if (prop in target) {
            target[prop] = value;
            return true;
        }
        if (target.attributes) {
            target.attributes[prop] = value;
            return true;
        }
        return Reflect.set.apply(Reflect, _arguments);
    },
    deleteProperty: (target, prop) => {
        if (target.attributes && prop in target.attributes) {
            delete target.attributes[prop];
            return true;
        }
        return Reflect.deleteProperty.apply(Reflect, _arguments);
    }
};
//# sourceMappingURL=ids-proxy.js.map