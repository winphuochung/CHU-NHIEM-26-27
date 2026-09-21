/**
 * Google Apps Script - Hệ Thống Quản Lý Toàn Diện & Đồng Bộ 2 Chiều Lớp 9A1 Phước Hưng
 * Trường TH & THCS Phước Hưng (Năm học 2026 - 2027)
 * 
 * ĐẶC ĐIỂM NỔI BẬT:
 * 1. Tự động khởi tạo 100% 5 Sheet Google Sheets:
 *    - DanhSach9A1 (43 HS, định dạng text Ngày sinh, SĐT, Nơi ở)
 *    - SoQuyLop (Sổ quỹ thu chi, số tiền định dạng VNĐ)
 *    - NhanXet_BanCanSu (Lời nhận xét Ban cán sự, Lớp trưởng, Tổ trưởng & GVCN)
 *    - ThiDua_35Tuan (Điểm thi đua rèn luyện 35 tuần học)
 *    - AuditLog (Lịch sử thao tác đồng bộ)
 * 2. Người dùng KHÔNG CẦN tạo bất cứ cột, dòng hay định dạng nào trên Google Sheet!
 * 3. Chạy hàm 'setupSheetNow' trong Apps Script Editor để sinh toàn bộ dữ liệu tự động.
 */

var SPREADSHEET_ID = ''; // Để trống nếu dán trực tiếp vào Apps Script từ Google Sheet

// Danh sách mặc định 43 học sinh Lớp 9A1 Phước Hưng (Chuẩn hóa Thông tư 22)
var DEFAULT_STUDENTS_9A1 = [
  // TỔ 4 (11 HS)
  { id: 'HS01', stt: 1, name: 'Đặng Văn Hoàng Long', gender: 'Nam', dob: '15/03/2011', to: 4, role: 'Học sinh', conductScore: 98, conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.5, phone: '0912.345.601', parentPhone: '0903.111.201', address: 'Ấp Phước Hưng, Huyện Long Thành', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Chăm ngoan, tích cực tham gia hoạt động lớp' },
  { id: 'HS02', stt: 2, name: 'La Cẩm Nhung', gender: 'Nữ', dob: '22/04/2011', to: 4, role: 'Học sinh', conductScore: 99, conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.8, phone: '0912.345.602', parentPhone: '0903.111.202', address: 'Ấp 1, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Chăm ngoan, học lực tốt' },
  { id: 'HS03', stt: 3, name: 'Võ Ngọc Bảo Trân', gender: 'Nữ', dob: '05/01/2011', to: 4, role: 'Học sinh', conductScore: 92, conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.9, phone: '0912.345.603', parentPhone: '0903.111.203', address: 'Ấp 2, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX', notes: 'Có ý thức tập thể cao' },
  { id: 'HS04', stt: 4, name: 'Nguyễn Gia Thịnh', gender: 'Nam', dob: '18/07/2011', to: 4, role: 'Tổ trưởng 4', conductScore: 94, conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.4, phone: '0912.345.604', parentPhone: '0903.111.204', address: 'Ấp Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Tổ trưởng tổ 4 gương mẫu, quản lý tổ 4 chu đáo' },
  { id: 'HS05', stt: 5, name: 'Trần Trọng Khang', gender: 'Nam', dob: '09/09/2011', to: 4, role: 'Học sinh', conductScore: 90, conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.6, phone: '0912.345.605', parentPhone: '0903.111.205', address: 'Ấp 3, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX', notes: 'Ngoan ngoãn, hòa đồng' },
  { id: 'HS06', stt: 6, name: 'Phạm Tấn Lộc', gender: 'Nam', dob: '30/11/2011', to: 4, role: 'Học sinh', conductScore: 91, conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.5, phone: '0912.345.606', parentPhone: '0903.111.206', address: 'Ấp Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Ý thức trực nhật tốt' },
  { id: 'HS07', stt: 7, name: 'Trần Khá Thuận', gender: 'Nam', dob: '12/02/2011', to: 4, role: 'Học sinh', conductScore: 88, conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.3, phone: '0912.345.607', parentPhone: '0903.111.207', address: 'Ấp 1, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX', notes: 'Chăm chỉ học tập' },
  { id: 'HS08', stt: 8, name: 'Hồ Thị Thanh Huyền', gender: 'Nữ', dob: '14/06/2011', to: 4, role: 'Học sinh', conductScore: 95, conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.6, phone: '0912.345.608', parentPhone: '0903.111.208', address: 'Ấp 2, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Hăng hái xây dựng bài' },
  { id: 'HS09', stt: 9, name: 'Trương Thị Bích Dân', gender: 'Nữ', dob: '03/08/2011', to: 4, role: 'Học sinh', conductScore: 90, conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.7, phone: '0912.345.609', parentPhone: '0903.111.209', address: 'Ấp 4, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Kỷ luật tốt' },
  { id: 'HS10', stt: 10, name: 'Nguyễn Văn Ngà Em', gender: 'Nam', dob: '25/10/2011', to: 4, role: 'Học sinh', conductScore: 89, conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.4, phone: '0912.345.610', parentPhone: '0903.111.210', address: 'Ấp Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX', notes: 'Nhiệt tình với hoạt động chung' },
  { id: 'HS11', stt: 11, name: 'Lâm Thái Bảo', gender: 'Nam', dob: '19/12/2011', to: 4, role: 'Học sinh', conductScore: 88, conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.2, phone: '0912.345.611', parentPhone: '0903.111.211', address: 'Ấp 1, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX', notes: 'Có tiến bộ trong học kỳ' },

  // TỔ 3 (10 HS)
  { id: 'HS12', stt: 12, name: 'Trương Hữu Nghĩa', gender: 'Nam', dob: '11/05/2011', to: 3, role: 'Học sinh', conductScore: 98, conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.9, phone: '0912.345.612', parentPhone: '0903.111.212', address: 'Ấp 1, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Chuyên Long Khánh', nv2: 'THPT Phước Hưng', nv3: 'THPT Long Thành', notes: 'Học lực giỏi, kỷ luật tốt' },
  { id: 'HS13', stt: 13, name: 'Trương Kim Ngân', gender: 'Nữ', dob: '28/03/2011', to: 3, role: 'Học sinh', conductScore: 96, conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.7, phone: '0912.345.613', parentPhone: '0903.111.213', address: 'Ấp 2, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Chăm ngoan, hòa đồng' },
  { id: 'HS14', stt: 14, name: 'Nguyễn Thị Kim Anh', gender: 'Nữ', dob: '19/08/2011', to: 3, role: 'Học sinh', conductScore: 94, conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.5, phone: '0912.345.614', parentPhone: '0903.111.214', address: 'Ấp Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Chăm chỉ, chữ viết đẹp' },
  { id: 'HS15', stt: 15, name: 'Lê Bích Thi', gender: 'Nữ', dob: '04/12/2011', to: 3, role: 'Học sinh', conductScore: 91, conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.8, phone: '0912.345.615', parentPhone: '0903.111.215', address: 'Ấp 3, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX', notes: 'Ý thức rèn luyện tốt' },
  { id: 'HS16', stt: 16, name: 'Nguyễn Minh Triết', gender: 'Nam', dob: '17/02/2011', to: 3, role: 'Học sinh', conductScore: 93, conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.3, phone: '0912.345.616', parentPhone: '0903.111.216', address: 'Ấp 1, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Học lực vững vàng' },
  { id: 'HS17', stt: 17, name: 'Nguyễn Phú Quý', gender: 'Nam', dob: '08/04/2011', to: 3, role: 'Học sinh', conductScore: 90, conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.6, phone: '0912.345.617', parentPhone: '0903.111.217', address: 'Ấp 4, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX', notes: 'Nhiệt tình giúp đỡ bạn' },
  { id: 'HS18', stt: 18, name: 'Phan Tuấn Khang', gender: 'Nam', dob: '23/09/2011', to: 3, role: 'Học sinh', conductScore: 89, conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.5, phone: '0912.345.618', parentPhone: '0903.111.218', address: 'Ấp Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Chăm ngoan, hòa đồng, có tinh thần tập thể' },
  { id: 'HS19', stt: 19, name: 'Trần Thị Thanh Ngân', gender: 'Nữ', dob: '10/01/2011', to: 3, role: 'Học sinh', conductScore: 94, conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.4, phone: '0912.345.619', parentPhone: '0903.111.219', address: 'Ấp 2, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Tích cực phát biểu' },
  { id: 'HS20', stt: 20, name: 'Huỳnh Quốc Long', gender: 'Nam', dob: '16/07/2011', to: 3, role: 'Tổ trưởng 3', conductScore: 92, conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.3, phone: '0912.345.620', parentPhone: '0903.111.220', address: 'Ấp 3, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX', notes: 'Tổ trưởng tổ 3 tác phong gương mẫu, nhiệt tình, trách nhiệm cao' },
  { id: 'HS21', stt: 21, name: 'Nguyễn Thanh Duy', gender: 'Nam', dob: '02/06/2011', to: 3, role: 'Học sinh', conductScore: 87, conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.2, phone: '0912.345.621', parentPhone: '0903.111.221', address: 'Ấp Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung cấp Nghề', notes: 'Cố gắng trong môn Toán' },

  // TỔ 2 (10 HS)
  { id: 'HS22', stt: 22, name: 'Nguyễn Thị Huyền Trang', gender: 'Nữ', dob: '29/08/2011', to: 2, role: 'Học sinh', conductScore: 99, conduct: 'Tốt', academic: 'Tốt', scoreAvg: 9.3, phone: '0912.345.622', parentPhone: '0903.111.222', address: 'Ấp 1, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Chuyên Long Khánh', nv2: 'THPT Phước Hưng', nv3: 'THPT Long Thành', notes: 'Học lực xuất sắc, tích cực tham gia phong trào lớp' },
  { id: 'HS23', stt: 23, name: 'Nguyễn Thị Kim Yến', gender: 'Nữ', dob: '07/03/2011', to: 2, role: 'Học sinh', conductScore: 95, conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.6, phone: '0912.345.623', parentPhone: '0903.111.223', address: 'Ấp 2, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Chăm ngoan, tích cực' },
  { id: 'HS24', stt: 24, name: 'Phạm Hoàng Huy', gender: 'Nam', dob: '14/11/2011', to: 2, role: 'Học sinh', conductScore: 90, conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.7, phone: '0912.345.624', parentPhone: '0903.111.224', address: 'Ấp Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX', notes: 'Môn KHTN tiếp thu tốt' },
  { id: 'HS25', stt: 25, name: 'Nguyễn Lê Thành Đạt', gender: 'Nam', dob: '21/05/2011', to: 2, role: 'Học sinh', conductScore: 89, conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.6, phone: '0912.345.625', parentPhone: '0903.111.225', address: 'Ấp 3, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Tham gia các phong trào thể thao' },
  { id: 'HS26', stt: 26, name: 'Phan Trần Thảo Quyên', gender: 'Nữ', dob: '05/12/2011', to: 2, role: 'Học sinh', conductScore: 93, conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.4, phone: '0912.345.626', parentPhone: '0903.111.226', address: 'Ấp 4, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Học đều các môn' },
  { id: 'HS27', stt: 27, name: 'Hồ Thị Kim Cương', gender: 'Nữ', dob: '18/09/2011', to: 2, role: 'Tổ trưởng 2', conductScore: 92, conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.8, phone: '0912.345.627', parentPhone: '0903.111.227', address: 'Ấp 1, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'THPT Long Thành', notes: 'Tổ trưởng tổ 2 nhiệt tình, theo dõi nề nếp tổ chu đáo' },
  { id: 'HS28', stt: 28, name: 'Phạm Tấn Lợi', gender: 'Nam', dob: '09/02/2011', to: 2, role: 'Học sinh', conductScore: 89, conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.5, phone: '0912.345.628', parentPhone: '0903.111.228', address: 'Ấp Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Có tinh thần trách nhiệm' },
  { id: 'HS29', stt: 29, name: 'Nguyễn Vũ Duy', gender: 'Nam', dob: '27/06/2011', to: 2, role: 'Học sinh', conductScore: 88, conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.4, phone: '0912.345.629', parentPhone: '0903.111.229', address: 'Ấp 2, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Vệ sinh trực nhật sạch sẽ' },
  { id: 'HS30', stt: 30, name: 'Trình Minh Thiện', gender: 'Nam', dob: '13/10/2011', to: 2, role: 'Lớp trưởng', conductScore: 98, conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.5, phone: '0912.345.630', parentPhone: '0903.111.230', address: 'Ấp 3, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX', notes: 'Lớp trưởng gương mẫu, ý thức kỷ luật nghiêm túc, năng lực chỉ huy tốt' },
  { id: 'HS31', stt: 31, name: 'Đỗ Duy Bảo', gender: 'Nam', dob: '31/01/2011', to: 2, role: 'Lớp phó Trật tự', conductScore: 96, conduct: 'Tốt', academic: 'Khá', scoreAvg: 8.0, phone: '0912.345.631', parentPhone: '0903.111.231', address: 'Ấp Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Lớp phó Trật tự công tâm, đôn đốc kỷ luật lớp rất tốt' },

  // TỔ 1 (12 HS)
  { id: 'HS32', stt: 32, name: 'Đỗ Thị Thùy Linh', gender: 'Nữ', dob: '06/07/2011', to: 1, role: 'Lớp phó Học tập', conductScore: 100, conduct: 'Tốt', academic: 'Tốt', scoreAvg: 9.4, phone: '0912.345.632', parentPhone: '0903.111.232', address: 'Ấp 2, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Chuyên Long Khánh', nv2: 'THPT Phước Hưng', nv3: 'THPT Long Thành', notes: 'Lớp phó Học tập gương mẫu, học lực xuất sắc, phụ trách học tập toàn diện' },
  { id: 'HS33', stt: 33, name: 'Nguyễn Thị Tuyết Như', gender: 'Nữ', dob: '15/09/2011', to: 1, role: 'Học sinh', conductScore: 98, conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.8, phone: '0912.345.633', parentPhone: '0903.111.233', address: 'Ấp Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Chăm ngoan, cẩn thận' },
  { id: 'HS34', stt: 34, name: 'Võ Hạ Lam', gender: 'Nữ', dob: '24/11/2011', to: 1, role: 'Học sinh', conductScore: 96, conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.6, phone: '0912.345.634', parentPhone: '0903.111.234', address: 'Ấp 3, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'THPT Long Thành', notes: 'Chăm ngoan, hòa đồng' },
  { id: 'HS35', stt: 35, name: 'Huỳnh Thị Ngọc Hân', gender: 'Nữ', dob: '03/05/2011', to: 1, role: 'Học sinh', conductScore: 94, conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.5, phone: '0912.345.635', parentPhone: '0903.111.235', address: 'Ấp 1, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Học giỏi môn Tiếng Anh và Ngữ văn' },
  { id: 'HS36', stt: 36, name: 'Lê Thị Thúy Vy', gender: 'Nữ', dob: '19/01/2011', to: 1, role: 'Học sinh', conductScore: 92, conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.9, phone: '0912.345.636', parentPhone: '0903.111.236', address: 'Ấp 4, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Ý thức nề nếp tốt' },
  { id: 'HS37', stt: 37, name: 'Lê Kiều Khả Ái', gender: 'Nữ', dob: '28/08/2011', to: 1, role: 'Học sinh', conductScore: 95, conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.7, phone: '0912.345.637', parentPhone: '0903.111.237', address: 'Ấp Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Chăm ngoan, hăng hái phát biểu' },
  { id: 'HS38', stt: 38, name: 'Trịnh Lan Phương', gender: 'Nữ', dob: '12/12/2011', to: 1, role: 'Thủ quỹ', conductScore: 96, conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.6, phone: '0912.345.638', parentPhone: '0903.111.238', address: 'Ấp 2, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Thủ quỹ cẩn thận, quản lý tài chính lớp minh bạch' },
  { id: 'HS39', stt: 39, name: 'Nguyễn Thị Ngọc Thảo', gender: 'Nữ', dob: '08/03/2011', to: 1, role: 'Tổ trưởng 1', conductScore: 95, conduct: 'Tốt', academic: 'Khá', scoreAvg: 8.2, phone: '0912.345.639', parentPhone: '0903.111.239', address: 'Ấp 3, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Tổ trưởng tổ 1 gương mẫu, đôn đốc thành viên nề nếp rất tốt' },
  { id: 'HS40', stt: 40, name: 'Lê Công Minh', gender: 'Nam', dob: '22/10/2011', to: 1, role: 'Học sinh', conductScore: 96, conduct: 'Tốt', academic: 'Khá', scoreAvg: 8.0, phone: '0912.345.640', parentPhone: '0903.111.240', address: 'Ấp 1, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Ngoan ngoãn, nhiệt tình' },
  { id: 'HS41', stt: 41, name: 'Nguyễn Thanh Nhân', gender: 'Nam', dob: '17/04/2011', to: 1, role: 'Lớp phó Lao động', conductScore: 94, conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.8, phone: '0912.345.641', parentPhone: '0903.111.241', address: 'Ấp Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX', notes: 'Lớp phó Lao động đôn đốc trực nhật nhiệt tình, trách nhiệm cao' },
  { id: 'HS42', stt: 42, name: 'Lê Thành Nguyên', gender: 'Nam', dob: '30/06/2011', to: 1, role: 'Học sinh', conductScore: 90, conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.6, phone: '0912.345.642', parentPhone: '0903.111.242', address: 'Ấp 4, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX', notes: 'Ngoan ngoãn, hòa đồng' },
  { id: 'HS43', stt: 43, name: 'Lê Thị Kiều Duyên', gender: 'Nữ', dob: '11/08/2011', to: 1, role: 'Học sinh', conductScore: 93, conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.4, phone: '0912.345.643', parentPhone: '0903.111.243', address: 'Ấp 2, Xã Phước Hưng', homeworkStatus: 'Đã nộp', nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn', notes: 'Chăm chỉ, tích cực trong giờ học' }
];

// Dữ liệu mặc định Sổ quỹ E-Ledger
var DEFAULT_LEDGER_9A1 = [
  { id: 'LED01', date: '05/09/2026', type: 'Thu', amount: 4200000, category: 'Quỹ lớp đầu năm', note: 'Thu quỹ phụ huynh 42 học sinh x 100.000đ', approver: 'GVCN Phê duyệt', proofImg: '' },
  { id: 'LED02', date: '06/09/2026', type: 'Chi', amount: 850000, category: 'Khánh tiết & Trang trí', note: 'Mua khăn trải bàn, lọ hoa, chổi quét lớp, đồ lau bảng', approver: 'Thủ quỹ chi', proofImg: '' },
  { id: 'LED03', date: '10/09/2026', type: 'Chi', amount: 350000, category: 'Photo tài liệu', note: 'Photo đề khảo sát chất lượng đầu năm môn Toán & Anh', approver: 'Lớp phó HT', proofImg: '' },
  { id: 'LED04', date: '15/09/2026', type: 'Chi', amount: 420000, category: 'Khen thưởng', note: 'Mua phần thưởng cho 4 bạn Gương sáng tuần 1 & 2', approver: 'GVCN Phê duyệt', proofImg: '' }
];

var HEADERS_STUDENTS = [
  'Mã HS', 'STT', 'Họ và Tên', 'Giới tính', 'Ngày sinh', 'Tổ', 'Chức vụ',
  'Điểm Thi Đua', 'Rèn Luyện (TT22)', 'Học Lực (TT22)', 'Điểm TB',
  'SĐT Học Sinh', 'SĐT Phụ Huynh', 'Địa Chỉ', 'Bài Tập Về Nhà',
  'NV1 Lớp 10', 'NV2 Lớp 10', 'NV3 Lớp 10', 'Ghi Chú'
];

function getTargetSpreadsheet(e) {
  var ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (err) {}

  if (!ss && e && e.parameter && e.parameter.sheetId) {
    try {
      ss = SpreadsheetApp.openById(e.parameter.sheetId.trim());
    } catch (err) {}
  }

  if (!ss && typeof SPREADSHEET_ID === 'string' && SPREADSHEET_ID.trim() !== '') {
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    } catch (err) {}
  }

  return ss;
}

// 1. Sheet DanhSach9A1
function populateSheetWithStudents(ss, studentsList) {
  var list = (studentsList && studentsList.length > 0) ? studentsList : DEFAULT_STUDENTS_9A1;
  var sheet = ss.getSheetByName('DanhSach9A1');
  if (!sheet) {
    sheet = ss.insertSheet('DanhSach9A1', 0);
  }

  sheet.clear();
  sheet.getRange(1, 1, 1, HEADERS_STUDENTS.length).setValues([HEADERS_STUDENTS]);

  var headerRange = sheet.getRange(1, 1, 1, HEADERS_STUDENTS.length);
  headerRange.setBackground('#1e40af'); // Navy Blue
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setFontFamily('Arial');
  headerRange.setFontSize(10.5);
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  headerRange.setWrap(true);
  sheet.setRowHeight(1, 36);
  sheet.setFrozenRows(1);

  var rows = list.map(function(s, idx) {
    var stt = s.stt || (idx + 1);
    var id = s.id || ('HS' + (stt < 10 ? '0' + stt : stt));
    var name = s.name || '';
    var gender = s.gender || (s.name && (s.name.includes('Thị') || s.name.includes('Nhung') || s.name.includes('Trân') || s.name.includes('Dân') || s.name.includes('Ngân') || s.name.includes('Thi') || s.name.includes('Trang') || s.name.includes('Yến') || s.name.includes('Quyên') || s.name.includes('Cương') || s.name.includes('Linh') || s.name.includes('Như') || s.name.includes('Lam') || s.name.includes('Hân') || s.name.includes('Vy') || s.name.includes('Ái') || s.name.includes('Phương') || s.name.includes('Thảo') || s.name.includes('Duyên')) ? 'Nữ' : 'Nam');
    var dob = s.dob || '';
    var toVal = s.to ? ('Tổ ' + s.to) : '';
    var role = s.role || 'Học sinh';
    var conductScore = Number(s.conductScore) || 100;
    var conduct = s.conduct || 'Tốt';
    var academic = s.academic || 'Tốt';
    var scoreAvg = Number(s.scoreAvg) || 8.0;
    var phone = s.phone || '';
    var parentPhone = s.parentPhone || '';
    var address = s.address || '';
    var homework = (s.homeworkStatus === true || s.homeworkStatus === 'Đã nộp') ? 'Đã nộp' : 'Chưa nộp';
    var nv1 = (s.targetHighSchool && s.targetHighSchool.nv1) || s.nv1 || 'THPT Phước Hưng';
    var nv2 = (s.targetHighSchool && s.targetHighSchool.nv2) || s.nv2 || 'THPT Long Thành';
    var nv3 = (s.targetHighSchool && s.targetHighSchool.nv3) || s.nv3 || 'THPT Bình Sơn';
    var notes = s.notes || '';

    return [
      id, stt, name, gender, dob, toVal, role,
      conductScore, conduct, academic, scoreAvg,
      phone, parentPhone, address, homework,
      nv1, nv2, nv3, notes
    ];
  });

  if (rows.length > 0) {
    var dataRange = sheet.getRange(2, 1, rows.length, HEADERS_STUDENTS.length);
    sheet.getRange(2, 5, rows.length, 1).setNumberFormat('@'); // DOB text
    sheet.getRange(2, 12, rows.length, 2).setNumberFormat('@'); // Phone text
    sheet.getRange(2, 14, rows.length, 1).setNumberFormat('@'); // Address text

    dataRange.setValues(rows);
    dataRange.setFontFamily('Arial');
    dataRange.setFontSize(10);
    dataRange.setVerticalAlignment('middle');
    dataRange.setBorder(true, true, true, true, true, true, '#cbd5e1', SpreadsheetApp.BorderStyle.SOLID);
    sheet.setRowHeights(2, rows.length, 28);

    var centerCols = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15];
    centerCols.forEach(function(c) {
      sheet.getRange(2, c, rows.length, 1).setHorizontalAlignment('center');
    });

    var leftCols = [3, 14, 16, 17, 18, 19];
    leftCols.forEach(function(c) {
      sheet.getRange(2, c, rows.length, 1).setHorizontalAlignment('left');
    });

    for (var r = 2; r <= rows.length + 1; r++) {
      if (r % 2 === 1) {
        sheet.getRange(r, 1, 1, HEADERS_STUDENTS.length).setBackground('#f8fafc');
      }
    }
  }

  for (var colIdx = 1; colIdx <= HEADERS_STUDENTS.length; colIdx++) {
    sheet.autoResizeColumn(colIdx);
  }

  return sheet;
}

// 2. Sheet SoQuyLop
function populateLedgerSheet(ss, ledgerList) {
  var list = (ledgerList && ledgerList.length > 0) ? ledgerList : DEFAULT_LEDGER_9A1;
  var sheet = ss.getSheetByName('SoQuyLop');
  if (!sheet) {
    sheet = ss.insertSheet('SoQuyLop');
  }

  sheet.clear();
  var headers = ['Mã GD', 'Ngày thực hiện', 'Loại (Thu/Chi)', 'Số tiền (VNĐ)', 'Danh mục', 'Nội dung chi tiết', 'Người phê duyệt', 'Chứng từ'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  var hRange = sheet.getRange(1, 1, 1, headers.length);
  hRange.setBackground('#0f766e'); // Teal Green
  hRange.setFontColor('#ffffff');
  hRange.setFontWeight('bold');
  hRange.setFontFamily('Arial');
  hRange.setFontSize(10.5);
  hRange.setHorizontalAlignment('center');
  hRange.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 34);
  sheet.setFrozenRows(1);

  var rows = list.map(function(item) {
    return [
      item.id || '',
      item.date || '',
      item.type || 'Thu',
      Number(item.amount) || 0,
      item.category || '',
      item.note || '',
      item.approver || 'GVCN Phê duyệt',
      item.proofImg ? 'Có hình chứng từ' : 'Không'
    ];
  });

  if (rows.length > 0) {
    var dataRange = sheet.getRange(2, 1, rows.length, headers.length);
    sheet.getRange(2, 4, rows.length, 1).setNumberFormat('#,##0" đ"'); // VNĐ format

    dataRange.setValues(rows);
    dataRange.setFontFamily('Arial');
    dataRange.setFontSize(10);
    dataRange.setVerticalAlignment('middle');
    dataRange.setBorder(true, true, true, true, true, true, '#cbd5e1', SpreadsheetApp.BorderStyle.SOLID);
    sheet.setRowHeights(2, rows.length, 26);

    sheet.getRange(2, 1, rows.length, 3).setHorizontalAlignment('center');
    sheet.getRange(2, 4, rows.length, 1).setHorizontalAlignment('right');
    sheet.getRange(2, 5, rows.length, 4).setHorizontalAlignment('left');

    for (var r = 2; r <= rows.length + 1; r++) {
      if (r % 2 === 1) {
        sheet.getRange(r, 1, 1, headers.length).setBackground('#f0fdf4');
      }
    }
  }

  for (var c = 1; c <= headers.length; c++) {
    sheet.autoResizeColumn(c);
  }

  return sheet;
}

// 3. Sheet NhanXet_BanCanSu
function populateOfficerReviewsSheet(ss, officerReviews, emulationNotes, currentWeek) {
  var sheet = ss.getSheetByName('NhanXet_BanCanSu');
  if (!sheet) {
    sheet = ss.insertSheet('NhanXet_BanCanSu');
  }

  var headers = ['Tuần', 'Thời gian', 'Mã HS / Chủ đề', 'Họ và tên / Đối tượng', 'Người nhận xét', 'Nội dung nhận xét & Đánh giá', 'Ghi chú'];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var hRange = sheet.getRange(1, 1, 1, headers.length);
    hRange.setBackground('#0d9488');
    hRange.setFontColor('#ffffff');
    hRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 32);
  }

  var nowStr = new Date().toLocaleString('vi-VN');
  var w = currentWeek || 2;

  if (emulationNotes) {
    sheet.appendRow([
      'Tuần ' + w,
      nowStr,
      'TỔNG KẾT TUẦN ' + w,
      'Toàn thể Lớp 9A1',
      emulationNotes.submittedBy || 'Lớp trưởng (Trình Minh Thiện)',
      emulationNotes.officerReview || 'Lớp duy trì nề nếp tốt, các tổ trưởng đôn đốc thành viên chu đáo.',
      'Trạng thái: ' + (emulationNotes.status || 'Chờ duyệt')
    ]);

    if (emulationNotes.nextWeekDirection) {
      sheet.appendRow([
        'Tuần ' + w,
        nowStr,
        'KẾ HOẠCH TUẦN ' + (w + 1),
        'Phương hướng tuần mới',
        'Ban cán sự lớp',
        emulationNotes.nextWeekDirection,
        'Mục tiêu tuần tới'
      ]);
    }

    if (emulationNotes.gvcnFeedback) {
      sheet.appendRow([
        'Tuần ' + w,
        nowStr,
        'CHỈ ĐẠO GVCN',
        'Tập thể Lớp 9A1',
        'GVCN Chủ nhiệm 9A1',
        emulationNotes.gvcnFeedback,
        'Ý kiến phê duyệt'
      ]);
    }
  }

  if (officerReviews && typeof officerReviews === 'object') {
    Object.keys(officerReviews).forEach(function(stId) {
      var stData = officerReviews[stId];
      if (stData && typeof stData === 'object') {
        Object.keys(stData).forEach(function(roleKey) {
          var item = stData[roleKey];
          if (item && item.comment) {
            sheet.appendRow([
              'Tuần ' + w,
              nowStr,
              stId,
              item.studentName || stId,
              item.actor || roleKey,
              item.comment + (item.rating ? (' (Đánh giá: ' + item.rating + ')') : ''),
              'Nhận xét sổ tay cán sự'
            ]);
          }
        });
      }
    });
  }

  for (var c = 1; c <= headers.length; c++) {
    sheet.autoResizeColumn(c);
  }
  return sheet;
}

// 4. Sheet ThiDua_35Tuan
function populateEmulation35WeeksSheet(ss, studentsList, currentWeek) {
  var list = (studentsList && studentsList.length > 0) ? studentsList : DEFAULT_STUDENTS_9A1;
  var sheet = ss.getSheetByName('ThiDua_35Tuan');
  if (!sheet) {
    sheet = ss.insertSheet('ThiDua_35Tuan');
  }

  sheet.clear();
  var headers = ['Mã HS', 'STT', 'Họ và Tên', 'Tổ', 'Chức vụ', 'Điểm Nề Nếp Tuần ' + (currentWeek || 2), 'Xếp Loại Nề Nếp', 'Rèn Luyện TT22', 'Trạng Thái Nộp Bài', 'Ghi Chú Thi Đua'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  var hRange = sheet.getRange(1, 1, 1, headers.length);
  hRange.setBackground('#6d28d9'); // Purple
  hRange.setFontColor('#ffffff');
  hRange.setFontWeight('bold');
  hRange.setFontFamily('Arial');
  hRange.setFontSize(10.5);
  hRange.setHorizontalAlignment('center');
  hRange.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 34);
  sheet.setFrozenRows(1);

  var rows = list.map(function(s, idx) {
    var score = Number(s.conductScore) || 100;
    var rank = score >= 95 ? 'Xuất sắc' : (score >= 85 ? 'Tốt' : (score >= 70 ? 'Khá' : 'Cần cố gắng'));
    return [
      s.id || ('HS' + (idx + 1)),
      s.stt || (idx + 1),
      s.name || '',
      s.to ? ('Tổ ' + s.to) : '',
      s.role || 'Học sinh',
      score,
      rank,
      s.conduct || 'Tốt',
      (s.homeworkStatus === true || s.homeworkStatus === 'Đã nộp') ? 'Đã nộp' : 'Chưa nộp',
      s.notes || 'Duy trì thi đua tốt'
    ];
  });

  if (rows.length > 0) {
    var dataRange = sheet.getRange(2, 1, rows.length, headers.length);
    dataRange.setValues(rows);
    dataRange.setFontFamily('Arial');
    dataRange.setFontSize(10);
    dataRange.setVerticalAlignment('middle');
    dataRange.setBorder(true, true, true, true, true, true, '#cbd5e1', SpreadsheetApp.BorderStyle.SOLID);
    sheet.setRowHeights(2, rows.length, 26);

    sheet.getRange(2, 1, rows.length, 2).setHorizontalAlignment('center');
    sheet.getRange(2, 4, rows.length, 6).setHorizontalAlignment('center');
    sheet.getRange(2, 3, rows.length, 1).setHorizontalAlignment('left');

    for (var r = 2; r <= rows.length + 1; r++) {
      if (r % 2 === 1) {
        sheet.getRange(r, 1, 1, headers.length).setBackground('#faf5ff');
      }
    }
  }

  for (var c = 1; c <= headers.length; c++) {
    sheet.autoResizeColumn(c);
  }
  return sheet;
}

// 5. Sheet AuditLog
function initAuditSheet(ss) {
  var audit = ss.getSheetByName('AuditLog');
  if (!audit) {
    audit = ss.insertSheet('AuditLog');
    audit.appendRow(['Thời gian', 'Người thực hiện', 'Học sinh / Lớp', 'Nội dung thay đổi', 'Ghi chú']);
    var hRange = audit.getRange(1, 1, 1, 5);
    hRange.setBackground('#047857');
    hRange.setFontColor('#ffffff');
    hRange.setFontWeight('bold');
    audit.setFrozenRows(1);
    audit.setRowHeight(1, 30);
  }
  return audit;
}

function logToAuditSheet(ss, studentName, actor, pointDelta, reason) {
  var auditSheet = initAuditSheet(ss);
  var changeText = (typeof pointDelta === 'number' && pointDelta > 0) ? ('+' + pointDelta + ' điểm') : (pointDelta + ' điểm');
  auditSheet.appendRow([new Date().toLocaleString('vi-VN'), actor || 'GVCN', studentName || 'Toàn lớp', changeText, reason || '']);
}

// Webhook GET: Đọc dữ liệu từ Google Sheet về App
function doGet(e) {
  try {
    var ss = getTargetSpreadsheet(e);
    if (!ss) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Chưa kết nối được Google Sheet! Vui lòng mở Google Sheet của lớp > Tiện ích mở rộng > Apps Script và dán mã nguồn này.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = ss.getSheetByName('DanhSach9A1') || ss.getActiveSheet();
    var data = sheet.getDataRange().getValues();

    if (!data || data.length <= 1 || (e && e.parameter && e.parameter.forceInit === 'true')) {
      sheet = populateSheetWithStudents(ss, DEFAULT_STUDENTS_9A1);
      populateLedgerSheet(ss, DEFAULT_LEDGER_9A1);
      populateOfficerReviewsSheet(ss, null, null, 2);
      populateEmulation35WeeksSheet(ss, DEFAULT_STUDENTS_9A1, 2);
      data = sheet.getDataRange().getValues();
      logToAuditSheet(ss, 'Toàn lớp 9A1', 'Hệ thống tự động', 0, 'Tự động khởi tạo 5 Sheet dữ liệu & 43 học sinh');
    }

    var rows = data.slice(1);
    var students = rows.map(function(row) {
      var toStr = row[5] ? row[5].toString().replace('Tổ ', '').trim() : (row[3] ? row[3].toString().replace('Tổ ', '').trim() : '');
      return {
        id: row[0] ? row[0].toString().trim() : '',
        stt: Number(row[1]) || 0,
        name: row[2] ? row[2].toString().trim() : '',
        gender: row[3] || 'Nam',
        dob: row[4] || '',
        to: Number(toStr) || 1,
        role: row[6] || 'Học sinh',
        conductScore: Number(row[7]) || 100,
        conduct: row[8] || 'Tốt',
        academic: row[9] || 'Tốt',
        scoreAvg: Number(row[10]) || 8.0,
        phone: row[11] || '',
        parentPhone: row[12] || '',
        address: row[13] || '',
        homeworkStatus: (row[14] === 'Đã nộp' || row[14] === true),
        targetHighSchool: {
          nv1: row[15] || 'THPT Phước Hưng',
          nv2: row[16] || 'THPT Long Thành',
          nv3: row[17] || 'THPT Bình Sơn'
        },
        notes: row[18] || ''
      };
    });

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      school: 'TH & THCS Phước Hưng',
      class: '9A1',
      updatedAt: new Date().toISOString(),
      totalStudents: students.length,
      students: students,
      message: 'Đã tải thành công ' + students.length + ' học sinh từ Google Sheet!'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Webhook POST: Nhận payload từ App đẩy sang
function doPost(e) {
  try {
    var ss = getTargetSpreadsheet(e);
    if (!ss) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Chưa tìm thấy Google Sheet liên kết.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var contents = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var postData = JSON.parse(contents);
    var action = postData.action;

    if (action === 'pushAllData' || action === 'initFullSheet') {
      var studentsList = postData.students && postData.students.length > 0 ? postData.students : DEFAULT_STUDENTS_9A1;
      populateSheetWithStudents(ss, studentsList);
      populateLedgerSheet(ss, postData.ledger || DEFAULT_LEDGER_9A1);
      populateOfficerReviewsSheet(ss, postData.officerReviews, postData.emulationNotes, postData.currentWeek || 2);
      populateEmulation35WeeksSheet(ss, studentsList, postData.currentWeek || 2);
      logToAuditSheet(ss, 'Toàn lớp 9A1', postData.actor || 'GVCN Quản trị', 0, 'Đồng bộ toàn bộ 5 Sheet dữ liệu từ App sang Google Sheet');

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        totalStudents: studentsList.length,
        message: 'Đã tạo và đồng bộ thành công toàn bộ 5 Sheet dữ liệu sang Google Sheet!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = ss.getSheetByName('DanhSach9A1') || ss.getActiveSheet();

    if (action === 'updateEmulation') {
      var studentId = postData.studentId;
      var pointDelta = Number(postData.pointDelta) || 0;
      var data = sheet.getDataRange().getValues();
      var found = false;

      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == studentId) {
          var currentScore = Number(data[i][7]) || 100;
          var newScore = Math.max(0, Math.min(120, currentScore + pointDelta));
          sheet.getRange(i + 1, 8).setValue(newScore);

          logToAuditSheet(ss, data[i][2], postData.actor, pointDelta, postData.reason);
          found = true;
          break;
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: found ? 'success' : 'not_found',
        message: found ? 'Đã cập nhật điểm thi đua vào Google Sheet!' : 'Không tìm thấy học sinh ' + studentId
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'formSubmitHomework') {
      var studentName = (postData.studentName || '').toLowerCase().trim();
      var data2 = sheet.getDataRange().getValues();
      var foundHw = false;

      for (var j = 1; j < data2.length; j++) {
        var rowName = (data2[j][2] || '').toString().toLowerCase().trim();
        if (rowName && (rowName === studentName || rowName.indexOf(studentName) !== -1 || studentName.indexOf(rowName) !== -1)) {
          sheet.getRange(j + 1, 15).setValue('Đã nộp');
          logToAuditSheet(ss, data2[j][2], 'Google Forms', '+2', 'Nộp bài tập môn: ' + (postData.subject || 'Toán 9'));
          foundHw = true;
          break;
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: foundHw ? 'success' : 'not_found',
        message: foundHw ? 'Đã đánh dấu nộp bài tập trên Google Sheet!' : 'Không tìm thấy học sinh: ' + postData.studentName
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'ignored',
      message: 'Hành động không xác định: ' + action
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * HÀM CHẠY TRỰC TIẾP TRÊN APPS SCRIPT EDITOR:
 * Chọn 'setupSheetNow' rồi bấm [▷ Chạy] để tự động sinh 5 Sheet hoàn chỉnh.
 */
function setupSheetNow() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss && SPREADSHEET_ID) {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  if (!ss) {
    throw new Error('Vui lòng mở trực tiếp Google Sheet của lớp 9A1 rồi vào Tiện ích mở rộng > Apps Script!');
  }

  populateSheetWithStudents(ss, DEFAULT_STUDENTS_9A1);
  populateLedgerSheet(ss, DEFAULT_LEDGER_9A1);
  populateOfficerReviewsSheet(ss, null, null, 2);
  populateEmulation35WeeksSheet(ss, DEFAULT_STUDENTS_9A1, 2);
  initAuditSheet(ss);
  logToAuditSheet(ss, 'Toàn lớp 9A1', 'Hệ thống khởi tạo', 0, 'Tự tạo đầy đủ 5 Sheet dữ liệu cho Lớp 9A1');

  SpreadsheetApp.getUi().alert('🎉 THÀNH CÔNG! Đã tự động tạo và định dạng đủ 5 Sheet (DanhSach9A1, SoQuyLop, NhanXet_BanCanSu, ThiDua_35Tuan, AuditLog)!');
}
