const dronePianoView = pianoKit({
	id: 'drone_piano',
	onClick: function(note, isOn) {

		if(isOn) {
			log.i("note: " + note);
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
    	max: 84
  	},
  	width: 335,
	hover: true
});

const drone = {
  	oscillatorsDict: new Map(),
 	audioCtx: undefined,
	masterGainNode: {},
	compressorNode: {},
	setup: false,
	volume: 0.3
}

function playDrone(frequency){

	if(drone.audioCtx == undefined) {
		setupAudioChain();
	}

	if(drone.oscillatorsDict.has(frequency)) {
		
		var osc = drone.oscillatorsDict.get(frequency);
		if(osc.playing){
			osc.stop();
		}
		drone.oscillatorsDict.delete(frequency);
	}

	const oscillator = new Oscillator(drone.audioCtx, frequency, 1.0, 'sine');
	oscillator.connectEndNode(drone.compressorNode);
	drone.oscillatorsDict.set(frequency, oscillator);
	oscillator.play();
}

function setupAudioChain(){

	drone.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

	drone.compressorNode = drone.audioCtx.createDynamicsCompressor();
	drone.compressorNode.threshold.setValueAtTime(-20, drone.audioCtx.currentTime);
	drone.compressorNode.knee.setValueAtTime(40, drone.audioCtx.currentTime);
	drone.compressorNode.ratio.setValueAtTime(12, drone.audioCtx.currentTime);
	drone.compressorNode.attack.setValueAtTime(0, drone.audioCtx.currentTime);
	drone.compressorNode.release.setValueAtTime(0.25, drone.audioCtx.currentTime);

	drone.masterGainNode = drone.audioCtx.createGain();
	drone.masterGainNode.gain.value = drone.volume; 

	drone.compressorNode.connect(drone.masterGainNode);
	drone.masterGainNode.connect(drone.audioCtx.destination);
	
	drone.oscillatorsDict = new Map();
	drone.setup = true;
}

function stopDrone(frequency){
	drone.oscillatorsDict.get(frequency).stop();
	drone.oscillatorsDict.delete(frequency);
}
