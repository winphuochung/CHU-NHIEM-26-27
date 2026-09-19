// Voice Assistant Module - Trợ lý ảo giọng nói tiếng Việt cho Lớp 9A1 Phước Hưng

class VoiceAssistant {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.synth = window.speechSynthesis;
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'vi-VN';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('[Voice AI] Đã nghe:', transcript);
        this.processVoiceCommand(transcript);
      };

      this.recognition.onerror = (event) => {
        console.warn('[Voice AI] Lỗi nhận diện giọng nói:', event.error);
        this.isListening = false;
        this.updateMicUI(false);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.updateMicUI(false);
      };
    }
  }

  toggleListening() {
    if (!this.recognition) {
      this.speak('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói Web Speech. Bạn có thể sử dụng tìm kiếm văn bản thay thế.');
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.updateMicUI(false);
    } else {
      try {
        this.recognition.start();
        this.isListening = true;
        this.updateMicUI(true);
      } catch (e) {
        console.warn('Lỗi bật micro:', e);
      }
    }
  }

  updateMicUI(isActive) {
    const btn = document.getElementById('voice-mic-btn');
    const statusText = document.getElementById('voice-status-text');
    if (btn) {
      if (isActive) {
        btn.classList.add('bg-red-500', 'animate-pulse');
        btn.classList.remove('bg-blue-600');
        if (statusText) statusText.innerText = 'Đang lắng nghe bạn nói...';
      } else {
        btn.classList.remove('bg-red-500', 'animate-pulse');
        btn.classList.add('bg-blue-600');
        if (statusText) statusText.innerText = 'Nhấn vào micro để ra lệnh giọng nói';
      }
    }
  }

  // Xử lý câu lệnh ngôn ngữ tự nhiên
  processVoiceCommand(cmd) {
    let reply = '';
    const clean = cmd.trim().toLowerCase();

    if (clean.includes('trực nhật') || clean.includes('ai trực') || clean.includes('hôm nay')) {
      const schedule = window.store.getDutySchedule();
      const today = new Date().getDay();
      const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const cur = dayNames[today] || 'Thứ Hai';
      const item = schedule.find(s => s.day === cur) || schedule[0];
      reply = `Hôm nay là ${cur}. Tổ ${item.to} phụ trách trực nhật: ${item.tasks}.`;
    } else if (clean.includes('đếm ngược') || clean.includes('thi vào 10') || clean.includes('kỳ thi') || clean.includes('bao nhiêu ngày')) {
      const targetTime = new Date('2027-06-05T07:30:00').getTime();
      const distance = targetTime - new Date().getTime();
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      reply = `Còn đúng ${days} ngày nữa là đến kỳ thi Tuyển sinh vào lớp 10 năm 2027. Hãy cố gắng ôn tập thật tốt nhé!`;
    } else if (clean.includes('nội quy') || clean.includes('đi trễ') || clean.includes('đồng phục')) {
      reply = 'Nội quy trường Phước Hưng quy định: Đi học muộn sau 6 giờ 45 trừ 2 điểm. Nghỉ học không phép trừ 10 điểm. Không đeo khăn quàng hoặc sai đồng phục trừ 2 điểm.';
    } else if (clean.includes('sơ đồ') || clean.includes('chỗ ngồi') || clean.includes('lớp')) {
      reply = 'Sơ đồ lớp 9A1 gồm 4 dãy bàn cho 4 tổ. Lớp trưởng Trình Minh Thiện ngồi tổ 2, Lớp phó Học tập Đỗ Thị Thùy Linh ngồi tổ 1.';
    } else if (clean.includes('xin chào') || clean.includes('hello') || clean.includes('bạn là ai')) {
      reply = 'Xin chào thầy cô và các bạn lớp 9A1 Phước Hưng! Mình là Trợ lý số 9A1, sẵn sàng hỗ trợ tra cứu nội quy, lịch trực nhật, đếm ngược thi cử và thi đua.';
    } else {
      reply = `Bạn vừa hỏi: "${cmd}". Bạn có thể hỏi mình về: lịch trực nhật hôm nay, đếm ngược thi vào 10, hoặc nội quy lớp học.`;
    }

    this.speak(reply);
    const resultBox = document.getElementById('voice-result-box');
    if (resultBox) {
      resultBox.innerHTML = `
        <div class="p-3 bg-blue-50 dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-slate-700 text-sm">
          <p class="font-semibold text-blue-800 dark:text-blue-300">🎙️ Bạn: "${cmd}"</p>
          <p class="text-slate-700 dark:text-slate-300 mt-1">🤖 Trợ lý: ${reply}</p>
        </div>
      `;
    }
  }

  // Đọc câu trả lời bằng giọng nói tiếng Việt mượt mà
  speak(text) {
    if (!this.synth) return;
    this.synth.cancel(); // Dừng câu trước nếu đang nói
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = 'vi-VN';
    utterThis.rate = 1.0;
    utterThis.pitch = 1.0;

    // Tìm giọng tiếng Việt nếu có
    const voices = this.synth.getVoices();
    const viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VN'));
    if (viVoice) utterThis.voice = viVoice;

    this.synth.speak(utterThis);
  }
}

window.voiceAssistant = new VoiceAssistant();
