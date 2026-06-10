Run file:

//Install http-server (nodeJs)
npm install -g http-server

//Start Server
http-server

//Immediate Update
npm install -g live-server

//Check version
live-server --version

//Run live-server
live-server
live-server --port=3000

//Additional Steps to Troubleshoot
npm cache clean --force


# Page:
http://localhost:3000
http://127.0.0.1:3000/text-to-speech.html

# Text-to-Speech 文字轉語音應用

使用 Web Speech API 的 SpeechSynthesis 介面建立的文字轉語音網站應用。

## 功能特色

- ✅ 將文字轉換為語音播放
- 🎙️ 支援多種語音選擇（依瀏覽器和作業系統而定）
- 🌟 **自動優先選擇 Google 女聲**（在 Chrome 瀏覽器中）
- ⚙️ 可調整語速、音調和音量
- ⏯️ 支援播放、暫停、繼續和停止控制
- ⌨️ 鍵盤快捷鍵支援
- 📱 響應式設計，支援行動裝置

## 使用方式

1. 在文字區域輸入您想要轉換的文字
2. 選擇想要使用的語音（**Google 語音會優先顯示在列表最上方**）
3. 調整語速、音調和音量（可選）
4. 點擊「開始播放」按鈕或按 `Ctrl+Enter`
5. 使用暫停、繼續或停止按鈕控制播放

### 語音選擇

程式會按照以下優先順序自動選擇語音：
1. 🥇 Google 中文女聲
2. 🥈 Google 中文語音
3. 🥉 Google 英文女聲
4. Google 英文語音
5. 其他中文語音

在下拉選單中，Google 語音會被分組在「🎙️ Google 語音（推薦）」區塊中。

## 鍵盤快捷鍵

- `Ctrl/Cmd + Enter` - 開始播放
- `Escape` - 停止播放

## 技術說明

### Web Speech API

本應用使用 [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) 的 SpeechSynthesis 介面：

- **SpeechSynthesis** - 控制語音合成的介面
- **SpeechSynthesisUtterance** - 代表一段語音請求
- **SpeechSynthesisVoice** - 代表系統支援的語音

### 主要 API 使用

```javascript
// 取得語音合成物件
const synth = window.speechSynthesis;

// 建立語音內容
const utterance = new SpeechSynthesisUtterance('要說的文字');

// 設定參數
utterance.rate = 1;      // 語速 (0.1 - 10)
utterance.pitch = 1;     // 音調 (0 - 2)
utterance.volume = 1;    // 音量 (0 - 1)

// 開始播放
synth.speak(utterance);

// 控制播放
synth.pause();    // 暫停
synth.resume();   // 繼續
synth.cancel();   // 停止
```

## 瀏覽器支援

- ✅ Chrome/Edge (完整支援)
- ✅ Safari (完整支援)
- ✅ Firefox (完整支援)
- ❌ IE (不支援)

## 檔案結構

```
web-speech-api/
├── index.html      # 主要 HTML 結構
├── style.css       # 樣式設計
├── script.js       # JavaScript 邏輯
└── README.md       # 說明文件
```

## 如何執行

1. 直接開啟 `index.html` 檔案，或
2. 使用本地伺服器（推薦）：
   ```bash
   # 使用 Python
   python -m http.server 8000
   
   # 使用 Node.js (http-server)
   npx http-server
   
   # 使用 VS Code Live Server 擴充套件
   ```

3. 在瀏覽器中開啟 `http://localhost:8000`

## 參考資料

- [MDN - Using the Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API)
- [MDN - SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
- [MDN - SpeechSynthesisUtterance](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance)

## 授權

MIT License
