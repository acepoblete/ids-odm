import moment from 'moment'
import Ajv from 'ajv'
import normalizeErrors from 'ajv-error-messages'

import * as IdsAxios from './ids-axios'
import { wrap } from './ids-proxy'

export default class IdsDocument {
    // name of the class in ids
    collectionName = null
    // json schema for validation
    properties = {}
    // required properties
    required = []
    // data from ids doctored up
    attributes = {}
    // raw data from ids
    originals = {}
    // schema for validation
    schema = null
    // ajv 
    __ajv = null

    // 
    // constructor
    //     

    constructor(obj = undefined, opts = undefined) {
        this._populate(obj)
        return wrap(this)
    }

    //
    // static api
    //

    static async create(obj) {
        const instance = new this.prototype.constructor(obj)
        await instance.save()
        return instance
    }

    static async find(id) {
        const instance = new this.prototype.constructor()
        if (id instanceof Array)
            return instance._findByIds(id)
        return instance._findById(id)
    }

    static async destroy(id) {
        const instance = new this.prototype.constructor({ id })
        return await instance.delete()
    }

    static async query(q) {
        const instance = new this.prototype.constructor()
        return await instance._query(q)
    }

    static async all() {
        const instance = new this.prototype.constructor()
        return await instance._all()
    }

    //
    // instance api
    //

    async save() {
        // init our schema
        this._schemaInit() // will throw errors if the schema is bad
        // check to see if we have good data
        this._validate()

        return await IdsAxios.update(this.collectionName, this.id, this.attributes)
            .then(r => this._transformResults(r))
    }

    async update() {
        return await IdsAxios.update(this.collectionName, this.id, this.attributes)
            .then(r => this._transformResults(r))
    }

    async saveOrUpdate() {
        if (this.id)
            return await this.update()
        return await this.save()
    }

    async delete() {
        return await IdsAxios.delete(this.collectionName, this.id)
            .then(r => this._transformResults(r))
    }

    async _query(q) {
        return await IdsAxios.query(this.collectionName, { query: q })
            .then(r => this._transformResults(r))
    }

    async _all() {
        return await IdsAxios.all(this.collectionName)
            .then(r => this._transformResults(r))
    }

    async _findById(id) {
        return await IdsAxios.get(this.collectionName, id)
            .then(r => this._transformResults(r))
    }

    async _findByIds(ids) {
        return await this.query({ objectId: { "in": ids } })
    }

    // 
    // helpers
    // 

    get id() {
        if (this.attributes.objectId)
            return this.attributes.objectId
        return undefined
    }

    _transformResults(results) {
        // if ids doesn't find anything
        // it returns a 204
        if (!results)
            return undefined
        // if we get an array back from ids
        // loop over them and convert into instance 
        if (results instanceof Array)
            return results.map(d => new this.constructor(d))
        // create instance
        return new this.constructor(results)
    }

    _populate(obj) {
        // transform
        runTransformers(obj)
        // update data
        this.attributes = { ...obj }
        this.originals = { ...obj }
    }

    _schemaInit(opts = undefined) {
        if (this.__ajv)
            return // we only wanna do this once per object

        this.__ajv = new Ajv({ allErrors: true })
        this.__ajv.addSchema(this.schema, this.collectionName)
            .compile(this.schema)
    }

    _validate() {
        // keep track of data
        const data = { ...this.attributes }
        // get our schema so we can find properties of 
        // date-time so we can convert them
        const { schema } = this.__ajv.getSchema(this.collectionName)
        // find our properties
        const propertyKeys = Object.keys(schema.properties)
            .filter(key => schema.properties[key].format && schema.properties[key].format === 'date-time')
        // convert these props into strings
        propertyKeys.forEach(key => {
            if (data[key])
                data[key] = data[key].valueOf()
        })

        if (!this.__ajv.validate(this.collectionName, data))
            throw this.__ajv.errors
    }

    // 
    // native overrides
    //     

    toJSON() {
        return this.attributes
    }
}

const toDate = (obj, prop) => {
    if (obj && obj[prop] && (!moment.isDate(obj[prop]) && !moment.isMoment(obj[prop])))
        obj[prop] = moment.utc(obj[prop])
}

const dateTransformer = obj => {
    toDate(obj, 'updatedAt')
    toDate(obj, 'createdAt')
}

const idTransformer = obj => {
    if (obj && obj.id) {
        const { id } = obj
        delete obj.id
        obj.objectId = id
    }
}

const runTransformers = obj => {
    idTransformer(obj)
    dateTransformer(obj)
}