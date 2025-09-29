import ScheduleMLModel from '../models/ScheduleMLModel.js'
import { generateSchedule } from '../../utils/geneticAlgorithm.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * ML-Enhanced Schedule Optimizer
 * 
 * This class integrates ML predictions with the existing genetic algorithm
 * to provide optimized, conflict-free schedules.
 */
export class ScheduleOptimizer {
  constructor() {
    this.mlModel = new ScheduleMLModel()
    this.modelPath = path.join(__dirname, '../models/saved')
    this.isModelLoaded = false
  }

  /**
   * Initialize the optimizer by loading the trained ML model
   */
  async initialize() {
    try {
      const loaded = await this.mlModel.loadModel(this.modelPath)
      
      if (loaded) {
        this.isModelLoaded = true
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Error loading ML model:', error)
      return false
    }
  }

  /**
   * Generate optimized schedule using ML-enhanced approach
   */
  async generateOptimizedSchedule(courses, rooms, teachers, year, branch, division, students = [], program = null, practicums = [], options = {}) {
    try {
      // Step 1: Get ML recommendations if model is available
      let mlRecommendations = null
      if (this.isModelLoaded) {
        mlRecommendations = await this.getMLRecommendations(courses, teachers, rooms, options)
      }

      // Step 2: Use genetic algorithm with ML guidance
      const optimizedOptions = {
        ...options,
        mlRecommendations,
        useMLGuidance: this.isModelLoaded
      }

      const schedule = await generateSchedule(
        courses, rooms, teachers, year, branch, division, 
        students, program, practicums, optimizedOptions
      )

      // Step 3: Post-process with ML scoring if available
      if (this.isModelLoaded && schedule.length > 0) {
        const scoredSchedule = await this.scoreScheduleWithML(schedule, courses, teachers, rooms)
        return {
          ...schedule,
          mlScore: scoredSchedule.overallScore,
          mlInsights: scoredSchedule.insights
        }
      }

      return schedule
    } catch (error) {
      console.error('Error in ML optimization:', error)
      // Fallback to regular genetic algorithm
      return await generateSchedule(courses, rooms, teachers, year, branch, division, students, program, practicums, options)
    }
  }

  /**
   * Get ML recommendations for course-teacher-room-time combinations
   */
  async getMLRecommendations(courses, teachers, rooms, constraints) {
    try {
      const recommendations = await this.mlModel.generateRecommendations(
        courses, teachers, rooms, constraints
      )
      
      // Convert recommendations to format expected by genetic algorithm
      const mlGuidance = {}
      
      for (const courseRec of recommendations) {
        const courseId = courseRec.course._id.toString()
        mlGuidance[courseId] = courseRec.recommendations.map(rec => ({
          teacher: rec.teacher._id,
          room: rec.room._id,
          timeSlot: rec.timeSlot,
          day: rec.day,
          score: rec.score,
          confidence: rec.confidence
        }))
      }
      
      return mlGuidance
    } catch (error) {
      console.error('Error getting ML recommendations:', error)
      return null
    }
  }

  /**
   * Score a generated schedule using ML model
   */
  async scoreScheduleWithML(schedule, courses, teachers, rooms) {
    try {
      const scheduleItems = []
      
      for (const item of schedule) {
        const course = courses.find(c => c._id.toString() === item.course.toString())
        const teacher = teachers.find(t => t._id.toString() === item.teacher.toString())
        const room = rooms.find(r => r._id.toString() === item.room.toString())
        
        if (course && teacher && room) {
          scheduleItems.push({
            course,
            teacher,
            room,
            timeSlot: item.startTime,
            day: item.day
          })
        }
      }
      
      if (scheduleItems.length === 0) {
        return { overallScore: 0, insights: [] }
      }
      
      // Get ML predictions for each schedule item
      const scores = await this.mlModel.predict(scheduleItems)
      
      // Calculate overall score and insights
      const overallScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
      
      const insights = this.generateInsights(scheduleItems, scores)
      
      return { overallScore, insights }
      
    } catch (error) {
      console.error('Error scoring schedule with ML:', error)
      return { overallScore: 0.5, insights: [] }
    }
  }

  /**
   * Generate insights from ML scoring
   */
  generateInsights(scheduleItems, scores) {
    const insights = []
    
    // Find best and worst scheduled items
    const scorePairs = scheduleItems.map((item, index) => ({
      item,
      score: scores[index]
    }))
    
    scorePairs.sort((a, b) => b.score - a.score)
    
    const bestItem = scorePairs[0]
    const worstItem = scorePairs[scorePairs.length - 1]
    
    if (bestItem.score > 0.8) {
      insights.push({
        type: 'excellent',
        message: `Excellent scheduling for ${bestItem.item.course.name} with ${bestItem.item.teacher.name}`,
        score: bestItem.score
      })
    }
    
    if (worstItem.score < 0.4) {
      insights.push({
        type: 'warning',
        message: `Poor scheduling for ${worstItem.item.course.name} - consider rescheduling`,
        score: worstItem.score
      })
    }
    
    // Calculate average scores by category
    const teacherScores = {}
    const roomScores = {}
    
    scorePairs.forEach(({ item, score }) => {
      const teacherId = item.teacher._id.toString()
      const roomId = item.room._id.toString()
      
      if (!teacherScores[teacherId]) {
        teacherScores[teacherId] = { total: 0, count: 0, teacher: item.teacher }
      }
      if (!roomScores[roomId]) {
        roomScores[roomId] = { total: 0, count: 0, room: item.room }
      }
      
      teacherScores[teacherId].total += score
      teacherScores[teacherId].count += 1
      roomScores[roomId].total += score
      roomScores[roomId].count += 1
    })
    
    // Add teacher workload insights
    Object.values(teacherScores).forEach(({ teacher, total, count }) => {
      const avgScore = total / count
      if (avgScore < 0.5) {
        insights.push({
          type: 'teacher_workload',
          message: `${teacher.name} has challenging schedule assignments`,
          score: avgScore
        })
      }
    })
    
    return insights
  }

  /**
   * Optimize existing schedule using ML
   */
  async optimizeExistingSchedule(schedule, courses, teachers, rooms) {
    try {
      if (!this.isModelLoaded) {
        return schedule
      }
      
      // Score current schedule
      const currentScore = await this.scoreScheduleWithML(schedule, courses, teachers, rooms)
      
      // Find items with low scores
      const scheduleItems = []
      for (const item of schedule) {
        const course = courses.find(c => c._id.toString() === item.course.toString())
        const teacher = teachers.find(t => t._id.toString() === item.teacher.toString())
        const room = rooms.find(r => r._id.toString() === item.room.toString())
        
        if (course && teacher && room) {
          scheduleItems.push({
            course,
            teacher,
            room,
            timeSlot: item.startTime,
            day: item.day,
            originalItem: item
          })
        }
      }
      
      if (scheduleItems.length === 0) {
        return schedule
      }
      
      const scores = await this.mlModel.predict(scheduleItems)
      
      // Identify items to optimize (score < 0.5)
      const itemsToOptimize = scheduleItems
        .map((item, index) => ({ ...item, score: scores[index] }))
        .filter(item => item.score < 0.5)
      
      // For now, return original schedule with ML insights
      // In a full implementation, you would re-schedule the low-scoring items
      return {
        ...schedule,
        mlOptimization: {
          originalScore: currentScore.overallScore,
          itemsToOptimize: itemsToOptimize.length,
          insights: currentScore.insights
        }
      }
      
    } catch (error) {
      console.error('Error optimizing schedule:', error)
      return schedule
    }
  }

  /**
   * Get real-time optimization suggestions
   */
  async getOptimizationSuggestions(schedule, courses, teachers, rooms) {
    try {
      if (!this.isModelLoaded) {
        return { suggestions: [], message: 'ML model not available' }
      }
      
      const suggestions = []
      
      // Analyze each schedule item
      for (const item of schedule) {
        const course = courses.find(c => c._id.toString() === item.course.toString())
        const teacher = teachers.find(t => t._id.toString() === item.teacher.toString())
        const room = rooms.find(r => r._id.toString() === item.room.toString())
        
        if (course && teacher && room) {
          const scheduleItem = {
            course,
            teacher,
            room,
            timeSlot: item.startTime,
            day: item.day
          }
          
          const scores = await this.mlModel.predict([scheduleItem])
          const score = scores[0]
          
          if (score < 0.4) {
            suggestions.push({
              type: 'reschedule',
              item,
              currentScore: score,
              reason: this.getOptimizationReason(scheduleItem, score),
              priority: 'high'
            })
          } else if (score < 0.6) {
            suggestions.push({
              type: 'improve',
              item,
              currentScore: score,
              reason: this.getOptimizationReason(scheduleItem, score),
              priority: 'medium'
            })
          }
        }
      }
      
      return { suggestions, totalItems: schedule.length }
      
    } catch (error) {
      console.error('Error getting optimization suggestions:', error)
      return { suggestions: [], error: error.message }
    }
  }

  /**
   * Get reason for optimization suggestion
   */
  getOptimizationReason(scheduleItem, score) {
    const reasons = []
    
    if (score < 0.3) {
      reasons.push('Very poor schedule quality')
    } else if (score < 0.5) {
      reasons.push('Below average schedule quality')
    }
    
    // Add specific reasons based on features
    if (scheduleItem.room.capacity < scheduleItem.course.capacity) {
      reasons.push('Room capacity mismatch')
    }
    
    if (scheduleItem.teacher.teachableYears && 
        !scheduleItem.teacher.teachableYears.includes(scheduleItem.course.year)) {
      reasons.push('Teacher not suitable for course level')
    }
    
    return reasons.join(', ') || 'General optimization needed'
  }
}

export default ScheduleOptimizer
