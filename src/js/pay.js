"use strict";

/**
* Amount display object
* @constructor
* @param
* {Object} controller - controlling element
* id - element's id
* @return this Object
*/

function Pay (controller, id) {
	this.controller = undefined;
	this.id = undefined;
	this.prise = 0;

	this._body = undefined;
	this.currency = '\u20BD'; //₽

	this.init(controller, id);

	return this;
}

Pay.prototype = {
	get Body () {return this._body},
	set Body (body) {this._body = body},

	/**
	* init this Object
	* @param
	* {Object} controller - controlling element
	* id - element's id
	* @return this Object
	*/

	init (controller, id) {
		this.controller = controller ? controller : this.controller;
		this.id = id ? id : this.id;

		this._create = {
			header: {
				setting: {
					type: 'header',
					attr: {class: 'to-pay__header'},
					elements: [
						{
							type: 'h2',
							text: `Стол № ${this.id}`,
							save_name: '_title',
							attr: {class: 'to-pay__title-header'}
						},
						{
							type: 'span',
							save_name: '_close',
							attr: {class: 'to-pay__close'},
							on: {
								event: 'click',
								callback: this.closePopup.bind(this)
							}
						}
					]
				}
			},
			body: {
				setting: {
					attr: {class: 'to-pay__body'},
					elements: [
						{
							type: 'p',
							text: 'К оплате:',
							attr: {class: 'to-pay__title'},
						},
						{
							attr: {class: 'to-pay__value'},
							save_name: '_value'
						}
					]
				}
			}
		}

		return this;
	},

	/**
	* create this Object and displaying it on the page
	*/

	createPopup () {
		this.Body = document.createElement('div');
		this.Body.className = 'to-pay';
		this.Body.id = this.id;

		if (this._create) {
			for (let elem in this._create) {
				this.createElement(this.Body, this._create[elem].setting);
			}
		}

		document.querySelector('body')
			.appendChild(this.Body);
	},

	/**
	* close this Object
	*/

	closePopup () {
		this.controller.closePay(this.id);
		this.removePopup();
	},

	/**
	* remove this popup
	*/

	removePopup () {
		document.querySelector('body').removeChild(this.Body);
	},

	/**
	* show price
	* @param
	* {Number} price - tabel's price
	* {Number} hours - how many hours the table will be ordered
	*/

	addPrise (prise, hours) {
		this.prise = (prise * hours) || this.prise;

		this._elements._value.innerText = `${this.prise} ${this.currency}`;
	},

	/**
	* @param
	* {Object} body - block to which this element is generated
	* {String} type - element's type
	* {String} className - list of the element's classes
	* id - element's id
	* {String} text - text in element
	* {String} html_text - html markup inside the element
	* {Boolean} generate - generated under certain condition
	* {Object} elements - child elements
	* {Object} save - saving element
	** @param
	** {Boolean} active - presence of event listeners
	** {String} name - name to save
	* {Object} on - event listeners
	** @param
	** {Boolean} active - presence of event listeners
	** {String} type - type of event listener
	** {Boolean} param - whether the function takes arguments
	** {Function} callback - callback function
	*/

	createElement(
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
		}
	) {
		if (generate) {
			let elem = document.createElement(type);

			if(text) elem.innerText = text;
			if(html_text) elem.innerHTML = html_text;

			if (attr) {
				Object.keys(attr)
					.forEach((key) => {
						elem.setAttribute(key, attr[key])
					})
			}

			if (save_name) {
				if(!this._elements) this._elements = {};
				this._elements[save_name] = elem;
			}

			if (on) {
				if (!(on instanceof Array)) on = [on];
				on.forEach((el) => elem.addEventListener(el.event, (e) => el.callback(e)))
			}

			if (elements) {
				if (!(elements instanceof Array)) elements = [elements];
				elements.forEach((el) => this.createElement(elem, el));
			}

			body.appendChild(elem);
		}
	}
}