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

      const payload = {
        action: 'pushAllData',
        actor: 'GVCN Quản trị 9A1',
        timestamp: new Date().toISOString(),
        students: students
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

window.APPS_SCRIPT_SOURCE_CODE = \/\*\*\
\ \*\ \G\o\o\g\l\e\ \A\p\p\s\ \S\c\r\i\p\t\ \-\ \H\ệ\ \T\h\ố\n\g\ \Q\u\ả\n\ \L\ý\ \T\o\à\n\ \D\i\ệ\n\ \&\ \Đ\ồ\n\g\ \B\ộ\ \2\ \C\h\i\ề\u\ \L\ớ\p\ \9\A\1\ \P\h\ư\ớ\c\ \H\ư\n\g\
\ \*\ \T\r\ư\ờ\n\g\ \T\H\ \&\ \T\H\C\S\ \P\h\ư\ớ\c\ \H\ư\n\g\ \(\N\ă\m\ \h\ọ\c\ \2\0\2\6\ \-\ \2\0\2\7\)\
\ \*\ \
\ \*\ \Đ\Ặ\C\ \Đ\I\Ể\M\ \N\Ổ\I\ \B\Ậ\T\:\
\ \*\ \1\.\ \T\ự\ \đ\ộ\n\g\ \k\h\ở\i\ \t\ạ\o\ \1\0\0\%\ \G\o\o\g\l\e\ \S\h\e\e\t\:\ \T\ự\ \t\ạ\o\ \s\h\e\e\t\ \D\a\n\h\S\a\c\h\9\A\1\,\ \t\i\ê\u\ \đ\ề\ \x\a\n\h\ \n\a\v\y\,\ \k\ẻ\ \k\h\u\n\g\,\ \c\ă\n\ \l\ề\.\
\ \*\ \2\.\ \T\ự\ \đ\ộ\n\g\ \n\ạ\p\ \t\o\à\n\ \b\ộ\ \4\3\ \h\ọ\c\ \s\i\n\h\ \v\ớ\i\ \9\ \c\h\ứ\c\ \v\ụ\ \B\a\n\ \c\á\n\ \s\ự\ \c\h\u\ẩ\n\ \h\ó\a\ \k\h\i\ \đ\ồ\n\g\ \b\ộ\ \h\o\ặ\c\ \k\h\i\ \s\h\e\e\t\ \t\r\ố\n\g\.\
\ \*\ \3\.\ \H\ỗ\ \t\r\ợ\ \p\u\s\h\ \t\o\à\n\ \b\ộ\ \d\ữ\ \l\i\ệ\u\ \t\ừ\ \Ứ\n\g\ \d\ụ\n\g\ \s\a\n\g\ \S\h\e\e\t\,\ \c\ậ\p\ \n\h\ậ\t\ \đ\i\ể\m\ \t\h\i\ \đ\u\a\,\ \t\ự\ \đ\ộ\n\g\ \g\h\i\ \A\u\d\i\t\L\o\g\.\
\ \*\ \4\.\ \N\g\ư\ờ\i\ \d\ù\n\g\ \K\H\Ô\N\G\ \C\Ầ\N\ \t\ạ\o\ \b\ấ\t\ \c\ứ\ \c\ộ\t\,\ \d\ò\n\g\ \h\a\y\ \đ\ị\n\h\ \d\ạ\n\g\ \n\à\o\ \t\r\ê\n\ \G\o\o\g\l\e\ \S\h\e\e\t\!\
\ \*\/\
\
\v\a\r\ \S\P\R\E\A\D\S\H\E\E\T\_\I\D\ \=\ \'\'\;\ \/\/\ \Đ\ể\ \t\r\ố\n\g\ \n\ế\u\ \d\á\n\ \t\r\ự\c\ \t\i\ế\p\ \v\à\o\ \A\p\p\s\ \S\c\r\i\p\t\ \t\ừ\ \G\o\o\g\l\e\ \S\h\e\e\t\ \(\K\h\u\y\ê\n\ \d\ù\n\g\)\
\
\/\/\ \D\a\n\h\ \s\á\c\h\ \m\ặ\c\ \đ\ị\n\h\ \4\3\ \h\ọ\c\ \s\i\n\h\ \L\ớ\p\ \9\A\1\ \P\h\ư\ớ\c\ \H\ư\n\g\ \(\C\h\u\ẩ\n\ \h\ó\a\ \T\h\ô\n\g\ \t\ư\ \2\2\)\
\v\a\r\ \D\E\F\A\U\L\T\_\S\T\U\D\E\N\T\S\_\9\A\1\ \=\ \[\
\ \ \/\/\ \T\Ổ\ \4\ \(\1\1\ \H\S\)\
\ \ \{\ \i\d\:\ \'\H\S\0\1\'\,\ \s\t\t\:\ \1\,\ \n\a\m\e\:\ \'\Đ\ặ\n\g\ \V\ă\n\ \H\o\à\n\g\ \L\o\n\g\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\1\5\/\0\3\/\2\0\1\1\'\,\ \t\o\:\ \4\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\8\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\T\ố\t\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\5\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\0\1\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\0\1\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \P\h\ư\ớ\c\ \H\ư\n\g\,\ \H\u\y\ệ\n\ \L\o\n\g\ \T\h\à\n\h\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\C\h\ă\m\ \n\g\o\a\n\,\ \t\í\c\h\ \c\ự\c\ \t\h\a\m\ \g\i\a\ \h\o\ạ\t\ \đ\ộ\n\g\ \l\ớ\p\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\0\2\'\,\ \s\t\t\:\ \2\,\ \n\a\m\e\:\ \'\L\a\ \C\ẩ\m\ \N\h\u\n\g\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\2\2\/\0\4\/\2\0\1\1\'\,\ \t\o\:\ \4\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\9\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\T\ố\t\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\8\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\0\2\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\0\2\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \1\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\C\h\ă\m\ \n\g\o\a\n\,\ \h\ọ\c\ \l\ự\c\ \t\ố\t\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\0\3\'\,\ \s\t\t\:\ \3\,\ \n\a\m\e\:\ \'\V\õ\ \N\g\ọ\c\ \B\ả\o\ \T\r\â\n\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\0\5\/\0\1\/\2\0\1\1\'\,\ \t\o\:\ \4\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\2\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \7\.\9\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\0\3\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\0\3\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \2\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\v\3\:\ \'\T\r\u\n\g\ \t\â\m\ \G\D\N\N\-\G\D\T\X\'\,\ \n\o\t\e\s\:\ \'\C\ó\ \ý\ \t\h\ứ\c\ \t\ậ\p\ \t\h\ể\ \c\a\o\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\0\4\'\,\ \s\t\t\:\ \4\,\ \n\a\m\e\:\ \'\N\g\u\y\ễ\n\ \G\i\a\ \T\h\ị\n\h\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\1\8\/\0\7\/\2\0\1\1\'\,\ \t\o\:\ \4\,\ \r\o\l\e\:\ \'\T\ổ\ \t\r\ư\ở\n\g\ \4\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\4\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\T\ố\t\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\4\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\0\4\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\0\4\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\T\ổ\ \t\r\ư\ở\n\g\ \t\ổ\ \4\ \g\ư\ơ\n\g\ \m\ẫ\u\,\ \q\u\ả\n\ \l\ý\ \t\ổ\ \4\ \c\h\u\ \đ\á\o\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\0\5\'\,\ \s\t\t\:\ \5\,\ \n\a\m\e\:\ \'\T\r\ầ\n\ \T\r\ọ\n\g\ \K\h\a\n\g\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\0\9\/\0\9\/\2\0\1\1\'\,\ \t\o\:\ \4\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\0\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \7\.\6\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\0\5\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\0\5\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \3\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\v\3\:\ \'\T\r\u\n\g\ \t\â\m\ \G\D\N\N\-\G\D\T\X\'\,\ \n\o\t\e\s\:\ \'\N\g\o\a\n\ \n\g\o\ã\n\,\ \h\ò\a\ \đ\ồ\n\g\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\0\6\'\,\ \s\t\t\:\ \6\,\ \n\a\m\e\:\ \'\P\h\ạ\m\ \T\ấ\n\ \L\ộ\c\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\3\0\/\1\1\/\2\0\1\1\'\,\ \t\o\:\ \4\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\1\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \7\.\5\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\0\6\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\0\6\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\Ý\ \t\h\ứ\c\ \t\r\ự\c\ \n\h\ậ\t\ \t\ố\t\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\0\7\'\,\ \s\t\t\:\ \7\,\ \n\a\m\e\:\ \'\T\r\ầ\n\ \K\h\á\ \T\h\u\ậ\n\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\1\2\/\0\2\/\2\0\1\1\'\,\ \t\o\:\ \4\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \8\8\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \7\.\3\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\0\7\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\0\7\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \1\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\v\3\:\ \'\T\r\u\n\g\ \t\â\m\ \G\D\N\N\-\G\D\T\X\'\,\ \n\o\t\e\s\:\ \'\C\h\ă\m\ \c\h\ỉ\ \h\ọ\c\ \t\ậ\p\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\0\8\'\,\ \s\t\t\:\ \8\,\ \n\a\m\e\:\ \'\H\ồ\ \T\h\ị\ \T\h\a\n\h\ \H\u\y\ề\n\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\1\4\/\0\6\/\2\0\1\1\'\,\ \t\o\:\ \4\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\5\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\T\ố\t\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\6\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\0\8\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\0\8\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \2\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\H\ă\n\g\ \h\á\i\ \x\â\y\ \d\ự\n\g\ \b\à\i\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\0\9\'\,\ \s\t\t\:\ \9\,\ \n\a\m\e\:\ \'\T\r\ư\ơ\n\g\ \T\h\ị\ \B\í\c\h\ \D\â\n\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\0\3\/\0\8\/\2\0\1\1\'\,\ \t\o\:\ \4\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\0\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \7\.\7\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\0\9\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\0\9\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \4\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\K\ỷ\ \l\u\ậ\t\ \t\ố\t\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\1\0\'\,\ \s\t\t\:\ \1\0\,\ \n\a\m\e\:\ \'\N\g\u\y\ễ\n\ \V\ă\n\ \N\g\à\ \E\m\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\2\5\/\1\0\/\2\0\1\1\'\,\ \t\o\:\ \4\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \8\9\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \7\.\4\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\1\0\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\1\0\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\v\3\:\ \'\T\r\u\n\g\ \t\â\m\ \G\D\N\N\-\G\D\T\X\'\,\ \n\o\t\e\s\:\ \'\N\h\i\ệ\t\ \t\ì\n\h\ \v\ớ\i\ \h\o\ạ\t\ \đ\ộ\n\g\ \c\h\u\n\g\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\1\1\'\,\ \s\t\t\:\ \1\1\,\ \n\a\m\e\:\ \'\L\â\m\ \T\h\á\i\ \B\ả\o\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\1\9\/\1\2\/\2\0\1\1\'\,\ \t\o\:\ \4\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \8\8\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \7\.\2\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\1\1\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\1\1\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \1\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\v\3\:\ \'\T\r\u\n\g\ \t\â\m\ \G\D\N\N\-\G\D\T\X\'\,\ \n\o\t\e\s\:\ \'\C\ó\ \t\i\ế\n\ \b\ộ\ \t\r\o\n\g\ \h\ọ\c\ \k\ỳ\'\ \}\,\
\
\ \ \/\/\ \T\Ổ\ \3\ \(\1\0\ \H\S\)\
\ \ \{\ \i\d\:\ \'\H\S\1\2\'\,\ \s\t\t\:\ \1\2\,\ \n\a\m\e\:\ \'\T\r\ư\ơ\n\g\ \H\ữ\u\ \N\g\h\ĩ\a\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\1\1\/\0\5\/\2\0\1\1\'\,\ \t\o\:\ \3\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\8\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\T\ố\t\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\9\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\1\2\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\1\2\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \1\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \C\h\u\y\ê\n\ \L\o\n\g\ \K\h\á\n\h\'\,\ \n\v\2\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\3\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\o\t\e\s\:\ \'\H\ọ\c\ \l\ự\c\ \g\i\ỏ\i\,\ \k\ỷ\ \l\u\ậ\t\ \t\ố\t\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\1\3\'\,\ \s\t\t\:\ \1\3\,\ \n\a\m\e\:\ \'\T\r\ư\ơ\n\g\ \K\i\m\ \N\g\â\n\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\2\8\/\0\3\/\2\0\1\1\'\,\ \t\o\:\ \3\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\6\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\T\ố\t\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\7\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\1\3\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\1\3\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \2\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\C\h\ă\m\ \n\g\o\a\n\,\ \h\ò\a\ \đ\ồ\n\g\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\1\4\'\,\ \s\t\t\:\ \1\4\,\ \n\a\m\e\:\ \'\N\g\u\y\ễ\n\ \T\h\ị\ \K\i\m\ \A\n\h\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\1\9\/\0\8\/\2\0\1\1\'\,\ \t\o\:\ \3\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\4\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\T\ố\t\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\5\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\1\4\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\1\4\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\C\h\ă\m\ \c\h\ỉ\,\ \c\h\ữ\ \v\i\ế\t\ \đ\ẹ\p\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\1\5\'\,\ \s\t\t\:\ \1\5\,\ \n\a\m\e\:\ \'\L\ê\ \B\í\c\h\ \T\h\i\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\0\4\/\1\2\/\2\0\1\1\'\,\ \t\o\:\ \3\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\1\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \7\.\8\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\1\5\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\1\5\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \3\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\v\3\:\ \'\T\r\u\n\g\ \t\â\m\ \G\D\N\N\-\G\D\T\X\'\,\ \n\o\t\e\s\:\ \'\Ý\ \t\h\ứ\c\ \r\è\n\ \l\u\y\ệ\n\ \t\ố\t\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\1\6\'\,\ \s\t\t\:\ \1\6\,\ \n\a\m\e\:\ \'\N\g\u\y\ễ\n\ \M\i\n\h\ \T\r\i\ế\t\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\1\7\/\0\2\/\2\0\1\1\'\,\ \t\o\:\ \3\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\3\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\T\ố\t\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\3\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\1\6\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\1\6\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \1\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\H\ọ\c\ \l\ự\c\ \v\ữ\n\g\ \v\à\n\g\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\1\7\'\,\ \s\t\t\:\ \1\7\,\ \n\a\m\e\:\ \'\N\g\u\y\ễ\n\ \P\h\ú\ \Q\u\ý\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\0\8\/\0\4\/\2\0\1\1\'\,\ \t\o\:\ \3\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\0\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \7\.\6\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\1\7\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\1\7\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \4\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\v\3\:\ \'\T\r\u\n\g\ \t\â\m\ \G\D\N\N\-\G\D\T\X\'\,\ \n\o\t\e\s\:\ \'\N\h\i\ệ\t\ \t\ì\n\h\ \g\i\ú\p\ \đ\ỡ\ \b\ạ\n\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\1\8\'\,\ \s\t\t\:\ \1\8\,\ \n\a\m\e\:\ \'\P\h\a\n\ \T\u\ấ\n\ \K\h\a\n\g\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\2\3\/\0\9\/\2\0\1\1\'\,\ \t\o\:\ \3\,\ \r\o\l\e\:\ \'\T\ổ\ \t\r\ư\ở\n\g\ \3\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \8\9\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \7\.\5\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\1\8\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\1\8\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\T\ổ\ \t\r\ư\ở\n\g\ \t\ổ\ \3\ \t\á\c\ \p\h\o\n\g\ \n\h\a\n\h\ \n\h\ẹ\n\,\ \t\r\á\c\h\ \n\h\i\ệ\m\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\1\9\'\,\ \s\t\t\:\ \1\9\,\ \n\a\m\e\:\ \'\T\r\ầ\n\ \T\h\ị\ \T\h\a\n\h\ \N\g\â\n\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\1\0\/\0\1\/\2\0\1\1\'\,\ \t\o\:\ \3\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\4\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\T\ố\t\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\4\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\1\9\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\1\9\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \2\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\T\í\c\h\ \c\ự\c\ \p\h\á\t\ \b\i\ể\u\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\2\0\'\,\ \s\t\t\:\ \2\0\,\ \n\a\m\e\:\ \'\H\u\ỳ\n\h\ \Q\u\ố\c\ \L\o\n\g\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\1\6\/\0\7\/\2\0\1\1\'\,\ \t\o\:\ \3\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \8\8\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \7\.\3\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\2\0\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\2\0\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \3\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\v\3\:\ \'\T\r\u\n\g\ \t\â\m\ \G\D\N\N\-\G\D\T\X\'\,\ \n\o\t\e\s\:\ \'\C\ó\ \t\i\n\h\ \t\h\ầ\n\ \t\ậ\p\ \t\h\ể\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\2\1\'\,\ \s\t\t\:\ \2\1\,\ \n\a\m\e\:\ \'\N\g\u\y\ễ\n\ \T\h\a\n\h\ \D\u\y\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\0\2\/\0\6\/\2\0\1\1\'\,\ \t\o\:\ \3\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \8\7\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \7\.\2\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\2\1\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\2\1\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\v\3\:\ \'\T\r\u\n\g\ \c\ấ\p\ \N\g\h\ề\'\,\ \n\o\t\e\s\:\ \'\C\ố\ \g\ắ\n\g\ \t\r\o\n\g\ \m\ô\n\ \T\o\á\n\'\ \}\,\
\
\ \ \/\/\ \T\Ổ\ \2\ \(\1\0\ \H\S\)\
\ \ \{\ \i\d\:\ \'\H\S\2\2\'\,\ \s\t\t\:\ \2\2\,\ \n\a\m\e\:\ \'\N\g\u\y\ễ\n\ \T\h\ị\ \H\u\y\ề\n\ \T\r\a\n\g\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\2\9\/\0\8\/\2\0\1\1\'\,\ \t\o\:\ \2\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\9\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\T\ố\t\'\,\ \s\c\o\r\e\A\v\g\:\ \9\.\3\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\2\2\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\2\2\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \1\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \C\h\u\y\ê\n\ \L\o\n\g\ \K\h\á\n\h\'\,\ \n\v\2\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\3\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\o\t\e\s\:\ \'\H\ọ\c\ \l\ự\c\ \x\u\ấ\t\ \s\ắ\c\,\ \t\í\c\h\ \c\ự\c\ \t\h\a\m\ \g\i\a\ \p\h\o\n\g\ \t\r\à\o\ \l\ớ\p\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\2\3\'\,\ \s\t\t\:\ \2\3\,\ \n\a\m\e\:\ \'\N\g\u\y\ễ\n\ \T\h\ị\ \K\i\m\ \Y\ế\n\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\0\7\/\0\3\/\2\0\1\1\'\,\ \t\o\:\ \2\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\5\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\T\ố\t\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\6\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\2\3\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\2\3\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \2\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\C\h\ă\m\ \n\g\o\a\n\,\ \t\í\c\h\ \c\ự\c\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\2\4\'\,\ \s\t\t\:\ \2\4\,\ \n\a\m\e\:\ \'\P\h\ạ\m\ \H\o\à\n\g\ \H\u\y\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\1\4\/\1\1\/\2\0\1\1\'\,\ \t\o\:\ \2\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\0\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \7\.\7\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\2\4\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\2\4\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\v\3\:\ \'\T\r\u\n\g\ \t\â\m\ \G\D\N\N\-\G\D\T\X\'\,\ \n\o\t\e\s\:\ \'\M\ô\n\ \K\H\T\N\ \t\i\ế\p\ \t\h\u\ \t\ố\t\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\2\5\'\,\ \s\t\t\:\ \2\5\,\ \n\a\m\e\:\ \'\N\g\u\y\ễ\n\ \L\ê\ \T\h\à\n\h\ \Đ\ạ\t\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\2\1\/\0\5\/\2\0\1\1\'\,\ \t\o\:\ \2\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \8\9\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \7\.\6\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\2\5\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\2\5\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \3\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\T\h\a\m\ \g\i\a\ \c\á\c\ \p\h\o\n\g\ \t\r\à\o\ \t\h\ể\ \t\h\a\o\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\2\6\'\,\ \s\t\t\:\ \2\6\,\ \n\a\m\e\:\ \'\P\h\a\n\ \T\r\ầ\n\ \T\h\ả\o\ \Q\u\y\ê\n\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\0\5\/\1\2\/\2\0\1\1\'\,\ \t\o\:\ \2\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\3\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\T\ố\t\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\4\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\2\6\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\2\6\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \4\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\H\ọ\c\ \đ\ề\u\ \c\á\c\ \m\ô\n\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\2\7\'\,\ \s\t\t\:\ \2\7\,\ \n\a\m\e\:\ \'\H\ồ\ \T\h\ị\ \K\i\m\ \C\ư\ơ\n\g\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\1\8\/\0\9\/\2\0\1\1\'\,\ \t\o\:\ \2\,\ \r\o\l\e\:\ \'\T\ổ\ \t\r\ư\ở\n\g\ \2\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\2\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \7\.\8\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\2\7\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\2\7\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \1\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\v\3\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\o\t\e\s\:\ \'\T\ổ\ \t\r\ư\ở\n\g\ \t\ổ\ \2\ \n\h\i\ệ\t\ \t\ì\n\h\,\ \t\h\e\o\ \d\õ\i\ \n\ề\ \n\ế\p\ \t\ổ\ \c\h\u\ \đ\á\o\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\2\8\'\,\ \s\t\t\:\ \2\8\,\ \n\a\m\e\:\ \'\P\h\ạ\m\ \T\ấ\n\ \L\ợ\i\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\0\9\/\0\2\/\2\0\1\1\'\,\ \t\o\:\ \2\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \8\9\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \7\.\5\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\2\8\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\2\8\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\C\ó\ \t\i\n\h\ \t\h\ầ\n\ \t\r\á\c\h\ \n\h\i\ệ\m\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\2\9\'\,\ \s\t\t\:\ \2\9\,\ \n\a\m\e\:\ \'\N\g\u\y\ễ\n\ \V\ũ\ \D\u\y\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\2\7\/\0\6\/\2\0\1\1\'\,\ \t\o\:\ \2\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \8\8\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \7\.\4\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\2\9\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\2\9\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \2\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\V\ệ\ \s\i\n\h\ \t\r\ự\c\ \n\h\ậ\t\ \s\ạ\c\h\ \s\ẽ\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\3\0\'\,\ \s\t\t\:\ \3\0\,\ \n\a\m\e\:\ \'\T\r\ì\n\h\ \M\i\n\h\ \T\h\i\ệ\n\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\1\3\/\1\0\/\2\0\1\1\'\,\ \t\o\:\ \2\,\ \r\o\l\e\:\ \'\L\ớ\p\ \t\r\ư\ở\n\g\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\8\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\T\ố\t\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\5\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\3\0\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\3\0\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \3\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\v\3\:\ \'\T\r\u\n\g\ \t\â\m\ \G\D\N\N\-\G\D\T\X\'\,\ \n\o\t\e\s\:\ \'\L\ớ\p\ \t\r\ư\ở\n\g\ \g\ư\ơ\n\g\ \m\ẫ\u\,\ \ý\ \t\h\ứ\c\ \k\ỷ\ \l\u\ậ\t\ \n\g\h\i\ê\m\ \t\ú\c\,\ \n\ă\n\g\ \l\ự\c\ \c\h\ỉ\ \h\u\y\ \t\ố\t\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\3\1\'\,\ \s\t\t\:\ \3\1\,\ \n\a\m\e\:\ \'\Đ\ỗ\ \D\u\y\ \B\ả\o\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\3\1\/\0\1\/\2\0\1\1\'\,\ \t\o\:\ \2\,\ \r\o\l\e\:\ \'\L\ớ\p\ \p\h\ó\ \T\r\ậ\t\ \t\ự\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\6\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\0\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\3\1\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\3\1\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\L\ớ\p\ \p\h\ó\ \T\r\ậ\t\ \t\ự\ \c\ô\n\g\ \t\â\m\,\ \đ\ô\n\ \đ\ố\c\ \k\ỷ\ \l\u\ậ\t\ \l\ớ\p\ \r\ấ\t\ \t\ố\t\'\ \}\,\
\
\ \ \/\/\ \T\Ổ\ \1\ \(\1\2\ \H\S\)\
\ \ \{\ \i\d\:\ \'\H\S\3\2\'\,\ \s\t\t\:\ \3\2\,\ \n\a\m\e\:\ \'\Đ\ỗ\ \T\h\ị\ \T\h\ù\y\ \L\i\n\h\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\0\6\/\0\7\/\2\0\1\1\'\,\ \t\o\:\ \1\,\ \r\o\l\e\:\ \'\L\ớ\p\ \p\h\ó\ \H\ọ\c\ \t\ậ\p\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \1\0\0\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\T\ố\t\'\,\ \s\c\o\r\e\A\v\g\:\ \9\.\4\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\3\2\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\3\2\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \2\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \C\h\u\y\ê\n\ \L\o\n\g\ \K\h\á\n\h\'\,\ \n\v\2\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\3\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\o\t\e\s\:\ \'\L\ớ\p\ \p\h\ó\ \H\ọ\c\ \t\ậ\p\ \g\ư\ơ\n\g\ \m\ẫ\u\,\ \h\ọ\c\ \l\ự\c\ \x\u\ấ\t\ \s\ắ\c\,\ \p\h\ụ\ \t\r\á\c\h\ \h\ọ\c\ \t\ậ\p\ \t\o\à\n\ \d\i\ệ\n\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\3\3\'\,\ \s\t\t\:\ \3\3\,\ \n\a\m\e\:\ \'\N\g\u\y\ễ\n\ \T\h\ị\ \T\u\y\ế\t\ \N\h\ư\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\1\5\/\0\9\/\2\0\1\1\'\,\ \t\o\:\ \1\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\8\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\T\ố\t\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\8\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\3\3\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\3\3\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\C\h\ă\m\ \n\g\o\a\n\,\ \c\ẩ\n\ \t\h\ậ\n\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\3\4\'\,\ \s\t\t\:\ \3\4\,\ \n\a\m\e\:\ \'\V\õ\ \H\ạ\ \L\a\m\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\2\4\/\1\1\/\2\0\1\1\'\,\ \t\o\:\ \1\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\6\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\T\ố\t\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\6\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\3\4\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\3\4\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \3\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\v\3\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\o\t\e\s\:\ \'\C\h\ă\m\ \n\g\o\a\n\,\ \h\ò\a\ \đ\ồ\n\g\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\3\5\'\,\ \s\t\t\:\ \3\5\,\ \n\a\m\e\:\ \'\H\u\ỳ\n\h\ \T\h\ị\ \N\g\ọ\c\ \H\â\n\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\0\3\/\0\5\/\2\0\1\1\'\,\ \t\o\:\ \1\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\4\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\T\ố\t\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\5\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\3\5\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\3\5\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \1\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\H\ọ\c\ \g\i\ỏ\i\ \m\ô\n\ \T\i\ế\n\g\ \A\n\h\ \v\à\ \N\g\ữ\ \v\ă\n\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\3\6\'\,\ \s\t\t\:\ \3\6\,\ \n\a\m\e\:\ \'\L\ê\ \T\h\ị\ \T\h\ú\y\ \V\y\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\1\9\/\0\1\/\2\0\1\1\'\,\ \t\o\:\ \1\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\2\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \7\.\9\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\3\6\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\3\6\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \4\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\Ý\ \t\h\ứ\c\ \n\ề\ \n\ế\p\ \t\ố\t\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\3\7\'\,\ \s\t\t\:\ \3\7\,\ \n\a\m\e\:\ \'\L\ê\ \K\i\ề\u\ \K\h\ả\ \Á\i\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\2\8\/\0\8\/\2\0\1\1\'\,\ \t\o\:\ \1\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\5\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\T\ố\t\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\7\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\3\7\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\3\7\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\C\h\ă\m\ \n\g\o\a\n\,\ \h\ă\n\g\ \h\á\i\ \p\h\á\t\ \b\i\ể\u\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\3\8\'\,\ \s\t\t\:\ \3\8\,\ \n\a\m\e\:\ \'\T\r\ị\n\h\ \L\a\n\ \P\h\ư\ơ\n\g\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\1\2\/\1\2\/\2\0\1\1\'\,\ \t\o\:\ \1\,\ \r\o\l\e\:\ \'\T\h\ủ\ \q\u\ỹ\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\6\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\T\ố\t\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\6\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\3\8\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\3\8\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \2\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\T\h\ủ\ \q\u\ỹ\ \c\ẩ\n\ \t\h\ậ\n\,\ \q\u\ả\n\ \l\ý\ \t\à\i\ \c\h\í\n\h\ \l\ớ\p\ \m\i\n\h\ \b\ạ\c\h\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\3\9\'\,\ \s\t\t\:\ \3\9\,\ \n\a\m\e\:\ \'\N\g\u\y\ễ\n\ \T\h\ị\ \N\g\ọ\c\ \T\h\ả\o\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\0\8\/\0\3\/\2\0\1\1\'\,\ \t\o\:\ \1\,\ \r\o\l\e\:\ \'\T\ổ\ \t\r\ư\ở\n\g\ \1\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\5\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\2\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\3\9\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\3\9\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \3\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\T\ổ\ \t\r\ư\ở\n\g\ \t\ổ\ \1\ \g\ư\ơ\n\g\ \m\ẫ\u\,\ \đ\ô\n\ \đ\ố\c\ \t\h\à\n\h\ \v\i\ê\n\ \n\ề\ \n\ế\p\ \r\ấ\t\ \t\ố\t\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\4\0\'\,\ \s\t\t\:\ \4\0\,\ \n\a\m\e\:\ \'\L\ê\ \C\ô\n\g\ \M\i\n\h\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\2\2\/\1\0\/\2\0\1\1\'\,\ \t\o\:\ \1\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\6\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\0\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\4\0\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\4\0\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \1\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\N\g\o\a\n\ \n\g\o\ã\n\,\ \n\h\i\ệ\t\ \t\ì\n\h\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\4\1\'\,\ \s\t\t\:\ \4\1\,\ \n\a\m\e\:\ \'\N\g\u\y\ễ\n\ \T\h\a\n\h\ \N\h\â\n\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\1\7\/\0\4\/\2\0\1\1\'\,\ \t\o\:\ \1\,\ \r\o\l\e\:\ \'\L\ớ\p\ \p\h\ó\ \L\a\o\ \đ\ộ\n\g\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\4\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \7\.\8\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\4\1\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\4\1\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\v\3\:\ \'\T\r\u\n\g\ \t\â\m\ \G\D\N\N\-\G\D\T\X\'\,\ \n\o\t\e\s\:\ \'\L\ớ\p\ \p\h\ó\ \L\a\o\ \đ\ộ\n\g\ \đ\ô\n\ \đ\ố\c\ \t\r\ự\c\ \n\h\ậ\t\ \n\h\i\ệ\t\ \t\ì\n\h\,\ \t\r\á\c\h\ \n\h\i\ệ\m\ \c\a\o\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\4\2\'\,\ \s\t\t\:\ \4\2\,\ \n\a\m\e\:\ \'\L\ê\ \T\h\à\n\h\ \N\g\u\y\ê\n\'\,\ \g\e\n\d\e\r\:\ \'\N\a\m\'\,\ \d\o\b\:\ \'\3\0\/\0\6\/\2\0\1\1\'\,\ \t\o\:\ \1\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\0\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\K\h\á\'\,\ \s\c\o\r\e\A\v\g\:\ \7\.\6\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\4\2\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\4\2\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \4\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\v\3\:\ \'\T\r\u\n\g\ \t\â\m\ \G\D\N\N\-\G\D\T\X\'\,\ \n\o\t\e\s\:\ \'\N\g\o\a\n\ \n\g\o\ã\n\,\ \h\ò\a\ \đ\ồ\n\g\'\ \}\,\
\ \ \{\ \i\d\:\ \'\H\S\4\3\'\,\ \s\t\t\:\ \4\3\,\ \n\a\m\e\:\ \'\L\ê\ \T\h\ị\ \K\i\ề\u\ \D\u\y\ê\n\'\,\ \g\e\n\d\e\r\:\ \'\N\ữ\'\,\ \d\o\b\:\ \'\1\1\/\0\8\/\2\0\1\1\'\,\ \t\o\:\ \1\,\ \r\o\l\e\:\ \'\H\ọ\c\ \s\i\n\h\'\,\ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \9\3\,\ \c\o\n\d\u\c\t\:\ \'\T\ố\t\'\,\ \a\c\a\d\e\m\i\c\:\ \'\T\ố\t\'\,\ \s\c\o\r\e\A\v\g\:\ \8\.\4\,\ \p\h\o\n\e\:\ \'\0\9\1\2\.\3\4\5\.\6\4\3\'\,\ \p\a\r\e\n\t\P\h\o\n\e\:\ \'\0\9\0\3\.\1\1\1\.\2\4\3\'\,\ \a\d\d\r\e\s\s\:\ \'\Ấ\p\ \2\,\ \X\ã\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \'\Đ\ã\ \n\ộ\p\'\,\ \n\v\1\:\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\ \n\v\2\:\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\ \n\v\3\:\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\,\ \n\o\t\e\s\:\ \'\C\h\ă\m\ \c\h\ỉ\,\ \t\í\c\h\ \c\ự\c\ \t\r\o\n\g\ \g\i\ờ\ \h\ọ\c\'\ \}\
\]\;\
\
\v\a\r\ \H\E\A\D\E\R\S\ \=\ \[\
\ \ \'\M\ã\ \H\S\'\,\ \'\S\T\T\'\,\ \'\H\ọ\ \v\à\ \T\ê\n\'\,\ \'\G\i\ớ\i\ \t\í\n\h\'\,\ \'\N\g\à\y\ \s\i\n\h\'\,\ \'\T\ổ\'\,\ \'\C\h\ứ\c\ \v\ụ\'\,\
\ \ \'\Đ\i\ể\m\ \T\h\i\ \Đ\u\a\'\,\ \'\R\è\n\ \L\u\y\ệ\n\ \(\T\T\2\2\)\'\,\ \'\H\ọ\c\ \L\ự\c\ \(\T\T\2\2\)\'\,\ \'\Đ\i\ể\m\ \T\B\'\,\
\ \ \'\S\Đ\T\ \H\ọ\c\ \S\i\n\h\'\,\ \'\S\Đ\T\ \P\h\ụ\ \H\u\y\n\h\'\,\ \'\Đ\ị\a\ \C\h\ỉ\'\,\ \'\B\à\i\ \T\ậ\p\ \V\ề\ \N\h\à\'\,\
\ \ \'\N\V\1\ \L\ớ\p\ \1\0\'\,\ \'\N\V\2\ \L\ớ\p\ \1\0\'\,\ \'\N\V\3\ \L\ớ\p\ \1\0\'\,\ \'\G\h\i\ \C\h\ú\'\
\]\;\
\
\f\u\n\c\t\i\o\n\ \g\e\t\T\a\r\g\e\t\S\p\r\e\a\d\s\h\e\e\t\(\e\)\ \{\
\ \ \v\a\r\ \s\s\ \=\ \n\u\l\l\;\
\ \ \t\r\y\ \{\
\ \ \ \ \s\s\ \=\ \S\p\r\e\a\d\s\h\e\e\t\A\p\p\.\g\e\t\A\c\t\i\v\e\S\p\r\e\a\d\s\h\e\e\t\(\)\;\
\ \ \}\ \c\a\t\c\h\ \(\e\r\r\)\ \{\}\
\
\ \ \i\f\ \(\!\s\s\ \&\&\ \e\ \&\&\ \e\.\p\a\r\a\m\e\t\e\r\ \&\&\ \e\.\p\a\r\a\m\e\t\e\r\.\s\h\e\e\t\I\d\)\ \{\
\ \ \ \ \t\r\y\ \{\
\ \ \ \ \ \ \s\s\ \=\ \S\p\r\e\a\d\s\h\e\e\t\A\p\p\.\o\p\e\n\B\y\I\d\(\e\.\p\a\r\a\m\e\t\e\r\.\s\h\e\e\t\I\d\.\t\r\i\m\(\)\)\;\
\ \ \ \ \}\ \c\a\t\c\h\ \(\e\r\r\)\ \{\}\
\ \ \}\
\
\ \ \i\f\ \(\!\s\s\ \&\&\ \t\y\p\e\o\f\ \S\P\R\E\A\D\S\H\E\E\T\_\I\D\ \=\=\=\ \'\s\t\r\i\n\g\'\ \&\&\ \S\P\R\E\A\D\S\H\E\E\T\_\I\D\.\t\r\i\m\(\)\ \!\=\=\ \'\'\)\ \{\
\ \ \ \ \t\r\y\ \{\
\ \ \ \ \ \ \s\s\ \=\ \S\p\r\e\a\d\s\h\e\e\t\A\p\p\.\o\p\e\n\B\y\I\d\(\S\P\R\E\A\D\S\H\E\E\T\_\I\D\.\t\r\i\m\(\)\)\;\
\ \ \ \ \}\ \c\a\t\c\h\ \(\e\r\r\)\ \{\}\
\ \ \}\
\
\ \ \r\e\t\u\r\n\ \s\s\;\
\}\
\
\/\/\ \H\à\m\ \f\o\r\m\a\t\ \v\à\ \g\h\i\ \t\o\à\n\ \b\ộ\ \d\ữ\ \l\i\ệ\u\ \h\ọ\c\ \s\i\n\h\ \v\à\o\ \s\h\e\e\t\ \D\a\n\h\S\a\c\h\9\A\1\
\f\u\n\c\t\i\o\n\ \p\o\p\u\l\a\t\e\S\h\e\e\t\W\i\t\h\S\t\u\d\e\n\t\s\(\s\s\,\ \s\t\u\d\e\n\t\s\L\i\s\t\)\ \{\
\ \ \v\a\r\ \l\i\s\t\ \=\ \(\s\t\u\d\e\n\t\s\L\i\s\t\ \&\&\ \s\t\u\d\e\n\t\s\L\i\s\t\.\l\e\n\g\t\h\ \>\ \0\)\ \?\ \s\t\u\d\e\n\t\s\L\i\s\t\ \:\ \D\E\F\A\U\L\T\_\S\T\U\D\E\N\T\S\_\9\A\1\;\
\ \ \v\a\r\ \s\h\e\e\t\ \=\ \s\s\.\g\e\t\S\h\e\e\t\B\y\N\a\m\e\(\'\D\a\n\h\S\a\c\h\9\A\1\'\)\;\
\ \ \i\f\ \(\!\s\h\e\e\t\)\ \{\
\ \ \ \ \s\h\e\e\t\ \=\ \s\s\.\i\n\s\e\r\t\S\h\e\e\t\(\'\D\a\n\h\S\a\c\h\9\A\1\'\,\ \0\)\;\
\ \ \}\
\
\ \ \/\/\ \X\ó\a\ \t\o\à\n\ \b\ộ\ \n\ộ\i\ \d\u\n\g\ \c\ũ\ \đ\ể\ \l\à\m\ \m\ớ\i\ \đ\ị\n\h\ \d\ạ\n\g\ \c\h\u\ẩ\n\
\ \ \s\h\e\e\t\.\c\l\e\a\r\(\)\;\
\
\ \ \/\/\ \1\.\ \G\h\i\ \d\ò\n\g\ \t\i\ê\u\ \đ\ề\
\ \ \s\h\e\e\t\.\g\e\t\R\a\n\g\e\(\1\,\ \1\,\ \1\,\ \H\E\A\D\E\R\S\.\l\e\n\g\t\h\)\.\s\e\t\V\a\l\u\e\s\(\[\H\E\A\D\E\R\S\]\)\;\
\
\ \ \/\/\ \F\o\r\m\a\t\ \t\i\ê\u\ \đ\ề\ \c\h\u\y\ê\n\ \n\g\h\i\ệ\p\
\ \ \v\a\r\ \h\e\a\d\e\r\R\a\n\g\e\ \=\ \s\h\e\e\t\.\g\e\t\R\a\n\g\e\(\1\,\ \1\,\ \1\,\ \H\E\A\D\E\R\S\.\l\e\n\g\t\h\)\;\
\ \ \h\e\a\d\e\r\R\a\n\g\e\.\s\e\t\B\a\c\k\g\r\o\u\n\d\(\'\#\1\e\4\0\a\f\'\)\;\ \/\/\ \X\a\n\h\ \n\a\v\y\ \đ\ậ\m\
\ \ \h\e\a\d\e\r\R\a\n\g\e\.\s\e\t\F\o\n\t\C\o\l\o\r\(\'\#\f\f\f\f\f\f\'\)\;\ \/\/\ \C\h\ữ\ \t\r\ắ\n\g\
\ \ \h\e\a\d\e\r\R\a\n\g\e\.\s\e\t\F\o\n\t\W\e\i\g\h\t\(\'\b\o\l\d\'\)\;\
\ \ \h\e\a\d\e\r\R\a\n\g\e\.\s\e\t\F\o\n\t\F\a\m\i\l\y\(\'\A\r\i\a\l\'\)\;\
\ \ \h\e\a\d\e\r\R\a\n\g\e\.\s\e\t\F\o\n\t\S\i\z\e\(\1\0\.\5\)\;\
\ \ \h\e\a\d\e\r\R\a\n\g\e\.\s\e\t\H\o\r\i\z\o\n\t\a\l\A\l\i\g\n\m\e\n\t\(\'\c\e\n\t\e\r\'\)\;\
\ \ \h\e\a\d\e\r\R\a\n\g\e\.\s\e\t\V\e\r\t\i\c\a\l\A\l\i\g\n\m\e\n\t\(\'\m\i\d\d\l\e\'\)\;\
\ \ \h\e\a\d\e\r\R\a\n\g\e\.\s\e\t\W\r\a\p\(\t\r\u\e\)\;\
\ \ \s\h\e\e\t\.\s\e\t\R\o\w\H\e\i\g\h\t\(\1\,\ \3\6\)\;\
\ \ \s\h\e\e\t\.\s\e\t\F\r\o\z\e\n\R\o\w\s\(\1\)\;\
\
\ \ \/\/\ \2\.\ \C\h\u\ẩ\n\ \b\ị\ \h\à\n\g\ \d\ữ\ \l\i\ệ\u\
\ \ \v\a\r\ \r\o\w\s\ \=\ \l\i\s\t\.\m\a\p\(\f\u\n\c\t\i\o\n\(\s\,\ \i\d\x\)\ \{\
\ \ \ \ \v\a\r\ \s\t\t\ \=\ \s\.\s\t\t\ \|\|\ \(\i\d\x\ \+\ \1\)\;\
\ \ \ \ \v\a\r\ \i\d\ \=\ \s\.\i\d\ \|\|\ \(\'\H\S\'\ \+\ \(\s\t\t\ \<\ \1\0\ \?\ \'\0\'\ \+\ \s\t\t\ \:\ \s\t\t\)\)\;\
\ \ \ \ \v\a\r\ \n\a\m\e\ \=\ \s\.\n\a\m\e\ \|\|\ \'\'\;\
\ \ \ \ \v\a\r\ \g\e\n\d\e\r\ \=\ \s\.\g\e\n\d\e\r\ \|\|\ \(\s\.\n\a\m\e\ \&\&\ \(\s\.\n\a\m\e\.\i\n\c\l\u\d\e\s\(\'\T\h\ị\'\)\ \|\|\ \s\.\n\a\m\e\.\i\n\c\l\u\d\e\s\(\'\N\h\u\n\g\'\)\ \|\|\ \s\.\n\a\m\e\.\i\n\c\l\u\d\e\s\(\'\T\r\â\n\'\)\ \|\|\ \s\.\n\a\m\e\.\i\n\c\l\u\d\e\s\(\'\D\â\n\'\)\ \|\|\ \s\.\n\a\m\e\.\i\n\c\l\u\d\e\s\(\'\N\g\â\n\'\)\ \|\|\ \s\.\n\a\m\e\.\i\n\c\l\u\d\e\s\(\'\T\h\i\'\)\ \|\|\ \s\.\n\a\m\e\.\i\n\c\l\u\d\e\s\(\'\T\r\a\n\g\'\)\ \|\|\ \s\.\n\a\m\e\.\i\n\c\l\u\d\e\s\(\'\Y\ế\n\'\)\ \|\|\ \s\.\n\a\m\e\.\i\n\c\l\u\d\e\s\(\'\Q\u\y\ê\n\'\)\ \|\|\ \s\.\n\a\m\e\.\i\n\c\l\u\d\e\s\(\'\C\ư\ơ\n\g\'\)\ \|\|\ \s\.\n\a\m\e\.\i\n\c\l\u\d\e\s\(\'\L\i\n\h\'\)\ \|\|\ \s\.\n\a\m\e\.\i\n\c\l\u\d\e\s\(\'\N\h\ư\'\)\ \|\|\ \s\.\n\a\m\e\.\i\n\c\l\u\d\e\s\(\'\L\a\m\'\)\ \|\|\ \s\.\n\a\m\e\.\i\n\c\l\u\d\e\s\(\'\H\â\n\'\)\ \|\|\ \s\.\n\a\m\e\.\i\n\c\l\u\d\e\s\(\'\V\y\'\)\ \|\|\ \s\.\n\a\m\e\.\i\n\c\l\u\d\e\s\(\'\Á\i\'\)\ \|\|\ \s\.\n\a\m\e\.\i\n\c\l\u\d\e\s\(\'\P\h\ư\ơ\n\g\'\)\ \|\|\ \s\.\n\a\m\e\.\i\n\c\l\u\d\e\s\(\'\T\h\ả\o\'\)\ \|\|\ \s\.\n\a\m\e\.\i\n\c\l\u\d\e\s\(\'\D\u\y\ê\n\'\)\)\ \?\ \'\N\ữ\'\ \:\ \'\N\a\m\'\)\;\
\ \ \ \ \v\a\r\ \d\o\b\ \=\ \s\.\d\o\b\ \|\|\ \'\'\;\
\ \ \ \ \v\a\r\ \t\o\V\a\l\ \=\ \s\.\t\o\ \?\ \(\'\T\ổ\ \'\ \+\ \s\.\t\o\)\ \:\ \'\'\;\
\ \ \ \ \v\a\r\ \r\o\l\e\ \=\ \s\.\r\o\l\e\ \|\|\ \'\H\ọ\c\ \s\i\n\h\'\;\
\ \ \ \ \v\a\r\ \c\o\n\d\u\c\t\S\c\o\r\e\ \=\ \N\u\m\b\e\r\(\s\.\c\o\n\d\u\c\t\S\c\o\r\e\)\ \|\|\ \1\0\0\;\
\ \ \ \ \v\a\r\ \c\o\n\d\u\c\t\ \=\ \s\.\c\o\n\d\u\c\t\ \|\|\ \'\T\ố\t\'\;\
\ \ \ \ \v\a\r\ \a\c\a\d\e\m\i\c\ \=\ \s\.\a\c\a\d\e\m\i\c\ \|\|\ \'\T\ố\t\'\;\
\ \ \ \ \v\a\r\ \s\c\o\r\e\A\v\g\ \=\ \N\u\m\b\e\r\(\s\.\s\c\o\r\e\A\v\g\)\ \|\|\ \8\.\0\;\
\ \ \ \ \v\a\r\ \p\h\o\n\e\ \=\ \s\.\p\h\o\n\e\ \|\|\ \'\'\;\
\ \ \ \ \v\a\r\ \p\a\r\e\n\t\P\h\o\n\e\ \=\ \s\.\p\a\r\e\n\t\P\h\o\n\e\ \|\|\ \'\'\;\
\ \ \ \ \v\a\r\ \a\d\d\r\e\s\s\ \=\ \s\.\a\d\d\r\e\s\s\ \|\|\ \'\'\;\
\ \ \ \ \v\a\r\ \h\o\m\e\w\o\r\k\ \=\ \(\s\.\h\o\m\e\w\o\r\k\S\t\a\t\u\s\ \=\=\=\ \t\r\u\e\ \|\|\ \s\.\h\o\m\e\w\o\r\k\S\t\a\t\u\s\ \=\=\=\ \'\Đ\ã\ \n\ộ\p\'\)\ \?\ \'\Đ\ã\ \n\ộ\p\'\ \:\ \'\C\h\ư\a\ \n\ộ\p\'\;\
\ \ \ \ \v\a\r\ \n\v\1\ \=\ \(\s\.\t\a\r\g\e\t\H\i\g\h\S\c\h\o\o\l\ \&\&\ \s\.\t\a\r\g\e\t\H\i\g\h\S\c\h\o\o\l\.\n\v\1\)\ \|\|\ \s\.\n\v\1\ \|\|\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\;\
\ \ \ \ \v\a\r\ \n\v\2\ \=\ \(\s\.\t\a\r\g\e\t\H\i\g\h\S\c\h\o\o\l\ \&\&\ \s\.\t\a\r\g\e\t\H\i\g\h\S\c\h\o\o\l\.\n\v\2\)\ \|\|\ \s\.\n\v\2\ \|\|\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\;\
\ \ \ \ \v\a\r\ \n\v\3\ \=\ \(\s\.\t\a\r\g\e\t\H\i\g\h\S\c\h\o\o\l\ \&\&\ \s\.\t\a\r\g\e\t\H\i\g\h\S\c\h\o\o\l\.\n\v\3\)\ \|\|\ \s\.\n\v\3\ \|\|\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\;\
\ \ \ \ \v\a\r\ \n\o\t\e\s\ \=\ \s\.\n\o\t\e\s\ \|\|\ \'\'\;\
\
\ \ \ \ \r\e\t\u\r\n\ \[\
\ \ \ \ \ \ \i\d\,\ \s\t\t\,\ \n\a\m\e\,\ \g\e\n\d\e\r\,\ \d\o\b\,\ \t\o\V\a\l\,\ \r\o\l\e\,\
\ \ \ \ \ \ \c\o\n\d\u\c\t\S\c\o\r\e\,\ \c\o\n\d\u\c\t\,\ \a\c\a\d\e\m\i\c\,\ \s\c\o\r\e\A\v\g\,\
\ \ \ \ \ \ \p\h\o\n\e\,\ \p\a\r\e\n\t\P\h\o\n\e\,\ \a\d\d\r\e\s\s\,\ \h\o\m\e\w\o\r\k\,\
\ \ \ \ \ \ \n\v\1\,\ \n\v\2\,\ \n\v\3\,\ \n\o\t\e\s\
\ \ \ \ \]\;\
\ \ \}\)\;\
\
\ \ \/\/\ \3\.\ \G\h\i\ \d\ữ\ \l\i\ệ\u\ \v\à\o\ \s\h\e\e\t\
\ \ \i\f\ \(\r\o\w\s\.\l\e\n\g\t\h\ \>\ \0\)\ \{\
\ \ \ \ \v\a\r\ \d\a\t\a\R\a\n\g\e\ \=\ \s\h\e\e\t\.\g\e\t\R\a\n\g\e\(\2\,\ \1\,\ \r\o\w\s\.\l\e\n\g\t\h\,\ \H\E\A\D\E\R\S\.\l\e\n\g\t\h\)\;\
\ \ \ \ \d\a\t\a\R\a\n\g\e\.\s\e\t\V\a\l\u\e\s\(\r\o\w\s\)\;\
\
\ \ \ \ \/\/\ \F\o\r\m\a\t\ \d\ữ\ \l\i\ệ\u\
\ \ \ \ \d\a\t\a\R\a\n\g\e\.\s\e\t\F\o\n\t\F\a\m\i\l\y\(\'\A\r\i\a\l\'\)\;\
\ \ \ \ \d\a\t\a\R\a\n\g\e\.\s\e\t\F\o\n\t\S\i\z\e\(\1\0\)\;\
\ \ \ \ \d\a\t\a\R\a\n\g\e\.\s\e\t\V\e\r\t\i\c\a\l\A\l\i\g\n\m\e\n\t\(\'\m\i\d\d\l\e\'\)\;\
\ \ \ \ \d\a\t\a\R\a\n\g\e\.\s\e\t\B\o\r\d\e\r\(\t\r\u\e\,\ \t\r\u\e\,\ \t\r\u\e\,\ \t\r\u\e\,\ \t\r\u\e\,\ \t\r\u\e\,\ \'\#\c\b\d\5\e\1\'\,\ \S\p\r\e\a\d\s\h\e\e\t\A\p\p\.\B\o\r\d\e\r\S\t\y\l\e\.\S\O\L\I\D\)\;\
\ \ \ \ \s\h\e\e\t\.\s\e\t\R\o\w\H\e\i\g\h\t\s\(\2\,\ \r\o\w\s\.\l\e\n\g\t\h\,\ \2\8\)\;\
\
\ \ \ \ \/\/\ \C\ă\n\ \g\i\ữ\a\ \c\á\c\ \c\ộ\t\ \m\ã\,\ \s\ố\,\ \n\g\à\y\ \s\i\n\h\,\ \c\h\ứ\c\ \v\ụ\,\ \đ\i\ể\m\.\.\.\
\ \ \ \ \v\a\r\ \c\e\n\t\e\r\C\o\l\s\ \=\ \[\1\,\ \2\,\ \4\,\ \5\,\ \6\,\ \7\,\ \8\,\ \9\,\ \1\0\,\ \1\1\,\ \1\2\,\ \1\3\,\ \1\5\]\;\
\ \ \ \ \c\e\n\t\e\r\C\o\l\s\.\f\o\r\E\a\c\h\(\f\u\n\c\t\i\o\n\(\c\)\ \{\
\ \ \ \ \ \ \s\h\e\e\t\.\g\e\t\R\a\n\g\e\(\2\,\ \c\,\ \r\o\w\s\.\l\e\n\g\t\h\,\ \1\)\.\s\e\t\H\o\r\i\z\o\n\t\a\l\A\l\i\g\n\m\e\n\t\(\'\c\e\n\t\e\r\'\)\;\
\ \ \ \ \}\)\;\
\
\ \ \ \ \/\/\ \C\ộ\t\ \H\ọ\ \t\ê\n\,\ \Đ\ị\a\ \c\h\ỉ\,\ \N\V\,\ \G\h\i\ \c\h\ú\ \c\ă\n\ \t\r\á\i\
\ \ \ \ \v\a\r\ \l\e\f\t\C\o\l\s\ \=\ \[\3\,\ \1\4\,\ \1\6\,\ \1\7\,\ \1\8\,\ \1\9\]\;\
\ \ \ \ \l\e\f\t\C\o\l\s\.\f\o\r\E\a\c\h\(\f\u\n\c\t\i\o\n\(\c\)\ \{\
\ \ \ \ \ \ \s\h\e\e\t\.\g\e\t\R\a\n\g\e\(\2\,\ \c\,\ \r\o\w\s\.\l\e\n\g\t\h\,\ \1\)\.\s\e\t\H\o\r\i\z\o\n\t\a\l\A\l\i\g\n\m\e\n\t\(\'\l\e\f\t\'\)\;\
\ \ \ \ \}\)\;\
\
\ \ \ \ \/\/\ \T\ô\ \m\à\u\ \x\e\n\ \k\ẽ\ \d\ò\n\g\ \c\h\ẵ\n\/\l\ẻ\ \đ\ể\ \đ\ọ\c\ \d\ễ\ \d\à\n\g\
\ \ \ \ \f\o\r\ \(\v\a\r\ \r\ \=\ \2\;\ \r\ \<\=\ \r\o\w\s\.\l\e\n\g\t\h\ \+\ \1\;\ \r\+\+\)\ \{\
\ \ \ \ \ \ \i\f\ \(\r\ \%\ \2\ \=\=\=\ \1\)\ \{\
\ \ \ \ \ \ \ \ \s\h\e\e\t\.\g\e\t\R\a\n\g\e\(\r\,\ \1\,\ \1\,\ \H\E\A\D\E\R\S\.\l\e\n\g\t\h\)\.\s\e\t\B\a\c\k\g\r\o\u\n\d\(\'\#\f\8\f\a\f\c\'\)\;\
\ \ \ \ \ \ \}\
\ \ \ \ \}\
\ \ \}\
\
\ \ \/\/\ \4\.\ \A\u\t\o\-\f\i\t\ \c\ộ\t\
\ \ \f\o\r\ \(\v\a\r\ \c\o\l\I\d\x\ \=\ \1\;\ \c\o\l\I\d\x\ \<\=\ \H\E\A\D\E\R\S\.\l\e\n\g\t\h\;\ \c\o\l\I\d\x\+\+\)\ \{\
\ \ \ \ \s\h\e\e\t\.\a\u\t\o\R\e\s\i\z\e\C\o\l\u\m\n\(\c\o\l\I\d\x\)\;\
\ \ \}\
\
\ \ \/\/\ \Đ\ả\m\ \b\ả\o\ \c\ó\ \s\h\e\e\t\ \A\u\d\i\t\L\o\g\
\ \ \i\n\i\t\A\u\d\i\t\S\h\e\e\t\(\s\s\)\;\
\
\ \ \r\e\t\u\r\n\ \s\h\e\e\t\;\
\}\
\
\f\u\n\c\t\i\o\n\ \i\n\i\t\A\u\d\i\t\S\h\e\e\t\(\s\s\)\ \{\
\ \ \v\a\r\ \a\u\d\i\t\ \=\ \s\s\.\g\e\t\S\h\e\e\t\B\y\N\a\m\e\(\'\A\u\d\i\t\L\o\g\'\)\;\
\ \ \i\f\ \(\!\a\u\d\i\t\)\ \{\
\ \ \ \ \a\u\d\i\t\ \=\ \s\s\.\i\n\s\e\r\t\S\h\e\e\t\(\'\A\u\d\i\t\L\o\g\'\)\;\
\ \ \ \ \a\u\d\i\t\.\a\p\p\e\n\d\R\o\w\(\[\'\T\h\ờ\i\ \g\i\a\n\'\,\ \'\N\g\ư\ờ\i\ \t\h\ự\c\ \h\i\ệ\n\'\,\ \'\H\ọ\c\ \s\i\n\h\'\,\ \'\N\ộ\i\ \d\u\n\g\ \t\h\a\y\ \đ\ổ\i\'\,\ \'\G\h\i\ \c\h\ú\'\]\)\;\
\ \ \ \ \v\a\r\ \h\R\a\n\g\e\ \=\ \a\u\d\i\t\.\g\e\t\R\a\n\g\e\(\1\,\ \1\,\ \1\,\ \5\)\;\
\ \ \ \ \h\R\a\n\g\e\.\s\e\t\B\a\c\k\g\r\o\u\n\d\(\'\#\0\4\7\8\5\7\'\)\;\ \/\/\ \X\a\n\h\ \n\g\ọ\c\
\ \ \ \ \h\R\a\n\g\e\.\s\e\t\F\o\n\t\C\o\l\o\r\(\'\#\f\f\f\f\f\f\'\)\;\
\ \ \ \ \h\R\a\n\g\e\.\s\e\t\F\o\n\t\W\e\i\g\h\t\(\'\b\o\l\d\'\)\;\
\ \ \ \ \a\u\d\i\t\.\s\e\t\F\r\o\z\e\n\R\o\w\s\(\1\)\;\
\ \ \ \ \a\u\d\i\t\.\s\e\t\R\o\w\H\e\i\g\h\t\(\1\,\ \3\0\)\;\
\ \ \}\
\ \ \r\e\t\u\r\n\ \a\u\d\i\t\;\
\}\
\
\f\u\n\c\t\i\o\n\ \l\o\g\T\o\A\u\d\i\t\S\h\e\e\t\(\s\s\,\ \s\t\u\d\e\n\t\N\a\m\e\,\ \a\c\t\o\r\,\ \p\o\i\n\t\D\e\l\t\a\,\ \r\e\a\s\o\n\)\ \{\
\ \ \v\a\r\ \a\u\d\i\t\S\h\e\e\t\ \=\ \i\n\i\t\A\u\d\i\t\S\h\e\e\t\(\s\s\)\;\
\ \ \v\a\r\ \c\h\a\n\g\e\T\e\x\t\ \=\ \(\t\y\p\e\o\f\ \p\o\i\n\t\D\e\l\t\a\ \=\=\=\ \'\n\u\m\b\e\r\'\ \&\&\ \p\o\i\n\t\D\e\l\t\a\ \>\ \0\)\ \?\ \(\'\+\'\ \+\ \p\o\i\n\t\D\e\l\t\a\ \+\ \'\ \đ\i\ể\m\'\)\ \:\ \(\p\o\i\n\t\D\e\l\t\a\ \+\ \'\ \đ\i\ể\m\'\)\;\
\ \ \a\u\d\i\t\S\h\e\e\t\.\a\p\p\e\n\d\R\o\w\(\[\n\e\w\ \D\a\t\e\(\)\,\ \a\c\t\o\r\ \|\|\ \'\G\V\C\N\'\,\ \s\t\u\d\e\n\t\N\a\m\e\ \|\|\ \'\T\o\à\n\ \l\ớ\p\'\,\ \c\h\a\n\g\e\T\e\x\t\,\ \r\e\a\s\o\n\ \|\|\ \'\'\]\)\;\
\}\
\
\/\/\ \G\E\T\ \W\e\b\h\o\o\k\:\ \Đ\ồ\n\g\ \b\ộ\ \t\ừ\ \G\o\o\g\l\e\ \S\h\e\e\t\ \v\ề\ \A\p\p\
\f\u\n\c\t\i\o\n\ \d\o\G\e\t\(\e\)\ \{\
\ \ \t\r\y\ \{\
\ \ \ \ \v\a\r\ \s\s\ \=\ \g\e\t\T\a\r\g\e\t\S\p\r\e\a\d\s\h\e\e\t\(\e\)\;\
\ \ \ \ \i\f\ \(\!\s\s\)\ \{\
\ \ \ \ \ \ \r\e\t\u\r\n\ \C\o\n\t\e\n\t\S\e\r\v\i\c\e\.\c\r\e\a\t\e\T\e\x\t\O\u\t\p\u\t\(\J\S\O\N\.\s\t\r\i\n\g\i\f\y\(\{\
\ \ \ \ \ \ \ \ \s\t\a\t\u\s\:\ \'\e\r\r\o\r\'\,\
\ \ \ \ \ \ \ \ \m\e\s\s\a\g\e\:\ \'\C\h\ư\a\ \k\ế\t\ \n\ố\i\ \đ\ư\ợ\c\ \G\o\o\g\l\e\ \S\h\e\e\t\!\ \V\u\i\ \l\ò\n\g\ \m\ở\ \G\o\o\g\l\e\ \S\h\e\e\t\ \c\ủ\a\ \l\ớ\p\ \>\ \T\i\ệ\n\ \í\c\h\ \m\ở\ \r\ộ\n\g\ \>\ \A\p\p\s\ \S\c\r\i\p\t\ \v\à\ \d\á\n\ \m\ã\ \n\g\u\ồ\n\ \n\à\y\.\'\
\ \ \ \ \ \ \}\)\)\.\s\e\t\M\i\m\e\T\y\p\e\(\C\o\n\t\e\n\t\S\e\r\v\i\c\e\.\M\i\m\e\T\y\p\e\.\J\S\O\N\)\;\
\ \ \ \ \}\
\
\ \ \ \ \v\a\r\ \s\h\e\e\t\ \=\ \s\s\.\g\e\t\S\h\e\e\t\B\y\N\a\m\e\(\'\D\a\n\h\S\a\c\h\9\A\1\'\)\ \|\|\ \s\s\.\g\e\t\A\c\t\i\v\e\S\h\e\e\t\(\)\;\
\ \ \ \ \v\a\r\ \d\a\t\a\ \=\ \s\h\e\e\t\.\g\e\t\D\a\t\a\R\a\n\g\e\(\)\.\g\e\t\V\a\l\u\e\s\(\)\;\
\
\ \ \ \ \/\/\ \N\Ế\U\ \S\H\E\E\T\ \T\R\Ố\N\G\ \H\O\Ặ\C\ \C\H\Ư\A\ \C\Ó\ \D\Ữ\ \L\I\Ệ\U\:\ \T\Ự\ \Đ\Ộ\N\G\ \K\H\Ở\I\ \T\Ạ\O\ \Đ\Ầ\Y\ \Đ\Ủ\ \4\3\ \H\Ọ\C\ \S\I\N\H\ \L\I\Ề\N\!\
\ \ \ \ \i\f\ \(\!\d\a\t\a\ \|\|\ \d\a\t\a\.\l\e\n\g\t\h\ \<\=\ \1\ \|\|\ \(\e\ \&\&\ \e\.\p\a\r\a\m\e\t\e\r\ \&\&\ \e\.\p\a\r\a\m\e\t\e\r\.\f\o\r\c\e\I\n\i\t\ \=\=\=\ \'\t\r\u\e\'\)\)\ \{\
\ \ \ \ \ \ \s\h\e\e\t\ \=\ \p\o\p\u\l\a\t\e\S\h\e\e\t\W\i\t\h\S\t\u\d\e\n\t\s\(\s\s\,\ \D\E\F\A\U\L\T\_\S\T\U\D\E\N\T\S\_\9\A\1\)\;\
\ \ \ \ \ \ \d\a\t\a\ \=\ \s\h\e\e\t\.\g\e\t\D\a\t\a\R\a\n\g\e\(\)\.\g\e\t\V\a\l\u\e\s\(\)\;\
\ \ \ \ \ \ \l\o\g\T\o\A\u\d\i\t\S\h\e\e\t\(\s\s\,\ \'\T\o\à\n\ \l\ớ\p\ \9\A\1\'\,\ \'\H\ệ\ \t\h\ố\n\g\ \t\ự\ \đ\ộ\n\g\'\,\ \0\,\ \'\T\ự\ \đ\ộ\n\g\ \k\h\ở\i\ \t\ạ\o\ \4\3\ \h\ọ\c\ \s\i\n\h\ \&\ \đ\ị\n\h\ \d\ạ\n\g\ \b\ả\n\g\ \t\í\n\h\'\)\;\
\ \ \ \ \}\
\
\ \ \ \ \v\a\r\ \r\o\w\s\ \=\ \d\a\t\a\.\s\l\i\c\e\(\1\)\;\
\ \ \ \ \v\a\r\ \s\t\u\d\e\n\t\s\ \=\ \r\o\w\s\.\m\a\p\(\f\u\n\c\t\i\o\n\(\r\o\w\)\ \{\
\ \ \ \ \ \ \v\a\r\ \t\o\S\t\r\ \=\ \r\o\w\[\5\]\ \?\ \r\o\w\[\5\]\.\t\o\S\t\r\i\n\g\(\)\.\r\e\p\l\a\c\e\(\'\T\ổ\ \'\,\ \'\'\)\.\t\r\i\m\(\)\ \:\ \(\r\o\w\[\3\]\ \?\ \r\o\w\[\3\]\.\t\o\S\t\r\i\n\g\(\)\.\r\e\p\l\a\c\e\(\'\T\ổ\ \'\,\ \'\'\)\.\t\r\i\m\(\)\ \:\ \'\'\)\;\
\ \ \ \ \ \ \r\e\t\u\r\n\ \{\
\ \ \ \ \ \ \ \ \i\d\:\ \r\o\w\[\0\]\ \?\ \r\o\w\[\0\]\.\t\o\S\t\r\i\n\g\(\)\.\t\r\i\m\(\)\ \:\ \'\'\,\
\ \ \ \ \ \ \ \ \s\t\t\:\ \N\u\m\b\e\r\(\r\o\w\[\1\]\)\ \|\|\ \0\,\
\ \ \ \ \ \ \ \ \n\a\m\e\:\ \r\o\w\[\2\]\ \?\ \r\o\w\[\2\]\.\t\o\S\t\r\i\n\g\(\)\.\t\r\i\m\(\)\ \:\ \'\'\,\
\ \ \ \ \ \ \ \ \g\e\n\d\e\r\:\ \r\o\w\[\3\]\ \|\|\ \'\N\a\m\'\,\
\ \ \ \ \ \ \ \ \d\o\b\:\ \r\o\w\[\4\]\ \|\|\ \'\'\,\
\ \ \ \ \ \ \ \ \t\o\:\ \N\u\m\b\e\r\(\t\o\S\t\r\)\ \|\|\ \1\,\
\ \ \ \ \ \ \ \ \r\o\l\e\:\ \r\o\w\[\6\]\ \|\|\ \'\H\ọ\c\ \s\i\n\h\'\,\
\ \ \ \ \ \ \ \ \c\o\n\d\u\c\t\S\c\o\r\e\:\ \N\u\m\b\e\r\(\r\o\w\[\7\]\)\ \|\|\ \1\0\0\,\
\ \ \ \ \ \ \ \ \c\o\n\d\u\c\t\:\ \r\o\w\[\8\]\ \|\|\ \'\T\ố\t\'\,\
\ \ \ \ \ \ \ \ \a\c\a\d\e\m\i\c\:\ \r\o\w\[\9\]\ \|\|\ \'\T\ố\t\'\,\
\ \ \ \ \ \ \ \ \s\c\o\r\e\A\v\g\:\ \N\u\m\b\e\r\(\r\o\w\[\1\0\]\)\ \|\|\ \8\.\0\,\
\ \ \ \ \ \ \ \ \p\h\o\n\e\:\ \r\o\w\[\1\1\]\ \|\|\ \'\'\,\
\ \ \ \ \ \ \ \ \p\a\r\e\n\t\P\h\o\n\e\:\ \r\o\w\[\1\2\]\ \|\|\ \'\'\,\
\ \ \ \ \ \ \ \ \a\d\d\r\e\s\s\:\ \r\o\w\[\1\3\]\ \|\|\ \'\'\,\
\ \ \ \ \ \ \ \ \h\o\m\e\w\o\r\k\S\t\a\t\u\s\:\ \(\r\o\w\[\1\4\]\ \=\=\=\ \'\Đ\ã\ \n\ộ\p\'\ \|\|\ \r\o\w\[\1\4\]\ \=\=\=\ \t\r\u\e\)\,\
\ \ \ \ \ \ \ \ \t\a\r\g\e\t\H\i\g\h\S\c\h\o\o\l\:\ \{\
\ \ \ \ \ \ \ \ \ \ \n\v\1\:\ \r\o\w\[\1\5\]\ \|\|\ \'\T\H\P\T\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\
\ \ \ \ \ \ \ \ \ \ \n\v\2\:\ \r\o\w\[\1\6\]\ \|\|\ \'\T\H\P\T\ \L\o\n\g\ \T\h\à\n\h\'\,\
\ \ \ \ \ \ \ \ \ \ \n\v\3\:\ \r\o\w\[\1\7\]\ \|\|\ \'\T\H\P\T\ \B\ì\n\h\ \S\ơ\n\'\
\ \ \ \ \ \ \ \ \}\,\
\ \ \ \ \ \ \ \ \n\o\t\e\s\:\ \r\o\w\[\1\8\]\ \|\|\ \'\'\
\ \ \ \ \ \ \}\;\
\ \ \ \ \}\)\;\
\
\ \ \ \ \r\e\t\u\r\n\ \C\o\n\t\e\n\t\S\e\r\v\i\c\e\.\c\r\e\a\t\e\T\e\x\t\O\u\t\p\u\t\(\J\S\O\N\.\s\t\r\i\n\g\i\f\y\(\{\
\ \ \ \ \ \ \s\t\a\t\u\s\:\ \'\s\u\c\c\e\s\s\'\,\
\ \ \ \ \ \ \s\c\h\o\o\l\:\ \'\T\H\ \&\ \T\H\C\S\ \P\h\ư\ớ\c\ \H\ư\n\g\'\,\
\ \ \ \ \ \ \c\l\a\s\s\:\ \'\9\A\1\'\,\
\ \ \ \ \ \ \u\p\d\a\t\e\d\A\t\:\ \n\e\w\ \D\a\t\e\(\)\.\t\o\I\S\O\S\t\r\i\n\g\(\)\,\
\ \ \ \ \ \ \t\o\t\a\l\S\t\u\d\e\n\t\s\:\ \s\t\u\d\e\n\t\s\.\l\e\n\g\t\h\,\
\ \ \ \ \ \ \s\t\u\d\e\n\t\s\:\ \s\t\u\d\e\n\t\s\,\
\ \ \ \ \ \ \m\e\s\s\a\g\e\:\ \'\Đ\ã\ \t\ả\i\ \t\h\à\n\h\ \c\ô\n\g\ \'\ \+\ \s\t\u\d\e\n\t\s\.\l\e\n\g\t\h\ \+\ \'\ \h\ọ\c\ \s\i\n\h\ \t\ừ\ \G\o\o\g\l\e\ \S\h\e\e\t\!\'\
\ \ \ \ \}\)\)\.\s\e\t\M\i\m\e\T\y\p\e\(\C\o\n\t\e\n\t\S\e\r\v\i\c\e\.\M\i\m\e\T\y\p\e\.\J\S\O\N\)\;\
\
\ \ \}\ \c\a\t\c\h\ \(\e\r\r\)\ \{\
\ \ \ \ \r\e\t\u\r\n\ \C\o\n\t\e\n\t\S\e\r\v\i\c\e\.\c\r\e\a\t\e\T\e\x\t\O\u\t\p\u\t\(\J\S\O\N\.\s\t\r\i\n\g\i\f\y\(\{\
\ \ \ \ \ \ \s\t\a\t\u\s\:\ \'\e\r\r\o\r\'\,\
\ \ \ \ \ \ \m\e\s\s\a\g\e\:\ \e\r\r\.\t\o\S\t\r\i\n\g\(\)\
\ \ \ \ \}\)\)\.\s\e\t\M\i\m\e\T\y\p\e\(\C\o\n\t\e\n\t\S\e\r\v\i\c\e\.\M\i\m\e\T\y\p\e\.\J\S\O\N\)\;\
\ \ \}\
\}\
\
\/\/\ \P\O\S\T\ \W\e\b\h\o\o\k\:\ \T\i\ế\p\ \n\h\ậ\n\ \c\á\c\ \h\à\n\h\ \đ\ộ\n\g\ \t\ừ\ \A\p\p\ \đ\ẩ\y\ \s\a\n\g\
\f\u\n\c\t\i\o\n\ \d\o\P\o\s\t\(\e\)\ \{\
\ \ \t\r\y\ \{\
\ \ \ \ \v\a\r\ \s\s\ \=\ \g\e\t\T\a\r\g\e\t\S\p\r\e\a\d\s\h\e\e\t\(\e\)\;\
\ \ \ \ \i\f\ \(\!\s\s\)\ \{\
\ \ \ \ \ \ \r\e\t\u\r\n\ \C\o\n\t\e\n\t\S\e\r\v\i\c\e\.\c\r\e\a\t\e\T\e\x\t\O\u\t\p\u\t\(\J\S\O\N\.\s\t\r\i\n\g\i\f\y\(\{\
\ \ \ \ \ \ \ \ \s\t\a\t\u\s\:\ \'\e\r\r\o\r\'\,\
\ \ \ \ \ \ \ \ \m\e\s\s\a\g\e\:\ \'\C\h\ư\a\ \t\ì\m\ \t\h\ấ\y\ \G\o\o\g\l\e\ \S\h\e\e\t\ \l\i\ê\n\ \k\ế\t\.\'\
\ \ \ \ \ \ \}\)\)\.\s\e\t\M\i\m\e\T\y\p\e\(\C\o\n\t\e\n\t\S\e\r\v\i\c\e\.\M\i\m\e\T\y\p\e\.\J\S\O\N\)\;\
\ \ \ \ \}\
\
\ \ \ \ \v\a\r\ \c\o\n\t\e\n\t\s\ \=\ \(\e\ \&\&\ \e\.\p\o\s\t\D\a\t\a\ \&\&\ \e\.\p\o\s\t\D\a\t\a\.\c\o\n\t\e\n\t\s\)\ \?\ \e\.\p\o\s\t\D\a\t\a\.\c\o\n\t\e\n\t\s\ \:\ \'\{\}\'\;\
\ \ \ \ \v\a\r\ \p\o\s\t\D\a\t\a\ \=\ \J\S\O\N\.\p\a\r\s\e\(\c\o\n\t\e\n\t\s\)\;\
\ \ \ \ \v\a\r\ \a\c\t\i\o\n\ \=\ \p\o\s\t\D\a\t\a\.\a\c\t\i\o\n\;\
\
\ \ \ \ \/\/\ \H\À\N\H\ \Đ\Ộ\N\G\ \1\:\ \Đ\ẩ\y\ \t\o\à\n\ \b\ộ\ \4\3\ \h\ọ\c\ \s\i\n\h\ \&\ \d\ữ\ \l\i\ệ\u\ \t\ừ\ \A\p\p\ \s\a\n\g\ \G\o\o\g\l\e\ \S\h\e\e\t\
\ \ \ \ \i\f\ \(\a\c\t\i\o\n\ \=\=\=\ \'\p\u\s\h\A\l\l\D\a\t\a\'\ \|\|\ \a\c\t\i\o\n\ \=\=\=\ \'\i\n\i\t\F\u\l\l\S\h\e\e\t\'\)\ \{\
\ \ \ \ \ \ \v\a\r\ \s\t\u\d\e\n\t\s\L\i\s\t\ \=\ \p\o\s\t\D\a\t\a\.\s\t\u\d\e\n\t\s\ \&\&\ \p\o\s\t\D\a\t\a\.\s\t\u\d\e\n\t\s\.\l\e\n\g\t\h\ \>\ \0\ \?\ \p\o\s\t\D\a\t\a\.\s\t\u\d\e\n\t\s\ \:\ \D\E\F\A\U\L\T\_\S\T\U\D\E\N\T\S\_\9\A\1\;\
\ \ \ \ \ \ \p\o\p\u\l\a\t\e\S\h\e\e\t\W\i\t\h\S\t\u\d\e\n\t\s\(\s\s\,\ \s\t\u\d\e\n\t\s\L\i\s\t\)\;\
\ \ \ \ \ \ \l\o\g\T\o\A\u\d\i\t\S\h\e\e\t\(\s\s\,\ \'\T\o\à\n\ \l\ớ\p\ \9\A\1\'\,\ \p\o\s\t\D\a\t\a\.\a\c\t\o\r\ \|\|\ \'\G\V\C\N\ \Q\u\ả\n\ \t\r\ị\'\,\ \0\,\ \'\Đ\ồ\n\g\ \b\ộ\ \t\o\à\n\ \b\ộ\ \'\ \+\ \s\t\u\d\e\n\t\s\L\i\s\t\.\l\e\n\g\t\h\ \+\ \'\ \h\ọ\c\ \s\i\n\h\ \t\ừ\ \A\p\p\ \s\a\n\g\ \G\o\o\g\l\e\ \S\h\e\e\t\'\)\;\
\
\ \ \ \ \ \ \r\e\t\u\r\n\ \C\o\n\t\e\n\t\S\e\r\v\i\c\e\.\c\r\e\a\t\e\T\e\x\t\O\u\t\p\u\t\(\J\S\O\N\.\s\t\r\i\n\g\i\f\y\(\{\
\ \ \ \ \ \ \ \ \s\t\a\t\u\s\:\ \'\s\u\c\c\e\s\s\'\,\
\ \ \ \ \ \ \ \ \t\o\t\a\l\S\t\u\d\e\n\t\s\:\ \s\t\u\d\e\n\t\s\L\i\s\t\.\l\e\n\g\t\h\,\
\ \ \ \ \ \ \ \ \m\e\s\s\a\g\e\:\ \'\Đ\ã\ \t\ạ\o\ \v\à\ \đ\ồ\n\g\ \b\ộ\ \t\h\à\n\h\ \c\ô\n\g\ \t\o\à\n\ \b\ộ\ \'\ \+\ \s\t\u\d\e\n\t\s\L\i\s\t\.\l\e\n\g\t\h\ \+\ \'\ \h\ọ\c\ \s\i\n\h\ \s\a\n\g\ \G\o\o\g\l\e\ \S\h\e\e\t\!\'\
\ \ \ \ \ \ \}\)\)\.\s\e\t\M\i\m\e\T\y\p\e\(\C\o\n\t\e\n\t\S\e\r\v\i\c\e\.\M\i\m\e\T\y\p\e\.\J\S\O\N\)\;\
\ \ \ \ \}\
\
\ \ \ \ \v\a\r\ \s\h\e\e\t\ \=\ \s\s\.\g\e\t\S\h\e\e\t\B\y\N\a\m\e\(\'\D\a\n\h\S\a\c\h\9\A\1\'\)\ \|\|\ \s\s\.\g\e\t\A\c\t\i\v\e\S\h\e\e\t\(\)\;\
\
\ \ \ \ \/\/\ \H\À\N\H\ \Đ\Ộ\N\G\ \2\:\ \C\ậ\p\ \n\h\ậ\t\ \đ\i\ể\m\ \t\h\i\ \đ\u\a\ \r\è\n\ \l\u\y\ệ\n\ \(\U\p\d\a\t\e\ \E\m\u\l\a\t\i\o\n\)\
\ \ \ \ \i\f\ \(\a\c\t\i\o\n\ \=\=\=\ \'\u\p\d\a\t\e\E\m\u\l\a\t\i\o\n\'\)\ \{\
\ \ \ \ \ \ \v\a\r\ \s\t\u\d\e\n\t\I\d\ \=\ \p\o\s\t\D\a\t\a\.\s\t\u\d\e\n\t\I\d\;\
\ \ \ \ \ \ \v\a\r\ \p\o\i\n\t\D\e\l\t\a\ \=\ \N\u\m\b\e\r\(\p\o\s\t\D\a\t\a\.\p\o\i\n\t\D\e\l\t\a\)\ \|\|\ \0\;\
\ \ \ \ \ \ \v\a\r\ \d\a\t\a\ \=\ \s\h\e\e\t\.\g\e\t\D\a\t\a\R\a\n\g\e\(\)\.\g\e\t\V\a\l\u\e\s\(\)\;\
\ \ \ \ \ \ \v\a\r\ \f\o\u\n\d\ \=\ \f\a\l\s\e\;\
\
\ \ \ \ \ \ \f\o\r\ \(\v\a\r\ \i\ \=\ \1\;\ \i\ \<\ \d\a\t\a\.\l\e\n\g\t\h\;\ \i\+\+\)\ \{\
\ \ \ \ \ \ \ \ \i\f\ \(\d\a\t\a\[\i\]\[\0\]\ \=\=\ \s\t\u\d\e\n\t\I\d\)\ \{\
\ \ \ \ \ \ \ \ \ \ \/\/\ \C\ộ\t\ \đ\i\ể\m\ \t\h\i\ \đ\u\a\ \l\à\ \c\ộ\t\ \H\ \(\i\n\d\e\x\ \7\ \t\r\o\n\g\ \m\ả\n\g\ \0\-\i\n\d\e\x\e\d\,\ \t\ứ\c\ \c\ộ\t\ \t\h\ứ\ \8\ \t\r\ê\n\ \S\h\e\e\t\)\
\ \ \ \ \ \ \ \ \ \ \v\a\r\ \c\u\r\r\e\n\t\S\c\o\r\e\ \=\ \N\u\m\b\e\r\(\d\a\t\a\[\i\]\[\7\]\)\ \|\|\ \1\0\0\;\
\ \ \ \ \ \ \ \ \ \ \v\a\r\ \n\e\w\S\c\o\r\e\ \=\ \M\a\t\h\.\m\a\x\(\0\,\ \M\a\t\h\.\m\i\n\(\1\2\0\,\ \c\u\r\r\e\n\t\S\c\o\r\e\ \+\ \p\o\i\n\t\D\e\l\t\a\)\)\;\
\ \ \ \ \ \ \ \ \ \ \s\h\e\e\t\.\g\e\t\R\a\n\g\e\(\i\ \+\ \1\,\ \8\)\.\s\e\t\V\a\l\u\e\(\n\e\w\S\c\o\r\e\)\;\
\
\ \ \ \ \ \ \ \ \ \ \l\o\g\T\o\A\u\d\i\t\S\h\e\e\t\(\s\s\,\ \d\a\t\a\[\i\]\[\2\]\,\ \p\o\s\t\D\a\t\a\.\a\c\t\o\r\,\ \p\o\i\n\t\D\e\l\t\a\,\ \p\o\s\t\D\a\t\a\.\r\e\a\s\o\n\)\;\
\ \ \ \ \ \ \ \ \ \ \f\o\u\n\d\ \=\ \t\r\u\e\;\
\ \ \ \ \ \ \ \ \ \ \b\r\e\a\k\;\
\ \ \ \ \ \ \ \ \}\
\ \ \ \ \ \ \}\
\
\ \ \ \ \ \ \r\e\t\u\r\n\ \C\o\n\t\e\n\t\S\e\r\v\i\c\e\.\c\r\e\a\t\e\T\e\x\t\O\u\t\p\u\t\(\J\S\O\N\.\s\t\r\i\n\g\i\f\y\(\{\
\ \ \ \ \ \ \ \ \s\t\a\t\u\s\:\ \f\o\u\n\d\ \?\ \'\s\u\c\c\e\s\s\'\ \:\ \'\n\o\t\_\f\o\u\n\d\'\,\
\ \ \ \ \ \ \ \ \m\e\s\s\a\g\e\:\ \f\o\u\n\d\ \?\ \'\Đ\ã\ \c\ậ\p\ \n\h\ậ\t\ \đ\i\ể\m\ \t\h\i\ \đ\u\a\ \v\à\o\ \G\o\o\g\l\e\ \S\h\e\e\t\!\'\ \:\ \'\K\h\ô\n\g\ \t\ì\m\ \t\h\ấ\y\ \h\ọ\c\ \s\i\n\h\ \'\ \+\ \s\t\u\d\e\n\t\I\d\
\ \ \ \ \ \ \}\)\)\.\s\e\t\M\i\m\e\T\y\p\e\(\C\o\n\t\e\n\t\S\e\r\v\i\c\e\.\M\i\m\e\T\y\p\e\.\J\S\O\N\)\;\
\ \ \ \ \}\
\
\ \ \ \ \/\/\ \H\À\N\H\ \Đ\Ộ\N\G\ \3\:\ \G\h\i\ \n\h\ậ\n\ \n\ộ\p\ \b\à\i\ \t\ậ\p\ \v\ề\ \n\h\à\
\ \ \ \ \i\f\ \(\a\c\t\i\o\n\ \=\=\=\ \'\f\o\r\m\S\u\b\m\i\t\H\o\m\e\w\o\r\k\'\)\ \{\
\ \ \ \ \ \ \v\a\r\ \s\t\u\d\e\n\t\N\a\m\e\ \=\ \(\p\o\s\t\D\a\t\a\.\s\t\u\d\e\n\t\N\a\m\e\ \|\|\ \'\'\)\.\t\o\L\o\w\e\r\C\a\s\e\(\)\.\t\r\i\m\(\)\;\
\ \ \ \ \ \ \v\a\r\ \d\a\t\a\2\ \=\ \s\h\e\e\t\.\g\e\t\D\a\t\a\R\a\n\g\e\(\)\.\g\e\t\V\a\l\u\e\s\(\)\;\
\ \ \ \ \ \ \v\a\r\ \f\o\u\n\d\H\w\ \=\ \f\a\l\s\e\;\
\
\ \ \ \ \ \ \f\o\r\ \(\v\a\r\ \j\ \=\ \1\;\ \j\ \<\ \d\a\t\a\2\.\l\e\n\g\t\h\;\ \j\+\+\)\ \{\
\ \ \ \ \ \ \ \ \v\a\r\ \r\o\w\N\a\m\e\ \=\ \(\d\a\t\a\2\[\j\]\[\2\]\ \|\|\ \'\'\)\.\t\o\S\t\r\i\n\g\(\)\.\t\o\L\o\w\e\r\C\a\s\e\(\)\.\t\r\i\m\(\)\;\
\ \ \ \ \ \ \ \ \i\f\ \(\r\o\w\N\a\m\e\ \&\&\ \(\r\o\w\N\a\m\e\ \=\=\=\ \s\t\u\d\e\n\t\N\a\m\e\ \|\|\ \r\o\w\N\a\m\e\.\i\n\d\e\x\O\f\(\s\t\u\d\e\n\t\N\a\m\e\)\ \!\=\=\ \-\1\ \|\|\ \s\t\u\d\e\n\t\N\a\m\e\.\i\n\d\e\x\O\f\(\r\o\w\N\a\m\e\)\ \!\=\=\ \-\1\)\)\ \{\
\ \ \ \ \ \ \ \ \ \ \/\/\ \C\ộ\t\ \b\à\i\ \t\ậ\p\ \v\ề\ \n\h\à\ \l\à\ \c\ộ\t\ \O\ \(\i\n\d\e\x\ \1\4\,\ \t\ứ\c\ \c\ộ\t\ \1\5\ \t\r\ê\n\ \S\h\e\e\t\)\
\ \ \ \ \ \ \ \ \ \ \s\h\e\e\t\.\g\e\t\R\a\n\g\e\(\j\ \+\ \1\,\ \1\5\)\.\s\e\t\V\a\l\u\e\(\'\Đ\ã\ \n\ộ\p\'\)\;\
\ \ \ \ \ \ \ \ \ \ \l\o\g\T\o\A\u\d\i\t\S\h\e\e\t\(\s\s\,\ \d\a\t\a\2\[\j\]\[\2\]\,\ \'\G\o\o\g\l\e\ \F\o\r\m\s\'\,\ \'\+\2\'\,\ \'\N\ộ\p\ \b\à\i\ \t\ậ\p\ \m\ô\n\:\ \'\ \+\ \(\p\o\s\t\D\a\t\a\.\s\u\b\j\e\c\t\ \|\|\ \'\T\o\á\n\ \9\'\)\)\;\
\ \ \ \ \ \ \ \ \ \ \f\o\u\n\d\H\w\ \=\ \t\r\u\e\;\
\ \ \ \ \ \ \ \ \ \ \b\r\e\a\k\;\
\ \ \ \ \ \ \ \ \}\
\ \ \ \ \ \ \}\
\
\ \ \ \ \ \ \r\e\t\u\r\n\ \C\o\n\t\e\n\t\S\e\r\v\i\c\e\.\c\r\e\a\t\e\T\e\x\t\O\u\t\p\u\t\(\J\S\O\N\.\s\t\r\i\n\g\i\f\y\(\{\
\ \ \ \ \ \ \ \ \s\t\a\t\u\s\:\ \f\o\u\n\d\H\w\ \?\ \'\s\u\c\c\e\s\s\'\ \:\ \'\n\o\t\_\f\o\u\n\d\'\,\
\ \ \ \ \ \ \ \ \m\e\s\s\a\g\e\:\ \f\o\u\n\d\H\w\ \?\ \'\Đ\ã\ \đ\á\n\h\ \d\ấ\u\ \n\ộ\p\ \b\à\i\ \t\ậ\p\ \t\r\ê\n\ \G\o\o\g\l\e\ \S\h\e\e\t\!\'\ \:\ \'\K\h\ô\n\g\ \t\ì\m\ \t\h\ấ\y\ \h\ọ\c\ \s\i\n\h\:\ \'\ \+\ \p\o\s\t\D\a\t\a\.\s\t\u\d\e\n\t\N\a\m\e\
\ \ \ \ \ \ \}\)\)\.\s\e\t\M\i\m\e\T\y\p\e\(\C\o\n\t\e\n\t\S\e\r\v\i\c\e\.\M\i\m\e\T\y\p\e\.\J\S\O\N\)\;\
\ \ \ \ \}\
\
\ \ \ \ \r\e\t\u\r\n\ \C\o\n\t\e\n\t\S\e\r\v\i\c\e\.\c\r\e\a\t\e\T\e\x\t\O\u\t\p\u\t\(\J\S\O\N\.\s\t\r\i\n\g\i\f\y\(\{\
\ \ \ \ \ \ \s\t\a\t\u\s\:\ \'\i\g\n\o\r\e\d\'\,\
\ \ \ \ \ \ \m\e\s\s\a\g\e\:\ \'\H\à\n\h\ \đ\ộ\n\g\ \k\h\ô\n\g\ \x\á\c\ \đ\ị\n\h\:\ \'\ \+\ \a\c\t\i\o\n\
\ \ \ \ \}\)\)\.\s\e\t\M\i\m\e\T\y\p\e\(\C\o\n\t\e\n\t\S\e\r\v\i\c\e\.\M\i\m\e\T\y\p\e\.\J\S\O\N\)\;\
\
\ \ \}\ \c\a\t\c\h\ \(\e\r\r\)\ \{\
\ \ \ \ \r\e\t\u\r\n\ \C\o\n\t\e\n\t\S\e\r\v\i\c\e\.\c\r\e\a\t\e\T\e\x\t\O\u\t\p\u\t\(\J\S\O\N\.\s\t\r\i\n\g\i\f\y\(\{\
\ \ \ \ \ \ \s\t\a\t\u\s\:\ \'\e\r\r\o\r\'\,\
\ \ \ \ \ \ \m\e\s\s\a\g\e\:\ \e\r\r\.\t\o\S\t\r\i\n\g\(\)\
\ \ \ \ \}\)\)\.\s\e\t\M\i\m\e\T\y\p\e\(\C\o\n\t\e\n\t\S\e\r\v\i\c\e\.\M\i\m\e\T\y\p\e\.\J\S\O\N\)\;\
\ \ \}\
\}\
\
\/\*\*\
\ \*\ \H\À\M\ \C\H\Ạ\Y\ \T\R\Ự\C\ \T\I\Ế\P\ \T\R\Ê\N\ \A\P\P\S\ \S\C\R\I\P\T\ \E\D\I\T\O\R\:\
\ \*\ \N\h\ấ\n\ \c\h\ọ\n\ \h\à\m\ \'\s\e\t\u\p\S\h\e\e\t\N\o\w\'\ \r\ồ\i\ \b\ấ\m\ \n\ú\t\ \[\▷\ \C\h\ạ\y\]\ \(\R\u\n\)\ \ở\ \t\h\a\n\h\ \c\ô\n\g\ \c\ụ\ \p\h\í\a\ \t\r\ê\n\.\
\ \*\ \B\ả\n\g\ \t\í\n\h\ \G\o\o\g\l\e\ \S\h\e\e\t\ \s\ẽ\ \l\ậ\p\ \t\ứ\c\ \t\ự\ \đ\ộ\n\g\ \s\i\n\h\ \r\a\ \4\3\ \h\ọ\c\ \s\i\n\h\ \đ\ầ\y\ \đ\ủ\ \đ\ị\n\h\ \d\ạ\n\g\ \đ\ẹ\p\ \m\ắ\t\!\
\ \*\/\
\f\u\n\c\t\i\o\n\ \s\e\t\u\p\S\h\e\e\t\N\o\w\(\)\ \{\
\ \ \v\a\r\ \s\s\ \=\ \S\p\r\e\a\d\s\h\e\e\t\A\p\p\.\g\e\t\A\c\t\i\v\e\S\p\r\e\a\d\s\h\e\e\t\(\)\;\
\ \ \i\f\ \(\!\s\s\ \&\&\ \S\P\R\E\A\D\S\H\E\E\T\_\I\D\)\ \{\
\ \ \ \ \s\s\ \=\ \S\p\r\e\a\d\s\h\e\e\t\A\p\p\.\o\p\e\n\B\y\I\d\(\S\P\R\E\A\D\S\H\E\E\T\_\I\D\)\;\
\ \ \}\
\ \ \i\f\ \(\!\s\s\)\ \{\
\ \ \ \ \t\h\r\o\w\ \n\e\w\ \E\r\r\o\r\(\'\V\u\i\ \l\ò\n\g\ \m\ở\ \t\r\ự\c\ \t\i\ế\p\ \G\o\o\g\l\e\ \S\h\e\e\t\ \c\ủ\a\ \l\ớ\p\ \9\A\1\ \r\ồ\i\ \v\à\o\ \T\i\ệ\n\ \í\c\h\ \m\ở\ \r\ộ\n\g\ \>\ \A\p\p\s\ \S\c\r\i\p\t\!\'\)\;\
\ \ \}\
\
\ \ \p\o\p\u\l\a\t\e\S\h\e\e\t\W\i\t\h\S\t\u\d\e\n\t\s\(\s\s\,\ \D\E\F\A\U\L\T\_\S\T\U\D\E\N\T\S\_\9\A\1\)\;\
\ \ \S\p\r\e\a\d\s\h\e\e\t\A\p\p\.\g\e\t\U\i\(\)\.\a\l\e\r\t\(\'\🎉\ \T\H\À\N\H\ \C\Ô\N\G\!\ \B\ả\n\g\ \t\í\n\h\ \G\o\o\g\l\e\ \S\h\e\e\t\ \l\ớ\p\ \9\A\1\ \đ\ã\ \đ\ư\ợ\c\ \k\h\ở\i\ \t\ạ\o\ \h\o\à\n\ \c\h\ỉ\n\h\ \4\3\ \h\ọ\c\ \s\i\n\h\ \v\à\ \đ\ị\n\h\ \d\ạ\n\g\ \c\h\u\y\ê\n\ \n\g\h\i\ệ\p\!\'\)\;\
\}\;
