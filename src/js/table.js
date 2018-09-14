'use strict';

/**
* Table Object
* @constructor
* @param
* {Object} controller - controlling element
* {Object} obj - table's setting
* id - element's id
* @return this Object
*/

function Tabel (id, obj, controller) {
	this.number = 0;
	this.id = undefined;
	this.name = '';
	this.order = '';
	this.prise = 0;
	this.hours = 0;

	this.controller = undefined;

	this._active = false;
	this._active_add_hours = false;
	this._body = undefined;
	this._elements = {};
	this._create = undefined;

	this.init(id, obj, controller);

	return this;
}

Tabel.prototype = {
	/**
	* init this Object
	* @param
	* {Object} controller - controlling element
	* {Object} obj - table's setting
	* id - element's id
	* @return this Object
	*/

	init (id, {prise = 0, name, hours = 0, order}, controller) {
		this.number = id != undefined ? id : this.id;
		this.id = id != undefined  ? `table_${id}` : this.id;
		this.prise = prise != undefined ? prise : this.prise;
		this.name = name != undefined ? name : this.name;
		this.hours = hours != undefined ? hours : this.hours;
		this.order = order != undefined ? order : this.order;

		this.controller = controller != undefined ? controller : this.controller;

		if(this.name) {
			this._active = true;

		}

		this._create = {
			cap: {
				setting: {
					type: 'button',
					save_name: '_cap',
					text: `Стол № ${this.Number}`,
					generate: !this._active,
					attr: {name: 'class', value: 'table__cap'},
					on: {
						active: true,
						type: 'click',
						callback: this.showPopup.bind(this)
					}
				}
			},
			title: {
				setting: {
					text: `Стол № ${this.number}`,
					attr: {name: 'class', value: 'table__title'},
				}
			},
			information: {
				setting: {
					attr: {name: 'class', value: 'table__information'},
					elements : [
						{
							attr: {name: 'class', value: 'information__field'},
							elements : [
								{
									text: 'Клиент',
									attr: {name: 'class', value: 'information__title'},
								},
								{
									type: 'span',
									save_name: '_name',
									text: this.Name,
									attr: [
										{name: 'class', value: 'information__value'},
										{name: 'id', value: `${this.Number}_name`}
									]
								}
							]
						},
						{
							attr: {name: 'class', value: 'information__field'},
							elements : [
								{
									text: 'Таймер',
									attr: {name: 'class', value: 'information__title'},
								},
								{
									type: 'span',
									text: '00:00',
									save_name: '_timer',
									attr: [
										{name: 'class', value: 'information__value'},
										{name: 'id', value: `${this.Number}_timer`}
									]
								}
							]
						}
					]
				}
			},
			change: {
				setting: {
					attr: {name: 'class', value: 'table__change'},
					elements: [
						{
							type: 'div',
							attr: {name: 'class', value: 'information__checked'},
							elements: [
								{
									type: 'button',
									text: 'Добавить',
									save_name: '_add_hours',
									attr: {name: 'class', value: 'information__button'},
									on: {
										active: true,
										type: 'click',
										callback: this.showAddHours.bind(this)
									}
								},
								{
									type: 'div',
									save_name: '_add_hours_checked',
									attr: [
										{name: 'class', value: 'information__add-hours'},
										{name: 'style', value: 'transform: scaleY(0)'}
									],
									elements: [
										{
											type: 'button',
											text: '1 час',
											attr: [
												{name: 'class', value: 'information__button'},
												{name: 'data-value', value: 1}
											],
											on: {
												active: true,
												type: 'click',
												param: true,
												callback: this.addHours.bind(this)
											}
										},
										{
											type: 'button',
											text: '2 часа',
											attr: [
												{name: 'class', value: 'information__button'},
												{name: 'data-value', value: 2}
											],
											on: {
												active: true,
												type: 'click',
												param: true,
												callback: this.addHours.bind(this)
											}
										},
										{
											type: 'button',
											text: '3 часа',
											attr: [
												{name: 'class', value: 'information__button'},
												{name: 'data-value', value: 3}
											],
											on: {
												active: true,
												type: 'click',
												param: true,
												callback: this.addHours.bind(this)
											}
										}
									]
								}
							]
						},
						{
							type: 'button',
							text: 'Убрать',
							save_name: '_add_remove',
							attr: {name: 'class', value: 'information__button'},
							on: {
								active: true,
								type: 'click',
								callback: this.showPay.bind(this)
							}
						}
					]
				}
			}
		}

		this.createTable();

		return this;
	},

	get Body () {return this._body},
	set Body (element) {this._body = element},

	get Number () {return this.number},
	set Number (number) {this.number = number},

	get Name () {return this.name},
	set Name (name) {this.name = name},

	get Hours () {return this.hours},
	set Hours (hours) {this.hours = hours},

	get Prise () {return this.prise},
	set Prise (prise) {this.prise = prise},

	/**
	* create this Object
	*/

	createTable () {
		this.Body = document.createElement('div');
		this.Body.className = 'table';
		this.Body.id = this.id;

		if (this._create) {
			for (let elem in this._create) {
				this.createElement(this.Body, this._create[elem].setting);
			}
		}
	},

	/**
	* Removes the table's lid and makes it active
	*/

	closeCap () {
		this.Body.removeChild(this._elements._cap);

		this._active = true;
		this._elements._cap = undefined;
	},

	checkClient () {
		if (this.Name && this.Hours) {
			this.startTable();
		}
	},

	startTable () {
		let time = new Date();
		let seconds_order = time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds();
		let order = this.order.split(':').reduce((s, c) => s * 60 + +c, 0 );
		
		let seconds = (this.Hours * 3600 + order) - seconds_order;

		if (seconds > 0 && order < seconds_order) {
			this.controller.startTimer(this.Number,	seconds);
		} else {
			this.showPay(this);
		}
	},

	/**
	* method of creating a window for adding visitor's data
	*/

	showPopup () {

		this.controller.showAddClient(this.Number);
	},

	/**
	* method that adds the table's lid and makes it inactive
	*/

	addCap () {
		this._create.cap.setting.generate = true;
		this._active = false;
		this.createElement(this.Body, this._create.cap.setting);
	},

	/**
	* method of modifying data
	* @param
	* {String} name - client's name
	* {Number} hours - how many hours the table will be ordered
	*/

	changeData (name, hours) {
		this.Hours = hours;

		if (this.Name != name) {
			this.Name = name;
			this._elements._name.innerText = this.Name;
		}
	},

	/**
	* clear the information about the client
	*/

	clearData () {
		this.Hours = 0;
		this.Name = '';

		this._elements._name.innerText = '';
	},

	/**
	* mmethod of modifying data and activate the table
	* @param
	* {String} name - client's name
	* {Number} hours - how many hours the table will be ordered
	*/

	activeTable (name, hours) {
		this._active = true;
		this.changeData(name, hours);
	},

	/**
	* method to display the price on the screen
	*/

	showPay () {
		let obj = `number=${this.Number}`;

		this.controller.showPay(this.Number, this.Hours, this.prise);

    		if (this._active_add_hours) {
			this._elements._add_hours_checked.setAttribute('style', 'transform: scaleY(0)');
			this._active_add_hours = false;
		}

		let xhr = new XMLHttpRequest();
		xhr.open('POST', '../php/remove_client.php', true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(obj);

		xhr.onreadystatechange = function() {
  			if (xhr.readyState != 4) return;

  			if (xhr.status != 200) {
    				throw new Error(xhr.statusText);
  			}
  		}
	},

	/**
	* method to change the remaining time of table reservation
	* @param {String} time - the remaining time
	*/

	changeTimer (time) {
		this._elements._timer.innerText = time;
	},

	showAddHours () {
		this._active_add_hours = !this._active_add_hours;
		if (this._active_add_hours) {
			this._elements._add_hours_checked.setAttribute('style', 'transform: scaleY(1)');
		} else {
			this._elements._add_hours_checked.setAttribute('style', 'transform: scaleY(0)');
		}
	},

	addHours (e) {
		let value = e.target.dataset.value;
		this.showAddHours();
		this.Hours = +this.Hours + +value;

		this.controller.addHours(this.number, +value);

		let obj = `number=${this.Number}&value=${this.Hours}`;

		let xhr = new XMLHttpRequest();
		xhr.open('POST', '../php/add_hour.php', true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(obj);

		xhr.onreadystatechange = function() {
  			if (xhr.readyState != 4) return;

  			if (xhr.status != 200) {
    				throw new Error(xhr.statusText);
  			}
		}
	},

	/**
	* @param
	* {Object} body - block to which this element is generated
	* {String} type - element's type
	* {String} className - list of the element's classes
	* {String} id - element's id
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

			if (text) elem.innerText = text;
			if (html_text) elem.innerHTML = html_text;

			if (attr) {
				if (!(attr instanceof Array)) attr = [attr];
				attr.forEach((el) => elem.setAttribute(el.name, el.value));
			}

			if (save_name) {
				if(!this._elements) this._elements = {};
				this._elements[save_name] = elem;
			}

			if (on.active) {
				if (on.param) {
					elem.addEventListener(on.type, (e) => on.callback(e));
				} else {
					elem.addEventListener(on.type, () => on.callback());
				}
			}

			if (elements) {
				if (!(elements instanceof Array)) elements = [elements];
				elements.forEach((el) => this.createElement(elem, el));
			}

			body.appendChild(elem);
		}
	}
}