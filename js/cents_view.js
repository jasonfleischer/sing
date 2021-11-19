class CentsView {

	constructor(id = "cents_view_id", width = 1000, range = musicKit.piano_range) {

	  	this.id = id;
		this.range = range;
	
		this.WIDTH = 1000;
		this.HEIGHT = 60;

		this.root_view = document.getElementById(this.id);
		this.root_view.style.backgroundColor = this.backgroundColor;
		this.root_view.style.position = "relative"
		this.root_view.style.width = this.WIDTH  + "px";
		this.root_view.style.height = this.HEIGHT  + "px";
		this.root_view.width = this.WIDTH;
		this.root_view.height = this.HEIGHT

		this.canvas = this.buildCanvas("cents_canvas_"+this.id);
	
		this.draw();
		this.resize(width);
	}

	buildCanvas(id) {

		let canvas = document.createElement('canvas'); 
	    canvas.id = id;
	    canvas.style.position = "absolute"
	    canvas.style.left = "0px"
	    canvas.style.right = "0px"
	    canvas.style.width = this.WIDTH + "px";
		canvas.style.height = this.HEIGHT + "px";
		canvas.width = this.WIDTH;
		canvas.height = this.HEIGHT;
	    this.root_view.appendChild(canvas);
	    return canvas;
	}


	resize(newWidth){
		this.width = newWidth;
		var newWidth = Math.min(newWidth, 1000);
		let newHeight = newWidth * (60/1000);

		this.root_view.style.height = newHeight + "px";
		this.canvas.style.height = newHeight + "px";

		this.root_view .style.width = newWidth + "px";
		this.canvas.style.width = newWidth + "px";
	}

	draw(){

		let canvas = this.canvas;
		let ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);

		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.fillStyle = "#000";
		ctx.strokeStyle = "#fff";
		ctx.rect(0, 0, this.WIDTH, this.HEIGHT);
		ctx.fill();
		ctx.stroke();

		let number_of_cents = 100;


		let spacing = this.WIDTH / 100;

		

		var xPosition = 0;

		var i;
		for(i = 0; i <= number_of_cents; i++){

			ctx.beginPath();
			ctx.strokeStyle = "#fff";
			ctx.lineWidth = 1;
			ctx.moveTo(xPosition, i % 10 == 0 ? 0: this.HEIGHT*0.5);
			ctx.lineTo(xPosition, this.HEIGHT);
			ctx.stroke();
			xPosition += spacing;
		}
	}

	drawCents(cents) {
		
		let ctx = this.canvas.getContext("2d");

		ctx.beginPath();
		ctx.strokeStyle = this.getCentsColor(cents);
		ctx.lineWidth = 3;

		let x = ((cents + 50) /100) * this.WIDTH;
		ctx.moveTo(x, 0);
		ctx.lineTo(x, this.HEIGHT);
		ctx.stroke();
	}


	//duplicate
	getCentsColor(cents) {

		var c = Math.abs(parseInt(cents));
		if (c <= 10) {
			return "#00ff00";
		} else if (c > 10 && c < 25) { // yellow to red (11 to 24)
			let number = parseInt(255 * ((13-(c-11))/13));
			var greenValueHexStr = number.toString(16);
			if(greenValueHexStr < 10) {
				greenValueHexStr = "0" + greenValueHexStr;
			}
			return "#ff" + greenValueHexStr+ "00";
		} else { //c <= 25
			return "red"
		} 
	}
}