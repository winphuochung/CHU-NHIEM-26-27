# Hệ Thống Quản Lý Lớp Học Kỹ Thuật Số Lớp 9A1 (2026-2027)
## Trường TH & THCS Phước Hưng

Hệ thống quản lý lớp học số toàn diện cho lớp 9A1, tối ưu hóa bằng AI, đồng hành cùng học sinh trong năm cuối cấp THCS và kỳ thi tuyển sinh vào lớp 10 năm 2027.

---

## 🌟 Tính Năng Nổi Bật

### 1. Bảo mật & Phân quyền Đa lớp:
- **GVCN (Admin)**: Dashboard AI phân tích thời gian thực, duyệt báo cáo 1 chạm, sao lưu/khôi phục dữ liệu JSON.
- **Bảo mật 2FA**: Xác thực 2 yếu tố OTP cho tài khoản GVCN.
- **Mã hóa AES-GCM**: Bảo vệ dữ liệu cá nhân nhạy cảm (SĐT phụ huynh, địa chỉ) ngay tại trình duyệt.
- **Audit Log**: Ghi nhận toàn bộ thao tác chấm điểm thi đua để đảm bảo minh bạch, chống can thiệp tùy tiện.
- **Auto-Logout**: Tự động khóa phiên làm việc sau 15 phút không thao tác.

### 2. Thi đua 4.0 & Thông tư 22/2021/TT-BGDĐT:
- Xếp loại rèn luyện (Tốt, Khá, Đạt, Chưa đạt) và học tập chuẩn mực.
- Tự động nhận diện học sinh rơi vào vùng cảnh báo và gửi Push Notification.
- Biểu đồ tiến bộ cá nhân và tập thể 4 tổ.

### 3. Sổ tay Điện tử Ban Cán sự:
- **Lớp trưởng**: Báo cáo tổng hợp tuần 1-chạm tự động từ 4 tổ và các lớp phó.
- **Lớp phó Học tập**: Quản lý nhóm học tập tương trợ (Đôi bạn cùng tiến), theo dõi nộp bài tập.
- **Lớp phó Trật tự**: Ghi nhận vi phạm, đính kèm ảnh bằng chứng trực tiếp.
- **Lớp phó Lao động**: Sơ đồ phân công trực nhật động xoay vòng tuần hoàn (Thứ 2 - Thứ 7), nhắc việc sáng sớm.
- **Thủ quỹ**: Sổ thu chi kỹ thuật số (E-Ledger), quét hóa đơn OCR tự động nhận diện số tiền, minh bạch ngân sách.
- **Tổ trưởng (1 - 4)**: Giám sát thành viên tổ, đề xuất "Gương sáng tuần" trực tiếp lên GVCN.

### 4. Hướng nghiệp & Luyện thi Tuyển sinh Vào 10:
- Đồng hồ đếm ngược từng giây đến kỳ thi Tuyển sinh 10 năm 2027.
- Kho đề thi thử Toán, Ngữ văn, Tiếng Anh có bấm giờ, chấm điểm tự động và lời giải chi tiết.
- Quản lý và thống kê 3 nguyện vọng vào các trường THPT công lập & chuyên trên địa bàn.

### 5. Gamification & Cộng đồng Học đường:
- Hệ thống danh hiệu & huy hiệu ảo: *Chiến binh chuyên cần*, *Đại sứ học tập*, *Cây sáng kiến*, *Dũng sĩ trực nhật*, *Ngôi sao tiến bộ*.
- Cửa hàng đặc quyền lớp học (Class Perk Shop): Dùng điểm thi đua đổi quyền ưu tiên chọn chỗ ngồi, miễn trực nhật...
- 35 Mini-games theo tuần (Tuần 1 đến Tuần 35) bao quát kiến thức và kỹ năng sống lớp 9.
- Góc sẻ chia Kudos: Gửi lời cảm ơn, động viên ẩn danh có bộ lọc từ ngữ văn minh.

### 6. Trợ lý Ảo Giọng Nói (Voice AI):
- Nhận diện giọng nói tiếng Việt (Web Speech API) tra cứu nhanh lịch trực nhật hôm nay, đếm ngược thi vào 10, nội quy trường Phước Hưng.

### 7. Đồng bộ Hai chiều Google Sheets & Google Forms:
- Kịch bản Google Apps Script tích hợp sẵn trong thư mục `google-apps-script/Code.gs`.
- Tự động nhận dữ liệu nộp bài từ Google Forms đổ về hồ sơ cá nhân học sinh.

---

## 🚀 Hướng Dẫn Khởi Chạy

### Cách 1: Chạy bằng Python Local Server
Mở terminal trong thư mục dự án và chạy:
```powershell
python server.py
```
Trình duyệt sẽ tự động mở địa chỉ: `http://localhost:8080/index.html`

### Cách 2: Mở trực tiếp trình duyệt
Do ứng dụng được xây dựng theo chuẩn PWA Client-side độc lập hoàn toàn, bạn chỉ cần nhấp đúp chuột vào tệp `index.html` để sử dụng ngay lập tức mà không cần cài đặt thêm phần mềm nào.

### Cách 3: Cài đặt PWA lên Điện thoại hoặc Máy tính
1. Mở ứng dụng trên trình duyệt Chrome / Edge / Safari.
2. Nhấn vào biểu tượng **"Cài đặt ứng dụng"** (Install App) trên thanh địa chỉ hoặc nút trong ứng dụng.
3. Ứng dụng sẽ xuất hiện trên màn hình chính và hoạt động mượt mà ngay cả khi không có kết nối Internet.

---

## 📁 Cấu Trúc Mã Nguồn

```
CHU-NHIEM-26-27/
├── index.html                   # Giao diện chính của PWA (Multi-roles & Responsive)
├── manifest.json                # PWA Manifest cấu hình App Icon & chế độ Standalone
├── sw.js                        # Service Worker caching & chạy Offline
├── server.py                    # Server Python phục vụ cục bộ
├── css/
│   └── app.css                  # Tùy biến Tailwind, tông màu xanh Phước Hưng & Dark Mode
├── js/
│   ├── store.js                 # State & Database 42 học sinh, nội quy, quỹ, mini-games
│   ├── auth.js                  # Phân quyền 6 cấp, 2FA OTP, Auto-logout idle
│   ├── security.js              # Mã hóa AES-GCM và kiểm tra toàn vẹn Audit Log
│   ├── ai-analytics.js          # Phân tích xu hướng AI, Thông tư 22, gợi ý sư phạm
│   ├── workspaces.js            # Không gian làm việc số cho từng chức danh Ban cán sự
│   ├── exam-hub.js              # Đếm ngược thi vào 10, thi thử trực tuyến, nguyện vọng
│   ├── gamification.js          # BXH, Huy hiệu, Class Perks, 35 Mini-games, Kudos
│   ├── sync-hub.js              # Đồng bộ Google Sheets / Forms, Xuất CSV
│   └── voice-assistant.js       # Trợ lý giọng nói tiếng Việt Web Speech
├── google-apps-script/
│   └── Code.gs                  # Kịch bản Apps Script kết nối Google Sheets 2 chiều
└── assets/
    └── logo.png                 # Logo nhận diện thương hiệu trường Phước Hưng & 9A1
```
