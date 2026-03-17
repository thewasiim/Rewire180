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

-- Disable RLS (Row Level Security) so our service_role key works freely
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Allow full access for service_role
CREATE POLICY "Service role full access" ON admin FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON analytics FOR ALL USING (true) WITH CHECK (true);
