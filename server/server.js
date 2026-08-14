import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// Initialize Express App
const app = express()

// Connect Database
await connectDB()

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=> res.send("Server is running"))
app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRouter)

// When deployed on Vercel as a serverless function we must not call `app.listen`.
// Export a handler function instead so Vercel's Node builder can invoke the Express app.
export default function handler(req, res) {
    return app(req, res);
}

// Start a local server when running directly (keeps local `npm start` working)
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit, just log
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.log('Uncaught Exception:', error);
    // Don't exit, just log
});