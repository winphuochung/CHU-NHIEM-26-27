// Store Core - Quản lý Trạng thái & Cơ sở Dữ liệu Hệ thống Lớp 9A1 Phước Hưng (2026-2027)

const DEFAULT_STUDENTS = [
  // TỔ 4 (11 HS - Dãy 4 đối diện Bàn Giáo Viên)
  { id: 'HS01', stt: 1, name: 'Đặng Văn Hoàng Long', gender: 'Nam', dob: '15/03/2011', to: 4, role: 'Học sinh', phone: '0912.345.601', parentPhone: '0903.111.201', address: 'Ấp Phước Hưng, Huyện Long Thành', conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.5, conductScore: 98, badges: ['ambassador', 'perseverance'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Chăm ngoan, tích cực tham gia hoạt động lớp' },
  { id: 'HS02', stt: 2, name: 'La Cẩm Nhung', gender: 'Nữ', dob: '22/04/2011', to: 4, role: 'Học sinh', phone: '0912.345.602', parentPhone: '0903.111.202', address: 'Ấp 1, Xã Phước Hưng', conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.8, conductScore: 99, badges: ['perseverance', 'initiative'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Chăm ngoan, học lực tốt' },
  { id: 'HS03', stt: 3, name: 'Võ Ngọc Bảo Trân', gender: 'Nữ', dob: '05/01/2011', to: 4, role: 'Học sinh', phone: '0912.345.603', parentPhone: '0903.111.203', address: 'Ấp 2, Xã Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.9, conductScore: 92, badges: ['cleaner'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX' }, homeworkStatus: true, notes: 'Có ý thức tập thể cao' },
  { id: 'HS04', stt: 4, name: 'Nguyễn Gia Thịnh', gender: 'Nam', dob: '18/07/2011', to: 4, role: 'Tổ trưởng 4', phone: '0912.345.604', parentPhone: '0903.111.204', address: 'Ấp Phước Hưng', conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.4, conductScore: 94, badges: ['ambassador', 'initiative'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Tổ trưởng tổ 4 gương mẫu, quản lý tổ 4 chu đáo' },
  { id: 'HS05', stt: 5, name: 'Trần Trọng Khang', gender: 'Nam', dob: '09/09/2011', to: 4, role: 'Học sinh', phone: '0912.345.605', parentPhone: '0903.111.205', address: 'Ấp 3, Xã Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.6, conductScore: 90, badges: ['perseverance'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX' }, homeworkStatus: true, notes: 'Ngoan ngoãn, hòa đồng' },
  { id: 'HS06', stt: 6, name: 'Phạm Tấn Lộc', gender: 'Nam', dob: '30/11/2011', to: 4, role: 'Học sinh', phone: '0912.345.606', parentPhone: '0903.111.206', address: 'Ấp Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.5, conductScore: 91, badges: ['cleaner'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Ý thức trực nhật tốt' },
  { id: 'HS07', stt: 7, name: 'Trần Khá Thuận', gender: 'Nam', dob: '12/02/2011', to: 4, role: 'Học sinh', phone: '0912.345.607', parentPhone: '0903.111.207', address: 'Ấp 1, Xã Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.3, conductScore: 88, badges: ['cleaner'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX' }, homeworkStatus: true, notes: 'Chăm chỉ học tập' },
  { id: 'HS08', stt: 8, name: 'Hồ Thị Thanh Huyền', gender: 'Nữ', dob: '14/06/2011', to: 4, role: 'Học sinh', phone: '0912.345.608', parentPhone: '0903.111.208', address: 'Ấp 2, Xã Phước Hưng', conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.6, conductScore: 95, badges: ['ambassador'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Hăng hái xây dựng bài' },
  { id: 'HS09', stt: 9, name: 'Trương Thị Bích Dân', gender: 'Nữ', dob: '03/08/2011', to: 4, role: 'Học sinh', phone: '0912.345.609', parentPhone: '0903.111.209', address: 'Ấp 4, Xã Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.7, conductScore: 90, badges: ['perseverance'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Kỷ luật tốt' },
  { id: 'HS10', stt: 10, name: 'Nguyễn Văn Ngà Em', gender: 'Nam', dob: '25/10/2011', to: 4, role: 'Học sinh', phone: '0912.345.610', parentPhone: '0903.111.210', address: 'Ấp Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.4, conductScore: 89, badges: ['cleaner'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX' }, homeworkStatus: true, notes: 'Nhiệt tình với hoạt động chung' },
  { id: 'HS11', stt: 11, name: 'Lâm Thái Bảo', gender: 'Nam', dob: '19/12/2011', to: 4, role: 'Học sinh', phone: '0912.345.611', parentPhone: '0903.111.211', address: 'Ấp 1, Xã Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.2, conductScore: 88, badges: ['cleaner'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX' }, homeworkStatus: true, notes: 'Có tiến bộ trong học kỳ' },

  // TỔ 3 (10 HS - Dãy 3)
  { id: 'HS12', stt: 12, name: 'Trương Hữu Nghĩa', gender: 'Nam', dob: '11/05/2011', to: 3, role: 'Học sinh', phone: '0912.345.612', parentPhone: '0903.111.212', address: 'Ấp 1, Xã Phước Hưng', conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.9, conductScore: 98, badges: ['initiative', 'perseverance'], targetHighSchool: { nv1: 'THPT Chuyên Long Khánh', nv2: 'THPT Phước Hưng', nv3: 'THPT Long Thành' }, homeworkStatus: true, notes: 'Học lực giỏi, kỷ luật tốt' },
  { id: 'HS13', stt: 13, name: 'Trương Kim Ngân', gender: 'Nữ', dob: '28/03/2011', to: 3, role: 'Học sinh', phone: '0912.345.613', parentPhone: '0903.111.213', address: 'Ấp 2, Xã Phước Hưng', conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.7, conductScore: 96, badges: ['perseverance', 'ambassador'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Chăm ngoan, hòa đồng' },
  { id: 'HS14', stt: 14, name: 'Nguyễn Thị Kim Anh', gender: 'Nữ', dob: '19/08/2011', to: 3, role: 'Học sinh', phone: '0912.345.614', parentPhone: '0903.111.214', address: 'Ấp Phước Hưng', conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.5, conductScore: 94, badges: ['ambassador'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Chăm chỉ, chữ viết đẹp' },
  { id: 'HS15', stt: 15, name: 'Lê Bích Thi', gender: 'Nữ', dob: '04/12/2011', to: 3, role: 'Học sinh', phone: '0912.345.615', parentPhone: '0903.111.215', address: 'Ấp 3, Xã Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.8, conductScore: 91, badges: ['perseverance'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX' }, homeworkStatus: true, notes: 'Ý thức rèn luyện tốt' },
  { id: 'HS16', stt: 16, name: 'Nguyễn Minh Triết', gender: 'Nam', dob: '17/02/2011', to: 3, role: 'Học sinh', phone: '0912.345.616', parentPhone: '0903.111.216', address: 'Ấp 1, Xã Phước Hưng', conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.3, conductScore: 93, badges: ['ambassador'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Học lực vững vàng' },
  { id: 'HS17', stt: 17, name: 'Nguyễn Phú Quý', gender: 'Nam', dob: '08/04/2011', to: 3, role: 'Học sinh', phone: '0912.345.617', parentPhone: '0903.111.217', address: 'Ấp 4, Xã Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.6, conductScore: 90, badges: ['cleaner'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX' }, homeworkStatus: true, notes: 'Nhiệt tình giúp đỡ bạn' },
  { id: 'HS18', stt: 18, name: 'Phan Tuấn Khang', gender: 'Nam', dob: '23/09/2011', to: 3, role: 'Học sinh', phone: '0912.345.618', parentPhone: '0903.111.218', address: 'Ấp Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.5, conductScore: 89, badges: ['perseverance'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Chăm ngoan, hòa đồng, có tinh thần tập thể' },
  { id: 'HS19', stt: 19, name: 'Trần Thị Thanh Ngân', gender: 'Nữ', dob: '10/01/2011', to: 3, role: 'Học sinh', phone: '0912.345.619', parentPhone: '0903.111.219', address: 'Ấp 2, Xã Phước Hưng', conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.4, conductScore: 94, badges: ['ambassador'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Tích cực phát biểu' },
  { id: 'HS20', stt: 20, name: 'Huỳnh Quốc Long', gender: 'Nam', dob: '16/07/2011', to: 3, role: 'Tổ trưởng 3', phone: '0912.345.620', parentPhone: '0903.111.220', address: 'Ấp 3, Xã Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.3, conductScore: 92, badges: ['perseverance', 'initiative'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX' }, homeworkStatus: true, notes: 'Tổ trưởng tổ 3 tác phong gương mẫu, nhiệt tình, trách nhiệm cao' },
  { id: 'HS21', stt: 21, name: 'Nguyễn Thanh Duy', gender: 'Nam', dob: '02/06/2011', to: 3, role: 'Học sinh', phone: '0912.345.621', parentPhone: '0903.111.221', address: 'Ấp Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.2, conductScore: 87, badges: ['perseverance'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung cấp Nghề' }, homeworkStatus: true, notes: 'Cố gắng trong môn Toán' },

  // TỔ 2 (10 HS - Dãy 2)
  { id: 'HS22', stt: 22, name: 'Nguyễn Thị Huyền Trang', gender: 'Nữ', dob: '29/08/2011', to: 2, role: 'Học sinh', phone: '0912.345.622', parentPhone: '0903.111.222', address: 'Ấp 1, Xã Phước Hưng', conduct: 'Tốt', academic: 'Tốt', scoreAvg: 9.3, conductScore: 99, badges: ['ambassador', 'initiative', 'star'], targetHighSchool: { nv1: 'THPT Chuyên Long Khánh', nv2: 'THPT Phước Hưng', nv3: 'THPT Long Thành' }, homeworkStatus: true, notes: 'Học lực xuất sắc, tích cực tham gia phong trào lớp' },
  { id: 'HS23', stt: 23, name: 'Nguyễn Thị Kim Yến', gender: 'Nữ', dob: '07/03/2011', to: 2, role: 'Học sinh', phone: '0912.345.623', parentPhone: '0903.111.223', address: 'Ấp 2, Xã Phước Hưng', conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.6, conductScore: 95, badges: ['perseverance'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Chăm ngoan, tích cực' },
  { id: 'HS24', stt: 24, name: 'Phạm Hoàng Huy', gender: 'Nam', dob: '14/11/2011', to: 2, role: 'Học sinh', phone: '0912.345.624', parentPhone: '0903.111.224', address: 'Ấp Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.7, conductScore: 90, badges: ['cleaner'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX' }, homeworkStatus: true, notes: 'Môn KHTN tiếp thu tốt' },
  { id: 'HS25', stt: 25, name: 'Nguyễn Lê Thành Đạt', gender: 'Nam', dob: '21/05/2011', to: 2, role: 'Học sinh', phone: '0912.345.625', parentPhone: '0903.111.225', address: 'Ấp 3, Xã Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.6, conductScore: 89, badges: ['perseverance'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Tham gia các phong trào thể thao' },
  { id: 'HS26', stt: 26, name: 'Phan Trần Thảo Quyên', gender: 'Nữ', dob: '05/12/2011', to: 2, role: 'Học sinh', phone: '0912.345.626', parentPhone: '0903.111.226', address: 'Ấp 4, Xã Phước Hưng', conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.4, conductScore: 93, badges: ['ambassador'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Học đều các môn' },
  { id: 'HS27', stt: 27, name: 'Hồ Thị Kim Cương', gender: 'Nữ', dob: '18/09/2011', to: 2, role: 'Tổ trưởng 2', phone: '0912.345.627', parentPhone: '0903.111.227', address: 'Ấp 1, Xã Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.8, conductScore: 92, badges: ['perseverance', 'initiative'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'THPT Long Thành' }, homeworkStatus: true, notes: 'Tổ trưởng tổ 2 nhiệt tình, theo dõi nề nếp tổ chu đáo' },
  { id: 'HS28', stt: 28, name: 'Phạm Tấn Lợi', gender: 'Nam', dob: '09/02/2011', to: 2, role: 'Học sinh', phone: '0912.345.628', parentPhone: '0903.111.228', address: 'Ấp Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.5, conductScore: 89, badges: ['cleaner'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Có tinh thần trách nhiệm' },
  { id: 'HS29', stt: 29, name: 'Nguyễn Vũ Duy', gender: 'Nam', dob: '27/06/2011', to: 2, role: 'Học sinh', phone: '0912.345.629', parentPhone: '0903.111.229', address: 'Ấp 2, Xã Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.4, conductScore: 88, badges: ['cleaner'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Vệ sinh trực nhật sạch sẽ' },
  { id: 'HS30', stt: 30, name: 'Trình Minh Thiện', gender: 'Nam', dob: '13/10/2011', to: 2, role: 'Lớp trưởng', phone: '0912.345.630', parentPhone: '0903.111.230', address: 'Ấp 3, Xã Phước Hưng', conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.5, conductScore: 98, badges: ['perseverance', 'initiative', 'ambassador'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX' }, homeworkStatus: true, notes: 'Lớp trưởng gương mẫu, ý thức kỷ luật nghiêm túc, năng lực chỉ huy tốt' },
  { id: 'HS31', stt: 31, name: 'Đỗ Duy Bảo', gender: 'Nam', dob: '31/01/2011', to: 2, role: 'Lớp phó Trật tự', phone: '0912.345.631', parentPhone: '0903.111.231', address: 'Ấp Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 8.0, conductScore: 96, badges: ['perseverance', 'initiative'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Lớp phó Trật tự công tâm, đôn đốc kỷ luật lớp rất tốt' },

  // TỔ 1 (12 HS - Dãy 1 từ Cửa Vào)
  { id: 'HS32', stt: 32, name: 'Đỗ Thị Thùy Linh', gender: 'Nữ', dob: '06/07/2011', to: 1, role: 'Lớp phó Học tập', phone: '0912.345.632', parentPhone: '0903.111.232', address: 'Ấp 2, Xã Phước Hưng', conduct: 'Tốt', academic: 'Tốt', scoreAvg: 9.4, conductScore: 100, badges: ['ambassador', 'initiative', 'star'], targetHighSchool: { nv1: 'THPT Chuyên Long Khánh', nv2: 'THPT Phước Hưng', nv3: 'THPT Long Thành' }, homeworkStatus: true, notes: 'Lớp phó Học tập gương mẫu, học lực xuất sắc, phụ trách học tập toàn diện' },
  { id: 'HS33', stt: 33, name: 'Nguyễn Thị Tuyết Như', gender: 'Nữ', dob: '15/09/2011', to: 1, role: 'Học sinh', phone: '0912.345.633', parentPhone: '0903.111.233', address: 'Ấp Phước Hưng', conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.8, conductScore: 98, badges: ['perseverance'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Chăm ngoan, cẩn thận' },
  { id: 'HS34', stt: 34, name: 'Võ Hạ Lam', gender: 'Nữ', dob: '24/11/2011', to: 1, role: 'Học sinh', phone: '0912.345.634', parentPhone: '0903.111.234', address: 'Ấp 3, Xã Phước Hưng', conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.6, conductScore: 96, badges: ['perseverance'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'THPT Long Thành' }, homeworkStatus: true, notes: 'Chăm ngoan, hòa đồng' },
  { id: 'HS35', stt: 35, name: 'Huỳnh Thị Ngọc Hân', gender: 'Nữ', dob: '03/05/2011', to: 1, role: 'Học sinh', phone: '0912.345.635', parentPhone: '0903.111.235', address: 'Ấp 1, Xã Phước Hưng', conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.5, conductScore: 94, badges: ['ambassador'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Học giỏi môn Tiếng Anh và Ngữ văn' },
  { id: 'HS36', stt: 36, name: 'Lê Thị Thúy Vy', gender: 'Nữ', dob: '19/01/2011', to: 1, role: 'Học sinh', phone: '0912.345.636', parentPhone: '0903.111.236', address: 'Ấp 4, Xã Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.9, conductScore: 92, badges: ['perseverance'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Ý thức nề nếp tốt' },
  { id: 'HS37', stt: 37, name: 'Lê Kiều Khả Ái', gender: 'Nữ', dob: '28/08/2011', to: 1, role: 'Học sinh', phone: '0912.345.637', parentPhone: '0903.111.237', address: 'Ấp Phước Hưng', conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.7, conductScore: 95, badges: ['ambassador'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Chăm ngoan, hăng hái phát biểu' },
  { id: 'HS38', stt: 38, name: 'Trịnh Lan Phương', gender: 'Nữ', dob: '12/12/2011', to: 1, role: 'Thủ quỹ', phone: '0912.345.638', parentPhone: '0903.111.238', address: 'Ấp 2, Xã Phước Hưng', conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.6, conductScore: 96, badges: ['ambassador', 'initiative'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Thủ quỹ cẩn thận, quản lý tài chính lớp minh bạch' },
  { id: 'HS39', stt: 39, name: 'Nguyễn Thị Ngọc Thảo', gender: 'Nữ', dob: '08/03/2011', to: 1, role: 'Tổ trưởng 1', phone: '0912.345.639', parentPhone: '0903.111.239', address: 'Ấp 3, Xã Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 8.2, conductScore: 95, badges: ['perseverance', 'initiative'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Tổ trưởng tổ 1 gương mẫu, đôn đốc thành viên nề nếp rất tốt' },
  { id: 'HS40', stt: 40, name: 'Lê Công Minh', gender: 'Nam', dob: '22/10/2011', to: 1, role: 'Học sinh', phone: '0912.345.640', parentPhone: '0903.111.240', address: 'Ấp 1, Xã Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 8.0, conductScore: 96, badges: ['cleaner'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Ngoan ngoãn, nhiệt tình' },
  { id: 'HS41', stt: 41, name: 'Nguyễn Thanh Nhân', gender: 'Nam', dob: '17/04/2011', to: 1, role: 'Lớp phó Lao động', phone: '0912.345.641', parentPhone: '0903.111.241', address: 'Ấp Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.8, conductScore: 94, badges: ['cleaner', 'initiative'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX' }, homeworkStatus: true, notes: 'Lớp phó Lao động đôn đốc trực nhật nhiệt tình, trách nhiệm cao' },
  { id: 'HS42', stt: 42, name: 'Lê Thành Nguyên', gender: 'Nam', dob: '30/06/2011', to: 1, role: 'Học sinh', phone: '0912.345.642', parentPhone: '0903.111.242', address: 'Ấp 4, Xã Phước Hưng', conduct: 'Tốt', academic: 'Khá', scoreAvg: 7.6, conductScore: 90, badges: ['cleaner'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Bình Sơn', nv3: 'Trung tâm GDNN-GDTX' }, homeworkStatus: true, notes: 'Ngoan ngoãn, hòa đồng' },
  { id: 'HS43', stt: 43, name: 'Lê Thị Kiều Duyên', gender: 'Nữ', dob: '11/08/2011', to: 1, role: 'Học sinh', phone: '0912.345.643', parentPhone: '0903.111.243', address: 'Ấp 2, Xã Phước Hưng', conduct: 'Tốt', academic: 'Tốt', scoreAvg: 8.4, conductScore: 93, badges: ['ambassador'], targetHighSchool: { nv1: 'THPT Phước Hưng', nv2: 'THPT Long Thành', nv3: 'THPT Bình Sơn' }, homeworkStatus: true, notes: 'Chăm chỉ, tích cực trong giờ học' }
];

// Danh mục vi phạm & điểm thi đua chuẩn mực
const EMULATION_RULES = {
  rewards: [
    { code: 'R01', name: 'Điểm 10 kiểm tra miệng/15p', score: 5, category: 'Học tập' },
    { code: 'R02', name: 'Phát biểu xây dựng bài tích cực (tuần)', score: 3, category: 'Học tập' },
    { code: 'R03', name: 'Được tuyên dương Gương sáng tuần', score: 10, category: 'Đạo đức' },
    { code: 'R04', name: 'Giúp bạn tiến bộ rõ rệt', score: 5, category: 'Đoàn kết' },
    { code: 'R05', name: 'Trực nhật xuất sắc, lớp sạch đẹp', score: 5, category: 'Lao động' },
    { code: 'R06', name: 'Đạt giải phong trào/cuộc thi cấp trường/huyện', score: 15, category: 'Phong trào' }
  ],
  violations: [
    { code: 'V01', name: 'Đi học muộn (sau 6h45)', score: -2, category: 'Chuyên cần', severity: 'Nhẹ' },
    { code: 'V02', name: 'Nghỉ học không phép', score: -10, category: 'Chuyên cần', severity: 'Nghiêm trọng' },
    { code: 'V03', name: 'Không thuộc bài / thiếu bài tập về nhà', score: -3, category: 'Học tập', severity: 'Vừa' },
    { code: 'V04', name: 'Không đeo khăn quàng / sai đồng phục', score: -2, category: 'Tác phong', severity: 'Nhẹ' },
    { code: 'V05', name: 'Nói chuyện riêng, mất trật tự trong giờ', score: -2, category: 'Kỷ luật', severity: 'Nhẹ' },
    { code: 'V06', name: 'Sử dụng điện thoại không phục vụ học tập', score: -5, category: 'Kỷ luật', severity: 'Vừa' },
    { code: 'V07', name: 'Bỏ trực nhật / trực nhật bẩn', score: -5, category: 'Lao động', severity: 'Vừa' },
    { code: 'V08', name: 'Xúc phạm danh dự bạn bè / gây gổ', score: -20, category: 'Đạo đức', severity: 'Rất nghiêm trọng' }
  ]
};

// Huy hiệu ảo Gamification
const BADGES_CONFIG = {
  ambassador: { id: 'ambassador', name: 'Đại sứ học tập', icon: 'award', color: '#2563eb', desc: 'Điểm tổng kết >= 8.5 và bài tập hoàn thành 100%' },
  perseverance: { id: 'perseverance', name: 'Chiến binh chuyên cần', icon: 'zap', color: '#059669', desc: 'Không đi trễ, không nghỉ học và rèn luyện Tốt' },
  initiative: { id: 'initiative', name: 'Cây sáng kiến', icon: 'lightbulb', color: '#d97706', desc: 'Đóng góp ý tưởng xuất sắc cho phong trào lớp' },
  cleaner: { id: 'cleaner', name: 'Dũng sĩ trực nhật', icon: 'sparkles', color: '#0891b2', desc: 'Trực nhật đúng giờ, lớp học và sân trường sạch bóng' },
  star: { id: 'star', name: 'Ngôi sao tiến bộ', icon: 'trending-up', color: '#7c3aed', desc: 'Điểm số hoặc hạnh kiểm tăng vượt bậc so với tuần trước' }
};

// Cửa hàng đặc quyền lớp học (Class Perks)
const CLASS_PERKS = [
  { id: 'perk_seat', name: 'Ưu tiên chọn chỗ ngồi (1 tuần)', cost: 50, icon: 'map-pin', desc: 'Được quyền ưu tiên chọn vị trí bàn học mình mong muốn' },
  { id: 'perk_duty', name: 'Thẻ miễn 1 buổi trực nhật', cost: 40, icon: 'shield-check', desc: 'Được hoán đổi một ca trực nhật không bị trừ điểm' },
  { id: 'perk_sticker', name: 'Bộ Sticker Vinh danh 9A1', cost: 20, icon: 'smile', desc: 'Bộ quà tặng huy hiệu dán vở tuyên dương từ GVCN' },
  { id: 'perk_lead', name: 'Đội trưởng trò chơi sinh hoạt tuần', cost: 30, icon: 'users', desc: 'Làm MC điều hành phần mini-game tiết sinh hoạt lớp' }
];

// Lịch trực nhật xoay vòng động (Thứ 2 đến Thứ 7)
const ROTATION_DAYS = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

// Dữ liệu Sổ quỹ E-Ledger
const INITIAL_LEDGER = [
  { id: 'LED01', date: '05/09/2026', type: 'Thu', amount: 4200000, category: 'Quỹ lớp đầu năm', note: 'Thu quỹ phụ huynh 42 học sinh x 100.000đ', approver: 'GVCN Phê duyệt', proofImg: '' },
  { id: 'LED02', date: '06/09/2026', type: 'Chi', amount: 850000, category: 'Khánh tiết & Trang trí', note: 'Mua khăn trải bàn, lọ hoa, chổi quét lớp, đồ lau bảng', approver: 'Thủ quỹ chi', proofImg: 'assets/receipt_cleaning.png' },
  { id: 'LED03', date: '10/09/2026', type: 'Chi', amount: 350000, category: 'Photo tài liệu', note: 'Photo đề khảo sát chất lượng đầu năm môn Toán & Anh', approver: 'Lớp phó HT', proofImg: '' },
  { id: 'LED04', date: '15/09/2026', type: 'Chi', amount: 420000, category: 'Khen thưởng', note: 'Mua phần thưởng cho 4 bạn Gương sáng tuần 1 & 2', approver: 'GVCN Phê duyệt', proofImg: '' }
];

// Nhóm học tập tương trợ (Đôi bạn cùng tiến)
const STUDY_PAIRS = [
  { id: 'PAIR01', leaderId: 'HS22', leaderName: 'Nguyễn Thị Huyền Trang', memberId: 'HS05', memberName: 'Trần Trọng Khang', subject: 'Toán 9', goal: 'Nâng cao kết quả môn Toán', progress: 75 },
  { id: 'PAIR02', leaderId: 'HS32', leaderName: 'Đỗ Thị Thùy Linh (Lớp phó HT)', memberId: 'HS09', memberName: 'Trương Thị Bích Dân', subject: 'KHTN (Hóa & Lý)', goal: 'Hoàn thành bài tập về nhà 100%', progress: 60 },
  { id: 'PAIR03', leaderId: 'HS30', leaderName: 'Trình Minh Thiện (Lớp trưởng)', memberId: 'HS31', memberName: 'Đỗ Duy Bảo (Lớp phó Trật tự)', subject: 'Toán & KHTN', goal: 'Đạt điểm thi đua xuất sắc', progress: 85 },
  { id: 'PAIR04', leaderId: 'HS39', leaderName: 'Nguyễn Thị Ngọc Thảo (Tổ trưởng 1)', memberId: 'HS41', memberName: 'Nguyễn Thanh Nhân (Lớp phó Lao động)', subject: 'Tiếng Anh', goal: 'Học 20 từ vựng mỗi tuần & làm bài tập', progress: 80 }
];

// Audit Log khởi tạo
const INITIAL_AUDIT_LOGS = [
  { id: 'LOG01', timestamp: '2026-09-10 07:15', actor: 'Lớp phó Trật tự (Đỗ Duy Bảo)', targetStudent: 'Nguyễn Văn Ngà Em (Tổ 4)', action: 'Trừ 2 điểm', reason: 'Đi muộn 10 phút', verified: true },
  { id: 'LOG02', timestamp: '2026-09-12 10:20', actor: 'Tổ trưởng 1 (Nguyễn Thị Ngọc Thảo)', targetStudent: 'Lê Kiều Khả Ái (Tổ 1)', action: 'Cộng 5 điểm', reason: 'Điểm 10 kiểm tra 15p Ngữ văn', verified: true },
  { id: 'LOG03', timestamp: '2026-09-14 16:30', actor: 'Lớp phó Lao động (Nguyễn Thanh Nhân)', targetStudent: 'Tổ 2', action: 'Cộng 5 điểm', reason: 'Trực nhật đạt điểm xuất sắc', verified: true },
  { id: 'LOG04', timestamp: '2026-09-15 08:00', actor: 'Thủ quỹ (Trịnh Lan Phương)', targetStudent: 'Cả lớp', action: 'Cập nhật Sổ quỹ', reason: 'Chi khen thưởng tuần', verified: true }
];

// 35 Mini-games giáo dục cho 35 tuần học lớp 9
const WEEKLY_MINIGAMES = [];
const TOPICS = [
  { title: 'Khởi động năm học & Thiết lập mục tiêu lớp 10', cat: 'Kỹ năng sống' },
  { title: 'Chinh phục Căn bậc hai & Biến đổi đại số', cat: 'Toán học' },
  { title: 'Phương châm hội thoại & Tiếng Việt chuẩn mực', cat: 'Ngữ văn' },
  { title: 'Grammar Master: Các thì hiện tại & quá khứ hoàn thành', cat: 'Tiếng Anh' },
  { title: 'An toàn không gian mạng & Phòng chống bắt nạt học đường', cat: 'Kỹ năng số' },
  { title: 'Hệ thức lượng trong tam giác vuông siêu tốc', cat: 'Toán học' },
  { title: 'Phân tích nhân vật văn học hiện đại lớp 9', cat: 'Ngữ văn' },
  { title: 'Bảng tuần hoàn các nguyên tố hóa học 9', cat: 'KHTN' },
  { title: 'Passive Voice & Reported Speech ôn thi vào 10', cat: 'Tiếng Anh' },
  { title: 'Kỹ năng quản lý thời gian & Cân bằng ôn thi', cat: 'Kỹ năng sống' },
  { title: 'Hàm số bậc nhất y = ax + b và góc tạo bởi đường thẳng', cat: 'Toán học' },
  { title: 'Bức tranh mùa thu qua thơ ca hiện đại', cat: 'Ngữ văn' },
  { title: 'Quy luật di truyền Men-đen & Đột biến sinh học', cat: 'KHTN' },
  { title: 'Conditional Sentences (Câu điều kiện loại 1, 2)', cat: 'Tiếng Anh' },
  { title: 'Khúc xạ ánh sáng & Thấu kính hội tụ', cat: 'KHTN' },
  { title: 'Hệ hai phương trình bậc nhất hai ẩn', cat: 'Toán học' },
  { title: 'Nghị luận xã hội: Lòng biết ơn & Trách nhiệm', cat: 'Ngữ văn' },
  { title: 'Bí quyết ghi điểm Writing tuyển sinh 10', cat: 'Tiếng Anh' },
  { title: 'Hướng nghiệp: Khám phá sở thích & năng lực bản thân', cat: 'Hướng nghiệp' },
  { title: 'Đánh giá giữa kỳ: Tổng ôn tập học kỳ 1', cat: 'Tổng hợp' },
  { title: 'Phương trình bậc hai & Định lý Vi-ét thần tốc', cat: 'Toán học' },
  { title: 'Văn học trung đại Việt Nam ôn thi vào 10', cat: 'Ngữ văn' },
  { title: 'Kim loại, Phi kim và chuỗi phản ứng vô cơ', cat: 'KHTN' },
  { title: 'Relative Clauses (Mệnh đề quan hệ xác định & không xác định)', cat: 'Tiếng Anh' },
  { title: 'Góc với đường tròn & Tứ giác nội tiếp', cat: 'Toán học' },
  { title: 'Kỹ năng ứng phó áp lực thi cử & Chăm sóc sức khỏe', cat: 'Kỹ năng sống' },
  { title: 'Hình trụ, Hình nón, Hình cầu trong thực tế', cat: 'Toán học' },
  { title: 'Phân tích Truyện ngắn Lặng lẽ Sa Pa & Chiếc lược ngà', cat: 'Ngữ văn' },
  { title: 'Hợp chất hữu cơ: Metan, Etilen & Rượu etylic', cat: 'KHTN' },
  { title: 'Modal Verbs & Phrasal Verbs thường gặp', cat: 'Tiếng Anh' },
  { title: 'Chiến thuật phân bổ thời gian bài thi môn Toán', cat: 'Luyện thi' },
  { title: 'Rèn luyện tốc độ đọc hiểu văn bản Tiếng Anh', cat: 'Luyện thi' },
  { title: 'Kỹ năng viết mở bài, kết bài Ngữ văn ấn tượng', cat: 'Luyện thi' },
  { title: 'Mô phỏng Đề thi Tuyển sinh 10 Chuẩn Sở GD&ĐT', cat: 'Luyện thi' },
  { title: 'Về đích: Tâm thế vững vàng bước vào phòng thi 10', cat: 'Hướng nghiệp' }
];

for (let w = 1; w <= 35; w++) {
  const top = TOPICS[w - 1] || { title: `Ôn tập tổng hợp tuần ${w}`, cat: 'Luyện thi' };
  WEEKLY_MINIGAMES.push({
    week: w,
    title: `Tuần ${w}: ${top.title}`,
    category: top.cat,
    rewardPoints: 20,
    questions: [
      {
        q: `[Câu hỏi tuần ${w} - ${top.cat}] Nội dung trọng tâm cần ghi nhớ là gì?`,
        options: [
          'Chủ động lập kế hoạch, tự giác ôn luyện hàng ngày',
          'Chờ đến cận ngày kiểm tra mới ôn tập cấp tốc',
          'Chỉ tập trung 1 môn và bỏ qua các môn khác',
          'Không cần ghi chép bài học'
        ],
        correct: 0,
        explanation: 'Phương pháp học tập khoa học, phân bổ thời gian đều đặn giúp học sinh lớp 9 ghi nhớ bền vững và đạt điểm cao trong kỳ thi vào lớp 10.'
      },
      {
        q: `Ý nghĩa quan trọng nhất của việc giữ gìn kỷ luật lớp 9A1 là gì?`,
        options: [
          'Đối phó với sự kiểm tra của thầy cô',
          'Xây dựng tập thể đoàn kết, tạo môi trường học tập tích cực để 100% cùng đỗ nguyện vọng 1',
          'Để được nhận nhiều sticker vinh danh',
          'Không có ý nghĩa gì'
        ],
        correct: 1,
        explanation: 'Kỷ luật và tinh thần tương trợ lẫn nhau là chìa khóa để tập thể lớp 9A1 cùng nhau vượt qua kỳ thi vào lớp 10 thành công rực rỡ.'
      },
      {
        q: `Khi gặp bài tập khó hoặc áp lực học tập trong năm cuối cấp, học sinh 9A1 nên làm gì?`,
        options: [
          'Bỏ cuộc và giấu kín',
          'Sử dụng Góc sẻ chia Kudos hoặc nhờ nhóm học tập tương trợ / thầy cô giúp đỡ',
          'Đổ lỗi cho hoàn cảnh',
          'Sao chép bài của bạn'
        ],
        correct: 1,
        explanation: 'Sự chia sẻ kịp thời cùng sự trợ giúp từ thầy cô và bạn bè trong nhóm tương trợ giúp giải quyết triệt để khó khăn học tập.'
      }
    ]
  });
}

// Bảng tin Kudos (Lời cảm ơn / Động viên ẩn danh)
const INITIAL_KUDOS = [
  { id: 'KD01', from: 'Một bạn giấu tên (Tổ 3)', to: 'Đỗ Thị Thùy Linh (Lớp phó HT)', message: 'Cảm ơn Thùy Linh đã kiên nhẫn giảng lại cho mình bài hình học hôm qua, nhờ bạn mà mình đã hiểu bài hơn rất nhiều!', date: '16/09/2026', likes: 14 },
  { id: 'KD02', from: 'Thành viên Tổ 2', to: 'Trình Minh Thiện (Lớp trưởng)', message: 'Thiện luôn gương mẫu và hòa đồng với mọi người. Cảm ơn lớp trưởng đã nhắc nhở và đôn đốc cả lớp chu đáo sáng nay!', date: '15/09/2026', likes: 19 },
  { id: 'KD03', from: 'Một bạn bí mật', to: 'Nguyễn Thanh Nhân (Lớp phó Lao động)', message: 'Nhân phân công trực nhật rất công bằng và nhiệt tình hỗ trợ các bạn bê bàn ghế!', date: '14/09/2026', likes: 11 },
  { id: 'KD04', from: 'Bạn cùng bàn', to: 'Nguyễn Gia Thịnh (Tổ trưởng 4)', message: 'Tổ trưởng Thịnh quản lý tổ 4 rất nhiệt tình và chu đáo, luôn động viên các bạn hoàn thành bài!', date: '15/09/2026', likes: 16 }
];

// Thư viện Đề thi thử vào 10 (Toán, Văn, Anh)
const EXAM_BANK = [
  {
    id: 'EXAM_MATH_01',
    subject: 'Toán học',
    title: 'Đề thi thử Tuyển sinh 10 môn Toán - Đề số 01 (Cấu trúc Sở GD&ĐT)',
    durationMinutes: 90,
    questions: [
      { id: 1, text: 'Rút gọn biểu thức A = √(12) + √(27) - √(75). Kết quả là:', options: ['0', '2√3', '√3', '-√3'], correct: 0, exp: '√(12)=2√3, √(27)=3√3, √(75)=5√3 => 2√3+3√3-5√3 = 0.' },
      { id: 2, text: 'Phương trình x² - 5x + 6 = 0 có hai nghiệm phân biệt x₁, x₂. Tổng x₁ + x₂ và tích x₁x₂ là:', options: ['Tổng = 5, Tích = 6', 'Tổng = -5, Tích = 6', 'Tổng = 6, Tích = 5', 'Tổng = -6, Tích = -5'], correct: 0, exp: 'Theo định lý Vi-ét: S = -b/a = 5, P = c/a = 6.' },
      { id: 3, text: 'Cho tam giác ABC vuông tại A, đường cao AH. Biết BH = 4cm, CH = 9cm. Độ dài AH là:', options: ['6 cm', '5 cm', '13 cm', '36 cm'], correct: 0, exp: 'Theo hệ thức lượng: AH² = BH . CH = 4 . 9 = 36 => AH = 6 cm.' },
      { id: 4, text: 'Một mảnh đất hình chữ nhật có chu vi 40m, diện tích 96m². Chiều dài và chiều rộng mảnh đất là:', options: ['12m và 8m', '14m và 6m', '16m và 4m', '10m và 10m'], correct: 0, exp: 'Nửa chu vi x + y = 20, tích xy = 96. Giải phương trình t² - 20t + 96 = 0 ta được t = 12 hoặc t = 8.' }
    ]
  },
  {
    id: 'EXAM_ENG_01',
    subject: 'Tiếng Anh',
    title: 'Đề thi thử Tuyển sinh 10 môn Tiếng Anh - Đề số 01 (60 phút)',
    durationMinutes: 60,
    questions: [
      { id: 1, text: 'Choose the word whose underlined part is pronounced differently: "watched", "stopped", "looked", "wanted"', options: ['watched', 'stopped', 'looked', 'wanted'], correct: 3, exp: '"wanted" phát âm đuôi -ed là /ɪd/, các từ còn lại phát âm là /t/.' },
      { id: 2, text: 'If I _______ hard, I will pass the entrance exam to grade 10.', options: ['study', 'studied', 'will study', 'studying'], correct: 0, exp: 'Câu điều kiện loại 1: Mệnh đề If dùng thì Hiện tại đơn (study).' },
      { id: 3, text: 'She asked me _______ I liked learning English in Phuoc Hung secondary school.', options: ['if', 'that', 'what', 'did'], correct: 0, exp: 'Câu gián tiếp câu hỏi Yes/No dùng If hoặc Whether.' },
      { id: 4, text: 'The teacher _______ teaches us Literature is very dedicated and kind.', options: ['who', 'whom', 'which', 'whose'], correct: 0, exp: 'Đại từ quan hệ chỉ người làm chủ ngữ là "who".' }
    ]
  },
  {
    id: 'EXAM_LIT_01',
    subject: 'Ngữ văn',
    title: 'Đề khảo sát kiến thức Ngữ văn 9 trọng tâm vào 10',
    durationMinutes: 90,
    questions: [
      { id: 1, text: 'Truyện ngắn "Lặng lẽ Sa Pa" là sáng tác của nhà văn nào sau đây?', options: ['Nguyễn Thành Long', 'Kim Lân', 'Nguyễn Quang Sáng', 'Lê Minh Khuê'], correct: 0, exp: '"Lặng lẽ Sa Pa" là tác phẩm tiêu biểu của nhà văn Nguyễn Thành Long sáng tác năm 1970.' },
      { id: 2, text: 'Nhân vật anh thanh niên trong "Lặng lẽ Sa Pa" làm công tác gì trên đỉnh Yên Sơn cao 2600m?', options: ['Khí tượng kiêm vật lý địa cầu', 'Kiểm lâm', 'Bộ đội biên phòng', 'Kỹ sư cầu đường'], correct: 0, exp: 'Anh thanh niên làm công tác khí tượng kiêm vật lý địa cầu.' },
      { id: 3, text: 'Khổ thơ đầu bài thơ "Mùa xuân nho nhỏ" của Thanh Hải gợi tả hình ảnh bông hoa gì mọc giữa dòng sông xanh?', options: ['Bông hoa tím biếc', 'Bông hoa gạo đỏ', 'Bông hoa sen trắng', 'Bông hoa mai vàng'], correct: 0, exp: '"Mọc giữa dòng sông xanh / Một bông hoa tím biếc / Ơi con chim chiền chiện / Hót chi mà vang trời".' }
    ]
  }
];

// Dữ liệu 35 Tuần Thi đua và Tiêu chí Đánh giá (Tuần 1 -> Tuần 35)
const WEEKS_THEMES = [
  { week: 1, theme: 'Ổn định nền nếp - Khởi động năm học 2026-2027', criteria: ['Đúng giờ 100% các buổi học', 'Đồng phục, khăn quàng trang nghiêm', 'Hoàn thành bầu Ban cán sự & chia 4 tổ'] },
  { week: 2, theme: 'Rèn luyện tác phong & Xây dựng mục tiêu Lớp 10', criteria: ['Thi đua hoa điểm 10 môn Toán, Văn, Anh', 'Không nói chuyện riêng trong giờ học', '100% hoàn thành bài tập về nhà'] },
  { week: 3, theme: 'Chuyên cần & Nâng cao ý thức tự quản', criteria: ['Tự giác truy bài 15 phút đầu giờ', 'Vệ sinh phòng học và hành lang sạch sẽ', 'Phát biểu xây dựng bài sôi nổi'] },
  { week: 4, theme: 'Đôi bạn cùng tiến - Tương trợ học tập', criteria: ['Kèm cặp bạn học yếu tiến bộ', 'Tích cực làm việc nhóm hiệu quả', 'Không mang điện thoại vào lớp'] },
  { week: 5, theme: 'Bảo vệ môi trường học đường xanh - sạch - đẹp', criteria: ['Trực nhật đúng giờ, đổ rác đúng nơi quy định', 'Chăm sóc bồn hoa cây cảnh của lớp', 'Không ăn quà vặt xả rác bừa bãi'] },
  { week: 6, theme: 'An toàn giao thông & Văn hóa ứng xử học đường', criteria: ['Đội mũ bảo hiểm khi ngồi xe máy/xe đạp điện', 'Lễ phép chào hỏi thầy cô và khách đến trường', 'Nói lời hay, làm việc tốt'] },
  { week: 7, theme: 'Kỷ cương nền nếp - Nói không với bạo lực học đường', criteria: ['Đoàn kết nội bộ, hòa nhã với bạn bè', 'Giải quyết mâu thuẫn bằng đối thoại văn minh', 'Chấp hành nghiêm quy định cổng trường an toàn'] },
  { week: 8, theme: 'Văn hóa đọc & Tự học sáng tạo', criteria: ['Mỗi học sinh đọc 1 cuốn sách hay/tuần', 'Ghi chép sổ tay kiến thức môn học', 'Không vi phạm quy chế kiểm tra miệng'] },
  { week: 9, theme: 'Chinh phục Căn bậc hai & Tiếng Việt chuẩn mực', criteria: ['Đạt kết quả tốt kiểm tra định kỳ Toán & Văn', 'Không quay cóp tài liệu', 'Ý thức kỷ luật giờ kiểm tra'] },
  { week: 10, theme: 'Ôn tập giữa học kỳ 1 - Bứt phá điểm số', criteria: ['Hoàn thành đề cương ôn tập giữa kỳ 100%', 'Nhóm học tập tương trợ sinh hoạt đều đặn', 'Đi học chuyên cần tuyệt đối'] },
  { week: 11, theme: 'Tri ân Thầy Cô - Chào mừng ngày Nhà giáo VN 20/11', criteria: ['Tuần học tốt - Hoa điểm 10 dâng tặng Thầy Cô', 'Trang trí bảng tin lớp học và tập san tri ân', 'Tham gia tích cực phong trào văn nghệ nhà trường'] },
  { week: 12, theme: 'Ứng xử văn minh trên không gian mạng', criteria: ['Không sử dụng mạng xã hội nói xấu bạn bè', 'Lan tỏa thông tin tích cực, văn minh', 'Sử dụng Internet hỗ trợ tra cứu bài học'] },
  { week: 13, theme: 'Bảo vệ của công & Tiết kiệm điện nước', criteria: ['Tắt điện, quạt trước khi ra khỏi phòng học', 'Không vẽ bậy lên bàn ghế, tường lớp', 'Bảo quản tốt trang thiết bị phòng học số 3'] },
  { week: 14, theme: 'Tự hào truyền thống Quân đội Nhân dân Việt Nam 22/12', criteria: ['Tìm hiểu lịch sử địa phương Phước Hưng & Long Thành', 'Kỷ luật tự giác như người chiến sĩ', 'Tập thể dục giữa giờ nghiêm túc, đều đẹp'] },
  { week: 15, theme: 'Tăng tốc ôn tập học kỳ 1 toàn diện', criteria: ['Hệ thống hóa kiến thức các môn học kỳ 1', 'Giải quyết dứt điểm bài tập còn nợ', 'Giữ gìn sức khỏe chuẩn bị thi học kỳ'] },
  { week: 16, theme: 'Kiểm tra học kỳ 1: Trung thực - Tự tin - Đạt điểm cao', criteria: ['Chấp hành tuyệt đối quy chế phòng thi', 'Không vi phạm gian lận thi cử', 'Đến điểm thi đúng giờ, trang phục chỉnh tề'] },
  { week: 17, theme: 'Sơ kết Học kỳ 1 - Tuyên dương khen thưởng', criteria: ['Đánh giá xếp loại thi đua TT 22 công bằng', 'Khen thưởng cá nhân và tổ xuất sắc học kỳ 1', 'Rút kinh nghiệm các tồn tại nền nếp'] },
  { week: 18, theme: 'Chào đón năm mới - Quyết tâm học kỳ 2', criteria: ['Thiết lập mục tiêu điểm số học kỳ 2', 'Củng cố nền nếp sau kỳ nghỉ Tết Dương lịch', 'Kiểm tra sách vở, dụng cụ học tập đầu kỳ mới'] },
  { week: 19, theme: 'Khởi động Học kỳ 2 - Nước rút lớp 9', criteria: ['Tăng tốc học kiến thức mới chương trình 9', 'Đăng ký chỉ tiêu thi đua cá nhân', 'Duy trì giờ truy bài 15 phút nghiêm túc'] },
  { week: 20, theme: 'Giữ vững kỷ cương nền nếp trước Tết Nguyên Đán', criteria: ['Tuyệt đối không đốt pháo, tàng trữ chất nổ', 'An toàn giao thông trước kỳ nghỉ Tết', 'Hoàn thành nhiệm vụ trực nhật cuối năm'] },
  { week: 21, theme: 'Vui xuân an toàn - Bắt nhịp học tập sau Tết', criteria: ['Đi học đầy đủ ngay ngày đầu tiên sau Tết', 'Khởi động phong trào Lì xì hoa điểm 10', 'Ổn định sĩ số, không để học sinh bỏ học'] },
  { week: 22, theme: 'Chinh phục Phương trình bậc hai & Định lý Vi-ét', criteria: ['Rèn kỹ năng giải phương trình và hệ phương trình', 'Thực hành bài tập toán thực tế thi vào 10', 'Hăng hái phát biểu xây dựng bài'] },
  { week: 23, theme: 'Văn học hiện đại & Nghị luận xã hội thi vào 10', criteria: ['Luyện viết đoạn văn nghị luận xã hội chuẩn cấu trúc', 'Nắm chắc kiến thức các tác phẩm trọng tâm', 'Không vi phạm vở ghi chép bài'] },
  { week: 24, theme: 'Nâng cao năng lực Tiếng Anh tuyển sinh', criteria: ['Nắm vững các thì, câu gián tiếp, câu bị động', 'Luyện tập phát âm và từ vựng mỗi ngày', 'Tham gia sôi nổi câu lạc bộ tiếng Anh lớp'] },
  { week: 25, theme: 'Tiến bước lên Đoàn - Chào mừng ngày 26/3', criteria: ['Học tập tấm gương đoàn viên thanh niên tiêu biểu', 'Tham gia tích cực ngày hội thể thao trường', 'Phấn đấu kết nạp Đoàn TNCS Hồ Chí Minh'] },
  { week: 26, theme: 'Hướng nghiệp & Khám phá năng lực cá nhân', criteria: ['Tìm hiểu các trường THPT trên địa bàn tỉnh', 'Khảo sát năng lực phù hợp với nguyện vọng', 'Tham gia buổi tư vấn tuyển sinh 10'] },
  { week: 27, theme: 'Kiểm tra Giữa học kỳ 2 nghiêm túc', criteria: ['Ôn tập kỹ các môn thi giữa kỳ', 'Tuân thủ nghiêm túc kỷ luật phòng thi', 'Đạt kết quả kiểm tra đồng đều ở cả 4 tổ'] },
  { week: 28, theme: 'Khảo sát nguyện vọng 1, 2, 3 vào các trường THPT', criteria: ['Hoàn thành phiếu khảo sát nguyện vọng tuyển sinh', 'Trao đổi cùng phụ huynh chọn trường vừa sức', 'Tập trung ôn luyện môn còn yếu'] },
  { week: 29, theme: 'Quản lý thời gian & Giải tỏa áp lực thi cử', criteria: ['Cân bằng giữa học tập và rèn luyện thể thao', 'Giữ tinh thần lạc quan, tự tin', 'Tương trợ, động viên bạn bè trong lớp'] },
  { week: 30, theme: 'Tổng ôn tập kiến thức lớp 9 toàn diện', criteria: ['Hệ thống hóa toàn bộ kiến thức 3 môn thi vào 10', 'Giải bộ đề cương ôn tập tổng hợp', 'Duy trì chuyên cần 100%'] },
  { week: 31, theme: 'Luyện đề thi thử Tuyển sinh 10 cấp trường', criteria: ['Tham gia thi thử bấm giờ nghiêm túc như thi thật', 'Rút kinh nghiệm các lỗi sai trong bài làm', 'Rèn luyện kỹ năng phân bổ thời gian làm bài'] },
  { week: 32, theme: 'Kiểm tra Học kỳ 2: Chặng cuối THCS', criteria: ['Hoàn thành xuất sắc kỳ kiểm tra học kỳ 2', 'Đạt tiêu chuẩn xếp loại Tốt cả rèn luyện và học tập', 'Không vi phạm bất kỳ nội quy nào'] },
  { week: 33, theme: 'Hoàn thiện hồ sơ tuyển sinh & Đăng ký nguyện vọng chính thức', criteria: ['Kiểm tra thông tin học bạ, mã định danh chính xác', 'Nộp hồ sơ tuyển sinh vào lớp 10 đúng hạn', 'Tập trung ôn tập nước rút'] },
  { week: 34, theme: 'Tri ân & Trưởng thành học sinh lớp 9 (2026-2027)', criteria: ['Tổ chức Lễ Tri ân Thầy Cô và Cha Mẹ ấm áp', 'Giữ gìn kỷ niệm đẹp tuổi học trò Phước Hưng', 'Chuẩn bị tâm thế vững vàng bước vào kỳ thi'] },
  { week: 35, theme: 'Về đích: Tự tin - Chiến thắng kỳ thi vào Lớp 10!', criteria: ['Nắm chắc quy chế thi tuyển sinh vào 10', 'Chuẩn bị đầy đủ giấy tờ, dụng cụ phòng thi', '100% học sinh 9A1 tự tin đỗ nguyện vọng 1!'] }
];

// Sơ đồ chỗ ngồi thực tế chuẩn 4 dãy bàn lớp 9A1 (Tổ 1 từ Cửa vào ➔ Tổ 4 đối diện Bàn Giáo Viên)
const DEFAULT_SEATING_PLAN = [
  // Cột 1 (Bên trái phòng học): Dãy 4 - Tổ 4 (Đối diện Bàn Giáo Viên - 11 HS)
  {
    dayId: 4,
    title: 'Dãy 4',
    toName: 'Tổ 4 (Đối diện Bàn GV)',
    rows: [
      { row: 1, left: 'HS01', right: 'HS02' }, // Đặng Văn Hoàng Long & La Cẩm Nhung
      { row: 2, left: 'HS03', right: 'HS04' }, // Võ Ngọc Bảo Trân & Nguyễn Gia Thịnh (Tổ trưởng 4)
      { row: 3, left: 'HS05', right: 'HS06' }, // Trần Trọng Khang & Phạm Tấn Lộc
      { row: 4, left: 'HS07', right: 'HS08' }, // Trần Khá Thuận & Hồ Thị Thanh Huyền
      { row: 5, left: 'HS09', right: 'HS10' }, // Trương Thị Bích Dân & Nguyễn Văn Ngà Em
      { row: 6, left: 'HS11', right: null }    // Lâm Thái Bảo & Bàn trống
    ]
  },
  // Cột 2 (Giữa trái): Dãy 3 - Tổ 3 (10 HS)
  {
    dayId: 3,
    title: 'Dãy 3',
    toName: 'Tổ 3',
    rows: [
      { row: 1, left: 'HS12', right: 'HS13' }, // Trương Hữu Nghĩa & Trương Kim Ngân
      { row: 2, left: 'HS14', right: 'HS15' }, // Nguyễn Thị Kim Anh & Lê Bích Thi
      { row: 3, left: 'HS16', right: 'HS17' }, // Nguyễn Minh Triết & Nguyễn Phú Quý
      { row: 4, left: 'HS18', right: 'HS19' }, // Phan Tuấn Khang & Trần Thị Thanh Ngân
      { row: 5, left: 'HS20', right: 'HS21' }, // Huỳnh Quốc Long (Tổ trưởng 3) & Nguyễn Thanh Duy
      { row: 6, left: null, right: null }
    ]
  },
  // Cột 3 (Giữa phải): Dãy 2 - Tổ 2 (10 HS)
  {
    dayId: 2,
    title: 'Dãy 2',
    toName: 'Tổ 2',
    rows: [
      { row: 1, left: 'HS22', right: 'HS23' }, // Nguyễn Thị Huyền Trang & Nguyễn Thị Kim Yến
      { row: 2, left: 'HS24', right: 'HS25' }, // Phạm Hoàng Huy & Nguyễn Lê Thành Đạt
      { row: 3, left: 'HS26', right: 'HS27' }, // Phan Trần Thảo Quyên & Hồ Thị Kim Cương (Tổ trưởng 2)
      { row: 4, left: 'HS28', right: 'HS29' }, // Phạm Tấn Lợi & Nguyễn Vũ Duy
      { row: 5, left: 'HS30', right: 'HS31' }, // Trình Minh Thiện (Lớp trưởng) & Đỗ Duy Bảo (LP Trật tự)
      { row: 6, left: null, right: null }
    ]
  },
  // Cột 4 (Bên phải phòng học): Dãy 1 - Tổ 1 (Từ Cửa Vào - 12 HS)
  {
    dayId: 1,
    title: 'Dãy 1',
    toName: 'Tổ 1 (Từ Cửa Vào)',
    rows: [
      { row: 1, left: 'HS32', right: 'HS33' }, // Đỗ Thị Thùy Linh (LP Học tập) & Nguyễn Thị Tuyết Như
      { row: 2, left: 'HS34', right: 'HS35' }, // Võ Hạ Lam & Huỳnh Thị Ngọc Hân
      { row: 3, left: 'HS36', right: 'HS37' }, // Lê Thị Thúy Vy & Lê Kiều Khả Ái
      { row: 4, left: 'HS38', right: 'HS39' }, // Trịnh Lan Phương (Thủ quỹ) & Nguyễn Thị Ngọc Thảo (Tổ trưởng 1)
      { row: 5, left: 'HS40', right: 'HS41' }, // Lê Công Minh & Nguyễn Thanh Nhân (LP Lao động)
      { row: 6, left: 'HS42', right: 'HS43' }  // Lê Thành Nguyên & Lê Thị Kiều Duyên
    ]
  }
];

// Khởi tạo Database Manager
class AppStore {
  constructor() {
    this.storageKey = 'PHUOC_HUNG_9A1_DATABASE_V8';
    this.state = this.loadState();
  }

  loadState() {
    try {
      const cached = localStorage.getItem(this.storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.students && parsed.students.length > 0) {
          // Chuẩn hóa và khóa cứng chuẩn xác 100% họ tên & chức vụ Ban Cán Sự Lớp 9A1
          const OFFICIAL_CADRE_MAP = {
            'HS30': { name: 'Trình Minh Thiện', role: 'Lớp trưởng', to: 2 },
            'HS32': { name: 'Đỗ Thị Thùy Linh', role: 'Lớp phó Học tập', to: 1 },
            'HS31': { name: 'Đỗ Duy Bảo', role: 'Lớp phó Trật tự', to: 2 },
            'HS41': { name: 'Nguyễn Thanh Nhân', role: 'Lớp phó Lao động', to: 1 },
            'HS38': { name: 'Trịnh Lan Phương', role: 'Thủ quỹ', to: 1 },
            'HS39': { name: 'Nguyễn Thị Ngọc Thảo', role: 'Tổ trưởng 1', to: 1 },
            'HS27': { name: 'Hồ Thị Kim Cương', role: 'Tổ trưởng 2', to: 2 },
            'HS20': { name: 'Huỳnh Quốc Long', role: 'Tổ trưởng 3', to: 3 },
            'HS04': { name: 'Nguyễn Gia Thịnh', role: 'Tổ trưởng 4', to: 4 }
          };
          parsed.students.forEach(s => {
            if (OFFICIAL_CADRE_MAP[s.id]) {
              s.name = OFFICIAL_CADRE_MAP[s.id].name;
              s.role = OFFICIAL_CADRE_MAP[s.id].role;
              s.to = OFFICIAL_CADRE_MAP[s.id].to;
            } else if (s.role && s.role !== 'Học sinh') {
              const cadreValues = ['Lớp trưởng', 'Học tập', 'Trật tự', 'Lao động', 'Thủ quỹ', 'Tổ trưởng'];
              if (cadreValues.some(cv => s.role.includes(cv))) {
                s.role = 'Học sinh';
              }
            }
          });

          // Tự động chuyển đổi nếu máy người dùng đang lưu HS18 làm Tổ trưởng 3
          const hs18 = parsed.students.find(s => s.id === 'HS18');
          if (hs18 && hs18.role === 'Tổ trưởng 3') hs18.role = 'Học sinh';
          const hs20 = parsed.students.find(s => s.id === 'HS20');
          if (hs20) hs20.role = 'Tổ trưởng 3';

          if (!parsed.weeksThemes || !Array.isArray(parsed.weeksThemes)) parsed.weeksThemes = WEEKS_THEMES;
          if (!parsed.weeklyCriteriaScores) parsed.weeklyCriteriaScores = this.generateInitialWeeklyCriteriaScores();
          if (!parsed.weeklyRecords) parsed.weeklyRecords = this.generateInitialWeeklyRecords();
          if (!parsed.weeklyOfficerReviews) parsed.weeklyOfficerReviews = this.generateInitialWeeklyOfficerReviews();
          if (!parsed.weeklyEmulationNotes) parsed.weeklyEmulationNotes = this.generateInitialWeeklyEmulationNotes();
          if (!parsed.seatingPlan || !Array.isArray(parsed.seatingPlan) || parsed.seatingPlan.length !== 4) {
            parsed.seatingPlan = JSON.parse(JSON.stringify(DEFAULT_SEATING_PLAN));
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Không thể đọc state từ LocalStorage, khởi tạo dữ liệu mẫu:', e);
    }

    const initialState = {
      version: '4.0.0',
      academicYear: '2026-2027',
      class: '9A1',
      school: 'TH & THCS Phước Hưng',
      homeroomTeacher: 'Thầy/Cô Chủ nhiệm 9A1',
      examCountdownDate: '2027-06-05T07:30:00',
      students: DEFAULT_STUDENTS,
      emulationRules: EMULATION_RULES,
      badgesConfig: BADGES_CONFIG,
      perks: CLASS_PERKS,
      studyPairs: STUDY_PAIRS,
      ledger: INITIAL_LEDGER,
      auditLogs: INITIAL_AUDIT_LOGS,
      minigames: WEEKLY_MINIGAMES,
      kudos: INITIAL_KUDOS,
      examBank: EXAM_BANK,
      dutyRotationWeekOffset: 0,
      currentWeek: 2,
      reportsHistory: [],
      weeksThemes: WEEKS_THEMES,
      weeklyCriteriaScores: this.generateInitialWeeklyCriteriaScores(),
      weeklyRecords: this.generateInitialWeeklyRecords(),
      weeklyOfficerReviews: this.generateInitialWeeklyOfficerReviews(),
      weeklyEmulationNotes: this.generateInitialWeeklyEmulationNotes(),
      seatingPlan: JSON.parse(JSON.stringify(DEFAULT_SEATING_PLAN))
    };

    this.saveState(initialState);
    return initialState;
  }

  generateInitialWeeklyCriteriaScores() {
    const scores = {};
    for (let w = 1; w <= 35; w++) {
      scores[w] = {};
      DEFAULT_STUDENTS.forEach(s => {
        scores[w][s.id] = {
          vangP: 0,
          vangK: 0,
          truyBai: 0,
          diTre: 0,
          dongPhuc: 0,
          mtt: 0,
          kttx04: 0,
          kttx57: 0,
          kttx810: 0,
          gioTay: 0,
          phatBieu: 0,
          veSinh: 0,
          viPham: 0,
          note: ''
        };
      });
    }

    // Dữ liệu mẫu thực tế cho Tuần 1 và Tuần 2
    if (scores[1] && scores[1]['HS01']) {
      scores[1]['HS01'].gioTay = 2; scores[1]['HS01'].phatBieu = 2; scores[1]['HS01'].kttx810 = 1; scores[1]['HS01'].veSinh = 1;
    }
    if (scores[1] && scores[1]['HS04']) {
      scores[1]['HS04'].gioTay = 3; scores[1]['HS04'].phatBieu = 2;
    }
    if (scores[1] && scores[1]['HS09']) {
      scores[1]['HS09'].diTre = 1;
    }
    if (scores[1] && scores[1]['HS11']) {
      scores[1]['HS11'].kttx810 = 2; scores[1]['HS11'].phatBieu = 3;
    }

    if (scores[2] && scores[2]['HS01']) {
      scores[2]['HS01'].gioTay = 3; scores[2]['HS01'].phatBieu = 2; scores[2]['HS01'].kttx810 = 1; scores[2]['HS01'].veSinh = 1;
    }
    if (scores[2] && scores[2]['HS02']) {
      scores[2]['HS02'].gioTay = 2; scores[2]['HS02'].phatBieu = 2; scores[2]['HS02'].kttx810 = 1;
    }
    if (scores[2] && scores[2]['HS04']) {
      scores[2]['HS04'].phatBieu = 3; scores[2]['HS04'].kttx810 = 1;
    }
    if (scores[2] && scores[2]['HS05']) {
      scores[2]['HS05'].truyBai = 1; scores[2]['HS05'].diTre = 1;
    }
    if (scores[2] && scores[2]['HS09']) {
      scores[2]['HS09'].vangK = 1; scores[2]['HS09'].diTre = 1;
    }
    if (scores[2] && scores[2]['HS11']) {
      scores[2]['HS11'].gioTay = 4; scores[2]['HS11'].phatBieu = 3; scores[2]['HS11'].kttx810 = 2;
    }
    if (scores[2] && scores[2]['HS20']) {
      scores[2]['HS20'].diTre = 1; scores[2]['HS20'].dongPhuc = 1;
    }
    if (scores[2] && scores[2]['HS25']) {
      scores[2]['HS25'].mtt = 2; scores[2]['HS25'].truyBai = 1;
    }
    if (scores[2] && scores[2]['HS33']) {
      scores[2]['HS33'].gioTay = 2; scores[2]['HS33'].kttx810 = 1;
    }
    if (scores[2] && scores[2]['HS40']) {
      scores[2]['HS40'].diTre = 2; scores[2]['HS40'].dongPhuc = 1;
    }

    return scores;
  }

  generateInitialWeeklyRecords() {
    const records = {};
    for (let w = 1; w <= 35; w++) {
      records[w] = {};
    }
    records[1]['HS01'] = { plus: [{ points: 5, reason: 'Gương mẫu điều hành tuần đầu', actor: 'GVCN' }], minus: [] };
    records[1]['HS04'] = { plus: [{ points: 5, reason: 'Phát biểu tốt môn Văn', actor: 'Lớp phó HT' }], minus: [] };
    records[1]['HS09'] = { plus: [], minus: [{ points: -2, reason: 'Đi muộn 5p', actor: 'Lớp phó Trật tự' }] };
    records[1]['HS11'] = { plus: [{ points: 10, reason: 'Gương sáng tuần 1', actor: 'Tổ trưởng 2' }], minus: [] };

    records[2]['HS01'] = { plus: [{ points: 3, reason: 'Chuẩn bị bài đầy đủ', actor: 'Tổ trưởng 1' }], minus: [] };
    records[2]['HS02'] = { plus: [{ points: 5, reason: 'Điểm 10 kiểm tra miệng', actor: 'Lớp phó HT' }], minus: [] };
    records[2]['HS05'] = { plus: [], minus: [{ points: -3, reason: 'Thiếu bài tập về nhà', actor: 'Lớp phó HT' }] };
    records[2]['HS20'] = { plus: [], minus: [{ points: -2, reason: 'Đi muộn sau 6h45', actor: 'Lớp phó Trật tự' }] };
    records[2]['HS25'] = { plus: [], minus: [{ points: -2, reason: 'Nói chuyện riêng', actor: 'Lớp phó Trật tự' }] };
    records[2]['HS33'] = { plus: [{ points: 5, reason: 'Sổ quỹ rõ ràng, minh bạch', actor: 'GVCN' }], minus: [] };

    return records;
  }

  generateInitialWeeklyOfficerReviews() {
    const reviews = {};
    for (let w = 1; w <= 35; w++) {
      reviews[w] = {};
    }

    // Dữ liệu mẫu thực tế Tuần 1
    reviews[1]['HS01'] = {
      lop_truong: { comment: 'Gương mẫu, tích cực tham gia các phong trào chung đầu năm', rating: 'Tốt', actor: 'Lớp trưởng', time: '07/09/2026' },
      to_truong_4: { comment: 'Chấp hành nghiêm nề nếp tổ 4, hòa đồng với bạn bè', rating: 'Tốt', actor: 'Tổ trưởng 4', time: '07/09/2026' }
    };
    reviews[1]['HS04'] = {
      lop_truong: { comment: 'Tổ trưởng 4 đôn đốc thành viên rất trách nhiệm', rating: 'Tốt', actor: 'Lớp trưởng', time: '07/09/2026' },
      to_truong_4: { comment: 'Hoàn thành tốt nhiệm vụ quản lý tổ 4', rating: 'Tốt', actor: 'Tổ trưởng 4', time: '07/09/2026' }
    };
    reviews[1]['HS05'] = {
      lp_hoc_tap: { comment: 'Cần chú ý làm đầy đủ bài tập về nhà môn Toán', rating: 'Cần nhắc nhở', actor: 'LP Học tập', time: '08/09/2026' },
      to_truong_4: { comment: 'Đã nhắc nhở chuẩn bị bài chu đáo trước khi đến lớp', rating: 'Cần nhắc nhở', actor: 'Tổ trưởng 4', time: '08/09/2026' }
    };
    reviews[1]['HS09'] = {
      lp_trat_tu: { comment: 'Có 1 buổi đi trễ 5 phút, các buổi sau đã khắc phục tốt', rating: 'Cần nhắc nhở', actor: 'LP Trật tự', time: '08/09/2026' },
      to_truong_4: { comment: 'Đã nhắc nhở đi học đúng giờ hơn', rating: 'Cần nhắc nhở', actor: 'Tổ trưởng 4', time: '08/09/2026' }
    };
    reviews[1]['HS18'] = {
      lop_truong: { comment: 'Chăm ngoan, hòa đồng, hoàn thành tốt nhiệm vụ', rating: 'Tốt', actor: 'Lớp trưởng', time: '08/09/2026' }
    };
    reviews[1]['HS20'] = {
      lop_truong: { comment: 'Tổ trưởng 3 năng nổ, quản lý tổ 3 nề nếp và trách nhiệm', rating: 'Tốt', actor: 'Lớp trưởng', time: '08/09/2026' }
    };
    reviews[1]['HS27'] = {
      lop_truong: { comment: 'Tổ trưởng 2 theo dõi nề nếp tổ nghiêm túc', rating: 'Tốt', actor: 'Lớp trưởng', time: '07/09/2026' }
    };
    reviews[1]['HS30'] = {
      to_truong_1: { comment: 'Lớp trưởng chỉ huy lớp rất tốt, gương mẫu tuyệt đối', rating: 'Tốt', actor: 'Tổ trưởng 1', time: '07/09/2026' },
      to_truong_2: { comment: 'Lớp trưởng điều phối hoạt động công tâm, sát sao', rating: 'Tốt', actor: 'Tổ trưởng 2', time: '07/09/2026' }
    };
    reviews[1]['HS31'] = {
      lop_truong: { comment: 'Lớp phó trật tự theo dõi nề nếp kỷ luật rất công tâm', rating: 'Tốt', actor: 'Lớp trưởng', time: '08/09/2026' },
      to_truong_2: { comment: 'Gương mẫu trong tổ 2, nhắc nhở các bạn giữ trật tự', rating: 'Tốt', actor: 'Tổ trưởng 2', time: '08/09/2026' }
    };
    reviews[1]['HS32'] = {
      lop_truong: { comment: 'Lớp phó học tập đôn đốc 15p đầu giờ rất hiệu quả', rating: 'Tốt', actor: 'Lớp trưởng', time: '07/09/2026' },
      to_truong_1: { comment: 'Học lực xuất sắc, nhiệt tình hỗ trợ bạn trong tổ', rating: 'Tốt', actor: 'Tổ trưởng 1', time: '07/09/2026' }
    };
    reviews[1]['HS38'] = {
      lop_truong: { comment: 'Thủ quỹ ghi chép sổ thu chi rõ ràng, minh bạch', rating: 'Tốt', actor: 'Lớp trưởng', time: '07/09/2026' },
      to_truong_1: { comment: 'Ý thức tổ tốt, quản lý tài chính chuẩn mực', rating: 'Tốt', actor: 'Tổ trưởng 1', time: '07/09/2026' }
    };
    reviews[1]['HS39'] = {
      lop_truong: { comment: 'Tổ trưởng 1 tổ chức hoạt động tổ hiệu quả', rating: 'Tốt', actor: 'Lớp trưởng', time: '07/09/2026' }
    };
    reviews[1]['HS41'] = {
      lop_truong: { comment: 'Lớp phó Lao động phân công trực nhật chu đáo', rating: 'Tốt', actor: 'Lớp trưởng', time: '07/09/2026' },
      to_truong_1: { comment: 'Nhiệt tình với việc chung, trực nhật sạch sẽ', rating: 'Tốt', actor: 'Tổ trưởng 1', time: '07/09/2026' }
    };

    // Dữ liệu mẫu thực tế Tuần 2
    reviews[2]['HS01'] = {
      lop_truong: { comment: 'Duy trì phong độ học tập tốt, làm bài tập đầy đủ', rating: 'Tốt', actor: 'Lớp trưởng', time: '14/09/2026' },
      to_truong_4: { comment: 'Tích cực phát biểu xây dựng bài trong tuần', rating: 'Tốt', actor: 'Tổ trưởng 4', time: '14/09/2026' }
    };
    reviews[2]['HS04'] = {
      to_truong_4: { comment: 'Tổ trưởng 4 gương mẫu, phát biểu xây dựng bài tích cực', rating: 'Tốt', actor: 'Tổ trưởng 4', time: '14/09/2026' },
      lp_hoc_tap: { comment: 'Học tập xuất sắc, tích cực phát biểu', rating: 'Tốt', actor: 'LP Học tập', time: '14/09/2026' }
    };
    reviews[2]['HS11'] = {
      lp_hoc_tap: { comment: 'Đạt 2 điểm 10 KTTX, được đề xuất Gương sáng tuần 2', rating: 'Tốt', actor: 'LP Học tập', time: '15/09/2026' },
      to_truong_4: { comment: 'Chăm chỉ, tiến bộ môn Toán và Anh', rating: 'Tốt', actor: 'Tổ trưởng 4', time: '15/09/2026' }
    };
    reviews[2]['HS25'] = {
      lp_trat_tu: { comment: 'Cần tập trung hơn, tránh nói chuyện riêng trong giờ', rating: 'Cần nhắc nhở', actor: 'LP Trật tự', time: '15/09/2026' },
      to_truong_2: { comment: 'Đã trao đổi riêng để bạn tập trung học bài', rating: 'Cần nhắc nhở', actor: 'Tổ trưởng 2', time: '15/09/2026' }
    };
    reviews[2]['HS30'] = {
      to_truong_1: { comment: 'Lớp trưởng điều phối tiết sinh hoạt lớp sôi nổi', rating: 'Tốt', actor: 'Tổ trưởng 1', time: '15/09/2026' }
    };
    reviews[2]['HS39'] = {
      lop_truong: { comment: 'Tổ 1 đứng đầu thi đua tuần 2, Tổ trưởng tổ chức rất tốt', rating: 'Tốt', actor: 'Lớp trưởng', time: '15/09/2026' }
    };
    reviews[2]['HS41'] = {
      lp_lao_dong: { comment: 'Lớp học luôn sạch đẹp, phân loại rác đúng nơi quy định', rating: 'Tốt', actor: 'LP Lao động', time: '15/09/2026' },
      to_truong_1: { comment: 'Đôn đốc các bạn trực nhật đúng giờ', rating: 'Tốt', actor: 'Tổ trưởng 1', time: '15/09/2026' }
    };

    return reviews;
  }

  // ================= SỔ TAY NHẬN XÉT CỦA BAN CÁN SỰ (TUẦN 1 -> 35) =================
  getWeeklyOfficerReviews(weekNumber) {
    const w = parseInt(weekNumber);
    if (!this.state.weeklyOfficerReviews) this.state.weeklyOfficerReviews = {};
    if (!this.state.weeklyOfficerReviews[w]) this.state.weeklyOfficerReviews[w] = {};
    return this.state.weeklyOfficerReviews[w];
  }

  getStudentOfficerReview(weekNumber, studentId, roleKey) {
    const wReviews = this.getWeeklyOfficerReviews(weekNumber);
    if (!wReviews[studentId]) wReviews[studentId] = {};
    return wReviews[studentId][roleKey] || null;
  }

  getAllStudentOfficerReviews(weekNumber, studentId) {
    const wReviews = this.getWeeklyOfficerReviews(weekNumber);
    return wReviews[studentId] || {};
  }

  saveStudentOfficerReview({ week, studentId, roleKey, comment, rating, actor }) {
    const w = parseInt(week);
    const s = this.getStudentById(studentId);
    if (!s) return null;

    if (!this.state.weeklyOfficerReviews) this.state.weeklyOfficerReviews = {};
    if (!this.state.weeklyOfficerReviews[w]) this.state.weeklyOfficerReviews[w] = {};
    if (!this.state.weeklyOfficerReviews[w][studentId]) this.state.weeklyOfficerReviews[w][studentId] = {};

    const reviewObj = {
      comment: String(comment || '').trim(),
      rating: rating || 'Tốt',
      actor: actor || 'Ban cán sự',
      time: new Date().toLocaleDateString('vi-VN')
    };

    this.state.weeklyOfficerReviews[w][studentId][roleKey] = reviewObj;

    // Ghi Audit Log
    this.state.auditLogs.unshift({
      id: 'LOG_' + Date.now(),
      timestamp: new Date().toLocaleString('vi-VN'),
      actor: actor || 'Ban cán sự',
      targetStudent: `${s.name} (Tổ ${s.to})`,
      action: `[Tuần ${w}] Nhận xét học sinh`,
      reason: `Đánh giá: ${reviewObj.rating} - "${reviewObj.comment || 'Không có nhận xét chi tiết'}"`,
      verified: true
    });

    this.saveState();
    return reviewObj;
  }

  // ================= NHẬN XÉT & PHƯƠNG HƯỚNG TUẦN TỚI CỦA BAN CÁN SỰ LỚP (THI ĐUA TT 22) =================
  generateInitialWeeklyEmulationNotes() {
    const notes = {};
    for (let w = 1; w <= 35; w++) {
      notes[w] = {
        officerReview: '',
        nextWeekDirection: '',
        gvcnFeedback: '',
        status: 'Chờ duyệt',
        submittedBy: 'Lớp trưởng (Trình Minh Thiện)',
        updatedAt: ''
      };
    }

    // Dữ liệu mẫu Tuần 1
    notes[1] = {
      officerReview: '- Nền nếp tuần đầu tiên của lớp 9A1 rất tốt, 100% học sinh mặc đồng phục, đeo khăn quàng trang nghiêm.\n- 15 phút đầu giờ các tổ truy bài nghiêm túc, bạn Thùy Linh (LP Học tập) và các tổ trưởng đôn đốc bài tập chu đáo.\n- Tổ 1 và Tổ 2 trực nhật lớp sạch sẽ, đúng giờ.\n- Tồn tại: Còn 2 bạn đi học sát giờ (HS09, HS20), đã được Lớp phó Trật tự Bảo nhắc nhở.',
      nextWeekDirection: '- Duy trì chuyên cần 100%, khắc phục triệt để tình trạng đi trễ.\n- Đẩy mạnh phong trào đôi bạn cùng tiến, hỗ trợ các bạn còn yếu môn Toán và KHTN.\n- Tổ 3 và Tổ 4 chuẩn bị trực nhật chu đáo tuần tới.\n- Phấn đấu đạt hạng Nhất thi đua toàn trường trong tuần 2.',
      gvcnFeedback: 'GVCN biểu dương tinh thần trách nhiệm của Ban cán sự lớp trong tuần đầu năm học. Nhất trí với phương hướng tuần 2, yêu cầu các tổ trưởng theo dõi sát sĩ số và nề nếp truy bài.',
      status: 'Đã duyệt',
      submittedBy: 'Lớp trưởng (Trình Minh Thiện)',
      updatedAt: '12/09/2026'
    };

    // Dữ liệu mẫu Tuần 2
    notes[2] = {
      officerReview: '- Tuần 2 lớp giữ vững phong trào học tập, có nhiều bạn đạt điểm 9, 10 môn Toán, Văn, KHTN.\n- Tổ 1 dẫn đầu thi đua tuần với điểm số cao (Tổ trưởng Thảo điều hành tốt).\n- Các nhóm học tập tương trợ hoạt động hiệu quả, tinh thần đoàn kết cao.\n- Tồn tại: Vẫn còn hiện tượng nói chuyện riêng trong tiết Tin học (HS25).',
      nextWeekDirection: '- Nghiêm túc giữ gìn trật tự trong tất cả các tiết học, đặc biệt là các phòng bộ môn.\n- Kiểm tra 100% bài tập về nhà trước khi vào lớp.\n- Tổ 3 tích cực nhắc nhở các bạn trong tổ nộp bài đúng hạn.\n- Quyết tâm giữ vững nề nếp top 1 toàn khối 9.',
      gvcnFeedback: 'Đánh giá cao sự tiến bộ của Tổ 1. Đề nghị Lớp phó Trật tự Bảo phối hợp chặt chẽ với Tổ trưởng 2 nhắc nhở bạn HS25.',
      status: 'Đang theo dõi',
      submittedBy: 'Lớp trưởng (Trình Minh Thiện)',
      updatedAt: '19/09/2026'
    };

    return notes;
  }

  getWeekEmulationNotes(weekNumber) {
    const w = parseInt(weekNumber) || 2;
    if (!this.state.weeklyEmulationNotes) this.state.weeklyEmulationNotes = this.generateInitialWeeklyEmulationNotes();
    if (!this.state.weeklyEmulationNotes[w]) {
      this.state.weeklyEmulationNotes[w] = {
        officerReview: '',
        nextWeekDirection: '',
        gvcnFeedback: '',
        status: 'Chờ duyệt',
        submittedBy: 'Lớp trưởng (Trình Minh Thiện)',
        updatedAt: ''
      };
    }
    return this.state.weeklyEmulationNotes[w];
  }

  recordAudit(entry) {
    if (!this.state.auditLogs || !Array.isArray(this.state.auditLogs)) {
      this.state.auditLogs = [];
    }
    const log = {
      id: entry.id || ('LOG_' + Date.now()),
      timestamp: entry.timestamp || new Date().toLocaleString('vi-VN'),
      actor: entry.actor || 'Hệ thống',
      targetStudent: entry.targetStudent || 'Lớp 9A1',
      action: entry.action || 'Cập nhật',
      reason: entry.reason || '',
      verified: entry.verified !== undefined ? entry.verified : true
    };
    this.state.auditLogs.unshift(log);
    if (this.state.auditLogs.length > 200) {
      this.state.auditLogs.pop();
    }
    return log;
  }

  saveWeekEmulationNotes(weekNumber, { officerReview, nextWeekDirection, actor = 'Lớp trưởng (Trình Minh Thiện)' }) {
    const w = parseInt(weekNumber) || 2;
    const notes = this.getWeekEmulationNotes(w);
    if (officerReview !== undefined) notes.officerReview = officerReview;
    if (nextWeekDirection !== undefined) notes.nextWeekDirection = nextWeekDirection;
    notes.submittedBy = actor;
    notes.updatedAt = new Date().toLocaleDateString('vi-VN');

    this.recordAudit({
      id: 'LOG_' + Date.now(),
      timestamp: new Date().toLocaleString('vi-VN'),
      actor: actor,
      targetStudent: `Toàn lớp 9A1 (Tuần ${w})`,
      action: `[Tuần ${w}] Cập nhật Nhận xét & Phương hướng`,
      reason: `Ban cán sự cập nhật nhận xét đánh giá và kế hoạch hoạt động tuần ${w}`,
      verified: true
    });

    this.saveState();
    return notes;
  }

  approveWeekEmulationNotes(weekNumber, gvcnFeedback = '') {
    const w = parseInt(weekNumber) || 2;
    const notes = this.getWeekEmulationNotes(w);
    notes.status = 'Đã duyệt';
    notes.gvcnFeedback = gvcnFeedback;
    notes.approvedAt = new Date().toLocaleString('vi-VN');

    this.recordAudit({
      id: 'LOG_' + Date.now(),
      timestamp: new Date().toLocaleString('vi-VN'),
      actor: 'Giáo viên Chủ nhiệm (Admin)',
      targetStudent: `Báo cáo Thi đua Tuần ${w}`,
      action: `[Tuần ${w}] Phê duyệt Báo cáo Thi đua`,
      reason: gvcnFeedback || 'GVCN đã duyệt nhận xét và phương hướng tuần tới',
      verified: true
    });

    this.saveState();
    return notes;
  }

  submitTeamEmulation(weekNumber, toId, actor = '') {
    const w = parseInt(weekNumber) || 2;
    const notes = this.getWeekEmulationNotes(w);
    if (!notes.teamSubmissions) notes.teamSubmissions = {};
    const submitTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN');
    notes.teamSubmissions[toId] = {
      submitted: true,
      submittedAt: submitTime,
      actor: actor || `Tổ trưởng ${toId}`
    };
    this.recordAudit({
      id: 'LOG_' + Date.now(),
      timestamp: new Date().toLocaleString('vi-VN'),
      actor: actor || `Tổ trưởng ${toId}`,
      targetStudent: `Ban cán sự lớp (Tuần ${w})`,
      action: `[Tuần ${w}] Đồng bộ & Gửi dữ liệu Tổ ${toId}`,
      reason: `Tổ trưởng ${toId} hoàn tất nhập liệu thi đua và gửi cho Ban cán sự xem, điều chỉnh.`,
      verified: true
    });
    this.saveState();
    return notes.teamSubmissions[toId];
  }

  isTeamSubmitted(weekNumber, toId) {
    const w = parseInt(weekNumber) || 2;
    const notes = this.getWeekEmulationNotes(w);
    if (!notes || !notes.teamSubmissions) return false;
    const sub = notes.teamSubmissions[toId] || notes.teamSubmissions[String(toId)] || notes.teamSubmissions[parseInt(toId)];
    return Boolean(sub && sub.submitted);
  }

  getTeamSubmissionInfo(weekNumber, toId) {
    const w = parseInt(weekNumber) || 2;
    const notes = this.getWeekEmulationNotes(w);
    if (!notes || !notes.teamSubmissions) return null;
    return notes.teamSubmissions[toId] || notes.teamSubmissions[String(toId)] || notes.teamSubmissions[parseInt(toId)] || null;
  }

  saveState(stateToSave = null) {
    if (stateToSave) this.state = stateToSave;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));

      // Tự động đẩy ngầm dữ liệu sang Supabase Cloud (Real-time Cloud Database)
      if (window.supabaseClient && typeof window.supabaseClient.triggerAutoPush === 'function') {
        window.supabaseClient.triggerAutoPush();
      }

      // Tự động đẩy ngầm dữ liệu động (Dynamic Cloud Auto-Sync) sang Google Sheets sau 1 giây
      if (window.syncHub && typeof window.syncHub.pushAllToGoogleSheets === 'function' && !this._isAutoPushing) {
        this._isAutoPushing = true;
        setTimeout(() => {
          window.syncHub.pushAllToGoogleSheets()
            .catch(err => console.log('Thông báo lưu mây tự động:', err.message))
            .finally(() => { this._isAutoPushing = false; });
        }, 1200);
      }
    } catch (e) {
      console.error('Lỗi khi lưu state vào LocalStorage:', e);
    }
  }

  // ================= QUẢN LÝ HỌC SINH (DÀNH CHO GVCN) =================

  getStudents() {
    return this.state.students;
  }

  getStudentById(id) {
    return this.state.students.find(s => s.id === id);
  }

  addStudent(studentData) {
    // Tự sinh mã HS nếu chưa có
    const newId = studentData.id || `HS${String(this.state.students.length + 1).padStart(2, '0')}`;
    const newStt = this.state.students.length + 1;

    const newStudent = {
      id: newId,
      stt: newStt,
      name: studentData.name.trim(),
      gender: studentData.gender || 'Nam',
      dob: studentData.dob || '01/01/2011',
      to: parseInt(studentData.to) || 1,
      role: studentData.role || 'Học sinh',
      phone: studentData.phone || '',
      parentPhone: studentData.parentPhone || '',
      address: studentData.address || 'Xã Phước Hưng, Huyện Long Thành',
      conduct: 'Tốt',
      academic: 'Khá',
      scoreAvg: parseFloat(studentData.scoreAvg) || 7.5,
      conductScore: 100,
      badges: [],
      targetHighSchool: {
        nv1: studentData.nv1 || 'THPT Phước Hưng',
        nv2: studentData.nv2 || 'THPT Long Thành',
        nv3: studentData.nv3 || 'THPT Bình Sơn'
      },
      homeworkStatus: true,
      notes: studentData.notes || 'Học sinh mới thêm vào lớp'
    };

    this.state.students.push(newStudent);

    // Ghi Audit log
    this.state.auditLogs.unshift({
      id: 'LOG_' + Date.now(),
      timestamp: new Date().toLocaleString('vi-VN'),
      actor: 'Giáo viên Chủ nhiệm (Admin)',
      targetStudent: `${newStudent.name} (Tổ ${newStudent.to})`,
      action: 'Thêm học sinh mới',
      reason: `Thêm học sinh vào danh sách lớp 9A1 và xếp vào Tổ ${newStudent.to}`,
      verified: true
    });

    this.saveState();
    return newStudent;
  }

  updateStudentOrganization(studentId, { to, role }) {
    const s = this.getStudentById(studentId);
    if (!s) return null;

    const oldTo = s.to;
    const oldRole = s.role;
    if (to !== undefined) s.to = parseInt(to);
    if (role !== undefined) s.role = role;

    this.state.auditLogs.unshift({
      id: 'LOG_' + Date.now(),
      timestamp: new Date().toLocaleString('vi-VN'),
      actor: 'Giáo viên Chủ nhiệm (Admin)',
      targetStudent: `${s.name}`,
      action: 'Sắp xếp tổ & Chức vụ',
      reason: `Chuyển từ Tổ ${oldTo} (${oldRole}) ➔ Tổ ${s.to} (${s.role})`,
      verified: true
    });

    this.saveState();
    return s;
  }

  deleteStudent(studentId) {
    const idx = this.state.students.findIndex(s => s.id === studentId);
    if (idx !== -1) {
      const removed = this.state.students.splice(idx, 1)[0];
      // Cập nhật lại STT
      this.state.students.forEach((s, i) => s.stt = i + 1);

      this.state.auditLogs.unshift({
        id: 'LOG_' + Date.now(),
        timestamp: new Date().toLocaleString('vi-VN'),
        actor: 'Giáo viên Chủ nhiệm (Admin)',
        targetStudent: `${removed.name}`,
        action: 'Xóa học sinh khỏi lớp',
        reason: 'Chuyển trường hoặc điều chỉnh danh sách',
        verified: true
      });

      this.saveState();
      return true;
    }
    return false;
  }

  updateStudent(id, partial) {
    const idx = this.state.students.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.state.students[idx] = { ...this.state.students[idx], ...partial };
      this.saveState();
      return this.state.students[idx];
    }
    return null;
  }

  importStudentsFromExcel(studentsList, mode = 'replace') {
    if (!Array.isArray(studentsList) || studentsList.length === 0) {
      throw new Error('Danh sách học sinh rỗng hoặc không hợp lệ!');
    }

    if (mode === 'replace') {
      this.state.students = [];
      if (!this.state.weeklyCriteriaScores) {
        this.state.weeklyCriteriaScores = {};
      }
      for (let w = 1; w <= 35; w++) {
        this.state.weeklyCriteriaScores[w] = {};
      }
    }

    const currentCount = this.state.students.length;
    const addedStudents = [];

    studentsList.forEach((item, index) => {
      const stt = currentCount + index + 1;
      const id = `HS${String(stt).padStart(2, '0')}`;
      const to = item.to ? parseInt(item.to) : ((index % 4) + 1);

      const newStudent = {
        id: id,
        stt: stt,
        name: String(item.name || '').trim(),
        gender: item.gender || 'Nam',
        dob: item.dob || '01/01/2011',
        to: to,
        role: item.role || 'Học sinh',
        className: item.className || '9A1',
        cccd: item.cccd || '',
        phone: item.phone || '',
        parentPhone: item.phone || item.parentPhone || '',
        address: item.address || 'Xã Phước Hưng, Huyện Long Thành',
        conduct: 'Tốt',
        academic: 'Khá',
        scoreAvg: 7.5,
        conductScore: 100,
        badges: [],
        targetHighSchool: {
          nv1: 'THPT Phước Hưng',
          nv2: 'THPT Long Thành',
          nv3: 'THPT Bình Sơn'
        },
        homeworkStatus: true,
        notes: item.notes || 'Nhập từ file Excel'
      };

      this.state.students.push(newStudent);
      addedStudents.push(newStudent);

      for (let w = 1; w <= 35; w++) {
        if (!this.state.weeklyCriteriaScores[w]) {
          this.state.weeklyCriteriaScores[w] = {};
        }
        if (!this.state.weeklyCriteriaScores[w][id]) {
          this.state.weeklyCriteriaScores[w][id] = {
            vangP: 0,
            vangK: 0,
            truyBai: 0,
            diTre: 0,
            dongPhuc: 0,
            mtt: 0,
            kt04: 0,
            kt57: 0,
            kt810: 0,
            gioTay: 0,
            phatBieu: 0,
            veSinh: 0,
            viPham: 0
          };
        }
      }
    });

    this.state.auditLogs.unshift({
      id: 'LOG_' + Date.now(),
      timestamp: new Date().toLocaleString('vi-VN'),
      actor: 'Giáo viên Chủ nhiệm (Admin)',
      targetStudent: `Lớp 9A1 (${addedStudents.length} học sinh)`,
      action: 'Nhập danh sách từ Excel',
      reason: mode === 'replace' 
        ? `Thay thế toàn bộ danh sách lớp bằng ${addedStudents.length} học sinh từ tệp Excel`
        : `Bổ sung ${addedStudents.length} học sinh mới từ tệp Excel vào danh sách lớp`,
      verified: true
    });

    this.saveState();
    return addedStudents;
  }

  // ================= THI ĐUA THEO 35 TUẦN HỌC =================
  getWeekTheme(weekNumber) {
    const w = parseInt(weekNumber);
    const found = (this.state.weeksThemes || WEEKS_THEMES).find(item => item.week === w);
    if (found) {
      return {
        week: w,
        theme: found.theme || `Thi đua tuần ${w}`,
        criteria: Array.isArray(found.criteria) ? found.criteria : ['Chuyên cần tốt', 'Nắm vững kiến thức', 'Trực nhật sạch sẽ']
      };
    }
    return {
      week: w,
      theme: `Thi đua tuần ${w}`,
      criteria: ['Chuyên cần tốt', 'Nắm vững kiến thức', 'Trực nhật sạch sẽ']
    };
  }

  getStudentWeekCriteria(weekNumber, studentId) {
    const w = parseInt(weekNumber);
    if (!this.state.weeklyCriteriaScores) this.state.weeklyCriteriaScores = {};
    if (!this.state.weeklyCriteriaScores[w]) this.state.weeklyCriteriaScores[w] = {};
    if (!this.state.weeklyCriteriaScores[w][studentId]) {
      this.state.weeklyCriteriaScores[w][studentId] = {
        vangP: 0,
        vangK: 0,
        truyBai: 0,
        diTre: 0,
        dongPhuc: 0,
        mtt: 0,
        kttx04: 0,
        kttx57: 0,
        kttx810: 0,
        gioTay: 0,
        phatBieu: 0,
        veSinh: 0,
        viPham: 0,
        note: ''
      };
    }
    return this.state.weeklyCriteriaScores[w][studentId];
  }

  calculateWeekScore(c) {
    const crit = c || {};
    const vangP = Math.max(0, parseInt(crit.vangP) || 0);
    const vangK = Math.max(0, parseInt(crit.vangK) || 0);
    const truyBai = Math.max(0, parseInt(crit.truyBai) || 0);
    const diTre = Math.max(0, parseInt(crit.diTre) || 0);
    const dongPhuc = Math.max(0, parseInt(crit.dongPhuc) || 0);
    const mtt = Math.max(0, parseInt(crit.mtt) || 0);
    const kttx04 = Math.max(0, parseInt(crit.kttx04) || 0);
    const kttx57 = Math.max(0, parseInt(crit.kttx57) || 0);
    const kttx810 = Math.max(0, parseInt(crit.kttx810) || 0);
    const gioTay = Math.max(0, parseInt(crit.gioTay) || 0);
    const phatBieu = Math.max(0, parseInt(crit.phatBieu) || 0);
    const veSinh = Math.max(0, parseInt(crit.veSinh) || 0);
    const viPham = Math.max(0, parseInt(crit.viPham) || 0);

    // Điểm trừ theo quy chế thực tế
    const minus = (vangP * 2) + (vangK * 5) + (truyBai * 2) + (diTre * 2) + (dongPhuc * 2) + (mtt * 2) + (kttx04 * 3) + (viPham * 2);
    // Điểm cộng (Hoa điểm 10 +5đ, phát biểu +2đ, giơ tay +1đ, trực nhật tốt +3đ)
    const plus = (kttx810 * 5) + (gioTay * 1) + (phatBieu * 2) + (veSinh * 3);

    // Điểm chuẩn 100đ ban đầu
    const totalScore = Math.max(0, Math.min(120, 100 - minus + plus));
    let rank = 'Tốt';
    if (totalScore < 60) rank = 'Chưa đạt';
    else if (totalScore < 75) rank = 'Đạt';
    else if (totalScore < 90) rank = 'Khá';

    return {
      minus,
      plus,
      totalScore,
      rank,
      criteria: { vangP, vangK, truyBai, diTre, dongPhuc, mtt, kttx04, kttx57, kttx810, gioTay, phatBieu, veSinh, viPham }
    };
  }

  updateStudentWeekCriteria(weekNumber, studentId, field, delta, actor = 'Ban cán sự', note = '') {
    const w = parseInt(weekNumber);
    const s = this.getStudentById(studentId);
    if (!s) return null;

    const crit = this.getStudentWeekCriteria(w, studentId);
    if (typeof crit[field] === 'number') {
      crit[field] = Math.max(0, crit[field] + delta);
    }
    if (note) crit.note = note;

    const scoreInfo = this.calculateWeekScore(crit);

    // Đồng bộ điểm rèn luyện tổng thể của học sinh
    s.conductScore = scoreInfo.totalScore;
    s.conduct = scoreInfo.rank;

    const fieldLabels = {
      vangP: 'Vắng có phép (P)',
      vangK: 'Vắng không phép (K)',
      truyBai: 'Vi phạm 15p truy bài',
      diTre: 'Đi trễ',
      dongPhuc: 'Vi phạm đồng phục / khăn quàng',
      mtt: 'Mất trật tự trong giờ (MTT)',
      kttx04: 'KTTX điểm 0->4',
      kttx57: 'KTTX điểm 5->7',
      kttx810: 'KTTX điểm 8->10 (Hoa điểm 10)',
      gioTay: 'Giơ tay',
      phatBieu: 'Phát biểu xây dựng bài',
      veSinh: 'Vệ sinh / trực nhật',
      viPham: 'Vi phạm khác'
    };

    const actionText = delta >= 0 ? `+${delta}` : `${delta}`;
    this.state.auditLogs.unshift({
      id: 'LOG_' + Date.now(),
      timestamp: new Date().toLocaleString('vi-VN'),
      actor,
      targetStudent: `${s.name} (Tổ ${s.to})`,
      action: `[Tuần ${w}] ${actionText} ${fieldLabels[field] || field}`,
      reason: note || `Chấm điểm thi đua tuần ${w} (Điểm tuần: ${scoreInfo.totalScore}đ - ${scoreInfo.rank})`,
      verified: true
    });

    this.saveState();
    return { student: s, criteria: crit, scoreInfo };
  }

  setStudentWeekCriteria(weekNumber, studentId, newCrit, actor = 'Ban cán sự') {
    const w = parseInt(weekNumber);
    const s = this.getStudentById(studentId);
    if (!s) return null;

    const crit = this.getStudentWeekCriteria(w, studentId);
    Object.assign(crit, newCrit);

    const scoreInfo = this.calculateWeekScore(crit);
    s.conductScore = scoreInfo.totalScore;
    s.conduct = scoreInfo.rank;

    this.state.auditLogs.unshift({
      id: 'LOG_' + Date.now(),
      timestamp: new Date().toLocaleString('vi-VN'),
      actor,
      targetStudent: `${s.name} (Tổ ${s.to})`,
      action: `[Tuần ${w}] Cập nhật phiếu thi đua`,
      reason: `Tổng điểm tuần: ${scoreInfo.totalScore}đ - Xếp loại: ${scoreInfo.rank}`,
      verified: true
    });

    this.saveState();
    return { student: s, criteria: crit, scoreInfo };
  }

  // ================= BẢNG VÀNG TUYÊN DƯƠNG THI ĐUA (TUẦN & THÁNG) =================
  getEmulationCommendations(weekNumber) {
    const w = parseInt(weekNumber) || 2;
    const students = this.getStudents();
    
    // Tính điểm của tất cả học sinh trong tuần w
    const studentScores = students.map(s => {
      const crit = this.getStudentWeekCriteria(w, s.id);
      const scoreInfo = this.calculateWeekScore(crit);
      
      // Điểm tuần trước (w - 1) để tính mức độ tiến bộ
      let prevScore = 100;
      let prevScoreInfo = null;
      if (w > 1) {
        const prevCrit = this.getStudentWeekCriteria(w - 1, s.id);
        prevScoreInfo = this.calculateWeekScore(prevCrit);
        prevScore = prevScoreInfo.totalScore;
      } else {
        // Tuần 1: Lấy chuẩn 100 điểm xuất phát
        prevScore = 100;
      }
      const deltaScore = scoreInfo.totalScore - prevScore;
      
      return {
        student: s,
        scoreInfo,
        totalScore: scoreInfo.totalScore,
        plus: scoreInfo.plus,
        minus: scoreInfo.minus,
        rank: scoreInfo.rank,
        prevScore,
        deltaScore
      };
    });

    // 1. Quán quân thi đua toàn lớp (Thủ khoa lớp 9A1)
    const sortedClass = [...studentScores].sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.plus !== a.plus) return b.plus - a.plus;
      if (a.minus !== b.minus) return a.minus - b.minus;
      return (b.student.scoreAvg || 0) - (a.student.scoreAvg || 0);
    });
    const topClass = sortedClass[0] || null;

    // 2. Thủ khoa thi đua 4 Tổ
    const topByTeam = {};
    for (let t = 1; t <= 4; t++) {
      const teamStudents = studentScores.filter(item => item.student.to === t);
      teamStudents.sort((a, b) => {
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        if (b.plus !== a.plus) return b.plus - a.plus;
        if (a.minus !== b.minus) return a.minus - b.minus;
        return (b.student.scoreAvg || 0) - (a.student.scoreAvg || 0);
      });
      topByTeam[t] = teamStudents[0] || null;
    }

    // 3. Học sinh có nhiều tiến bộ nhất trong tuần
    let sortedProgress;
    if (w > 1) {
      sortedProgress = [...studentScores].sort((a, b) => {
        if (b.deltaScore !== a.deltaScore) return b.deltaScore - a.deltaScore;
        if (b.plus !== a.plus) return b.plus - a.plus;
        return b.totalScore - a.totalScore;
      });
    } else {
      sortedProgress = [...studentScores].sort((a, b) => {
        if (b.plus !== a.plus) return b.plus - a.plus;
        return b.totalScore - a.totalScore;
      });
    }
    const mostImprovedWeek = sortedProgress[0] || null;

    return {
      week: w,
      topClass,
      topByTeam,
      mostImprovedWeek
    };
  }

  getMonthCommendations(monthNum) {
    const m = parseInt(monthNum) || 9;
    const monthMap = {
      9: [1, 2, 3, 4],
      10: [5, 6, 7, 8],
      11: [9, 10, 11, 12],
      12: [13, 14, 15, 16],
      1: [17, 18, 19, 20],
      2: [21, 22, 23, 24],
      3: [25, 26, 27, 28],
      4: [29, 30, 31, 32],
      5: [33, 34, 35]
    };
    const weeksInMonth = monthMap[m] || [1, 2, 3, 4];
    const students = this.getStudents();

    const monthScores = students.map(s => {
      let sumScore = 0;
      let sumPlus = 0;
      let sumMinus = 0;
      const weekDetails = [];

      weeksInMonth.forEach(w => {
        const crit = this.getStudentWeekCriteria(w, s.id);
        const sc = this.calculateWeekScore(crit);
        sumScore += sc.totalScore;
        sumPlus += sc.plus;
        sumMinus += sc.minus;
        weekDetails.push(sc.totalScore);
      });

      const avgScore = Number((sumScore / weeksInMonth.length).toFixed(1));
      const firstWeekScore = weekDetails[0] || 100;
      const lastWeekScore = weekDetails[weekDetails.length - 1] || firstWeekScore;
      const progressDelta = lastWeekScore - firstWeekScore;

      return {
        student: s,
        avgScore,
        sumPlus,
        sumMinus,
        progressDelta,
        firstWeekScore,
        lastWeekScore
      };
    });

    // 1. Quán quân tháng toàn lớp
    const sortedClass = [...monthScores].sort((a, b) => {
      if (b.avgScore !== a.avgScore) return b.avgScore - a.avgScore;
      return b.sumPlus - a.sumPlus;
    });
    const topClass = sortedClass[0] || null;

    // 2. Thủ khoa 4 tổ trong tháng
    const topByTeam = {};
    for (let t = 1; t <= 4; t++) {
      const teamStudents = monthScores.filter(item => item.student.to === t);
      teamStudents.sort((a, b) => {
        if (b.avgScore !== a.avgScore) return b.avgScore - a.avgScore;
        return b.sumPlus - a.sumPlus;
      });
      topByTeam[t] = teamStudents[0] || null;
    }

    // 3. Học sinh có nhiều tiến bộ nhất trong tháng
    const sortedProgress = [...monthScores].sort((a, b) => {
      if (b.progressDelta !== a.progressDelta) return b.progressDelta - a.progressDelta;
      return b.avgScore - a.avgScore;
    });
    const mostImprovedMonth = sortedProgress[0] || null;

    return {
      month: m,
      weeks: weeksInMonth,
      topClass,
      topByTeam,
      mostImprovedMonth
    };
  }


  getStudentWeeklyRecord(weekNumber, studentId) {
    const w = parseInt(weekNumber);
    if (!this.state.weeklyRecords) this.state.weeklyRecords = {};
    if (!this.state.weeklyRecords[w]) this.state.weeklyRecords[w] = {};
    if (!this.state.weeklyRecords[w][studentId]) {
      this.state.weeklyRecords[w][studentId] = { plus: [], minus: [] };
    }
    return this.state.weeklyRecords[w][studentId];
  }

  recordWeeklyPoint({ week, studentId, type, points, reason, actor }) {
    const s = this.getStudentById(studentId);
    if (!s) return null;

    const w = parseInt(week);
    const rec = this.getStudentWeeklyRecord(w, studentId);
    const numPoints = Math.abs(Number(points));

    if (type === 'plus') {
      rec.plus.push({
        id: 'P_' + Date.now(),
        points: numPoints,
        reason: reason || 'Khen thưởng',
        actor: actor || 'Ban cán sự',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      });
      // Cộng vào điểm tổng thể của học sinh
      s.conductScore = Math.min(100, s.conductScore + numPoints);
    } else {
      rec.minus.push({
        id: 'M_' + Date.now(),
        points: numPoints,
        reason: reason || 'Vi phạm nội quy',
        actor: actor || 'Ban cán sự',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      });
      // Trừ điểm tổng thể của học sinh
      s.conductScore = Math.max(0, s.conductScore - numPoints);
    }

    // Cập nhật xếp loại TT22
    if (s.conductScore >= 90) s.conduct = 'Tốt';
    else if (s.conductScore >= 75) s.conduct = 'Khá';
    else if (s.conductScore >= 60) s.conduct = 'Đạt';
    else s.conduct = 'Chưa đạt';

    // Ghi Audit log
    this.state.auditLogs.unshift({
      id: 'LOG_' + Date.now(),
      timestamp: new Date().toLocaleString('vi-VN'),
      actor,
      targetStudent: `${s.name} (Tổ ${s.to})`,
      action: `[Tuần ${w}] ${type === 'plus' ? 'Cộng' : 'Trừ'} ${numPoints} điểm`,
      reason,
      verified: true
    });

    this.saveState();
    return { student: s, record: rec };
  }

  // Chấm điểm thi đua chung & Ghi Audit Log
  recordEmulationPoint({ actor, studentId, pointDelta, reason, proofImg = '' }) {
    return this.recordWeeklyPoint({
      week: this.state.currentWeek || 2,
      studentId,
      type: pointDelta >= 0 ? 'plus' : 'minus',
      points: Math.abs(pointDelta),
      reason,
      actor
    });
  }

  // Ghi nhận thu chi quỹ
  addLedgerEntry({ type, amount, category, note, approver, proofImg = '' }) {
    const entry = {
      id: 'LED_' + Date.now(),
      date: new Date().toLocaleDateString('vi-VN'),
      type,
      amount: Number(amount),
      category,
      note,
      approver,
      proofImg
    };
    this.state.ledger.unshift(entry);
    this.saveState();
    return entry;
  }

  getLedgerBalance() {
    return this.state.ledger.reduce((acc, curr) => {
      return curr.type === 'Thu' ? acc + curr.amount : acc - curr.amount;
    }, 0);
  }

  addKudos({ from, to, message }) {
    const kudo = {
      id: 'KD_' + Date.now(),
      from: from || 'Bạn giấu tên',
      to,
      message,
      date: new Date().toLocaleDateString('vi-VN'),
      likes: 0
    };
    this.state.kudos.unshift(kudo);
    this.saveState();
    return kudo;
  }

  likeKudo(id) {
    const item = this.state.kudos.find(k => k.id === id);
    if (item) {
      item.likes = (item.likes || 0) + 1;
      this.saveState();
      return item.likes;
    }
    return 0;
  }

  getDutySchedule(weekNumber = this.state.currentWeek) {
    const baseRotation = [
      { day: 'Thứ Hai', to: ((weekNumber - 1 + 0) % 4) + 1, tasks: 'Quét phòng học, lau bảng, đổ rác đầu tuần' },
      { day: 'Thứ Ba', to: ((weekNumber - 1 + 1) % 4) + 1, tasks: 'Quét phòng học, chăm sóc chậu hoa cây cảnh' },
      { day: 'Thứ Tư', to: ((weekNumber - 1 + 2) % 4) + 1, tasks: 'Quét lớp, lau cửa sổ, kiểm tra bàn ghế' },
      { day: 'Thứ Năm', to: ((weekNumber - 1 + 3) % 4) + 1, tasks: 'Quét phòng học, lau bảng, đổ rác hành lang' },
      { day: 'Thứ Sáu', to: ((weekNumber - 1 + 0) % 4) + 1, tasks: 'Quét phòng học, vệ sinh góc học tập' },
      { day: 'Thứ Bảy', to: ((weekNumber - 1 + 1) % 4) + 1, tasks: 'Tổng vệ sinh cuối tuần, kiểm tra tắt điện quạt' }
    ];
    return baseRotation;
  }

  exportBackupJSON() {
    return JSON.stringify(this.state, null, 2);
  }

  importBackupJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.students && Array.isArray(data.students)) {
        this.state = data;
        this.saveState();
        return true;
      }
    } catch (e) {
      console.error('Lỗi khi khôi phục dữ liệu từ JSON:', e);
    }
    return false;
  }

  // Trợ giúp tìm học sinh theo Mã (HSxx) hoặc theo Họ tên
  getStudentByIdOrName(identifier) {
    if (!identifier) return null;
    const str = String(identifier).trim().toLowerCase();
    const byId = this.state.students.find(s => s.id && s.id.toLowerCase() === str);
    if (byId) return byId;
    return this.state.students.find(s => s.name && s.name.trim().toLowerCase() === str) || null;
  }

  // Quản lý Sơ đồ Chỗ ngồi Lớp học 9A1
  getSeatingPlan() {
    if (!this.state.seatingPlan || !Array.isArray(this.state.seatingPlan) || this.state.seatingPlan.length !== 4) {
      this.state.seatingPlan = JSON.parse(JSON.stringify(DEFAULT_SEATING_PLAN));
      this.saveState();
    }
    return this.state.seatingPlan;
  }

  saveSeatingPlan(newPlan, actor = 'Giáo viên Chủ nhiệm (Admin)', reason = 'Cập nhật sơ đồ chỗ ngồi') {
    this.state.seatingPlan = newPlan;
    this.state.auditLogs.unshift({
      id: 'LOG_' + Date.now(),
      timestamp: new Date().toLocaleString('vi-VN'),
      actor: actor,
      targetStudent: 'Sơ đồ lớp 9A1',
      action: 'Cập nhật chỗ ngồi',
      reason: reason,
      verified: true
    });
    this.saveState();
  }

  swapSeats(pos1, pos2, actor = 'Giáo viên Chủ nhiệm (Admin)') {
    // pos1, pos2: { dayIdx: 0..3, rowIdx: 0..5, side: 'left' | 'right' }
    const plan = this.getSeatingPlan();
    if (!plan[pos1.dayIdx] || !plan[pos2.dayIdx]) return false;
    
    const val1 = plan[pos1.dayIdx].rows[pos1.rowIdx][pos1.side];
    const val2 = plan[pos2.dayIdx].rows[pos2.rowIdx][pos2.side];

    plan[pos1.dayIdx].rows[pos1.rowIdx][pos1.side] = val2;
    plan[pos2.dayIdx].rows[pos2.rowIdx][pos2.side] = val1;

    const s1 = this.getStudentByIdOrName(val1);
    const s2 = this.getStudentByIdOrName(val2);
    const name1 = s1 ? s1.name : (val1 || 'Bàn trống');
    const name2 = s2 ? s2.name : (val2 || 'Bàn trống');

    this.state.auditLogs.unshift({
      id: 'LOG_' + Date.now(),
      timestamp: new Date().toLocaleString('vi-VN'),
      actor: actor,
      targetStudent: `${name1} ⇋ ${name2}`,
      action: 'Đổi chỗ ngồi học sinh',
      reason: `Đổi vị trí (Dãy ${pos1.dayIdx + 1}, Bàn ${pos1.rowIdx + 1}, ${pos1.side === 'left' ? 'trái' : 'phải'}) với (Dãy ${pos2.dayIdx + 1}, Bàn ${pos2.rowIdx + 1}, ${pos2.side === 'left' ? 'trái' : 'phải'})`,
      verified: true
    });

    this.saveState();
    return true;
  }

  assignStudentToSeat(studentId, targetPos, actor = 'Giáo viên Chủ nhiệm (Admin)') {
    const plan = this.getSeatingPlan();
    if (!plan[targetPos.dayIdx]) return false;

    // Nếu học sinh đã có chỗ ngồi trước đó, xóa khỏi chỗ cũ để không bị trùng
    for (let d = 0; d < 4; d++) {
      for (let r = 0; r < plan[d].rows.length; r++) {
        if (plan[d].rows[r].left === studentId) plan[d].rows[r].left = null;
        if (plan[d].rows[r].right === studentId) plan[d].rows[r].right = null;
      }
    }

    plan[targetPos.dayIdx].rows[targetPos.rowIdx][targetPos.side] = studentId;

    const s = this.getStudentByIdOrName(studentId);
    this.state.auditLogs.unshift({
      id: 'LOG_' + Date.now(),
      timestamp: new Date().toLocaleString('vi-VN'),
      actor: actor,
      targetStudent: s ? s.name : studentId,
      action: 'Chuyển vị trí học sinh',
      reason: `Xếp vào Dãy ${targetPos.dayIdx + 1}, Bàn ${targetPos.rowIdx + 1}, ${targetPos.side === 'left' ? 'ghế trái' : 'ghế phải'}`,
      verified: true
    });

    this.saveState();
    return true;
  }

  resetSeatingPlan(actor = 'Giáo viên Chủ nhiệm (Admin)') {
    this.state.seatingPlan = JSON.parse(JSON.stringify(DEFAULT_SEATING_PLAN));
    this.state.auditLogs.unshift({
      id: 'LOG_' + Date.now(),
      timestamp: new Date().toLocaleString('vi-VN'),
      actor: actor,
      targetStudent: 'Sơ đồ lớp 9A1',
      action: 'Khôi phục sơ đồ gốc',
      reason: 'Đưa toàn bộ vị trí 43 học sinh về mặc định ban đầu theo sơ đồ lớp',
      verified: true
    });
    this.saveState();
    return true;
  }

  resetToDefault() {
    localStorage.removeItem(this.storageKey);
    this.state = this.loadState();
  }
}

// Khởi tạo Singleton Store
const store = new AppStore();
window.store = store;

