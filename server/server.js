import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './configs/db.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

/* ===== Database ===== */
connectDB();

/* ===== Middlewares ===== */
// Parse JSON request bodies
app.use(express.json());

// Allow cookies over CORS (adjust origin to your frontend later)
app.use(cors({
  origin: true,           // for Postman & any origin during dev; set to your frontend URL in prod
  credentials: true
}));

// Parse cookies
app.use(cookieParser());

/* ===== Health check ===== */
app.get('/', (req, res) => {
  res.send('Auth API is running ✅');
});

/* ===== Routes ===== */
app.use('/api/auth', authRoutes);

/* ===== Start server ===== */
app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
