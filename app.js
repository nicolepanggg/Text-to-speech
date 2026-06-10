const textInput = document.getElementById('text-input');
const voiceSelect = document.getElementById('voice-select');
const rateInput = document.getElementById('rate');
const pitchInput = document.getElementById('pitch');
const volumeInput = document.getElementById('volume');
const rateValue = document.getElementById('rate-value');
const pitchValue = document.getElementById('pitch-value');
const volumeValue = document.getElementById('volume-value');
const speakBtn = document.getElementById('speak-btn');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const stopBtn = document.getElementById('stop-btn');
const status = document.getElementById('status');

const synth = window.speechSynthesis;
let voices = [];

// Populate voice list
function populateVoices() {
  voices = synth.getVoices();
  voiceSelect.innerHTML = '';

  if (voices.length === 0) {
    const option = document.createElement('option');
    option.textContent = 'No voices available';
    voiceSelect.appendChild(option);
    return;
  }

  voices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    if (voice.default) {
      option.selected = true;
    }
    voiceSelect.appendChild(option);
  });
}

populateVoices();
// Voices may load asynchronously
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = populateVoices;
}

// Slider live value display
rateInput.addEventListener('input', () => {
  rateValue.textContent = rateInput.value;
});

pitchInput.addEventListener('input', () => {
  pitchValue.textContent = pitchInput.value;
});

volumeInput.addEventListener('input', () => {
  volumeValue.textContent = volumeInput.value;
});

// Update button states
function setButtonStates({ speaking, paused }) {
  speakBtn.disabled = speaking;
  pauseBtn.disabled = !speaking || paused;
  resumeBtn.disabled = !paused;
  stopBtn.disabled = !speaking;
}

function setStatus(message) {
  status.textContent = message;
}

// Speak
speakBtn.addEventListener('click', () => {
  const text = textInput.value.trim();
  if (!text) {
    setStatus('Please enter some text first.');
    return;
  }

  // Cancel any ongoing speech
  if (synth.speaking) {
    synth.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);

  const voiceIndex = parseInt(voiceSelect.value, 10);
  if (!isNaN(voiceIndex) && voices[voiceIndex]) {
    utterance.voice = voices[voiceIndex];
  }

  utterance.rate = parseFloat(rateInput.value);
  utterance.pitch = parseFloat(pitchInput.value);
  utterance.volume = parseFloat(volumeInput.value);

  utterance.onstart = () => {
    setButtonStates({ speaking: true, paused: false });
    setStatus('Speaking...');
  };

  utterance.onpause = () => {
    setButtonStates({ speaking: true, paused: true });
    setStatus('Paused.');
  };

  utterance.onresume = () => {
    setButtonStates({ speaking: true, paused: false });
    setStatus('Speaking...');
  };

  utterance.onend = () => {
    setButtonStates({ speaking: false, paused: false });
    setStatus('Done.');
  };

  utterance.onerror = (event) => {
    setButtonStates({ speaking: false, paused: false });
    setStatus(`Error: ${event.error}`);
  };

  synth.speak(utterance);
});

// Pause
pauseBtn.addEventListener('click', () => {
  if (synth.speaking && !synth.paused) {
    synth.pause();
  }
});

// Resume
resumeBtn.addEventListener('click', () => {
  if (synth.paused) {
    synth.resume();
  }
});

// Stop
stopBtn.addEventListener('click', () => {
  if (synth.speaking || synth.paused) {
    synth.cancel();
    setButtonStates({ speaking: false, paused: false });
    setStatus('Stopped.');
  }
});
