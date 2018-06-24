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

	if(target.classList.contains('js-table_cap')){		//добавить посетителя
		target.classList.add('_none');
		popup.classList.remove('_none');

		let number_table = target.parentNode.getAttribute('id');
		number_table = +number_table.slice(number_table.indexOf('_') + 1, number_table.length);

		let table = document.getElementById('number_table');
		table.innerHTML = +number_table;
	}else if(target.classList.contains('js-table__remove')) {	//убрать посетителя
		let number_table = target.parentElement;
		while((number_table = number_table.parentNode) && !number_table.classList.contains('js-table'));

		number_table = number_table.getAttribute('id');
		number_table = +number_table.slice(number_table.indexOf('_') + 1, number_table.length);

		removePeople(number_table);
	}else if(target.classList.contains('js-table__change_text')){	//добавить время
		showListAddHours(target);
	}else if(target.classList.contains('js-table__extend_item')){
		showListAddHours(target);
		let count = target.dataset.value;
		
		while((target = target.parentNode) && !target.getAttribute('id'));
		let number_table = target.getAttribute('id');
		number_table = +number_table.slice(number_table.indexOf('_') + 1, number_table.length);

		addHours(+count, 'table-time_' + number_table);
	}
});

function showListAddHours(target){
	let list;
	while((target = target.parentNode) && !(list = target.querySelector('.js-table__extend_bth')));

	list.classList.toggle('table__extend_bth_active');

	let items = list.querySelectorAll('.js-table__extend_item');
	items.forEach(function(item){
		item.classList.toggle('table__extend_item_active');
	})
}

function removePeople(num){
	stopClock('table-time_' + num);

	let table = document.querySelector('#table_' + num);

	table.querySelector('.js-table__info_name').innerHTML = '';
	table.querySelector('.js-table_cap').classList.remove('_none');
}

/*Popup*/
popup.addEventListener('click', function (data)  {
	let target = data.target;

	if(target.classList.contains('js-close_popup')){
		closePopup();
	}else if(target.classList.contains('js-enter-date_click')){
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

		initClock(time * 3600, 'table-time_' + number);
	}
}

function ClearPopup(){
	document.getElementById('enter_name').value = "";
	document.getElementById('enter_time').value = 1;
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
	if(this.value > 10) this.value = 10;
	if(!this.value || this.value < 1) this.value = 1;
});

enter_name.addEventListener('input', function() {
	if (this.value.match(/[^A-Za-zА-Яа-яЁё,. 0-9]/g ))
        	this.value = this.value.replace(/[^A-Za-zА-Яа-яЁё,. 0-9]/g, '');

    if(this.value.length > 30)
    	this.value = this.value.slice(0, 30);   	   
});

/*при загрузке страницы если кто-то еще сидит в кафе*/
window.onload = function(){
	let timer = document.querySelectorAll('.js-table__info_time');

	timer.forEach(function(item){
		if(item.innerHTML){
			let id = item.getAttribute('id');

			let second = getSecond(item.innerHTML);
			initClock(second, id);
		}
	});
}

function getSecond(a){
	let h = +a.slice(0, a.indexOf(':'));
	a = a.slice(a.indexOf(':') + 1, a.length);

	let m = +a.slice(0, a.indexOf(':'));
	let s = +a.slice(a.indexOf(':') + 1, a.length);

	return (h * 3600 + m * 60 + s);
}