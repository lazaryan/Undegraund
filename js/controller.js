'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function Controller(_ref) {
	var _ref$content = _ref.content,
	    content = _ref$content === undefined ? 'body' : _ref$content,
	    tabels = _ref.tabels;

	this.content = undefined;
	this.tabels = [];
	this.clock = [];
	this.pay = [];

	this.setting = {
		hours: {
			min: 1,
			max: 8
		},
		name: {
			maxlength: 35
		}
	};

	this.init(content, tabels);

	return this;
}

Controller.prototype = {
	_head: document.querySelector('head'),
	_count_tabels: 0,
	_popupAddClient: undefined,

	init: function init(content, tabels) {
		var _this = this;

		if (content) {
			this._init_content(content);
		} else {
			throw new Error('Not app body!');
		}

		if (tabels) {
			if (tabels instanceof Array) {
				tabels.forEach(function (tabel) {
					_this._count_tabels++;
					_this._init_tabels(_this._count_tabels, tabel, _this);
				});
			} else {
				this._init_tabels(this._count_tabels, tabels, this);
			}
		}

		return this;
	},
	_init_content: function _init_content(content) {
		this.content = (typeof content === 'undefined' ? 'undefined' : _typeof(content)) == 'object' ? content : document.querySelector(content);
	},
	_init_tabels: function _init_tabels(id_tabel, param, controller) {
		this.clock[id_tabel] = new Clock(controller, id_tabel);
		this.tabels[id_tabel] = new Tabel(id_tabel, param, controller);

		this.createBlock(this.tabels[id_tabel].Body, this.content);
		this.tabels[id_tabel].checkClient();
	},
	createBlock: function createBlock(body, content) {
		if (body) {
			content.appendChild(body);
		}
	},
	showAddClient: function showAddClient(number) {
		if (!this._activePopupAddClient) {
			this.tabels[number].closeCap();

			this._popupAddClient = new AddClient(this, number);
			this._activePopupAddClient = true;
		}
	},
	closeAddClient: function closeAddClient(number) {
		this._popupAddClient = undefined;
		this._activePopupAddClient = false;

		this.disactiveTable(number);
	},
	changeDataTable: function changeDataTable(number, name, hours) {
		this.tabels[number].changeData(name, hours);
	},
	disactiveTable: function disactiveTable(number) {
		this.tabels[number].addCap();
		this.tabels[number].clearData();

		this.clock[number].clear();
	},
	enterData: function enterData(number, name, hours) {
		if (name) {
			this.tabels[number].activeTable(name, hours);

			this.startTimer(number, hours * 3600);

			this._popupAddClient.removePopup(this._popupAddClient);
			this._popupAddClient = undefined;
			this._activePopupAddClient = false;
		}
	},
	startTimer: function startTimer(number, seconds) {
		this.clock[number].addSeconds(seconds);
		this.clock[number].start();
	},
	showPay: function showPay(number, hours, prise) {
		var minutes = +hours * 60 - this.clock[number].getMinutes();
		var prise_minute = (prise / 60).toFixed(4);

		this.pay[number] = new Pay(this, number);
		this.pay[number].createPopup();
		this.pay[number].addPrise(prise_minute * minutes, hours);

		this.tabels[number].sendClient(prise_minute * minutes);

		this.disactiveTable(number);
	},
	closePay: function closePay(number) {
		this.pay[number] = undefined;
	},
	changeTime: function changeTime(number, time) {
		this.tabels[number].changeTimer(time);
	},
	finishTimer: function finishTimer(number) {
		var prise = this.tabels[number].Prise;
		var hours = this.tabels[number].Hours;

		this.showPay(number, hours, prise);
	},
	changeHours: function changeHours(number, hours) {
		this.clock[number].addHours(hours);
		this.tabels[number].changeTimer(this.clock[number].getTime());
	},
	addHours: function addHours(number, hours) {
		this.clock[number].addHours(hours);
	},
	showError: function showError(message) {
		new Error(message);
	}
};