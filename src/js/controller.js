'use strict';

function Controller ({content = 'body', tabels}) {
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
	}

	this.init(content, tabels);

	return this;
}

Controller.prototype = {
	_head: document.querySelector('head'),
	_count_tabels: 0,
	_popupAddClient: undefined,

	init (content, tabels) {
		if (content) {
			this._init_content(content);
		} else {
			throw new Error('Not app body!');
		}

		if (tabels) {
			if (tabels instanceof Array) {
				tabels.forEach((tabel) => {
					this._count_tabels++;
					this._init_tabels(this._count_tabels, tabel, this);
				});
			} else {
				this._init_tabels(this._count_tabels, tabels, this);
			}
		}

		return this;
	},

	_init_content (content) {
		this.content = typeof content == 'object' ? content : document.querySelector(content);
	},

	_init_tabels (id_tabel, param, controller) {
		this.clock[id_tabel] = new Clock(controller, id_tabel);
		this.tabels[id_tabel] = new Tabel(id_tabel, param, controller);
		
		this.createBlock(this.tabels[id_tabel].Body, this.content);
		this.tabels[id_tabel].checkClient();
	},

	createBlock (body, content) {
		if (body) {
			content.appendChild(body);
		}
	},

	showAddClient (number) {
		if (!this._activePopupAddClient) {
			this.tabels[number].closeCap();

			this._popupAddClient = new AddClient(this, number);
			this._activePopupAddClient = true;
		}
	},

	closeAddClient (number) {
		this._popupAddClient = undefined;
		this._activePopupAddClient = false;

		this.disactiveTable(number);
	},

	changeDataTable (number, name, hours) {
		this.tabels[number].changeData(name, hours);
	},

	disactiveTable (number) {
		this.tabels[number].addCap();
		this.tabels[number].clearData();

		this.clock[number].clear();
	},

	enterData (number, name, hours) {
		if (name) {
			this.tabels[number].activeTable(name, hours);

			this.startTimer(number, hours * 3600);

			this._popupAddClient.removePopup(this._popupAddClient);
			this._popupAddClient = undefined;
			this._activePopupAddClient = false;
		}
	},

	startTimer(number, seconds) {
		this.clock[number].addSeconds(seconds);
		this.clock[number].start();
	},

	showPay(number, hours, prise) {
		this.pay[number] = new Pay(this, number);
		this.pay[number].createPopup();
		this.pay[number].addPrise(prise, hours);

		this.disactiveTable(number);
	},

	closePay(number) {
		this.pay[number] = undefined;
	},

	changeTime(number, time) {
		this.tabels[number].changeTimer(time);
	},

	finishTimer (number) {
		let prise = this.tabels[number].Prise;
		let hours = this.tabels[number].Hours;

		this.showPay(number, hours, prise);
	},

	changeHours(number, hours) {
		this.clock[number].changeHours(hours);
		this.tabels[number].changeTimer(this.clock[number].getTime());
	}
}