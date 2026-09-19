// Auth Module - Phân quyền Đa lớp (RBAC), 2FA & Auto Logout Idle Session

const ROLES = {
  GVCN: {
    id: 'gvcn',
    name: 'Giáo viên Chủ nhiệm',
    shortTitle: 'GVCN',
    icon: 'shield-check',
    color: 'text-blue-600',
    requires2FA: true,
    description: 'Toàn quyền điều hành, AI Dashboard, Phê duyệt báo cáo, Quản trị an toàn'
  },
  LOP_TRUONG: {
    id: 'lop_truong',
    name: 'Lớp trưởng (Trình Minh Thiện)',
    shortTitle: 'Lớp trưởng',
    icon: 'crown',
    color: 'text-amber-500',
    requires2FA: false,
    description: 'Tổng hợp báo cáo tuần 1-chạm, điều phối các tổ và ban cán sự'
  },
  LP_HOC_TAP: {
    id: 'lp_hoc_tap',
    name: 'Lớp phó Học tập (Đỗ Thị Thùy Linh)',
    shortTitle: 'LP Học tập',
    icon: 'book-open',
    color: 'text-emerald-500',
    requires2FA: false,
    description: 'Quản lý nhóm tương trợ, thống kê bài tập nộp, thư viện đề thi thử'
  },
  LP_TRAT_TU: {
    id: 'lp_trat_tu',
    name: 'Lớp phó Trật tự (Đỗ Duy Bảo)',
    shortTitle: 'LP Trật tự',
    icon: 'alert-triangle',
    color: 'text-rose-500',
    requires2FA: false,
    description: 'Ghi nhận vi phạm, chấm điểm trừ, đính kèm ảnh bằng chứng thực tế'
  },
  LP_LAO_DONG: {
    id: 'lp_lao_dong',
    name: 'Lớp phó Lao động (Nguyễn Thanh Nhân)',
    shortTitle: 'LP Lao động',
    icon: 'sparkles',
    color: 'text-cyan-500',
    requires2FA: false,
    description: 'Sơ đồ xoay vòng trực nhật động, nhắc nhở công tác vệ sinh sáng'
  },
  THU_QUY: {
    id: 'thu_quy',
    name: 'Thủ quỹ (Trịnh Lan Phương)',
    shortTitle: 'Thủ quỹ',
    icon: 'wallet',
    color: 'text-indigo-500',
    requires2FA: false,
    description: 'Sổ thu chi kỹ thuật số E-Ledger, quét biên lai OCR minh bạch'
  },
  TO_TRUONG_1: {
    id: 'to_truong_1',
    name: 'Tổ trưởng 1 (Nguyễn Thị Ngọc Thảo)',
    shortTitle: 'Tổ 1',
    icon: 'users',
    color: 'text-purple-500',
    requires2FA: false,
    description: 'Theo dõi 12 thành viên Tổ 1 (từ cửa vào), đề xuất Gương sáng tuần'
  },
  TO_TRUONG_2: {
    id: 'to_truong_2',
    name: 'Tổ trưởng 2 (Hồ Thị Kim Cương)',
    shortTitle: 'Tổ 2',
    icon: 'users',
    color: 'text-purple-500',
    requires2FA: false,
    description: 'Theo dõi 10 thành viên Tổ 2, đề xuất Gương sáng tuần'
  },
  TO_TRUONG_3: {
    id: 'to_truong_3',
    name: 'Tổ trưởng 3 (Phan Tuấn Khang)',
    shortTitle: 'Tổ 3',
    icon: 'users',
    color: 'text-purple-500',
    requires2FA: false,
    description: 'Theo dõi 10 thành viên Tổ 3, đề xuất Gương sáng tuần'
  },
  TO_TRUONG_4: {
    id: 'to_truong_4',
    name: 'Tổ trưởng 4 (Nguyễn Gia Thịnh)',
    shortTitle: 'Tổ 4',
    icon: 'users',
    color: 'text-purple-500',
    requires2FA: false,
    description: 'Theo dõi 11 thành viên Tổ 4 (đối diện bàn giáo viên), đề xuất Gương sáng tuần'
  },
  HOC_SINH: {
    id: 'hoc_sinh',
    name: 'Học sinh & Phụ huynh 9A1',
    shortTitle: 'Học sinh',
    icon: 'user-check',
    color: 'text-sky-500',
    requires2FA: false,
    description: 'Tra cứu tiến bộ học tập, Gamification, góc Kudos'
  }
};

class AuthManager {
  constructor() {
    this.currentRole = ROLES.GVCN; // Mặc định mở ở quyền GVCN hoặc Học sinh
    this.isAuthenticated = true;
    this.is2FAVerified = true;
    this.pending2FACode = null;
    this.idleTimeoutMinutes = 15;
    this.lastActivity = Date.now();
    this.setupIdleTimer();
  }

  getCurrentRole() {
    return this.currentRole;
  }

  switchRole(roleId) {
    const targetRole = Object.values(ROLES).find(r => r.id === roleId);
    if (!targetRole) return false;

    if (targetRole.requires2FA && !this.is2FAVerified) {
      // Yêu cầu mở modal 2FA
      this.trigger2FAPrompt(targetRole);
      return false;
    }

    this.currentRole = targetRole;
    this.resetActivity();
    if (window.renderApp) window.renderApp();
    return true;
  }

  trigger2FAPrompt(targetRole) {
    if (typeof openGVCNLoginModal === 'function') {
      openGVCNLoginModal();
    } else {
      const modal = document.getElementById('modal-2fa');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        const inp = document.getElementById('input-gvcn-password');
        if (inp) {
          inp.value = '';
          setTimeout(() => inp.focus(), 150);
        }
      }
    }
  }

  verify2FA(inputCode) {
    // Mật khẩu quản trị GVCN bảo mật cố định là 123456
    if (inputCode === '123456') {
      this.is2FAVerified = true;
      this.currentRole = ROLES.GVCN;
      const modal = document.getElementById('modal-2fa');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
      if (window.renderApp) window.renderApp();
      return true;
    }
    return false;
  }

  // Quản lý Idle Timeout (15 phút)
  setupIdleTimer() {
    ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(evt => {
      window.addEventListener(evt, () => this.resetActivity(), { passive: true });
    });

    setInterval(() => {
      const elapsedMinutes = (Date.now() - this.lastActivity) / 60000;
      if (elapsedMinutes >= this.idleTimeoutMinutes && this.isAuthenticated) {
        this.lockSession();
      }
    }, 30000);
  }

  resetActivity() {
    this.lastActivity = Date.now();
  }

  lockSession() {
    this.isAuthenticated = false;
    alert('Phiên làm việc đã tự động khóa sau 15 phút không thao tác để bảo vệ thông tin học sinh 9A1.');
    this.currentRole = ROLES.HOC_SINH; // Đưa về quyền đọc của học sinh
    this.isAuthenticated = true;
    this.is2FAVerified = false;
    if (window.renderApp) window.renderApp();
  }
}

window.ROLES = ROLES;
window.authManager = new AuthManager();
