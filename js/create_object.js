'use strict';

function createElement() {
	var body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.querySelector('body');
	var _ref = arguments[1];
	var _ref$type = _ref.type,
	    type = _ref$type === undefined ? 'div' : _ref$type,
	    text = _ref.text,
	    html_text = _ref.html_text,
	    attr = _ref.attr,
	    _ref$generate = _ref.generate,
	    generate = _ref$generate === undefined ? true : _ref$generate,
	    save_name = _ref.save_name,
	    on = _ref.on,
	    elements = _ref.elements;

	var _elements = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	create(body, {
		type: type,
		text: text,
		html_text: html_text,
		attr: attr,
		generate: generate,
		save_name: save_name,
		on: on,
		elements: elements
	}, _elements);

	return _elements;
}

function create() {
	var body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.querySelector('body');
	var _ref2 = arguments[1];
	var _ref2$type = _ref2.type,
	    type = _ref2$type === undefined ? 'div' : _ref2$type,
	    text = _ref2.text,
	    html_text = _ref2.html_text,
	    attr = _ref2.attr,
	    _ref2$generate = _ref2.generate,
	    generate = _ref2$generate === undefined ? true : _ref2$generate,
	    save_name = _ref2.save_name,
	    on = _ref2.on,
	    elements = _ref2.elements;

	var _el = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	if (generate) {
		var elem = document.createElement(type);

		if (text) elem.innerText = text;
		if (html_text) elem.innerHTML = html_text;

		if (attr) {
			Object.keys(attr).forEach(function (key) {
				elem.setAttribute(key, attr[key]);
			});
		}

		if (save_name) {
			_el[save_name] = elem;
		}

		if (on) {
			Object.keys(on).forEach(function (event) {
				return elem.addEventListener(event, function (e) {
					return on[event](e);
				});
			});
		}

		if (elements) {
			if (!(elements instanceof Array)) elements = [elements];
			elements.forEach(function (el) {
				create(elem, el, _el);
			});
		}

		body.appendChild(elem);
	}
}