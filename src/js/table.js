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
							type: 'div',
							className: 'information__checked',
							elements: [
								{
									type: 'button',
									className: 'information__button',
									text: 'Добавить',
									save: {
										active: true,
										name: '_add_hours'
									},
									on: {
										active: true,
										type: 'click',
										callback: this.showAddHours
									}
								},
								{
									type: 'div',
									className: 'information__add-hours',
									style: 'transform: scaleY(0)',
									save: {
										active: true,
										name: '_add_hours_checked'
									},
									elements: [
										{
											type: 'button',
											className: 'information__button',
											text: '1 час',
											data: [
												{
													name: 'value',
													value: 1
												}
											],
											on: {
												active: true,
												type: 'click',
												param: true,
												callback: this.addHours
											}
										},
										{
											type: 'button',
											className: 'information__button',
											text: '2 часа',
											data: [
												{
													name: 'value',
													value: 2
												}
											],
											on: {
												active: true,
												type: 'click',
												param: true,
												callback: this.addHours
											}
										},
										{
											type: 'button',
											className: 'information__button',
											text: '3 часа',
											data: [
												{
													name: 'value',
													value: 3
												}
											],
											on: {
												active: true,
												type: 'click',
												param: true,
												callback: this.addHours
											}
										}
									]
								}
							]
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
	* @param {Object} than - this object
	*/

	showPopup (than) {

		than.controller.showAddClient(than.Number);
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
	* @param {Object} than - this Object
	*/

	showPay (than) {
		let obj = `number=${than.Number}`;

		than.controller.showPay(than.Number, than.Hours, than.prise);

    		if (than._active_add_hours) {
			than._elements._add_hours_checked.setAttribute('style', 'transform: scaleY(0)');
			than._active_add_hours = false;
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

	showAddHours (than) {
		than._active_add_hours = !than._active_add_hours;
		if (than._active_add_hours) {
			than._elements._add_hours_checked.setAttribute('style', 'transform: scaleY(1)');
		} else {
			than._elements._add_hours_checked.setAttribute('style', 'transform: scaleY(0)');
		}
	},

	addHours (e, than) {
		let value = e.target.dataset.value;
		than.showAddHours(than);
		than.Hours = +than.Hours + +value;

		than.controller.addHours(than.number, +value);

		let obj = `number=${than.Number}&value=${than.Hours}`;

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
			className,
			id,
			text,
			html_text,
			style,
			data,
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
			if (text) elem.innerText = text;
			if (html_text) elem.innerHTML = html_text;
			if (style) elem.setAttribute('style', style);
			if (data) {
				data.forEach((el) => {
					elem.dataset[el.name] = el.value
				});
			}

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