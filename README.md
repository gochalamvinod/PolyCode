# PolyCode — AI-Powered Multi-Language Programming Code Converter

PolyCode is a modern, developer-focused web application that translates source code across multiple programming languages (**Java, Python, C, C++, and JavaScript**) while preserving original program logic, algorithms, control flow, and data structures.

Built strictly on the **MERN stack** (MongoDB, Express.js, React.js, Node.js) with Tailwind CSS, Monaco Editor, Lucide icons, and a pluggable AI adapter layer.

---

## 🌟 Key Features

- **Multi-Language Bidirectional Translation**: Convert code in any direction between Java, Python, C, C++, and JavaScript.
- **Semantic Logic & Idiom Preservation**: Maps static and dynamic types accurately, preserves algorithm complexity, and adheres to target language canonical style conventions (e.g., PEP 8 for Python, Modern STL for C++, ES6+ for JavaScript).
- **Two-Panel Responsive Monaco Workspace**: VS Code-grade code editor experience with real-time syntax highlighting, line numbers, automatic bracket matching, code folding, sample loading, file uploads, and full-screen view.
- **Provider-Independent AI Integration**: Configurable adapter supporting **Google Gemini**, **Groq**, **OpenAI**, **Anthropic**, **Ollama (local offline)**, or any OpenAI-compatible API.
- **Deep Explanations & Disclosures**: Every conversion provides an itemized breakdown of semantic changes, architectural adjustments, potential edge cases, limitations, and heuristic bracket syntax balance checks.
- **Conversion Settings & Custom Directives**: Tailor conversion styles (*Idiomatic*, *Preserve Structure*, *Simple & Clean*), explanation detail (*Detailed*, *With Explanations*, *Basic*), algorithm strictness, and inline commenting.
- **User Authentication & Session Persistence**: Complete registration and login system with JWT stored in secure HttpOnly cookies, bcrypt password hashing, and user profile preferences.
- **Conversion History**: Automatically saves authenticated conversions with full-text search, language pair filtering, sorting, code preview modal, deletion, and 1-click **"Reuse in Editor"**.
- **Saved Projects Management**: Organize, tag, document, edit, and reopen important conversions independently from transient history.
- **Production Hardened Security**: Helmet headers, granular CORS origin whitelisting, Express rate-limiting, Zod schema validation, and zero execution of untrusted user code via `eval` or shell processes.

---

## 🛠️ Technology Stack

### Frontend
- **React.js 18** with **Vite**
- **Tailwind CSS** (Custom dark/light themes, slate/indigo styling)
- **@monaco-editor/react** (VS Code code engine)
- **React Router DOM 6**
- **Axios** (With error interceptors & credentials)
- **Lucide React** (Modern developer iconography)
- **Context API** (AuthContext, ThemeContext, ToastContext)

### Backend
- **Node.js 26+** (ES Modules: `"type": "module"`)
- **Express.js 4**
- **MongoDB** & **Mongoose 8**
- **JWT (jsonwebtoken)** & **bcryptjs**
- **Cookie-Parser**, **CORS**, **Helmet**, **Express Rate Limit**
- **Zod 3** for strict schema validation
- **Axios** for AI provider communication

---

## 🏗️ Architecture Overview

```
PolyCode/
├── client/                      # React Frontend (Vite + Tailwind + Monaco)
│   ├── public/logo.svg          # Application vector branding
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Button, Modal, Loader, ProtectedRoute
│   │   │   ├── conversion/      # Controls, Results, Explanations, Warnings, Settings
│   │   │   ├── editor/          # CodeEditor, SourceEditor, TargetEditor, Toolbars
│   │   │   └── layout/          # Navbar, Footer
│   │   ├── config/              # Central language configurations & samples
│   │   ├── context/             # AuthContext, ThemeContext, ToastContext
│   │   ├── pages/               # Dashboard, History, Projects, Docs, Login, Register
│   │   ├── services/            # Axios API wrappers (auth, conversion, projects)
│   │   ├── App.jsx              # App routes & provider nesting
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Tailwind directives & custom scrollbars
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                      # Express Backend
│   ├── config/
│   │   ├── aiConfig.js          # Pluggable AI provider configuration
│   │   ├── db.js                # MongoDB Mongoose connection
│   │   └── languages.js         # Supported languages, Monaco IDs, rules & samples
│   ├── controllers/             # Auth, Conversion, Project, Language, Health
│   ├── middleware/              # Auth (JWT/Cookie), RateLimit, Error, Validation
│   ├── models/                  # User, Conversion, SavedProject (Mongoose schemas)
│   ├── routes/                  # Express route definitions under /api/v1/
│   ├── services/
│   │   ├── aiService.js         # Provider adapter (Gemini, OpenAI, Groq, Ollama)
│   │   ├── conversionService.js # End-to-end conversion orchestrator
│   │   ├── promptService.js     # System & user prompt builder with settings
│   │   └── validatorService.js  # Heuristic syntax checks & input guards
│   ├── utils/                   # ApiError, ApiResponse standards
│   ├── validators/              # Zod schemas (auth, conversions, projects)
│   ├── app.js                   # Express application setup
│   ├── server.js                # Server entry point
│   ├── package.json
│   └── .env.example
├── .gitignore
├── package.json                 # Monorepo scripts
└── README.md
```

---

## 📋 Prerequisites

- **Node.js**: `v18.0.0` or higher (Tested on Node `v26.3.0`)
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI
- **AI Provider API Key**: Free tier Google Gemini key, Groq API key, or OpenAI API key.

---

## 🚀 Quick Setup & Installation

### 1. Clone & Enter Project Directory
```powershell
cd C:\Users\gocha\Desktop\PolyCode
```

### 2. Install Dependencies
```powershell
# Install root, backend, and frontend dependencies
npm --prefix server install
npm --prefix client install
```

### 3. Configure Environment Variables
Copy `.env.example` in `server/` to `server/.env`:
```powershell
Copy-Item server\.env.example server\.env
```

Open `server/.env` and configure your settings:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/polycode
JWT_SECRET=polycode_secret_development_jwt_key_2026_super_secure
JWT_EXPIRES_IN=7d

# AI Provider Configuration
# Options: gemini | openai | groq | anthropic | ollama | custom
AI_PROVIDER=gemini
AI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-1.5-flash
AI_BASE_URL=

MAX_CODE_LENGTH=50000
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

> **Note**: If `AI_API_KEY` is not set, the application returns a clear, helpful `503 Service Unavailable` configuration error detailing how to add the key. It **never generates fake conversion results**.

---

## 🏃 Running the Application

### Option A: Development Mode (Vite Hot Reload + Express Backend)

In terminal 1 (Backend):
```powershell
npm --prefix server run dev
```

In terminal 2 (Frontend):
```powershell
npm --prefix client run dev
```
Open your browser at: **`http://localhost:5173`** (API requests are automatically proxied to `:5000`).

### Option B: Unified Production Server (Express serves built client)

```powershell
# 1. Build client assets
npm --prefix client run build

# 2. Start server
npm --prefix server start
```
Open your browser at: **`http://localhost:5000`**.

---

## 🤖 Supported AI Providers

PolyCode's adapter layer (`server/services/aiService.js`) dynamically routes requests based on `AI_PROVIDER`:

| Provider | Environment Values | Notes |
| :--- | :--- | :--- |
| **Google Gemini** *(Default)* | `AI_PROVIDER=gemini`<br>`AI_MODEL=gemini-1.5-flash`<br>`AI_API_KEY=AIza...` | Native JSON mode supported via Google AI Studio |
| **Groq Cloud** | `AI_PROVIDER=groq`<br>`AI_MODEL=llama-3.3-70b-versatile`<br>`AI_API_KEY=gsk_...` | Ultra-fast sub-second translations |
| **OpenAI** | `AI_PROVIDER=openai`<br>`AI_MODEL=gpt-4o-mini`<br>`AI_API_KEY=sk-...` | Canonical JSON mode |
| **Anthropic Claude** | `AI_PROVIDER=anthropic`<br>`AI_MODEL=claude-3-5-sonnet-20241022`<br>`AI_API_KEY=sk-ant-...` | Deep reasoning for complex conversions |
| **Ollama (Offline Local)** | `AI_PROVIDER=ollama`<br>`AI_MODEL=codellama`<br>`AI_BASE_URL=http://localhost:11434/v1/chat/completions` | No API key required; runs locally |

---

## 🌐 API Reference

All responses conform to a standardized JSON schema:

**Success Response (`200 OK` / `201 Created`):**
```json
{
  "success": true,
  "message": "Code converted successfully",
  "data": { ... }
}
```

**Error Response (`4xx` / `5xx`):**
```json
{
  "success": false,
  "message": "AI Provider 'gemini' is not configured...",
  "error": {
    "code": "AI_PROVIDER_NOT_CONFIGURED",
    "details": { ... }
  }
}
```

### Endpoints:
- `GET /api/v1/health` — Checks database connectivity, server uptime, and AI provider configuration status.
- `GET /api/v1/languages` — Returns central matrix of supported languages, capabilities, and Monaco identifiers.
- `POST /api/v1/auth/register` — Creates user account with password hashing (bcrypt) and signs JWT cookie.
- `POST /api/v1/auth/login` — Authenticates user credentials and issues secure HttpOnly JWT.
- `POST /api/v1/auth/logout` — Clears authentication cookie.
- `GET /api/v1/auth/me` — Retrieves current user profile (`[Protected]`).
- `PUT /api/v1/auth/me` — Updates user preferences (preferred languages, theme) (`[Protected]`).
- `POST /api/v1/conversions` — Converts source code to target language (Guest or Authenticated).
- `GET /api/v1/conversions` — Retrieves paginated conversion history with search and filters (`[Protected]`).
- `GET /api/v1/conversions/:id` — Retrieves specific conversion record (`[Protected]`).
- `DELETE /api/v1/conversions/:id` — Deletes conversion record (`[Protected]`).
- `POST /api/v1/projects` — Saves a conversion as a named project with tags (`[Protected]`).
- `GET /api/v1/projects` — Lists saved projects with search and pagination (`[Protected]`).
- `GET /api/v1/projects/:id` — Retrieves single saved project (`[Protected]`).
- `PUT /api/v1/projects/:id` — Updates project title, description, tags, or code (`[Protected]`).
- `DELETE /api/v1/projects/:id` — Deletes saved project (`[Protected]`).

---

## 🛡️ Security Design

1. **Untrusted Code Isolation**: User source code and AI-generated outputs are treated as untrusted data strings. PolyCode strictly avoids `eval()`, unrestricted `child_process`, or arbitrary shell calls.
2. **HttpOnly Authentication**: JWT tokens are issued with `HttpOnly`, `SameSite: Lax` (or `None` in production with HTTPS) to prevent XSS credential theft.
3. **Helmet HTTP Headers**: Guard against MIME-sniffing, clickjacking, and script injection.
4. **Rate Limiting**: Protects authentication (`30 attempts / 15m`), conversions (`20 req / 1m`), and general API endpoints.
5. **No Credential Exposure**: Passwords are never returned in queries (`select: false`), and AI API keys are strictly kept on the Node.js backend.

---

## 🔮 Future Roadmap (Phase 2 & 3)

- **Docker-Isolated Code Execution**: Safe container execution environment with memory & CPU limits to compare stdout between source and target outputs.
- **Automated Test Generation**: AI generation of boundary, edge, and equivalence partition unit tests for both programs.
- **Multi-File Project Conversion**: ZIP project uploads with cross-file dependency graph analysis.
- **Tree-sitter AST Parser**: Local syntax tree validation using WebAssembly/JavaScript bindings.

---

## 📄 License
MIT License. Built as an advanced production-ready MERN showcase.
