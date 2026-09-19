#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Local HTTP Server cho Hệ thống Quản lý Lớp học Kỹ thuật số Lớp 9A1
Trường TH & THCS Phước Hưng (2026 - 2027)
"""

import http.server
import socketserver
import webbrowser
import os
import sys

# Đảm bảo in tiếng Việt không bị lỗi Unicode trên Windows cmd / PowerShell
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

PORT = 8080

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Thêm header hỗ trợ PWA và CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def guess_type(self, path):
        content_type = super().guess_type(path)
        if path.endswith('.js'):
            return 'application/javascript; charset=utf-8'
        elif path.endswith('.json') or path.endswith('.webmanifest'):
            return 'application/json; charset=utf-8'
        elif path.endswith('.css'):
            return 'text/css; charset=utf-8'
        return content_type

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        url = f"http://localhost:{PORT}/index.html"
        print("=" * 70)
        print(" TRƯỜNG TH & THCS PHƯỚC HƯNG - LỚP 9A1 (2026 - 2027)")
        print(" HỆ THỐNG QUẢN LÝ LỚP HỌC KỸ THUẬT SỐ TOÀN DIỆN")
        print("=" * 70)
        print(f" Máy chủ đang chạy tại: {url}")
        print(" Nhấn Ctrl+C để dừng máy chủ.")
        print("=" * 70)
        
        try:
            webbrowser.open(url)
        except Exception:
            pass

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nĐã dừng máy chủ thành công.")
            sys.exit(0)

if __name__ == "__main__":
    main()
