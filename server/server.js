import './config/loadEnv.js';

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`[PolyCode Server] Running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
      console.log(`[PolyCode Server] Health endpoint: http://localhost:${PORT}/api/v1/health`);
    });

    // Graceful shutdown handling
    const shutdown = (signal) => {
      console.log(`\n[PolyCode Server] Received ${signal}. Closing HTTP server...`);
      server.close(() => {
        console.log('[PolyCode Server] HTTP server closed gracefully.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error(`[Fatal Startup Error] Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
