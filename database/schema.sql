-- AI Tools Hub Database Schema
-- Run this file in MySQL to set up the database

CREATE DATABASE IF NOT EXISTS ai_tools_hub;
USE ai_tools_hub;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  avatar_url VARCHAR(255),
  bio TEXT,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tool categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  icon VARCHAR(10) NOT NULL,
  color VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Tools table
CREATE TABLE IF NOT EXISTS tools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  about TEXT,
  url VARCHAR(255),
  tool_type ENUM('free', 'paid', 'both') DEFAULT 'both',
  tags JSON,
  steps JSON,
  tips JSON,
  youtube_links JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- User bookmarks / saved tools
CREATE TABLE IF NOT EXISTS bookmarks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tool_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_bookmark (user_id, tool_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE
);

-- User sessions (optional; JWT is used but this tracks active sessions)
CREATE TABLE IF NOT EXISTS user_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed: Categories
INSERT INTO categories (title, icon, color) VALUES
('Chatbots & AI Assistants', '🤖', '#0f1520'),
('Data Analysis & Visualization', '📊', '#120f1f'),
('Video Generation & Editing', '🎬', '#1a0f0f'),
('AI Writing & Content', '✍️', '#0f1a10'),
('Photo Making & Editing', '🖼️', '#0e1f14'),
('Making Full Websites', '🌐', '#0e1520'),
('Presentations & Slides', '📽️', '#1a100a'),
('UI/UX & Graphic Design', '🎨', '#1a0e1a'),
('SEO & Digital Marketing', '🔍', '#0a1a15'),
('Music & Audio AI', '🎵', '#1a0f12'),
('Coding & Development', '💻', '#0e1520'),
('Research & Productivity', '⚡', '#101a10'),
('3D & Animation', '🎮', '#0f0f1a');

-- Seed: Sample tools (first few)
INSERT INTO tools (category_id, name, description, about, url, tool_type, tags, steps, tips) VALUES
(1, 'ChatGPT', 'Most powerful AI chatbot. Handles writing, coding, analysis, math, research & more.', 
'ChatGPT by OpenAI is the world most popular AI assistant. GPT-4o is the latest model available on the free tier.',
'https://chat.openai.com', 'both',
'["AI","Chatbot","Writing","Coding","Free"]',
'["Go to chat.openai.com and sign up for free","Type your first question clearly","Use GPT-4o free tier for most tasks","Create Custom GPTs for specialized tasks"]',
'["Use system prompts for better context","Ask it to explain code line by line","Paste error messages directly"]'),

(1, 'Claude AI', 'Best AI for long-form writing. Exceptionally natural tone, 200K context, deep analysis.', 
'Claude by Anthropic is the best AI for writing that sounds genuinely human.',
'https://claude.ai', 'both',
'["AI","Writing","Analysis","Long-form","Free"]',
'["Go to claude.ai and sign up","Paste your draft and ask it to improve","Use for long document analysis","Ask for SEO blog posts with subheadings"]',
'["Better than ChatGPT for long-form writing","Upload PDFs for specific questions","Content more likely to pass AI detection"]'),

(1, 'Gemini', 'Google AI with real-time internet access. Best for research, current events & Google integration.',
'Gemini Ultra by Google is the most powerful version, multimodal, real-time web access.',
'https://gemini.google.com', 'both',
'["AI","Google","Research","Multimodal","Free"]',
'["Go to gemini.google.com and sign in with Google","Enable Google Search grounding for real-time info","Use for current events and news research","Upload images and ask questions about them"]',
'["Only AI with real-time internet for free","Integrates with Google Docs and Gmail","Use Gemini Advanced for coding projects"]');
