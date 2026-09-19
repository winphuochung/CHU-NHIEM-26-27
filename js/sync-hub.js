// Sync Hub Module - Đồng bộ Hai Chiều Google Sheets / Forms & Xuất Nhập Dữ liệu

const DEFAULT_PHUOC_HUNG_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx1-5VCSDkHz0IKlNvvS6LSXtc5trMXaYeB-R6AvaA4OWIVG0vLddJash2IConpAwzNew/exec';

class SyncHubManager {
  constructor() {
    const saved = localStorage.getItem('PHUOC_HUNG_APPS_SCRIPT_URL');
    if (!saved || saved.includes('AKfycbxEzIDQbLq') || saved.includes('AKfycbyAsuE30MDo_rFyEMAyx-z7gHPz0d66cIw_VxONshSaPzo-KlhRiyF66M8QJmjci0lU6w')) {
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

  // Đẩy toàn bộ danh sách 43 học sinh và dữ liệu sang Google Sheets (POST)
  async pushAllToGoogleSheets() {
    let targetUrl = this.appsScriptUrl;
    if (!targetUrl || targetUrl.trim() === '') {
      const domInput = typeof document !== 'undefined' ? document.getElementById('apps-script-url-input')?.value?.trim() : '';
      targetUrl = domInput || localStorage.getItem('PHUOC_HUNG_APPS_SCRIPT_URL') || DEFAULT_PHUOC_HUNG_APPS_SCRIPT_URL;
    }
    if (!targetUrl || targetUrl.trim() === '') {
      throw new Error('Vui lòng cấu hình URL Google Apps Script Web App trong phần Cài đặt.');
    }
    this.appsScriptUrl = targetUrl.trim();
    localStorage.setItem('PHUOC_HUNG_APPS_SCRIPT_URL', this.appsScriptUrl);

    this.isSyncing = true;
    try {
      const students = (window.store && typeof window.store.getStudents === 'function') 
        ? window.store.getStudents() 
        : [];

      const currentWeek = (window.store && window.store.state.currentWeek) || 2;
      const emulationNotes = (window.store && typeof window.store.getWeekEmulationNotes === 'function')
        ? window.store.getWeekEmulationNotes(currentWeek) : {};
      const officerReviews = (window.store && typeof window.store.getWeeklyOfficerReviews === 'function')
        ? window.store.getWeeklyOfficerReviews(currentWeek) : {};

      const ledger = (window.store && window.store.state && Array.isArray(window.store.state.ledger))
        ? window.store.state.ledger : [];

      const payload = {
        action: 'pushAllData',
        actor: 'GVCN Quản trị 9A1',
        timestamp: new Date().toISOString(),
        currentWeek: currentWeek,
        students: students,
        ledger: ledger,
        emulationNotes: emulationNotes,
        officerReviews: officerReviews
      };

      await fetch(this.appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });

      return {
        success: true,
        count: students.length,
        message: `Đã chuyển toàn bộ ${students.length} học sinh và cấu trúc lớp 9A1 sang Google Sheets thành công!`
      };
    } catch (e) {
      console.error('Lỗi khi đẩy toàn bộ dữ liệu sang Google Sheets:', e);
      throw e;
    } finally {
      this.isSyncing = false;
    }
  }

  // Đồng bộ dữ liệu từ Google Sheets về App (GET), nếu sheet trống thì tự động nạp 43 học sinh
  async pullFromGoogleSheets() {
    let targetUrl = this.appsScriptUrl;
    if (!targetUrl || targetUrl.trim() === '') {
      const domInput = typeof document !== 'undefined' ? document.getElementById('apps-script-url-input')?.value?.trim() : '';
      targetUrl = domInput || localStorage.getItem('PHUOC_HUNG_APPS_SCRIPT_URL') || DEFAULT_PHUOC_HUNG_APPS_SCRIPT_URL;
    }
    if (!targetUrl || targetUrl.trim() === '') {
      throw new Error('Vui lòng cấu hình URL Google Apps Script Web App trong phần Cài đặt.');
    }
    this.appsScriptUrl = targetUrl.trim();
    localStorage.setItem('PHUOC_HUNG_APPS_SCRIPT_URL', this.appsScriptUrl);

    this.isSyncing = true;
    try {
      const response = await fetch(this.appsScriptUrl);
      const result = await response.json();

      if (result.status === 'success' && Array.isArray(result.students)) {
        if (result.students.length === 0) {
          // Google Sheet đang trống, TỰ ĐỘNG ĐẨY TOÀN BỘ 43 HỌC SINH TỪ APP SANG SHEET LIỀN!
          console.log('Google Sheet chưa có học sinh. Đang tự động nạp 43 học sinh từ App sang Google Sheet...');
          await this.pushAllToGoogleSheets();
          return {
            success: true,
            count: 43,
            autoInitialized: true,
            message: 'Bảng tính Google Sheet của thầy/cô trước đó chưa có dữ liệu. Hệ thống đã TỰ ĐỘNG tạo bảng và nạp đầy đủ toàn bộ 43 học sinh sang Google Sheet thành công 100%!'
          };
        }

        // Cập nhật điểm và bài tập từ Google Sheet vào Store
        result.students.forEach(remoteStudent => {
          if (!remoteStudent || !remoteStudent.id) return;
          const local = window.store.getStudentById(remoteStudent.id);
          if (local) {
            window.store.updateStudent(local.id, {
              conductScore: Number(remoteStudent.conductScore) || local.conductScore,
              conduct: remoteStudent.conduct || local.conduct,
              homeworkStatus: remoteStudent.homeworkStatus !== undefined ? remoteStudent.homeworkStatus : local.homeworkStatus
            });
          }
        });
        return { success: true, count: result.students.length, message: result.message };
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
    csv += 'UBND XÃ NHƠN HỘI,TRƯỜNG TH & THCS PHƯỚC HƯNG,NĂM HỌC 2026 - 2027\n';
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


  // ================= XUẤT BÁO CÁO TUẦN FILE WORD (.DOCX) THEO NGHỊ ĐỊNH 30/2020/NĐ-CP =================
  exportEmulationWordReport(weekNumber) {
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
    const commend = typeof store.getEmulationCommendations === 'function' ? store.getEmulationCommendations(w) : null;

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    // 1. TÍNH TOÁN THỐNG KÊ 4 TỔ
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

    // 2. CHUẨN BỊ BẢNG HỌC SINH CHI TIẾT
    let studentRowsHtml = '';
    students.forEach((s, idx) => {
      const crit = store.getStudentWeekCriteria(w, s.id);
      const score = store.calculateWeekScore(crit);

      const stReviews = officerReviews[s.id] || {};
      const revItems = [];
      Object.entries(stReviews).forEach(([rKey, rev]) => {
        if (rev && rev.comment) {
          revItems.push(`${rev.comment} (${rev.rating})`);
        }
      });
      const officerComments = revItems.length > 0 ? revItems.join('; ') : 'Chấp hành tốt nề nếp chung';

      studentRowsHtml += `
        <tr style="height: 22pt;">
          <td style="text-align: center;">${s.stt || (idx + 1)}</td>
          <td style="text-align: center;">${s.id}</td>
          <td><b>${s.name}</b></td>
          <td style="text-align: center;">Tổ ${s.to}</td>
          <td style="text-align: center;">${s.role || 'Học sinh'}</td>
          <td style="text-align: center;">${s.dob || ''}</td>
          <td style="text-align: center; font-weight: bold; color: ${score.totalScore >= 95 ? '#059669' : (score.totalScore >= 80 ? '#2563eb' : '#dc2626')};">${score.totalScore}đ</td>
          <td style="text-align: center;">${score.rank}</td>
          <td>${officerComments}</td>
        </tr>
      `;
    });

    // 3. TẠO CẤU TRÚC VĂN BẢN HÀNH CHÍNH NGHỊ ĐỊNH 30/2020/NĐ-CP
    const docHtml = `
<html xmlns:o="urn:schemas-microsoft-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>Báo Cáo Tuần ${w} Lớp 9A1</title>
<!--[if gte mso 9]>
<xml>
 <w:WordDocument>
  <w:View>Print</w:View>
  <w:Zoom>100</w:Zoom>
  <w:DoNotOptimizeForBrowser/>
 </w:WordDocument>
</xml>
<![endif]-->
<style>
  @page WordSection1 {
    size: 210mm 297mm;
    margin: 20mm 15mm 20mm 30mm;
    mso-header-margin: 36.0pt;
    mso-footer-margin: 36.0pt;
    mso-paper-source: 0;
  }
  div.WordSection1 { page: WordSection1; }
  body {
    font-family: 'Times New Roman', serif;
    font-size: 13pt;
    line-height: 1.4;
    color: #000000;
  }
  p {
    margin: 0 0 6pt 0;
    text-align: justify;
    font-size: 13pt;
    font-family: 'Times New Roman', serif;
    text-indent: 1.27cm;
  }
  p.no-indent {
    text-indent: 0 !important;
  }
  h1 {
    font-size: 14pt;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    margin: 12pt 0 6pt 0;
  }
  h2 {
    font-size: 13.5pt;
    font-weight: bold;
    text-transform: uppercase;
    margin: 12pt 0 6pt 0;
  }
  table.header-table {
    width: 100%;
    border-collapse: collapse;
    border: none;
    margin-bottom: 15pt;
  }
  table.header-table td {
    border: none;
    padding: 0;
    vertical-align: top;
    text-align: center;
  }
  table.content-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8pt;
    margin-bottom: 12pt;
  }
  table.content-table th, table.content-table td {
    border: 1px solid #000000;
    padding: 4pt 5pt;
    font-size: 11pt;
    font-family: 'Times New Roman', serif;
  }
  table.content-table th {
    background-color: #f2f2f2;
    font-weight: bold;
    text-align: center;
  }
  .line-divider {
    border-bottom: 1.5pt solid #000000;
    width: 35%;
    margin: 3pt auto 0 auto;
  }
  .line-divider-short {
    border-bottom: 1pt solid #000000;
    width: 25%;
    margin: 3pt auto 0 auto;
  }
</style>
</head>
<body>
<div class="WordSection1">

  <!-- HÀNG THỦ TỤC HÀNH CHÍNH QUỐC HIỆU TIÊU NGỮ NGHỊ ĐỊNH 30/2020/NĐ-CP -->
  <table class="header-table">
    <tr>
      <td style="width: 45%;">
        <div style="font-size: 12pt; text-transform: uppercase;">UBND XÃ NHƠN HỘI</div>
        <div style="font-size: 12pt; font-weight: bold; text-transform: uppercase;">TRƯỜNG TH & THCS PHƯỚC HƯNG</div>
        <div style="font-size: 12pt; font-weight: bold;">LỚP 9A1</div>
        <div class="line-divider-short"></div>
        <div style="font-size: 13pt; margin-top: 4pt;">Số: ${w}/BC-THCS-9A1</div>
      </td>
      <td style="width: 55%;">
        <div style="font-size: 12pt; font-weight: bold; text-transform: uppercase;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div style="font-size: 13pt; font-weight: bold;">Độc lập - Tự do - Hạnh phúc</div>
        <div class="line-divider"></div>
        <div style="font-size: 13pt; font-style: italic; margin-top: 4pt;">Phước Hưng, ngày ${day} tháng ${month} năm ${year}</div>
      </td>
    </tr>
  </table>

  <!-- TÊN LOẠI VĂN BẢN VÀ TRÍCH YẾU NỘI DUNG -->
  <h1>BÁO CÁO</h1>
  <p class="no-indent" style="text-align: center; font-weight: bold; font-size: 13pt; margin-bottom: 4pt;">
    Về việc tổng hợp tình hình thi đua, nề nếp và kết quả rèn luyện Lớp 9A1 - Tuần ${w}
  </p>
  <p class="no-indent" style="text-align: center; font-style: italic; font-size: 12pt; margin-bottom: 14pt;">
    (Chủ điểm tuần ${w}: ${weekTheme.theme || 'Thi đua dạy tốt - học tốt'})
  </p>

  <!-- PHẦN I: ĐÁNH GIÁ TỔNG QUAN -->
  <h2>I. ĐÁNH GIÁ TÌNH HÌNH TỔNG QUAN NỀ NẾP LỚP</h2>
  <p>Căn cứ tình hình theo dõi nề nếp học tập, kỷ luật chuyên cần và các phong trào thi đua của Lớp 9A1 trong Tuần ${w} (Năm học 2026 - 2027), Ban cán sự lớp phối hợp cùng GVCN tổng hợp tình hình rèn luyện tập thể như sau:</p>
  <p>- <b>Sĩ số lớp:</b> 43/43 học sinh (Duy trì tỉ lệ chuyên cần đạt 100%).</p>
  <p>- <b>Ý thức nề nếp:</b> Tập thể lớp chấp hành tốt quy định về đồng phục, khăn quàng đỏ, không có học sinh vi phạm nghiêm trọng kỷ luật trường lớp.</p>
  <p>- <b>Trạng thái phê duyệt báo cáo:</b> ${emulationNotes.status === 'Đã duyệt' ? 'ĐÃ ĐƯỢC GIÁO VIÊN CHỦ NHIỆM PHÊ DUYỆT' : 'CHỜ GVCN DUYỆT CHÍNH THỨC'}.</p>

  ${commend ? `
  <!-- PHẦN II: VINH DANH THỦ KHOA VÀ NGÔI SAO TIẾN BỘ -->
  <h2>II. BẢNG VINH DANH THỦ KHOA & NGÔI SAO TIẾN BỘ TUẦN</h2>
  <p>- <b>Thủ khoa thi đua toàn Lớp 9A1:</b> ${commend.topClass ? `${commend.topClass.student.name} (Tổ ${commend.topClass.student.to}) - Đạt <b>${commend.topClass.totalScore} điểm</b> (${commend.topClass.rank})` : 'Đang cập nhật'}.</p>
  <p>- <b>Thủ khoa thi đua 4 Tổ:</b></p>
  <p style="margin-left: 20pt; text-indent: 0;">+ Tổ 1: ${commend.topByTeam[1] && commend.topByTeam[1].student ? `${commend.topByTeam[1].student.name} (${commend.topByTeam[1].totalScore}đ)` : 'N/A'}</p>
  <p style="margin-left: 20pt; text-indent: 0;">+ Tổ 2: ${commend.topByTeam[2] && commend.topByTeam[2].student ? `${commend.topByTeam[2].student.name} (${commend.topByTeam[2].totalScore}đ)` : 'N/A'}</p>
  <p style="margin-left: 20pt; text-indent: 0;">+ Tổ 3: ${commend.topByTeam[3] && commend.topByTeam[3].student ? `${commend.topByTeam[3].student.name} (${commend.topByTeam[3].totalScore}đ)` : 'N/A'}</p>
  <p style="margin-left: 20pt; text-indent: 0;">+ Tổ 4: ${commend.topByTeam[4] && commend.topByTeam[4].student ? `${commend.topByTeam[4].student.name} (${commend.topByTeam[4].totalScore}đ)` : 'N/A'}</p>
  <p>- <b>Ngôi sao tiến bộ vượt bậc:</b> ${commend.mostImprovedWeek && commend.mostImprovedWeek.student ? `${commend.mostImprovedWeek.student.name} (Tổ ${commend.mostImprovedWeek.student.to}) - Tăng <b>+${commend.mostImprovedWeek.deltaScore} điểm</b> so với tuần trước.` : 'Không có học sinh vi phạm'}.</p>
  ` : ''}

  <!-- PHẦN III: BẢNG XẾP HẠNG THI ĐUA 4 TỔ -->
  <h2>III. BẢNG TỔNG HỢP & XẾP HẠNG THI ĐUA 4 TỔ</h2>
  <table class="content-table">
    <thead>
      <tr>
        <th style="width: 10%;">Hạng</th>
        <th style="width: 15%;">Tổ</th>
        <th style="width: 30%;">Tổ trưởng phụ trách</th>
        <th style="width: 12%;">Sĩ số</th>
        <th style="width: 15%;">Điểm TB</th>
        <th style="width: 18%;">Đánh giá nề nếp</th>
      </tr>
    </thead>
    <tbody>
      ${toStats.map((t, idx) => `
        <tr style="height: 22pt;">
          <td style="text-align: center; font-weight: bold;">Hạng ${idx + 1}</td>
          <td style="text-align: center; font-weight: bold;">Tổ ${t.toId}</td>
          <td>${t.lead}</td>
          <td style="text-align: center;">${t.count} HS</td>
          <td style="text-align: center; font-weight: bold;">${t.avg}đ</td>
          <td style="text-align: center;">${t.avg >= 95 ? 'Xuất sắc' : (t.avg >= 90 ? 'Tốt, đoàn kết' : 'Cần đôn đốc')}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <!-- PHẦN IV: BẢNG ĐIỂM CHI TIẾT 43 HỌC SINH -->
  <h2>IV. BẢNG ĐIỂM THI ĐUA RÈN LUYỆN CHI TIẾT 43 HỌC SINH (THÔNG TƯ 22)</h2>
  <table class="content-table">
    <thead>
      <tr>
        <th style="width: 5%;">STT</th>
        <th style="width: 8%;">Mã HS</th>
        <th style="width: 22%;">Họ và tên</th>
        <th style="width: 8%;">Tổ</th>
        <th style="width: 14%;">Chức vụ</th>
        <th style="width: 12%;">Ngày sinh</th>
        <th style="width: 9%;">Điểm</th>
        <th style="width: 10%;">Xếp loại</th>
        <th style="width: 12%;">Nhận xét Ban cán sự</th>
      </tr>
    </thead>
    <tbody>
      ${studentRowsHtml}
    </tbody>
  </table>

  <!-- PHẦN V: NHẬN XÉT CỦA BAN CÁN SỰ LỚP & GVCN -->
  <h2>V. ĐÁNH GIÁ NHẬN XÉT CỦA BAN CÁN SỰ LỚP & GIÁO VIÊN CHỦ NHIỆM</h2>
  <p><b>1. Đánh giá của Lớp trưởng và Ban cán sự lớp:</b></p>
  <p style="font-style: italic;">"${emulationNotes.officerReview || 'Tập thể Lớp 9A1 duy trì nề nếp tốt, 100% học sinh đi học đúng giờ, chuẩn bị bài đầy đủ trước khi đến lớp.'}"</p>
  
  <p><b>2. Ý kiến chỉ đạo & nhận xét của Giáo viên Chủ nhiệm:</b></p>
  <p style="font-style: italic;">"${emulationNotes.gvcnFeedback || 'GVCN ghi nhận và biểu dương sự cố gắng của tập thể 9A1 và Ban cán sự. Đề nghị các tổ trưởng tiếp tục đôn đốc thành viên giữ gìn vệ sinh và chuyên cần.'}"</p>

  <!-- PHẦN VI: PHƯƠNG HƯỚNG TUẦN TỚI -->
  <h2>VI. PHƯƠNG HƯỚNG & KẾ HOẠCH HOẠT ĐỘNG TUẦN TỚI (TUẦN ${w + 1})</h2>
  <p>- <b>Kế hoạch hành động:</b> ${emulationNotes.nextWeekDirection || 'Tiếp tục đẩy mạnh phong trào học tập, làm bài tập về nhà 100%, tích cực phát biểu xây dựng bài.'}</p>
  <p>- <b>Chỉ tiêu phấn đấu:</b> 100% học sinh xếp loại Rèn luyện Tốt, giữ vững vị trí Tổ đầu bảng thi đua toàn trường.</p>

  <!-- CHỮ KÝ VÀ NƠI NHẬN CHUẨN NGHỊ ĐỊNH 30/2020/NĐ-CP -->
  <table class="header-table" style="margin-top: 25pt; page-break-inside: avoid;">
    <tr>
      <td style="width: 45%; text-align: left; vertical-align: top;">
        <div style="font-size: 12pt; font-weight: bold; font-style: italic; margin-bottom: 4pt;">Nơi nhận:</div>
        <div style="font-size: 11pt;">- BGH Trường TH & THCS Phước Hưng;</div>
        <div style="font-size: 11pt;">- Tổng phụ trách Đội;</div>
        <div style="font-size: 11pt;">- Ban cán sự & Tổ trưởng 4 Tổ;</div>
        <div style="font-size: 11pt;">- Lưu: Hồ sơ Lớp 9A1.</div>
      </td>
      <td style="width: 55%; text-align: center; vertical-align: top;">
        <div style="font-size: 13pt; font-weight: bold; text-transform: uppercase;">GIÁO VIÊN CHỦ NHIỆM</div>
        <div style="font-size: 12pt; font-style: italic; margin-bottom: 45pt;">(Ký và ghi rõ họ tên)</div>
        <div style="font-size: 13pt; font-weight: bold;">Thầy/Cô Chủ nhiệm Lớp 9A1</div>
      </td>
    </tr>
  </table>

</div>
</body>
</html>
    `;

    const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `BaoCao_Tuan_${w}_Lop9A1_NghiDinh30.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (typeof showSeatingToast === 'function') {
      showSeatingToast(`📄 Đã xuất báo cáo Word Tuần ${w} chuẩn Nghị định 30/2020/NĐ-CP thành công!`);
    } else {
      alert(`📄 Đã xuất báo cáo Word Tuần ${w} chuẩn Nghị định 30/2020/NĐ-CP thành công!`);
    }
  }

}

window.syncHub = new SyncHubManager();
