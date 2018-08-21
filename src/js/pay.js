"use strict";

/**
* Amount display object
* @constructor
* @param
* {Object} controller - controller element
* id - id element
* @return this Object
*/

function Pay (controller, id) {
	this.controller = undefined;
	this.id = undefined;
	this.prise = 0;

	this._body = undefined;

	this.init(controller, id);

	return this;
}

Pay.prototype = {
	get Body () {return this._body},
	set Body (body) {this._body = body},

	/**
	* init this Object
	* @param
	* {Object} controller - controller element
	* id - id element
	* @return this Object
	*/

	init (controller, id) {
		this.controller = controller ? controller : this.controller;
		this.id = id ? id : this.id;

		this._create = {
			header: {
				setting: {
					type: 'header',
					className: 'to-pay__header',
					elements: [
						{
							type: 'h2',
							className: 'to-pay__title-header',
							text: `Стол № ${this.id}`,
							save: {
								active: true,
								name: '_title'
							}
						},
						{
							type: 'span',
							className: 'to-pay__close',
							save: {
								active: true,
								name: '_close'
							},
							on: {
								active: true,
								type: 'click',
								callback: this.closePopup
							}
						}
					]
				}
			},
			body: {
				setting: {
					className: 'to-pay__body',
					elements: [
						{
							type: 'p',
							className: 'to-pay__title',
							text: 'К оплате:'
						},
						{
							className: 'to-pay__value',
							save: {
								active: true,
								name: '_value'
							}
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
	* @param this Object
	*/

	closePopup (than) {
		than.controller.closePay(than.id);
		than.removePopup(than);
	},

	/**
	* remove this popup
	* @param {Object} than - this Object
	*/

	removePopup (than) {
		document.querySelector('body').removeChild(than.Body);
	},

	/**
	* show prise
	* @param
	* {Number} prise - prise table
	* {Number} hours - how many hours the table was ordered
	*/

	addPrise (prise, hours) {
		this.prise = (prise * hours) || this.prise;

		this._elements._value.innerText = this.prise;
	},

	/**
	* @param
	* {Object} body - in which block to generate the object
	* {String} type - type element
	* {String} className - element class list
	* id - element id
	* {String} text - text in element
	* {String} html_text - html markup inside the element
	* {Boolean} generate - creation condition
	* {Object} elements - children
	* {Object} save - save element
	** @param
	** {Boolean} active - attendance
	** {String} name - name to save
	* {Object} on - слушатели
	** @param
	** {Boolean} active - attendance
	** {String} type - type of listener
	** {Boolean} param - whether the function takes arguments
	** {Function} callback - function callback
	*/

	createElement(
		body = document.querySelector('body'),
		{
			type = 'div',
			className,
			id,
			text,
			html_text,
			generate =  true,
			save =  {
				active: false,
				name: undefined
			},
			on = {
				active: false,
				param: false,
				type: undefined,
				callback: undefined
			},
			elements,
		}
	) {
		if (generate) {
			let elem = document.createElement(type);

			if (className) elem.className = className;
			if (id) elem.id = id;
			if(text) elem.innerText = text;
			if(html_text) elem.innerHTML = html_text;

			if (save.active) {
				if(!this._elements) this._elements = {};
				this._elements[save.name] = elem;
			}

			if (on.active) {
				if (on.param) {
					elem.addEventListener(on.type, (e) => on.callback(e, this));
				} else {
					elem.addEventListener(on.type, () => on.callback(this));
				}
			}

			if (elements) {
				if (elements instanceof Array) {
					for (let elems of elements) {
						this.createElement(elem, elems);
					}
				} else {
					this.createElement(elem, elements);
				}
			}

			body.appendChild(elem);
		}
	}
}