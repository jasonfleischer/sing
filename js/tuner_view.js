

class TunerView {

	constructor(id = "tuner_view_id", width = 1000, range = musicKit.piano_range) {

	  	this.id = id;
		this.range = range;
		this.min_midi_value = range.min;
		this.max_midi_value = range.max;
	
		this.WIDTH = 1000;
		this.width = width;
		this.HEIGHT = 230;

		this.root_view = document.getElementById(this.id);
		this.canvas = this.buildCanvas("tuner_canvas_"+this.id);
	
		this.draw();
		this.resize(width);
	}

	buildCanvas(id) {

		var canvas = document.createElement('canvas'); 
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
		var newHeight = newWidth * (230/1000);

		this.root_view.style.height = newHeight + "px";
		this.canvas.style.height = newHeight + "px";

		this.root_view .style.width = newWidth + "px";
		this.canvas.style.width = newWidth + "px";
	}

	draw(){

		let canvas = this.canvas;
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);

		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.fillStyle = "#f00";
		ctx.strokeStyle = "#0f0";
		ctx.rect(0, 0, this.WIDTH, this.HEIGHT);
		ctx.fill();
		ctx.stroke();
	}
}