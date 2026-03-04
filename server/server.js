require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api/', limiter);

// Static files for images if needed
app.use('/uploads', express.static('uploads'));

// DB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/take-hub';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes placeholder
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Take Hub API', status: 'running' });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const academyRoutes = require('./routes/academyRoutes');
const hubRoutes = require('./routes/hubRoutes');
const staffRoutes = require('./routes/staffRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/academy', academyRoutes);
app.use('/api/hub', hubRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

// Serve static files from the Vue app dist directory
const path = require('path');
app.use(express.static(path.join(__dirname, '../dist')));

// Handle SPA routing - deliver index.html for any non-API routes
app.get('*', (req, res, next) => {
    // Skip if it's an API route
    if (req.path.startsWith('/api/')) {
        return next();
    }
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
