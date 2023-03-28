'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var reduxES = _interopRequireWildcard(_reactRedux);

var _index = require('./index');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var patched = false;

try {
  require('react-redux/es/connect/connect').default = _index.connectAndCheck;
  patched = true;
} catch (e) {}
// always try another way
{
  try {
    reduxES.connect = _index.connectAndCheck;
    patched = true;
  } catch (e) {}
}

if (!patched) {
  console.error('beautiful-react-redux: could not patch redux, please use {connect} from "beautiful-react-redux" instead of "react-redux"');
}

var configure = function configure(options) {
  return (0, _index.setConfig)(options);
};

exports.default = configure;