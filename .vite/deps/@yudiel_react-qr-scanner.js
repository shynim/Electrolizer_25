import {
  __commonJS,
  __toESM,
  require_react
} from "./chunk-UTEJFLXC.js";

// node_modules/webrtc-adapter/dist/utils.js
var require_utils = __commonJS({
  "node_modules/webrtc-adapter/dist/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.compactObject = compactObject;
    exports.deprecated = deprecated;
    exports.detectBrowser = detectBrowser;
    exports.disableLog = disableLog;
    exports.disableWarnings = disableWarnings;
    exports.extractVersion = extractVersion;
    exports.filterStats = filterStats;
    exports.log = log;
    exports.walkStats = walkStats;
    exports.wrapPeerConnectionEvent = wrapPeerConnectionEvent;
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _toPropertyKey(t2) {
      var i2 = _toPrimitive(t2, "string");
      return "symbol" == _typeof(i2) ? i2 : i2 + "";
    }
    function _toPrimitive(t2, r2) {
      if ("object" != _typeof(t2) || !t2) return t2;
      var e3 = t2[Symbol.toPrimitive];
      if (void 0 !== e3) {
        var i2 = e3.call(t2, r2 || "default");
        if ("object" != _typeof(i2)) return i2;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r2 ? String : Number)(t2);
    }
    function _typeof(o2) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o3) {
        return typeof o3;
      } : function(o3) {
        return o3 && "function" == typeof Symbol && o3.constructor === Symbol && o3 !== Symbol.prototype ? "symbol" : typeof o3;
      }, _typeof(o2);
    }
    var logDisabled_ = true;
    var deprecationWarnings_ = true;
    function extractVersion(uastring, expr, pos) {
      var match = uastring.match(expr);
      return match && match.length >= pos && parseInt(match[pos], 10);
    }
    function wrapPeerConnectionEvent(window2, eventNameToWrap, wrapper) {
      if (!window2.RTCPeerConnection) {
        return;
      }
      var proto = window2.RTCPeerConnection.prototype;
      var nativeAddEventListener = proto.addEventListener;
      proto.addEventListener = function(nativeEventName, cb) {
        if (nativeEventName !== eventNameToWrap) {
          return nativeAddEventListener.apply(this, arguments);
        }
        var wrappedCallback = function wrappedCallback2(e3) {
          var modifiedEvent = wrapper(e3);
          if (modifiedEvent) {
            if (cb.handleEvent) {
              cb.handleEvent(modifiedEvent);
            } else {
              cb(modifiedEvent);
            }
          }
        };
        this._eventMap = this._eventMap || {};
        if (!this._eventMap[eventNameToWrap]) {
          this._eventMap[eventNameToWrap] = /* @__PURE__ */ new Map();
        }
        this._eventMap[eventNameToWrap].set(cb, wrappedCallback);
        return nativeAddEventListener.apply(this, [nativeEventName, wrappedCallback]);
      };
      var nativeRemoveEventListener = proto.removeEventListener;
      proto.removeEventListener = function(nativeEventName, cb) {
        if (nativeEventName !== eventNameToWrap || !this._eventMap || !this._eventMap[eventNameToWrap]) {
          return nativeRemoveEventListener.apply(this, arguments);
        }
        if (!this._eventMap[eventNameToWrap].has(cb)) {
          return nativeRemoveEventListener.apply(this, arguments);
        }
        var unwrappedCb = this._eventMap[eventNameToWrap].get(cb);
        this._eventMap[eventNameToWrap]["delete"](cb);
        if (this._eventMap[eventNameToWrap].size === 0) {
          delete this._eventMap[eventNameToWrap];
        }
        if (Object.keys(this._eventMap).length === 0) {
          delete this._eventMap;
        }
        return nativeRemoveEventListener.apply(this, [nativeEventName, unwrappedCb]);
      };
      Object.defineProperty(proto, "on" + eventNameToWrap, {
        get: function get() {
          return this["_on" + eventNameToWrap];
        },
        set: function set(cb) {
          if (this["_on" + eventNameToWrap]) {
            this.removeEventListener(eventNameToWrap, this["_on" + eventNameToWrap]);
            delete this["_on" + eventNameToWrap];
          }
          if (cb) {
            this.addEventListener(eventNameToWrap, this["_on" + eventNameToWrap] = cb);
          }
        },
        enumerable: true,
        configurable: true
      });
    }
    function disableLog(bool) {
      if (typeof bool !== "boolean") {
        return new Error("Argument type: " + _typeof(bool) + ". Please use a boolean.");
      }
      logDisabled_ = bool;
      return bool ? "adapter.js logging disabled" : "adapter.js logging enabled";
    }
    function disableWarnings(bool) {
      if (typeof bool !== "boolean") {
        return new Error("Argument type: " + _typeof(bool) + ". Please use a boolean.");
      }
      deprecationWarnings_ = !bool;
      return "adapter.js deprecation warnings " + (bool ? "disabled" : "enabled");
    }
    function log() {
      if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") {
        if (logDisabled_) {
          return;
        }
        if (typeof console !== "undefined" && typeof console.log === "function") {
          console.log.apply(console, arguments);
        }
      }
    }
    function deprecated(oldMethod, newMethod) {
      if (!deprecationWarnings_) {
        return;
      }
      console.warn(oldMethod + " is deprecated, please use " + newMethod + " instead.");
    }
    function detectBrowser(window2) {
      var result = {
        browser: null,
        version: null
      };
      if (typeof window2 === "undefined" || !window2.navigator || !window2.navigator.userAgent) {
        result.browser = "Not a browser.";
        return result;
      }
      var navigator2 = window2.navigator;
      if (navigator2.userAgentData && navigator2.userAgentData.brands) {
        var chromium = navigator2.userAgentData.brands.find(function(brand) {
          return brand.brand === "Chromium";
        });
        if (chromium) {
          return {
            browser: "chrome",
            version: parseInt(chromium.version, 10)
          };
        }
      }
      if (navigator2.mozGetUserMedia) {
        result.browser = "firefox";
        result.version = extractVersion(navigator2.userAgent, /Firefox\/(\d+)\./, 1);
      } else if (navigator2.webkitGetUserMedia || window2.isSecureContext === false && window2.webkitRTCPeerConnection) {
        result.browser = "chrome";
        result.version = extractVersion(navigator2.userAgent, /Chrom(e|ium)\/(\d+)\./, 2);
      } else if (window2.RTCPeerConnection && navigator2.userAgent.match(/AppleWebKit\/(\d+)\./)) {
        result.browser = "safari";
        result.version = extractVersion(navigator2.userAgent, /AppleWebKit\/(\d+)\./, 1);
        result.supportsUnifiedPlan = window2.RTCRtpTransceiver && "currentDirection" in window2.RTCRtpTransceiver.prototype;
      } else {
        result.browser = "Not a supported browser.";
        return result;
      }
      return result;
    }
    function isObject(val) {
      return Object.prototype.toString.call(val) === "[object Object]";
    }
    function compactObject(data) {
      if (!isObject(data)) {
        return data;
      }
      return Object.keys(data).reduce(function(accumulator, key) {
        var isObj = isObject(data[key]);
        var value = isObj ? compactObject(data[key]) : data[key];
        var isEmptyObject = isObj && !Object.keys(value).length;
        if (value === void 0 || isEmptyObject) {
          return accumulator;
        }
        return Object.assign(accumulator, _defineProperty({}, key, value));
      }, {});
    }
    function walkStats(stats, base, resultSet) {
      if (!base || resultSet.has(base.id)) {
        return;
      }
      resultSet.set(base.id, base);
      Object.keys(base).forEach(function(name) {
        if (name.endsWith("Id")) {
          walkStats(stats, stats.get(base[name]), resultSet);
        } else if (name.endsWith("Ids")) {
          base[name].forEach(function(id) {
            walkStats(stats, stats.get(id), resultSet);
          });
        }
      });
    }
    function filterStats(result, track, outbound) {
      var streamStatsType = outbound ? "outbound-rtp" : "inbound-rtp";
      var filteredResult = /* @__PURE__ */ new Map();
      if (track === null) {
        return filteredResult;
      }
      var trackStats = [];
      result.forEach(function(value) {
        if (value.type === "track" && value.trackIdentifier === track.id) {
          trackStats.push(value);
        }
      });
      trackStats.forEach(function(trackStat) {
        result.forEach(function(stats) {
          if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
            walkStats(result, stats, filteredResult);
          }
        });
      });
      return filteredResult;
    }
  }
});

// node_modules/webrtc-adapter/dist/chrome/getusermedia.js
var require_getusermedia = __commonJS({
  "node_modules/webrtc-adapter/dist/chrome/getusermedia.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.shimGetUserMedia = shimGetUserMedia;
    var utils = _interopRequireWildcard(require_utils());
    function _getRequireWildcardCache(e3) {
      if ("function" != typeof WeakMap) return null;
      var r2 = /* @__PURE__ */ new WeakMap(), t2 = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function _getRequireWildcardCache2(e4) {
        return e4 ? t2 : r2;
      })(e3);
    }
    function _interopRequireWildcard(e3, r2) {
      if (!r2 && e3 && e3.__esModule) return e3;
      if (null === e3 || "object" != _typeof(e3) && "function" != typeof e3) return { "default": e3 };
      var t2 = _getRequireWildcardCache(r2);
      if (t2 && t2.has(e3)) return t2.get(e3);
      var n2 = { __proto__: null }, a2 = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var u2 in e3) if ("default" !== u2 && {}.hasOwnProperty.call(e3, u2)) {
        var i2 = a2 ? Object.getOwnPropertyDescriptor(e3, u2) : null;
        i2 && (i2.get || i2.set) ? Object.defineProperty(n2, u2, i2) : n2[u2] = e3[u2];
      }
      return n2["default"] = e3, t2 && t2.set(e3, n2), n2;
    }
    function _typeof(o2) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o3) {
        return typeof o3;
      } : function(o3) {
        return o3 && "function" == typeof Symbol && o3.constructor === Symbol && o3 !== Symbol.prototype ? "symbol" : typeof o3;
      }, _typeof(o2);
    }
    var logging = utils.log;
    function shimGetUserMedia(window2, browserDetails) {
      var navigator2 = window2 && window2.navigator;
      if (!navigator2.mediaDevices) {
        return;
      }
      var constraintsToChrome_ = function constraintsToChrome_2(c2) {
        if (_typeof(c2) !== "object" || c2.mandatory || c2.optional) {
          return c2;
        }
        var cc = {};
        Object.keys(c2).forEach(function(key) {
          if (key === "require" || key === "advanced" || key === "mediaSource") {
            return;
          }
          var r2 = _typeof(c2[key]) === "object" ? c2[key] : {
            ideal: c2[key]
          };
          if (r2.exact !== void 0 && typeof r2.exact === "number") {
            r2.min = r2.max = r2.exact;
          }
          var oldname_ = function oldname_2(prefix, name) {
            if (prefix) {
              return prefix + name.charAt(0).toUpperCase() + name.slice(1);
            }
            return name === "deviceId" ? "sourceId" : name;
          };
          if (r2.ideal !== void 0) {
            cc.optional = cc.optional || [];
            var oc = {};
            if (typeof r2.ideal === "number") {
              oc[oldname_("min", key)] = r2.ideal;
              cc.optional.push(oc);
              oc = {};
              oc[oldname_("max", key)] = r2.ideal;
              cc.optional.push(oc);
            } else {
              oc[oldname_("", key)] = r2.ideal;
              cc.optional.push(oc);
            }
          }
          if (r2.exact !== void 0 && typeof r2.exact !== "number") {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_("", key)] = r2.exact;
          } else {
            ["min", "max"].forEach(function(mix) {
              if (r2[mix] !== void 0) {
                cc.mandatory = cc.mandatory || {};
                cc.mandatory[oldname_(mix, key)] = r2[mix];
              }
            });
          }
        });
        if (c2.advanced) {
          cc.optional = (cc.optional || []).concat(c2.advanced);
        }
        return cc;
      };
      var shimConstraints_ = function shimConstraints_2(constraints, func) {
        if (browserDetails.version >= 61) {
          return func(constraints);
        }
        constraints = JSON.parse(JSON.stringify(constraints));
        if (constraints && _typeof(constraints.audio) === "object") {
          var remap = function remap2(obj, a2, b) {
            if (a2 in obj && !(b in obj)) {
              obj[b] = obj[a2];
              delete obj[a2];
            }
          };
          constraints = JSON.parse(JSON.stringify(constraints));
          remap(constraints.audio, "autoGainControl", "googAutoGainControl");
          remap(constraints.audio, "noiseSuppression", "googNoiseSuppression");
          constraints.audio = constraintsToChrome_(constraints.audio);
        }
        if (constraints && _typeof(constraints.video) === "object") {
          var face = constraints.video.facingMode;
          face = face && (_typeof(face) === "object" ? face : {
            ideal: face
          });
          var getSupportedFacingModeLies = browserDetails.version < 66;
          if (face && (face.exact === "user" || face.exact === "environment" || face.ideal === "user" || face.ideal === "environment") && !(navigator2.mediaDevices.getSupportedConstraints && navigator2.mediaDevices.getSupportedConstraints().facingMode && !getSupportedFacingModeLies)) {
            delete constraints.video.facingMode;
            var matches;
            if (face.exact === "environment" || face.ideal === "environment") {
              matches = ["back", "rear"];
            } else if (face.exact === "user" || face.ideal === "user") {
              matches = ["front"];
            }
            if (matches) {
              return navigator2.mediaDevices.enumerateDevices().then(function(devices) {
                devices = devices.filter(function(d2) {
                  return d2.kind === "videoinput";
                });
                var dev = devices.find(function(d2) {
                  return matches.some(function(match) {
                    return d2.label.toLowerCase().includes(match);
                  });
                });
                if (!dev && devices.length && matches.includes("back")) {
                  dev = devices[devices.length - 1];
                }
                if (dev) {
                  constraints.video.deviceId = face.exact ? {
                    exact: dev.deviceId
                  } : {
                    ideal: dev.deviceId
                  };
                }
                constraints.video = constraintsToChrome_(constraints.video);
                logging("chrome: " + JSON.stringify(constraints));
                return func(constraints);
              });
            }
          }
          constraints.video = constraintsToChrome_(constraints.video);
        }
        logging("chrome: " + JSON.stringify(constraints));
        return func(constraints);
      };
      var shimError_ = function shimError_2(e3) {
        if (browserDetails.version >= 64) {
          return e3;
        }
        return {
          name: {
            PermissionDeniedError: "NotAllowedError",
            PermissionDismissedError: "NotAllowedError",
            InvalidStateError: "NotAllowedError",
            DevicesNotFoundError: "NotFoundError",
            ConstraintNotSatisfiedError: "OverconstrainedError",
            TrackStartError: "NotReadableError",
            MediaDeviceFailedDueToShutdown: "NotAllowedError",
            MediaDeviceKillSwitchOn: "NotAllowedError",
            TabCaptureError: "AbortError",
            ScreenCaptureError: "AbortError",
            DeviceCaptureError: "AbortError"
          }[e3.name] || e3.name,
          message: e3.message,
          constraint: e3.constraint || e3.constraintName,
          toString: function toString() {
            return this.name + (this.message && ": ") + this.message;
          }
        };
      };
      var getUserMedia_ = function getUserMedia_2(constraints, onSuccess, onError) {
        shimConstraints_(constraints, function(c2) {
          navigator2.webkitGetUserMedia(c2, onSuccess, function(e3) {
            if (onError) {
              onError(shimError_(e3));
            }
          });
        });
      };
      navigator2.getUserMedia = getUserMedia_.bind(navigator2);
      if (navigator2.mediaDevices.getUserMedia) {
        var origGetUserMedia = navigator2.mediaDevices.getUserMedia.bind(navigator2.mediaDevices);
        navigator2.mediaDevices.getUserMedia = function(cs) {
          return shimConstraints_(cs, function(c2) {
            return origGetUserMedia(c2).then(function(stream) {
              if (c2.audio && !stream.getAudioTracks().length || c2.video && !stream.getVideoTracks().length) {
                stream.getTracks().forEach(function(track) {
                  track.stop();
                });
                throw new DOMException("", "NotFoundError");
              }
              return stream;
            }, function(e3) {
              return Promise.reject(shimError_(e3));
            });
          });
        };
      }
    }
  }
});

// node_modules/webrtc-adapter/dist/firefox/getusermedia.js
var require_getusermedia2 = __commonJS({
  "node_modules/webrtc-adapter/dist/firefox/getusermedia.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.shimGetUserMedia = shimGetUserMedia;
    var utils = _interopRequireWildcard(require_utils());
    function _getRequireWildcardCache(e3) {
      if ("function" != typeof WeakMap) return null;
      var r2 = /* @__PURE__ */ new WeakMap(), t2 = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function _getRequireWildcardCache2(e4) {
        return e4 ? t2 : r2;
      })(e3);
    }
    function _interopRequireWildcard(e3, r2) {
      if (!r2 && e3 && e3.__esModule) return e3;
      if (null === e3 || "object" != _typeof(e3) && "function" != typeof e3) return { "default": e3 };
      var t2 = _getRequireWildcardCache(r2);
      if (t2 && t2.has(e3)) return t2.get(e3);
      var n2 = { __proto__: null }, a2 = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var u2 in e3) if ("default" !== u2 && {}.hasOwnProperty.call(e3, u2)) {
        var i2 = a2 ? Object.getOwnPropertyDescriptor(e3, u2) : null;
        i2 && (i2.get || i2.set) ? Object.defineProperty(n2, u2, i2) : n2[u2] = e3[u2];
      }
      return n2["default"] = e3, t2 && t2.set(e3, n2), n2;
    }
    function _typeof(o2) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o3) {
        return typeof o3;
      } : function(o3) {
        return o3 && "function" == typeof Symbol && o3.constructor === Symbol && o3 !== Symbol.prototype ? "symbol" : typeof o3;
      }, _typeof(o2);
    }
    function shimGetUserMedia(window2, browserDetails) {
      var navigator2 = window2 && window2.navigator;
      var MediaStreamTrack = window2 && window2.MediaStreamTrack;
      navigator2.getUserMedia = function(constraints, onSuccess, onError) {
        utils.deprecated("navigator.getUserMedia", "navigator.mediaDevices.getUserMedia");
        navigator2.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
      };
      if (!(browserDetails.version > 55 && "autoGainControl" in navigator2.mediaDevices.getSupportedConstraints())) {
        var remap = function remap2(obj, a2, b) {
          if (a2 in obj && !(b in obj)) {
            obj[b] = obj[a2];
            delete obj[a2];
          }
        };
        var nativeGetUserMedia = navigator2.mediaDevices.getUserMedia.bind(navigator2.mediaDevices);
        navigator2.mediaDevices.getUserMedia = function(c2) {
          if (_typeof(c2) === "object" && _typeof(c2.audio) === "object") {
            c2 = JSON.parse(JSON.stringify(c2));
            remap(c2.audio, "autoGainControl", "mozAutoGainControl");
            remap(c2.audio, "noiseSuppression", "mozNoiseSuppression");
          }
          return nativeGetUserMedia(c2);
        };
        if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
          var nativeGetSettings = MediaStreamTrack.prototype.getSettings;
          MediaStreamTrack.prototype.getSettings = function() {
            var obj = nativeGetSettings.apply(this, arguments);
            remap(obj, "mozAutoGainControl", "autoGainControl");
            remap(obj, "mozNoiseSuppression", "noiseSuppression");
            return obj;
          };
        }
        if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
          var nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
          MediaStreamTrack.prototype.applyConstraints = function(c2) {
            if (this.kind === "audio" && _typeof(c2) === "object") {
              c2 = JSON.parse(JSON.stringify(c2));
              remap(c2, "autoGainControl", "mozAutoGainControl");
              remap(c2, "noiseSuppression", "mozNoiseSuppression");
            }
            return nativeApplyConstraints.apply(this, [c2]);
          };
        }
      }
    }
  }
});

// node_modules/webrtc-adapter/dist/safari/safari_shim.js
var require_safari_shim = __commonJS({
  "node_modules/webrtc-adapter/dist/safari/safari_shim.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.shimAudioContext = shimAudioContext;
    exports.shimCallbacksAPI = shimCallbacksAPI;
    exports.shimConstraints = shimConstraints;
    exports.shimCreateOfferLegacy = shimCreateOfferLegacy;
    exports.shimGetUserMedia = shimGetUserMedia;
    exports.shimLocalStreamsAPI = shimLocalStreamsAPI;
    exports.shimRTCIceServerUrls = shimRTCIceServerUrls;
    exports.shimRemoteStreamsAPI = shimRemoteStreamsAPI;
    exports.shimTrackEventTransceiver = shimTrackEventTransceiver;
    var utils = _interopRequireWildcard(require_utils());
    function _getRequireWildcardCache(e3) {
      if ("function" != typeof WeakMap) return null;
      var r2 = /* @__PURE__ */ new WeakMap(), t2 = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function _getRequireWildcardCache2(e4) {
        return e4 ? t2 : r2;
      })(e3);
    }
    function _interopRequireWildcard(e3, r2) {
      if (!r2 && e3 && e3.__esModule) return e3;
      if (null === e3 || "object" != _typeof(e3) && "function" != typeof e3) return { "default": e3 };
      var t2 = _getRequireWildcardCache(r2);
      if (t2 && t2.has(e3)) return t2.get(e3);
      var n2 = { __proto__: null }, a2 = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var u2 in e3) if ("default" !== u2 && {}.hasOwnProperty.call(e3, u2)) {
        var i2 = a2 ? Object.getOwnPropertyDescriptor(e3, u2) : null;
        i2 && (i2.get || i2.set) ? Object.defineProperty(n2, u2, i2) : n2[u2] = e3[u2];
      }
      return n2["default"] = e3, t2 && t2.set(e3, n2), n2;
    }
    function _typeof(o2) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o3) {
        return typeof o3;
      } : function(o3) {
        return o3 && "function" == typeof Symbol && o3.constructor === Symbol && o3 !== Symbol.prototype ? "symbol" : typeof o3;
      }, _typeof(o2);
    }
    function shimLocalStreamsAPI(window2) {
      if (_typeof(window2) !== "object" || !window2.RTCPeerConnection) {
        return;
      }
      if (!("getLocalStreams" in window2.RTCPeerConnection.prototype)) {
        window2.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
          if (!this._localStreams) {
            this._localStreams = [];
          }
          return this._localStreams;
        };
      }
      if (!("addStream" in window2.RTCPeerConnection.prototype)) {
        var _addTrack = window2.RTCPeerConnection.prototype.addTrack;
        window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
          var _this = this;
          if (!this._localStreams) {
            this._localStreams = [];
          }
          if (!this._localStreams.includes(stream)) {
            this._localStreams.push(stream);
          }
          stream.getAudioTracks().forEach(function(track) {
            return _addTrack.call(_this, track, stream);
          });
          stream.getVideoTracks().forEach(function(track) {
            return _addTrack.call(_this, track, stream);
          });
        };
        window2.RTCPeerConnection.prototype.addTrack = function addTrack(track) {
          var _this2 = this;
          for (var _len = arguments.length, streams = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            streams[_key - 1] = arguments[_key];
          }
          if (streams) {
            streams.forEach(function(stream) {
              if (!_this2._localStreams) {
                _this2._localStreams = [stream];
              } else if (!_this2._localStreams.includes(stream)) {
                _this2._localStreams.push(stream);
              }
            });
          }
          return _addTrack.apply(this, arguments);
        };
      }
      if (!("removeStream" in window2.RTCPeerConnection.prototype)) {
        window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
          var _this3 = this;
          if (!this._localStreams) {
            this._localStreams = [];
          }
          var index = this._localStreams.indexOf(stream);
          if (index === -1) {
            return;
          }
          this._localStreams.splice(index, 1);
          var tracks = stream.getTracks();
          this.getSenders().forEach(function(sender) {
            if (tracks.includes(sender.track)) {
              _this3.removeTrack(sender);
            }
          });
        };
      }
    }
    function shimRemoteStreamsAPI(window2) {
      if (_typeof(window2) !== "object" || !window2.RTCPeerConnection) {
        return;
      }
      if (!("getRemoteStreams" in window2.RTCPeerConnection.prototype)) {
        window2.RTCPeerConnection.prototype.getRemoteStreams = function getRemoteStreams() {
          return this._remoteStreams ? this._remoteStreams : [];
        };
      }
      if (!("onaddstream" in window2.RTCPeerConnection.prototype)) {
        Object.defineProperty(window2.RTCPeerConnection.prototype, "onaddstream", {
          get: function get() {
            return this._onaddstream;
          },
          set: function set(f2) {
            var _this4 = this;
            if (this._onaddstream) {
              this.removeEventListener("addstream", this._onaddstream);
              this.removeEventListener("track", this._onaddstreampoly);
            }
            this.addEventListener("addstream", this._onaddstream = f2);
            this.addEventListener("track", this._onaddstreampoly = function(e3) {
              e3.streams.forEach(function(stream) {
                if (!_this4._remoteStreams) {
                  _this4._remoteStreams = [];
                }
                if (_this4._remoteStreams.includes(stream)) {
                  return;
                }
                _this4._remoteStreams.push(stream);
                var event = new Event("addstream");
                event.stream = stream;
                _this4.dispatchEvent(event);
              });
            });
          }
        });
        var origSetRemoteDescription = window2.RTCPeerConnection.prototype.setRemoteDescription;
        window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
          var pc = this;
          if (!this._onaddstreampoly) {
            this.addEventListener("track", this._onaddstreampoly = function(e3) {
              e3.streams.forEach(function(stream) {
                if (!pc._remoteStreams) {
                  pc._remoteStreams = [];
                }
                if (pc._remoteStreams.indexOf(stream) >= 0) {
                  return;
                }
                pc._remoteStreams.push(stream);
                var event = new Event("addstream");
                event.stream = stream;
                pc.dispatchEvent(event);
              });
            });
          }
          return origSetRemoteDescription.apply(pc, arguments);
        };
      }
    }
    function shimCallbacksAPI(window2) {
      if (_typeof(window2) !== "object" || !window2.RTCPeerConnection) {
        return;
      }
      var prototype = window2.RTCPeerConnection.prototype;
      var origCreateOffer = prototype.createOffer;
      var origCreateAnswer = prototype.createAnswer;
      var setLocalDescription = prototype.setLocalDescription;
      var setRemoteDescription = prototype.setRemoteDescription;
      var addIceCandidate = prototype.addIceCandidate;
      prototype.createOffer = function createOffer(successCallback, failureCallback) {
        var options = arguments.length >= 2 ? arguments[2] : arguments[0];
        var promise = origCreateOffer.apply(this, [options]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.createAnswer = function createAnswer(successCallback, failureCallback) {
        var options = arguments.length >= 2 ? arguments[2] : arguments[0];
        var promise = origCreateAnswer.apply(this, [options]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      var withCallback = function withCallback2(description, successCallback, failureCallback) {
        var promise = setLocalDescription.apply(this, [description]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.setLocalDescription = withCallback;
      withCallback = function withCallback2(description, successCallback, failureCallback) {
        var promise = setRemoteDescription.apply(this, [description]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.setRemoteDescription = withCallback;
      withCallback = function withCallback2(candidate, successCallback, failureCallback) {
        var promise = addIceCandidate.apply(this, [candidate]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.addIceCandidate = withCallback;
    }
    function shimGetUserMedia(window2) {
      var navigator2 = window2 && window2.navigator;
      if (navigator2.mediaDevices && navigator2.mediaDevices.getUserMedia) {
        var mediaDevices = navigator2.mediaDevices;
        var _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
        navigator2.mediaDevices.getUserMedia = function(constraints) {
          return _getUserMedia(shimConstraints(constraints));
        };
      }
      if (!navigator2.getUserMedia && navigator2.mediaDevices && navigator2.mediaDevices.getUserMedia) {
        navigator2.getUserMedia = (function getUserMedia(constraints, cb, errcb) {
          navigator2.mediaDevices.getUserMedia(constraints).then(cb, errcb);
        }).bind(navigator2);
      }
    }
    function shimConstraints(constraints) {
      if (constraints && constraints.video !== void 0) {
        return Object.assign({}, constraints, {
          video: utils.compactObject(constraints.video)
        });
      }
      return constraints;
    }
    function shimRTCIceServerUrls(window2) {
      if (!window2.RTCPeerConnection) {
        return;
      }
      var OrigPeerConnection = window2.RTCPeerConnection;
      window2.RTCPeerConnection = function RTCPeerConnection(pcConfig, pcConstraints) {
        if (pcConfig && pcConfig.iceServers) {
          var newIceServers = [];
          for (var i2 = 0; i2 < pcConfig.iceServers.length; i2++) {
            var server = pcConfig.iceServers[i2];
            if (server.urls === void 0 && server.url) {
              utils.deprecated("RTCIceServer.url", "RTCIceServer.urls");
              server = JSON.parse(JSON.stringify(server));
              server.urls = server.url;
              delete server.url;
              newIceServers.push(server);
            } else {
              newIceServers.push(pcConfig.iceServers[i2]);
            }
          }
          pcConfig.iceServers = newIceServers;
        }
        return new OrigPeerConnection(pcConfig, pcConstraints);
      };
      window2.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
      if ("generateCertificate" in OrigPeerConnection) {
        Object.defineProperty(window2.RTCPeerConnection, "generateCertificate", {
          get: function get() {
            return OrigPeerConnection.generateCertificate;
          }
        });
      }
    }
    function shimTrackEventTransceiver(window2) {
      if (_typeof(window2) === "object" && window2.RTCTrackEvent && "receiver" in window2.RTCTrackEvent.prototype && !("transceiver" in window2.RTCTrackEvent.prototype)) {
        Object.defineProperty(window2.RTCTrackEvent.prototype, "transceiver", {
          get: function get() {
            return {
              receiver: this.receiver
            };
          }
        });
      }
    }
    function shimCreateOfferLegacy(window2) {
      var origCreateOffer = window2.RTCPeerConnection.prototype.createOffer;
      window2.RTCPeerConnection.prototype.createOffer = function createOffer(offerOptions) {
        if (offerOptions) {
          if (typeof offerOptions.offerToReceiveAudio !== "undefined") {
            offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
          }
          var audioTransceiver = this.getTransceivers().find(function(transceiver) {
            return transceiver.receiver.track.kind === "audio";
          });
          if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
            if (audioTransceiver.direction === "sendrecv") {
              if (audioTransceiver.setDirection) {
                audioTransceiver.setDirection("sendonly");
              } else {
                audioTransceiver.direction = "sendonly";
              }
            } else if (audioTransceiver.direction === "recvonly") {
              if (audioTransceiver.setDirection) {
                audioTransceiver.setDirection("inactive");
              } else {
                audioTransceiver.direction = "inactive";
              }
            }
          } else if (offerOptions.offerToReceiveAudio === true && !audioTransceiver) {
            this.addTransceiver("audio", {
              direction: "recvonly"
            });
          }
          if (typeof offerOptions.offerToReceiveVideo !== "undefined") {
            offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
          }
          var videoTransceiver = this.getTransceivers().find(function(transceiver) {
            return transceiver.receiver.track.kind === "video";
          });
          if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
            if (videoTransceiver.direction === "sendrecv") {
              if (videoTransceiver.setDirection) {
                videoTransceiver.setDirection("sendonly");
              } else {
                videoTransceiver.direction = "sendonly";
              }
            } else if (videoTransceiver.direction === "recvonly") {
              if (videoTransceiver.setDirection) {
                videoTransceiver.setDirection("inactive");
              } else {
                videoTransceiver.direction = "inactive";
              }
            }
          } else if (offerOptions.offerToReceiveVideo === true && !videoTransceiver) {
            this.addTransceiver("video", {
              direction: "recvonly"
            });
          }
        }
        return origCreateOffer.apply(this, arguments);
      };
    }
    function shimAudioContext(window2) {
      if (_typeof(window2) !== "object" || window2.AudioContext) {
        return;
      }
      window2.AudioContext = window2.webkitAudioContext;
    }
  }
});

// node_modules/@yudiel/react-qr-scanner/dist/esm/index.js
var import_react = __toESM(require_react());
var import_getusermedia = __toESM(require_getusermedia());
var import_getusermedia2 = __toESM(require_getusermedia2());
var import_safari_shim = __toESM(require_safari_shim());
var import_utils = __toESM(require_utils());

// node_modules/barcode-detector/dist/es/pure.js
var Zr = (o2) => {
  throw TypeError(o2);
};
var Jr = (o2, d2, p2) => d2.has(o2) || Zr("Cannot " + p2);
var Kr = (o2, d2, p2) => (Jr(o2, d2, "read from private field"), p2 ? p2.call(o2) : d2.get(o2));
var te = (o2, d2, p2) => d2.has(o2) ? Zr("Cannot add the same private member more than once") : d2 instanceof WeakSet ? d2.add(o2) : d2.set(o2, p2);
var re = (o2, d2, p2, y2) => (Jr(o2, d2, "write to private field"), y2 ? y2.call(o2, p2) : d2.set(o2, p2), p2);
var ee = [
  "Aztec",
  "Codabar",
  "Code128",
  "Code39",
  "Code93",
  "DataBar",
  "DataBarExpanded",
  "DataBarLimited",
  "DataMatrix",
  "DXFilmEdge",
  "EAN-13",
  "EAN-8",
  "ITF",
  "Linear-Codes",
  "Matrix-Codes",
  "MaxiCode",
  "MicroQRCode",
  "None",
  "PDF417",
  "QRCode",
  "rMQRCode",
  "UPC-A",
  "UPC-E"
];
function ro(o2) {
  return o2.join("|");
}
function eo(o2) {
  const d2 = ne(o2);
  let p2 = 0, y2 = ee.length - 1;
  for (; p2 <= y2; ) {
    const c2 = Math.floor((p2 + y2) / 2), P = ee[c2], D2 = ne(P);
    if (D2 === d2)
      return P;
    D2 < d2 ? p2 = c2 + 1 : y2 = c2 - 1;
  }
  return "None";
}
function ne(o2) {
  return o2.toLowerCase().replace(/_-\[\]/g, "");
}
function no(o2, d2) {
  return o2.Binarizer[d2];
}
function ao(o2, d2) {
  return o2.CharacterSet[d2];
}
var oo = [
  "Text",
  "Binary",
  "Mixed",
  "GS1",
  "ISO15434",
  "UnknownECI"
];
function io(o2) {
  return oo[o2.value];
}
function so(o2, d2) {
  return o2.EanAddOnSymbol[d2];
}
function uo(o2, d2) {
  return o2.TextMode[d2];
}
var st = {
  formats: [],
  tryHarder: true,
  tryRotate: true,
  tryInvert: true,
  tryDownscale: true,
  binarizer: "LocalAverage",
  isPure: false,
  downscaleFactor: 3,
  downscaleThreshold: 500,
  minLineCount: 2,
  maxNumberOfSymbols: 255,
  tryCode39ExtendedMode: false,
  validateCode39CheckSum: false,
  validateITFCheckSum: false,
  returnCodabarStartEnd: false,
  returnErrors: false,
  eanAddOnSymbol: "Read",
  textMode: "Plain",
  characterSet: "Unknown"
};
function oe(o2, d2) {
  return {
    ...d2,
    formats: ro(d2.formats),
    binarizer: no(o2, d2.binarizer),
    eanAddOnSymbol: so(
      o2,
      d2.eanAddOnSymbol
    ),
    textMode: uo(o2, d2.textMode),
    characterSet: ao(
      o2,
      d2.characterSet
    )
  };
}
function ie(o2) {
  return {
    ...o2,
    format: eo(o2.format),
    eccLevel: o2.eccLevel,
    contentType: io(o2.contentType)
  };
}
var co = {
  locateFile: (o2, d2) => {
    const p2 = o2.match(/_(.+?)\.wasm$/);
    return p2 ? `https://fastly.jsdelivr.net/npm/zxing-wasm@1.3.4/dist/${p2[1]}/${o2}` : d2 + o2;
  }
};
var ar = /* @__PURE__ */ new WeakMap();
function ir(o2, d2) {
  var p2;
  const y2 = ar.get(o2);
  if (y2 != null && y2.modulePromise && d2 === void 0)
    return y2.modulePromise;
  const c2 = (p2 = y2 == null ? void 0 : y2.moduleOverrides) != null ? p2 : co, P = o2({
    ...c2
  });
  return ar.set(o2, {
    moduleOverrides: c2,
    modulePromise: P
  }), P;
}
function lo(o2, d2) {
  ar.set(o2, {
    moduleOverrides: d2
  });
}
async function fo(o2, d2, p2 = st) {
  const y2 = {
    ...st,
    ...p2
  }, c2 = await ir(o2), { size: P } = d2, D2 = new Uint8Array(await d2.arrayBuffer()), B2 = c2._malloc(P);
  c2.HEAPU8.set(D2, B2);
  const V2 = c2.readBarcodesFromImage(
    B2,
    P,
    oe(c2, y2)
  );
  c2._free(B2);
  const R2 = [];
  for (let W = 0; W < V2.size(); ++W)
    R2.push(
      ie(V2.get(W))
    );
  return R2;
}
async function ho(o2, d2, p2 = st) {
  const y2 = {
    ...st,
    ...p2
  }, c2 = await ir(o2), {
    data: P,
    width: D2,
    height: B2,
    data: { byteLength: V2 }
  } = d2, R2 = c2._malloc(V2);
  c2.HEAPU8.set(P, R2);
  const W = c2.readBarcodesFromPixmap(
    R2,
    D2,
    B2,
    oe(c2, y2)
  );
  c2._free(R2);
  const N2 = [];
  for (let H = 0; H < W.size(); ++H)
    N2.push(
      ie(W.get(H))
    );
  return N2;
}
({
  ...st,
  formats: [...st.formats]
});
var Bt = (() => {
  var o2, d2 = typeof document < "u" && ((o2 = document.currentScript) == null ? void 0 : o2.tagName.toUpperCase()) === "SCRIPT" ? document.currentScript.src : void 0;
  return function(p2 = {}) {
    var y2, c2 = p2, P, D2, B2 = new Promise((t2, r2) => {
      P = t2, D2 = r2;
    }), V2 = typeof window == "object", R2 = typeof Bun < "u", W = typeof importScripts == "function";
    typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string" && process.type != "renderer";
    var N2 = Object.assign({}, c2), H = "./this.program", I2 = "";
    function ut(t2) {
      return c2.locateFile ? c2.locateFile(t2, I2) : I2 + t2;
    }
    var ct, et;
    if (V2 || W || R2) {
      var lt;
      W ? I2 = self.location.href : typeof document < "u" && ((lt = document.currentScript) === null || lt === void 0 ? void 0 : lt.tagName.toUpperCase()) === "SCRIPT" && (I2 = document.currentScript.src), d2 && (I2 = d2), I2.startsWith("blob:") ? I2 = "" : I2 = I2.substr(0, I2.replace(/[?#].*/, "").lastIndexOf("/") + 1), W && (et = (t2) => {
        var r2 = new XMLHttpRequest();
        return r2.open("GET", t2, false), r2.responseType = "arraybuffer", r2.send(null), new Uint8Array(r2.response);
      }), ct = (t2) => fetch(t2, {
        credentials: "same-origin"
      }).then((r2) => r2.ok ? r2.arrayBuffer() : Promise.reject(new Error(r2.status + " : " + r2.url)));
    }
    var kt = c2.print || console.log.bind(console), nt = c2.printErr || console.error.bind(console);
    Object.assign(c2, N2), N2 = null, c2.arguments && c2.arguments, c2.thisProgram && (H = c2.thisProgram);
    var wt = c2.wasmBinary, $t, sr = false, L2, F2, at, ft, Z, E2, ur, cr;
    function lr() {
      var t2 = $t.buffer;
      c2.HEAP8 = L2 = new Int8Array(t2), c2.HEAP16 = at = new Int16Array(t2), c2.HEAPU8 = F2 = new Uint8Array(t2), c2.HEAPU16 = ft = new Uint16Array(t2), c2.HEAP32 = Z = new Int32Array(t2), c2.HEAPU32 = E2 = new Uint32Array(t2), c2.HEAPF32 = ur = new Float32Array(t2), c2.HEAPF64 = cr = new Float64Array(t2);
    }
    var fr = [], dr = [], hr = [];
    function me() {
      var t2 = c2.preRun;
      t2 && (typeof t2 == "function" && (t2 = [t2]), t2.forEach($e)), Vt(fr);
    }
    function ge() {
      Vt(dr);
    }
    function we() {
      var t2 = c2.postRun;
      t2 && (typeof t2 == "function" && (t2 = [t2]), t2.forEach(Ce)), Vt(hr);
    }
    function $e(t2) {
      fr.unshift(t2);
    }
    function be(t2) {
      dr.unshift(t2);
    }
    function Ce(t2) {
      hr.unshift(t2);
    }
    var J2 = 0, dt = null;
    function Te(t2) {
      var r2;
      J2++, (r2 = c2.monitorRunDependencies) === null || r2 === void 0 || r2.call(c2, J2);
    }
    function Pe(t2) {
      var r2;
      if (J2--, (r2 = c2.monitorRunDependencies) === null || r2 === void 0 || r2.call(c2, J2), J2 == 0 && dt) {
        var e3 = dt;
        dt = null, e3();
      }
    }
    function Ut(t2) {
      var r2;
      (r2 = c2.onAbort) === null || r2 === void 0 || r2.call(c2, t2), t2 = "Aborted(" + t2 + ")", nt(t2), sr = true, t2 += ". Build with -sASSERTIONS for more info.";
      var e3 = new WebAssembly.RuntimeError(t2);
      throw D2(e3), e3;
    }
    var Ee = "data:application/octet-stream;base64,", pr = (t2) => t2.startsWith(Ee);
    function _e() {
      var t2 = "zxing_reader.wasm";
      return pr(t2) ? t2 : ut(t2);
    }
    var bt;
    function vr(t2) {
      if (t2 == bt && wt)
        return new Uint8Array(wt);
      if (et)
        return et(t2);
      throw "both async and sync fetching of the wasm failed";
    }
    function Ae(t2) {
      return wt ? Promise.resolve().then(() => vr(t2)) : ct(t2).then((r2) => new Uint8Array(r2), () => vr(t2));
    }
    function yr(t2, r2, e3) {
      return Ae(t2).then((n2) => WebAssembly.instantiate(n2, r2)).then(e3, (n2) => {
        nt(`failed to asynchronously prepare wasm: ${n2}`), Ut(n2);
      });
    }
    function Oe(t2, r2, e3, n2) {
      return !t2 && typeof WebAssembly.instantiateStreaming == "function" && !pr(r2) && typeof fetch == "function" ? fetch(r2, {
        credentials: "same-origin"
      }).then((a2) => {
        var i2 = WebAssembly.instantiateStreaming(a2, e3);
        return i2.then(n2, function(u2) {
          return nt(`wasm streaming compile failed: ${u2}`), nt("falling back to ArrayBuffer instantiation"), yr(r2, e3, n2);
        });
      }) : yr(r2, e3, n2);
    }
    function xe() {
      return {
        a: wa
      };
    }
    function De() {
      var t2, r2 = xe();
      function e3(a2, i2) {
        return A2 = a2.exports, $t = A2.za, lr(), _r = A2.Da, be(A2.Aa), Pe(), A2;
      }
      Te();
      function n2(a2) {
        e3(a2.instance);
      }
      if (c2.instantiateWasm)
        try {
          return c2.instantiateWasm(r2, e3);
        } catch (a2) {
          nt(`Module.instantiateWasm callback failed with error: ${a2}`), D2(a2);
        }
      return (t2 = bt) !== null && t2 !== void 0 || (bt = _e()), Oe(wt, bt, r2, n2).catch(D2), {};
    }
    var Vt = (t2) => {
      t2.forEach((r2) => r2(c2));
    };
    c2.noExitRuntime;
    var w2 = (t2) => Br(t2), $ = () => kr(), Ct = [], Tt = 0, Se = (t2) => {
      var r2 = new Ht(t2);
      return r2.get_caught() || (r2.set_caught(true), Tt--), r2.set_rethrown(false), Ct.push(r2), Vr(t2), Ir(t2);
    }, G2 = 0, je = () => {
      m2(0, 0);
      var t2 = Ct.pop();
      Ur(t2.excPtr), G2 = 0;
    };
    class Ht {
      constructor(r2) {
        this.excPtr = r2, this.ptr = r2 - 24;
      }
      set_type(r2) {
        E2[this.ptr + 4 >> 2] = r2;
      }
      get_type() {
        return E2[this.ptr + 4 >> 2];
      }
      set_destructor(r2) {
        E2[this.ptr + 8 >> 2] = r2;
      }
      get_destructor() {
        return E2[this.ptr + 8 >> 2];
      }
      set_caught(r2) {
        r2 = r2 ? 1 : 0, L2[this.ptr + 12] = r2;
      }
      get_caught() {
        return L2[this.ptr + 12] != 0;
      }
      set_rethrown(r2) {
        r2 = r2 ? 1 : 0, L2[this.ptr + 13] = r2;
      }
      get_rethrown() {
        return L2[this.ptr + 13] != 0;
      }
      init(r2, e3) {
        this.set_adjusted_ptr(0), this.set_type(r2), this.set_destructor(e3);
      }
      set_adjusted_ptr(r2) {
        E2[this.ptr + 16 >> 2] = r2;
      }
      get_adjusted_ptr() {
        return E2[this.ptr + 16 >> 2];
      }
    }
    var Fe = (t2) => {
      throw G2 || (G2 = t2), G2;
    }, Pt = (t2) => Rr(t2), Lt = (t2) => {
      var r2 = G2;
      if (!r2)
        return Pt(0), 0;
      var e3 = new Ht(r2);
      e3.set_adjusted_ptr(r2);
      var n2 = e3.get_type();
      if (!n2)
        return Pt(0), r2;
      for (var a2 of t2) {
        if (a2 === 0 || a2 === n2)
          break;
        var i2 = e3.ptr + 16;
        if (Hr(a2, n2, i2))
          return Pt(a2), r2;
      }
      return Pt(n2), r2;
    }, Me = () => Lt([]), We = (t2) => Lt([t2]), Ie = (t2, r2) => Lt([t2, r2]), Re = () => {
      var t2 = Ct.pop();
      t2 || Ut("no exception to throw");
      var r2 = t2.excPtr;
      throw t2.get_rethrown() || (Ct.push(t2), t2.set_rethrown(true), t2.set_caught(false), Tt++), G2 = r2, G2;
    }, Be = (t2, r2, e3) => {
      var n2 = new Ht(t2);
      throw n2.init(r2, e3), G2 = t2, Tt++, G2;
    }, ke = () => Tt, Ue = () => {
      Ut("");
    }, Et = {}, zt = (t2) => {
      for (; t2.length; ) {
        var r2 = t2.pop(), e3 = t2.pop();
        e3(r2);
      }
    };
    function ht(t2) {
      return this.fromWireType(E2[t2 >> 2]);
    }
    var ot = {}, K2 = {}, _t = {}, mr, At = (t2) => {
      throw new mr(t2);
    }, tt = (t2, r2, e3) => {
      t2.forEach((s) => _t[s] = r2);
      function n2(s) {
        var l2 = e3(s);
        l2.length !== t2.length && At("Mismatched type converter count");
        for (var f2 = 0; f2 < t2.length; ++f2)
          k2(t2[f2], l2[f2]);
      }
      var a2 = new Array(r2.length), i2 = [], u2 = 0;
      r2.forEach((s, l2) => {
        K2.hasOwnProperty(s) ? a2[l2] = K2[s] : (i2.push(s), ot.hasOwnProperty(s) || (ot[s] = []), ot[s].push(() => {
          a2[l2] = K2[s], ++u2, u2 === i2.length && n2(a2);
        }));
      }), i2.length === 0 && n2(a2);
    }, Ve = (t2) => {
      var r2 = Et[t2];
      delete Et[t2];
      var e3 = r2.rawConstructor, n2 = r2.rawDestructor, a2 = r2.fields, i2 = a2.map((u2) => u2.getterReturnType).concat(a2.map((u2) => u2.setterArgumentType));
      tt([t2], i2, (u2) => {
        var s = {};
        return a2.forEach((l2, f2) => {
          var h2 = l2.fieldName, v = u2[f2], g2 = l2.getter, T2 = l2.getterContext, _ = u2[f2 + a2.length], S = l2.setter, O = l2.setterContext;
          s[h2] = {
            read: (x2) => v.fromWireType(g2(T2, x2)),
            write: (x2, rt) => {
              var M2 = [];
              S(O, x2, _.toWireType(M2, rt)), zt(M2);
            }
          };
        }), [{
          name: r2.name,
          fromWireType: (l2) => {
            var f2 = {};
            for (var h2 in s)
              f2[h2] = s[h2].read(l2);
            return n2(l2), f2;
          },
          toWireType: (l2, f2) => {
            for (var h2 in s)
              if (!(h2 in f2))
                throw new TypeError(`Missing field: "${h2}"`);
            var v = e3();
            for (h2 in s)
              s[h2].write(v, f2[h2]);
            return l2 !== null && l2.push(n2, v), v;
          },
          argPackAdvance: z,
          readValueFromPointer: ht,
          destructorFunction: n2
        }];
      });
    }, He = (t2, r2, e3, n2, a2) => {
    }, Le = () => {
      for (var t2 = new Array(256), r2 = 0; r2 < 256; ++r2)
        t2[r2] = String.fromCharCode(r2);
      gr = t2;
    }, gr, j = (t2) => {
      for (var r2 = "", e3 = t2; F2[e3]; )
        r2 += gr[F2[e3++]];
      return r2;
    }, it, C2 = (t2) => {
      throw new it(t2);
    };
    function ze(t2, r2) {
      let e3 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      var n2 = r2.name;
      if (t2 || C2(`type "${n2}" must have a positive integer typeid pointer`), K2.hasOwnProperty(t2)) {
        if (e3.ignoreDuplicateRegistrations)
          return;
        C2(`Cannot register type '${n2}' twice`);
      }
      if (K2[t2] = r2, delete _t[t2], ot.hasOwnProperty(t2)) {
        var a2 = ot[t2];
        delete ot[t2], a2.forEach((i2) => i2());
      }
    }
    function k2(t2, r2) {
      let e3 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return ze(t2, r2, e3);
    }
    var z = 8, Ne = (t2, r2, e3, n2) => {
      r2 = j(r2), k2(t2, {
        name: r2,
        fromWireType: function(a2) {
          return !!a2;
        },
        toWireType: function(a2, i2) {
          return i2 ? e3 : n2;
        },
        argPackAdvance: z,
        readValueFromPointer: function(a2) {
          return this.fromWireType(F2[a2]);
        },
        destructorFunction: null
      });
    }, Ge = (t2) => ({
      count: t2.count,
      deleteScheduled: t2.deleteScheduled,
      preservePointerOnDelete: t2.preservePointerOnDelete,
      ptr: t2.ptr,
      ptrType: t2.ptrType,
      smartPtr: t2.smartPtr,
      smartPtrType: t2.smartPtrType
    }), Nt = (t2) => {
      function r2(e3) {
        return e3.$$.ptrType.registeredClass.name;
      }
      C2(r2(t2) + " instance already deleted");
    }, Gt = false, wr = (t2) => {
    }, Xe = (t2) => {
      t2.smartPtr ? t2.smartPtrType.rawDestructor(t2.smartPtr) : t2.ptrType.registeredClass.rawDestructor(t2.ptr);
    }, $r = (t2) => {
      t2.count.value -= 1;
      var r2 = t2.count.value === 0;
      r2 && Xe(t2);
    }, br = (t2, r2, e3) => {
      if (r2 === e3)
        return t2;
      if (e3.baseClass === void 0)
        return null;
      var n2 = br(t2, r2, e3.baseClass);
      return n2 === null ? null : e3.downcast(n2);
    }, Cr = {}, Qe = {}, Ye = (t2, r2) => {
      for (r2 === void 0 && C2("ptr should not be undefined"); t2.baseClass; )
        r2 = t2.upcast(r2), t2 = t2.baseClass;
      return r2;
    }, qe = (t2, r2) => (r2 = Ye(t2, r2), Qe[r2]), Ot = (t2, r2) => {
      (!r2.ptrType || !r2.ptr) && At("makeClassHandle requires ptr and ptrType");
      var e3 = !!r2.smartPtrType, n2 = !!r2.smartPtr;
      return e3 !== n2 && At("Both smartPtrType and smartPtr must be specified"), r2.count = {
        value: 1
      }, pt(Object.create(t2, {
        $$: {
          value: r2,
          writable: true
        }
      }));
    };
    function Ze(t2) {
      var r2 = this.getPointee(t2);
      if (!r2)
        return this.destructor(t2), null;
      var e3 = qe(this.registeredClass, r2);
      if (e3 !== void 0) {
        if (e3.$$.count.value === 0)
          return e3.$$.ptr = r2, e3.$$.smartPtr = t2, e3.clone();
        var n2 = e3.clone();
        return this.destructor(t2), n2;
      }
      function a2() {
        return this.isSmartPointer ? Ot(this.registeredClass.instancePrototype, {
          ptrType: this.pointeeType,
          ptr: r2,
          smartPtrType: this,
          smartPtr: t2
        }) : Ot(this.registeredClass.instancePrototype, {
          ptrType: this,
          ptr: t2
        });
      }
      var i2 = this.registeredClass.getActualType(r2), u2 = Cr[i2];
      if (!u2)
        return a2.call(this);
      var s;
      this.isConst ? s = u2.constPointerType : s = u2.pointerType;
      var l2 = br(r2, this.registeredClass, s.registeredClass);
      return l2 === null ? a2.call(this) : this.isSmartPointer ? Ot(s.registeredClass.instancePrototype, {
        ptrType: s,
        ptr: l2,
        smartPtrType: this,
        smartPtr: t2
      }) : Ot(s.registeredClass.instancePrototype, {
        ptrType: s,
        ptr: l2
      });
    }
    var pt = (t2) => typeof FinalizationRegistry > "u" ? (pt = (r2) => r2, t2) : (Gt = new FinalizationRegistry((r2) => {
      $r(r2.$$);
    }), pt = (r2) => {
      var e3 = r2.$$, n2 = !!e3.smartPtr;
      if (n2) {
        var a2 = {
          $$: e3
        };
        Gt.register(r2, a2, r2);
      }
      return r2;
    }, wr = (r2) => Gt.unregister(r2), pt(t2)), xt = [], Je = () => {
      for (; xt.length; ) {
        var t2 = xt.pop();
        t2.$$.deleteScheduled = false, t2.delete();
      }
    }, Tr, Ke = () => {
      Object.assign(Dt.prototype, {
        isAliasOf(t2) {
          if (!(this instanceof Dt) || !(t2 instanceof Dt))
            return false;
          var r2 = this.$$.ptrType.registeredClass, e3 = this.$$.ptr;
          t2.$$ = t2.$$;
          for (var n2 = t2.$$.ptrType.registeredClass, a2 = t2.$$.ptr; r2.baseClass; )
            e3 = r2.upcast(e3), r2 = r2.baseClass;
          for (; n2.baseClass; )
            a2 = n2.upcast(a2), n2 = n2.baseClass;
          return r2 === n2 && e3 === a2;
        },
        clone() {
          if (this.$$.ptr || Nt(this), this.$$.preservePointerOnDelete)
            return this.$$.count.value += 1, this;
          var t2 = pt(Object.create(Object.getPrototypeOf(this), {
            $$: {
              value: Ge(this.$$)
            }
          }));
          return t2.$$.count.value += 1, t2.$$.deleteScheduled = false, t2;
        },
        delete() {
          this.$$.ptr || Nt(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && C2("Object already scheduled for deletion"), wr(this), $r(this.$$), this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0, this.$$.ptr = void 0);
        },
        isDeleted() {
          return !this.$$.ptr;
        },
        deleteLater() {
          return this.$$.ptr || Nt(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && C2("Object already scheduled for deletion"), xt.push(this), xt.length === 1 && Tr && Tr(Je), this.$$.deleteScheduled = true, this;
        }
      });
    };
    function Dt() {
    }
    var vt = (t2, r2) => Object.defineProperty(r2, "name", {
      value: t2
    }), Pr = (t2, r2, e3) => {
      if (t2[r2].overloadTable === void 0) {
        var n2 = t2[r2];
        t2[r2] = function() {
          for (var a2 = arguments.length, i2 = new Array(a2), u2 = 0; u2 < a2; u2++)
            i2[u2] = arguments[u2];
          return t2[r2].overloadTable.hasOwnProperty(i2.length) || C2(`Function '${e3}' called with an invalid number of arguments (${i2.length}) - expects one of (${t2[r2].overloadTable})!`), t2[r2].overloadTable[i2.length].apply(this, i2);
        }, t2[r2].overloadTable = [], t2[r2].overloadTable[n2.argCount] = n2;
      }
    }, Xt = (t2, r2, e3) => {
      c2.hasOwnProperty(t2) ? ((e3 === void 0 || c2[t2].overloadTable !== void 0 && c2[t2].overloadTable[e3] !== void 0) && C2(`Cannot register public name '${t2}' twice`), Pr(c2, t2, t2), c2.hasOwnProperty(e3) && C2(`Cannot register multiple overloads of a function with the same number of arguments (${e3})!`), c2[t2].overloadTable[e3] = r2) : (c2[t2] = r2, e3 !== void 0 && (c2[t2].numArguments = e3));
    }, tn = 48, rn = 57, en = (t2) => {
      t2 = t2.replace(/[^a-zA-Z0-9_]/g, "$");
      var r2 = t2.charCodeAt(0);
      return r2 >= tn && r2 <= rn ? `_${t2}` : t2;
    };
    function nn(t2, r2, e3, n2, a2, i2, u2, s) {
      this.name = t2, this.constructor = r2, this.instancePrototype = e3, this.rawDestructor = n2, this.baseClass = a2, this.getActualType = i2, this.upcast = u2, this.downcast = s, this.pureVirtualFunctions = [];
    }
    var Qt = (t2, r2, e3) => {
      for (; r2 !== e3; )
        r2.upcast || C2(`Expected null or instance of ${e3.name}, got an instance of ${r2.name}`), t2 = r2.upcast(t2), r2 = r2.baseClass;
      return t2;
    };
    function an(t2, r2) {
      if (r2 === null)
        return this.isReference && C2(`null is not a valid ${this.name}`), 0;
      r2.$$ || C2(`Cannot pass "${tr(r2)}" as a ${this.name}`), r2.$$.ptr || C2(`Cannot pass deleted object as a pointer of type ${this.name}`);
      var e3 = r2.$$.ptrType.registeredClass, n2 = Qt(r2.$$.ptr, e3, this.registeredClass);
      return n2;
    }
    function on(t2, r2) {
      var e3;
      if (r2 === null)
        return this.isReference && C2(`null is not a valid ${this.name}`), this.isSmartPointer ? (e3 = this.rawConstructor(), t2 !== null && t2.push(this.rawDestructor, e3), e3) : 0;
      (!r2 || !r2.$$) && C2(`Cannot pass "${tr(r2)}" as a ${this.name}`), r2.$$.ptr || C2(`Cannot pass deleted object as a pointer of type ${this.name}`), !this.isConst && r2.$$.ptrType.isConst && C2(`Cannot convert argument of type ${r2.$$.smartPtrType ? r2.$$.smartPtrType.name : r2.$$.ptrType.name} to parameter type ${this.name}`);
      var n2 = r2.$$.ptrType.registeredClass;
      if (e3 = Qt(r2.$$.ptr, n2, this.registeredClass), this.isSmartPointer)
        switch (r2.$$.smartPtr === void 0 && C2("Passing raw pointer to smart pointer is illegal"), this.sharingPolicy) {
          case 0:
            r2.$$.smartPtrType === this ? e3 = r2.$$.smartPtr : C2(`Cannot convert argument of type ${r2.$$.smartPtrType ? r2.$$.smartPtrType.name : r2.$$.ptrType.name} to parameter type ${this.name}`);
            break;
          case 1:
            e3 = r2.$$.smartPtr;
            break;
          case 2:
            if (r2.$$.smartPtrType === this)
              e3 = r2.$$.smartPtr;
            else {
              var a2 = r2.clone();
              e3 = this.rawShare(e3, Q2.toHandle(() => a2.delete())), t2 !== null && t2.push(this.rawDestructor, e3);
            }
            break;
          default:
            C2("Unsupporting sharing policy");
        }
      return e3;
    }
    function sn(t2, r2) {
      if (r2 === null)
        return this.isReference && C2(`null is not a valid ${this.name}`), 0;
      r2.$$ || C2(`Cannot pass "${tr(r2)}" as a ${this.name}`), r2.$$.ptr || C2(`Cannot pass deleted object as a pointer of type ${this.name}`), r2.$$.ptrType.isConst && C2(`Cannot convert argument of type ${r2.$$.ptrType.name} to parameter type ${this.name}`);
      var e3 = r2.$$.ptrType.registeredClass, n2 = Qt(r2.$$.ptr, e3, this.registeredClass);
      return n2;
    }
    var un = () => {
      Object.assign(St.prototype, {
        getPointee(t2) {
          return this.rawGetPointee && (t2 = this.rawGetPointee(t2)), t2;
        },
        destructor(t2) {
          var r2;
          (r2 = this.rawDestructor) === null || r2 === void 0 || r2.call(this, t2);
        },
        argPackAdvance: z,
        readValueFromPointer: ht,
        fromWireType: Ze
      });
    };
    function St(t2, r2, e3, n2, a2, i2, u2, s, l2, f2, h2) {
      this.name = t2, this.registeredClass = r2, this.isReference = e3, this.isConst = n2, this.isSmartPointer = a2, this.pointeeType = i2, this.sharingPolicy = u2, this.rawGetPointee = s, this.rawConstructor = l2, this.rawShare = f2, this.rawDestructor = h2, !a2 && r2.baseClass === void 0 ? n2 ? (this.toWireType = an, this.destructorFunction = null) : (this.toWireType = sn, this.destructorFunction = null) : this.toWireType = on;
    }
    var Er = (t2, r2, e3) => {
      c2.hasOwnProperty(t2) || At("Replacing nonexistent public symbol"), c2[t2].overloadTable !== void 0 && e3 !== void 0 ? c2[t2].overloadTable[e3] = r2 : (c2[t2] = r2, c2[t2].argCount = e3);
    }, cn = (t2, r2, e3) => {
      t2 = t2.replace(/p/g, "i");
      var n2 = c2["dynCall_" + t2];
      return n2(r2, ...e3);
    }, jt = [], _r, b = (t2) => {
      var r2 = jt[t2];
      return r2 || (t2 >= jt.length && (jt.length = t2 + 1), jt[t2] = r2 = _r.get(t2)), r2;
    }, ln = function(t2, r2) {
      let e3 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
      if (t2.includes("j"))
        return cn(t2, r2, e3);
      var n2 = b(r2)(...e3);
      return n2;
    }, fn = (t2, r2) => function() {
      for (var e3 = arguments.length, n2 = new Array(e3), a2 = 0; a2 < e3; a2++)
        n2[a2] = arguments[a2];
      return ln(t2, r2, n2);
    }, U = (t2, r2) => {
      t2 = j(t2);
      function e3() {
        return t2.includes("j") ? fn(t2, r2) : b(r2);
      }
      var n2 = e3();
      return typeof n2 != "function" && C2(`unknown function pointer with signature ${t2}: ${r2}`), n2;
    }, dn = (t2, r2) => {
      var e3 = vt(r2, function(n2) {
        this.name = r2, this.message = n2;
        var a2 = new Error(n2).stack;
        a2 !== void 0 && (this.stack = this.toString() + `
` + a2.replace(/^Error(:[^\n]*)?\n/, ""));
      });
      return e3.prototype = Object.create(t2.prototype), e3.prototype.constructor = e3, e3.prototype.toString = function() {
        return this.message === void 0 ? this.name : `${this.name}: ${this.message}`;
      }, e3;
    }, Ar, Or = (t2) => {
      var r2 = Wr(t2), e3 = j(r2);
      return Y2(r2), e3;
    }, Ft = (t2, r2) => {
      var e3 = [], n2 = {};
      function a2(i2) {
        if (!n2[i2] && !K2[i2]) {
          if (_t[i2]) {
            _t[i2].forEach(a2);
            return;
          }
          e3.push(i2), n2[i2] = true;
        }
      }
      throw r2.forEach(a2), new Ar(`${t2}: ` + e3.map(Or).join([", "]));
    }, hn = (t2, r2, e3, n2, a2, i2, u2, s, l2, f2, h2, v, g2) => {
      h2 = j(h2), i2 = U(a2, i2), s && (s = U(u2, s)), f2 && (f2 = U(l2, f2)), g2 = U(v, g2);
      var T2 = en(h2);
      Xt(T2, function() {
        Ft(`Cannot construct ${h2} due to unbound types`, [n2]);
      }), tt([t2, r2, e3], n2 ? [n2] : [], (_) => {
        _ = _[0];
        var S, O;
        n2 ? (S = _.registeredClass, O = S.instancePrototype) : O = Dt.prototype;
        var x2 = vt(h2, function() {
          if (Object.getPrototypeOf(this) !== rt)
            throw new it("Use 'new' to construct " + h2);
          if (M2.constructor_body === void 0)
            throw new it(h2 + " has no accessible constructor");
          for (var Yr = arguments.length, It = new Array(Yr), Rt = 0; Rt < Yr; Rt++)
            It[Rt] = arguments[Rt];
          var qr = M2.constructor_body[It.length];
          if (qr === void 0)
            throw new it(`Tried to invoke ctor of ${h2} with invalid number of parameters (${It.length}) - expected (${Object.keys(M2.constructor_body).toString()}) parameters instead!`);
          return qr.apply(this, It);
        }), rt = Object.create(O, {
          constructor: {
            value: x2
          }
        });
        x2.prototype = rt;
        var M2 = new nn(h2, x2, rt, g2, S, i2, s, f2);
        if (M2.baseClass) {
          var q2, Wt;
          (Wt = (q2 = M2.baseClass).__derivedClasses) !== null && Wt !== void 0 || (q2.__derivedClasses = []), M2.baseClass.__derivedClasses.push(M2);
        }
        var to = new St(h2, M2, true, false, false), Xr = new St(h2 + "*", M2, false, false, false), Qr = new St(h2 + " const*", M2, false, true, false);
        return Cr[t2] = {
          pointerType: Xr,
          constPointerType: Qr
        }, Er(T2, x2), [to, Xr, Qr];
      });
    }, Yt = (t2, r2) => {
      for (var e3 = [], n2 = 0; n2 < t2; n2++)
        e3.push(E2[r2 + n2 * 4 >> 2]);
      return e3;
    };
    function pn(t2) {
      for (var r2 = 1; r2 < t2.length; ++r2)
        if (t2[r2] !== null && t2[r2].destructorFunction === void 0)
          return true;
      return false;
    }
    function qt(t2, r2, e3, n2, a2, i2) {
      var u2 = r2.length;
      u2 < 2 && C2("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var s = r2[1] !== null && e3 !== null, l2 = pn(r2), f2 = r2[0].name !== "void", h2 = u2 - 2, v = new Array(h2), g2 = [], T2 = [], _ = function() {
        T2.length = 0;
        var S;
        g2.length = s ? 2 : 1, g2[0] = a2, s && (S = r2[1].toWireType(T2, this), g2[1] = S);
        for (var O = 0; O < h2; ++O)
          v[O] = r2[O + 2].toWireType(T2, O < 0 || arguments.length <= O ? void 0 : arguments[O]), g2.push(v[O]);
        var x2 = n2(...g2);
        function rt(M2) {
          if (l2)
            zt(T2);
          else
            for (var q2 = s ? 1 : 2; q2 < r2.length; q2++) {
              var Wt = q2 === 1 ? S : v[q2 - 2];
              r2[q2].destructorFunction !== null && r2[q2].destructorFunction(Wt);
            }
          if (f2)
            return r2[0].fromWireType(M2);
        }
        return rt(x2);
      };
      return vt(t2, _);
    }
    var vn = (t2, r2, e3, n2, a2, i2) => {
      var u2 = Yt(r2, e3);
      a2 = U(n2, a2), tt([], [t2], (s) => {
        s = s[0];
        var l2 = `constructor ${s.name}`;
        if (s.registeredClass.constructor_body === void 0 && (s.registeredClass.constructor_body = []), s.registeredClass.constructor_body[r2 - 1] !== void 0)
          throw new it(`Cannot register multiple constructors with identical number of parameters (${r2 - 1}) for class '${s.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
        return s.registeredClass.constructor_body[r2 - 1] = () => {
          Ft(`Cannot construct ${s.name} due to unbound types`, u2);
        }, tt([], u2, (f2) => (f2.splice(1, 0, null), s.registeredClass.constructor_body[r2 - 1] = qt(l2, f2, null, a2, i2), [])), [];
      });
    }, xr = (t2) => {
      t2 = t2.trim();
      const r2 = t2.indexOf("(");
      return r2 !== -1 ? t2.substr(0, r2) : t2;
    }, yn = (t2, r2, e3, n2, a2, i2, u2, s, l2, f2) => {
      var h2 = Yt(e3, n2);
      r2 = j(r2), r2 = xr(r2), i2 = U(a2, i2), tt([], [t2], (v) => {
        v = v[0];
        var g2 = `${v.name}.${r2}`;
        r2.startsWith("@@") && (r2 = Symbol[r2.substring(2)]), s && v.registeredClass.pureVirtualFunctions.push(r2);
        function T2() {
          Ft(`Cannot call ${g2} due to unbound types`, h2);
        }
        var _ = v.registeredClass.instancePrototype, S = _[r2];
        return S === void 0 || S.overloadTable === void 0 && S.className !== v.name && S.argCount === e3 - 2 ? (T2.argCount = e3 - 2, T2.className = v.name, _[r2] = T2) : (Pr(_, r2, g2), _[r2].overloadTable[e3 - 2] = T2), tt([], h2, (O) => {
          var x2 = qt(g2, O, v, i2, u2);
          return _[r2].overloadTable === void 0 ? (x2.argCount = e3 - 2, _[r2] = x2) : _[r2].overloadTable[e3 - 2] = x2, [];
        }), [];
      });
    }, Zt = [], X = [], Jt = (t2) => {
      t2 > 9 && --X[t2 + 1] === 0 && (X[t2] = void 0, Zt.push(t2));
    }, mn = () => X.length / 2 - 5 - Zt.length, gn = () => {
      X.push(0, 1, void 0, 1, null, 1, true, 1, false, 1), c2.count_emval_handles = mn;
    }, Q2 = {
      toValue: (t2) => (t2 || C2("Cannot use deleted val. handle = " + t2), X[t2]),
      toHandle: (t2) => {
        switch (t2) {
          case void 0:
            return 2;
          case null:
            return 4;
          case true:
            return 6;
          case false:
            return 8;
          default: {
            const r2 = Zt.pop() || X.length;
            return X[r2] = t2, X[r2 + 1] = 1, r2;
          }
        }
      }
    }, Dr = {
      name: "emscripten::val",
      fromWireType: (t2) => {
        var r2 = Q2.toValue(t2);
        return Jt(t2), r2;
      },
      toWireType: (t2, r2) => Q2.toHandle(r2),
      argPackAdvance: z,
      readValueFromPointer: ht,
      destructorFunction: null
    }, wn = (t2) => k2(t2, Dr), $n = (t2, r2, e3) => {
      switch (r2) {
        case 1:
          return e3 ? function(n2) {
            return this.fromWireType(L2[n2]);
          } : function(n2) {
            return this.fromWireType(F2[n2]);
          };
        case 2:
          return e3 ? function(n2) {
            return this.fromWireType(at[n2 >> 1]);
          } : function(n2) {
            return this.fromWireType(ft[n2 >> 1]);
          };
        case 4:
          return e3 ? function(n2) {
            return this.fromWireType(Z[n2 >> 2]);
          } : function(n2) {
            return this.fromWireType(E2[n2 >> 2]);
          };
        default:
          throw new TypeError(`invalid integer width (${r2}): ${t2}`);
      }
    }, bn = (t2, r2, e3, n2) => {
      r2 = j(r2);
      function a2() {
      }
      a2.values = {}, k2(t2, {
        name: r2,
        constructor: a2,
        fromWireType: function(i2) {
          return this.constructor.values[i2];
        },
        toWireType: (i2, u2) => u2.value,
        argPackAdvance: z,
        readValueFromPointer: $n(r2, e3, n2),
        destructorFunction: null
      }), Xt(r2, a2);
    }, Kt = (t2, r2) => {
      var e3 = K2[t2];
      return e3 === void 0 && C2(`${r2} has unknown type ${Or(t2)}`), e3;
    }, Cn = (t2, r2, e3) => {
      var n2 = Kt(t2, "enum");
      r2 = j(r2);
      var a2 = n2.constructor, i2 = Object.create(n2.constructor.prototype, {
        value: {
          value: e3
        },
        constructor: {
          value: vt(`${n2.name}_${r2}`, function() {
          })
        }
      });
      a2.values[e3] = i2, a2[r2] = i2;
    }, tr = (t2) => {
      if (t2 === null)
        return "null";
      var r2 = typeof t2;
      return r2 === "object" || r2 === "array" || r2 === "function" ? t2.toString() : "" + t2;
    }, Tn = (t2, r2) => {
      switch (r2) {
        case 4:
          return function(e3) {
            return this.fromWireType(ur[e3 >> 2]);
          };
        case 8:
          return function(e3) {
            return this.fromWireType(cr[e3 >> 3]);
          };
        default:
          throw new TypeError(`invalid float width (${r2}): ${t2}`);
      }
    }, Pn = (t2, r2, e3) => {
      r2 = j(r2), k2(t2, {
        name: r2,
        fromWireType: (n2) => n2,
        toWireType: (n2, a2) => a2,
        argPackAdvance: z,
        readValueFromPointer: Tn(r2, e3),
        destructorFunction: null
      });
    }, En = (t2, r2, e3, n2, a2, i2, u2, s) => {
      var l2 = Yt(r2, e3);
      t2 = j(t2), t2 = xr(t2), a2 = U(n2, a2), Xt(t2, function() {
        Ft(`Cannot call ${t2} due to unbound types`, l2);
      }, r2 - 1), tt([], l2, (f2) => {
        var h2 = [f2[0], null].concat(f2.slice(1));
        return Er(t2, qt(t2, h2, null, a2, i2), r2 - 1), [];
      });
    }, _n = (t2, r2, e3) => {
      switch (r2) {
        case 1:
          return e3 ? (n2) => L2[n2] : (n2) => F2[n2];
        case 2:
          return e3 ? (n2) => at[n2 >> 1] : (n2) => ft[n2 >> 1];
        case 4:
          return e3 ? (n2) => Z[n2 >> 2] : (n2) => E2[n2 >> 2];
        default:
          throw new TypeError(`invalid integer width (${r2}): ${t2}`);
      }
    }, An = (t2, r2, e3, n2, a2) => {
      r2 = j(r2);
      var i2 = (h2) => h2;
      if (n2 === 0) {
        var u2 = 32 - 8 * e3;
        i2 = (h2) => h2 << u2 >>> u2;
      }
      var s = r2.includes("unsigned"), l2 = (h2, v) => {
      }, f2;
      s ? f2 = function(h2, v) {
        return l2(v, this.name), v >>> 0;
      } : f2 = function(h2, v) {
        return l2(v, this.name), v;
      }, k2(t2, {
        name: r2,
        fromWireType: i2,
        toWireType: f2,
        argPackAdvance: z,
        readValueFromPointer: _n(r2, e3, n2 !== 0),
        destructorFunction: null
      });
    }, On = (t2, r2, e3) => {
      var n2 = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], a2 = n2[r2];
      function i2(u2) {
        var s = E2[u2 >> 2], l2 = E2[u2 + 4 >> 2];
        return new a2(L2.buffer, l2, s);
      }
      e3 = j(e3), k2(t2, {
        name: e3,
        fromWireType: i2,
        argPackAdvance: z,
        readValueFromPointer: i2
      }, {
        ignoreDuplicateRegistrations: true
      });
    }, xn = Object.assign({
      optional: true
    }, Dr), Dn = (t2, r2) => {
      k2(t2, xn);
    }, Sn = (t2, r2, e3, n2) => {
      if (!(n2 > 0)) return 0;
      for (var a2 = e3, i2 = e3 + n2 - 1, u2 = 0; u2 < t2.length; ++u2) {
        var s = t2.charCodeAt(u2);
        if (s >= 55296 && s <= 57343) {
          var l2 = t2.charCodeAt(++u2);
          s = 65536 + ((s & 1023) << 10) | l2 & 1023;
        }
        if (s <= 127) {
          if (e3 >= i2) break;
          r2[e3++] = s;
        } else if (s <= 2047) {
          if (e3 + 1 >= i2) break;
          r2[e3++] = 192 | s >> 6, r2[e3++] = 128 | s & 63;
        } else if (s <= 65535) {
          if (e3 + 2 >= i2) break;
          r2[e3++] = 224 | s >> 12, r2[e3++] = 128 | s >> 6 & 63, r2[e3++] = 128 | s & 63;
        } else {
          if (e3 + 3 >= i2) break;
          r2[e3++] = 240 | s >> 18, r2[e3++] = 128 | s >> 12 & 63, r2[e3++] = 128 | s >> 6 & 63, r2[e3++] = 128 | s & 63;
        }
      }
      return r2[e3] = 0, e3 - a2;
    }, yt = (t2, r2, e3) => Sn(t2, F2, r2, e3), jn = (t2) => {
      for (var r2 = 0, e3 = 0; e3 < t2.length; ++e3) {
        var n2 = t2.charCodeAt(e3);
        n2 <= 127 ? r2++ : n2 <= 2047 ? r2 += 2 : n2 >= 55296 && n2 <= 57343 ? (r2 += 4, ++e3) : r2 += 3;
      }
      return r2;
    }, Sr = typeof TextDecoder < "u" ? new TextDecoder() : void 0, jr = function(t2) {
      let r2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, e3 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : NaN;
      for (var n2 = r2 + e3, a2 = r2; t2[a2] && !(a2 >= n2); ) ++a2;
      if (a2 - r2 > 16 && t2.buffer && Sr)
        return Sr.decode(t2.subarray(r2, a2));
      for (var i2 = ""; r2 < a2; ) {
        var u2 = t2[r2++];
        if (!(u2 & 128)) {
          i2 += String.fromCharCode(u2);
          continue;
        }
        var s = t2[r2++] & 63;
        if ((u2 & 224) == 192) {
          i2 += String.fromCharCode((u2 & 31) << 6 | s);
          continue;
        }
        var l2 = t2[r2++] & 63;
        if ((u2 & 240) == 224 ? u2 = (u2 & 15) << 12 | s << 6 | l2 : u2 = (u2 & 7) << 18 | s << 12 | l2 << 6 | t2[r2++] & 63, u2 < 65536)
          i2 += String.fromCharCode(u2);
        else {
          var f2 = u2 - 65536;
          i2 += String.fromCharCode(55296 | f2 >> 10, 56320 | f2 & 1023);
        }
      }
      return i2;
    }, Fn = (t2, r2) => t2 ? jr(F2, t2, r2) : "", Mn = (t2, r2) => {
      r2 = j(r2);
      var e3 = r2 === "std::string";
      k2(t2, {
        name: r2,
        fromWireType(n2) {
          var a2 = E2[n2 >> 2], i2 = n2 + 4, u2;
          if (e3)
            for (var s = i2, l2 = 0; l2 <= a2; ++l2) {
              var f2 = i2 + l2;
              if (l2 == a2 || F2[f2] == 0) {
                var h2 = f2 - s, v = Fn(s, h2);
                u2 === void 0 ? u2 = v : (u2 += "\0", u2 += v), s = f2 + 1;
              }
            }
          else {
            for (var g2 = new Array(a2), l2 = 0; l2 < a2; ++l2)
              g2[l2] = String.fromCharCode(F2[i2 + l2]);
            u2 = g2.join("");
          }
          return Y2(n2), u2;
        },
        toWireType(n2, a2) {
          a2 instanceof ArrayBuffer && (a2 = new Uint8Array(a2));
          var i2, u2 = typeof a2 == "string";
          u2 || a2 instanceof Uint8Array || a2 instanceof Uint8ClampedArray || a2 instanceof Int8Array || C2("Cannot pass non-string to std::string"), e3 && u2 ? i2 = jn(a2) : i2 = a2.length;
          var s = nr(4 + i2 + 1), l2 = s + 4;
          if (E2[s >> 2] = i2, e3 && u2)
            yt(a2, l2, i2 + 1);
          else if (u2)
            for (var f2 = 0; f2 < i2; ++f2) {
              var h2 = a2.charCodeAt(f2);
              h2 > 255 && (Y2(l2), C2("String has UTF-16 code units that do not fit in 8 bits")), F2[l2 + f2] = h2;
            }
          else
            for (var f2 = 0; f2 < i2; ++f2)
              F2[l2 + f2] = a2[f2];
          return n2 !== null && n2.push(Y2, s), s;
        },
        argPackAdvance: z,
        readValueFromPointer: ht,
        destructorFunction(n2) {
          Y2(n2);
        }
      });
    }, Fr = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0, Wn = (t2, r2) => {
      for (var e3 = t2, n2 = e3 >> 1, a2 = n2 + r2 / 2; !(n2 >= a2) && ft[n2]; ) ++n2;
      if (e3 = n2 << 1, e3 - t2 > 32 && Fr) return Fr.decode(F2.subarray(t2, e3));
      for (var i2 = "", u2 = 0; !(u2 >= r2 / 2); ++u2) {
        var s = at[t2 + u2 * 2 >> 1];
        if (s == 0) break;
        i2 += String.fromCharCode(s);
      }
      return i2;
    }, In = (t2, r2, e3) => {
      var n2;
      if ((n2 = e3) !== null && n2 !== void 0 || (e3 = 2147483647), e3 < 2) return 0;
      e3 -= 2;
      for (var a2 = r2, i2 = e3 < t2.length * 2 ? e3 / 2 : t2.length, u2 = 0; u2 < i2; ++u2) {
        var s = t2.charCodeAt(u2);
        at[r2 >> 1] = s, r2 += 2;
      }
      return at[r2 >> 1] = 0, r2 - a2;
    }, Rn = (t2) => t2.length * 2, Bn = (t2, r2) => {
      for (var e3 = 0, n2 = ""; !(e3 >= r2 / 4); ) {
        var a2 = Z[t2 + e3 * 4 >> 2];
        if (a2 == 0) break;
        if (++e3, a2 >= 65536) {
          var i2 = a2 - 65536;
          n2 += String.fromCharCode(55296 | i2 >> 10, 56320 | i2 & 1023);
        } else
          n2 += String.fromCharCode(a2);
      }
      return n2;
    }, kn = (t2, r2, e3) => {
      var n2;
      if ((n2 = e3) !== null && n2 !== void 0 || (e3 = 2147483647), e3 < 4) return 0;
      for (var a2 = r2, i2 = a2 + e3 - 4, u2 = 0; u2 < t2.length; ++u2) {
        var s = t2.charCodeAt(u2);
        if (s >= 55296 && s <= 57343) {
          var l2 = t2.charCodeAt(++u2);
          s = 65536 + ((s & 1023) << 10) | l2 & 1023;
        }
        if (Z[r2 >> 2] = s, r2 += 4, r2 + 4 > i2) break;
      }
      return Z[r2 >> 2] = 0, r2 - a2;
    }, Un = (t2) => {
      for (var r2 = 0, e3 = 0; e3 < t2.length; ++e3) {
        var n2 = t2.charCodeAt(e3);
        n2 >= 55296 && n2 <= 57343 && ++e3, r2 += 4;
      }
      return r2;
    }, Vn = (t2, r2, e3) => {
      e3 = j(e3);
      var n2, a2, i2, u2;
      r2 === 2 ? (n2 = Wn, a2 = In, u2 = Rn, i2 = (s) => ft[s >> 1]) : r2 === 4 && (n2 = Bn, a2 = kn, u2 = Un, i2 = (s) => E2[s >> 2]), k2(t2, {
        name: e3,
        fromWireType: (s) => {
          for (var l2 = E2[s >> 2], f2, h2 = s + 4, v = 0; v <= l2; ++v) {
            var g2 = s + 4 + v * r2;
            if (v == l2 || i2(g2) == 0) {
              var T2 = g2 - h2, _ = n2(h2, T2);
              f2 === void 0 ? f2 = _ : (f2 += "\0", f2 += _), h2 = g2 + r2;
            }
          }
          return Y2(s), f2;
        },
        toWireType: (s, l2) => {
          typeof l2 != "string" && C2(`Cannot pass non-string to C++ string type ${e3}`);
          var f2 = u2(l2), h2 = nr(4 + f2 + r2);
          return E2[h2 >> 2] = f2 / r2, a2(l2, h2 + 4, f2 + r2), s !== null && s.push(Y2, h2), h2;
        },
        argPackAdvance: z,
        readValueFromPointer: ht,
        destructorFunction(s) {
          Y2(s);
        }
      });
    }, Hn = (t2, r2, e3, n2, a2, i2) => {
      Et[t2] = {
        name: j(r2),
        rawConstructor: U(e3, n2),
        rawDestructor: U(a2, i2),
        fields: []
      };
    }, Ln = (t2, r2, e3, n2, a2, i2, u2, s, l2, f2) => {
      Et[t2].fields.push({
        fieldName: j(r2),
        getterReturnType: e3,
        getter: U(n2, a2),
        getterContext: i2,
        setterArgumentType: u2,
        setter: U(s, l2),
        setterContext: f2
      });
    }, zn = (t2, r2) => {
      r2 = j(r2), k2(t2, {
        isVoid: true,
        name: r2,
        argPackAdvance: 0,
        fromWireType: () => {
        },
        toWireType: (e3, n2) => {
        }
      });
    }, Nn = (t2, r2, e3) => F2.copyWithin(t2, r2, r2 + e3), rr = [], Gn = (t2, r2, e3, n2) => (t2 = rr[t2], r2 = Q2.toValue(r2), t2(null, r2, e3, n2)), Xn = {}, Qn = (t2) => {
      var r2 = Xn[t2];
      return r2 === void 0 ? j(t2) : r2;
    }, Mr = () => {
      if (typeof globalThis == "object")
        return globalThis;
      function t2(r2) {
        r2.$$$embind_global$$$ = r2;
        var e3 = typeof $$$embind_global$$$ == "object" && r2.$$$embind_global$$$ == r2;
        return e3 || delete r2.$$$embind_global$$$, e3;
      }
      if (typeof $$$embind_global$$$ == "object" || (typeof global == "object" && t2(global) ? $$$embind_global$$$ = global : typeof self == "object" && t2(self) && ($$$embind_global$$$ = self), typeof $$$embind_global$$$ == "object"))
        return $$$embind_global$$$;
      throw Error("unable to get global object.");
    }, Yn = (t2) => t2 === 0 ? Q2.toHandle(Mr()) : (t2 = Qn(t2), Q2.toHandle(Mr()[t2])), qn = (t2) => {
      var r2 = rr.length;
      return rr.push(t2), r2;
    }, Zn = (t2, r2) => {
      for (var e3 = new Array(t2), n2 = 0; n2 < t2; ++n2)
        e3[n2] = Kt(E2[r2 + n2 * 4 >> 2], "parameter " + n2);
      return e3;
    }, Jn = Reflect.construct, Kn = (t2, r2, e3) => {
      var n2 = [], a2 = t2.toWireType(n2, e3);
      return n2.length && (E2[r2 >> 2] = Q2.toHandle(n2)), a2;
    }, ta = (t2, r2, e3) => {
      var n2 = Zn(t2, r2), a2 = n2.shift();
      t2--;
      var i2 = new Array(t2), u2 = (l2, f2, h2, v) => {
        for (var g2 = 0, T2 = 0; T2 < t2; ++T2)
          i2[T2] = n2[T2].readValueFromPointer(v + g2), g2 += n2[T2].argPackAdvance;
        var _ = e3 === 1 ? Jn(f2, i2) : f2.apply(l2, i2);
        return Kn(a2, h2, _);
      }, s = `methodCaller<(${n2.map((l2) => l2.name).join(", ")}) => ${a2.name}>`;
      return qn(vt(s, u2));
    }, ra = (t2) => {
      t2 > 9 && (X[t2 + 1] += 1);
    }, ea = (t2) => {
      var r2 = Q2.toValue(t2);
      zt(r2), Jt(t2);
    }, na = (t2, r2) => {
      t2 = Kt(t2, "_emval_take_value");
      var e3 = t2.readValueFromPointer(r2);
      return Q2.toHandle(e3);
    }, aa = (t2, r2, e3, n2) => {
      var a2 = (/* @__PURE__ */ new Date()).getFullYear(), i2 = new Date(a2, 0, 1), u2 = new Date(a2, 6, 1), s = i2.getTimezoneOffset(), l2 = u2.getTimezoneOffset(), f2 = Math.max(s, l2);
      E2[t2 >> 2] = f2 * 60, Z[r2 >> 2] = +(s != l2);
      var h2 = (T2) => {
        var _ = T2 >= 0 ? "-" : "+", S = Math.abs(T2), O = String(Math.floor(S / 60)).padStart(2, "0"), x2 = String(S % 60).padStart(2, "0");
        return `UTC${_}${O}${x2}`;
      }, v = h2(s), g2 = h2(l2);
      l2 < s ? (yt(v, e3, 17), yt(g2, n2, 17)) : (yt(v, n2, 17), yt(g2, e3, 17));
    }, oa = () => 2147483648, ia = (t2, r2) => Math.ceil(t2 / r2) * r2, sa = (t2) => {
      var r2 = $t.buffer, e3 = (t2 - r2.byteLength + 65535) / 65536 | 0;
      try {
        return $t.grow(e3), lr(), 1;
      } catch {
      }
    }, ua = (t2) => {
      var r2 = F2.length;
      t2 >>>= 0;
      var e3 = oa();
      if (t2 > e3)
        return false;
      for (var n2 = 1; n2 <= 4; n2 *= 2) {
        var a2 = r2 * (1 + 0.2 / n2);
        a2 = Math.min(a2, t2 + 100663296);
        var i2 = Math.min(e3, ia(Math.max(t2, a2), 65536)), u2 = sa(i2);
        if (u2)
          return true;
      }
      return false;
    }, er = {}, ca = () => H || "./this.program", mt = () => {
      if (!mt.strings) {
        var t2 = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", r2 = {
          USER: "web_user",
          LOGNAME: "web_user",
          PATH: "/",
          PWD: "/",
          HOME: "/home/web_user",
          LANG: t2,
          _: ca()
        };
        for (var e3 in er)
          er[e3] === void 0 ? delete r2[e3] : r2[e3] = er[e3];
        var n2 = [];
        for (var e3 in r2)
          n2.push(`${e3}=${r2[e3]}`);
        mt.strings = n2;
      }
      return mt.strings;
    }, la = (t2, r2) => {
      for (var e3 = 0; e3 < t2.length; ++e3)
        L2[r2++] = t2.charCodeAt(e3);
      L2[r2] = 0;
    }, fa = (t2, r2) => {
      var e3 = 0;
      return mt().forEach((n2, a2) => {
        var i2 = r2 + e3;
        E2[t2 + a2 * 4 >> 2] = i2, la(n2, i2), e3 += n2.length + 1;
      }), 0;
    }, da = (t2, r2) => {
      var e3 = mt();
      E2[t2 >> 2] = e3.length;
      var n2 = 0;
      return e3.forEach((a2) => n2 += a2.length + 1), E2[r2 >> 2] = n2, 0;
    }, ha = (t2) => 52;
    function pa(t2, r2, e3, n2, a2) {
      return 70;
    }
    var va = [null, [], []], ya = (t2, r2) => {
      var e3 = va[t2];
      r2 === 0 || r2 === 10 ? ((t2 === 1 ? kt : nt)(jr(e3)), e3.length = 0) : e3.push(r2);
    }, ma = (t2, r2, e3, n2) => {
      for (var a2 = 0, i2 = 0; i2 < e3; i2++) {
        var u2 = E2[r2 >> 2], s = E2[r2 + 4 >> 2];
        r2 += 8;
        for (var l2 = 0; l2 < s; l2++)
          ya(t2, F2[u2 + l2]);
        a2 += s;
      }
      return E2[n2 >> 2] = a2, 0;
    }, ga = (t2) => t2;
    mr = c2.InternalError = class extends Error {
      constructor(t2) {
        super(t2), this.name = "InternalError";
      }
    }, Le(), it = c2.BindingError = class extends Error {
      constructor(t2) {
        super(t2), this.name = "BindingError";
      }
    }, Ke(), un(), Ar = c2.UnboundTypeError = dn(Error, "UnboundTypeError"), gn();
    var wa = {
      t: Se,
      x: je,
      a: Me,
      j: We,
      k: Ie,
      O: Re,
      q: Be,
      ga: ke,
      d: Fe,
      ca: Ue,
      va: Ve,
      ba: He,
      pa: Ne,
      ta: hn,
      sa: vn,
      E: yn,
      oa: wn,
      F: bn,
      n: Cn,
      W: Pn,
      X: En,
      y: An,
      u: On,
      ua: Dn,
      V: Mn,
      P: Vn,
      L: Hn,
      wa: Ln,
      qa: zn,
      ja: Nn,
      T: Gn,
      xa: Jt,
      ya: Yn,
      U: ta,
      Y: ra,
      Z: ea,
      ra: na,
      da: aa,
      ha: ua,
      ea: fa,
      fa: da,
      ia: ha,
      $: pa,
      S: ma,
      J: Ua,
      C: Ha,
      Q: Pa,
      R: Ya,
      r: Ia,
      b: $a,
      D: ka,
      la: za,
      c: _a,
      ka: Na,
      h: Ta,
      i: Da,
      s: Sa,
      N: Ba,
      w: Fa,
      I: Xa,
      K: Ra,
      z: La,
      H: qa,
      aa: Ja,
      _: Ka,
      l: Aa,
      f: Ea,
      e: Ca,
      g: ba,
      M: Qa,
      m: xa,
      ma: Va,
      p: ja,
      v: Ma,
      na: Wa,
      B: Ga,
      o: Oa,
      G: Za,
      A: ga
    }, A2 = De(), Wr = (t2) => (Wr = A2.Ba)(t2), Y2 = c2._free = (t2) => (Y2 = c2._free = A2.Ca)(t2), nr = c2._malloc = (t2) => (nr = c2._malloc = A2.Ea)(t2), Ir = (t2) => (Ir = A2.Fa)(t2), m2 = (t2, r2) => (m2 = A2.Ga)(t2, r2), Rr = (t2) => (Rr = A2.Ha)(t2), Br = (t2) => (Br = A2.Ia)(t2), kr = () => (kr = A2.Ja)(), Ur = (t2) => (Ur = A2.Ka)(t2), Vr = (t2) => (Vr = A2.La)(t2), Hr = (t2, r2, e3) => (Hr = A2.Ma)(t2, r2, e3);
    c2.dynCall_viijii = (t2, r2, e3, n2, a2, i2, u2) => (c2.dynCall_viijii = A2.Na)(t2, r2, e3, n2, a2, i2, u2);
    var Lr = c2.dynCall_jiii = (t2, r2, e3, n2) => (Lr = c2.dynCall_jiii = A2.Oa)(t2, r2, e3, n2);
    c2.dynCall_jiji = (t2, r2, e3, n2, a2) => (c2.dynCall_jiji = A2.Pa)(t2, r2, e3, n2, a2);
    var zr = c2.dynCall_jiiii = (t2, r2, e3, n2, a2) => (zr = c2.dynCall_jiiii = A2.Qa)(t2, r2, e3, n2, a2);
    c2.dynCall_iiiiij = (t2, r2, e3, n2, a2, i2, u2) => (c2.dynCall_iiiiij = A2.Ra)(t2, r2, e3, n2, a2, i2, u2), c2.dynCall_iiiiijj = (t2, r2, e3, n2, a2, i2, u2, s, l2) => (c2.dynCall_iiiiijj = A2.Sa)(t2, r2, e3, n2, a2, i2, u2, s, l2), c2.dynCall_iiiiiijj = (t2, r2, e3, n2, a2, i2, u2, s, l2, f2) => (c2.dynCall_iiiiiijj = A2.Ta)(t2, r2, e3, n2, a2, i2, u2, s, l2, f2);
    function $a(t2, r2) {
      var e3 = $();
      try {
        return b(t2)(r2);
      } catch (n2) {
        if (w2(e3), n2 !== n2 + 0) throw n2;
        m2(1, 0);
      }
    }
    function ba(t2, r2, e3, n2) {
      var a2 = $();
      try {
        b(t2)(r2, e3, n2);
      } catch (i2) {
        if (w2(a2), i2 !== i2 + 0) throw i2;
        m2(1, 0);
      }
    }
    function Ca(t2, r2, e3) {
      var n2 = $();
      try {
        b(t2)(r2, e3);
      } catch (a2) {
        if (w2(n2), a2 !== a2 + 0) throw a2;
        m2(1, 0);
      }
    }
    function Ta(t2, r2, e3, n2) {
      var a2 = $();
      try {
        return b(t2)(r2, e3, n2);
      } catch (i2) {
        if (w2(a2), i2 !== i2 + 0) throw i2;
        m2(1, 0);
      }
    }
    function Pa(t2, r2, e3, n2, a2) {
      var i2 = $();
      try {
        return b(t2)(r2, e3, n2, a2);
      } catch (u2) {
        if (w2(i2), u2 !== u2 + 0) throw u2;
        m2(1, 0);
      }
    }
    function Ea(t2, r2) {
      var e3 = $();
      try {
        b(t2)(r2);
      } catch (n2) {
        if (w2(e3), n2 !== n2 + 0) throw n2;
        m2(1, 0);
      }
    }
    function _a(t2, r2, e3) {
      var n2 = $();
      try {
        return b(t2)(r2, e3);
      } catch (a2) {
        if (w2(n2), a2 !== a2 + 0) throw a2;
        m2(1, 0);
      }
    }
    function Aa(t2) {
      var r2 = $();
      try {
        b(t2)();
      } catch (e3) {
        if (w2(r2), e3 !== e3 + 0) throw e3;
        m2(1, 0);
      }
    }
    function Oa(t2, r2, e3, n2, a2, i2, u2, s, l2, f2, h2) {
      var v = $();
      try {
        b(t2)(r2, e3, n2, a2, i2, u2, s, l2, f2, h2);
      } catch (g2) {
        if (w2(v), g2 !== g2 + 0) throw g2;
        m2(1, 0);
      }
    }
    function xa(t2, r2, e3, n2, a2) {
      var i2 = $();
      try {
        b(t2)(r2, e3, n2, a2);
      } catch (u2) {
        if (w2(i2), u2 !== u2 + 0) throw u2;
        m2(1, 0);
      }
    }
    function Da(t2, r2, e3, n2, a2) {
      var i2 = $();
      try {
        return b(t2)(r2, e3, n2, a2);
      } catch (u2) {
        if (w2(i2), u2 !== u2 + 0) throw u2;
        m2(1, 0);
      }
    }
    function Sa(t2, r2, e3, n2, a2, i2) {
      var u2 = $();
      try {
        return b(t2)(r2, e3, n2, a2, i2);
      } catch (s) {
        if (w2(u2), s !== s + 0) throw s;
        m2(1, 0);
      }
    }
    function ja(t2, r2, e3, n2, a2, i2) {
      var u2 = $();
      try {
        b(t2)(r2, e3, n2, a2, i2);
      } catch (s) {
        if (w2(u2), s !== s + 0) throw s;
        m2(1, 0);
      }
    }
    function Fa(t2, r2, e3, n2, a2, i2, u2) {
      var s = $();
      try {
        return b(t2)(r2, e3, n2, a2, i2, u2);
      } catch (l2) {
        if (w2(s), l2 !== l2 + 0) throw l2;
        m2(1, 0);
      }
    }
    function Ma(t2, r2, e3, n2, a2, i2, u2, s) {
      var l2 = $();
      try {
        b(t2)(r2, e3, n2, a2, i2, u2, s);
      } catch (f2) {
        if (w2(l2), f2 !== f2 + 0) throw f2;
        m2(1, 0);
      }
    }
    function Wa(t2, r2, e3, n2, a2, i2, u2, s, l2) {
      var f2 = $();
      try {
        b(t2)(r2, e3, n2, a2, i2, u2, s, l2);
      } catch (h2) {
        if (w2(f2), h2 !== h2 + 0) throw h2;
        m2(1, 0);
      }
    }
    function Ia(t2) {
      var r2 = $();
      try {
        return b(t2)();
      } catch (e3) {
        if (w2(r2), e3 !== e3 + 0) throw e3;
        m2(1, 0);
      }
    }
    function Ra(t2, r2, e3, n2, a2, i2, u2, s, l2) {
      var f2 = $();
      try {
        return b(t2)(r2, e3, n2, a2, i2, u2, s, l2);
      } catch (h2) {
        if (w2(f2), h2 !== h2 + 0) throw h2;
        m2(1, 0);
      }
    }
    function Ba(t2, r2, e3, n2, a2, i2, u2) {
      var s = $();
      try {
        return b(t2)(r2, e3, n2, a2, i2, u2);
      } catch (l2) {
        if (w2(s), l2 !== l2 + 0) throw l2;
        m2(1, 0);
      }
    }
    function ka(t2, r2, e3, n2) {
      var a2 = $();
      try {
        return b(t2)(r2, e3, n2);
      } catch (i2) {
        if (w2(a2), i2 !== i2 + 0) throw i2;
        m2(1, 0);
      }
    }
    function Ua(t2, r2, e3, n2) {
      var a2 = $();
      try {
        return b(t2)(r2, e3, n2);
      } catch (i2) {
        if (w2(a2), i2 !== i2 + 0) throw i2;
        m2(1, 0);
      }
    }
    function Va(t2, r2, e3, n2, a2, i2, u2, s) {
      var l2 = $();
      try {
        b(t2)(r2, e3, n2, a2, i2, u2, s);
      } catch (f2) {
        if (w2(l2), f2 !== f2 + 0) throw f2;
        m2(1, 0);
      }
    }
    function Ha(t2, r2, e3, n2, a2, i2) {
      var u2 = $();
      try {
        return b(t2)(r2, e3, n2, a2, i2);
      } catch (s) {
        if (w2(u2), s !== s + 0) throw s;
        m2(1, 0);
      }
    }
    function La(t2, r2, e3, n2, a2, i2, u2, s, l2, f2) {
      var h2 = $();
      try {
        return b(t2)(r2, e3, n2, a2, i2, u2, s, l2, f2);
      } catch (v) {
        if (w2(h2), v !== v + 0) throw v;
        m2(1, 0);
      }
    }
    function za(t2, r2, e3) {
      var n2 = $();
      try {
        return b(t2)(r2, e3);
      } catch (a2) {
        if (w2(n2), a2 !== a2 + 0) throw a2;
        m2(1, 0);
      }
    }
    function Na(t2, r2, e3, n2, a2) {
      var i2 = $();
      try {
        return b(t2)(r2, e3, n2, a2);
      } catch (u2) {
        if (w2(i2), u2 !== u2 + 0) throw u2;
        m2(1, 0);
      }
    }
    function Ga(t2, r2, e3, n2, a2, i2, u2, s, l2, f2) {
      var h2 = $();
      try {
        b(t2)(r2, e3, n2, a2, i2, u2, s, l2, f2);
      } catch (v) {
        if (w2(h2), v !== v + 0) throw v;
        m2(1, 0);
      }
    }
    function Xa(t2, r2, e3, n2, a2, i2, u2, s) {
      var l2 = $();
      try {
        return b(t2)(r2, e3, n2, a2, i2, u2, s);
      } catch (f2) {
        if (w2(l2), f2 !== f2 + 0) throw f2;
        m2(1, 0);
      }
    }
    function Qa(t2, r2, e3, n2, a2, i2, u2) {
      var s = $();
      try {
        b(t2)(r2, e3, n2, a2, i2, u2);
      } catch (l2) {
        if (w2(s), l2 !== l2 + 0) throw l2;
        m2(1, 0);
      }
    }
    function Ya(t2, r2, e3, n2) {
      var a2 = $();
      try {
        return b(t2)(r2, e3, n2);
      } catch (i2) {
        if (w2(a2), i2 !== i2 + 0) throw i2;
        m2(1, 0);
      }
    }
    function qa(t2, r2, e3, n2, a2, i2, u2, s, l2, f2, h2, v) {
      var g2 = $();
      try {
        return b(t2)(r2, e3, n2, a2, i2, u2, s, l2, f2, h2, v);
      } catch (T2) {
        if (w2(g2), T2 !== T2 + 0) throw T2;
        m2(1, 0);
      }
    }
    function Za(t2, r2, e3, n2, a2, i2, u2, s, l2, f2, h2, v, g2, T2, _, S) {
      var O = $();
      try {
        b(t2)(r2, e3, n2, a2, i2, u2, s, l2, f2, h2, v, g2, T2, _, S);
      } catch (x2) {
        if (w2(O), x2 !== x2 + 0) throw x2;
        m2(1, 0);
      }
    }
    function Ja(t2, r2, e3, n2) {
      var a2 = $();
      try {
        return Lr(t2, r2, e3, n2);
      } catch (i2) {
        if (w2(a2), i2 !== i2 + 0) throw i2;
        m2(1, 0);
      }
    }
    function Ka(t2, r2, e3, n2, a2) {
      var i2 = $();
      try {
        return zr(t2, r2, e3, n2, a2);
      } catch (u2) {
        if (w2(i2), u2 !== u2 + 0) throw u2;
        m2(1, 0);
      }
    }
    var Mt, Nr;
    dt = function t2() {
      Mt || Gr(), Mt || (dt = t2);
    };
    function Gr() {
      if (J2 > 0 || !Nr && (Nr = 1, me(), J2 > 0))
        return;
      function t2() {
        var r2;
        Mt || (Mt = 1, c2.calledRun = 1, !sr && (ge(), P(c2), (r2 = c2.onRuntimeInitialized) === null || r2 === void 0 || r2.call(c2), we()));
      }
      c2.setStatus ? (c2.setStatus("Running..."), setTimeout(() => {
        setTimeout(() => c2.setStatus(""), 1), t2();
      }, 1)) : t2();
    }
    if (c2.preInit)
      for (typeof c2.preInit == "function" && (c2.preInit = [c2.preInit]); c2.preInit.length > 0; )
        c2.preInit.pop()();
    return Gr(), y2 = B2, y2;
  };
})();
function po(o2) {
  return ir(
    Bt,
    o2
  );
}
function Fo(o2) {
  return lo(
    Bt,
    o2
  );
}
async function vo(o2, d2) {
  return fo(
    Bt,
    o2,
    d2
  );
}
async function yo(o2, d2) {
  return ho(
    Bt,
    o2,
    d2
  );
}
var se = [
  ["aztec", "Aztec"],
  ["code_128", "Code128"],
  ["code_39", "Code39"],
  ["code_93", "Code93"],
  ["codabar", "Codabar"],
  ["databar", "DataBar"],
  ["databar_expanded", "DataBarExpanded"],
  ["databar_limited", "DataBarLimited"],
  ["data_matrix", "DataMatrix"],
  ["dx_film_edge", "DXFilmEdge"],
  ["ean_13", "EAN-13"],
  ["ean_8", "EAN-8"],
  ["itf", "ITF"],
  ["maxi_code", "MaxiCode"],
  ["micro_qr_code", "MicroQRCode"],
  ["pdf417", "PDF417"],
  ["qr_code", "QRCode"],
  ["rm_qr_code", "rMQRCode"],
  ["upc_a", "UPC-A"],
  ["upc_e", "UPC-E"],
  ["linear_codes", "Linear-Codes"],
  ["matrix_codes", "Matrix-Codes"]
];
var mo = [...se, ["unknown"]].map((o2) => o2[0]);
var or = new Map(
  se
);
function go(o2) {
  for (const [d2, p2] of or)
    if (o2 === p2)
      return d2;
  return "unknown";
}
function wo(o2) {
  if (ue(o2))
    return {
      width: o2.naturalWidth,
      height: o2.naturalHeight
    };
  if (ce(o2))
    return {
      width: o2.width.baseVal.value,
      height: o2.height.baseVal.value
    };
  if (le(o2))
    return {
      width: o2.videoWidth,
      height: o2.videoHeight
    };
  if (de(o2))
    return {
      width: o2.width,
      height: o2.height
    };
  if (pe(o2))
    return {
      width: o2.displayWidth,
      height: o2.displayHeight
    };
  if (fe(o2))
    return {
      width: o2.width,
      height: o2.height
    };
  if (he(o2))
    return {
      width: o2.width,
      height: o2.height
    };
  throw new TypeError(
    "The provided value is not of type '(Blob or HTMLCanvasElement or HTMLImageElement or HTMLVideoElement or ImageBitmap or ImageData or OffscreenCanvas or SVGImageElement or VideoFrame)'."
  );
}
function ue(o2) {
  var d2, p2;
  try {
    return o2 instanceof ((p2 = (d2 = o2 == null ? void 0 : o2.ownerDocument) == null ? void 0 : d2.defaultView) == null ? void 0 : p2.HTMLImageElement);
  } catch {
    return false;
  }
}
function ce(o2) {
  var d2, p2;
  try {
    return o2 instanceof ((p2 = (d2 = o2 == null ? void 0 : o2.ownerDocument) == null ? void 0 : d2.defaultView) == null ? void 0 : p2.SVGImageElement);
  } catch {
    return false;
  }
}
function le(o2) {
  var d2, p2;
  try {
    return o2 instanceof ((p2 = (d2 = o2 == null ? void 0 : o2.ownerDocument) == null ? void 0 : d2.defaultView) == null ? void 0 : p2.HTMLVideoElement);
  } catch {
    return false;
  }
}
function fe(o2) {
  var d2, p2;
  try {
    return o2 instanceof ((p2 = (d2 = o2 == null ? void 0 : o2.ownerDocument) == null ? void 0 : d2.defaultView) == null ? void 0 : p2.HTMLCanvasElement);
  } catch {
    return false;
  }
}
function de(o2) {
  try {
    return o2 instanceof ImageBitmap || Object.prototype.toString.call(o2) === "[object ImageBitmap]";
  } catch {
    return false;
  }
}
function he(o2) {
  try {
    return o2 instanceof OffscreenCanvas || Object.prototype.toString.call(o2) === "[object OffscreenCanvas]";
  } catch {
    return false;
  }
}
function pe(o2) {
  try {
    return o2 instanceof VideoFrame || Object.prototype.toString.call(o2) === "[object VideoFrame]";
  } catch {
    return false;
  }
}
function ve(o2) {
  try {
    return o2 instanceof Blob || Object.prototype.toString.call(o2) === "[object Blob]";
  } catch {
    return false;
  }
}
function $o(o2) {
  try {
    return o2 instanceof ImageData || Object.prototype.toString.call(o2) === "[object ImageData]";
  } catch {
    return false;
  }
}
function bo(o2, d2) {
  try {
    const p2 = new OffscreenCanvas(o2, d2);
    if (p2.getContext("2d") instanceof OffscreenCanvasRenderingContext2D)
      return p2;
    throw void 0;
  } catch {
    const p2 = document.createElement("canvas");
    return p2.width = o2, p2.height = d2, p2;
  }
}
async function ye(o2) {
  if (ue(o2) && !await Eo(o2))
    throw new DOMException(
      "Failed to load or decode HTMLImageElement.",
      "InvalidStateError"
    );
  if (ce(o2) && !await _o(o2))
    throw new DOMException(
      "Failed to load or decode SVGImageElement.",
      "InvalidStateError"
    );
  if (pe(o2) && Ao(o2))
    throw new DOMException("VideoFrame is closed.", "InvalidStateError");
  if (le(o2) && (o2.readyState === 0 || o2.readyState === 1))
    throw new DOMException("Invalid element or state.", "InvalidStateError");
  if (de(o2) && xo(o2))
    throw new DOMException(
      "The image source is detached.",
      "InvalidStateError"
    );
  const { width: d2, height: p2 } = wo(o2);
  if (d2 === 0 || p2 === 0)
    return null;
  const c2 = bo(d2, p2).getContext("2d");
  c2.drawImage(o2, 0, 0);
  try {
    return c2.getImageData(0, 0, d2, p2);
  } catch {
    throw new DOMException("Source would taint origin.", "SecurityError");
  }
}
async function Co(o2) {
  let d2;
  try {
    if (globalThis.createImageBitmap)
      d2 = await createImageBitmap(o2);
    else if (globalThis.Image) {
      d2 = new Image();
      let y2 = "";
      try {
        y2 = URL.createObjectURL(o2), d2.src = y2, await d2.decode();
      } finally {
        URL.revokeObjectURL(y2);
      }
    } else
      return o2;
  } catch {
    throw new DOMException(
      "Failed to load or decode Blob.",
      "InvalidStateError"
    );
  }
  return await ye(d2);
}
function To(o2) {
  const { width: d2, height: p2 } = o2;
  if (d2 === 0 || p2 === 0)
    return null;
  const y2 = o2.getContext("2d");
  try {
    return y2.getImageData(0, 0, d2, p2);
  } catch {
    throw new DOMException("Source would taint origin.", "SecurityError");
  }
}
async function Po(o2) {
  if (ve(o2))
    return await Co(o2);
  if ($o(o2)) {
    if (Oo(o2))
      throw new DOMException(
        "The image data has been detached.",
        "InvalidStateError"
      );
    return o2;
  }
  return fe(o2) || he(o2) ? To(o2) : await ye(o2);
}
async function Eo(o2) {
  try {
    return await o2.decode(), true;
  } catch {
    return false;
  }
}
async function _o(o2) {
  var d2;
  try {
    return await ((d2 = o2.decode) == null ? void 0 : d2.call(o2)), true;
  } catch {
    return false;
  }
}
function Ao(o2) {
  return o2.format === null;
}
function Oo(o2) {
  return o2.data.buffer.byteLength === 0;
}
function xo(o2) {
  return o2.width === 0 && o2.height === 0;
}
function ae(o2, d2) {
  return Do(o2) ? new DOMException(`${d2}: ${o2.message}`, o2.name) : So(o2) ? new o2.constructor(`${d2}: ${o2.message}`) : new Error(`${d2}: ${o2}`);
}
function Do(o2) {
  return o2 instanceof DOMException || Object.prototype.toString.call(o2) === "[object DOMException]";
}
function So(o2) {
  return o2 instanceof Error || Object.prototype.toString.call(o2) === "[object Error]";
}
var gt;
var Mo = class extends EventTarget {
  constructor(p2 = {}) {
    var y2;
    super();
    te(this, gt);
    try {
      const c2 = (y2 = p2 == null ? void 0 : p2.formats) == null ? void 0 : y2.filter(
        (P) => P !== "unknown"
      );
      if ((c2 == null ? void 0 : c2.length) === 0)
        throw new TypeError("Hint option provided, but is empty.");
      for (const P of c2 != null ? c2 : [])
        if (!or.has(P))
          throw new TypeError(
            `Failed to read the 'formats' property from 'BarcodeDetectorOptions': The provided value '${P}' is not a valid enum value of type BarcodeFormat.`
          );
      re(this, gt, c2 != null ? c2 : []), po().then((P) => {
        this.dispatchEvent(
          new CustomEvent("load", {
            detail: P
          })
        );
      }).catch((P) => {
        this.dispatchEvent(new CustomEvent("error", { detail: P }));
      });
    } catch (c2) {
      throw ae(
        c2,
        "Failed to construct 'BarcodeDetector'"
      );
    }
  }
  static async getSupportedFormats() {
    return mo.filter((p2) => p2 !== "unknown");
  }
  async detect(p2) {
    try {
      const y2 = await Po(p2);
      if (y2 === null)
        return [];
      let c2;
      const P = {
        tryHarder: true,
        // https://github.com/Sec-ant/barcode-detector/issues/91
        returnCodabarStartEnd: true,
        formats: Kr(this, gt).map((D2) => or.get(D2))
      };
      try {
        ve(y2) ? c2 = await vo(
          y2,
          P
        ) : c2 = await yo(
          y2,
          P
        );
      } catch (D2) {
        throw console.error(D2), new DOMException(
          "Barcode detection service unavailable.",
          "NotSupportedError"
        );
      }
      return c2.map((D2) => {
        const {
          topLeft: { x: B2, y: V2 },
          topRight: { x: R2, y: W },
          bottomLeft: { x: N2, y: H },
          bottomRight: { x: I2, y: ut }
        } = D2.position, ct = Math.min(B2, R2, N2, I2), et = Math.min(V2, W, H, ut), lt = Math.max(B2, R2, N2, I2), kt = Math.max(V2, W, H, ut);
        return {
          boundingBox: new DOMRectReadOnly(
            ct,
            et,
            lt - ct,
            kt - et
          ),
          rawValue: D2.text,
          format: go(D2.format),
          cornerPoints: [
            {
              x: B2,
              y: V2
            },
            {
              x: R2,
              y: W
            },
            {
              x: I2,
              y: ut
            },
            {
              x: N2,
              y: H
            }
          ]
        };
      });
    } catch (y2) {
      throw ae(
        y2,
        "Failed to execute 'detect' on 'BarcodeDetector'"
      );
    }
  }
};
gt = /* @__PURE__ */ new WeakMap();

// node_modules/barcode-detector/dist/es/side-effects.js
var e;
(e = globalThis.BarcodeDetector) != null || (globalThis.BarcodeDetector = Mo);

// node_modules/@yudiel/react-qr-scanner/dist/esm/index.js
function C(g2) {
  const { onClick: o2, disabled: i2, className: e3 } = g2, t2 = { cursor: i2 ? "default" : "pointer", stroke: i2 ? "grey" : "yellow", strokeLineJoin: "round", strokeLineCap: "round", strokeWidth: 1.5, ...g2.style };
  return import_react.default.createElement("svg", { onClick: i2 ? void 0 : o2, className: e3, style: t2, width: "28px", height: "28px", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, import_react.default.createElement("path", { d: "M3 3L6.00007 6.00007M21 21L19.8455 19.8221M9.74194 4.06811C9.83646 4.04279 9.93334 4.02428 10.0319 4.01299C10.1453 4 10.2683 4 10.5141 4H13.5327C13.7786 4 13.9015 4 14.015 4.01299C14.6068 4.08078 15.1375 4.40882 15.4628 4.90782C15.5252 5.00345 15.5802 5.11345 15.6901 5.33333C15.7451 5.44329 15.7726 5.49827 15.8037 5.54609C15.9664 5.79559 16.2318 5.95961 16.5277 5.9935C16.5844 6 16.6459 6 16.7688 6H17.8234C18.9435 6 19.5036 6 19.9314 6.21799C20.3077 6.40973 20.6137 6.71569 20.8055 7.09202C21.0234 7.51984 21.0234 8.0799 21.0234 9.2V15.3496M19.8455 19.8221C19.4278 20 18.8702 20 17.8234 20H6.22344C5.10333 20 4.54328 20 4.11546 19.782C3.73913 19.5903 3.43317 19.2843 3.24142 18.908C3.02344 18.4802 3.02344 17.9201 3.02344 16.8V9.2C3.02344 8.0799 3.02344 7.51984 3.24142 7.09202C3.43317 6.71569 3.73913 6.40973 4.11546 6.21799C4.51385 6.015 5.0269 6.00103 6.00007 6.00007M19.8455 19.8221L14.5619 14.5619M14.5619 14.5619C14.0349 15.4243 13.0847 16 12 16C10.3431 16 9 14.6569 9 13C9 11.9153 9.57566 10.9651 10.4381 10.4381M14.5619 14.5619L10.4381 10.4381M10.4381 10.4381L6.00007 6.00007" }));
}
function E(g2) {
  const { onClick: o2, disabled: i2, className: e3 } = g2, t2 = { cursor: i2 ? "default" : "pointer", stroke: i2 ? "grey" : "yellow", strokeLineJoin: "round", strokeLineCap: "round", strokeWidth: 1.5, ...g2.style };
  return import_react.default.createElement("svg", { onClick: i2 ? void 0 : o2, className: e3, style: t2, width: "28px", height: "28px", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, import_react.default.createElement("path", { d: "M12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13C9 14.6569 10.3431 16 12 16Z" }), import_react.default.createElement("path", { d: "M3 16.8V9.2C3 8.0799 3 7.51984 3.21799 7.09202C3.40973 6.71569 3.71569 6.40973 4.09202 6.21799C4.51984 6 5.0799 6 6.2 6H7.25464C7.37758 6 7.43905 6 7.49576 5.9935C7.79166 5.95961 8.05705 5.79559 8.21969 5.54609C8.25086 5.49827 8.27836 5.44328 8.33333 5.33333C8.44329 5.11342 8.49827 5.00346 8.56062 4.90782C8.8859 4.40882 9.41668 4.08078 10.0085 4.01299C10.1219 4 10.2448 4 10.4907 4H13.5093C13.7552 4 13.8781 4 13.9915 4.01299C14.5833 4.08078 15.1141 4.40882 15.4394 4.90782C15.5017 5.00345 15.5567 5.11345 15.6667 5.33333C15.7216 5.44329 15.7491 5.49827 15.7803 5.54609C15.943 5.79559 16.2083 5.95961 16.5042 5.9935C16.561 6 16.6224 6 16.7454 6H17.8C18.9201 6 19.4802 6 19.908 6.21799C20.2843 6.40973 20.5903 6.71569 20.782 7.09202C21 7.51984 21 8.0799 21 9.2V16.8C21 17.9201 21 18.4802 20.782 18.908C20.5903 19.2843 20.2843 19.5903 19.908 19.782C19.4802 20 18.9201 20 17.8 20H6.2C5.0799 20 4.51984 20 4.09202 19.782C3.71569 19.5903 3.40973 19.2843 3.21799 18.908C3 18.4802 3 17.9201 3 16.8Z" }));
}
function c(o2) {
  const { scanning: i2, startScanning: e3, stopScanning: t2 } = o2, [w2, a2] = (0, import_react.useState)(false);
  function n2() {
    a2(true), i2 ? t2() : e3(), setTimeout(() => a2(false), 1e3);
  }
  return import_react.default.createElement("div", { style: { bottom: 85, right: 3, position: "absolute", zIndex: 2, cursor: w2 ? "default" : "pointer" } }, i2 ? import_react.default.createElement(C, { disabled: w2, onClick: n2 }) : import_react.default.createElement(E, { disabled: w2, onClick: n2 }));
}
function h(g2) {
  const { onClick: o2, className: i2, style: e3 } = g2;
  return import_react.default.createElement("svg", { onClick: o2, width: "30px", height: "30px", viewBox: "0 0 24 24", className: i2, style: e3, xmlns: "http://www.w3.org/2000/svg" }, import_react.default.createElement("path", { strokeWidth: 0.2, stroke: "yellow", fill: "yellow", d: "M13.225 9l5.025-7h-7.972l-3.3 11h5.359l-2.452 8.648.75.364L20.374 9zm.438 3H8.322l2.7-9H16.3l-5.025 7h7.101l-6.7 8.953z" }));
}
function q(g2) {
  const { onClick: o2, className: i2, style: e3 } = g2;
  return import_react.default.createElement("svg", { onClick: o2, width: "30px", height: "30px", viewBox: "0 0 24 24", className: i2, style: e3, xmlns: "http://www.w3.org/2000/svg" }, import_react.default.createElement("path", { strokeWidth: 0.2, stroke: "yellow", fill: "yellow", d: "M14.516 15.158l.714.714-4.595 6.14-.75-.364L12.337 13H6.978L8.22 8.861l.803.803L8.322 12h3.036l1.793 1.792-1.475 5.16zm5.984 4.05L4.793 3.5l.707-.707 3.492 3.492L10.278 2h7.972l-5.025 7h7.149l-3.71 4.957 4.543 4.543zM12.707 10l3.243 3.243L18.376 10zM9.795 7.088l2.079 2.079L16.3 3h-5.278z" }));
}
function l(g2) {
  const { status: o2, scanning: i2, torchToggle: e3 } = g2;
  function t2(A2) {
    e3(A2);
  }
  return i2 && e3 ? import_react.default.createElement("div", { style: { bottom: 35, right: 3, position: "absolute", zIndex: 2, cursor: "pointer" } }, o2 ? import_react.default.createElement(q, { onClick: () => t2(false) }) : import_react.default.createElement(h, { onClick: () => t2(true) })) : null;
}
function M(g2) {
  const { onClick: o2, className: i2, disabled: e3 = false } = g2, t2 = { cursor: e3 ? "default" : "pointer", stroke: e3 ? "grey" : "yellow", fill: e3 ? "grey" : "yellow", ...g2.style };
  return import_react.default.createElement("svg", { onClick: e3 ? void 0 : o2, width: "30px", height: "30px", viewBox: "0 0 24 24", className: i2, style: t2, xmlns: "http://www.w3.org/2000/svg" }, import_react.default.createElement("path", { strokeWidth: 0.3, d: "M16.279,17.039c-1.396,1.209 -3.216,1.941 -5.206,1.941c-4.393,0 -7.96,-3.567 -7.96,-7.96c-0,-4.393 3.567,-7.96 7.96,-7.96c4.393,0 7.96,3.567 7.96,7.96c-0,2.044 -0.772,3.909 -2.04,5.319l0.165,0.165c1.194,1.194 2.388,2.388 3.583,3.582c0.455,0.456 -0.252,1.163 -0.707,0.708l-3.755,-3.755Zm1.754,-6.019c-0,-3.841 -3.119,-6.96 -6.96,-6.96c-3.842,0 -6.96,3.119 -6.96,6.96c-0,3.841 3.118,6.96 6.96,6.96c3.841,0 6.96,-3.119 6.96,-6.96Zm-7.46,0.5l-1.5,0c-0.645,0 -0.643,-1 -0,-1l1.5,0l-0,-1.5c-0,-0.645 1,-0.643 1,0l-0,1.5l1.5,0c0.645,0 0.643,1 -0,1l-1.5,0l-0,1.5c-0,0.645 -1,0.643 -1,0l-0,-1.5Z" }));
}
function G(g2) {
  const { onClick: o2, className: i2, disabled: e3 = false } = g2, t2 = { cursor: e3 ? "default" : "pointer", stroke: e3 ? "grey" : "yellow", fill: e3 ? "grey" : "yellow", ...g2.style };
  return import_react.default.createElement("svg", { onClick: e3 ? void 0 : o2, width: "30px", height: "30px", viewBox: "0 0 24 24", className: i2, style: t2, xmlns: "http://www.w3.org/2000/svg" }, import_react.default.createElement("path", { strokeWidth: 0.3, d: "M16.279,17.039c-1.396,1.209 -3.216,1.941 -5.206,1.941c-4.393,0 -7.96,-3.567 -7.96,-7.96c-0,-4.393 3.567,-7.96 7.96,-7.96c4.393,0 7.96,3.567 7.96,7.96c-0,2.044 -0.772,3.909 -2.04,5.319l0.165,0.165c1.194,1.194 2.388,2.388 3.583,3.582c0.455,0.456 -0.252,1.163 -0.707,0.708l-3.755,-3.755Zm1.754,-6.019c-0,-3.841 -3.119,-6.96 -6.96,-6.96c-3.842,0 -6.96,3.119 -6.96,6.96c-0,3.841 3.118,6.96 6.96,6.96c3.841,0 6.96,-3.119 6.96,-6.96Zm-4.96,-0.5c0.645,0 0.643,1 -0,1l-4,0c-0.645,0 -0.643,-1 -0,-1l4,0Z" }));
}
function I(g2) {
  const { scanning: i2, capabilities: e3, onZoom: t2, value: w2 } = g2;
  if (!i2 || !t2) return null;
  const a2 = (e3.max - e3.min) / 3;
  return import_react.default.createElement(import_react.Fragment, null, import_react.default.createElement("div", { style: { bottom: 130, right: 3, position: "absolute", zIndex: 2, cursor: "pointer" } }, import_react.default.createElement(G, { disabled: w2 <= e3.min, onClick: function() {
    t2(Math.max(w2 - a2, e3.min));
  } })), import_react.default.createElement("div", { style: { bottom: 180, right: 3, position: "absolute", zIndex: 2, cursor: "pointer" } }, import_react.default.createElement(M, { disabled: w2 >= e3.max, onClick: function() {
    t2(Math.min(w2 + a2, e3.max));
  } })));
}
function Y(g2) {
  const { scanning: o2, loading: i2, capabilities: e3, border: t2 = 35, onOff: w2, torch: a2, zoom: n2, startScanning: B2, stopScanning: r2 } = g2, s = "rgba(255, 0, 0, 0.5)";
  return import_react.default.createElement("div", { style: { position: "relative" } }, import_react.default.createElement("svg", { viewBox: "0 0 100 100", style: { top: 0, left: 0, zIndex: 1, boxSizing: "border-box", border: `${t2 >= 35 ? t2 : 35}px solid rgba(0, 0, 0, 0.2)` } }, i2 && import_react.default.createElement("text", { x: "50", y: "50", textAnchor: "middle", fill: "black", fontSize: "8", fontFamily: "Arial", fontWeight: "bold" }, "Loading ...", import_react.default.createElement("animate", { attributeName: "opacity", values: "0;1;0", dur: "2s", repeatCount: "indefinite" })), import_react.default.createElement("path", { fill: "none", d: "M23,0 L0,0 L0,23", stroke: s, strokeWidth: 3 }), import_react.default.createElement("path", { fill: "none", d: "M0,77 L0,100 L23,100", stroke: s, strokeWidth: 3 }), import_react.default.createElement("path", { fill: "none", d: "M77,100 L100,100 L100,77", stroke: s, strokeWidth: 3 }), import_react.default.createElement("path", { fill: "none", d: "M100,23 L100,0 77,0", stroke: s, strokeWidth: 3 })), w2 && import_react.default.createElement(c, { scanning: o2, startScanning: B2, stopScanning: r2 }), a2 && e3.torch && import_react.default.createElement(l, { scanning: o2, status: a2.status, torchToggle: a2.toggle }), n2 && e3.zoom && import_react.default.createElement(I, { scanning: o2, capabilities: e3.zoom, value: n2.value, onZoom: n2.onChange }));
}
var D = { facingMode: "environment", width: { min: 640, ideal: 720, max: 1920 }, height: { min: 640, ideal: 720, max: 1080 } };
var F = { audio: true, tracker: void 0, onOff: false, finder: true, torch: true, zoom: false };
var m = { width: "100%", height: "100%", position: "relative" };
var T = { top: 0, left: 0, width: "100%", height: "100%", display: "block", overflow: "hidden" };
var V = /* @__PURE__ */ function(A2) {
  let g2, o2 = false;
  return (...i2) => (o2 || (g2 = A2(i2), o2 = true), g2);
}(() => {
  const A2 = (0, import_utils.detectBrowser)(window);
  switch (A2.browser) {
    case "chrome":
      (0, import_getusermedia.shimGetUserMedia)(window, A2);
      break;
    case "firefox":
      (0, import_getusermedia2.shimGetUserMedia)(window, A2);
      break;
    case "safari":
      (0, import_safari_shim.shimGetUserMedia)(window, A2);
      break;
    default:
      throw new Error("Unsupported browser");
  }
});
function Q(A2, g2) {
  for (const o2 of A2) {
    const [A3, ...i2] = o2.cornerPoints;
    g2.lineWidth = 2, g2.strokeStyle = "yellow", g2.beginPath(), g2.moveTo(A3.x, A3.y);
    for (const { x: A4, y: o3 } of i2) g2.lineTo(A4, o3);
    g2.lineTo(A3.x, A3.y), g2.closePath(), g2.stroke();
  }
}
function R(A2, g2) {
  for (const o2 of A2) {
    const { boundingBox: { x: A3, y: i2, width: e3, height: t2 } } = o2;
    g2.lineWidth = 2, g2.strokeStyle = "yellow", g2.strokeRect(A3, i2, e3, t2);
  }
}
function d(A2, g2) {
  A2.forEach((A3) => {
    const { boundingBox: o2, rawValue: i2 } = A3, e3 = o2.x + o2.width / 2, t2 = o2.y + o2.height / 2, w2 = Math.max(12, 50 * o2.width / g2.canvas.width), a2 = w2;
    let n2;
    g2.font = `${w2}px sans-serif`, g2.textAlign = "left";
    try {
      n2 = JSON.stringify(JSON.parse(i2), null, 2);
    } catch (A4) {
      n2 = i2;
    }
    const B2 = n2.split("\n"), r2 = Math.max(...B2.map((A4) => g2.measureText(A4).width)), s = B2.length * a2, C2 = e3 - r2 / 2 - 10, E2 = t2 - s / 2 - 10, c2 = r2 + 20, h2 = s + 10;
    g2.beginPath(), g2.moveTo(C2 + 8, E2), g2.lineTo(C2 + c2 - 8, E2), g2.quadraticCurveTo(C2 + c2, E2, C2 + c2, E2 + 8), g2.lineTo(C2 + c2, E2 + h2 - 8), g2.quadraticCurveTo(C2 + c2, E2 + h2, C2 + c2 - 8, E2 + h2), g2.lineTo(C2 + 8, E2 + h2), g2.quadraticCurveTo(C2, E2 + h2, C2, E2 + h2 - 8), g2.lineTo(C2, E2 + 8), g2.quadraticCurveTo(C2, E2, C2 + 8, E2), g2.closePath(), g2.fillStyle = "rgba(255, 255, 0, 0.9)", g2.fill(), B2.forEach((A4, o3) => {
      const i3 = t2 + o3 * a2 - (B2.length - 1) * a2 / 2;
      let w3 = e3 - r2 / 2, n3 = 0;
      const s2 = [...A4.matchAll(/"([^"]+)":/g)], C3 = [...A4.matchAll(/:\s*("[^"]*"|\d+|true|false|null)/g)];
      s2.forEach((o4, e4) => {
        var t3, a3;
        const B3 = o4[0].replace(":", ""), r3 = A4.substring(n3, o4.index);
        if (g2.fillStyle = "black", g2.fillText(r3, w3, i3), w3 += g2.measureText(r3).width, g2.fillStyle = "blue", g2.fillText(B3, w3, i3), w3 += g2.measureText(B3).width, n3 = o4.index + B3.length, g2.fillStyle = "black", g2.fillText(": ", w3, i3), w3 += g2.measureText(": ").width, e4 < C3.length) {
          const o5 = C3[e4], B4 = A4.substring(n3, o5.index);
          g2.fillStyle = "black", g2.fillText(B4, w3, i3), w3 += g2.measureText(B4).width;
          const r4 = null !== (a3 = null === (t3 = o5[0].match(/:\s*(.*)/)) || void 0 === t3 ? void 0 : t3[1]) && void 0 !== a3 ? a3 : "";
          g2.fillStyle = "green", g2.fillText(r4, w3, i3), w3 += g2.measureText(r4).width, n3 = o5.index + o5[0].length;
        }
      }), g2.fillStyle = "black";
      const E3 = A4.substring(n3);
      g2.fillText(E3, w3, i3);
    });
  });
}
var N = "data:audio/mp3;base64,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";
var k = (A2) => A2 instanceof Date;
var f = (A2) => null == A2;
var u = (A2) => "object" == typeof A2;
var p = (A2) => !f(A2) && !Array.isArray(A2) && u(A2) && !k(A2);
var K = (A2) => f(A2) || !u(A2);
function y(A2, g2) {
  if (K(A2) || K(g2)) return A2 === g2;
  if (k(A2) && k(g2)) return A2.getTime() === g2.getTime();
  const o2 = Object.keys(A2), i2 = Object.keys(g2);
  if (o2.length !== i2.length) return false;
  for (const e3 of o2) {
    const o3 = A2[e3];
    if (!i2.includes(e3)) return false;
    if ("ref" !== e3) {
      const A3 = g2[e3];
      if (k(o3) && k(A3) || p(o3) && p(A3) || Array.isArray(o3) && Array.isArray(A3) ? !y(o3, A3) : o3 !== A3) return false;
    }
  }
  return true;
}
function L(A2) {
  if (null === A2) throw new Error("Canvas should always be defined when component is mounted.");
  const g2 = A2.getContext("2d");
  if (null === g2) throw new Error("Canvas 2D context should be non-null");
  g2.clearRect(0, 0, A2.width, A2.height);
}
function J(o2) {
  var a2;
  const { onScan: n2, constraints: B2, formats: r2 = ["qr_code"], paused: C2 = false, components: E2, children: c2, styles: h2, classNames: q2, allowMultiple: l2, scanDelay: M2, onError: G2 } = o2, I2 = (0, import_react.useRef)(null), Q2 = (0, import_react.useRef)(null), R2 = (0, import_react.useRef)(null), d2 = (0, import_react.useMemo)(() => ({ ...D, ...B2 }), [B2]), k2 = (0, import_react.useMemo)(() => ({ ...F, ...E2 }), [E2]), [f2, u2] = (0, import_react.useState)(false), [p2, K2] = (0, import_react.useState)(true), [J2, x2] = (0, import_react.useState)(d2), U = function() {
    const A2 = (0, import_react.useRef)(Promise.resolve({ type: "stop", data: {} })), o3 = (0, import_react.useRef)(null), w2 = (0, import_react.useRef)(null), [a3, n3] = (0, import_react.useState)({}), [B3, r3] = (0, import_react.useState)({}), s = (0, import_react.useCallback)(async (A3, g2) => {
      var i2, e3, t2;
      if (!window.isSecureContext) throw new Error("camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.");
      if (void 0 === (null === (i2 = null === navigator || void 0 === navigator ? void 0 : navigator.mediaDevices) || void 0 === i2 ? void 0 : i2.getUserMedia)) throw new Error("this browser has no Stream API support");
      V();
      const a4 = await navigator.mediaDevices.getUserMedia({ audio: false, video: g2 });
      void 0 !== A3.srcObject ? A3.srcObject = a4 : void 0 !== A3.mozSrcObject ? A3.mozSrcObject = a4 : window.URL.createObjectURL ? A3.src = window.URL.createObjectURL(a4) : window.webkitURL ? A3.src = window.webkitURL.createObjectURL(a4) : A3.src = a4.id, await Promise.race([A3.play(), new Promise((A4) => setTimeout(A4, 3e3)).then(() => {
        throw new Error("Loading camera stream timed out after 3 seconds.");
      })]), await new Promise((A4) => setTimeout(A4, 500));
      const [B4] = a4.getVideoTracks();
      return r3(B4.getSettings()), n3(null !== (t2 = null === (e3 = null == B4 ? void 0 : B4.getCapabilities) || void 0 === e3 ? void 0 : e3.call(B4)) && void 0 !== t2 ? t2 : {}), o3.current = a4, w2.current = B4, { type: "start", data: { videoEl: A3, stream: a4, constraints: g2 } };
    }, []), C3 = (0, import_react.useCallback)(async (A3, g2) => {
      A3.src = "", A3.srcObject = null, A3.load();
      for (const A4 of g2.getTracks()) g2.removeTrack(A4), A4.stop();
      return o3.current = null, w2.current = null, r3({}), { type: "stop", data: {} };
    }, []), E3 = (0, import_react.useCallback)(async (g2, { constraints: o4, restart: i2 = false }) => {
      if (A2.current = A2.current.then((A3) => {
        if ("start" === A3.type) {
          const { data: { videoEl: e3, stream: t2, constraints: w3 } } = A3;
          return i2 || g2 !== e3 || o4 !== w3 ? C3(e3, t2).then(() => s(g2, o4)) : A3;
        }
        return s(g2, o4);
      }), "stop" === (await A2.current).type) throw new Error("Something went wrong with the camera task queue (start task).");
    }, [s, C3]), c3 = (0, import_react.useCallback)(async () => {
      if (A2.current = A2.current.then((A3) => {
        if ("stop" === A3.type) return A3;
        const { data: { videoEl: g2, stream: o4 } } = A3;
        return C3(g2, o4);
      }), "start" === (await A2.current).type) throw new Error("Something went wrong with the camera task queue (stop task).");
    }, [C3]), h3 = (0, import_react.useCallback)(async (A3) => {
      const g2 = w2.current;
      if (!g2) throw new Error("No active video track found.");
      {
        A3.advanced && A3.advanced[0].zoom && g2.getCapabilities().torch && await g2.applyConstraints({ advanced: [{ torch: false }] }), await g2.applyConstraints(A3);
        const o4 = g2.getCapabilities(), i2 = g2.getSettings();
        n3(o4), r3(i2);
      }
    }, []);
    return (0, import_react.useEffect)(() => () => {
      (async () => {
        await c3();
      })();
    }, [c3]), { capabilities: a3, settings: B3, startCamera: E3, stopCamera: c3, updateConstraints: h3 };
  }(), { startScanning: W, stopScanning: Z } = function(A2) {
    const { videoElementRef: g2, onScan: o3, onFound: w2, retryDelay: a3 = 100, scanDelay: n3 = 0, formats: B3 = [], audio: r3 = true, allowMultiple: C3 = false } = A2, E3 = (0, import_react.useRef)(new Mo({ formats: B3 })), c3 = (0, import_react.useRef)(null), h3 = (0, import_react.useRef)(null);
    (0, import_react.useEffect)(() => {
      E3.current = new Mo({ formats: B3 });
    }, [B3]), (0, import_react.useEffect)(() => {
      "undefined" != typeof window && r3 && (c3.current = new Audio(N));
    }, [r3]);
    const q3 = (0, import_react.useCallback)((A3) => async (i2) => {
      if (null !== g2.current && g2.current.readyState > 1) {
        const { lastScan: e3, contentBefore: t2, lastScanHadContent: B4 } = A3;
        if (i2 - e3 < a3) h3.current = window.requestAnimationFrame(q3(A3));
        else {
          const e4 = await E3.current.detect(g2.current), a4 = e4.some((A4) => !t2.includes(A4.rawValue)), s = e4.length > 0;
          let l3 = A3.lastOnScan;
          (a4 || C3 && s && i2 - l3 >= n3) && (r3 && c3.current && c3.current.paused && c3.current.play().catch((A4) => console.error("Error playing the sound", A4)), l3 = i2, o3(e4)), s && w2(e4), !s && B4 && w2(e4);
          const M3 = { lastScan: i2, lastOnScan: l3, lastScanHadContent: s, contentBefore: a4 ? e4.map((A4) => A4.rawValue) : t2 };
          h3.current = window.requestAnimationFrame(q3(M3));
        }
      }
    }, [g2.current, o3, w2, a3]);
    return { startScanning: (0, import_react.useCallback)(() => {
      const A3 = performance.now(), g3 = { lastScan: A3, lastOnScan: A3, contentBefore: [], lastScanHadContent: false };
      h3.current = window.requestAnimationFrame(q3(g3));
    }, [q3]), stopScanning: (0, import_react.useCallback)(() => {
      null !== h3.current && (window.cancelAnimationFrame(h3.current), h3.current = null);
    }, []) };
  }({ videoElementRef: I2, onScan: n2, onFound: (A2) => function(A3, g2, o3, i2) {
    const e3 = o3;
    if (null == e3) throw new Error("onFound handler should only be called when component is mounted. Thus tracking canvas is always defined.");
    const t2 = g2;
    if (null == t2) throw new Error("onFound handler should only be called when component is mounted. Thus video element is always defined.");
    if (0 === A3.length || void 0 === i2) L(e3);
    else {
      const g3 = t2.offsetWidth, o4 = t2.offsetHeight, w2 = t2.videoWidth, a3 = t2.videoHeight, n3 = Math.max(g3 / w2, o4 / a3), B3 = w2 * n3, r3 = a3 * n3, s = B3 / w2, C3 = r3 / a3, E3 = (g3 - B3) / 2, c3 = (o4 - r3) / 2, h3 = ({ x: A4, y: g4 }) => ({ x: Math.floor(A4 * s), y: Math.floor(g4 * C3) }), q3 = ({ x: A4, y: g4 }) => ({ x: Math.floor(A4 + E3), y: Math.floor(g4 + c3) }), l3 = A3.map((A4) => {
        const { boundingBox: g4, cornerPoints: o5 } = A4, { x: i3, y: e4 } = q3(h3({ x: g4.x, y: g4.y })), { x: t3, y: w3 } = h3({ x: g4.width, y: g4.height });
        return { ...A4, cornerPoints: o5.map((A5) => q3(h3(A5))), boundingBox: DOMRectReadOnly.fromRect({ x: i3, y: e4, width: t3, height: w3 }) };
      });
      e3.width = t2.offsetWidth, e3.height = t2.offsetHeight;
      const M3 = e3.getContext("2d");
      if (null === M3) throw new Error("onFound handler should only be called when component is mounted. Thus tracking canvas 2D context is always defined.");
      i2(l3, M3);
    }
  }(A2, I2.current, R2.current, k2.tracker), formats: r2, audio: k2.audio, allowMultiple: l2, retryDelay: void 0 === k2.tracker ? 500 : 10, scanDelay: M2 });
  (0, import_react.useEffect)(() => (u2(true), () => {
    u2(false);
  }), []), (0, import_react.useEffect)(() => {
    f2 && (Z(), W());
  }, [null == E2 ? void 0 : E2.tracker]), (0, import_react.useEffect)(() => {
    if (!y(d2, J2)) {
      const A2 = d2;
      (null == B2 ? void 0 : B2.deviceId) && delete A2.facingMode, x2(A2);
    }
  }, [B2]);
  const v = (0, import_react.useMemo)(() => ({ constraints: J2, shouldStream: f2 && !C2 }), [J2, f2, C2]), b = async () => {
    const A2 = I2.current;
    if (null == A2) throw new Error("Video should be defined when component is mounted.");
    const g2 = Q2.current;
    if (null == g2) throw new Error("Canvas should be defined when component is mounted.");
    const o3 = g2.getContext("2d");
    if (null == o3) throw new Error("Canvas should be defined when component is mounted.");
    if (v.shouldStream) {
      await U.stopCamera(), K2(false);
      try {
        await U.startCamera(A2, v), A2 ? K2(true) : await U.stopCamera();
      } catch (A3) {
        null == G2 || G2(A3), console.error("error", A3);
      }
    } else g2.width = A2.videoWidth, g2.height = A2.videoHeight, o3.drawImage(A2, 0, 0, A2.videoWidth, A2.videoHeight), await U.stopCamera(), K2(false);
  };
  (0, import_react.useEffect)(() => {
    (async () => {
      await b();
    })();
  }, [v]);
  const O = (0, import_react.useMemo)(() => v.shouldStream && p2, [v.shouldStream, p2]);
  return (0, import_react.useEffect)(() => {
    if (O) {
      if (void 0 === Q2.current) throw new Error("shouldScan effect should only be triggered when component is mounted. Thus pause frame canvas is defined");
      if (L(Q2.current), void 0 === R2.current) throw new Error("shouldScan effect should only be triggered when component is mounted. Thus tracking canvas is defined");
      L(R2.current);
      const A2 = I2.current;
      if (null == A2) throw new Error("shouldScan effect should only be triggered when component is mounted. Thus video element is defined");
      W();
    }
  }, [O]), import_react.default.createElement("div", { style: { ...m, ...null == h2 ? void 0 : h2.container }, className: null == q2 ? void 0 : q2.container }, import_react.default.createElement("video", { ref: I2, style: { ...T, ...null == h2 ? void 0 : h2.video, visibility: C2 ? "hidden" : "visible" }, className: null == q2 ? void 0 : q2.video, autoPlay: true, muted: true, playsInline: true }), import_react.default.createElement("canvas", { ref: Q2, style: { display: C2 ? "block" : "none", position: "absolute", top: 0, left: 0, width: "100%" } }), import_react.default.createElement("canvas", { ref: R2, style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" } }), import_react.default.createElement("div", { style: { top: 0, left: 0, position: "absolute", width: "100%", height: "100%" } }, k2.finder && import_react.default.createElement(Y, { scanning: p2, capabilities: U.capabilities, loading: false, onOff: k2.onOff, zoom: k2.zoom && U.settings.zoom ? { value: U.settings.zoom, onChange: async (A2) => {
    const g2 = { ...J2, advanced: [{ zoom: A2 }] };
    await U.updateConstraints(g2);
  } } : void 0, torch: k2.torch ? { status: null !== (a2 = U.settings.torch) && void 0 !== a2 && a2, toggle: async (A2) => {
    const g2 = { ...J2, advanced: [{ torch: A2 }] };
    await U.updateConstraints(g2);
  } } : void 0, startScanning: async () => await b(), stopScanning: async () => {
    await U.stopCamera(), L(R2.current), K2(false);
  }, border: null == h2 ? void 0 : h2.finderBorder }), c2));
}
function x() {
  const [A2, o2] = (0, import_react.useState)([]);
  return (0, import_react.useEffect)(() => {
    (async () => {
      o2(await async function() {
        return (await navigator.mediaDevices.enumerateDevices()).filter(({ kind: A3 }) => "videoinput" === A3);
      }());
    })();
  }, []), A2;
}
export {
  J as Scanner,
  R as boundingBox,
  d as centerText,
  Q as outline,
  Fo as setZXingModuleOverrides,
  x as useDevices
};
//# sourceMappingURL=@yudiel_react-qr-scanner.js.map
