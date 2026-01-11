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

/* ✅ MIDDLEWARES */
// Configure CORS to accept a comma-separated list in FRONTEND_URL and log decisions
const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",").map(s => s.trim()) : [];

const corsOptions = {
  origin: function (origin, callback) {
    // origin === undefined for non-browser requests (curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      console.log(`CORS allow: ${origin}`);
      return callback(null, true);
    }

    console.warn(`CORS blocked: ${origin}. Allowed: ${allowedOrigins.join(",")}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use((req, res, next) => {
  // attach a small helper so we can see incoming origin header quickly in logs
  req._requestOrigin = req.headers.origin || 'no-origin';
  next();
});

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ✅ ROUTES */
app.use("/api/teacher", teacherRoutes);

// Root health route
app.get('/', (req, res) => {
  res.send('API is running');
});

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
