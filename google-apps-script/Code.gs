/**
 * Google Apps Script - Dong bo 2 chieu He thong Quan ly Lop 9A1 Phuoc Hung
 * Truong TH va THCS Phuoc Hung (Nam hoc 2026-2027)
 * 
 * Huong dan:
 * Cach 1 (Khuyen dung): Mo Google Sheet cua lop > Tien ich mo rong > Apps Script > Dan ma nay vao.
 * Cach 2: Neu tao script doc lap, hay dien ID Google Sheet vao bien SPREADSHEET_ID ben duoi:
 */

var SPREADSHEET_ID = ''; 

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

function doGet(e) {
  try {
    var ss = getTargetSpreadsheet(e);
    if (!ss) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Chua tim thay Google Sheet! Vui long mo truc tiep Google Sheet danh sach lop 9A1 roi chon Tien ich mo rong > Apps Script de trien khai; hoac dien ID Google Sheet vao bien SPREADSHEET_ID trong Code.gs.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = ss.getSheetByName('DanhSach9A1') || ss.getActiveSheet();
    var data = sheet.getDataRange().getValues();

    if (!data || data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        school: 'TH & THCS Phuoc Hung',
        class: '9A1',
        updatedAt: new Date().toISOString(),
        students: [],
        message: 'Bang tinh chua co du lieu hoc sinh.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var rows = data.slice(1);
    var students = rows.map(function(row) {
      return {
        id: row[0] || '',
        stt: row[1] || '',
        name: row[2] || '',
        to: row[3] || '',
        conductScore: Number(row[4]) || 100,
        conduct: row[5] || 'Tot',
        academic: row[6] || 'Tot',
        scoreAvg: Number(row[7]) || 0,
        homeworkStatus: row[8] === 'Da nop' || row[8] === true,
        notes: row[9] || ''
      };
    });

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      school: 'TH & THCS Phuoc Hung',
      class: '9A1',
      updatedAt: new Date().toISOString(),
      totalStudents: students.length,
      students: students
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var ss = getTargetSpreadsheet(e);
    if (!ss) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Chua tim thay Google Sheet lien ket.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var postData = JSON.parse(e.postData.contents);
    var action = postData.action;
    var sheet = ss.getSheetByName('DanhSach9A1') || ss.getActiveSheet();

    if (action === 'updateEmulation') {
      var studentId = postData.studentId;
      var pointDelta = Number(postData.pointDelta);
      var data = sheet.getDataRange().getValues();

      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == studentId) {
          var currentScore = Number(data[i][4]) || 100;
          var newScore = Math.max(0, Math.min(120, currentScore + pointDelta));
          sheet.getRange(i + 1, 5).setValue(newScore);

          logToAuditSheet(ss, data[i][2], postData.actor, pointDelta, postData.reason);
          break;
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Da cap nhat diem vao Google Sheet!' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'formSubmitHomework') {
      var studentName = postData.studentName;
      var data = sheet.getDataRange().getValues();

      for (var i = 1; i < data.length; i++) {
        if (data[i][2] && data[i][2].toString().toLowerCase() === studentName.toLowerCase()) {
          sheet.getRange(i + 1, 9).setValue('Da nop');
          break;
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Da ghi nhan bai tap vao Google Sheet!' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'ignored', message: 'Hanh dong khong xac dinh' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function logToAuditSheet(ss, studentName, actor, pointDelta, reason) {
  var auditSheet = ss.getSheetByName('AuditLog');
  if (!auditSheet) {
    auditSheet = ss.insertSheet('AuditLog');
    auditSheet.appendRow(['Thoi gian', 'Nguoi thuc hien', 'Hoc sinh', 'Thay doi', 'Ly do']);
  }
  auditSheet.appendRow([new Date(), actor, studentName, pointDelta > 0 ? '+' + pointDelta : pointDelta, reason]);
}
