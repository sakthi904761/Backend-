import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { dbConnection } from "./database/dbConnection.js";

import studentRouter from "./router/studentRouter.js";
import teacherRouter from "./router/teacherRouter.js";
import assignmentRouter from "./router/assignmentRouter.js";
import announcementRouter from "./router/announcementRouter.js";
import classRouter from "./router/classRouter.js";
import libraryRouter from "./router/libraryRouter.js";
import eventsRouter from "./router/eventsRouter.js";
import examRouter from "./router/examRouter.js";
import attendanceRouter from "./router/attendanceRouter.js";
import usersRouter from "./router/usersRouter.js";
import adminRegisterRouter from "./router/adminRegisterRouter.js";
import teacherRoutes from "./router/teacher.routes.js";
import studentFeesRouter from "./router/studentFeesRouter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import emailRoutes from "./router/email.routes.js";

/* ✅ CREATE APP FIRST */
const app = express();
config({ path: "./config/.env" });

/* ✅ UNIVERSAL CORS CONFIGURATION - WORKS ON ALL DEVICES */
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => s.replace(/\/$/, '')) // remove trailing slash
  : [];

console.log('🔒 CORS Configuration Loaded:');
console.log('   Allowed Origins:', allowedOrigins);
console.log('   Environment:', process.env.NODE_ENV || 'development');

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) {
      console.log('✅ CORS allowed: No origin header (mobile/native app)');
      return callback(null, true);
    }

    // Remove trailing slash from origin for comparison
    const cleanOrigin = origin.replace(/\/$/, '');

    // Check for wildcard
    if (allowedOrigins.includes("*")) {
      console.log(`✅ CORS allowed: ${origin} (wildcard enabled)`);
      return callback(null, true);
    }

    // Exact match check
    if (allowedOrigins.includes(cleanOrigin)) {
      console.log(`✅ CORS allowed (exact match): ${origin}`);
      return callback(null, true);
    }

    // Hostname-based match (allows different ports)
    try {
      const originUrl = new URL(origin);
      for (const allowed of allowedOrigins) {
        try {
          const allowedUrl = new URL(allowed);
          if (allowedUrl.hostname === originUrl.hostname && 
              allowedUrl.protocol === originUrl.protocol) {
            console.log(`✅ CORS allowed (hostname match): ${origin} ≈ ${allowed}`);
            return callback(null, true);
          }
        } catch (e) {
          // Skip malformed URLs in config
        }
      }
    } catch (e) {
      console.warn(`⚠️  Malformed origin: ${origin}`);
    }

    // Always allow local network IPs (for development and testing)
    const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
    const privateIPPattern = /^https?:\/\/(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})(:\d+)?$/;

    if (localhostPattern.test(origin) || privateIPPattern.test(origin)) {
      console.log(`✅ CORS allowed (local network): ${origin}`);
      return callback(null, true);
    }

    // Block everything else
    console.warn(`❌ CORS BLOCKED: ${origin}`);
    console.warn(`   Expected one of: ${allowedOrigins.join(", ")}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers"
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS before routes
app.use(cors(corsOptions));

// Handle preflight for all routes
app.options('*', cors(corsOptions));

// Request logging
app.use((req, res, next) => {
  const origin = req.headers.origin || 'no-origin';
  const timestamp = new Date().toISOString().substring(11, 19);
  console.log(`[${timestamp}] 📥 ${req.method} ${req.path} from ${origin}`);
  next();
});

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

/* ✅ ROUTES */
// Root health route
app.get('/', (req, res) => {
  res.json({
    status: 'API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    allowedOrigins: allowedOrigins,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Detailed health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cors: {
      enabled: true,
      allowedOrigins: allowedOrigins.length > 0 ? allowedOrigins : ['local IPs allowed']
    }
  });
});

// Test CORS endpoint
app.get('/test-cors', (req, res) => {
  res.json({
    success: true,
    message: 'CORS is working correctly!',
    yourOrigin: req.headers.origin || 'no-origin',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint
app.get('/debug/headers', (req, res) => {
  res.json({
    origin: req.headers.origin || null,
    host: req.headers.host || null,
    userAgent: req.headers['user-agent'] || null,
    ip: req.ip || req.connection.remoteAddress || null
  });
});

// API routes
app.use("/api/teacher", teacherRoutes);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/assignments", assignmentRouter);
app.use("/api/v1/announcements", announcementRouter);
app.use("/api/v1/class", classRouter);
app.use("/api/v1/library", libraryRouter);
app.use("/api/v1/events", eventsRouter);
app.use("/api/v1/exam", examRouter);
app.use("/api/v1/attendance", attendanceRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/register", adminRegisterRouter);
app.use("/api/v1/email", emailRoutes);
app.use("/api/v1/studentfees", studentFeesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /test-cors',
      'GET /debug/headers',
      '/api/v1/*'
    ]
  });
});

/* ✅ ERROR HANDLER (LAST) */
app.use(errorHandler);

/* ✅ DB */
dbConnection();

export default app;