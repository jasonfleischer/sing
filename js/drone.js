

const dronePianoView = pianoKit({
	id: 'drone_piano',
	onClick: function(note, isOn) {

log.e("note" + note + ' ' + isOn)

		if(!isOn) {
			playDrone(note.frequency);
			let color = note.note_name.is_sharp_or_flat ? "#777" : "#aaa";
            dronePianoView.drawNoteWithColor(note, color);	
			
		} else {
			stopDrone(note.frequency);
			dronePianoView.clearNote(note);
		}
	},
	range: {
    	min: 48,
    	max: 60
  	},
  	width: 340,
	hover: true
});


var oscillatorsDict = {};
var audioCtx;
var gainNode;


function playDrone(frequency){

	log.e("playDrone")
	if(audioCtx == undefined) {
		setupAudioChain()
	}
	
	const oscillator = audioCtx.createOscillator();
	oscillator.type = 'sine';
	oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
	oscillator.connect(gainNode);
	oscillator.start();

	oscillatorsDict[frequency] = oscillator;
}

function setupAudioChain(){

	audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	gainNode = audioCtx.createGain();
	gainNode.connect(audioCtx.destination);
	oscillatorsDict = {};
}

function stopDrone(frequency){
	log.e("stopDrone")

	oscillatorsDict[frequency].stop(audioCtx.currentTime + 1)

}
