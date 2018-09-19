"use strict";

/**
* Timer for table
* @constructor
* @param
* {Object} controller - controlling element
* id - element's id
* {Number} minutes - how many minutes the table will be ordered
* @return this Object
*/

function Clock (controller, id, minutes) {
	this.minutes = 0;
	this.hours = 0;
	this.second = 0;
	this.id = undefined;
	this.controller = undefined;
	this.timer = undefined;

	this.init(controller, id, minutes);

	return this;
}

Clock.prototype = {
	/**
	* init this Object
	* @param
	* {Object} controller - controlling element
	* id - element's id
	* {Number} minutes - how many minutes the table will be ordered
	* @return this Object
	*/

	init (controller, id, second = 0) {
		this.addSeconds(second);

		this.controller = controller ? controller : this.controller;
		this.id = id ? id : this.id;

		return this;
	},

	/**
	* get how many minutes the table will be ordered
	* @param {Number} minutes - how many minutes the table will be ordered
	*/

	addSeconds (seconds = 0) {
		this.second = seconds % 60;
		this.minutes = Math.floor(seconds / 60) % 60;
		this.hours = Math.floor(seconds / 3600);
	},

	changeHours (hours) {
		this.hours = +hours;
	},

	/**
	* start this timer
	*/

	start () {
		this.changeTime();
		this.timer = setInterval(() => this.changeTime(), 1000);
	},

	/**
	* stop this timer
	*/

	stop () {
		clearInterval(this.timer);
	},

	/**
	* clear this timer
	*/

	clear () {
		this.stop();

		this.minutes = 0;
		this.hours = 0;
		this.second = 0;
	},

	/**
	* change object's value and sends messages to the controller
	*/

	changeTime () {
		this.hours = +this.hours;
		this.minutes = +this.minutes;
		this.second = +this.second;

		if(this.second == 0){
			this.second = 59;
			if(this.minutes == 0){
				this.hours--;
				this.minutes = 59;
			}else{
				this.minutes--;
			}
		}else{
			this.second--;
		}

		if (this.hours || this.minutes || this.second) {
			this.hours = this.formatTime(this.hours);
			this.minutes = this.formatTime(this.minutes);
			this.second = this.formatTime(this.second);

			this.controller.changeTime(this.id, `${this.hours}:${this.minutes}:${this.second}`);
		} else {
			this.controller.finishTimer(this.id);
		}
	},

	getTime () {
		this.hours = this.formatTime(+this.hours);
		this.minutes = this.formatTime(+this.minutes);
		this.second = this.formatTime(+this.second);

		return `${this.hours}:${this.minutes}:${this.second}`;
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