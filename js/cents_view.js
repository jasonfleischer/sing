class CentsView {

	constructor(id = "cents_view_id", width = 1000) {

	  	this.id = id;
	
		this.WIDTH = 1000;
		this.HEIGHT = 60;

		this.root_view = document.getElementById(this.id);
		this.root_view.style.position = "relative"
		this.root_view.style.width = this.WIDTH  + "px";
		this.root_view.style.height = this.HEIGHT  + "px";
		this.root_view.width = this.WIDTH;
		this.root_view.height = this.HEIGHT

		this.canvas = this.buildCanvas("cents_canvas_"+this.id);
		this.drawing_canvas = this.buildCanvas("cents_drawing_canvas_"+this.id);
	
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
		var newWidth = Math.min(newWidth, this.WIDTH);
		let newHeight = newWidth * (this.HEIGHT/this.WIDTH);

		let views = [this.root_view, this.canvas, this.drawing_canvas];
		for (let i = 0; i < views.length; i++) {
			let view = views[i];
			view.style.height = newHeight + "px";
			view.style.width = newWidth + "px";
		}
	}

	draw(){

		let canvas = this.canvas;
		let ctx = canvas.getContext("2d");
		let number_of_cents = 100;
		let spacing = this.WIDTH / 100;
		let xPosition = 0;

		for(let i = 0; i <= number_of_cents; i++){

			ctx.beginPath();
			ctx.strokeStyle = this.getLineColor(i-50);
			ctx.lineWidth = i == 50 ? 2: 1;

			let dividerHeight = i % 50 == 0 ? 0 : (i % 10 == 0 ? this.HEIGHT*0.25 : this.HEIGHT*0.5)

			ctx.moveTo(xPosition, dividerHeight);
			ctx.lineTo(xPosition, this.HEIGHT);
			ctx.stroke();
			xPosition += spacing;
		}
	}

	drawCents(cents) {
		
		let ctx = this.drawing_canvas.getContext("2d");
		ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);

		ctx.beginPath();
		ctx.strokeStyle = this.getCentsColor(cents);
		ctx.lineWidth = 3;

		let x = ((cents + 50) /100) * this.WIDTH;
		ctx.moveTo(x, 0);
		ctx.lineTo(x, this.HEIGHT);
		ctx.stroke();
	}


	getLineColor(cents) {

		let number = Math.max(0, parseInt(255 * ((50-Math.abs(cents))/50)));
		var valueHexStr = number.toString(16);
		if(valueHexStr.length < 2) {
			valueHexStr = "0" + valueHexStr;
		}
		return "#" + valueHexStr + valueHexStr + valueHexStr;
	}

	//duplicate
	getCentsColor(cents) {

		var c = Math.abs(parseInt(cents));
		if (c <= 10) {
			return "#00ff00";
		} else if (c > 10 && c < 25) { // yellow to red (11 to 24)
			let number = parseInt(255 * ((13-(c-11))/13));
			var greenValueHexStr = number.toString(16);
			if(greenValueHexStr.length < 2) {
				greenValueHexStr = "0" + greenValueHexStr;
			}
			return "#ff" + greenValueHexStr+ "00";
		} else { //c <= 25
			return "red"
		} 
	}
}