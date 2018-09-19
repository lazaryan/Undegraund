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
	this._elements = {};
	this._body = undefined;

	this._hour_id = ['Час', 'Часа', 'Часов'];
	this._style_button_disabled = 'background-color: #DFDFDF; color: #C0BEBE; cursor: default';

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
					attr: {class: 'add-client__header'},
					elements: {
						type: 'button',
						save_name: '_close',
						attr: {class: 'add-client__close'},
						on: {'click': this.closePopup.bind(this)}
					}
				}
			},
			body: {
				setting: {
					attr: {class: 'add-client__body'},
					elements: [
						{
							attr: {class: 'add-client__enter-name'},
							elements: [
								{
									type: 'label',
									text: 'Введите имя посетителя',
									attr: {
										class: 'enter-name__title',
										for: 'inputName'
									}
								},
								{
									attr: {class: 'enter-name__block'},
									elements: {
										type: 'input',
										save_name: '_name',
										attr: {
											placeholder: 'Введите имя',
											class: 'enter-name__input',
											id: 'inputName',
											type: 'text',
											maxlength: this.controller.setting.name.maxlength
										},
										on: {
											'input': this.inputName.bind(this),
											'keyup': this.checkKeyup.bind(this)
										}
									}
								}
							]
						},
						{
							attr: {class: 'add-client__enter-hours'},
							elements: [
								{
									type: 'label',
									text: 'Введите время',
									attr: {class: 'enter-time__title'},
								},
								{
									type: 'input',
									save_name: '_hours',
									attr: {
										class: 'enter-time__input',
										id: 'inputHours',
										type: 'number',
										min: this.controller.setting.hours.min,
										max: this.controller.setting.hours.max,
										value: this.controller.setting.hours.min
									},
									on: {
										'input': this.inputHours.bind(this),
										'keyup': this.checkEnter.bind(this)
									}
								},
								{
									type: 'span',
									text: 'Час',
									save_name: '_hours_text',
									attr: {class: 'enter-time__hours'}
								}
							]
						},
						{
							type: 'button',
							text: 'Подтвердить',
							save_name: '_enter',
							attr: {
								class: 'add-client__enter',
								style: this._style_button_disabled,
								disabled: 'disabled'
							},
							on: {'click': this.enterData.bind(this)}
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
			Object.keys(this._create)
				.map((el) => this._create[el])
				.forEach((el) => {
					createElement(this.Body, el.setting, this._elements);
				})
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

	checkKeyup (e) {
		this.checkEnter(e);
		this.checkArrow(e);
	},

	checkEnter (e) {
		if (e.code == 'Enter' && this.Name) {
			this.enterData();
		}
	},

	checkArrow (e) {
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
		this.format_time(this.Hours);

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
        		text = text.toString().replace(/[^0-9 ]/g, '');
        	}

        	text = +text;

    		if(text > this._elements._hours.max){
    			text = this._elements._hours.max; 
    		}
    		if(text < this._elements._hours.min){
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
	}
}