# PolyCode — AI-Powered Multi-Language Programming Code Converter

PolyCode is a modern, developer-grade code conversion workbench built on the **MERN stack** (MongoDB, Express.js, React.js, Node.js) with Tailwind CSS, Monaco Editor, and a resilient, multi-provider AI adapter layer.

PolyCode translates code bidirectionally across five major programming languages — **Python, Java, C, C++, and JavaScript** — while preserving algorithmic integrity, control flow, data structures, and idiomatic target conventions.

---

## 🌟 Key Features

- **Multi-Language Bidirectional Translation**: Convert code seamlessly across Python, Java, JavaScript, C, and C++.
- **Idiomatic & Algorithm Preservation**: Maps static and dynamic types accurately, maintains algorithmic time/space complexity, and adheres to target language standards (e.g., PEP 8 for Python, ES6+ for JavaScript, Modern STL for C++).
- **Professional Dual Monaco Editor Workbench**:
  - Side-by-side VS Code-grade Monaco editors with line numbers, syntax highlighting, bracket matching, and folding.
  - Quick language swap button with automatic target inversion.
  - Instant sample code loader for quick testing.
  - Keyboard shortcuts (`Ctrl + Enter` / `Cmd + Enter` to trigger conversion).
  - Code copy, clear, and download utilities.
- **Instant Dual Theme Engine**:
  - Explicit `[ ☀️ Light | 🌙 Dark ]` toggle in the header with full CSS variable backing.
  - Automatically matches Monaco Editor themes (`vs-dark` and `vs`) to the active application theme.
- **AI Engine Powered by Google Gemini Flash Lite**:
  - Configured with Google's high-speed **`gemini-3.1-flash-lite`** model.
  - Built-in **exponential backoff retry loop** to seamlessly absorb transient Google 503 high-demand surges.
- **Pluggable AI Adapter Architecture**:
  - Switch between **Google Gemini**, **Groq**, **OpenAI**, **Anthropic Claude**, or offline local **Ollama** simply by changing environment variables.
- **Dockable Code Inspection & Audit Panel**:
  - **Overview**: High-level conversion summary and status.
  - **Explanations**: Step-by-step breakdown of idiomatic transformations and syntax mappings.
  - **Warnings & Edge Cases**: Highlights language discrepancies, potential overflows, or library differences.
  - **Assumptions**: Transparent record of assumptions made during translation.
- **Conversion Preferences & Directives**:
  - Translation styles: *Idiomatic Conventions*, *Preserve Structure*, or *Simple & Clean*.
  - Explanation depth: *Detailed*, *With In-depth Explanations*, or *Basic*.
  - Algorithm preservation switches and optional custom directives.
- **Single Centralized Configuration**:
  - Only **one** `.env` file at the project root (`c:\Users\gocha\Desktop\PolyCode\.env`) controls the entire application.
- **Hardened Security**:
  - Helmet headers configured for modern web standards.
  - Granular CORS whitelisting, Express rate limiting, and Zod schema validation.
  - Zero arbitrary code execution (`eval()` or child execution of user code is strictly prohibited).

---

## 🛠️ Technology Stack

### Frontend
- **React 18** + **Vite** (Ultra-fast build and HMR)
- **@monaco-editor/react** (VS Code editing experience)
- **Tailwind CSS** (Custom high-contrast dark and light themes)
- **Lucide React** (Clean, professional developer iconography)
- **React Router DOM 6**
- **Axios** (Centralized API client)

### Backend
- **Node.js** (ES Modules: `"type": "module"`)
- **Express.js 4**
- **MongoDB** & **Mongoose 8**
- **Google GenAI SDK** (`@google/genai` & REST fallback)
- **Zod 3** (Request validation)
- **Helmet**, **CORS**, **Express Rate Limit**, **Cookie-Parser**

---

## 🏗️ Architecture & Directory Layout

```
PolyCode/
├── .env                         # Single centralized environment configuration
├── .env.example                 # Example configuration template
├── package.json                 # Monorepo management scripts
├── README.md                    # Project documentation
├── client/                      # React Frontend (Vite + Tailwind + Monaco)
│   ├── public/                  # Static assets & favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Button, Modal, Loader, Toast
│   │   │   ├── conversion/      # Controls, Result Inspection, Settings Modal
│   │   │   ├── editor/          # Monaco CodeEditor, Source & Target Editor panels
│   │   │   └── layout/          # Navbar, Footer
│   │   ├── config/              # Supported languages, Monaco IDs, sample snippets
│   │   ├── context/             # ThemeContext (Light/Dark), AuthContext, ToastContext
│   │   ├── pages/               # Dashboard, History, Projects, Login, Register
│   │   ├── services/            # Axios API clients
│   │   ├── App.jsx              # Application router & context wrappers
│   │   ├── index.css            # Theme tokens, custom scrollbars & utilities
│   │   └── main.jsx             # React DOM entry point
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
└── server/                      # Express Backend
    ├── config/
    │   ├── aiConfig.js          # Supported AI providers and default models
    │   ├── db.js                # MongoDB Mongoose connection
    │   ├── languages.js         # Language specifications and validation rules
    │   └── loadEnv.js           # Centralized root .env loader
    ├── controllers/             # Auth, Conversion, Project, Health controllers
    ├── middleware/              # Auth, Error, Rate Limiting, Validation middlewares
    ├── models/                  # User, Conversion, SavedProject schemas
    ├── routes/                  # Express routes under /api/v1/
    ├── services/
    │   ├── aiService.js         # Multi-provider adapter (Gemini Flash Lite, OpenAI, Groq, Ollama)
    │   ├── conversionService.js # End-to-end conversion orchestrator
    │   ├── promptService.js     # System & user prompt engineering
    │   └── validatorService.js  # Heuristic bracket and syntax validator
    ├── utils/                   # ApiError, ApiResponse standards
    ├── validators/              # Zod schemas
    ├── app.js                   # Express app configuration
    └── server.js                # HTTP server entry point
```

---

## 📋 Prerequisites

- **Node.js**: `v18.0.0` or higher (tested on Node `v26.3.0`)
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/polycode`) or MongoDB Atlas URI
- **Google Gemini API Key** (Free tier from [Google AI Studio](https://aistudio.google.com/)) or other supported provider key

---

## 🚀 Quick Setup & Installation

### 1. Clone & Navigate to Project Root
```powershell
cd C:\Users\gocha\Desktop\PolyCode
```

### 2. Configure the Single `.env` File
PolyCode uses a **single environment file at the project root**. Create `.env` by copying `.env.example`:

```powershell
Copy-Item .env.example .env
```

Open `.env` and set your configuration:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/polycode
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRES_IN=7d

# AI Provider Configuration
AI_PROVIDER=gemini
AI_MODEL=gemini-3.1-flash-lite
AI_API_KEY=your_gemini_api_key_here
AI_BASE_URL=

MAX_CODE_LENGTH=50000
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

### 3. Install All Dependencies
```powershell
npm run install:all
```
*(Or install separately with `npm --prefix server install` and `npm --prefix client install`)*

---

## 🏃 Running the Application

### Development Mode (Concurrent Vite + Express Backend)

In terminal 1 (Backend Server on `http://localhost:5000`):
```powershell
npm run server
```

In terminal 2 (Frontend Client on `http://localhost:5173`):
```powershell
npm run client
```

Open your browser at: **`http://localhost:5173`**

### Production Build
```powershell
# 1. Build client bundle
npm run build:client

# 2. Start production server
npm --prefix server start
```
The client will be served directly by Express at **`http://localhost:5000`**.

---

## 🤖 Supported AI Providers

PolyCode provides a provider-agnostic AI adapter in `server/services/aiService.js`. You can switch providers at any time in `.env`:

| Provider | Environment Configuration | Notes |
| :--- | :--- | :--- |
| **Google Gemini** *(Configured)* | `AI_PROVIDER=gemini`<br>`AI_MODEL=gemini-3.1-flash-lite`<br>`AI_API_KEY=your_key` | High-speed translation with automatic backoff retry on high-demand surges |
| **Groq Cloud** | `AI_PROVIDER=groq`<br>`AI_MODEL=llama-3.3-70b-versatile`<br>`AI_API_KEY=your_key` | Sub-second ultra-fast inference |
| **OpenAI** | `AI_PROVIDER=openai`<br>`AI_MODEL=gpt-4o-mini`<br>`AI_API_KEY=your_key` | Standard OpenAI structured output |
| **Anthropic** | `AI_PROVIDER=anthropic`<br>`AI_MODEL=claude-3-5-sonnet-20241022`<br>`AI_API_KEY=your_key` | Deep reasoning for complex systems code |
| **Ollama (Local)** | `AI_PROVIDER=ollama`<br>`AI_MODEL=codellama`<br>`AI_BASE_URL=http://localhost:11434/v1/chat/completions` | Free, fully offline local LLM execution |

---

## 🌐 API Reference

All API responses follow a uniform contract:

**Success Response (`200 OK` / `201 Created`):**
```json
{
  "success": true,
  "message": "Code converted successfully",
  "data": {
    "sourceLanguage": "python",
    "targetLanguage": "javascript",
    "convertedCode": "console.log('Hello, World!');",
    "explanation": "...",
    "warnings": [],
    "assumptions": []
  }
}
```

**Key Endpoints:**
- `GET  /api/v1/health` — System status, database health, uptime, and AI provider status
- `GET  /api/v1/languages` — Matrix of supported languages, capabilities, and Monaco IDs
- `POST /api/v1/conversions` — Core translation endpoint (supports guest and authenticated modes)
- `GET  /api/v1/conversions` — Paginated history of conversions with search and filter
- `DELETE /api/v1/conversions/:id` — Delete a conversion record
- `POST /api/v1/projects` — Save code conversions to permanent projects library
- `GET  /api/v1/projects` — List saved projects
- `PUT  /api/v1/projects/:id` — Update project details or tags
- `DELETE /api/v1/projects/:id` — Remove saved project

---

## 🛡️ Security & Reliability

1. **Strict Code Sandboxing**: Input and converted code are treated strictly as data strings. No `eval()`, no shell script execution, and no uncontained dynamic execution occurs.
2. **Exponential Backoff Resilience**: Up to 3 automatic retry attempts with incremental backoff delays handle upstream provider capacity constraints (e.g., Google 503 surges).
3. **HTTP-Only JWT Authentication**: Tokens stored in secure HttpOnly cookies protected against XSS.
4. **Rate Limiting**: Defends endpoints against spamming and denial of service.
5. **Heuristic Syntax Validation**: Analyzes target outputs for balanced brackets, braces, and syntax delimiters prior to returning results.

---

## 📄 License
MIT License. Built as an advanced production-ready MERN application showcase.
