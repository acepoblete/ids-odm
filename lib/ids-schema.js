"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const defaults = exports.defaults = {
    additionalProperties: false,
    type: 'object',
    properties: {
        "objectId": {
            "$id": "/properties/objectId",
            "type": "string",
            "default": "",
            "examples": ["591dd45e10a17700339db503"]
        },
        "updatedAt": {
            "$id": "/properties/updatedAt",
            "type": "integer",
            "format": "date-time"
        },
        "createdAt": {
            "$id": "/properties/createdAt",
            "type": "integer",
            "format": "date-time"
        }
    }
};
//# sourceMappingURL=ids-schema.js.map