'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _idsDocument = require('./ids-document');

Object.defineProperty(exports, 'IdsDocument', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_idsDocument).default;
  }
});

var _idsAxios = require('./ids-axios');

Object.keys(_idsAxios).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _idsAxios[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map