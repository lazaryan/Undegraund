function createElement (
	body = document.querySelector('body'),
	{
		type = 'div',
		text,
		html_text,
		attr,
		generate =  true,
		save_name,
		on,
		elements,
	},
	_elements = {}
	) {

	create(body, {
		type,
		text,
		html_text,
		attr,
		generate,
		save_name,
		on,
		elements
	}, _elements);

	return _elements;
}

function create (
	body = document.querySelector('body'),
	{
		type = 'div',
		text,
		html_text,
		attr,
		generate =  true,
		save_name,
		on,
		elements,
	},
	 _el = {}
	 ) {
	if (generate) {
		let elem = document.createElement(type);

		if (text) elem.innerText = text;
		if (html_text) elem.innerHTML = html_text;

		if (attr) {
			Object.keys(attr)
				.forEach((key) => {
					elem.setAttribute(key, attr[key])
				})
		}

		if (save_name) {
			_el[save_name] = elem;
		}

		if (on) {
			if (!(on instanceof Array)) on = [on];
			on.forEach((el) => elem.addEventListener(el.event, (e) => el.callback(e)))
		}

		if (elements) {
			if (!(elements instanceof Array)) elements = [elements];
			elements.forEach((el) => {
				create(elem, el, _el);
			});
		}

		body.appendChild(elem);
	}
}
