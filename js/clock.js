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

function Clock(controller, id, minutes) {
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

	init: function init(controller, id) {
		var second = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

		this.addSeconds(second);

		this.controller = controller ? controller : this.controller;
		this.id = id ? id : this.id;

		return this;
	},


	/**
 * get how many minutes the table will be ordered
 * @param {Number} minutes - how many minutes the table will be ordered
 */

	addSeconds: function addSeconds() {
		var seconds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

		this.second = seconds % 60;
		this.minutes = Math.floor(seconds / 60) % 60;
		this.hours = Math.floor(seconds / 3600);
	},
	changeHours: function changeHours(hours) {
		this.hours = +hours;
	},


	/**
 * start this timer
 */

	start: function start() {
		var _this = this;

		this.changeTime();
		this.timer = setInterval(function () {
			return _this.changeTime();
		}, 1000);
	},


	/**
 * stop this timer
 */

	stop: function stop() {
		clearInterval(this.timer);
	},


	/**
 * clear this timer
 */

	clear: function clear() {
		this.stop();

		this.minutes = 0;
		this.hours = 0;
		this.second = 0;
	},
	addHours: function addHours(hours) {
		this.hours = +this.hours + +hours;
	},
	getMinutes: function getMinutes() {
		return +this.hours * 60 + +this.minutes;
	},


	/**
 * change object's value and sends messages to the controller
 */

	changeTime: function changeTime() {
		this.hours = +this.hours;
		this.minutes = +this.minutes;
		this.second = +this.second;

		if (this.second == 0) {
			this.second = 59;
			if (this.minutes == 0) {
				this.hours--;
				this.minutes = 59;
			} else {
				this.minutes--;
			}
		} else {
			this.second--;
		}

		if (this.hours || this.minutes || this.second) {
			this.hours = this.formatTime(this.hours);
			this.minutes = this.formatTime(this.minutes);
			this.second = this.formatTime(this.second);

			this.controller.changeTime(this.id, this.hours + ":" + this.minutes + ":" + this.second);
		} else {
			this.controller.finishTimer(this.id);
		}
	},
	getTime: function getTime() {
		this.hours = this.formatTime(+this.hours);
		this.minutes = this.formatTime(+this.minutes);
		this.second = this.formatTime(+this.second);

		return this.hours + ":" + this.minutes + ":" + this.second;
	},


	/**
 * check number's  format
 * @param {Number} n - number
 * @return two-digit number
 */

	formatTime: function formatTime(n) {
		return n > 9 ? n : "0" + n;
	}
};