class VolumeView {

	constructor(id = "volume_view_id", width = 1000, threshold=0.2, clip=0.9) {

	  	this.id = id;
	  	this.threshold = 0.2;
	  	this.clip = 0.9;
	
		this.WIDTH = 1000;
		this.HEIGHT = 60;



		this.root_view = document.getElementById(this.id);
		this.root_view.style.position = "relative"
		this.root_view.style.width = this.WIDTH  + "px";
		this.root_view.style.height = this.HEIGHT  + "px";
		this.root_view.width = this.WIDTH;
		this.root_view.height = this.HEIGHT

		this.canvas = this.buildCanvas("volume_canvas_"+this.id);
		this.drawing_canvas = this.buildCanvas("volume_drawing_canvas_"+this.id);
	
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
		this.drawing_canvas.style.height = newHeight + "px";

		this.root_view .style.width = newWidth + "px";
		this.canvas.style.width = newWidth + "px";
		this.drawing_canvas.style.width = newWidth + "px";
	}

	draw(){

		let ctx = this.canvas.getContext("2d");
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.fillStyle = "#f00";
		ctx.strokeStyle = "#f0f";
		ctx.rect(0, 0, this.WIDTH, this.HEIGHT);
		ctx.fill();
		ctx.stroke();
	}

	drawVolume(volumePercent) {
		
		let ctx = this.drawing_canvas.getContext("2d");
		ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);

		ctx.beginPath();
		ctx.fillStyle = this.getBarColor(volumePercent);
		ctx.lineWidth = 2;
		ctx.rect(0, 0, this.WIDTH*volumePercent, this.HEIGHT);
		ctx.fill();
	}	

	getBarColor(volumePercent) {
		if(volumePercent >= this.clip){
			return "red";
		} else if (volumePercent <= this.threshold) {
			return "#eee";
		} else {
			return "green"
		} 
	}
}