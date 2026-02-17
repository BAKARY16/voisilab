-- Migration script for innovations table
-- This adds all the fields needed for the full innovation management

-- Add new columns if they don't exist
ALTER TABLE innovations
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS creator_name VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS creator_email VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS tags JSON DEFAULT NULL,
ADD COLUMN IF NOT EXISTS status ENUM('draft', 'pending', 'published', 'archived') DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS likes INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS views INT DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_innovations_status ON innovations(status);
CREATE INDEX IF NOT EXISTS idx_innovations_category ON innovations(category);
CREATE INDEX IF NOT EXISTS idx_innovations_published ON innovations(is_published);
CREATE INDEX IF NOT EXISTS idx_innovations_featured ON innovations(is_featured);
CREATE INDEX IF NOT EXISTS idx_innovations_created ON innovations(created_at);
