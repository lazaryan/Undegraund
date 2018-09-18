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
					attr: {class: 'table__cap'},
					on: {
						event: 'click',
						callback: this.showPopup.bind(this)
					}
				}
			},
			title: {
				setting: {
					text: `Стол № ${this.number}`,
					attr: {class: 'table__title'},
				}
			},
			information: {
				setting: {
					attr: {class: 'table__information'},
					elements : [
						{
							attr: {class: 'information__field'},
							elements : [
								{
									text: 'Клиент',
									attr: {class: 'information__title'},
								},
								{
									type: 'span',
									save_name: '_name',
									text: this.Name,
									attr: {
										class: 'information__value',
										id: `${this.Number}_name`
									}
								}
							]
						},
						{
							attr: {class: 'information__field'},
							elements : [
								{
									text: 'Таймер',
									attr: {class: 'information__title'},
								},
								{
									type: 'span',
									text: '00:00:00',
									save_name: '_timer',
									attr: {
										class: 'information__value',
										id: `${this.Number}_timer`
									}
								}
							]
						}
					]
				}
			},
			change: {
				setting: {
					attr: {class: 'table__change'},
					elements: [
						{
							type: 'div',
							attr: {class: 'information__checked'},
							elements: [
								{
									type: 'button',
									text: 'Добавить',
									save_name: '_add_hours',
									attr: {class: 'information__button'},
									on: {
										event: 'click',
										callback: this.showAddHours.bind(this)
									}
								},
								{
									type: 'div',
									save_name: '_add_hours_checked',
									attr: {
										class: 'information__add-hours',
										style: 'transform: scaleY(0)'
									},
									elements: [
										{
											type: 'button',
											text: '1 час',
											attr: {
												class: 'information__button',
												'data-value': 1
											},
											on: {
												event: 'click',
												callback: this.addHours.bind(this)
											}
										},
										{
											type: 'button',
											text: '2 часа',
											attr: {
												class: 'information__button',
												'data-value': 2
											},
											on: {
												event: 'click',
												callback: this.addHours.bind(this)
											}
										},
										{
											type: 'button',
											text: '3 часа',
											attr: {
												class: 'information__button',
												'data-value': 3
											},
											on: {
												event: 'click',
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
							attr: {class: 'information__button'},
							on: {
								event: 'click',
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
			Object.keys(this._create)
				.map((el) => this._create[el])
				.forEach((el) => {
					createElement(this.Body, el.setting, this._elements);
				})
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
		
		createElement(this.Body, this._create.cap.setting, this._elements);
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
	}
}