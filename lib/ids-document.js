'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _ajv = require('ajv');

var _ajv2 = _interopRequireDefault(_ajv);

var _ajvErrorMessages = require('ajv-error-messages');

var _ajvErrorMessages2 = _interopRequireDefault(_ajvErrorMessages);

var _idsAxios = require('./ids-axios');

var IdsAxios = _interopRequireWildcard(_idsAxios);

var _idsProxy = require('./ids-proxy');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class IdsDocument {

    // 
    // constructor
    //     

    // schema for validation

    // data from ids doctored up

    // json schema for validation
    constructor(obj = undefined, opts = undefined) {
        this.collectionName = null;
        this.properties = {};
        this.required = [];
        this.attributes = {};
        this.originals = {};
        this.schema = null;
        this.__ajv = null;

        this._populate(obj);
        return (0, _idsProxy.wrap)(this);
    }

    //
    // static api
    //

    // ajv 

    // raw data from ids

    // required properties

    // name of the class in ids
    static async create(obj) {
        const instance = new this.prototype.constructor(obj);
        await instance.save();
        return instance;
    }

    static async find(id) {
        const instance = new this.prototype.constructor();
        if (id instanceof Array) return instance._findByIds(id);
        return instance._findById(id);
    }

    static async destroy(id) {
        const instance = new this.prototype.constructor({ id });
        return await instance.delete();
    }

    static async query(q) {
        const instance = new this.prototype.constructor();
        return await instance._query(q);
    }

    static async all() {
        const instance = new this.prototype.constructor();
        return await instance._all();
    }

    //
    // instance api
    //

    async save() {
        // init our schema
        this._schemaInit(); // will throw errors if the schema is bad
        // check to see if we have good data
        this._validate();

        return await IdsAxios.update(this.collectionName, this.id, this.attributes).then(r => this._transformResults(r));
    }

    async update() {
        return await IdsAxios.update(this.collectionName, this.id, this.attributes).then(r => this._transformResults(r));
    }

    async saveOrUpdate() {
        if (this.id) return await this.update();
        return await this.save();
    }

    async delete() {
        return await IdsAxios.delete(this.collectionName, this.id).then(r => this._transformResults(r));
    }

    async _query(q) {
        return await IdsAxios.query(this.collectionName, { query: q }).then(r => this._transformResults(r));
    }

    async _all() {
        return await IdsAxios.all(this.collectionName).then(r => this._transformResults(r));
    }

    async _findById(id) {
        return await IdsAxios.get(this.collectionName, id).then(r => this._transformResults(r));
    }

    async _findByIds(ids) {
        return await this.query({ objectId: { "in": ids } });
    }

    // 
    // helpers
    // 

    get id() {
        if (this.attributes.objectId) return this.attributes.objectId;
        return undefined;
    }

    _transformResults(results) {
        // if ids doesn't find anything
        // it returns a 204
        if (!results) return undefined;
        // if we get an array back from ids
        // loop over them and convert into instance 
        if (results instanceof Array) return results.map(d => new this.constructor(d));
        // create instance
        return new this.constructor(results);
    }

    _populate(obj) {
        // transform
        runTransformers(obj);
        // update data
        this.attributes = _extends({}, obj);
        this.originals = _extends({}, obj);
    }

    _schemaInit(opts = undefined) {
        if (this.__ajv) return; // we only wanna do this once per object

        this.__ajv = new _ajv2.default({ allErrors: true });
        this.__ajv.addSchema(this.schema, this.collectionName).compile(this.schema);
    }

    _validate() {
        // keep track of data
        const data = _extends({}, this.attributes);
        // get our schema so we can find properties of 
        // date-time so we can convert them
        const { schema } = this.__ajv.getSchema(this.collectionName);
        // find our properties
        const propertyKeys = Object.keys(schema.properties).filter(key => schema.properties[key].format && schema.properties[key].format === 'date-time');
        // convert these props into strings
        propertyKeys.forEach(key => {
            if (data[key]) data[key] = data[key].valueOf();
        });

        if (!this.__ajv.validate(this.collectionName, data)) throw this.__ajv.errors;
    }

    // 
    // native overrides
    //     

    toJSON() {
        return this.attributes;
    }
}

exports.default = IdsDocument;
const toDate = (obj, prop) => {
    if (obj && obj[prop] && !_moment2.default.isDate(obj[prop]) && !_moment2.default.isMoment(obj[prop])) obj[prop] = _moment2.default.utc(obj[prop]);
};

const dateTransformer = obj => {
    toDate(obj, 'updatedAt');
    toDate(obj, 'createdAt');
};

const idTransformer = obj => {
    if (obj && obj.id) {
        const { id } = obj;
        delete obj.id;
        obj.objectId = id;
    }
};

const runTransformers = obj => {
    idTransformer(obj);
    dateTransformer(obj);
};
//# sourceMappingURL=ids-document.js.map