import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import scheduleRoutes from "./routes/scheduleRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import integrationAPI from "./routes/integrationAPI.js"
import teachingPracticeRoutes from "./routes/teachingPracticeRoutes.js"
import studentRoutes from "./routes/studentRoutes.js"
import fieldWorkRoutes from "./routes/fieldWorkRoutes.js"
import scenarioRoutes from "./routes/scenarioRoutes.js"
import exportRoutes from "./routes/exportRoutes.js"
import courseRoutes from "./routes/courseRoutes.js"
import timetableRoutes from "./routes/timetableRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js"
import mlRoutes from "./routes/mlRoutes.js"

// Load environment variables
dotenv.config()

const app = express()

const PORT = process.env.PORT || 3001

// Configure CORS
const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "http://localhost:3000", // Alternative dev server
  process.env.FRONTEND_URL // Allow environment-based frontend URL
].filter(Boolean)

// CORS configuration with dynamic origin checking
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true)
      
      // In development, allow all origins
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true)
      }
      
      // In production, allow Vercel domains and configured origins
      if (origin.includes('vercel.app') || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      
      // Log rejected origins for debugging
      console.log('CORS rejected origin:', origin)
      callback(new Error('Not allowed by CORS'))
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  }),
)

// Middleware
app.use(express.json())

// Check for required environment variables
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI environment variable is required")
  process.exit(1)
}
if (!process.env.ADMIN_ID) {
  console.error("ADMIN_ID environment variable is required")
  process.exit(1)
}

// Connect to MongoDB with graceful error handling
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB")
    // Ensure indexes are properly set up
    try {
      const collection = mongoose.connection.collection("courses")

      const indexes = await collection.indexes()

      // Check if we have the simple code index that needs to be dropped
      const codeIndex = indexes.find(
        (index) => index.key && Object.keys(index.key).length === 1 && index.key.code === 1 && index.unique === true,
      )
      if (codeIndex) {
        await collection.dropIndex(codeIndex.name)
        // Create the compound index
        await collection.createIndex(
          { code: 1, lectureType: 1, division: 1, year: 1, branch: 1 },
          { unique: true, background: true },
        )
      }
    }
    catch (error) { }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
  })

// Routes
app.use("/api/schedule", scheduleRoutes)
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/teaching-practices", teachingPracticeRoutes)
app.use("/api/students", studentRoutes)
app.use("/api/field-works", fieldWorkRoutes)
app.use("/api/scenarios", scenarioRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/timetables", timetableRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/ml", mlRoutes)
app.use("/api", exportRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  console.log('Health check requested from origin:', req.get('Origin'))
  res.json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString(),
    origin: req.get('Origin')
  })
})

// Root route for testing
app.get("/", (req, res) => {
  res.send("Server is running")
})

// Start server
app.listen(PORT, () => { })
