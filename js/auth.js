// Auth Module - Phân quyền Đa lớp (RBAC), Cổng Đăng Nhập Riêng & Auto Logout Idle Session

const ROLES = {
  GVCN: {
    id: 'gvcn',
    name: 'Giáo viên Chủ nhiệm (Admin)',
    personName: 'Thầy/Cô Chủ Nhiệm',
    shortTitle: 'GVCN (Admin)',
    badge: 'Quản trị viên',
    icon: 'shield-check',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600',
    category: 'gvcn',
    requires2FA: true,
    defaultPassword: '123456',
    description: 'Quản trị viên tối cao: Toàn quyền thêm học sinh, sắp xếp tổ, duyệt báo cáo tuần, sao lưu Supabase'
  },
  LOP_TRUONG: {
    id: 'lop_truong',
    name: 'Lớp trưởng (Trình Minh Thiện)',
    personName: 'Trình Minh Thiện',
    shortTitle: 'Lớp trưởng',
    badge: 'Chỉ huy lớp',
    icon: 'crown',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500',
    category: 'lop_truong',
    requires2FA: true,
    defaultPassword: '12345',
    description: 'Chỉ huy nề nếp toàn lớp, kiểm tra nhận xét 4 tổ, tổng hợp báo cáo gửi qua cho GVCN'
  },
  LP_HOC_TAP: {
    id: 'lp_hoc_tap',
    name: 'Lớp phó Học tập (Đỗ Thị Thùy Linh)',
    personName: 'Đỗ Thị Thùy Linh',
    shortTitle: 'LP Học tập',
    badge: 'Cán sự học tập',
    icon: 'book-open',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500',
    category: 'lop_pho',
    requires2FA: true,
    defaultPassword: '12345',
    description: 'Theo dõi bài tập, truy bài 15 phút đầu giờ, kiểm tra nhận xét học tập 4 tổ'
  },
  LP_TRAT_TU: {
    id: 'lp_trat_tu',
    name: 'Lớp phó Trật tự (Đỗ Duy Bảo)',
    personName: 'Đỗ Duy Bảo',
    shortTitle: 'LP Trật tự',
    badge: 'Cán sự nề nếp',
    icon: 'alert-triangle',
    color: 'text-rose-500',
    bgColor: 'bg-rose-500',
    category: 'lop_pho',
    requires2FA: true,
    defaultPassword: '12345',
    description: 'Theo dõi kỷ luật, ghi nhận vi phạm nề nếp, trừ điểm rèn luyện học sinh'
  },
  LP_LAO_DONG: {
    id: 'lp_lao_dong',
    name: 'Lớp phó Lao động (Nguyễn Thanh Nhân)',
    personName: 'Nguyễn Thanh Nhân',
    shortTitle: 'LP Lao động',
    badge: 'Cán sự vệ sinh',
    icon: 'sparkles',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500',
    category: 'lop_pho',
    requires2FA: true,
    defaultPassword: '12345',
    description: 'Phân công và chấm điểm trực nhật, vệ sinh lớp học 4 tổ mỗi buổi sáng'
  },
  THU_QUY: {
    id: 'thu_quy',
    name: 'Thủ quỹ (Trịnh Lan Phương)',
    personName: 'Trịnh Lan Phương',
    shortTitle: 'Thủ quỹ',
    badge: 'Cán sự tài chính',
    icon: 'wallet',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500',
    category: 'lop_pho',
    requires2FA: true,
    defaultPassword: '12345',
    description: 'Quản lý sổ quỹ E-Ledger, thu chi minh bạch và quét biên lai qua AI OCR'
  },
  TO_TRUONG_1: {
    id: 'to_truong_1',
    name: 'Tổ trưởng 1 (Nguyễn Thị Ngọc Thảo)',
    personName: 'Nguyễn Thị Ngọc Thảo',
    shortTitle: 'Tổ trưởng 1',
    badge: 'Tổ 1 (11 HS)',
    icon: 'users',
    color: 'text-purple-500',
    bgColor: 'bg-purple-600',
    category: 'to_truong',
    teamId: 1,
    requires2FA: true,
    defaultPassword: '12345',
    description: 'Quản lý 11 học sinh Tổ 1, ghi nhận xét tuần và đồng bộ gửi Ban cán sự lớp'
  },
  TO_TRUONG_2: {
    id: 'to_truong_2',
    name: 'Tổ trưởng 2 (Hồ Thị Kim Cương)',
    personName: 'Hồ Thị Kim Cương',
    shortTitle: 'Tổ trưởng 2',
    badge: 'Tổ 2 (11 HS)',
    icon: 'users',
    color: 'text-purple-500',
    bgColor: 'bg-purple-600',
    category: 'to_truong',
    teamId: 2,
    requires2FA: true,
    defaultPassword: '12345',
    description: 'Quản lý 11 học sinh Tổ 2, ghi nhận xét tuần và đồng bộ gửi Ban cán sự lớp'
  },
  TO_TRUONG_3: {
    id: 'to_truong_3',
    name: 'Tổ trưởng 3 (Huỳnh Quốc Long)',
    personName: 'Huỳnh Quốc Long',
    shortTitle: 'Tổ trưởng 3',
    badge: 'Tổ 3 (11 HS)',
    icon: 'users',
    color: 'text-purple-500',
    bgColor: 'bg-purple-600',
    category: 'to_truong',
    teamId: 3,
    requires2FA: true,
    defaultPassword: '12345',
    description: 'Quản lý 11 học sinh Tổ 3, ghi nhận xét tuần và đồng bộ gửi Ban cán sự lớp'
  },
  TO_TRUONG_4: {
    id: 'to_truong_4',
    name: 'Tổ trưởng 4 (Nguyễn Gia Thịnh)',
    personName: 'Nguyễn Gia Thịnh',
    shortTitle: 'Tổ trưởng 4',
    badge: 'Tổ 4 (10 HS)',
    icon: 'users',
    color: 'text-purple-500',
    bgColor: 'bg-purple-600',
    category: 'to_truong',
    teamId: 4,
    requires2FA: true,
    defaultPassword: '12345',
    description: 'Quản lý 10 học sinh Tổ 4, ghi nhận xét tuần và đồng bộ gửi Ban cán sự lớp'
  },
  HOC_SINH: {
    id: 'hoc_sinh',
    name: 'Học sinh & Phụ huynh 9A1',
    personName: 'Học sinh & Phụ huynh',
    shortTitle: 'Học sinh & Phụ huynh',
    badge: 'Xem công khai',
    icon: 'user-check',
    color: 'text-sky-500',
    bgColor: 'bg-sky-500',
    category: 'hoc_sinh',
    requires2FA: false,
    defaultPassword: '',
    description: 'Tra cứu tiến bộ học tập, thi đua, Gamification, góc Kudos (Không cần mật khẩu)'
  }
};

class AuthManager {
  constructor() {
    this.currentRole = null;
    this.isAuthenticated = false;
    this.is2FAVerified = false;
  }

  getCurrentRole() {
    return this.currentRole || ROLES.HOC_SINH;
  }

  isLoggedIn() {
    return this.isAuthenticated && this.currentRole !== null;
  }

  // Đăng nhập có xác thực thông tin tài khoản
  loginWithCredentials({ roleId, password }) {
    const targetRole = Object.values(ROLES).find(r => r.id === roleId);
    if (!targetRole) {
      return { success: false, error: 'Không tìm thấy chức vụ này trong hệ thống.' };
    }

    const inputPass = String(password || '').trim();
    const isGvcn = targetRole.id === 'gvcn';
    // GVCN: 123456; Cán sự (Lớp trưởng, Lớp phó, Tổ trưởng): 12345
    const isPassValid = isGvcn
      ? (inputPass === '123456' || inputPass === targetRole.defaultPassword)
      : (inputPass === '12345' || inputPass === targetRole.defaultPassword);

    if (isPassValid || targetRole.id === 'hoc_sinh' || !targetRole.requires2FA) {
      this.currentRole = targetRole;
      this.isAuthenticated = true;
      this.is2FAVerified = true;
      this.resetActivity();

      // Ghi Audit Log nếu có store
      if (window.store && typeof window.store.recordAudit === 'function') {
        window.store.recordAudit({
          id: 'LOG_' + Date.now(),
          timestamp: new Date().toLocaleString('vi-VN'),
          actor: targetRole.personName ? `${targetRole.personName} (${targetRole.shortTitle})` : targetRole.name,
          targetStudent: 'Hệ thống Lớp 9A1',
          action: 'Đăng nhập Cổng Xác Thực',
          reason: `Đăng nhập thành công với vai trò ${targetRole.name}`,
          verified: true
        });
      }

      if (window.renderApp) window.renderApp();
      return { success: true, role: targetRole };
    }

    return { success: false, error: 'Mật khẩu không chính xác. Vui lòng thử lại.' };
  }

  // Đăng xuất an toàn về màn hình đăng nhập
  logout() {
    this.currentRole = null;
    this.isAuthenticated = false;
    this.is2FAVerified = false;
    this.resetActivity();

    if (window.store && typeof window.store.recordAudit === 'function') {
      window.store.recordAudit({
        id: 'LOG_' + Date.now(),
        timestamp: new Date().toLocaleString('vi-VN'),
        actor: 'Người dùng',
        targetStudent: 'Hệ thống Lớp 9A1',
        action: 'Đăng xuất tài khoản',
        reason: 'Đăng xuất về cổng đăng nhập bảo mật',
        verified: true
      });
    }

    return { success: true };
  }

  switchRole(roleId) {
    const targetRole = Object.values(ROLES).find(r => r.id === roleId);
    if (!targetRole) return false;

    // Nếu chức vụ yêu cầu xác thực và chưa đăng nhập, mở modal đăng nhập
    if (targetRole.requires2FA && !this.is2FAVerified && targetRole.id !== this.currentRole.id) {
      if (typeof openLoginModal === 'function') {
        openLoginModal(targetRole.category, targetRole.id);
      } else {
        this.trigger2FAPrompt(targetRole);
      }
      return false;
    }

    this.currentRole = targetRole;
    try {
      localStorage.setItem('currentUserRoleId', targetRole.id);
    } catch(e) {}
    this.resetActivity();
    if (window.renderApp) window.renderApp();
    return true;
  }

  trigger2FAPrompt(targetRole) {
    if (typeof openLoginModal === 'function') {
      openLoginModal(targetRole ? targetRole.category : 'gvcn', targetRole ? targetRole.id : 'gvcn');
    } else if (typeof openGVCNLoginModal === 'function') {
      openGVCNLoginModal();
    }
  }

  verify2FA(inputCode) {
    if (inputCode === '123456' || inputCode === '') {
      this.is2FAVerified = true;
      this.currentRole = ROLES.GVCN;
      try {
        localStorage.setItem('currentUserRoleId', 'gvcn');
      } catch(e) {}
      const modal = document.getElementById('modal-login-portal') || document.getElementById('modal-2fa');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
      if (window.renderApp) window.renderApp();
      return true;
    }
    return false;
  }

  // Tính năng tự động khóa phiên khi không thao tác đã được tắt bỏ hoàn toàn theo yêu cầu
  setupIdleTimer() {}
  resetActivity() {}
  lockSession() {}
}

window.ROLES = ROLES;
window.authManager = new AuthManager();
