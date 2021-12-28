

const dronePianoView = pianoKit({
	id: 'drone_piano',
	onClick: function(note, isOn) {
		if(isOn) {
			stopDrone(note.frequency);
			dronePianoView.clearNote(note);
		} else {
			playDrone(note.frequency);
			let color = note.note_name.is_sharp_or_flat ? "#777" : "#aaa";
            dronePianoView.drawNoteWithColor(note, color);	
		}
	},
	range: {
    	min: 48,
    	max: 60
  	},
  	width: 340,
	hover: true
});


var drones = [];

function playDrone(frequency){

}

function stopDrone(frequency){

}
