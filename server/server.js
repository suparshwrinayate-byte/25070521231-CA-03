require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const medicineRoutes = require('./routes/medicineRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_req, res) => res.json({ success: true, message: 'MediTrack API is running' }));
app.use('/api/medicines', medicineRoutes);
app.use((req, res) => res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`MediTrack server running at http://localhost:${PORT}`)))
  .catch(err => { console.error('Could not start server:', err.message); process.exit(1); });
