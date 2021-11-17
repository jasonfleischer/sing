

class TunerView {

	constructor(id = "tuner_view_id", width = 1000, range = musicKit.piano_range) {

	  	this.id = id;
		this.range = range;
		this.min_midi_value = range.min;
		this.max_midi_value = range.max;
	
		this.WIDTH = 1000;
		this.HEIGHT = 60;

		this.root_view = document.getElementById(this.id);
		this.root_view.style.backgroundColor = this.backgroundColor;
		this.root_view.style.position = "relative"
		this.root_view.style.width = this.WIDTH  + "px";
		this.root_view.style.height = this.HEIGHT  + "px";
		this.root_view.width = this.WIDTH;
		this.root_view.height = this.HEIGHT

		this.canvas = this.buildCanvas("tuner_canvas_"+this.id);
	
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
		ctx.fillStyle = "#f00";
		ctx.strokeStyle = "#0f0";
		ctx.rect(0, 0, this.WIDTH, this.HEIGHT);
		ctx.fill();
		ctx.stroke();



		var offset = this.WIDTH * 0.5 + 0;
		let spacing = this.WIDTH * 0.10;

		var xPosition = offset;

		var i;
		for(i = this.min_midi_value; i <= this.max_midi_value; i++){

			if(xPosition < 0 || xPosition > this.WIDTH){
				continue;
			}

			var note = musicKit.all_notes[i];
		
			ctx.fillStyle = '#00f';
	    	ctx.font = (this.HEIGHT * 0.8) + 'px san-serif';
	    	ctx.textAlign = 'center';
	    	ctx.fillText(note.note_name.type.substring(0,2), xPosition, this.HEIGHT*0.75);
	    	xPosition = xPosition + spacing
		}


		// 

		ctx.beginPath();
		ctx.strokeStyle = '#0ff';
		ctx.lineWidth = 0;
		ctx.moveTo(this.WIDTH * 0.5, 0);
		ctx.lineTo(this.WIDTH * 0.5, this.HEIGHT);
		ctx.stroke();




	}
}