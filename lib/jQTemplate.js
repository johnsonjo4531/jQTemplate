(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "jQuery"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("jQuery"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.jQuery);
    global.jQTemplate = mod.exports;
  }
})(this, function (exports, _jQuery) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.addEvents = exports.simpleEscape = exports.htmlNode = exports.textNode = exports.template = undefined;

  var _jQuery2 = _interopRequireDefault(_jQuery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  if (!Object.entries) {
    Object.entries = function (obj) {
      return Object.keys(obj).map(function (key) {
        return [key, obj[key]];
      });
    };
  }

  if (!Array.isArray) {
    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  }

  function simpleEscape(str) {
    var __entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;',
      "/": '&#x2F;'
    };

    return str.replace(/[&<>"'\/]/g, function (s) {
      return __entityMap[s];
    });
  }

  var tempFiller = function tempFiller(key) {
    return "<div id='jQT-jQTemplate-tempFiller-" + key + "'></div>";
  };

  var template = function template(strings) {
    for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      values[_key - 1] = arguments[_key];
    }

    //var $docFrag = $(document.createDocumentFragment());
    var elIndexes = [];
    var html = "";
    for (var i = 0; i < strings.length; ++i) {
      html += strings[i];

      var value = values[i];
      var allNodes = Array.isArray(value) && value.every(function (el) {
        return el instanceof Node || el instanceof jQuery;
      });
      if (value) {
        if (value instanceof Node || value instanceof jQuery || allNodes) {
          elIndexes.push(i);
          html += tempFiller(i);
        } else if (value) {
          html += value; // || '';
        }
      }
    }
    var $el = (0, _jQuery2.default)(html);
    elIndexes.forEach(function (i) {
      var value = values[i];
      var selectorStr = "#jQT-jQTemplate-tempFiller-" + i;
      $el.find(selectorStr).replaceWith(value);
      $el = (0, _jQuery2.default)().add($el.map(function () {
        return (0, _jQuery2.default)(this).is(selectorStr) ? [].concat(_toConsumableArray(value)) : this;
      }));
    });

    return $el;
  };

  var fromCamelToKabobCase = function fromCamelToKabobCase(str) {
    return str.replace(/([A-Z])/g, "-$1").toLowerCase();
  };

  var textNode = function textNode(text) {
    return document.createTextNode(text);
  };

  var partition = function partition(list, cb) {
    if (typeof cb === "function") {
      var i;

      var _ret = function () {
        var results = [];
        results.push([]);
        results.push([]);

        var testPassing = function testPassing(condition, val) {
          if (condition) {
            results[0].push(val);
          } else {
            results[1].push(val);
          }
        };

        if ((typeof list === "undefined" ? "undefined" : _typeof(list)) === "object" && !Array.isArray(list)) {
          Object.keys(list).forEach(function (key) {
            var obj = {};
            obj[key] = list[key];
            testPassing(cb(list[key], key, list), obj);
          });
        } else {
          for (i = 0; i < list.length; ++i) {
            testPassing(cb(list[i], i, list), list[i]);
          }
        }
        return {
          v: results
        };
      }();

      if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
    }
  };

  // similar to hyper script
  var htmlNode = function htmlNode(tagName) {
    var text = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];
    var attributes = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    if (typeof tagName === "string") {
      if ((typeof text === "undefined" ? "undefined" : _typeof(text)) === "object" && !Array.isArray(text)) {
        attributes = text;
        text = "";
      }
      var elNode = document.createElement(tagName);
      elNode.appendChild(document.createTextNode(text));
      var style;
      if (attributes.style && _typeof(attributes.style) === "object") {
        var style = attributes.style;
        delete attributes.style;
        var styleString = Object.keys(style).map(function (key) {
          return fromCamelToKabobCase(key) + ": " + style[key] + ";";
        });
        elNode.setAttribute("style", styleString);
      }

      var _partition = partition(Object.entries(attributes), function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2);

        var key = _ref6[0];
        var val = _ref6[1];

        return (/^on/.test(key)
        );
      });

      var _partition2 = _slicedToArray(_partition, 2);

      var events = _partition2[0];
      var attributes = _partition2[1];

      attributes.forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var key = _ref2[0];
        var val = _ref2[1];

        try {
          elNode.setAttribute(key, val);
        } catch (e) {
          console.warn(e);
        }
      });
      events.forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2);

        var key = _ref4[0];
        var val = _ref4[1];

        if (typeof val === "function") {
          (0, _jQuery2.default)(elNode).on(key.replace(/^on/, ""), val);
        } else {
          console.warn(key + " property does not have a function for a value");
        }
      });

      return elNode;
    } else {
      console.warn("Must provide atleast first argument. The first argument is the element type.");
    }
  };

  var addEvents = function addEvents($el, events) {
    if (!($el instanceof EventTarget || $el instanceof jQuery)) {
      throw new Error("First argument '$el' must be an EventTarget or jQuery object");
    }
    if ((typeof events === "undefined" ? "undefined" : _typeof(events)) === "object" && !Array.isArray(events)) {
      events = Object.entries(events);
    }
    if (Array.isArray(events) && events.every(function (el) {
      return Array.isArray(el) && el.length === 2;
    })) {
      events.forEach(function (_ref7) {
        var _ref8 = _slicedToArray(_ref7, 2);

        var eventType = _ref8[0];
        var cb = _ref8[1];

        if (typeof cb === "function") {
          if ($el instanceof jQuery) {
            $el.on(eventType, cb);
          } else {
            (0, _jQuery2.default)($el).on(eventType, cb);
          }
        } else {
          console.warn("Value of " + eventType + " is not a function");
        }
      });
    } else {
      throw new Error("Second argument 'events' must be an object or a 2 dimensional array with inner arrays of length 2");
    }
    return $el;
  };

  exports.template = template;
  exports.textNode = textNode;
  exports.htmlNode = htmlNode;
  exports.simpleEscape = simpleEscape;
  exports.addEvents = addEvents;
});