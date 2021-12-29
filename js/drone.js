

const dronePianoView = pianoKit({
	id: 'drone_piano',
	onClick: function(note, isOn) {

		log.e("note" + note + ' ' + isOn)

		if(isOn) {
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
var lastAddedOscillators = undefined;
var gainNodesDict = {};
var audioCtx;
var masterGainNode;


function playDrone(frequency){

	log.e("playDrone")
	if(audioCtx == undefined) {
		setupAudioChain()
	}

	if(oscillatorsDict[frequency] == undefined) {
		const oscillator = audioCtx.createOscillator();
		const gainNode = audioCtx.createGain();
		oscillator.type = 'sine';
		oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
		

		oscillator.connect(gainNode);

		//if(lastAddedOscillators == undefined){
			gainNode.connect(masterGainNode);
		//} else {
		//	gainNode.connect(lastAddedOscillators);
		//}
		//lastAddedOscillators = oscillator;
		
		oscillator.start();

		oscillatorsDict[frequency] = oscillator;
		gainNodesDict[frequency] = gainNode;
	} else {
		//oscillatorsDict[frequency].start();
		gainNodesDict[frequency].gain.setValueAtTime(0.0001, audioCtx.currentTime); 
		gainNodesDict[frequency].gain.linearRampToValueAtTime(1.0, audioCtx.currentTime + 0.03);
	}
	
	
}

function setupAudioChain(){

	audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	masterGainNode = audioCtx.createGain();
	masterGainNode.connect(audioCtx.destination);
	masterGainNode.gain.setValueAtTime(0.5, audioCtx.currentTime); 
	oscillatorsDict = {};
	gainNodesDict = {};
}

function stopDrone(frequency){
	log.e("stopDrone")

	gainNodesDict[frequency].gain.setValueAtTime(1.0, audioCtx.currentTime); 
	gainNodesDict[frequency].gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);
	//oscillatorsDict[frequency].stop(audioCtx.currentTime + 0.03)

}
