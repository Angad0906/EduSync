import express from "express"
import ScheduleOptimizer from "../ml/optimization/scheduleOptimizer.js"
import Course from "../models/Course.js"
import User from "../models/User.js"
import Room from "../models/Room.js"
import Schedule from "../models/Schedule.js"

const router = express.Router()

// Initialize the ML optimizer
const mlOptimizer = new ScheduleOptimizer()

// Initialize ML model on startup
mlOptimizer.initialize().then(loaded => {
  if (loaded) {} else {}
})

/**
 * Generate ML-optimized schedule
 * POST /api/ml/generate-schedule
 */
router.post("/generate-schedule", async (req, res) => {
  try {
    const { year, branch, division, program, options = {} } = req.body

    // Get required data
    const courses = await Course.find({ year, branch, division, program })
    const teachers = await User.find({ role: "teacher" })
    const rooms = await Room.find({ isAvailable: true })

    if (courses.length === 0) {
      return res.status(400).json({ 
        error: "No courses found for the specified criteria" 
      })
    }

    if (teachers.length === 0) {
      return res.status(400).json({ 
        error: "No teachers available" 
      })
    }

    if (rooms.length === 0) {
      return res.status(400).json({ 
        error: "No rooms available" 
      })
    }// Generate optimized schedule
    const optimizedSchedule = await mlOptimizer.generateOptimizedSchedule(
      courses, rooms, teachers, year, branch, division, [], program, [], options
    )

    res.json({
      success: true,
      schedule: optimizedSchedule,
      metadata: {
        coursesCount: courses.length,
        teachersCount: teachers.length,
        roomsCount: rooms.length,
        mlEnhanced: mlOptimizer.isModelLoaded,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {res.status(500).json({ 
      error: "Failed to generate optimized schedule",
      details: error.message 
    })
  }
})

/**
 * Optimize existing schedule
 * POST /api/ml/optimize-schedule
 */
router.post("/optimize-schedule", async (req, res) => {
  try {
    const { scheduleId } = req.body

    if (!scheduleId) {
      return res.status(400).json({ error: "Schedule ID is required" })
    }

    // Get the existing schedule
    const schedule = await Schedule.findById(scheduleId)
      .populate('timetable.course')
      .populate('timetable.room')

    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" })
    }

    // Get related data
    const courses = await Course.find({ 
      _id: { $in: schedule.timetable.map(item => item.course) }
    })
    const teachers = await User.find({ role: "teacher" })
    const rooms = await Room.find({ isAvailable: true })

    // Optimize the schedule
    const optimizedSchedule = await mlOptimizer.optimizeExistingSchedule(
      schedule.timetable, courses, teachers, rooms
    )

    res.json({
      success: true,
      originalSchedule: schedule.timetable,
      optimizedSchedule,
      metadata: {
        scheduleId,
        mlEnhanced: mlOptimizer.isModelLoaded,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {res.status(500).json({ 
      error: "Failed to optimize schedule",
      details: error.message 
    })
  }
})

/**
 * Get optimization suggestions for a schedule
 * GET /api/ml/suggestions/:scheduleId
 */
router.get("/suggestions/:scheduleId", async (req, res) => {
  try {
    const { scheduleId } = req.params

    // Get the schedule
    const schedule = await Schedule.findById(scheduleId)
      .populate('timetable.course')
      .populate('timetable.room')

    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" })
    }

    // Get related data
    const courses = await Course.find({ 
      _id: { $in: schedule.timetable.map(item => item.course) }
    })
    const teachers = await User.find({ role: "teacher" })
    const rooms = await Room.find({ isAvailable: true })

    // Get optimization suggestions
    const suggestions = await mlOptimizer.getOptimizationSuggestions(
      schedule.timetable, courses, teachers, rooms
    )

    res.json({
      success: true,
      scheduleId,
      suggestions,
      metadata: {
        totalItems: schedule.timetable.length,
        mlEnhanced: mlOptimizer.isModelLoaded,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {res.status(500).json({ 
      error: "Failed to get optimization suggestions",
      details: error.message 
    })
  }
})

/**
 * Score a schedule using ML
 * POST /api/ml/score-schedule
 */
router.post("/score-schedule", async (req, res) => {
  try {
    const { schedule } = req.body

    if (!schedule || !Array.isArray(schedule)) {
      return res.status(400).json({ error: "Valid schedule array is required" })
    }

    // Get related data for scoring
    const courseIds = [...new Set(schedule.map(item => item.course))]
    const roomIds = [...new Set(schedule.map(item => item.room))]

    const courses = await Course.find({ _id: { $in: courseIds } })
    const teachers = await User.find({ role: "teacher" })
    const rooms = await Room.find({ _id: { $in: roomIds } })

    // Score the schedule
    const scoreResult = await mlOptimizer.scoreScheduleWithML(
      schedule, courses, teachers, rooms
    )

    res.json({
      success: true,
      score: scoreResult.overallScore,
      insights: scoreResult.insights,
      metadata: {
        itemsCount: schedule.length,
        mlEnhanced: mlOptimizer.isModelLoaded,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {res.status(500).json({ 
      error: "Failed to score schedule",
      details: error.message 
    })
  }
})

/**
 * Get ML model status
 * GET /api/ml/status
 */
router.get("/status", (req, res) => {
  res.json({
    success: true,
    mlModelLoaded: mlOptimizer.isModelLoaded,
    status: mlOptimizer.isModelLoaded ? "Ready" : "Model not available",
    features: [
      "Schedule optimization",
      "Conflict prediction",
      "Quality scoring",
      "Optimization suggestions"
    ],
    timestamp: new Date().toISOString()
  })
})

/**
 * Train ML model
 * POST /api/ml/train
 */
router.post("/train", async (req, res) => {
  try {// Import the trainer
    const { default: ModelTrainer } = await import("../ml/training/trainModel.js")
    const trainer = new ModelTrainer()
    
    // Start training in background
    trainer.runTraining().then(result => {}).catch(error => {
      console.error("Training failed:", error)
    })
    
    res.json({
      success: true,
      message: "ML model training started in background",
      timestamp: new Date().toISOString()
    })

  } catch (error) {res.status(500).json({ 
      error: "Failed to start training",
      details: error.message 
    })
  }
})

/**
 * Get ML recommendations for a course
 * GET /api/ml/recommendations/:courseId
 */
router.get("/recommendations/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params

    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    const teachers = await User.find({ role: "teacher" })
    const rooms = await Room.find({ isAvailable: true })

    if (!mlOptimizer.isModelLoaded) {
      return res.json({
        success: true,
        recommendations: [],
        message: "ML model not available for recommendations"
      })
    }

    // Get ML recommendations
    const recommendations = await mlOptimizer.getMLRecommendations(
      [course], teachers, rooms, {}
    )

    res.json({
      success: true,
      course: {
        id: course._id,
        name: course.name,
        code: course.code
      },
      recommendations: recommendations[courseId] || [],
      metadata: {
        teachersCount: teachers.length,
        roomsCount: rooms.length,
        mlEnhanced: true,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {res.status(500).json({ 
      error: "Failed to get recommendations",
      details: error.message 
    })
  }
})

export default router
