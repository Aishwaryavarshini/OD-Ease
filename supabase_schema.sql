-- ============================================================
-- ODFlow Production Supabase Schema Migration: od_applications
-- ============================================================

CREATE TABLE IF NOT EXISTS public.od_applications (
  id TEXT PRIMARY KEY,
  studentId TEXT,
  studentName TEXT,
  registerNumber TEXT,
  department TEXT,
  year TEXT,
  mentorName TEXT,
  mentorEmail TEXT,
  studentEmail TEXT,
  fromDate TEXT,
  toDate TEXT,
  fromTime TEXT,
  toTime TEXT,
  event TEXT,
  venue TEXT,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'Pending Mentor Approval',
  isFullDay BOOLEAN DEFAULT true,
  isMultipleDays BOOLEAN DEFAULT false,
  approvals JSONB DEFAULT '{}'::jsonb,
  approvalHistory JSONB DEFAULT '[]'::jsonb,
  rejectionReason TEXT,
  directApproval BOOLEAN DEFAULT false,
  directApprovedBy TEXT,
  directApprovalTimestamp BIGINT,
  supportingDocumentName TEXT,
  supportingDocumentKey TEXT,
  supportingDocumentData TEXT,
  timestamp BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.od_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow anonymous read" ON public.od_applications;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.od_applications;
DROP POLICY IF EXISTS "Allow anonymous update" ON public.od_applications;
DROP POLICY IF EXISTS "Allow full access to od_applications" ON public.od_applications;

-- Create policy allowing all operations for authenticated and anon users (domain role checks handled in app)
CREATE POLICY "Allow full access to od_applications"
  ON public.od_applications
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable Realtime for od_applications table
ALTER PUBLICATION supabase_realtime ADD TABLE public.od_applications;

-- ============================================================
-- ODFlow Production Supabase Schema Migration: master_students
-- ============================================================

CREATE TABLE IF NOT EXISTS public.master_students (
  registerNumber TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  gender TEXT,
  year TEXT NOT NULL,
  department TEXT NOT NULL,
  mentorName TEXT NOT NULL,
  mentorEmail TEXT NOT NULL,
  ccName TEXT,
  ccEmail TEXT,
  coCcName TEXT,
  coCcEmail TEXT,
  studentEmail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.master_students ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow full access to master_students" ON public.master_students;

-- Create policy allowing all operations for authenticated and anon users
CREATE POLICY "Allow full access to master_students"
  ON public.master_students
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable Realtime for master_students table
ALTER PUBLICATION supabase_realtime ADD TABLE public.master_students;

-- ============================================================
-- ODFlow Production Supabase Schema Migration: master_staff
-- ============================================================

CREATE TABLE IF NOT EXISTS public.master_staff (
  email TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  year TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.master_staff ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow full access to master_staff" ON public.master_staff;

-- Create policy allowing all operations for authenticated and anon users
CREATE POLICY "Allow full access to master_staff"
  ON public.master_staff
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable Realtime for master_staff table
ALTER PUBLICATION supabase_realtime ADD TABLE public.master_staff;


