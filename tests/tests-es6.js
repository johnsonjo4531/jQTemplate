// these tests will not pass if you browser doesn't allow
QUnit.test( "template works as expected as shown in doc examples", function( assert ) {
  // Properly adds jQuery elements.

  var {template, htmlNode} = jQTemplate;

  var $message = $("<div>Hello World</div>");

  var $result = template`
    <div>
      <h1>Greetings</h1>${$message}
    </div>
  `;

//$result is a jQuery object with HTML content equivalent to:

  var $sameResult = $(`
    <div>
      <h1>Greetings</h1><div>Hello World</div>
    </div>
  `);

// since templates return jQuery objects they can also be nested in each other. The following also has equivelent HTML:

  var $greetingEl = template`<h1>Greetings</h1>${$message.clone()}`;

  var $equivalentResult = template`
    <div>
      ${$greetingEl}
    </div>
  `;
  console.log($greetingEl);
  console.log($sameResult.html());
  console.log($equivalentResult.html());
  console.log($result.html());
  assert.ok($result.html() == $sameResult.html() && $result.html() == $equivalentResult.html(), "Properly adds jQuery elements." );

  $equivalentResult = template`
    <div>
      ${$("<h1>Greetings</h1>")}${$("<div>Hello World</div>")}
    </div>
  `;

  assert.ok($result.html() == $equivalentResult.html(), "Properly adds multiple placeholders and jQuery elements." );

  // Properly adds text nodes.

  var userText = "something dangerous!!!";

  // create new element
  $result = $(`
    <div>
      ...
      <div class="js-insertUserText"></div>
      ...
    </div>
  `);

  // insert user text
  var textNode = document.createTextNode(userText);
  $result.find(".js-insertUserText").append(textNode);

  $sameResult = template`
    <div>
      ...
      <div class="js-insertUserText">${jQTemplate.textNode(userText)}</div>
      ...
    </div>
  `;

  assert.ok( $result.html() == $sameResult.html(), "Properly adds text nodes." );

  // Basic DOM node works properly.

  var userText = "something dangerous!!!";

  // create new element
  $result = $(`
    <div>
      ...
      <div></div>
      ...
    </div>
  `);

  $sameResult = jQTemplate.template`
    <div>
      ...
      ${document.createElement("div")}
      ...
    </div>
  `;

  assert.ok( $result.html() == $sameResult.html(), "Basic DOM node works properly." );

  var userTexts = ["hello", "world", "something interesting"];

  $result = $(`
    <ul>
      <li class="li-0"></li><li class="li-1"></li><li class="li-2"></li>
    </ul>
  `);

  userTexts.forEach(function (el, i) {
    $result.find(`.li-${i}`).append(document.createTextNode(el));
  })

  $sameResult = template`
    <ul>
      ${userTexts.map(function (el, i) {
        return template`<li class="li-${i}">${document.createTextNode(el)}</li>`;
      })}
    </ul>
  `;
  assert.ok( $result.html() == $sameResult.html(), "Array of jQuery nodes works properly." );

  $equivalentResult = template`
    <ul>
      ${userTexts.map(function (el, i) {
        return htmlNode('li', el, {class: `li-${i}`});
      })}
    </ul>
  `;
  assert.ok( $result.html() == $equivalentResult.html(), "Array of DOM nodes works properly." );

  $equivalentResult = template`
    <ul>
      ${userTexts.map(function (el, i) {
        if(i % 2 === 0) {
          return template`<li class="li-${i}">${document.createTextNode(el)}</li>`;
        } else {
          return htmlNode('li', el, {class: `li-${i}`});
        }
      })}
    </ul>
  `;
  assert.ok( $result.html() == $equivalentResult.html(), "Polymorphic array of DOM nodes and jQuery objects works properly." );
});

QUnit.test( "textNode works as expected", function( assert ) {
  assert.ok(jQTemplate.textNode("hello").outerHTML === document.createTextNode("hello").outerHTML, "simple textNode creation")
});


QUnit.test( "htmlNode works as expected", function( assert ) {
  assert.ok( '<h1></h1>' == jQTemplate.htmlNode("h1").outerHTML, "basic h1 works properly." );
  assert.ok( '<h1 class="true">world</h1>' == jQTemplate.htmlNode("h1", "world", {class: "true" }).outerHTML, "basic h1 with text and attributes." );
  assert.ok( '<h1 data-action="true"></h1>' == jQTemplate.htmlNode("h1", {"data-action": "true" }).outerHTML, "basic h1 with data-attributes no text w/ skipping of second param." );
  assert.ok( '<h1 style="padding: 10px; margin: 10px; line-height: 1em;"></h1>' == jQTemplate.htmlNode("h1", {style: "padding: 10px; margin: 10px; line-height: 1em;" }).outerHTML, "basic h1 with style attribute string." );
  assert.ok( '<h1 style="padding: 10px; margin: 10px; line-height: 1em;"></h1>' == jQTemplate.htmlNode("h1", {style: {padding: "10px", margin: "10px", lineHeight: "1em"} }).outerHTML, "basic h1 with style attributes object." );
  assert.ok( '<h1 style="padding: 10px; margin: 10px; line-height: 1em;"></h1>' == jQTemplate.htmlNode("h1", {style: {padding: "10px", margin: "10px", "line-height": "1em"} }).outerHTML, "basic h1 with style attributes object no camel case." );

  var callback = sinon.spy();

  var node = jQTemplate.htmlNode("h1", {onclick: callback});

  $(node).trigger("click");

  assert.ok(callback.calledOnce, "onclick attribute fires.");
  // ...or:
  // assert.ok(callback.callCount === 1);
});

QUnit.test( "addEvents works as expected", function( assert ) {
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

QUnit.test( "simpleEscape works as expected", function( assert ) {
  var {template, simpleEscape} = jQTemplate;
  var userText = '"><script>window.callback(); // malicous code could be here</script><div class="';
  window.callback = sinon.spy();


  template`
    <div data-name="${userText}"></div>
  `.appendTo("body");

  assert.ok(window.callback.called, "user script is called when escape is not called");


  window.callback = sinon.spy();

  template`<div data-name="${simpleEscape(userText)}"></div>`.appendTo("body");

  assert.ok(!window.callback.called, "escaped user script isn't ran");
});
