// Gamification Module - Xếp hạng, Huy hiệu, 35 Mini-games, Cửa hàng đặc quyền & Góc Kudos

class GamificationManager {
  constructor() {
    this.badWords = ['chửi', 'đánh', 'ngu', 'dốt', 'bậy', 'xấu', 'ghét', 'bắt nạt', 'tẩy chay'];
  }

  // Lọc từ ngữ văn minh cho góc Kudos
  filterProfanity(text) {
    let cleanText = text;
    this.badWords.forEach(word => {
      const reg = new RegExp(word, 'gi');
      cleanText = cleanText.replace(reg, '***');
    });
    return cleanText;
  }

  // Đổi đặc quyền lớp học (Class Perk)
  redeemPerk(studentId, perkId) {
    const student = window.store.getStudentById(studentId);
    const perk = window.store.state.perks.find(p => p.id === perkId);

    if (!student || !perk) return { success: false, msg: 'Dữ liệu không hợp lệ' };
    if (student.conductScore < perk.cost) {
      return { success: false, msg: `Bạn cần tối thiểu ${perk.cost} điểm rèn luyện (Hiện có: ${student.conductScore}đ)` };
    }

    // Trừ điểm thi đua hoặc điểm tích lũy đổi quà
    window.store.recordEmulationPoint({
      actor: 'Hệ thống Đổi quà Đặc quyền',
      studentId: student.id,
      pointDelta: -perk.cost,
      reason: `Đổi đặc quyền lớp học: ${perk.name}`
    });

    return {
      success: true,
      msg: `Đổi thành công "${perk.name}"! Vui lòng liên hệ Lớp trưởng hoặc GVCN để nhận đặc quyền.`
    };
  }

  // Nộp câu trả lời Mini-game tuần
  submitWeeklyGame(weekNumber, answers, studentId) {
    const game = window.store.state.minigames.find(g => g.week === weekNumber);
    if (!game) return null;

    let score = 0;
    game.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) {
        score += 1;
      }
    });

    const isPassed = score === game.questions.length;
    let earnedPoints = isPassed ? game.rewardPoints : Math.round(game.rewardPoints / 2);

    if (studentId) {
      window.store.recordEmulationPoint({
        actor: `Hệ thống Mini-game Tuần ${weekNumber}`,
        studentId,
        pointDelta: earnedPoints,
        reason: `Hoàn thành Mini-game Tuần ${weekNumber} (${score}/${game.questions.length} câu đúng)`
      });
    }

    return {
      week: weekNumber,
      correctCount: score,
      totalQuestions: game.questions.length,
      earnedPoints,
      isPassed,
      explanation: isPassed ? 'Xuất sắc! Bạn đã trả lời đúng 100% câu hỏi của tuần này.' : 'Khá tốt! Hãy đọc kỹ giải thích để củng cố thêm kiến thức nhé.'
    };
  }

  // Lấy danh sách Top Thi đua
  getLeaderboard() {
    const students = [...window.store.getStudents()];
    students.sort((a, b) => b.conductScore - a.conductScore);
    return students;
  }
}

window.gamification = new GamificationManager();
