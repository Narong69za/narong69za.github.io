-- =========================================
-- SN DESIGN STUDIO ULTRA DATABASE INIT
-- FULL VERSION
-- =========================================


-- ===============================
-- USERS
-- ===============================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    username TEXT,
    role VARCHAR(50) DEFAULT 'user',
    vip_level INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ===============================
-- USER CREDITS
-- ===============================
CREATE TABLE IF NOT EXISTS user_credits (
    user_id UUID PRIMARY KEY,
    credits INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ===============================
-- CREDIT TRANSACTIONS
-- ===============================
CREATE TABLE IF NOT EXISTS credit_transactions (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    amount INTEGER,
    type VARCHAR(50), -- add / use / refund
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ===============================
-- FREE DAILY LIMIT (3 ครั้ง/IP)
-- ===============================
CREATE TABLE IF NOT EXISTS free_usage_ip (
    id SERIAL PRIMARY KEY,
    ip_address VARCHAR(100),
    used_count INTEGER DEFAULT 0,
    last_used DATE DEFAULT CURRENT_DATE
);


-- ===============================
-- JOBS (AI TASK)
-- ===============================
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    engine VARCHAR(100),
    alias VARCHAR(100),
    type VARCHAR(50),
    prompt TEXT,
    task_id VARCHAR(255),
    status VARCHAR(50),
    output_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ===============================
-- RESULT DELIVERY
-- ===============================
CREATE TABLE IF NOT EXISTS job_results (
    id SERIAL PRIMARY KEY,
    job_id INTEGER,
    result_url TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
