// Exam Hub Module - Hướng nghiệp & Luyện thi vào lớp 10 (2026-2027)

class ExamHubManager {
  constructor() {
    this.timerInterval = null;
  }

  // Khởi động đồng hồ đếm ngược ngày thi vào 10
  startCountdown(targetDateStr = '2027-06-05T07:30:00', updateCallback) {
    if (this.timerInterval) clearInterval(this.timerInterval);

    const targetTime = new Date(targetDateStr).getTime();

    const tick = () => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance <= 0) {
        if (updateCallback) updateCallback({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        clearInterval(this.timerInterval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (updateCallback) {
        updateCallback({ days, hours, minutes, seconds, isPassed: false });
      }
    };

    tick();
    this.timerInterval = setInterval(tick, 1000);
  }

  // Chấm bài thi thử
  gradeExam(examId, answers) {
    const exam = window.store.state.examBank.find(e => e.id === examId);
    if (!exam) return null;

    let correctCount = 0;
    const totalQuestions = exam.questions.length;
    const reviewDetails = [];

    exam.questions.forEach((q, idx) => {
      const userAnswer = answers[idx];
      const isCorrect = userAnswer === q.correct;
      if (isCorrect) correctCount++;

      reviewDetails.push({
        questionId: q.id,
        text: q.text,
        userAnswer: userAnswer !== undefined ? q.options[userAnswer] : 'Chưa trả lời',
        correctAnswer: q.options[q.correct],
        isCorrect,
        explanation: q.exp
      });
    });

    const score10 = ((correctCount / totalQuestions) * 10).toFixed(1);

    return {
      examTitle: exam.title,
      subject: exam.subject,
      correctCount,
      totalQuestions,
      score10: parseFloat(score10),
      reviewDetails
    };
  }

  // Cập nhật nguyện vọng học sinh
  updateAspiration(studentId, { nv1, nv2, nv3 }) {
    const s = window.store.getStudentById(studentId);
    if (s) {
      s.targetHighSchool = { nv1, nv2, nv3 };
      window.store.updateStudent(studentId, { targetHighSchool: s.targetHighSchool });
      return s.targetHighSchool;
    }
    return null;
  }

  // Thống kê nguyện vọng toàn lớp
  getAsppirationsSummary() {
    const students = window.store.getStudents();
    const nv1Counts = {};

    students.forEach(s => {
      const school = s.targetHighSchool?.nv1 || 'Chưa đăng ký';
      nv1Counts[school] = (nv1Counts[school] || 0) + 1;
    });

    return nv1Counts;
  }
}

window.examHub = new ExamHubManager();
