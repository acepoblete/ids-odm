
export const wrap = (target) => {
    return new Proxy(target, proxyHandler)
}

export const proxyHandler = {
    get: (target, prop, reciever) => {
        if (prop in target) return target[prop]
        if (target.attributes && prop in target.attributes) return target.attributes[prop]
        return Reflect.get(...arguments)
    },
    set: (target, prop, value) => {
        if (prop in target) {
            target[prop] = value
            return true
        }
        if (target.attributes) {
            target.attributes[prop] = value
            return true
        }
        return Reflect.set(...arguments);
    },
    deleteProperty: (target, prop) => {
        if (target.attributes && prop in target.attributes) {
            delete target.attributes[prop];
            return true
        }
        return Reflect.deleteProperty(...arguments)
    }
}