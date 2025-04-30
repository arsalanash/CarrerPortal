import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import studentRoutes from './routes/student.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);

export { app };
