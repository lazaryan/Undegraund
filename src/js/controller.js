'use strict';

function Controller ({content, tabels, popupAddClient, popupPay}) {
	this.content = undefined;
	this.tabels = [];
	this.clock = [];
	this.pay = [];

	this.init(content, tabels, popupAddClient, popupPay);

	return this;
}

Controller.prototype = {
	_head: document.querySelector('head'),
	_count_tabels: 0,
	_popupAddClient: undefined,

	init (content, tabels, popupAddClient) {
		if (content) {
			this._init_content(content);
		} else {
			throw new Error('Not app body!');
		}

		if (tabels) {
			if (tabels.items instanceof Array) {
				for (let tabel of tabels.items) {
					this._count_tabels++;
					this._init_tabels(this._count_tabels, tabel, this);
				}
			} else {
				this._count_tabels++;
				this._init_tabels(this._count_tabels, tabels.items, this);
			}

			if (tabels.style) {
				this.createStyle(tabels.style);
			}
		}

		if (popupAddClient.style) {
			this.createStyle(popupAddClient.style);
		}
		if (popupPay.style) {
			this.createStyle(popupPay.style);
		}

		return this;
	},

	_init_content (content) {
		if (content.el) {
			if (typeof content.el == 'object') {
				this.content = content.el;
			} else {
				this.content = document.querySelector(content.el);
			}
		}

		if (content.style) {
			this.createStyle(content.style);
		}
	},

	_init_tabels (id_tabel, param, controller) {
		this.tabels[id_tabel] = new Tabel(id_tabel, param, controller);
		this.clock[id_tabel] = new Clock(controller, id_tabel);
		this.createBlock(this.tabels[id_tabel].Body, this.content);
	},

	createStyle (style) {
		let elem;

		if (style.type === 'link') {
			elem = document.createElement('link');
			elem.type = 'text/css';
                	elem.rel = 'stylesheet';
                	elem.href = style.body;

		} else if (style.type === 'style') {
			elem = document.createElement('style');
			elem.innerText = style.body;
		}

		if (elem) {
			this._head.appendChild(elem);
		}
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

			this.clock[number].addMinutes(hours * 60);
			this.clock[number].start();

			this._popupAddClient.removePopup(this._popupAddClient);
			this._popupAddClient = undefined;
			this._activePopupAddClient = false;
		}
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
	}
}