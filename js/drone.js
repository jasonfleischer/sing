

const dronePianoView = pianoKit({
	id: 'drone_piano',
	onClick: function(note, isOn) {
		if(isOn) {
			stopDrone(note.frequency);
		} else {
			playDrone(note.frequency);
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
