

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
var compressorNode;


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
			gainNode.connect(compressorNode);

			gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime); 

		//} else {
		//	gainNode.connect(lastAddedOscillators);
		//}
		//lastAddedOscillators = oscillator;
		
		oscillator.start();

		oscillatorsDict[frequency] = oscillator;
		gainNodesDict[frequency] = gainNode;
	} else {
		//oscillatorsDict[frequency].start();
		gainNodesDict[frequency].gain.setValueAtTime(0.00001, audioCtx.currentTime); 
		gainNodesDict[frequency].gain.exponentialRampToValueAtTime(1.0, audioCtx.currentTime + 0.1);
	}
	
	
}

function setupAudioChain(){

	audioCtx = new (window.AudioContext || window.webkitAudioContext)();


	compressorNode = audioCtx.createDynamicsCompressor();
		compressorNode.threshold.setValueAtTime(-20, audioCtx.currentTime);
		compressorNode.knee.setValueAtTime(40, audioCtx.currentTime);
		compressorNode.ratio.setValueAtTime(12, audioCtx.currentTime);
		compressorNode.attack.setValueAtTime(0, audioCtx.currentTime);
		compressorNode.release.setValueAtTime(0.25, audioCtx.currentTime);

	masterGainNode = audioCtx.createGain();
	masterGainNode.gain.setValueAtTime(1.0, audioCtx.currentTime); 

	compressorNode.connect(masterGainNode);
	masterGainNode.connect(audioCtx.destination);
	
	oscillatorsDict = {};
	gainNodesDict = {};
}

function stopDrone(frequency){
	log.e("stopDrone")

	gainNodesDict[frequency].gain.setValueAtTime(1.0, audioCtx.currentTime); 
	gainNodesDict[frequency].gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);
	//oscillatorsDict[frequency].stop(audioCtx.currentTime + 0.03)

}
