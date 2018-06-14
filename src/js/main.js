/*Для бокового меню*/
const nav 		= document.querySelector('#nav-js');

nav.addEventListener("mouseout", (event) => {ShowNav(event.target, "out")});	//убрали курсор
nav.addEventListener("mouseover", (event) => {ShowNav(event.target, "over")});	//навели

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
