-- ═══════════════════════════════════════════════════════════
-- Rewire180 — Supabase Database Setup
-- Run this in the Supabase SQL Editor (one time only)
-- ═══════════════════════════════════════════════════════════

-- Admin table
CREATE TABLE IF NOT EXISTS admin (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT,
  reset_token TEXT,
  reset_token_expiry BIGINT
);

-- Content table
CREATE TABLE IF NOT EXISTS content (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  type TEXT,
  label TEXT,
  section TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  ip TEXT,
  user_agent TEXT,
  page TEXT DEFAULT '/',
  referrer TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Drop old insecure policies (USING true = anyone can read/write!)
DROP POLICY IF EXISTS "Service role full access" ON admin;
DROP POLICY IF EXISTS "Service role full access" ON content;
DROP POLICY IF EXISTS "Service role full access" ON analytics;

-- Secure policies: ONLY service_role can access (our backend uses service_role key)
-- This blocks anon/authenticated roles from direct Supabase access
CREATE POLICY "service_role_admin" ON admin FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "service_role_content" ON content FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "service_role_analytics" ON analytics FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
