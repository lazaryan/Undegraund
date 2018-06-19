/*Для IE8*/
if (typeof Element.prototype.addEventListener === 'undefined') {
    Element.prototype.addEventListener = function (e, callback) {
      e = 'on' + e;
      return this.attachEvent(e, callback);
    };
}

/*Для бокового меню*/
const nav 		= document.querySelector('#nav-js');

nav.addEventListener("mouseout", function (event)  {ShowNav(event.target, "out")});	//убрали курсор
nav.addEventListener("mouseover", function (event)  {ShowNav(event.target, "over")});	//навели

function ShowNav(a, b){
	const nav_elem 	= document.querySelectorAll('.nav-item');

	if(b === "out"){
		for( let i = 0; i < nav_elem.length; i++){
			nav_elem[i].classList.add('nav-item_disactive');
		}
	}else {
		for( let i = 0; i < nav_elem.length; i++){
			nav_elem[i].classList.remove('nav-item_disactive');
		}
	}
}

/*столы*/

let content = document.querySelector('.js-content');
let popup   = document.querySelector('.js-add-visit');

content.addEventListener('click', function (data) {
	let target = data.target;

	if(target.classList.contains('js-table_cap')){
		target.classList.add('_none');
		popup.classList.remove('_none');

		let number_table = target.parentNode.getAttribute('id');
		number_table = +getString(number_table, number_table.indexOf('_') + 1, number_table.length);

		let table = document.getElementById('number_table');
		table.innerHTML = +number_table;
	}else if(target.classList.contains('js-table__remove')) {
		console.log('Убрать посетителя');
	}
});

/*Popup*/
popup.addEventListener('click', function (data)  {
	let target = data.target;

	if(target.classList.contains('js-close_popup')){
		closePopup();
	}else if(target.classList.contains('js-enter-date_text') || target.classList.contains('js-enter-date_click')){
		getDataPopup();
	}
});

function closePopup(){
	let number = document.getElementById('number_table').innerHTML;

	let table = document.querySelector('#table_' + number + ' .js-table_cap');
	table.classList.remove('_none');

	ClearPopup();
	popup.classList.add('_none');
}

function getDataPopup(){
	let name = document.getElementById('enter_name').value;
	let time = document.getElementById('enter_time').value;

	if(name){

		ClearPopup();

		let number = document.getElementById('number_table').innerHTML;

		document.querySelector('#table_' + number + ' .js-table__info_name').innerHTML = name;

		popup.classList.add('_none');

		initClock(time, 'table-time_' + number);
	}
}

function ClearPopup(){
	document.getElementById('enter_name').value = "";
	document.getElementById('enter_time').value = 1;
}

function getString(s, pos_st, pos_fn){
	let st = "";

	for(let i = pos_st; i < pos_fn; i++){
		st += s[i];
	}

	return st;
}

/*отслеживаем ввод данных на корректность*/
let enter_time = document.querySelector('#enter_time');
let enter_name = document.querySelector('#enter_name');

enter_time.addEventListener('input', function() {
	if (this.value.match(/[^0-9]/g ))
        	this.value = this.value.replace(/[^0-9]/g, '');
	   
    if(this.value > 10) this.value = 10;  	   
});

enter_time.addEventListener('blur', function () {
	if(!this.value || this.value < 1) this.value = 1;
});

enter_name.addEventListener('input', function() {
	if (this.value.match(/[^A-Za-zА-Яа-яЁё,_-. 0-9]/g ))
        	this.value = this.value.replace(/[^A-Za-zА-Яа-яЁё,_-. 0-9]/g, '');

    if(this.value.length > 30)
    	this.value = this.value.slice(0, 30);   	   
});