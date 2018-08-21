'use strict';

/**
* Table Object
* @constructor
* @param
* {Object} controller - controller element
* {Object} obj - setting table
* id - id element
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
	* {Object} controller - controller element
	* {Object} obj - setting table
	* id - id element
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
					className: 'table__cap',
					text: `Стол № ${this.Number}`,
					generate: !this._active,
					save: {
						active: true,
						name: '_cap'
					},
					on: {
						active: true,
						type: 'click',
						callback: this.showPopup
					}
				}
			},
			title: {
				setting: {
					className: 'table__title',
					text: `Стол № ${this.number}`
				}
			},
			information: {
				setting: {
					className: 'table__information',
					elements : [
						{
							className : 'information__field',
							elements : [
								{
									className: 'information__title',
									text: 'Клиент'
								},
								{
									type: 'span',
									className: 'information__value',
									id: `${this.Number}_name`,
									text: this.Name,
									save: {
										active: true,
										name: '_name'
									}
								}
							]
						},
						{
							className : 'information__field',
							elements : [
								{
									className: 'information__title',
									text: 'Таймер'
								},
								{
									type: 'span',
									className: 'information__value',
									id: `${this.Number}_timer`,
									text: '00:00',
									save: {
										active: true,
										name: '_timer'
									}
								}
							]
						}
					]
				}
			},
			change: {
				setting: {
					className : 'table__change',
					elements: [
						{
							type: 'button',
							className: 'information__button',
							text: 'Добавить',
							save: {
								active: true,
								name: '_add_hours'
							}
						},
						{
							type: 'button',
							className: 'information__button',
							text: 'Убрать',
							save: {
								active: true,
								name: '_add_remove'
							},
							on: {
								active: true,
								type: 'click',
								callback: this.showPay
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
	* Removes the lid and makes the table active
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
		let minutes_order = time.getHours() * 60 + time.getMinutes();
		let order = this.order.split(':').reduce((s, c) => s * 60 + +c );
		
		let minutes = (this.Hours * 60 + order) - minutes_order;

		if (minutes > 0) {
			this.controller.startTimer(this.Number,	minutes);
		} else {
			this.showPay(this);
		}
	},

	/**
	* method of creating a window for adding visitor data
	* @param {Object} than - this object
	*/

	showPopup (than) {
		than.controller.showAddClient(than.Number);
	},

	/**
	* the method adds a lid and makes the table not active
	*/

	addCap () {
		this._create.cap.setting.generate = true;
		this._active = false;
		this.createElement(this.Body, this._create.cap.setting);
	},

	/**
	* method of data modification
	* @param
	* {String} name - name client
	* {Number} hours - how many hours the table was ordered
	*/

	changeData (name, hours) {
		this.Hours = hours;

		if (this.Name != name) {
			this.Name = name;
			this._elements._name.innerText = this.Name;
		}
	},

	/**
	* clear information of client
	*/

	clearData () {
		this.Hours = 0;
		this.Name = '';

		this._elements._name.innerText = '';
	},

	/**
	* method of data modification and active table
	* @param
	* {String} name - name client
	* {Number} hours - how many hours the table was ordered
	*/

	activeTable (name, hours) {
		this._active = true;
		this.changeData(name, hours);
	},

	/**
	* order price display method
	* @param {Object} than - this Object
	*/

	showPay (than) {
		than.controller.showPay(than.Number, than.Hours, than.prise);
	},

	/**
	* method of changing the remaining time of ordering a table
	* @param {String} time - the remaining time line
	*/

	changeTimer (time) {
		this._elements._timer.innerText = time;
	},

	/**
	* @param
	* {Object} body - in which block to generate the object
	* {String} type - type element
	* {String} className - element class list
	* {String} id - element id
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