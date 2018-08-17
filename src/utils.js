import moment from 'moment'

export const toDate = (obj, prop) => {
    if (obj && obj[prop] && (!moment.isDate(obj[prop]) && !moment.isMoment(obj[prop])))
        obj[prop] = moment.utc(obj[prop])
}

export const dateTransformer = obj => {
    toDate(obj, 'updatedAt')
    toDate(obj, 'createdAt')
}

export const idTransformer = obj => {
    if (obj && obj.id) {
        const { id } = obj
        delete obj.id
        obj.objectId = id
    }
}

export const runTransformers = obj => {
    idTransformer(obj)
    dateTransformer(obj)
}