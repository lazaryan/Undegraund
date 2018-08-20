"use strict";

/**
* Timer for table
* @constructor
* @param
* {Object} controller - controller element
* id - id element
* {Number} minutes - how many minutes the table was ordered
* @return this Object
*/

function Clock (controller, id, minutes) {
	this.minutes = 0;
	this.hours = 0;
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
	* {Object} controller - controller element
	* id - id element
	* {Number} minutes - how many minutes the table was ordered
	* @return this Object
	*/

	init (controller, id, minutes = 0) {
		this.addMinutes(minutes);

		this.controller = controller ? controller : this.controller;
		this.id = id ? id : this.id;

		return this;
	},

	/**
	* get how many minutes the table was ordered
	* @param {Number} minutes - how many minutes the table was ordered
	*/

	addMinutes (minutes = 0) {
		this.hours = Math.floor(minutes / 60);
		this.minutes = minutes % 60;
	},

	/**
	* start this timer
	*/

	start () {
		this.changeTime();
		this.timer = setInterval(() => this.changeTime(), 60000);
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
	},

	/**
	* change value object and sends messages to the controller
	*/

	changeTime () {
		this.hours = +this.hours;
		this.minutes = +this.minutes;

		if (this.hours && this.minutes == 0) {
			this.minutes = 59;
			this.hours--;
		} else {
			this.minutes--;
		}

		if (this.hours || this.minutes) {
			this.hours = this.formatTime(this.hours);
			this.minutes = this.formatTime(this.minutes);

			this.controller.changeTime(this.id, `${this.hours}:${this.minutes}`);
		} else {
			this.controller.finishTimer(this.id);
		}
	},

	/**
	* check format number
	* @param {Number} n - number
	* @return two-digit number
	*/

	formatTime (n) {
		return n > 9 ? n : `0${n}`;
	}
}