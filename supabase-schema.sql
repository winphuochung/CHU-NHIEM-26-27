-- =========================================================================
-- SUPABASE SCHEMA CHO LỚP 9A1 - TRƯỜNG TH & THCS PHƯỚC HƯNG (2026-2027)
-- Dự án Supabase: https://nculyagvcpbbrlfrcbnn.supabase.co
-- Hướng dẫn: Dán vào SQL Editor tại https://supabase.com/dashboard/project/nculyagvcpbbrlfrcbnn/sql/new và bấm RUN
-- =========================================================================

-- 1. BẢNG TRẠNG THÁI TỔNG THỂ (Full App State Store)
CREATE TABLE IF NOT EXISTS public.app_state (
  id TEXT PRIMARY KEY,
  state JSONB NOT NULL,
  meta JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Ho_Chi_Minh', NOW())
);

-- 2. BẢNG 43 HỌC SINH LỚP 9A1
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  stt INT,
  name TEXT NOT NULL,
  gender TEXT,
  dob TEXT,
  "to" INT NOT NULL,
  role TEXT DEFAULT 'Học sinh',
  phone TEXT,
  parent_phone TEXT,
  address TEXT,
  conduct TEXT DEFAULT 'Tốt',
  academic TEXT DEFAULT 'Khá',
  score_avg NUMERIC(3, 1) DEFAULT 8.0,
  conduct_score INT DEFAULT 100,
  badges TEXT[],
  target_high_school JSONB,
  homework_status BOOLEAN DEFAULT true,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Ho_Chi_Minh', NOW())
);

-- 3. BẢNG NHẬT KÝ THI ĐUA 35 TUẦN
CREATE TABLE IF NOT EXISTS public.weekly_emulations (
  week INT PRIMARY KEY,
  theme TEXT,
  status TEXT DEFAULT 'Chưa nộp',
  team_submissions JSONB DEFAULT '{}'::jsonb,
  officer_reviews JSONB DEFAULT '{}'::jsonb,
  gvcn_feedback TEXT,
  submitted_by TEXT,
  approved_at TEXT,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Ho_Chi_Minh', NOW())
);

-- 4. BẢNG KIỂM TOÁN VÀ NHẬT KÝ THAY ĐỔI ĐIỂM
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TEXT,
  actor TEXT,
  target_student TEXT,
  action TEXT,
  reason TEXT,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Ho_Chi_Minh', NOW())
);

-- 5. BẢNG SỔ QUỸ LỚP
CREATE TABLE IF NOT EXISTS public.class_ledger (
  id TEXT PRIMARY KEY,
  date TEXT,
  type TEXT, -- 'Thu' hoặc 'Chi'
  amount NUMERIC(12, 0),
  category TEXT,
  note TEXT,
  approver TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Ho_Chi_Minh', NOW())
);

-- 6. PHÂN QUYỀN ROW LEVEL SECURITY (RLS) - Cho phép đọc và ghi dữ liệu
ALTER TABLE public.app_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_emulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_ledger ENABLE ROW LEVEL SECURITY;

-- Tự động dọn dẹp policy cũ để tránh lỗi trùng lặp khi chạy lại nhiều lần
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public full access on app_state" ON public.app_state;
  DROP POLICY IF EXISTS "Public full access on students" ON public.students;
  DROP POLICY IF EXISTS "Public full access on weekly_emulations" ON public.weekly_emulations;
  DROP POLICY IF EXISTS "Public full access on audit_logs" ON public.audit_logs;
  DROP POLICY IF EXISTS "Public full access on class_ledger" ON public.class_ledger;
END $$;

-- Chính sách công khai cho ứng dụng (Public Policy cho Anon & Authenticated)
CREATE POLICY "Public full access on app_state" ON public.app_state FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on students" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on weekly_emulations" ON public.weekly_emulations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on class_ledger" ON public.class_ledger FOR ALL USING (true) WITH CHECK (true);
