import express from "express"
import mongoose from "mongoose"
import User from "../models/User.js"
import bcrypt from "bcrypt"

const router = express.Router()

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, department, teachableYears, year, division, adminId, createdBy } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" })
    }

    // If registering an admin, validate the admin ID
    if (role === "admin") {
      // Check if the provided admin ID matches the one in the environment variables
      if (adminId !== process.env.ADMIN_ID) {
        return res.status(403).json({ message: "Invalid Admin ID. Admin registration failed." })
      }
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password, // Will be hashed by the pre-save hook
      role,
      department,
      createdBy,
    })

    // Add role-specific fields
    if (role === "teacher" && teachableYears) {
      newUser.teachableYears = teachableYears
    }

    if (role === "student") {
      newUser.year = year
      newUser.division = division
    }

    await newUser.save()
    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }
    
    // Return user data (excluding password)
    const userData = {
      id: user._id.toString(), // Convert ObjectId to string
      name: user.name,
      email: user.email,
      role: user.role,
    }
    
    res.json(userData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get users with optional role filtering
router.get("/", async (req, res) => {
  try {
    const { role } = req.query
    
    const mockUsers = [
      {
        _id: "teacher1",
        name: "Dr. John Smith",
        email: "john.smith@university.edu",
        role: "teacher",
        department: "Education",
        teachableYears: [1, 2, 3, 4],
        expertise: ["Educational Psychology", "Teaching Methods"]
      },
      {
        _id: "teacher2", 
        name: "Prof. Sarah Johnson",
        email: "sarah.johnson@university.edu",
        role: "teacher",
        department: "Education",
        teachableYears: [2, 3, 4],
        expertise: ["Curriculum Development", "Assessment"]
      },
      {
        _id: "teacher3",
        name: "Dr. Michael Brown",
        email: "michael.brown@university.edu", 
        role: "teacher",
        department: "Education",
        teachableYears: [1, 2],
        expertise: ["Special Education", "Inclusive Teaching"]
      }
    ]

    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const query = {}
      if (role) {
        query.role = role
      }
      
      const users = await User.find(query).select("-password")
      
      // If no users found in database, return mock data
      if (users.length === 0) {
        if (role) {
          return res.json(mockUsers.filter(user => user.role === role))
        }
        return res.json(mockUsers)
      }
      
      return res.json(users)
    }
    
    // Database not connected, return mock data
    if (role) {
      return res.json(mockUsers.filter(user => user.role === role))
    }
    return res.json(mockUsers)
    
  } catch (error) {
    // Return mock data on error
    if (role) {
      return res.json(mockUsers.filter(user => user.role === role))
    }
    res.json(mockUsers)
  }
})

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "API is working correctly" })
})

export default router
