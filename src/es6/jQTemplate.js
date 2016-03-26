import $ from "jQuery";

if(!Object.entries) {
  Object.entries = function (obj) {
    return Object.keys(obj).map(function (key) {
      return [key, obj[key]];
    });
  }
}

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

function simpleEscape (str) {
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

var tempFiller = function tempFiller (key) {
  return `<div id='jQT-jQTemplate-tempFiller-${key}'></div>`;
};

var template = function template (strings, ...values) {
    //var $docFrag = $(document.createDocumentFragment());
    var elIndexes = [];
    var html = "";
  for(let i = 0; i < strings.length; ++i) {
    html += strings[i];

    var value = values[i];
    var allNodes = Array.isArray(value) && value.every(el=>el instanceof Node || el instanceof jQuery)
    if(value || value === 0) {
      if(value instanceof Node || value instanceof jQuery || allNodes) {
        elIndexes.push(i);
        html += tempFiller(i);
      } else {
        html += value;// || '';
      }
    }
  }
  var $el = $(html);
  elIndexes.forEach(function (i) {
    var value = values[i];
    var selectorStr = `#jQT-jQTemplate-tempFiller-${i}`;
    $el.find(selectorStr).replaceWith(value);
    $el = $().add($el.map(function () {
      return $(this).is(selectorStr) ? [...value] : this;
    }));
  });

  return $el;
};

var fromCamelToKabobCase = str => str.replace(/([A-Z])/g, "-$1").toLowerCase();

var textNode = (text) => document.createTextNode(text);

var partition = function partition (list,cb) {
  if(typeof cb === "function") {
      let results = [];
      results.push([]);
      results.push([]);

      let testPassing = function (condition, val) {
        if(condition) {
          results[0].push(val);
        } else {
          results[1].push(val);
        }
      }


    if(typeof list === "object" && !Array.isArray(list)) {
      Object.keys(list).forEach(function (key) {
        var obj = {};
        obj[key] = list[key];
        testPassing(cb(list[key], key, list), obj);
      });
    } else {
      for(var i = 0; i < list.length; ++i) {
        testPassing(cb(list[i], i, list), list[i]);
      }
    }
    return results;
  }
}

// similar to hyper script
var htmlNode = function htmlNode (tagName, text = "", attributes = {}) {
  if(typeof tagName === "string") {
    if(typeof text === "object" && !Array.isArray(text)) {
      attributes = text;
      text = "";
    }
    var elNode = document.createElement(tagName);
    elNode.appendChild(document.createTextNode(text));
    var style;
    if(attributes.style && typeof attributes.style === "object") {
      var style = attributes.style;
      delete attributes.style;
      var styleString = Object.keys(style).map(function (key) {
        return `${fromCamelToKabobCase(key)}: ${style[key]};`;
      }).join(" ");
      elNode.setAttribute("style", styleString);
    }
    var [events, attributes] = partition(Object.entries(attributes), function ([key, val]) {
      return /^on/.test(key);
    });
    attributes.forEach(function ([key, val]) {
      try {
        elNode.setAttribute(key, val);
      } catch (e) {
        console.warn(e);
      }
    });
    events.forEach(function ([key, val]) {
      if (typeof val === "function") {
        $(elNode).on(key.replace(/^on/, ""), val);
      } else {
        console.warn(key + " property does not have a function for a value");
      }
    });

    return elNode;
  } else {
    console.warn("Must provide atleast first argument. The first argument is the element type.");
  }
};

var addEvents = ($el,events) => {
  if(!($el instanceof EventTarget || $el instanceof jQuery)) {
    throw new Error("First argument '$el' must be an EventTarget or jQuery object");
  }
  if(typeof events === "object" && !Array.isArray(events)) {
    events = Object.entries(events);
  }
  if (Array.isArray(events) && events.every(el => Array.isArray(el) && el.length === 2)) {
    events.forEach(function ([eventType, cb]) {
      if(typeof cb === "function") {
        if($el instanceof jQuery) {
          $el.on(eventType, cb);
        } else {
          $($el).on(eventType, cb);
        }
      } else {
        console.warn("Value of " + eventType + " is not a function");
      }
    })
  } else {
    throw new Error("Second argument 'events' must be an object or a 2 dimensional array with inner arrays of length 2");
  }
  return $el;
}

export {
  template,
  textNode,
  htmlNode,
  simpleEscape,
  addEvents
};
