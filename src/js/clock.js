function Clock(sec, element) {
	this.el 		= element;
	this.hours 		= Math.floor(sec / 3600);
	this.minutes 	= Math.floor(sec / 60) % 60;
	this.second 	= sec % 3600;
	
	if(this.second >= 60){
		this.second = this.second % 60;
	}
}

Clock.prototype = {
	startClock : function(){
		if(+this.second == 0){
			this.second = 59;
			if(+this.minutes == 0){
				this.hours--;
				this.minutes = 59;
			}else{
				this.minutes--;
			}
		}else{
			this.second--;
		}

		let h =  this.checkCount(this.hours);
		let m =  this.checkCount(this.minutes);
		let s =  this.checkCount(this.second);

		this.el.innerHTML = h + ':' + m + ':' + s;

		let that = this;
		if(this.hours != 0 || this.minutes != 0)
			setTimeout(function(){that.startClock()}, 1000);	//раз в минуту
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

		this.el 		= "";
		this.hours 		= 0;
		this.minutes 	= 0;
	},
	addHours : function(h){
		this.hours = +this.hours + h;
	},
	checkCount : function(i){
		if( i < 10) i = '0' + i;

		return i;
	}

}

function initClock(sec, elem){
    window[elem] = new Clock(sec, document.getElementById(elem));

  	window[elem].startClock();
}

function addHours(hours, elem){
	window[elem].addHours(hours);
}

function stopClock(elem){
	window[elem].stopClock();
	window[elem].clearClock();

	delete window[elem];
}