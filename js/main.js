const tunerView = new TunerView("tuner");
const centsView = new CentsView("cents");
const volumeView = new VolumeView("volume", model.threshold);
const pianoView = pianoKit({
	id: 'piano',
	onClick: function(note, isOn) {},
	hover: true
});
const fretboardView = fretboardKit({
	id: 'fretboard',
	onClick: function(note, isOn) {},
	hover: true,
	showLabels: false,
	darkMode: true
});

startAndSubscribeTuner();

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
	setupControls();
	windowResizedEnd();
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


		setupThresholdSlider();
		function setupThresholdSlider() {
			var slider = $("threshold_range");
			slider.value = model.threshold;
			var sliderText = $("threshold");
			sliderText.innerHTML = "Threshold: " + (model.threshold*100).toFixed() + "%";
			slider.oninput = function() {
				model.threshold = this.value;
				sliderText.innerHTML = "Threshold: " + (model.threshold*100).toFixed() + "%";
				volumeView.drawThresholdMarker(model.threshold);
			}
		}

		setupDroneVolumeSlider();
		function setupDroneVolumeSlider() {
			var slider = $("drone_volume_range");
			slider.value = drone.volume*1000;
			var sliderText = $("drone_volume");
			sliderText.innerHTML = "Volume: " + (drone.volume*100).toFixed() + "%";
			slider.oninput = function() {
				drone.volume = Math.max(0.00001, this.value / 1000);
				//storage.set_volume(drone.volume);
				sliderText.innerHTML = "Volume: " + (drone.volume*100).toFixed() + "%";
				if (drone.setup) {
					drone.masterGainNode.gain.setValueAtTime(drone.volume, drone.audioCtx.currentTime);
				}
			}
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
	dronePianoView.resize(Math.min(contentWidth-pianoPaddingLeftRight, 335));

	let tunerPaddingLeftRight = 60;
	tunerView.resize(Math.min(contentWidth-tunerPaddingLeftRight, 1000));

	let centsPaddingLeftRight = 60;
	centsView.resize(Math.min(contentWidth-centsPaddingLeftRight, 1000));

	let volumePaddingLeftRight = 60;
	volumeView.resize(Math.min(contentWidth-volumePaddingLeftRight, 1000));

}

function updateUI() {
	let note = musicKit.all_notes[model.selected_root_note];
	let scale = new musicKit.Scale(note, model.selected_scale_type);

	$("scale_structure").innerHTML = scale.getLabels().toString().replaceAll(',', ' ');
	//$("page_name").innerHTML = scale.toString()

	fretboardView.drawScale(scale);
	pianoView.drawScale(scale);
}

function updateUITuneIndicator(cents, color) {
	if (cents <= -10) {
		$("flat").style.backgroundColor = color
		$("intune").style.backgroundColor = "#494949"
		$("sharp").style.backgroundColor = "#494949"
	} else if (cents >= 10) { // yellow to red (11 to 24)
		$("flat").style.backgroundColor = "#494949"
		$("intune").style.backgroundColor = "#494949"
		$("sharp").style.backgroundColor = color
	} else { 
		$("flat").style.backgroundColor = "#494949"
		$("intune").style.backgroundColor = color
		$("sharp").style.backgroundColor = "#494949"
	} 
}
function  clearUITuneIndicator() {
	$("flat").style.backgroundColor = "#494949"
	$("intune").style.backgroundColor = "#494949"
	$("sharp").style.backgroundColor = "#494949"
}
