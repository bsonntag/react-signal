"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSignal = createSignal;

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Signal = /*#__PURE__*/function () {
  function Signal() {
    _classCallCheck(this, Signal);

    this.hasValue = false;
    this.callbacks = new Set();
  }

  _createClass(Signal, [{
    key: "publish",
    value: function publish(value) {
      this.hasValue = true;
      this.value = value;
      this.callbacks.forEach(function (callback) {
        callback(value);
      });
    }
  }, {
    key: "subscribe",
    value: function subscribe(callback) {
      var _this = this;

      this.callbacks.add(callback);

      if (this.hasValue) {
        callback(this.value);
      }

      return function () {
        _this.callbacks["delete"](callback);
      };
    }
  }]);

  return Signal;
}();

function createSignal() {
  var SignalPublishContext = React.createContext();
  var SignalSubscribeContext = React.createContext();

  function SignalProvider(_ref) {
    var children = _ref.children;
    var signalRef = React.useRef(new Signal());
    var publish = React.useCallback(function (value) {
      signalRef.current.publish(value);
    }, []);
    var subscribe = React.useCallback(function (callback) {
      var unsubscribe = signalRef.current.subscribe(callback);
      return function () {
        return unsubscribe();
      };
    }, []);
    return /*#__PURE__*/React.createElement(SignalPublishContext.Provider, {
      value: publish
    }, /*#__PURE__*/React.createElement(SignalSubscribeContext.Provider, {
      value: subscribe
    }, children));
  }

  function usePublish() {
    return React.useContext(SignalPublishContext);
  }

  function useSignalSubscription(callback) {
    var subscribe = React.useContext(SignalSubscribeContext);
    var callbackRef = React.useRef(callback);
    React.useEffect(function () {
      callbackRef.current = callback;
    });
    React.useEffect(function () {
      var unsubscribe = subscribe(function (value) {
        callbackRef.current(value);
      });
      return function () {
        return unsubscribe();
      };
    }, [subscribe]);
  }

  return {
    Provider: SignalProvider,
    usePublish: usePublish,
    useSubscription: useSignalSubscription
  };
}