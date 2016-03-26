(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.testsEs6 = mod.exports;
  }
})(this, function () {
  "use strict";

  var _templateObject = _taggedTemplateLiteral(["\n    <div>\n      <h1>Greetings</h1>", "\n    </div>\n  "], ["\n    <div>\n      <h1>Greetings</h1>", "\n    </div>\n  "]),
      _templateObject2 = _taggedTemplateLiteral(["<h1>Greetings</h1>", ""], ["<h1>Greetings</h1>", ""]),
      _templateObject3 = _taggedTemplateLiteral(["\n    <div>\n      ", "\n    </div>\n  "], ["\n    <div>\n      ", "\n    </div>\n  "]),
      _templateObject4 = _taggedTemplateLiteral(["\n    <div>\n      ...\n      <div class=\"js-insertUserText\">", "</div>\n      ...\n    </div>\n  "], ["\n    <div>\n      ...\n      <div class=\"js-insertUserText\">", "</div>\n      ...\n    </div>\n  "]),
      _templateObject5 = _taggedTemplateLiteral(["\n    <div>\n      ...\n      ", "\n      ...\n    </div>\n  "], ["\n    <div>\n      ...\n      ", "\n      ...\n    </div>\n  "]),
      _templateObject6 = _taggedTemplateLiteral(["\n    <div data-name=\"", "\"></div>\n  "], ["\n    <div data-name=\"", "\"></div>\n  "]),
      _templateObject7 = _taggedTemplateLiteral(["<div data-name=\"", "\"></div>"], ["<div data-name=\"", "\"></div>"]);

  function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw)
      }
    }));
  }

  // these tests will not pass if you browser doesn't allow
  QUnit.test("template works as expected as shown in doc examples", function (assert) {
    var _jQTemplate = jQTemplate;
    var
    // Properly adds jQuery elements.

    template = _jQTemplate.template;


    var $message = $("<div>Hello World</div>");

    var $result = template(_templateObject, $message);

    //$result is a jQuery object with HTML content equivalent to:

    var $sameResult = $("\n    <div>\n      <h1>Greetings</h1><div>Hello World</div>\n    </div>\n  ");

    // since templates return jQuery objects they can also be nested in each other. The following also has equivelent HTML:

    var $greetingEl = template(_templateObject2, $message.clone());

    var $equivalentResult = template(_templateObject3, $greetingEl);
    console.log($greetingEl);
    console.log($sameResult.html());
    console.log($equivalentResult.html());
    console.log($result.html());
    assert.ok($result.html() == $sameResult.html() && $result.html() == $equivalentResult.html(), "Properly adds jQuery elements.");

    // Properly adds text nodes.

    var userText = "something dangerous!!!";

    // create new element
    $result = $("\n    <div>\n      ...\n      <div class=\"js-insertUserText\"></div>\n      ...\n    </div>\n  ");

    // insert user text
    var textNode = document.createTextNode(userText);
    $result.find(".js-insertUserText").append(textNode);

    $sameResult = template(_templateObject4, jQTemplate.textNode(userText));

    assert.ok($result.html() == $sameResult.html(), "Properly adds text nodes.");

    // Basic DOM node works properly.

    var userText = "something dangerous!!!";

    // create new element
    $result = $("\n    <div>\n      ...\n      <div></div>\n      ...\n    </div>\n  ");

    $sameResult = jQTemplate.template(_templateObject5, document.createElement("div"));

    assert.ok($result.html() == $sameResult.html(), "Basic DOM node works properly.");
  });

  QUnit.test("textNode works as expected", function (assert) {
    assert.ok(jQTemplate.textNode("hello").outerHTML === document.createTextNode("hello").outerHTML, "simple textNode creation");
  });

  QUnit.test("htmlNode works as expected", function (assert) {
    assert.ok('<h1></h1>' == jQTemplate.htmlNode("h1").outerHTML, "basic h1 works properly.");
    assert.ok('<h1 class="true">world</h1>' == jQTemplate.htmlNode("h1", "world", { class: "true" }).outerHTML, "basic h1 with text and attributes.");
    assert.ok('<h1 data-action="true"></h1>' == jQTemplate.htmlNode("h1", { "data-action": "true" }).outerHTML, "basic h1 with data-attributes no text w/ skipping of second param.");
    var callback = sinon.spy();

    var node = jQTemplate.htmlNode("h1", { onclick: callback });

    $(node).trigger("click");

    assert.ok(callback.calledOnce, "onclick attribute fires.");
    // ...or:
    // assert.ok(callback.callCount === 1);
  });

  QUnit.test("addEvents works as expected", function (assert) {
    var callback = sinon.spy();

    var $el = $("<h1>");

    jQTemplate.addEvents($el, {
      click: callback,
      mouseenter: callback
    });

    $el.trigger("click");
    $el.trigger("mouseenter");

    assert.ok(callback.callCount === 2, "Multiple events can be registered.");

    callback = sinon.spy();

    $el = $("<h1>");

    jQTemplate.addEvents($el, {
      customEvent: callback
    });

    $el.trigger("customEvent");

    assert.ok(callback.calledOnce, "Custom events can be registered.");

    callback = sinon.spy();

    var el = document.createElement("h1");

    jQTemplate.addEvents(el, {
      customEvent: callback
    });

    $(el).trigger("customEvent");

    assert.ok(callback.calledOnce, "Can be used on DOM nodes.");

    callback = sinon.spy();

    var el = document.createElement("h1");

    jQTemplate.addEvents(el, {
      customEvent: callback
    });

    el.dispatchEvent(new Event("customEvent"));

    assert.ok(callback.calledOnce, "Can be used with dispatchEvent.");
  });

  QUnit.test("simpleEscape works as expected", function (assert) {
    var _jQTemplate2 = jQTemplate;
    var template = _jQTemplate2.template;
    var simpleEscape = _jQTemplate2.simpleEscape;

    var userText = '"><script>window.callback(); // malicous code could be here</script><div class="';
    window.callback = sinon.spy();

    template(_templateObject6, userText).appendTo("body");

    assert.ok(window.callback.called, "user script is called when escape is not called");

    window.callback = sinon.spy();

    template(_templateObject7, simpleEscape(userText)).appendTo("body");

    assert.ok(!window.callback.called, "escaped user script isn't ran");
  });
});