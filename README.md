# 🤖 AI Tools Hub — Full Stack App

React + React Router 6 + Node.js/Express + MySQL

---

## 📁 Project Structure

```
ai_tools_hub/
├── database/
│   └── schema.sql          ← Run this first in MySQL
├── backend/
│   ├── config/
│   │   └── db.js           ← MySQL connection pool
│   ├── middleware/
│   │   └── auth.js         ← JWT auth middleware
│   ├── routes/
│   │   ├── auth.js         ← Register / Login / Profile routes
│   │   └── tools.js        ← Tools & Categories API routes
│   ├── .env                ← Edit with your DB credentials
│   ├── package.json
│   └── server.js           ← Express entry point
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js   ← Global auth state
    │   ├── components/
    │   │   ├── Navbar.js/.css
    │   │   ├── ToolCard.js/.css
    │   │   ├── Modal.js/.css
    │   │   └── Footer.js/.css
    │   ├── pages/
    │   │   ├── Home.js/.css     ← Main hub page
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Profile.js/.css
    │   │   └── AuthPages.css
    │   ├── data/
    │   │   └── toolsData.js     ← All AI tools data
    │   ├── styles/
    │   │   └── global.css
    │   ├── App.js               ← React Router setup
    │   └── index.js
    └── package.json
```

---

## 🚀 Setup Instructions

### 1. MySQL Database

```bash
# Open MySQL and run:
mysql -u root -p
source /path/to/ai_tools_hub/database/schema.sql
```

### 2. Backend Setup

```bash
cd ai_tools_hub/backend

# Install dependencies
npm install

# Edit .env with your MySQL credentials
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=ai_tools_hub
# JWT_SECRET=change_this_to_a_random_string

# Start backend
npm run dev        # development (nodemon)
npm start          # production
```

Backend runs on: http://localhost:5000

### 3. Frontend Setup

```bash
cd ai_tools_hub/frontend

# Install dependencies
npm install

# Start React app
npm start
```

Frontend runs on: http://localhost:3000  
(proxy to backend is already configured in package.json)

---

## 🔌 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user (🔐) |
| PUT | /api/auth/profile | Update profile (🔐) |
| PUT | /api/auth/change-password | Change password (🔐) |

### Tools
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/tools | List all tools |
| GET | /api/tools/categories | List categories |
| GET | /api/tools/:id | Single tool |
| POST | /api/tools/:id/bookmark | Bookmark tool (🔐) |
| DELETE | /api/tools/:id/bookmark | Remove bookmark (🔐) |
| GET | /api/tools/user/bookmarks | My bookmarks (🔐) |

🔐 = Requires `Authorization: Bearer <token>` header

---

## 📦 Tech Stack

- **Frontend**: React 18, React Router 6, CSS Modules
- **Backend**: Node.js, Express 4
- **Database**: MySQL 8 with mysql2 driver
- **Auth**: JWT + bcryptjs
- **Fonts**: Syne + DM Sans (Google Fonts)
