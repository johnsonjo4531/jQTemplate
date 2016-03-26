# jQTemplate

What is it?
--

jQuery templating micro-library that handles nesting of DOM nodes and jQuery objects using [ES6 template strings/literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

How it works.
---
Takes a template string and converts it to a jQuery object. It is mostly a wrapper around feeding your string into the jQuery constructor and creating your elements. With the exception that all placeholder values of the template string which are DOM nodes or jQuery objects will get a temporary placeholder with unique id before being fed into the jQuery constructor. After the DOM tree has been built all the unique id'ed elements will be replaced with their corresponding DOM node or jQuery element.

Quick example:

    var $message = $("<div>Hello World</div>");

    var $result = jQTemplate.template`
      <div>
        ${$message}
      </div>
    `;

`$result` is a jQuery object with HTML content. It is equivalent to:

    var $sameResult = $(`
      <div>
        <div>Hello World</div>
      </div>
    `);

Why jQTemplate?
--

I found myself using the same pattern to input text nodes into html I created using jQuery and I eventually thought of something I feel is easier to handle. I also wanted something that I could just plug-in to my existing jQuery projects without having to re-write anything.

I commonly did something similar to this:

    var userText = "something dangerous!!!";

    // create new element
    var $el = $(`
      <div>
        ...
        <div class="js-insertUserText"></div>
        ...
      </div>
    `);

    // insert user text
    var textNode = document.createTextNode(userText);
    $el.find(".js-insertUserText").append(textNode);

    // insert el to DOM
    $("body").append($el);


With jQTemplate you can just do this:

    var userText = "something dangerous!!!";

    jQTemplate.template`
      <div>
        ...
        <div>${jQTemplate.textNode(userText)}</div>
        ...
      </div>
    `.appendTo("body");

What you should know about this library before you use it.
--

The main function `jQTemplate.template` is meant to be used as a ES6 [template tag function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals). There are a series of functions in the library that should be used in conjunction with the template function as any string values produced in template literal placeholders will be added as html through jQuery. Since this is unwanted for user input it is suggested that you turn your user input into text nodes when possible using either `document.createTextNode("text string")`, `jQTemplate.textNode("text string")` which is just an alias to the previous, or `jQTemplate.htmlNode("span","text string")` which wraps your given element in argument 1 around the text node it creates using the text from argument 2. Text Nodes cannot be used within the opening or closing tag of an element for this reason if you want to use something within the opening or closing you can merely escape it with `jQTemplate.simpleEscape`. For more advanced parsing and escaping I would try adding your own DOM white-listing libraries.

How do I use it?
--

jQTemplate uses the UMD module definition so it can work as: an amd module, a commonjs module, and will fall back to a global named  `jQTemplate` if neither module system is being used.

Once you have jQTemplate included you can then expose the five functions of jQTemplate to your scope quickly using ES6.

    var {template, textNode, htmlNode, simpleEscape, addEvents} = jQTemplate;

API
--

#### ``template`a template string with optional ${placeholders}`;`` OR `template(strings, ...valuesFromPlaceholders)`

Takes a template string and converts it to a jQuery object. It is mostly a wrapper around feeding your string into the jQuery constructor and creating your elements. With the exception that all placeholder values of the template string which are DOM nodes or jQuery objects will get a temporary placeholder with unique id before being fed into the jQuery constructor. After the DOM tree has been built all the unique id'ed elements will be replaced with their corresponding DOM node or jQuery element.

Quick example:

    var $message = $("<div>Hello World</div>");

    var $result = jQTemplate.template`
      <div>
        <h1>Greetings</h1>${$message}
      </div>
    `;

$result is a jQuery object with HTML content equivalent to:

    var $sameResult = $(`
      <div>
        <h1>Greetings</h1><div>Hello World</div>
      </div>
    `);

since templates return jQuery objects they can also be nested in each other. The following also has equivelent HTML:

    var $greetingEl = jQTemplate.template`<h1>Greetings</h1>${$message}`;

    var $equivalentResult = jQTemplate.template`
      <div>
        ${$greetingEl}
      </div>
    `;

#### `textNode(tagName, text = "") `
##### type signature `textNode(string)`

Just a wrapper around `document.createTextNode()`



#### `htmlNode(tagName, text = "", attributes = {}) `
##### type signature `htmlNode(string, [string, object])`
returns an element with the tag name tagName, text inserted as a text node of that element, and attributes of that element set equal to attributes.

The following are example true expressions:

    '<h1></h1>' == jQTemplate.htmlNode("h1").outerHTML;
    '<h1 class="true">world</h1>' == jQTemplate.htmlNode("h1", "world", {class: "true" }).outerHTML;
    '<h1 data-action="true"></h1>' == jQTemplate.htmlNode("h1", {"data-action": "true" }).outerHTML;

 The use of a property starting with "on" e.g. "onclick" will use jQuery's `on` method internally. The following code example shows an element when clicked will console.log "clicked".

    jQTemplate.htmlNode("h1", {onclick: function (e) { console.log("clicked"); }});

#### `simpleEscape(str) `
##### type signature `simpleEscape(string)`

Translates HTML characthers in the keys to unicode character equivalents in the values than returns the manipulated string.

    {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;',
      "/": '&#x2F;'
    }

Good for use in escaping values for HTML DOM attributes. As an example of what you shouldn't do in jQuery or the templating library:

    var {template} = jQTemplate;
    var userText = '"><script>alert("malicious code could be here.")</script>';

    template`<div data-name="${userText}"></div>`.appendTo("body");

    var {template, simpleEscape} = jQTemplate;
    var userText = '"><script>alert("malicious code could be here.")</script>';

    template`<div data-name="${simpleEscape(userText)}"></div>`.appendTo("body");



Contributing
--
Pull requests and issues welcome.


Licensing
--

The MIT License (MIT)  
Copyright (c) 2016 John Johnson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
