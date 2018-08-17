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

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _idsAxios = require('./ids-axios');

var IdsAxios = _interopRequireWildcard(_idsAxios);

var _idsProxy = require('./ids-proxy');

var _idsSchema = require('./ids-schema');

var _utils = require('./utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class IdsDocument {

    // 
    // constructor
    //     

    // ajv 

    // data from ids doctored up

    // json schema for validation


    // name of the class in ids
    constructor(obj = undefined) {
        this.collectionName = null;
        this.schemaOverride = {};
        this.properties = null;
        this.required = [];
        this.attributes = {};
        this.originals = {};
        this.__ajv = null;
        this.schema = null;

        this._populate(obj);
        return (0, _idsProxy.wrap)(this);
    }

    //
    // static api
    //

    // schema

    // raw data from ids

    // required properties

    // schema defaults
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
        if (this.id) return await this.update();
        return await this.insert();
    }

    async insert() {
        // init our schema
        this._schemaInit(); // will throw errors if the schema is bad
        // check to see if we have good data
        this._validate();

        return await IdsAxios.create(this.collectionName, this._cast()).then(r => this._transformResults(r));
    }

    async update() {
        debugger;
        // we don't do validation on update cuz
        // things get weird...even mongoose has some
        // stickly logic around updates...not really worth it
        return await IdsAxios.update(this.collectionName, this.id, this._cast()).then(r => this._transformResults(r));
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
        (0, _utils.runTransformers)(obj);
        // update data
        this.attributes = _extends({}, obj);
        this.originals = _extends({}, obj);
    }

    _schemaInit(opts = undefined) {
        if (this.__ajv) return; // we only wanna do this once per object

        if (this.schema) return;

        // merge schema defaults with overrides and properties
        const schema = (0, _lodash2.default)(_idsSchema.defaults, this.schemaOverride);
        schema.properties = (0, _lodash2.default)(schema.properties, this.properties);
        this.schema = schema;

        this.__ajv = new _ajv2.default({ allErrors: true });
        this.__ajv.addSchema(schema, this.collectionName).compile(schema);
    }

    _cast() {
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
        return data;
    }

    _validate() {
        if (!this.__ajv.validate(this.collectionName, this._cast())) throw this.__ajv.errors;
    }

    // 
    // native overrides
    //     

    toJSON() {
        return this.attributes;
    }
}
exports.default = IdsDocument;
//# sourceMappingURL=ids-document.js.map