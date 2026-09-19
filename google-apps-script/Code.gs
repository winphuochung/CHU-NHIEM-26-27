/**
 * Google Apps Script - Đồng bộ 2 chiều Hệ thống Quản lý Lớp 9A1 Phước Hưng
 * Trường TH & THCS Phước Hưng (Năm học 2026-2027)
 * 
 * Hướng dẫn cài đặt:
 * 1. Mở Google Sheets chứa danh sách lớp 9A1
 * 2. Vào Tiện ích mở rộng (Extensions) > Apps Script
 * 3. Dán toàn bộ mã nguồn này vào Code.gs và Lưu lại
 * 4. Nhấn "Triển khai" (Deploy) > "Triển khai mới" (New deployment) > Loại: "Ứng dụng web" (Web app)
 * 5. Cấp quyền truy cập: "Bất kỳ ai" (Anyone) để App có thể đồng bộ không cần đăng nhập Google phức tạp.
 */

// Xử lý yêu cầu GET: Trả về toàn bộ danh sách học sinh và điểm thi đua từ Google Sheets
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DanhSach9A1") || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);

    const students = rows.map(function(row) {
      return {
        id: row[0],
        stt: row[1],
        name: row[2],
        to: row[3],
        conductScore: row[4],
        conduct: row[5],
        academic: row[6],
        scoreAvg: row[7],
        homeworkStatus: row[8] === "Đã nộp" || row[8] === true,
        notes: row[9] || ""
      };
    });

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      school: "TH & THCS Phước Hưng",
      class: "9A1",
      updatedAt: new Date().toISOString(),
      students: students
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Xử lý yêu cầu POST: Nhận dữ liệu chấm điểm từ App hoặc Google Forms nộp bài nạp vào Sheet
function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DanhSach9A1") || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (action === "updateEmulation") {
      // Cập nhật điểm thi đua cho học sinh
      const studentId = postData.studentId;
      const pointDelta = Number(postData.pointDelta);
      const data = sheet.getDataRange().getValues();

      for (let i = 1; i < data.length; i++) {
        if (data[i][0] == studentId) {
          const currentScore = Number(data[i][4]) || 100;
          const newScore = Math.max(0, Math.min(100, currentScore + pointDelta));
          sheet.getRange(i + 1, 5).setValue(newScore); // Cột điểm rèn luyện

          // Ghi nhật ký vào sheet AuditLog
          logToAuditSheet(data[i][2], postData.actor, pointDelta, postData.reason);
          break;
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Đã cập nhật vào Google Sheet" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "formSubmitHomework") {
      // Tự động phân loại từ Google Form nộp bài tập về nhà
      const studentName = postData.studentName;
      const subject = postData.subject;
      const data = sheet.getDataRange().getValues();

      for (let i = 1; i < data.length; i++) {
        if (data[i][2].toString().toLowerCase() === studentName.toLowerCase()) {
          sheet.getRange(i + 1, 9).setValue("Đã nộp"); // Cột trạng thái bài tập
          break;
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Đã ghi nhận bài tập về nhà" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "ignored", message: "Hành động không xác định" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm ghi lịch sử Audit vào Sheet AuditLog
function logToAuditSheet(studentName, actor, pointDelta, reason) {
  let auditSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("AuditLog");
  if (!auditSheet) {
    auditSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("AuditLog");
    auditSheet.appendRow(["Thời gian", "Người thực hiện", "Học sinh", "Thay đổi", "Lý do"]);
  }
  auditSheet.appendRow([new Date(), actor, studentName, pointDelta > 0 ? "+" + pointDelta : pointDelta, reason]);
}
