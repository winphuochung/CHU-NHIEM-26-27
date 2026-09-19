// Sync Hub Module - Đồng bộ Hai Chiều Google Sheets / Forms & Xuất Nhập Dữ liệu

const DEFAULT_PHUOC_HUNG_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyAsuE30MDo_rFyEMAyx-z7gHPz0d66cIw_VxONshSaPzo-KlhRiyF66M8QJmjci0lU6w/exec';

class SyncHubManager {
  constructor() {
    const saved = localStorage.getItem('PHUOC_HUNG_APPS_SCRIPT_URL');
    if (!saved || saved.includes('AKfycbxEzIDQbLq')) {
      localStorage.setItem('PHUOC_HUNG_APPS_SCRIPT_URL', DEFAULT_PHUOC_HUNG_APPS_SCRIPT_URL);
      this.appsScriptUrl = DEFAULT_PHUOC_HUNG_APPS_SCRIPT_URL;
    } else {
      this.appsScriptUrl = saved;
    }
    this.isSyncing = false;
  }

  setAppsScriptUrl(url) {
    this.appsScriptUrl = url.trim();
    localStorage.setItem('PHUOC_HUNG_APPS_SCRIPT_URL', this.appsScriptUrl);
  }

  // Đồng bộ dữ liệu từ Google Sheets về App (GET)
  async pullFromGoogleSheets() {
    if (!this.appsScriptUrl) {
      throw new Error('Vui lòng cấu hình URL Google Apps Script Web App trong phần Cài đặt.');
    }

    this.isSyncing = true;
    try {
      const response = await fetch(this.appsScriptUrl);
      const result = await response.json();

      if (result.status === 'success' && Array.isArray(result.students)) {
        // Cập nhật điểm và bài tập từ Google Sheet vào Store
        result.students.forEach(remoteStudent => {
          const local = window.store.getStudentById(remoteStudent.id);
          if (local) {
            window.store.updateStudent(local.id, {
              conductScore: Number(remoteStudent.conductScore) || local.conductScore,
              conduct: remoteStudent.conduct || local.conduct,
              homeworkStatus: remoteStudent.homeworkStatus !== undefined ? remoteStudent.homeworkStatus : local.homeworkStatus
            });
          }
        });
        return { success: true, count: result.students.length };
      } else {
        throw new Error(result.message || 'Dữ liệu trả về từ Google Sheets không hợp lệ');
      }
    } finally {
      this.isSyncing = false;
    }
  }

  // Đẩy điểm thi đua lên Google Sheets (POST)
  async pushEmulationToGoogleSheets({ studentId, pointDelta, reason, actor }) {
    if (!this.appsScriptUrl) return { success: false, msg: 'Chưa cấu hình Apps Script URL' };

    try {
      const payload = {
        action: 'updateEmulation',
        studentId,
        pointDelta,
        reason,
        actor
      };

      await fetch(this.appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        mode: 'no-cors' // Tránh bị chặn bởi CORS preflight của Google Apps Script
      });

      return { success: true };
    } catch (e) {
      console.warn('Lỗi khi gửi lên Google Sheets:', e);
      return { success: false, error: e.message };
    }
  }

  // Giả lập tiếp nhận Webhook từ Google Form nộp bài / khảo sát
  simulateGoogleFormSubmission(studentName, formType, data) {
    const students = window.store.getStudents();
    const target = students.find(s => s.name.toLowerCase().includes(studentName.toLowerCase()));

    if (!target) {
      return { success: false, msg: `Không tìm thấy học sinh: ${studentName}` };
    }

    if (formType === 'homework') {
      // Đánh dấu đã hoàn thành bài tập môn học
      window.store.updateStudent(target.id, { homeworkStatus: true });
      window.store.recordEmulationPoint({
        actor: 'Google Forms Sync (Tự động)',
        studentId: target.id,
        pointDelta: 2,
        reason: `Nộp bài tập về nhà qua Google Form môn ${data.subject || 'Toán 9'}`
      });
      return { success: true, msg: `Đã tự động cập nhật bài tập và cộng 2 điểm chuyên cần cho ${target.name}` };
    }

    if (formType === 'aspiration') {
      // Khảo sát nguyện vọng vào 10
      window.store.updateStudent(target.id, {
        targetHighSchool: {
          nv1: data.nv1 || target.targetHighSchool.nv1,
          nv2: data.nv2 || target.targetHighSchool.nv2,
          nv3: data.nv3 || target.targetHighSchool.nv3
        }
      });
      return { success: true, msg: `Đã cập nhật 3 nguyện vọng vào lớp 10 cho ${target.name}` };
    }

    return { success: false, msg: 'Loại biểu mẫu chưa được hỗ trợ' };
  }

  // Xuất file CSV danh sách lớp và điểm thi đua cơ bản
  exportCSV() {
    const currentWeek = (window.store && window.store.state.currentWeek) || 2;
    this.exportEmulationExcelReport(currentWeek);
  }

  // ================= XUẤT BÁO CÁO TỔNG HỢP THI ĐUA CHUẨN EXCEL CHO GVCN =================
  exportEmulationExcelReport(weekNumber) {
    const w = parseInt(weekNumber) || (window.store && window.store.state.currentWeek) || 2;
    const store = window.store;
    if (!store) {
      alert('Không tìm thấy dữ liệu hệ thống!');
      return;
    }

    const students = store.getStudents();
    const weekTheme = store.getWeekTheme(w) || { theme: `Thi đua tuần ${w}`, criteria: [] };
    const emulationNotes = store.getWeekEmulationNotes(w);
    const officerReviews = store.getWeeklyOfficerReviews(w) || {};

    let csv = '\uFEFF'; // BOM UTF-8 cho Microsoft Excel hiển thị tiếng Việt có dấu chuẩn 100%

    const escapeCsv = (str) => {
      if (!str) return '""';
      const clean = String(str).replace(/"/g, '""').replace(/\r?\n/g, ' - ');
      return `"${clean}"`;
    };

    // 1. TIÊU ĐỀ HÀNH CHÍNH & THÔNG TIN BÁO CÁO
    csv += 'UBND HUYỆN LONG THÀNH,TRƯỜNG TH & THCS PHƯỚC HƯNG,NĂM HỌC 2026 - 2027\n';
    csv += 'LỚP: 9A1,SĨ SỐ: 43 HỌC SINH,GIÁO VIÊN CHỦ NHIỆM: Thầy/Cô Chủ nhiệm 9A1\n';
    csv += '\n';
    csv += `BÁO CÁO TỔNG HỢP THI ĐUA & ĐÁNH GIÁ THÔNG TƯ 22/2021/TT-BGDĐT - TUẦN ${w}\n`;
    csv += `Chủ điểm tuần ${w}: ${escapeCsv(weekTheme.theme)}\n`;
    csv += `Ngày xuất báo cáo: ${new Date().toLocaleDateString('vi-VN')} lúc ${new Date().toLocaleTimeString('vi-VN')}\n`;
    csv += `Trạng thái phê duyệt: ${emulationNotes.status === 'Đã duyệt' ? 'ĐÃ ĐƯỢC GVCN PHÊ DUYỆT' : 'CHỜ DUYỆT'}\n`;
    csv += '\n';

    // 1.5 BẢNG VINH DANH & TUYÊN DƯƠNG THI ĐUA
    if (typeof store.getEmulationCommendations === 'function') {
      const commend = store.getEmulationCommendations(w);
      const topCls = commend.topClass;
      const impWk = commend.mostImprovedWeek;
      csv += '--- BẢNG VINH DANH & TUYÊN DƯƠNG THI ĐUA TUẦN ---\n';
      csv += `Thủ khoa thi đua Lớp 9A1:,${topCls ? `${topCls.student.name} (Tổ ${topCls.student.to}) - ${topCls.totalScore} điểm (${topCls.rank})` : 'Đang cập nhật'}\n`;
      csv += `Thủ khoa thi đua Tổ 1:,${commend.topByTeam[1] && commend.topByTeam[1].student ? `${commend.topByTeam[1].student.name} - ${commend.topByTeam[1].totalScore} điểm` : ''}\n`;
      csv += `Thủ khoa thi đua Tổ 2:,${commend.topByTeam[2] && commend.topByTeam[2].student ? `${commend.topByTeam[2].student.name} - ${commend.topByTeam[2].totalScore} điểm` : ''}\n`;
      csv += `Thủ khoa thi đua Tổ 3:,${commend.topByTeam[3] && commend.topByTeam[3].student ? `${commend.topByTeam[3].student.name} - ${commend.topByTeam[3].totalScore} điểm` : ''}\n`;
      csv += `Thủ khoa thi đua Tổ 4:,${commend.topByTeam[4] && commend.topByTeam[4].student ? `${commend.topByTeam[4].student.name} - ${commend.topByTeam[4].totalScore} điểm` : ''}\n`;
      csv += `Ngôi sao tiến bộ vượt bậc tuần:,${impWk && impWk.student ? `${impWk.student.name} (Tổ ${impWk.student.to}) - Tiến bộ ${impWk.deltaScore >= 0 ? `+${impWk.deltaScore}` : impWk.deltaScore} điểm (Tổng: ${impWk.totalScore}đ)` : 'Đang cập nhật'}\n`;
      csv += '\n';
    }

    // 2. BẢNG 1: TỔNG HỢP THI ĐUA 4 TỔ TRONG TUẦN
    csv += '--- BẢNG 1: TỔNG KẾT & XẾP HẠNG THI ĐUA 4 TỔ ---\n';
    csv += 'Thứ hạng,Tổ,Tổ trưởng phụ trách,Sĩ số,Điểm TB Rèn luyện,Học sinh Tốt,Học sinh Cần nhắc nhở,Đánh giá nề nếp tổ\n';

    const toLeads = {
      1: 'Nguyễn Thị Ngọc Thảo (Tổ trưởng 1)',
      2: 'Hồ Thị Kim Cương (Tổ trưởng 2)',
      3: 'Phan Tuấn Khang (Tổ trưởng 3)',
      4: 'Nguyễn Gia Thịnh (Tổ trưởng 4)'
    };

    const toStats = [1, 2, 3, 4].map(toId => {
      const members = students.filter(s => s.to === toId);
      let sumScore = 0;
      let countGood = 0;
      let countWarning = 0;

      members.forEach(m => {
        const crit = store.getStudentWeekCriteria(w, m.id);
        const sc = store.calculateWeekScore(crit);
        sumScore += sc.totalScore;
        if (sc.rank === 'Tốt') countGood++;
        if (sc.rank === 'Chưa đạt' || sc.rank === 'Đạt') countWarning++;
      });

      const avg = members.length > 0 ? (sumScore / members.length).toFixed(1) : 0;
      return {
        toId,
        lead: toLeads[toId] || `Tổ trưởng ${toId}`,
        count: members.length,
        avg: parseFloat(avg),
        countGood,
        countWarning
      };
    });

    toStats.sort((a, b) => b.avg - a.avg);

    toStats.forEach((t, idx) => {
      const rankText = `Hạng ${idx + 1}`;
      const reviewText = t.avg >= 95 ? 'Nề nếp xuất sắc' : (t.avg >= 90 ? 'Tốt, đoàn kết' : 'Cần đôn đốc thêm');
      csv += `"${rankText}","Tổ ${t.toId}","${t.lead}","${t.count} HS","${t.avg}đ","${t.countGood} HS","${t.countWarning} HS","${reviewText}"\n`;
    });

    csv += '\n';

    // 3. BẢNG 2: DANH SÁCH CHI TIẾT 43 HỌC SINH THEO CHUẨN THÔNG TƯ 22
    csv += `--- BẢNG 2: BẢNG ĐIỂM CHI TIẾT 43 HỌC SINH (TUẦN ${w}) ---\n`;
    csv += 'STT,Mã HS,Họ và tên,Tổ,Chức vụ,Vắng P (-2đ),Vắng K (-5đ),Truy bài (-2đ),Đi trễ (-2đ),Đồng phục (-2đ),Mất trật tự (-2đ),KTTX 0-4 (-3đ),KTTX 5-7 (Đạt),KTTX 8-10 (+5đ),Giơ tay (+1đ),Phát biểu (+2đ),Vệ sinh (+3đ),Vi phạm khác (-2đ),Tổng điểm tuần,Xếp loại rèn luyện,Nhận xét từ Ban cán sự lớp & Tổ trưởng\n';

    students.forEach(s => {
      const crit = store.getStudentWeekCriteria(w, s.id);
      const score = store.calculateWeekScore(crit);

      // Thu thập nhận xét từ Sổ tay cán sự
      const stReviews = officerReviews[s.id] || {};
      const revItems = [];
      Object.entries(stReviews).forEach(([rKey, rev]) => {
        if (rev && rev.comment) {
          revItems.push(`[${rev.actor || rKey}]: ${rev.comment} (${rev.rating})`);
        }
      });
      const officerComments = revItems.length > 0 ? revItems.join('; ') : 'Chấp hành tốt nề nếp chung';

      csv += `"${s.stt}","${s.id}","${s.name}","Tổ ${s.to}","${s.role}",`;
      csv += `"${crit.vangP || 0}","${crit.vangK || 0}","${crit.truyBai || 0}","${crit.diTre || 0}","${crit.dongPhuc || 0}","${crit.mtt || 0}",`;
      csv += `"${crit.kttx04 || 0}","${crit.kttx57 || 0}","${crit.kttx810 || 0}","${crit.gioTay || 0}","${crit.phatBieu || 0}","${crit.veSinh || 0}","${crit.viPham || 0}",`;
      csv += `"${score.totalScore}đ","${score.rank}",${escapeCsv(officerComments)}\n`;
    });

    csv += '\n';

    // 4. PHẦN 3: NỘI DUNG NHẬN XÉT CỦA BAN CÁN SỰ LỚP TRONG TUẦN
    csv += '--- PHẦN 3: NỘI DUNG ĐÁNH GIÁ & NHẬN XÉT CỦA BAN CÁN SỰ LỚP TRONG TUẦN ---\n';
    csv += `Người lập báo cáo:,${escapeCsv(emulationNotes.submittedBy || 'Lớp trưởng (Trình Minh Thiện)')}\n`;
    csv += `Ngày cập nhật:,${escapeCsv(emulationNotes.updatedAt || new Date().toLocaleDateString('vi-VN'))}\n`;
    csv += `Nội dung nhận xét chi tiết:,${escapeCsv(emulationNotes.officerReview || 'Lớp duy trì nề nếp tốt, các tổ trưởng đôn đốc thành viên học tập và trực nhật chu đáo.')}\n`;
    csv += '\n';

    // 5. PHẦN 4: PHƯƠNG HƯỚNG HOẠT ĐỘNG TUẦN TỚI CỦA BAN CÁN SỰ LỚP
    csv += '--- PHẦN 4: PHƯƠNG HƯỚNG & KẾ HOẠCH HOẠT ĐỘNG TUẦN TỚI CỦA BAN CÁN SỰ LỚP ---\n';
    csv += `Kế hoạch hành động tuần tới:,${escapeCsv(emulationNotes.nextWeekDirection || 'Tiếp tục phát huy phong trào học tập, 100% làm bài tập về nhà, chuẩn bị tốt cho các tiết kiểm tra định kỳ.')}\n`;
    csv += '\n';

    // 6. PHẦN 5: Ý KIẾN CHỈ ĐẠO & PHÊ DUYỆT CỦA GIÁO VIÊN CHỦ NHIỆM
    csv += '--- PHẦN 5: Ý KIẾN CHỈ ĐẠO CỦA GIÁO VIÊN CHỦ NHIỆM ---\n';
    csv += `Nhận xét của GVCN:,${escapeCsv(emulationNotes.gvcnFeedback || 'GVCN ghi nhận sự nỗ lực của tập thể lớp 9A1 và Ban cán sự. Yêu cầu toàn lớp thực hiện nghiêm túc phương hướng tuần mới.')}\n`;
    csv += `Trạng thái hồ sơ:,${escapeCsv(emulationNotes.status)}\n`;
    csv += '\n';

    // 7. PHẦN 6: CHỮ KÝ XÁC NHẬN
    csv += '--- PHẦN 6: CHỮ KÝ XÁC NHẬN ---\n';
    csv += 'LỚP TRƯỞNG,,,GIÁO VIÊN CHỦ NHIỆM\n';
    csv += '(Ký và ghi rõ họ tên),,,(Ký và ghi rõ họ tên)\n';
    csv += '\n\n';
    csv += 'Trình Minh Thiện,,,Thầy/Cô Chủ nhiệm 9A1\n';

    // Tải file về máy
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `BaoCao_TongHop_ThiDua_9A1_Tuan_${w}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Toast phản hồi
    if (typeof showSeatingToast === 'function') {
      showSeatingToast(`✅ Đã xuất thành công file Báo cáo Tổng hợp Thi đua Tuần ${w}!`);
    } else {
      alert(`✅ Đã xuất thành công file Báo cáo Tổng hợp Thi đua Tuần ${w}!`);
    }
  }
}

window.syncHub = new SyncHubManager();
