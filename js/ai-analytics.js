// AI Analytics Engine - Phân tích Xu hướng, Cảnh báo Sớm TT 22 & Trợ lý Sư phạm Thông minh

class AIAnalyticsEngine {
  constructor() {
    this.tt22Thresholds = {
      conduct: {
        tot: 90,
        kha: 75,
        dat: 60
      },
      academic: {
        tot: 8.0,
        kha: 6.5,
        dat: 5.0
      }
    };
  }

  // Phân tích toàn diện lớp 9A1
  generateComprehensiveReport(students) {
    if (!students || students.length === 0) return null;

    const totalStudents = students.length;
    let conductCounts = { 'Tốt': 0, 'Khá': 0, 'Đạt': 0, 'Chưa đạt': 0 };
    let academicCounts = { 'Tốt': 0, 'Khá': 0, 'Đạt': 0, 'Chưa đạt': 0 };
    let warningStudents = [];
    let excellentStudents = [];

    let totalScore = 0;
    let totalConductScore = 0;

    students.forEach(s => {
      conductCounts[s.conduct] = (conductCounts[s.conduct] || 0) + 1;
      academicCounts[s.academic] = (academicCounts[s.academic] || 0) + 1;

      totalScore += s.scoreAvg;
      totalConductScore += s.conductScore;

      // Vùng cảnh báo thi đua
      if (s.conductScore < 80 || !s.homeworkStatus || s.academic === 'Đạt' || s.academic === 'Chưa đạt') {
        let reasons = [];
        if (s.conductScore < 75) reasons.push(`Điểm rèn luyện thấp (${s.conductScore}đ)`);
        if (!s.homeworkStatus) reasons.push('Chưa hoàn thành bài tập về nhà hôm nay');
        if (s.scoreAvg < 6.5) reasons.push(`Điểm TB học tập thấp (${s.scoreAvg})`);

        warningStudents.push({
          student: s,
          severity: s.conductScore < 75 ? 'danger' : 'warning',
          reasons
        });
      }

      // Vùng xuất sắc
      if (s.conductScore >= 95 && s.scoreAvg >= 8.5) {
        excellentStudents.push(s);
      }
    });

    const avgScore = (totalScore / totalStudents).toFixed(2);
    const avgConductScore = (totalConductScore / totalStudents).toFixed(1);

    // AI sinh đánh giá sư phạm tổng quát
    const aiInsight = this.generateAIPedagogicalInsight({
      totalStudents,
      avgScore,
      avgConductScore,
      conductCounts,
      academicCounts,
      warningCount: warningStudents.length
    });

    return {
      totalStudents,
      avgScore,
      avgConductScore,
      conductCounts,
      academicCounts,
      warningStudents,
      excellentStudents,
      aiInsight
    };
  }

  // Thuật toán sinh nhận xét & khuyến nghị hành động sư phạm
  generateAIPedagogicalInsight({ totalStudents, avgScore, avgConductScore, conductCounts, academicCounts, warningCount }) {
    const totRatio = Math.round((conductCounts['Tốt'] / totalStudents) * 100);
    const acadTotRatio = Math.round((academicCounts['Tốt'] / totalStudents) * 100);

    let summary = `Tập thể 9A1 đạt ${totRatio}% rèn luyện loại Tốt và ${acadTotRatio}% học lực Tốt. Không khí học tập ổn định, chuẩn bị tốt cho năm cuối cấp.`;
    let recommendations = [];

    if (warningCount > 0) {
      recommendations.push(`Hiện có ${warningCount} học sinh rơi vào vùng cảnh báo về kỷ luật hoặc tiến độ nộp bài tập. Đề xuất GVCN trao đổi nhanh với Lớp phó Trật tự và Lớp phó Học tập.`);
      recommendations.push('Kích hoạt mô hình "Đôi bạn cùng tiến", giao học sinh khá giỏi trong cùng bàn/tổ kèm cặp 1-1 các bạn còn yếu.');
    }

    if (avgScore >= 8.0) {
      recommendations.push('Mặt bằng chung học sinh nắm chắc kiến thức cơ bản. Đề xuất tăng cường các bộ đề thi thử vào 10 có độ phân hóa cao trong thư viện đề.');
    } else {
      recommendations.push('Cần bổ sung các buổi truy bài 15 phút đầu giờ cho 3 môn thi vào 10 (Toán, Văn, Tiếng Anh).');
    }

    recommendations.push('Duy trì khen thưởng động viên kịp thời thông qua danh hiệu ảo và quà tặng tại Cửa hàng đặc quyền (Class Perks).');

    return {
      summary,
      recommendations,
      trend: avgConductScore >= 88 ? 'Tích cực' : 'Cần can thiệp',
      predictedPassRate10: Math.min(100, Math.round((academicCounts['Tốt'] + academicCounts['Khá']) / totalStudents * 100) + 8) + '%'
    };
  }

  // Đánh giá từng cá nhân theo Thông tư 22
  evaluateStudentTT22(student) {
    let conductStatus = 'Chưa đạt';
    if (student.conductScore >= 90) conductStatus = 'Tốt';
    else if (student.conductScore >= 75) conductStatus = 'Khá';
    else if (student.conductScore >= 60) conductStatus = 'Đạt';

    let academicStatus = 'Chưa đạt';
    if (student.scoreAvg >= 8.0) academicStatus = 'Tốt';
    else if (student.scoreAvg >= 6.5) academicStatus = 'Khá';
    else if (student.scoreAvg >= 5.0) academicStatus = 'Đạt';

    return {
      conduct: conductStatus,
      academic: academicStatus,
      isWarning: student.conductScore < 78 || student.scoreAvg < 6.5
    };
  }
}

window.aiAnalytics = new AIAnalyticsEngine();
