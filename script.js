// 檢查瀏覽器是否支援 Web Speech API
if ('speechSynthesis' in window) {
    console.log('✅ Web Speech API 支援');
} else {
    alert('❌ 您的瀏覽器不支援 Web Speech API');
}

// 取得 DOM 元素
const textInput = document.getElementById('text-input');
const voiceSelect = document.getElementById('voice-select');
const rateInput = document.getElementById('rate-input');
const pitchInput = document.getElementById('pitch-input');
const volumeInput = document.getElementById('volume-input');
const rateValue = document.getElementById('rate-value');
const pitchValue = document.getElementById('pitch-value');
const volumeValue = document.getElementById('volume-value');
const speakBtn = document.getElementById('speak-btn');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const stopBtn = document.getElementById('stop-btn');
const status = document.getElementById('status');

// 語音合成物件
const synth = window.speechSynthesis;
let voices = [];
let currentUtterance = null;

// 載入可用的語音
function loadVoices() {
    voices = synth.getVoices();
    
    // 清空選項
    voiceSelect.innerHTML = '';
    
    // 分類語音：Google 語音優先
    const googleVoices = [];
    const otherVoices = [];
    
    voices.forEach((voice, index) => {
        if (voice.name.toLowerCase().includes('google')) {
            googleVoices.push({ voice, index });
        } else {
            otherVoices.push({ voice, index });
        }
    });
    
    // 先加入 Google 語音（加上特殊標記）
    if (googleVoices.length > 0) {
        const googleGroup = document.createElement('optgroup');
        googleGroup.label = '🎙️ Google 語音（推薦）';
        
        googleVoices.forEach(({ voice, index }) => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.setAttribute('data-lang', voice.lang);
            option.setAttribute('data-name', voice.name);
            option.value = index;
            googleGroup.appendChild(option);
        });
        
        voiceSelect.appendChild(googleGroup);
    }
    
    // 再加入其他語音
    if (otherVoices.length > 0) {
        const otherGroup = document.createElement('optgroup');
        otherGroup.label = '其他語音';
        
        otherVoices.forEach(({ voice, index }) => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            
            if (voice.default) {
                option.textContent += ' — DEFAULT';
            }
            
            option.setAttribute('data-lang', voice.lang);
            option.setAttribute('data-name', voice.name);
            option.value = index;
            otherGroup.appendChild(option);
        });
        
        voiceSelect.appendChild(otherGroup);
    }
    
    // 智慧選擇預設語音：優先順序
    // 1. Google 中文女聲
    // 2. Google 英文女聲
    // 3. 任何中文語音
    // 4. 預設語音
    
    let selectedIndex = -1;
    
    // 優先找 Google 中文女聲
    selectedIndex = voices.findIndex(voice => 
        voice.name.toLowerCase().includes('google') && 
        (voice.lang.includes('zh') || voice.lang.includes('cmn')) &&
        voice.name.toLowerCase().includes('female')
    );
    
    // 如果沒有，找任何 Google 中文語音
    if (selectedIndex === -1) {
        selectedIndex = voices.findIndex(voice => 
            voice.name.toLowerCase().includes('google') && 
            (voice.lang.includes('zh') || voice.lang.includes('cmn'))
        );
    }
    
    // 如果沒有，找 Google 英文女聲
    if (selectedIndex === -1) {
        selectedIndex = voices.findIndex(voice => 
            voice.name.toLowerCase().includes('google') && 
            voice.lang.includes('en') &&
            voice.name.toLowerCase().includes('female')
        );
    }
    
    // 如果沒有，找任何 Google 英文語音
    if (selectedIndex === -1) {
        selectedIndex = voices.findIndex(voice => 
            voice.name.toLowerCase().includes('google') && 
            voice.lang.includes('en')
        );
    }
    
    // 如果沒有 Google 語音，找任何中文語音
    if (selectedIndex === -1) {
        selectedIndex = voices.findIndex(voice => 
            voice.lang.includes('zh') || voice.lang.includes('cmn')
        );
    }
    
    // 設定選擇的語音
    if (selectedIndex !== -1) {
        voiceSelect.value = selectedIndex;
        console.log('🎙️ 已選擇語音:', voices[selectedIndex].name);
    }
}

// 載入語音（某些瀏覽器需要時間載入）
loadVoices();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
}

// 更新滑桿數值顯示
rateInput.addEventListener('input', () => {
    rateValue.textContent = rateInput.value;
});

pitchInput.addEventListener('input', () => {
    pitchValue.textContent = pitchInput.value;
});

volumeInput.addEventListener('input', () => {
    volumeValue.textContent = volumeInput.value;
});

// 更新按鈕狀態
function updateButtons(speaking, paused) {
    speakBtn.disabled = speaking;
    pauseBtn.disabled = !speaking || paused;
    resumeBtn.disabled = !paused;
    stopBtn.disabled = !speaking;
}

// 更新狀態訊息
function updateStatus(message, type = 'info') {
    status.textContent = message;
    const statusSection = document.querySelector('.status-section');
    
    // 移除所有狀態類別
    statusSection.classList.remove('status-speaking', 'status-paused', 'status-stopped');
    
    // 根據類型添加對應的類別
    if (type === 'speaking') {
        statusSection.classList.add('status-speaking');
    } else if (type === 'paused') {
        statusSection.classList.add('status-paused');
    }
}

// 開始播放
speakBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    
    if (!text) {
        alert('請輸入要轉換的文字！');
        return;
    }
    
    // 停止當前播放
    if (synth.speaking) {
        synth.cancel();
    }
    
    // 建立新的 SpeechSynthesisUtterance
    currentUtterance = new SpeechSynthesisUtterance(text);
    
    // 設定選擇的語音
    const selectedVoice = voices[voiceSelect.value];
    if (selectedVoice) {
        currentUtterance.voice = selectedVoice;
    }
    
    // 設定參數
    currentUtterance.rate = parseFloat(rateInput.value);
    currentUtterance.pitch = parseFloat(pitchInput.value);
    currentUtterance.volume = parseFloat(volumeInput.value);
    
    // 事件監聽器
    currentUtterance.onstart = () => {
        console.log('🎤 開始播放');
        updateStatus('🎤 正在播放...', 'speaking');
        updateButtons(true, false);
    };
    
    currentUtterance.onend = () => {
        console.log('✅ 播放結束');
        updateStatus('✅ 播放完成');
        updateButtons(false, false);
    };
    
    currentUtterance.onerror = (event) => {
        console.error('❌ 發生錯誤:', event.error);
        updateStatus(`❌ 錯誤: ${event.error}`);
        updateButtons(false, false);
    };
    
    currentUtterance.onpause = () => {
        console.log('⏸️ 已暫停');
        updateStatus('⏸️ 已暫停', 'paused');
        updateButtons(true, true);
    };
    
    currentUtterance.onresume = () => {
        console.log('▶️ 繼續播放');
        updateStatus('▶️ 繼續播放...', 'speaking');
        updateButtons(true, false);
    };
    
    // 開始播放
    synth.speak(currentUtterance);
});

// 暫停播放
pauseBtn.addEventListener('click', () => {
    if (synth.speaking && !synth.paused) {
        synth.pause();
    }
});

// 繼續播放
resumeBtn.addEventListener('click', () => {
    if (synth.paused) {
        synth.resume();
    }
});

// 停止播放
stopBtn.addEventListener('click', () => {
    if (synth.speaking) {
        synth.cancel();
        updateStatus('⏹️ 已停止', 'stopped');
        updateButtons(false, false);
    }
});

// 鍵盤快捷鍵
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter: 開始播放
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!speakBtn.disabled) {
            speakBtn.click();
        }
    }
    
    // Escape: 停止播放
    if (e.key === 'Escape') {
        if (!stopBtn.disabled) {
            stopBtn.click();
        }
    }
});

// 初始化狀態
updateButtons(false, false);
updateStatus('準備就緒 - 輸入文字後按「開始播放」或使用 Ctrl+Enter');

console.log('🚀 Text-to-Speech 應用程式已載入');
console.log('📝 可用語音數量:', voices.length);
