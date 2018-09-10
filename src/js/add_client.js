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
							type: 'click',
							callback: this.closePopup
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
										maxlength: 30,
										save: {
											active: true,
											name: '_name'
										},
										on: {
											active: true,
											type: 'input',
											param: true,
											callback: this.inputName
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
										type: 'input',
										param: true,
										callback: this.inputHours
									}
								}
							]
						},
						{
							type: 'button',
							className: 'add-client__enter',
							text: 'Подтвердить',
							save: {
								active: true,
								name: '_enter'
							},
							on: {
								active: true,
								type: 'click',
								callback: this.enterData
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
	},

	/**
	* remove this popup
	* @param {Object} than - this Object
	*/

	removePopup (than) {
		document.querySelector('body').removeChild(than.Body);
	},

	/**
	* close this popup
	* @param {Object} than - this Object
	*/

	closePopup (than) {
		than.controller.closeAddClient(than.number);
		than.removePopup(than);
	},

	/**
	* the process of entering username
	* @param
	* {Object} e - received data
	* {Object} than - this Object
	*/

	inputName (e, than) {
		than.format_name(e.target.value, than);
		than.controller.changeDataTable(than.Number, than.Name, than.Hours);
	},

	/**
	* the process of entering hours
	* @param
	* {Object} e - received data
	* {Object} than - this Object
	*/

	inputHours (e, than) {
		than.format_time(e.target.value, than);
		than.controller.changeDataTable(than.Number, than.Name, than.Hours);
	},

	/**
	* input of received data
	* @param {Object} than - this Object
	*/

	enterData (than) {
		let now = new Date();
		let date = `${than.formatTime(now.getHours())}:${than.formatTime(now.getMinutes())}:${than.formatTime(now.getSeconds())}`; 
		let obj = `number=${than.Number}&name=${than.Name}&hours=${than.Hours}&date=${date}`;

		than.controller.enterData(than.Number, than.Name, than.Hours);

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
	* than - this object
	*/

	format_name (name, than) {
		let text = name;

		if (text.match(/[^A-Za-zА-Яа-яЁё,. 0-9]/g )){
        		text = text.replace(/[^A-Za-zА-Яа-яЁё,. 0-9]/g, '');
		}

    		if(text.length > than._elements._name.maxlength){
    			text = text.slice(0, than._elements._name.maxlength); 
    		}

    		than.Name = text;

    		than._elements._name.value = than.Name;
	},

	/**
	* checking the entered time
	* @param 
	* time - enter the time
	* than - this object
	*/

	format_time (time, than) {
		let text = time;

		if (!Number(text)){
        		text = text.replace(/[^0-9 ]/g, '');
        	}

        	text = +text;

    		if(text && text > than._elements._hours.max){
    			text = than._elements._hours.max; 
    		}
    		if(text && text < than._elements._hours.min){
    			text = than._elements._hours.min; 
    		}

    		than.Hours = text;

    		than._elements._hours.value = than.Hours;
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
			if (id_element) elem.id = id_element;
			if (text) elem.innerText = text;
			if (html_text) elem.innerHTML = html_text;
			if (input_type) elem.type = input_type;
			if (input_min) elem.min = input_min;
			if (input_max) elem.max = input_max;
			if (value) elem.value = value;
			if (maxlength) elem.setAttribute('maxlength', maxlength);
			if (label_for) elem.setAttribute('for', label_for);

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