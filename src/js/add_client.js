'use strict';

/**
* the object to add a new client
* @param
* {Object} controller - controlling element
* id - element's id
* @return this Object
*/

function AddClient (controller, id) {
	this.controller = undefined;
	this.number = 0;
	this.name = '';
	this.hours = 1;

	this._create = {};
	this._body = undefined;

	this._hour_id = ['Час', 'Часа', 'Часов'];
	this._style_button_disabled = 'background-color: #DFDFDF; color: #C0BEBE';

	this.init(controller, id);

	return this;
}

AddClient.prototype = {
	get Name () {return this.name},
	set Name (name) {this.name = name},

	get Hours () {return this.hours},
	set Hours (hours) {this.hours = hours},

	get Number () {return this.number},
	set Number (number) {this.number = number},

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
		this.number = id ? id : this.id;

		this._create = {
			header : {
				setting: {
					type: 'header',
					className: 'add-client__header',
					elements: {
						type: 'button',
						className: 'add-client__close',
						save: {
							active: true,
							name: '_close'
						},
						on: {
							active: true,
							events: {
								type: 'click',
								callback: this.closePopup.bind(this)
							}
						}
					}
				}
			},
			body: {
				setting: {
					className: 'add-client__body',
					elements: [
						{
							className: 'add-client__enter-name',
							elements: [
								{
									type: 'label',
									label_for: 'inputName',
									className: 'enter-name__title',
									text: 'Введите имя посетителя'
								},
								{
									className: 'enter-name__block',
									elements: {
										type: 'input',
										input_type: 'text',
										className: 'enter-name__input',
										id_element: 'inputName',
										attr: [{name: 'placeholder', value: 'Введите имя'}],
										maxlength: 63,
										save: {
											active: true,
											name: '_name'
										},
										on: {
											active: true,
											events: [
												{
													type: 'input',
													param: true,
													callback: this.inputName.bind(this)
												},
												{
													type: 'keyup',
													param: true,
													callback: this.checkEnter.bind(this)
												}]
										}
									}
								}
							]
						},
						{
							className: 'add-client__enter-hours',
							elements: [
								{
									type: 'label',
									className: 'enter-time__title',
									text: 'Введите время'
								},
								{
									type: 'input',
									input_type: 'number',
									className: 'enter-time__input',
									id_element: 'inputHours',
									input_min: 1,
									input_max: 10,
									value: 1,
									save: {
										active: true,
										name: '_hours'
									},
									on: {
										active: true,
										events : [
											{
												type: 'input',
												param: true,
												callback: this.inputHours.bind(this)
											},
											{
												type: 'keyup',
												param: true,
												callback: this.checkEnter.bind(this)
											}]
									}
								},
								{
									type: 'span',
									text: 'Час',
									className: 'enter-time__hours',
									save: {
										active: true,
										name: '_hours_text'
									}
								}
							]
						},
						{
							type: 'button',
							className: 'add-client__enter',
							text: 'Подтвердить',
							attr : [{name: 'disabled', value: 'disabled'}],
							style: this._style_button_disabled,
							save: {
								active: true,
								name: '_enter'
							},
							on: {
								active: true,
								events: {
									type: 'click',
									callback: this.enterData.bind(this)
								}
							}
						}
					]
				}
			}
		}

		this.createPopup();

		return this;
	},

	/**
	* create this object and displaying it on the page
	*/

	createPopup () {
		this.Body = document.createElement('div');
		this.Body.className = 'add-client';

		if (this._create) {
			for (let elem in this._create) {
				this.createElement(this.Body, this._create[elem].setting);
			}
		}

		document.querySelector('body')
			.appendChild(this.Body);

		this._elements._name.focus();	
	},

	/**
	* remove this popup
	*/

	removePopup () {
		document.querySelector('body').removeChild(this.Body);
	},

	/**
	* close this popup
	*/

	closePopup () {
		this.controller.closeAddClient(this.number);
		this.removePopup();
	},

	/**
	* the process of entering username
	* @param
	* {Object} e - received data
	*/

	inputName (e) {
		this.format_name(e.target.value);

		if (this.Name && this._elements._enter.disabled) {
			this._elements._enter.disabled = '';
			this._elements._enter.style = '';
		}

		if (!this.Name) {
			this._elements._enter.disabled = 'disabled';
			this._elements._enter.style = this._style_button_disabled;
		}

		this.controller.changeDataTable(this.Number, this.Name, this.Hours);
	},

	checkEnter (e) {
		if (e.code == 'Enter' && this.Name) {
			this.enterData();
		}

		if (e.code == 'ArrowUp') {
			this.upHours();
		}

		if (e.code == 'ArrowDown') {
			this.downHours();
		}
	},

	upHours () {
		if (this.Hours < this._elements._hours.max) {
			this.Hours++;
			this._elements._hours.value = this.Hours;

			this.showHoursText();

			this.controller.changeDataTable(this.Number, this.Name, this.Hours);
		}
	},

	downHours () {
		if (this.Hours > this._elements._hours.min) {
			this.Hours--;
			this._elements._hours.value = this.Hours;

			this.showHoursText();

			this.controller.changeDataTable(this.Number, this.Name, this.Hours);
		}
	},

	/**
	* the process of entering hours
	* @param
	* {Object} e - received data
	*/

	inputHours (e) {
		this.format_time(e.target.value);

		this.showHoursText();

		this.controller.changeDataTable(this.Number, this.Name, this.Hours);
	},

	showHoursText () {
		if (this.Hours == 0 || this.Hours > 5) {
			this._elements._hours_text.innerText = this._hour_id[2];
		} else if (this.Hours == 1) {
			this._elements._hours_text.innerText = this._hour_id[0];
		} else {
			this._elements._hours_text.innerText = this._hour_id[1];
		}
	},

	/**
	* input of received data
	*/

	enterData () {
		let now = new Date();
		let date = `${this.formatTime(now.getHours())}:${this.formatTime(now.getMinutes())}:${this.formatTime(now.getSeconds())}`; 
		let obj = `number=${this.Number}&name=${this.Name}&hours=${this.Hours}&date=${date}`;

		this.controller.enterData(this.Number, this.Name, this.Hours);

		let xhr = new XMLHttpRequest();
		xhr.open('POST', '../php/add_client.php', true);
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
	* checking the entered name
	* @param 
	* name - enter the name
	*/

	format_name (name) {
		let text = name;

		if (text.match(/[^A-Za-zА-Яа-яЁё,. 0-9]/g )){
        		text = text.replace(/[^A-Za-zА-Яа-яЁё,. 0-9]/g, '');
		}

    		if(text.length > this._elements._name.maxlength){
    			text = text.slice(0, this._elements._name.maxlength); 
    		}

    		this.Name = text;

    		this._elements._name.value = this.Name;
	},

	/**
	* checking the entered time
	* @param 
	* time - enter the time
	*/

	format_time (time) {
		let text = time;

		if (!Number(text)){
        		text = text.replace(/[^0-9 ]/g, '');
        	}

        	text = +text;

    		if(text && text > this._elements._hours.max){
    			text = this._elements._hours.max; 
    		}
    		if(text && text < this._elements._hours.min){
    			text = this._elements._hours.min; 
    		}

    		this.Hours = text;

    		this._elements._hours.value = this.Hours;
	},

	/**
	* check number's  format
	* @param {Number} n - number
	* @return two-digit number
	*/

	formatTime (n) {
		return n > 9 ? n : `0${n}`;
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
	* {String} label_for - input id for which the label is created
	* {String} input_type - input type
	* {Number} input_min - min numeric value input (type="number")
	* {Number} input_max - max numeric value input (type="number")
	* {Number} maxlength - max length value input (type="text")
	* {String} value - element's value
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
			id_element,
			text,
			html_text,
			label_for,
			input_type = 'text',
			input_min = 0,
			input_max = 999,
			maxlength,
			value,
			style,
			generate =  true,
			save =  {
				active: false,
				name: undefined
			},
			on = {
				active: false,
				events: undefined
			},
			elements,
			attr
		}
	) {
		if (generate) {
			let elem = document.createElement(type);

			if (className) elem.className = className;
			if (id_element) elem.id = id_element;
			if (text) elem.innerText = text;
			if (html_text) elem.innerHTML = html_text;
			if (input_type) elem.type = input_type;
			if (input_min) elem.min = input_min;
			if (input_max) elem.max = input_max;
			if (value) elem.value = value;
			if (maxlength) elem.setAttribute('maxlength', maxlength);
			if (label_for) elem.setAttribute('for', label_for);
			if (style) elem.setAttribute('style', style);
			if (attr) {
				attr.forEach((el) => {
					elem.setAttribute(el.name, el.value);
				})
			}

			if (save.active) {
				if(!this._elements) this._elements = {};
				this._elements[save.name] = elem;
			}

			if (on.active) {
				if (on.events instanceof Array) {
					on.events.forEach((event) => {
						if (event.param) {
							elem.addEventListener(event.type, (e) => event.callback(e));
						} else {
							elem.addEventListener(event.type, () => event.callback());
						}
					})
				} else {
					if (on.events.param) {
						elem.addEventListener(on.events.type, (e) => on.events.callback(e));
					} else {
						elem.addEventListener(on.events.type, () => on.events.callback());
					}
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