/**
 * 实时对线助手
 * 使用阿里云 Paraformer 语音识别（通过后端 WebSocket 代理）
 */

class RealtimeAssistant {
  constructor() {
    this.websocket = null;
    this.mediaRecorder = null;
    this.audioContext = null;
    this.isRecording = false;
    this.currentStyle = 'gentle';
    this.currentAttitude = 'decline';  // 当前选择的态度
    this.apiEndpoint = window.API_CONFIG ? window.API_CONFIG.getChatUrl() : '/api/chat';
    this.wsEndpoint = this.getWebSocketEndpoint();
    this.history = [];
    this.currentTranscript = '';
    this.audioStream = null;
    this.waitingForAttitude = false;  // 是否在等待用户选择态度

    this.elements = {
      recordBtn: document.getElementById('recordBtn'),
      recordHint: document.getElementById('recordHint'),
      transcriptContent: document.getElementById('transcriptContent'),
      interimText: document.getElementById('interimText'),
      suggestionArea: document.getElementById('suggestionArea'),
      suggestionContent: document.getElementById('suggestionContent'),
      suggestionActions: document.getElementById('suggestionActions'),
      refreshBtn: document.getElementById('refreshBtn'),
      copyBtn: document.getElementById('copyBtn'),
      speakBtn: document.getElementById('speakBtn'),
      connectionStatus: document.getElementById('connectionStatus'),
      historyToggle: document.getElementById('historyToggle'),
      historyList: document.getElementById('historyList'),
      errorModal: document.getElementById('errorModal'),
      errorMessage: document.getElementById('errorMessage'),
      errorBtn: document.getElementById('errorBtn'),
      loadingOverlay: document.getElementById('loadingOverlay'),
      attitudeSelector: document.getElementById('attitudeSelector')
    };

    this.init();
  }

  getWebSocketEndpoint() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname === 'localhost' ||
                 window.location.hostname === '127.0.0.1' ||
                 window.location.protocol === 'file:'
      ? 'localhost:3000'
      : window.location.host;
    return `${protocol}//${host}/api/speech`;
  }

  init() {
    this.checkBrowserSupport();
    this.bindEvents();
    this.loadHistory();
  }

  checkBrowserSupport() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.showError('您的浏览器不支持录音功能，请使用 Chrome 或 Safari 浏览器');
      this.elements.recordBtn.disabled = true;
      this.elements.recordHint.textContent = '当前浏览器不支持录音';
      return false;
    }
    return true;
  }

  bindEvents() {
    this.elements.recordBtn.addEventListener('click', () => {
      if (this.isRecording) {
        this.stopRecording();
      } else {
        this.startRecording();
      }
    });

    document.querySelectorAll('.style-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.currentStyle = btn.dataset.style;
      });
    });

    // 态度按钮点击事件（动态绑定）
    this.elements.attitudeSelector.addEventListener('click', (e) => {
      const btn = e.target.closest('.attitude-btn');
      if (btn && this.waitingForAttitude) {
        this.currentAttitude = btn.dataset.attitude;
        this.waitingForAttitude = false;
        this.elements.attitudeSelector.style.display = 'none';
        this.getSuggestion(this.currentTranscript, this.currentAttitude);
      }
    });

    this.elements.refreshBtn.addEventListener('click', () => {
      if (this.currentTranscript) {
        // 重新显示态度选择
        this.showAttitudeSelector();
      }
    });

    this.elements.copyBtn.addEventListener('click', () => {
      const text = this.elements.suggestionContent.textContent;
      navigator.clipboard.writeText(text).then(() => {
        this.showToast('已复制到剪贴板');
      }).catch(() => {
        this.showToast('复制失败');
      });
    });

    this.elements.speakBtn.addEventListener('click', () => {
      const text = this.elements.suggestionContent.textContent;
      this.speak(text);
    });

    this.elements.historyToggle.addEventListener('click', () => {
      const isExpanded = this.elements.historyList.style.display !== 'none';
      this.elements.historyList.style.display = isExpanded ? 'none' : 'block';
      this.elements.historyToggle.classList.toggle('expanded', !isExpanded);
    });

    this.elements.errorBtn.addEventListener('click', () => {
      this.elements.errorModal.style.display = 'none';
    });
  }

  async startRecording() {
    if (this.isRecording) return;

    try {
      // 获取麦克风权限
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      console.log('Microphone access granted');

      // 连接 WebSocket
      this.websocket = new WebSocket(this.wsEndpoint);

      this.websocket.onopen = async () => {
        console.log('WebSocket connected');
        this.updateStatus('recording', '正在录音');
        this.isRecording = true;
        this.updateRecordingUI(true);

        // 开始录音
        await this.startAudioRecording();
      };

      this.websocket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message:', data);

          if (data.error) {
            this.showToast(data.error);
            this.stopRecording();
            return;
          }

          if (data.status === 'connected') {
            console.log('Speech recognition connected');
            return;
          }

          if (data.text) {
            if (data.is_final) {
              // 最终结果 - 显示态度选择器
              this.currentTranscript = data.text;
              this.displayTranscript(data.text);
              this.elements.interimText.textContent = '';
              this.showAttitudeSelector();
            } else {
              // 中间结果
              this.elements.interimText.textContent = data.text;
            }
          }
        } catch (e) {
          console.error('Parse message error:', e);
        }
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.showToast('语音识别连接失败');
        this.stopRecording();
      };

      this.websocket.onclose = () => {
        console.log('WebSocket closed');
        if (this.isRecording) {
          this.stopRecording();
        }
      };

    } catch (error) {
      console.error('Start recording error:', error);
      if (error.name === 'NotAllowedError') {
        this.showError('请允许访问麦克风权限');
      } else if (error.name === 'NotFoundError') {
        this.showError('未找到麦克风设备');
      } else {
        this.showError('启动录音失败: ' + error.message);
      }
    }
  }

  async startAudioRecording() {
    try {
      // 使用 AudioContext 进行音频处理
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000
      });

      const source = this.audioContext.createMediaStreamSource(this.audioStream);
      const processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(this.audioContext.destination);

      processor.onaudioprocess = (event) => {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
          const inputData = event.inputBuffer.getChannelData(0);
          // 转换为 16-bit PCM
          const pcmData = this.float32ToPCM16(inputData);
          this.websocket.send(pcmData);
        }
      };

      this.processor = processor;
      this.source = source;

      console.log('Audio recording started');
    } catch (error) {
      console.error('Audio recording error:', error);
      throw error;
    }
  }

  float32ToPCM16(float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  }

  stopRecording() {
    this.isRecording = false;
    this.updateRecordingUI(false);
    this.updateStatus('ready', '准备就绪');

    // 停止音频处理
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }

    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    // 停止麦克风
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }

    // 关闭 WebSocket
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    console.log('Recording stopped');
  }

  updateRecordingUI(isRecording) {
    this.elements.recordBtn.classList.toggle('recording', isRecording);
    this.elements.recordBtn.querySelector('.record-text').textContent =
      isRecording ? '停止' : '开始录音';
    this.elements.recordBtn.querySelector('.record-icon').textContent =
      isRecording ? '⏹️' : '🎤';
  }

  updateStatus(status, text) {
    const statusDot = this.elements.connectionStatus.querySelector('.status-dot');
    const statusText = this.elements.connectionStatus.querySelector('.status-text');

    statusDot.className = 'status-dot';
    if (status === 'recording') {
      statusDot.classList.add('recording');
    } else if (status === 'error') {
      statusDot.classList.add('error');
    }

    statusText.textContent = text;
  }

  displayTranscript(text) {
    this.elements.transcriptContent.innerHTML = `<p>${text}</p>`;
  }

  showAttitudeSelector() {
    // 显示态度选择器，等待用户选择
    this.waitingForAttitude = true;
    this.elements.attitudeSelector.style.display = 'block';
    this.elements.suggestionContent.innerHTML = '<p class="suggestion-placeholder">请选择回应态度...</p>';
    this.elements.suggestionActions.style.display = 'none';
    this.elements.refreshBtn.style.display = 'none';
  }

  async getSuggestion(text, attitude = 'decline') {
    if (!text || text.length < 2) return;

    this.showLoading(true);

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          style: this.currentStyle,
          attitude: attitude
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      this.displaySuggestion(data.suggestion, text);

    } catch (error) {
      console.error('Get suggestion error:', error);
      const fallbackSuggestion = this.getFallbackSuggestion(text, attitude);
      this.displaySuggestion(fallbackSuggestion, text);
    } finally {
      this.showLoading(false);
    }
  }

  getFallbackSuggestion(text, attitude = 'decline') {
    const fallbacks = {
      decline: {
        gentle: [
          '谢谢阿姨关心，我现在工作太忙了，这事以后再说吧~',
          '我也想啊，但圈子太小了，遇不到合适的~',
        ],
        humor: [
          '哈哈，我这不是在努力赚钱嘛，先立业再成家~',
          '要不您帮我物色物色？我这确实没渠道~',
        ],
        rational: [
          '现在工作压力大，想先把事业稳定下来~',
          '我想遇到合适的人再结婚，不想将就~',
        ],
      },
      accept: {
        gentle: [
          '谢谢阿姨提醒，我最近会多留意这方面的~',
          '您说得对，我确实该主动一点了~',
        ],
        humor: [
          '哈哈，那我最近多出去转转，看看能不能遇到~',
          '行，您帮我留意一下，有机会我就去见见~',
        ],
        rational: [
          '您说得有道理，我最近确实在考虑这个问题~',
          '已经在看了，有合适的会主动接触~',
        ],
      }
    };

    const attitudeFallbacks = fallbacks[attitude] || fallbacks.decline;
    const styleFallbacks = attitudeFallbacks[this.currentStyle] || attitudeFallbacks.gentle;
    return styleFallbacks[Math.floor(Math.random() * styleFallbacks.length)];
  }

  displaySuggestion(suggestion, originalText) {
    this.elements.suggestionContent.innerHTML = `<p>${suggestion}</p>`;
    this.elements.suggestionContent.classList.remove('suggestion-placeholder');
    this.elements.suggestionActions.style.display = 'flex';
    this.elements.refreshBtn.style.display = 'block';
    this.addToHistory(originalText, suggestion);
  }

  addToHistory(question, answer) {
    this.history.unshift({ question, answer, time: new Date() });
    if (this.history.length > 20) this.history.pop();
    this.saveHistory();
    this.renderHistory();
  }

  renderHistory() {
    if (this.history.length === 0) {
      this.elements.historyList.innerHTML = '<p class="history-empty">暂无对话记录</p>';
      return;
    }

    this.elements.historyList.innerHTML = this.history.map(item => `
      <div class="history-item">
        <div class="history-question">🗣️ ${item.question}</div>
        <div class="history-answer">💡 ${item.answer}</div>
      </div>
    `).join('');
  }

  saveHistory() {
    try {
      localStorage.setItem('realtime_history', JSON.stringify(this.history));
    } catch (e) {
      console.error('Save history error:', e);
    }
  }

  loadHistory() {
    try {
      const saved = localStorage.getItem('realtime_history');
      if (saved) {
        this.history = JSON.parse(saved);
        this.renderHistory();
      }
    } catch (e) {
      console.error('Load history error:', e);
    }
  }

  speak(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      this.showToast('正在朗读...');
    } else {
      this.showToast('您的浏览器不支持语音合成');
    }
  }

  showError(message) {
    this.elements.errorMessage.textContent = message;
    this.elements.errorModal.style.display = 'flex';
  }

  showLoading(show) {
    this.elements.loadingOverlay.style.display = show ? 'flex' : 'none';
  }

  showToast(message) {
    const existingToast = document.querySelector('.realtime-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'realtime-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  window.assistant = new RealtimeAssistant();
});
