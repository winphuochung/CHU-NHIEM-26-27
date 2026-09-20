// Workspaces Module - Digital Workspace cho từng chức danh Ban cán sự & GVCN

class WorkspaceManager {
  constructor() {
    this.ocrProcessing = false;
  }

  // 1. WORKSPACE: LỚP TRƯỞNG
  generateWeeklySummaryReport() {
    const students = window.store.getStudents();
    const currentWeek = window.store.state.currentWeek || 2;

    // Tính điểm trung bình thi đua từng tổ
    const toStats = [1, 2, 3, 4].map(toId => {
      const members = students.filter(s => s.to === toId);
      const totalScore = members.reduce((sum, m) => sum + m.conductScore, 0);
      const avgScore = (totalScore / (members.length || 1)).toFixed(1);
      const warningCount = members.filter(m => m.conductScore < 80).length;
      return {
        toId,
        memberCount: members.length,
        avgScore: parseFloat(avgScore),
        warningCount,
        members
      };
    });

    // Sắp xếp thứ hạng tổ
    toStats.sort((a, b) => b.avgScore - a.avgScore);

    const report = {
      week: currentWeek,
      date: new Date().toLocaleDateString('vi-VN'),
      reporter: 'Lớp trưởng Trình Minh Thiện',
      toStats,
      topRankTo: (toStats[0] && toStats[0].toId) || 1,
      totalViolations: ((window.store && window.store.state && window.store.state.auditLogs) || []).filter(l => l && l.action && l.action.includes('Trừ')).length,
      totalRewards: ((window.store && window.store.state && window.store.state.auditLogs) || []).filter(l => l && l.action && l.action.includes('Cộng')).length,
      status: 'Chờ GVCN phê duyệt'
    };

    return report;
  }

  // Phê duyệt báo cáo tuần từ GVCN
  approveWeeklyReport() {
    const report = this.generateWeeklySummaryReport();
    report.status = 'Đã phê duyệt bởi GVCN';
    report.approvedAt = new Date().toLocaleString('vi-VN');
    window.store.state.reportsHistory.unshift(report);
    window.store.saveState();
    return report;
  }

  // 2. WORKSPACE: LỚP PHÓ HỌC TẬP
  toggleHomeworkStatus(studentId) {
    const s = window.store.getStudentById(studentId);
    if (s) {
      s.homeworkStatus = !s.homeworkStatus;
      window.store.updateStudent(studentId, { homeworkStatus: s.homeworkStatus });
      return s.homeworkStatus;
    }
    return false;
  }

  updateStudyPairProgress(pairId, progress) {
    const pair = window.store.state.studyPairs.find(p => p.id === pairId);
    if (pair) {
      pair.progress = Math.min(100, Math.max(0, parseInt(progress)));
      window.store.saveState();
      return pair;
    }
    return null;
  }

  // 3. WORKSPACE: LỚP PHÓ TRẬT TỰ
  recordViolation({ studentId, ruleCode, note, proofImg = '' }) {
    const rule = window.store.state.emulationRules.violations.find(v => v.code === ruleCode);
    if (!rule) return false;

    const fullReason = `[${rule.severity}] ${rule.name}${note ? ': ' + note : ''}`;
    return window.store.recordEmulationPoint({
      actor: 'Lớp phó Trật tự (Đỗ Duy Bảo)',
      studentId,
      pointDelta: rule.score,
      reason: fullReason,
      proofImg
    });
  }

  // 4. WORKSPACE: LỚP PHÓ LAO ĐỘNG
  evaluateDuty({ toId, grade, note }) {
    let pointDelta = 0;
    let reason = '';
    if (grade === 'excellent') {
      pointDelta = 5;
      reason = `Trực nhật xuất sắc: Lớp sạch đẹp, bảng sạch, rác phân loại (${note || 'Hoàn hảo'})`;
    } else if (grade === 'good') {
      pointDelta = 3;
      reason = `Trực nhật đạt yêu cầu: ${note || 'Tốt'}`;
    } else {
      pointDelta = -5;
      reason = `Trực nhật chưa đạt: Còn rác, quên lau bảng (${note || 'Cần nhắc nhở'})`;
    }

    // Cộng/Trừ điểm cho toàn bộ thành viên của tổ đó
    const members = window.store.getStudents().filter(s => s.to === parseInt(toId));
    members.forEach(m => {
      window.store.recordEmulationPoint({
        actor: 'Lớp phó Lao động (Nguyễn Thanh Nhân)',
        studentId: m.id,
        pointDelta,
        reason: `[Điểm trực nhật Tổ ${toId}] ${reason}`
      });
    });

    return { toId, pointDelta, membersCount: members.length };
  }

  sendMorningDutyNotification(toId) {
    const dutySchedule = window.store.getDutySchedule();
    const today = new Date().getDay(); // 0 = CN, 1 = T2,...
    const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const currentDayName = dayNames[today] || 'Thứ Hai';
    const scheduleItem = dutySchedule.find(s => s.day === currentDayName) || dutySchedule[0];

    const message = `🔔 [NHẮC NHỞ TRỰC NHẬT BUỔI SÁNG 9A1]\nHôm nay là ${currentDayName}!\nTổ ${scheduleItem.to} có lịch trực nhật: ${scheduleItem.tasks}.\nCác bạn vui lòng có mặt tại lớp trước 6h30 sáng để vệ sinh sạch sẽ!`;
    return message;
  }

  // 5. WORKSPACE: THỦ QUỸ & OCR QUÉT BIÊN LAI
  async scanReceiptOCR(imageFile) {
    return new Promise((resolve) => {
      // Giả lập quét OCR nhận diện số tiền và mục đích chi
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result;

        // Thuật toán giả lập phân tích ảnh biên lai thông minh
        setTimeout(() => {
          const sampleAmounts = [150000, 280000, 350000, 420000, 500000, 850000];
          const detectedAmount = sampleAmounts[Math.floor(Math.random() * sampleAmounts.length)];
          const samplePurposes = ['Mua phấn trắng & đồ lau bảng', 'In ấn tài liệu học tập & hoạt động lớp', 'Nước uống & cờ thi đua thể thao', 'Văn phòng phẩm sinh hoạt chi đội'];
          const detectedPurpose = samplePurposes[Math.floor(Math.random() * samplePurposes.length)];

          resolve({
            success: true,
            detectedAmount,
            detectedPurpose,
            confidence: '96%',
            imageData: base64Data
          });
        }, 900); // Phản hồi cực nhanh < 1s
      };
      reader.readAsDataURL(imageFile);
    });
  }

  // 6. WORKSPACE: TỔ TRƯỞNG (1 - 4)
  nominateBrightStar({ toId, studentId, reason }) {
    const s = window.store.getStudentById(studentId);
    if (!s) return false;

    // Cộng điểm thưởng gương sáng
    window.store.recordEmulationPoint({
      actor: `Tổ trưởng ${toId}`,
      studentId: s.id,
      pointDelta: 10,
      reason: `[Đề xuất Gương sáng tuần] ${reason}`
    });

    // Thêm huy hiệu ngôi sao tiến bộ nếu chưa có
    if (!s.badges.includes('star')) {
      s.badges.push('star');
      window.store.updateStudent(s.id, { badges: s.badges });
    }

    return s;
  }
}

window.workspaceManager = new WorkspaceManager();
