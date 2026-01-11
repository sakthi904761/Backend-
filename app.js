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

/* ✅ IMPROVED CORS CONFIGURATION */
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(",").map(s => s.trim()) 
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is in allowed list or if wildcard is enabled
    if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      console.log(`✅ CORS allowed: ${origin}`);
      return callback(null, true);
    }

    // For development: allow localhost and 127.0.0.1 with any port
    if (process.env.NODE_ENV !== 'production') {
      const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
      const localIPPattern = /^https?:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/;
      
      if (localhostPattern.test(origin) || localIPPattern.test(origin)) {
        console.log(`✅ CORS allowed (dev): ${origin}`);
        return callback(null, true);
      }
    }

    console.warn(`❌ CORS blocked: ${origin}. Allowed origins: ${allowedOrigins.join(", ")}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400 // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
  const origin = req.headers.origin || 'no-origin';
  console.log(`📥 ${req.method} ${req.path} from ${origin}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ✅ ROUTES */
// Root health route
app.get('/', (req, res) => {
  res.json({ 
    status: 'API is running',
    timestamp: new Date().toISOString(),
    allowedOrigins: allowedOrigins
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development'
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

/* ✅ ERROR HANDLER (LAST) */
app.use(errorHandler);

/* ✅ DB */
dbConnection();

export default app;