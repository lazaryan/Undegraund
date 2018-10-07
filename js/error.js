'use strict';

function Error(message) {
	this.message = '';
	this._body = undefined;

	this.init(message);
}

Error.prototype = {
	set Message(newMessage) {
		this.message = newMessage ? newMessage : 'Ошибка';
	},

	get Message() {
		return this.message;
	},

	init: function init(message) {
		this.Message = message;

		this._create = {
			header: {
				setting: {
					type: 'header',
					attr: { class: 'to-pay__header' },
					elements: {
						type: 'span',
						save_name: '_close',
						attr: { class: 'to-pay__close' },
						on: { 'click': this.removePopup.bind(this) }
					}
				}
			},
			body: {
				setting: {
					attr: { class: 'to-pay__body' },
					elements: {
						attr: { class: 'to-pay__value' },
						text: this.message
					}
				}
			}
		};

		this.createPopup();

		return this;
	},
	createPopup: function createPopup() {
		var _this = this;

		this.Body = document.createElement('div');
		this.Body.className = 'to-pay';
		this.Body.id = this.id;

		if (this._create) {
			Object.keys(this._create).map(function (el) {
				return _this._create[el];
			}).forEach(function (el) {
				createElement(_this.Body, el.setting, _this._elements);
			});
		}

		document.querySelector('body').appendChild(this.Body);
	},
	removePopup: function removePopup() {
		document.querySelector('body').removeChild(this.Body);
	}
};