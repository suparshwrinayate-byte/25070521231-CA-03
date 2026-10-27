require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const protect = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'].filter(Boolean);
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Allow during local development
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// Public routes
app.get('/', (_req, res) => res.json({ success: true, message: 'MediTrack server root' }));
app.get('/api/health', (_req, res) => res.json({ success: true, message: 'MediTrack API is running' }));
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/medicines', protect, medicineRoutes);

// Catch-all 404
app.use((req, res) => res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`MediTrack server running at http://localhost:${PORT}`)))
  .catch(err => { console.error('Could not start server:', err.message); process.exit(1); });
