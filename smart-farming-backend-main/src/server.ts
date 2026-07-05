import 'dotenv/config'; 
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import cropRoutes from "./routes/cropRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import connectDB from "./config/db";
import harvestRoutes from "./routes/harvestRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import weatherRoutes from "./routes/weatherRoutes";
import aiRoutes from "./routes/aiRoutes";
import reportRoutes from "./routes/reportRoutes";
import adminRoutes from "./routes/adminRoutes";
import userRoutes from './routes/userRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/harvests", harvestRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/ai", aiRoutes);
app.use('/api/reports', reportRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/users', userRoutes);

// Connect to Database
connectDB();

// Base Endpoint
app.get("/", (req, res) => {
  res.send("Smart Farming API Running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});