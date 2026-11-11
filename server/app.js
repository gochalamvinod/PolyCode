import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { generalLimiter } from './middleware/rateLimitMiddleware.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Route imports
import authRoutes from './routes/authRoutes.js';
import conversionRoutes from './routes/conversionRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import languageRoutes from './routes/languageRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust reverse proxies (Vercel, Render, Nginx) for express-rate-limit and secure cookies
app.set('trust proxy', 1);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "blob:"],
        workerSrc: ["'self'", "blob:"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'", "https://cdn.jsdelivr.net"]
      }
    } : false,
    hsts: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin) || (process.env.CLIENT_URL && origin.endsWith('.vercel.app'))) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by PolyCode CORS policy`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// General rate limiter
app.use(generalLimiter);

// Parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// Base API route ping
app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    name: 'PolyCode API',
    version: '1.0.0',
    description: 'AI-Powered Multi-Language Programming Code Converter'
  });
});

// Root ping and graceful fallback if frontend is not served by Express
app.get('/', (req, res, next) => {
  const clientDistIndex = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(clientDistIndex)) {
    return res.sendFile(clientDistIndex);
  }
  return res.json({
    status: 'online',
    name: 'PolyCode Backend API',
    version: '1.0.0',
    message: 'PolyCode API server is running.',
    endpoints: {
      health: '/api/v1/health',
      languages: '/api/v1/languages',
      conversions: '/api/v1/conversions'
    }
  });
});

// Mount API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/conversions', conversionRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/languages', languageRoutes);
app.use('/api/v1/health', healthRoutes);

// Serve production frontend assets if built
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// 404 and Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
