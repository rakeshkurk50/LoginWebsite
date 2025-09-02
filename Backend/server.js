require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
// Allow common local development origins (Vite, file:// and other localhost ports)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin like native apps or file://
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    // For development, allow any localhost origin
    if (/^https?:\/\/localhost(:[0-9]+)?$/.test(origin) || /^https?:\/\/127\.0\.0\.1(:[0-9]+)?$/.test(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

const path = require('path');

// Routes
console.log('mounting /api/auth');
try {
  app.use('/api/auth', authRoutes);
  console.log('mounted /api/auth');
} catch (e) {
  console.error('Error mounting /api/auth:', e && e.stack ? e.stack : e);
  throw e;
}

console.log('mounting /api/users');
try {
  app.use('/api/users', userRoutes);
  console.log('mounted /api/users');
} catch (e) {
  console.error('Error mounting /api/users:', e && e.stack ? e.stack : e);
  throw e;
}

// Serve frontend static files from Backend/public when present
console.log('mounting static public');
try {
  app.use(express.static(path.join(__dirname, 'public')));
  console.log('mounted static public');
} catch (e) {
  console.error('Error mounting static public:', e && e.stack ? e.stack : e);
  throw e;
}

console.log('mounting wildcard fallback as middleware');
try {
  // Use a middleware instead of app.get('*', ...) to avoid path-to-regexp parsing issues
  app.use((req, res, next) => {
    // If request is for API, continue to routes
    if (req.path && req.path.startsWith('/api/')) return next();
    const indexPath = path.join(__dirname, 'public', 'index.html');
    // If public index exists, serve it; otherwise continue
    try {
      res.sendFile(indexPath);
    } catch (err) {
      next();
    }
  });
  console.log('mounted wildcard fallback as middleware');
} catch (e) {
  console.error('Error mounting wildcard fallback as middleware:', e && e.stack ? e.stack : e);
  throw e;
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
