const tuner = {
  FFT_SIZE: 2048,
  USER_MEDIA_CONSTRAINTS: {
    audio: {
      mandatory: {
        googEchoCancellation: 'false',
        googAutoGainControl: 'false',
        googNoiseSuppression: 'false',
        googHighpassFilter: 'false',
      },
      optional: [],
    },
  },
  NOTES: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  CONCERT_PITCH: 440, //frequency of a fixed note, which is used as a standard for tuning. It is usually a standard (also called concert) pitch of 440 Hz, which is called A440 or note A in the one-line (or fourth) octave (A4)
  MIDI: 69, // the MIDI note number of A4
  A: 2 ** (1 / 12), // the twelth root of 2 = the number which when multiplied by itself 12 times equals 2 = 1.059463094359...
  C0_PITCH: 16.35, // frequency of lowest note: C0
  THRES: 0.02,



};

// Implements modified ACF2+ algorithm
// Source: https://github.com/cwilso/PitchDetect
tuner.autoCorrelate = (buf, sampleRate) => {
  // Not enough signal check
  const RMS = Math.sqrt(buf.reduce((acc, el) => acc + el ** 2, 0) / buf.length)
  if (RMS < 0.01)  {
    return NaN
  }

  let r1 = 0
  let r2 = buf.length - 1
  for (let i = 0; i < buf.length / 2; ++i) {
    if (Math.abs(buf[i]) < tuner.THRES) {
      r1 = i
      break
    }
  }
  for (let i = 1; i < buf.length / 2; ++i) {
    if (Math.abs(buf[buf.length - i]) < tuner.THRES) {
      r2 = buf.length - i
      break
    }
  }

  const buf2 = buf.slice(r1, r2)
  const c = new Array(buf2.length).fill(0)
  for (let i = 0; i < buf2.length; ++i) {
    for (let j = 0; j < buf2.length - i; ++j) {
      c[i] = c[i] + buf2[j] * buf2[j + i]
    }
  }

  let d = 0
  for (; c[d] > c[d + 1]; ++d);

  let maxval = -1
  let maxpos = -1
  for (let i = d; i < buf2.length; ++i) {
    if (c[i] > maxval) {
      maxval = c[i]
      maxpos = i
    }
  }
  let T0 = maxpos

  let x1 = c[T0 - 1]
  let x2 = c[T0]
  let x3 = c[T0 + 1]
  let a = (x1 + x3 - 2 * x2) / 2
  let b = (x3 - x1) / 2

  return sampleRate / (a ? T0 - b / (2 * a) : T0)
}

tuner.getDataFromFrequency = (frequency) => {
  const N = Math.round(12 * Math.log2(frequency / tuner.CONCERT_PITCH)) // the number of half steps away from the fixed note you are. If you are at a higher note, n is positive. If you are on a lower note, n is negative.
  const Fn = tuner.CONCERT_PITCH * tuner.A ** N // the frequency of the note n half steps away of concert pitch
  const noteIndex = (N + tuner.MIDI) % 12 // index of note letter from NOTES array
  const octave = Math.floor(Math.log2(Fn / tuner.C0_PITCH))
  var cents = tuner.calculateCents(frequency, Fn);
  cents = tuner.adjustCentsError(cents, tuner.NOTES[noteIndex], octave);

  return {
    frequency,
    note: tuner.NOTES[noteIndex],
    noteFrequency: Fn,
    deviation: frequency - Fn,
    cents,
    octave,
  }
}

tuner.getAverageVolume = (buf) => {
  let sum = 0;
  for (let i = 0; i < buf.length; ++i) {
    sum += Math.abs(buf[i]);
  }
  return Math.sqrt(sum / buf.length);
}

tuner.calculateCents = (f1, f2) => {
  if (f1 === undefined || f2 === undefined) {
    return undefined;
  }
  return Math.floor(1200 * Math.log2(f1/f2));
}

// A0 to C8
tuner.errorMap = {
  0: {
    'A': 0, 
    'A#': 0, 
    'B': 0
  },
  1 : {
    'C': 0, 
    'C#': 0,
    'D': 0, 
    'D#': 0, 
    'E': 0, 
    'F': 0, 
    'F#': 0, 
    'G': 0, 
    'G#': 0, 
    'A': 0, 
    'A#': 0, 
    'B': 0
  },
  2 : {
    'C': 0, 
    'C#': 0,
    'D': 0, 
    'D#': 0, 
    'E': 0, 
    'F': 0, 
    'F#': 0, 
    'G': 0, 
    'G#': 0, 
    'A': 0, 
    'A#': 0, 
    'B': 0
  },
  3 : {
    'C': 1, 
    'C#': 1,
    'D': 1, 
    'D#': 1, 
    'E': 1, 
    'F': 1, 
    'F#': 1, 
    'G': 1, 
    'G#': 1, 
    'A': 1, 
    'A#': 1, 
    'B': 0
  },
  4 : {
    'C': 1, 
    'C#': 1,
    'D': 1, 
    'D#': 1, 
    'E': 1, 
    'F': 1, 
    'F#': 1, 
    'G': 1, 
    'G#': 1, 
    'A': 1, 
    'A#': 1, 
    'B': 1
  },
  5 : {
    'C': 0, 
    'C#': 1,
    'D': 1, 
    'D#': 1, 
    'E': 1, 
    'F': 1, 
    'F#': 1, 
    'G': 1, 
    'G#': 1, 
    'A': 1, 
    'A#': 1, 
    'B': 1
  },
  6 : {
    'C': 1, 
    'C#': 0,
    'D': 0, 
    'D#': 0, 
    'E': 0, 
    'F': 0, 
    'F#': 0, 
    'G': 0, 
    'G#': 0, 
    'A': 0, 
    'A#': 0, 
    'B': 0
  },
  7 : {
    'C': 0, 
    'C#': 0,
    'D': 0, 
    'D#': 0, 
    'E': 0, 
    'F': 0, 
    'F#': 0, 
    'G': 0, 
    'G#': 0, 
    'A': 0, 
    'A#': 0, 
    'B': 0
  },
  8 : {
    'C': 0
  }

};

tuner.adjustCentsError = (cents, note, octave) => {

  if(octave<0||octave>8){
    return cents;
  }
  
  var errorAmount = tuner.errorMap[octave][note];
  if(errorAmount == 'undefined'){
    return cents;
  }else {
    return cents + errorAmount;
  }
}

tuner.setup = async () => {
  let rafID
  let audioContext
  let analyser
  let callbacks = []

  const init = async () => {
    const stream = await navigator.mediaDevices.getUserMedia(
      tuner.USER_MEDIA_CONSTRAINTS
    )
    audioContext = new AudioContext()
    analyser = audioContext.createAnalyser()
    analyser.fftSize = tuner.FFT_SIZE
    analyser.smoothingTimeConstant = 0.4;
    audioContext.createMediaStreamSource(stream).connect(analyser)
  }

  const update = () => {
    const buffer = new Float32Array(tuner.FFT_SIZE)
    analyser.getFloatTimeDomainData(buffer)
    const frequency = tuner.autoCorrelate(buffer, audioContext.sampleRate)

    let data = frequency ? tuner.getDataFromFrequency(frequency) : {}

    data.volume = tuner.getAverageVolume(buffer);
    data.decibels = 20 * Math.log(data.volume);
    

    callbacks.forEach((fn) =>
        fn(data)
    )
    rafID = requestAnimationFrame(update)
  }

  await init()

  return {
    start: () => update(),
    stop: () => cancelAnimationFrame(rafID),
    subscribe: (fn) => (callbacks = [...callbacks, fn]),
    unsubscribe: (fn) => (callbacks = callbacks.filter((el) => el !== fn)),
  }
}

tuner.tunerObject = undefined;
tuner.average_cents = new Queue();
tuner.average_cents_length = 40;
tuner.uiCleared = false;

tuner.callback = (data) => {

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


  if (data.frequency !== undefined && data.volume >= model.threshold) {

    tuner.uiCleared = false;

    //$("output").innerHTML = " : " + data.note + data.octave + ' V:' + data.volume//+ " " + parsecents + "c " //+
      //data.noteFrequency + " " + data.frequency + " " + data.deviation;

    volumeView.drawVolume(data.volume);

    var note = findNote(data.note, data.octave);


    if (note !== undefined) {

      //log.i('note found with freq' + note.frequency + " --> "+ data.frequency);

      tuner.average_cents.enqueue(data.cents);

      var cents = data.cents;

      let color = getCentsColor(cents);
      let midiValue = note.midi_value

      updateUITuneIndicator(cents, color)


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

      if(tuner.average_cents.length() == tuner.average_cents_length){

        let cents = Math.floor(getAverage(tuner.average_cents.toArray()));
        let color = getCentsColor(cents);
        centsView.drawAverageCents(cents, color);
        tuner.average_cents.dequeue();
      }

    } else {
      
      log.e('note is undefined with freq' + data.frequency)
      
    }
  } else {

    if(!tuner.uiCleared){
      log.i('freq is undefined, clearing state')

      tuner.average_cents.clear();
      pianoView.clearHover();
      fretboardView.clearHover();
      centsView.clear();
      volumeView.drawVolume(0);

      clearUITuneIndicator()
      tuner.uiCleared = true;
    }
  } 
}

startAndSubscribeTuner = () => {
  ;(async function () {
    try {
      tuner.tunerObject = await tuner.setup()
      tuner.tunerObject.start()
      tuner.tunerObject.subscribe(tunerCallback);
    } catch (error) {
      tuner.tunerObject = undefined;
    }
  })()
}
