'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setConfig = exports.connectAndCheck = exports.Provider = exports.connect = undefined;

var _reactRedux = require('react-redux');

var _memoizeState = require('memoize-state');

var _memoizeState2 = _interopRequireDefault(_memoizeState);

var _functionDouble = require('function-double');

var _functionDouble2 = _interopRequireDefault(_functionDouble);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
  onNotPure: function onNotPure(name) {
    console.group('why-did-you-update-redux: ' + name);
    console.log('mapStateToProps:', arguments.length <= 2 ? undefined : arguments[2]);
    console.log('functions' + (arguments.length <= 3 ? undefined : arguments[3]));
    console.groupEnd();
  }
};

var realReactReduxConnect = _reactRedux.connect;

var connect = function connect(mapStateToProps, mapDispatchToProps, mergeProps) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};


  if (options && 'pure' in options && !options.pure) {
    return realReactReduxConnect(mapStateToProps, mapDispatchToProps, mergeProps, options);
  }

  return function (WrappedComponent) {

    var lastAffectedPaths = null;
    var isFabric = 0;
    var affectedMap = {};

    function mapStateToPropsFabric() {
      var localMapStateToProps = void 0;
      var firstCall = true;
      var result = void 0;

      function finalMapStateToProps(state, props) {
        if (firstCall) {
          var defaultMapStateToProps = (0, _memoizeState2.default)(mapStateToProps, { strictArity: true });

          if (isFabric === 0) {
            result = defaultMapStateToProps(state, props);
            if (typeof result === 'function') {
              isFabric = 1;
              (0, _functionDouble2.default)(finalMapStateToProps, result);
            } else {
              isFabric = -1;
            }
          }

          if (isFabric === 1) {
            localMapStateToProps = (0, _memoizeState2.default)(defaultMapStateToProps(state, props), { strictArity: true });
          } else {
            localMapStateToProps = defaultMapStateToProps;
          }
        }

        result = localMapStateToProps(state, props);

        if (firstCall || !localMapStateToProps.cacheStatistics.lastCallWasMemoized) {
          // get state related paths
          var affected = localMapStateToProps.getAffectedPaths()[0];
          affected.forEach(function (key) {
            return affectedMap[key.split('.')[1]] = true;
          });
          lastAffectedPaths = Object.keys(affectedMap);
        }

        firstCall = false;

        return result;
      }

      (0, _functionDouble2.default)(finalMapStateToProps, mapStateToProps);

      Object.defineProperty(finalMapStateToProps, 'trackedKeys', {
        get: function get() {
          return lastAffectedPaths;
        },
        configurable: true,
        enumerable: false
      });

      return finalMapStateToProps;
    }

    function areStatesEqual(state1, state2) {
      if (!lastAffectedPaths) {
        return state1 === state2;
      }
      return lastAffectedPaths.reduce(function (acc, key) {
        return acc && state1[key] === state2[key];
      }, true);
    }

    var ImprovedComponent = realReactReduxConnect(mapStateToProps && mapStateToPropsFabric, mapDispatchToProps, mergeProps, Object.assign({ areStatesEqual: areStatesEqual }, options))(WrappedComponent);

    Object.defineProperty(ImprovedComponent, '__trackingPaths', {
      get: function get() {
        return lastAffectedPaths;
      },
      configurable: true,
      enumerable: false
    });

    return ImprovedComponent;
  };
};

var onNotPure = function onNotPure() {
  var _config;

  return (_config = config).onNotPure.apply(_config, arguments);
};
var connectAndCheck = function connectAndCheck(a) {
  for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  return function (WrappedComponent) {
    var Component = realReactReduxConnect.apply(undefined, [a ? (0, _memoizeState.shouldBePure)(a, {
      onTrigger: function onTrigger() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return onNotPure.apply(undefined, [Component.displayName || Component.name].concat(args));
      },
      checkAffectedKeys: false
    }) : a].concat(rest))(WrappedComponent);
    return Component;
  };
};

var setConfig = function setConfig(options) {
  config = Object.assign(config, options);
};

exports.connect = connect;
exports.Provider = _reactRedux.Provider;
exports.connectAndCheck = connectAndCheck;
exports.setConfig = setConfig;