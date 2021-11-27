const log = require("@jasonfleischer/log");
const pianoKit = require("@jasonfleischer/piano");
const fretboardKit = require("@jasonfleischer/fretboard");
const musicKit = require("@jasonfleischer/music-model-kit");

musicKit.init();

const tunerView = new TunerView("tuner");
const tunerView2 = new TunerView("tuner2");
let tunerObject = undefined;

const centsView = new CentsView("cents");
const centsView2 = new CentsView("cents2");
const volumeView = new VolumeView("volume");

/*let note_name_to_midi_value_map = {
	"C": 60,
	"C# / Db": 61,
	"D": 62,
	"D# / Eb": 63,
	"E": 64,
	"F": 65,
	"F# / Gb": 66,
	"G": 67,
	"G# / Ab": 68,
	"A": 69,
	"A# / Bb": 70,
	"B": 71
};*/



const pianoView = pianoKit({
	id: 'piano',
	onClick: function(note, isOn) {
		/*let midi_value = note_name_to_midi_value_map[note.note_name.type];
		$("note_type_select").value = midi_value;
		model.selected_root_note = midi_value;
		updateUI();*/
	},
	hover: true
});

const fretboardView = fretboardKit({
	id: 'fretboard',
	onClick: function(note, isOn) {
		/*let midi_value = note_name_to_midi_value_map[note.note_name.type];
		$("note_type_select").value = midi_value;
		model.selected_root_note = midi_value;
		updateUI();*/
	},
	hover: true,
	showLabels: false,
	darkMode: true
});


let average_frequencies = new Queue();
let average_cents = new Queue();
let average_frequency_length = 10;
let average_cents_length = 40;

const callbackExample = data => {


	function findNote(noteName, octave){
		let notes = musicKit.all_notes;
		var i;
		for (i = 0; i < notes.length; i++) {

			let note = musicKit.all_notes[i];
			if(note.octave == octave && note.note_name.type.startsWith(noteName)){
				return note
			}
		}
		return undefined
	}

	function getCentsColor(cents) {

		var c = Math.abs(parseInt(cents));
		if (c <= 10) {
			return "#00ff00";
		} else if (c > 10 && c < 25) { // yellow to red (11 to 24)
			let number = parseInt(255 * ((13-(c-11))/13));
			var greenValueHexStr = number.toString(16);
			if(greenValueHexStr < 10) {
				greenValueHexStr = "0" + greenValueHexStr;
			}
			return "#ff" + greenValueHexStr+ "00";
		} else { //c <= 25
			return "red"
		} 
	}


	if (data.frequency !== undefined) {

		average_frequencies.enqueue(data.frequency);
		average_cents.enqueue(data.cents);

		//$("output").innerHTML = " : " + data.note + data.octave + ' V:' + data.volume//+ " " + parsecents + "c " //+
			//data.noteFrequency + " " + data.frequency + " " + data.deviation;

		volumeView.drawVolume(data.volume);

		var note = findNote(data.note, data.octave);
		if (note !== undefined) {

			var cents = data.cents;

			let color = getCentsColor(cents);
			let midiValue = note.midi_value


			$("note").innerHTML = data.note;
			$("octave").innerHTML = data.octave;

			centsView.drawCents(cents, color);

			pianoView.clearHover();
			pianoView.drawHoverNote(note, color);
		
			fretboardView.clearHover();
			if(midiValue >= musicKit.guitar_range.min &&
				midiValue <= musicKit.guitar_range.max) {
				fretboardView.drawHoverNote(note, color);
			}

			tunerView.draw(data.frequency);
		}
	} else {
		average_frequencies.enqueue(0);
		average_cents.enqueue(0);

		pianoView.clearHover();
		fretboardView.clearHover();
		volumeView.drawVolume(0);
	}


	//log.e(average_frequencies.length());
	if(average_frequencies.length() == average_frequency_length){
		let frequency = getAverage(average_frequencies.toArray());

		
		tunerView2.draw(frequency);

		average_frequencies.dequeue();
		//average_frequencies.clear();
	}

	if(average_cents.length() == average_cents_length){


		let cents = getAverage(average_cents.toArray());
		let color = getCentsColor(cents);
		

		centsView2.drawCents(cents, color);

		average_cents.dequeue();
		//average_cents.clear();
	}


}








function startAndSubscribeTuner() {
	;(async function () {
    try {
      tunerObject = await tuner.setup()
      tunerObject.start()
      tunerObject.subscribe(callbackExample);
      $("microphone_button").innerHTML = "Stop microphone";
    } catch (error) {
    	tunerObject = undefined;
    }
	})()
}

startAndSubscribeTuner();






// add a midi listener
/*new musicKit.MidiListener(
	function (midiValue, channel, velocity) { // note on
		let note = musicKit.all_notes[midiValue];
		let color = note.note_name.is_sharp_or_flat ? "#777": "#aaa";
		startNote(note.frequency);
		pianoView.drawNoteWithColor(note, color);
	},
	function (midiValue, channel, velocity) { // note off
		let note = musicKit.all_notes[midiValue];
		startNote(note.frequency);
		pianoView.clearNote(note);
	});*/

kofi = function(){
	window.open("https://ko-fi.com/jasonfleischer", "_blank");
}

info = function(){
	information.showAlert();
}
dismissInfo = function(){
	information.dismissAlert();
}

init = function() {

	storage.load();
	alert.init();

	var isSafariMobile = window.mobileAndTabletCheck() && isSafari;
	if (isSafariMobile && !isFromHomeScreen()){
		install.showAlert();
	}

	//model.note_range = musicKit.guitar_range;
	setupControls();
	windowResizedEnd();
	//updateUI();
	musicKit.changeNoteColors();


}

function setupControls(){
	setupNoteTypeSelect();
	function setupNoteTypeSelect() {

		var select = $("note_type_select");
		var i;
		let noteTypes = musicKit.Note.ALL_NOTE_NAME_TYPES;
		var midi_value = 60;
		for (i = 0; i < noteTypes.length; i++) {
			let noteType = noteTypes[i];
			let value = noteType.type;
			var option = document.createElement('option');
			if(midi_value == model.selected_root_note) {
				option.setAttribute('selected','selected');
			}
			option.setAttribute('value', midi_value);
			midi_value++;
			option.innerHTML = value;
			select.appendChild(option);
		}
		select.oninput = function() {
			model.selected_root_note = parseInt(this.value);
			storage.setSelectedNote(model.selected_root_note);
			updateUI();
		}
	}

	setupScaleTypeSelect();
	function setupScaleTypeSelect() {

		var select = $("scale_type_select");
		var i;
		let scaleTypes = musicKit.Scale.TYPE;

		for (const key in scaleTypes) {
			
			let value = scaleTypes[key];
			var option = document.createElement('option');
			if(value == model.selected_scale_type) {
				option.setAttribute('selected','selected');
			}
			option.setAttribute('value', value);
			option.innerHTML = value;
			select.appendChild(option);
		}

		select.oninput = function() {
			model.selected_scale_type = this.value;
			storage.setSelectedScaleType(model.selected_scale_type);
			updateUI();
		}
	}

	setupRandomButton()
	function setupRandomButton(){
		$("random_button").addEventListener("click", function(event){

			let midiValue = randomInteger(60, 71);
			let note = musicKit.all_notes[midiValue];
			model.selected_root_note = note.midi_value;

			let scaleTypes = Object.keys(musicKit.Scale.TYPE).map(function(key){
    			return musicKit.Scale.TYPE[key];
			});
			let scale_type = scaleTypes[randomInteger(0, scaleTypes.length - 1)];
			model.selected_scale_type = scale_type;

			$("note_type_select").value = midiValue;
			$("scale_type_select").value = scale_type;

			storage.setSelectedNote(midiValue);
			storage.setSelectedScaleType(scale_type);
			updateUI();
		});
	}

	setupClearButton()
	function setupClearButton(){
		$("clear_button").addEventListener("click", function(event){
			pianoView.clear();
			fretboardView.clear();
		});
	}

	setupMicrophoneButton();
	function setupMicrophoneButton(){
		$("microphone_button").addEventListener("click", function(event){

			if(tunerObject != undefined){
				tunerObject.unsubscribe(callbackExample)
				tunerObject.stop();
				tunerObject = undefined;
				$("microphone_button").innerHTML = "Start microphone";
			} else {
				startAndSubscribeTuner();
			}
			//tuner.revokePermission();

		});
	}
}


// resize
var window_resize_start_event_occured = false;
var resized_timer;
window.onresize = function(){
	clearTimeout(resized_timer);
	resized_timer = setTimeout(windowResizedEnd, 200);
	if(!window_resize_start_event_occured) {
		windowResizedStart();
		window_resize_start_event_occured = true;
	}
}
function windowResizedStart(){
	dismissInfo();	
}
function windowResizedEnd(){

	window_resize_start_event_occured = false;

	let contentWidth = document.body.clientWidth;

	let fretboardPaddingLeftRight = 34;
	fretboardView.resize(Math.min(contentWidth-fretboardPaddingLeftRight, 1000));
	let pianoPaddingLeftRight = 30;
	pianoView.resize(Math.min(contentWidth-pianoPaddingLeftRight, 1000));

	let tunerPaddingLeftRight = 60;
	tunerView.resize(Math.min(contentWidth-tunerPaddingLeftRight, 1000));
	tunerView2.resize(Math.min(contentWidth-tunerPaddingLeftRight, 1000));

	let centsPaddingLeftRight = 60;
	centsView.resize(Math.min(contentWidth-centsPaddingLeftRight, 1000));
	centsView2.resize(Math.min(contentWidth-centsPaddingLeftRight, 1000));

	let volumePaddingLeftRight = 60;
	volumeView.resize(Math.min(contentWidth-volumePaddingLeftRight, 1000));
}

function updateUI() {
	let note = musicKit.all_notes[model.selected_root_note];
	let scale = new musicKit.Scale(note, model.selected_scale_type);

	$("scale_structure").innerHTML = scale.getLabels().toString().replaceAll(',', ' ');
	$("page_name").innerHTML = scale.toString()

	fretboardView.drawScale(scale);
	pianoView.drawScale(scale);
}





