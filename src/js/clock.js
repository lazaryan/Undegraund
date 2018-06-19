function Clock(hours, element) {
	this.el 		= element;
	this.hours 		= hours;
	this.minutes 	= 0;
}

Clock.prototype = {
	startClock : function(){

		if(+this.minutes == 0){
			this.hours--;
			this.minutes = 59;
		}else{
			this.minutes--;
		}

		let h =  this.checkCount(this.hours);
		let m =  this.checkCount(this.minutes);

		this.el.innerHTML = h + ' : ' + m;

		let that = this;
		if(this.hours != 0 || this.minutes != 0)
			setTimeout(function(){that.startClock()}, 60000);	//раз в минуту
		else
			that.stopClock();
	},
	stopClock : function(){
		let h =  this.checkCount(this.hours);
		let m =  this.checkCount(this.minutes);

		this.el.innerHTML = h + ' : ' + m;
	},
	clearClock : function(){
		this.el.innerHTML = "";

		this.el = "";
		this.hours = 0;
		this.minutes = 0;
	},
	addHours : function(h){
		this.hours = +this.hours + h;
	},
	checkCount : function(i){
		if( i < 10) i = '0' + i;

		return i;
	}

}

function initClock(hours, elem){
    window[elem] = new Clock(hours, document.getElementById(elem));

  	window[elem].startClock();
}

function addHours(hours, elem){
	window[elem].addHours(hours);
}