const log = require("@jasonfleischer/log");

class Scale {

	static TYPE = Object.freeze({

		minor_Pentatonic: "minor pentatonic",
		Major_Pentatonic: "Major pentatonic",
		
		Ionian: "Ionian",
		Dorian: "Dorian",
		Phrygian: "Phrygian",
		Lydian: "Lydian",
		Mixolydian: "Mixolydian",
		Aeolian: "Aeolian",
		Locrian: "Locrian",

		Melodic_minor: "Melodic minor (ascending)",
		Harmonic_minor: "Harmonic minor",

		Double_Harmonic_Major: "Double Harmonic Major",
		Double_Harmonic_minor: "Double Harmonic minor",

		blues: "Blues",
		neutral_Pentatonic: "Neutral pentatonic",
		
		minor_Triad: "minor triad",
		Major_Triad: "Major triad",

		Whole_Tone: "Whole Tone",

		diminished_Tone: "Diminished Tone"
	});

	constructor(root_note, scale_type = Scale.TYPE.Major){
		this.root_note =root_note;
		this.type = scale_type;

		function replaceAll(str, find, replace) {
			return str.replace(new RegExp(find, 'g'), replace);
		}
		this.file_name = root_note.note_name.file_name.concat(["audio/scale/"+ replaceAll(this.type.toLowerCase(),' ','_') +".mp3"]);
		this.alternate_names = "none";


		switch(scale_type){
			case Scale.TYPE.Ionian:
				this.note_sequence = [0, 2, 4, 5, 7, 9, 11];
				this.alternate_names = "Major";
				break;
			case Scale.TYPE.Dorian:
				this.note_sequence = [0, 2, 3, 5, 7, 9, 10];
				break;
			case Scale.TYPE.Phrygian:
				this.note_sequence = [0, 1, 3, 5, 7, 8, 10];
				break;
			case Scale.TYPE.Lydian:
				this.note_sequence = [0, 2, 4, 6, 7, 9, 11];
				break;
			case Scale.TYPE.Mixolydian:
				this.note_sequence = [0, 2, 4, 5, 7, 9, 10];
				break;
			case Scale.TYPE.Aeolian:
				this.note_sequence = [0, 2, 3, 5, 7, 8, 10];
				this.alternate_names = "minor, Melodic minor (descending)";
				break;
			case Scale.TYPE.Locrian:
				this.note_sequence = [0, 1, 3, 5, 6, 8, 10];
				break;

			case Scale.TYPE.Melodic_minor:
				this.note_sequence = [0, 2, 3, 5, 7, 9, 11];
				break;
			case Scale.TYPE.Harmonic_minor:
				this.note_sequence = [0, 2, 3, 5, 7, 8, 11];
				break;

			case Scale.TYPE.Double_Harmonic_Major:
				this.note_sequence = [0, 1, 4, 5, 7, 8, 11];
				this.alternate_names = "Byzantine, Arabic, Gypsy major";
				break;
			case Scale.TYPE.Double_Harmonic_minor:
				this.note_sequence = [0, 2, 3, 6, 7, 8, 11];
				this.alternate_names = "Hungarian minor, Gypsy minor";
				break;

			case Scale.TYPE.minor_Pentatonic:
				this.note_sequence = [0, 3, 5, 7, 10];
				break;
			case Scale.TYPE.Major_Pentatonic:
				this.note_sequence = [0, 2, 4, 7, 9];
				break;
			case Scale.TYPE.neutral_Pentatonic:
				this.note_sequence = [0, 2, 5, 7, 10];
				break;

			case Scale.TYPE.blues:
				this.note_sequence = [0, 3, 5, 6, 7, 10];
				break;

			case Scale.TYPE.minor_Triad:
				this.note_sequence = [0, 3, 7];
				break;
			case Scale.TYPE.Major_Triad:
				this.note_sequence = [0, 4, 7];
				break;

			case Scale.TYPE.Whole_Tone:
				this.note_sequence = [0, 2, 4, 6, 8, 10];
				break;

			case Scale.TYPE.diminished_Tone:
				this.note_sequence = [0, 3, 6, 9];
				break;
		}
		this.note_labels = this.getLabels();
		this.structure = this.getStructure();
	}

	getNoteArray(all_notes, range) {
	
		var note_names = this.getUniqueNoteName(all_notes, range);
		var note_array = [];
		var i;
		for(i=range.min; i<=range.max; i++){
			var note = all_notes[i];
			if (note_names.has(note.note_name.type)) {
				note_array.push(note);
			}
		}
		if (note_array.length == 0) {
			log.e("no notes found for scale");  
		}
		return note_array;
	}

	getUniqueNoteName(all_notes, range) {

		function isNoteWithinRange(midi_number, range){
			return midi_number >= range.min && midi_number <= range.max;
		}
		const noteNames = new Set();
		var i;
		for(i=0; i<this.note_sequence.length; i++){
			let midi_number = this.root_note.midi_value + this.note_sequence[i];
			if(isNoteWithinRange(midi_number, range)){
				noteNames.add(all_notes[midi_number].note_name.type);
			}
		}
		for(i=this.note_sequence.length-1; i>=0; i--){
			let midi_number = this.root_note.midi_value - (12 - this.note_sequence[i]);
			if(isNoteWithinRange(midi_number, range)){
				noteNames.add(all_notes[midi_number].note_name.type);
			}
		}
		return noteNames;
	}

	getLabels() {
		let result = [];
		let all_labels = ["R", "m2", "M2", "m3", "M3", "P4", "TT", "P5", "m6", "M6", "m7", "M7"];
		var i;
		for(i=0; i<this.note_sequence.length; i++){
			result.push(all_labels[this.note_sequence[i]]);
		}
		return result;
	}

	getLabel(note) {
		let all_labels = ["R", "m2", "M2", "m3", "M3", "P4", "TT", "P5", "m6", "M6", "m7", "M7"];
		if(note.midi_value >= this.root_note.midi_value) {
			return all_labels[(note.midi_value - this.root_note.midi_value) % 12];
		} else {
			return all_labels[(12 - (this.root_note.midi_value - note.midi_value)) % 12];
		}
	}

	getStructure() {
		let result = [];
		let all_labels = ["Root", "minor 2nd", "Mahor 2nd", "minor 3rd", "Major 3rd", "Fourth",
											"Tritone", "Fifth", "minor 6th", "Major 6th", "minor 7th", "Major 7th"];
		var i;
		for(i=0; i<=this.note_sequence.length; i++){
			result.push(all_labels[this.note_sequence[i]]);
		}
		return result;
	}

	toString() {
		return  this.root_note.note_name.type + " " + this.type;
	}
}

module.exports = Scale;