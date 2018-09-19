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
	this._elements = {};
	
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
							on: {'click': this.closePopup.bind(this)}
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
			Object.keys(this._create)
				.map((el) => this._create[el])
				.forEach((el) => {
					createElement(this.Body, el.setting, this._elements);
				})
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
	}
}