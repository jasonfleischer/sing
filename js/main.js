const log = require("@jasonfleischer/log");
const pianoKit = require("@jasonfleischer/piano");
const fretboardKit = require("@jasonfleischer/fretboard");
const musicKit = require("@jasonfleischer/music-model-kit");
musicKit.init();

let note_name_to_midi_value_map = {
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
};

const pianoView = pianoKit({
	id: 'piano',
	onClick: function(note, isOn) {
		/*let midi_value = note_name_to_midi_value_map[note.note_name.type];
		$("note_type_select").value = midi_value;
		model.selected_root_note = midi_value;
		updateUI();*/
	},
	hover: false
});

const fretboardView = fretboardKit({
	id: 'fretboard',
	onClick: function(note, isOn) {
		/*let midi_value = note_name_to_midi_value_map[note.note_name.type];
		$("note_type_select").value = midi_value;
		model.selected_root_note = midi_value;
		updateUI();*/
	},
	hover: false,
	showLabels: false,
	darkMode: true
});



const freelizer = require("freelizer");
//import { freelizer } from 'freelizer'

const callbackExample = data => {


	function findNote(noteName, octave){
		let notes = musicKit.all_notes;
		var i;
		for (i = 0; i < notes.length; i++) {

			let note = musicKit.all_notes[i];


			//console.log(note.octave == octave)
			//console.log(note.note_name.type.startsWith(noteName))
			if(note.octave == octave && note.note_name.type.startsWith(noteName)){
				return note
			}
			
		}
		return undefined
	}

	function calculateCents(f1, f2){
		if (f1 === undefined || f2 === undefined) {
			return undefined;
		}
		return 1200 * Math.log2(f1/f2);
	}

	function getCentsColor(cents) {

		var c = Math.abs(cents);

		if (c <= 10) {
			let number = 255 * (c/10);
			let redValueHexStr = number.toString(16);
			return "#" + redValueHexStr+ "ff00"
		} else {

			return "red"


		}
	}


	if (data.frequency !== undefined) {

		var cents = calculateCents(data.frequency, data.noteFrequency)

		$("output").innerHTML = " : " + data.note + data.octave + " " + cents + "c " +
			data.noteFrequency + " " + data.frequency + " " + data.deviation;


		var note = findNote(data.note, data.octave);
		//console.log(note)
		if (note !== undefined) {
			pianoView.clear()
			pianoView.drawNoteWithColor(note, "red");

			$("cents").innerHTML = cents;
			$("cents").style.backgroundColor = getCentsColor(cents);

			//fretboardView.drawNote(note);
		}
		//console.log(data)
	} else {
		pianoView.clear()
	}


	

}

;(async function () {
    try {
      const { start, subscribe } = await freelizer()
      start()
      //subscribe(console.log)

      subscribe(callbackExample)
    } catch (error) {
      // Error handling goes here
    }
})()







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
}

function updateUI() {
	let note = musicKit.all_notes[model.selected_root_note];
	let scale = new musicKit.Scale(note, model.selected_scale_type);

	$("scale_structure").innerHTML = scale.getLabels().toString().replaceAll(',', ' ');
	$("page_name").innerHTML = scale.toString()

	fretboardView.drawScale(scale);
	pianoView.drawScale(scale);
}





