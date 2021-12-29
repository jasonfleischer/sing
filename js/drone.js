

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


var oscillatorsDict = new Map();
var audioCtx;
var masterGainNode;
var compressorNode;


function playDrone(frequency){

	log.e("playDrone")
	if(audioCtx == undefined) {
		setupAudioChain();
	}

	if(oscillatorsDict.has(frequency)) {
		
		var osc = oscillatorsDict.get(frequency);
		if(osc.playing){
			osc.stop();
		}
		oscillatorsDict.delete(frequency);
	}

	const oscillator = new Oscillator(audioCtx, frequency, 1.0, 'sine');
	oscillatorsDict.set(frequency, oscillator);
	oscillator.play();
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
	masterGainNode.gain.value = 0.6; 

	compressorNode.connect(masterGainNode);
	masterGainNode.connect(audioCtx.destination);
	
	oscillatorsDict = new Map();
}

function stopDrone(frequency){
	oscillatorsDict.get(frequency).stop();
	oscillatorsDict.delete(frequency);
}
