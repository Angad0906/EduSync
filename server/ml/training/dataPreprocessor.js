import mongoose from 'mongoose'
import Course from '../../models/Course.js'
import User from '../../models/User.js'
import Room from '../../models/Room.js'
import Schedule from '../../models/Schedule.js'

/**
 * Data Preprocessor for ML Training
 * 
 * This module handles:
 * 1. Data collection from MongoDB
 * 2. Feature engineering
 * 3. Data cleaning and normalization
 * 4. Training/validation split
 */
export class DataPreprocessor {
  constructor() {
    this.trainingData = []
    this.validationData = []
    this.testData = []
  }

  /**
   * Collect and preprocess historical scheduling data
   */
  async collectTrainingData() {try {
      // Get all historical schedules
      const schedules = await Schedule.find()
        .populate('timetable.course')
        .populate('timetable.room')
        .lean()const processedData = []

      for (const schedule of schedules) {
        for (const item of schedule.timetable) {
          if (item.course && item.room) {
            // Get teacher information
            const teacher = await User.findById(item.course.instructor)
            
            if (teacher) {
              const processedItem = await this.processScheduleItem(item, teacher, schedule)
              if (processedItem) {
                processedData.push(processedItem)
              }
            }
          }
        }
      }return processedData

    } catch (error) {
      console.error('Error collecting training data:', error)
      throw error
    }
  }

  /**
   * Process individual schedule item into ML features
   */
  async processScheduleItem(item, teacher, schedule) {
    try {
      // Calculate derived features
      const features = {
        // Basic course features
        course_duration: item.course.duration || 60,
        course_capacity: item.course.capacity || 30,
        course_credits: item.course.credits || 3,
        course_difficulty: this.calculateCourseDifficulty(item.course),
        course_priority: this.calculateCoursePriority(item.course),
        
        // Teacher features
        teacher_experience: teacher.teachableYears?.length || 0,
        teacher_workload: await this.calculateTeacherWorkload(teacher._id, schedule),
        teacher_availability: this.calculateTeacherAvailability(teacher, item.day, item.startTime),
        
        // Room features
        room_capacity: item.room.capacity,
        room_type: this.encodeRoomType(item.room.type),
        room_utilization: this.calculateRoomUtilization(item.room, schedule),
        
        // Time features
        time_slot: this.encodeTimeSlot(item.startTime),
        day_of_week: this.encodeDayOfWeek(item.day),
        time_of_day: this.calculateTimeOfDay(item.startTime),
        
        // Context features
        semester_progress: this.calculateSemesterProgress(schedule),
        year_level: item.course.year,
        branch: this.encodeBranch(item.course.branch),
        program: this.encodeProgram(item.course.program),
        
        // Historical performance
        historical_success_rate: await this.calculateHistoricalSuccess(item.course._id),
        conflict_count: await this.calculateConflicts(item, schedule),
        
        // Quality score (target variable)
        quality_score: this.calculateQualityScore(item, teacher, schedule)
      }

      return features

    } catch (error) {
      console.error('Error processing schedule item:', error)
      return null
    }
  }

  /**
   * Calculate course difficulty based on various factors
   */
  calculateCourseDifficulty(course) {
    let difficulty = 3 // Base difficulty
    
    // Adjust based on year level
    difficulty += course.year * 0.5
    
    // Adjust based on credits
    difficulty += (course.credits || 3) * 0.2
    
    // Adjust based on prerequisites
    if (course.prerequisites && course.prerequisites.length > 0) {
      difficulty += course.prerequisites.length * 0.3
    }
    
    // Adjust based on assessment methods
    if (course.assessmentMethods?.includes('viva')) {
      difficulty += 1
    }
    
    return Math.min(difficulty, 10) // Cap at 10
  }

  /**
   * Calculate course priority based on importance
   */
  calculateCoursePriority(course) {
    let priority = 5 // Base priority
    
    // Core courses have higher priority
    if (course.category === 'CORE') {
      priority += 2
    }
    
    // Electives have lower priority
    if (course.isElective) {
      priority -= 1
    }
    
    // Required courses for graduation
    if (course.credits >= 4) {
      priority += 1
    }
    
    return Math.max(priority, 1) // Minimum priority 1
  }

  /**
   * Calculate teacher workload for the semester
   */
  async calculateTeacherWorkload(teacherId, schedule) {
    try {
      const teacherSchedules = await Schedule.find({
        'timetable.course.instructor': teacherId
      })
      
      let totalHours = 0
      for (const sched of teacherSchedules) {
        for (const item of sched.timetable) {
          if (item.course.instructor.toString() === teacherId.toString()) {
            totalHours += (item.course.duration || 60) / 60
          }
        }
      }
      
      return totalHours
    } catch (error) {
      return 0
    }
  }

  /**
   * Calculate teacher availability score
   */
  calculateTeacherAvailability(teacher, day, timeSlot) {
    if (!teacher.availability) return 0.5
    
    const dayAvailability = teacher.availability[day.toLowerCase()]
    if (!dayAvailability) return 0.5
    
    return dayAvailability[timeSlot] ? 1 : 0
  }

  /**
   * Calculate room utilization rate
   */
  calculateRoomUtilization(room, schedule) {
    const totalSlots = 40 // 5 days * 8 time slots
    let usedSlots = 0
    
    for (const item of schedule.timetable) {
      if (item.room._id.toString() === room._id.toString()) {
        usedSlots++
      }
    }
    
    return usedSlots / totalSlots
  }

  /**
   * Calculate semester progress
   */
  calculateSemesterProgress(schedule) {
    const now = new Date()
    const semesterStart = new Date(now.getFullYear(), 0, 1) // Assume January start
    const semesterEnd = new Date(now.getFullYear(), 5, 30) // Assume June end
    
    const totalDays = (semesterEnd - semesterStart) / (1000 * 60 * 60 * 24)
    const elapsedDays = (now - semesterStart) / (1000 * 60 * 60 * 24)
    
    return Math.min(elapsedDays / totalDays, 1)
  }

  /**
   * Calculate historical success rate for a course
   */
  async calculateHistoricalSuccess(courseId) {
    try {
      const courseSchedules = await Schedule.find({
        'timetable.course': courseId
      })
      
      if (courseSchedules.length === 0) return 0.5
      
      let totalScore = 0
      let count = 0
      
      for (const schedule of courseSchedules) {
        const score = this.calculateScheduleQuality(schedule)
        totalScore += score
        count++
      }
      
      return count > 0 ? totalScore / count : 0.5
    } catch (error) {
      return 0.5
    }
  }

  /**
   * Calculate number of conflicts in a schedule
   */
  async calculateConflicts(item, schedule) {
    let conflicts = 0
    
    // Check for teacher conflicts
    const teacherConflicts = schedule.timetable.filter(t => 
      t.course.instructor.toString() === item.course.instructor.toString() &&
      t.day === item.day &&
      t.startTime === item.startTime &&
      t._id.toString() !== item._id.toString()
    )
    
    conflicts += teacherConflicts.length
    
    // Check for room conflicts
    const roomConflicts = schedule.timetable.filter(t => 
      t.room._id.toString() === item.room._id.toString() &&
      t.day === item.day &&
      t.startTime === item.startTime &&
      t._id.toString() !== item._id.toString()
    )
    
    conflicts += roomConflicts.length
    
    return conflicts
  }

  /**
   * Calculate overall quality score for a schedule item
   */
  calculateQualityScore(item, teacher, schedule) {
    let score = 0.5 // Base score
    
    // Teacher-course match
    if (teacher.expertise && teacher.expertise.length > 0) {
      const expertiseMatch = teacher.expertise.some(exp => 
        item.course.name.toLowerCase().includes(exp.toLowerCase())
      )
      score += expertiseMatch ? 0.2 : -0.1
    }
    
    // Room suitability
    const roomSuitable = item.room.capacity >= item.course.capacity
    score += roomSuitable ? 0.1 : -0.2
    
    // Time slot preference
    if (item.course.preferredTimeSlots?.includes(item.startTime)) {
      score += 0.1
    }
    
    // No conflicts
    const conflicts = this.calculateConflicts(item, schedule)
    score -= conflicts * 0.1
    
    return Math.max(0, Math.min(1, score))
  }

  /**
   * Encode categorical variables
   */
  encodeRoomType(type) {
    const encoding = { 'classroom': 0, 'lab': 1, 'lecture-hall': 2 }
    return encoding[type] || 0
  }

  encodeTimeSlot(timeSlot) {
    const encoding = {
      '09:00': 0, '10:00': 1, '11:00': 2, '12:00': 3,
      '13:00': 4, '14:00': 5, '15:00': 6, '16:00': 7
    }
    return encoding[timeSlot] || 0
  }

  encodeDayOfWeek(day) {
    const encoding = {
      'Monday': 0, 'Tuesday': 1, 'Wednesday': 2,
      'Thursday': 3, 'Friday': 4
    }
    return encoding[day] || 0
  }

  encodeBranch(branch) {
    const encoding = {
      'Computer Science': 0, 'Mathematics': 1, 'Physics': 2,
      'Chemistry': 3, 'Biology': 4, 'Education': 5
    }
    return encoding[branch] || 0
  }

  encodeProgram(program) {
    const encoding = {
      'FYUP': 0, 'B.Ed.': 1, 'M.Ed.': 2, 'ITEP': 3
    }
    return encoding[program] || 0
  }

  /**
   * Split data into training, validation, and test sets
   */
  splitData(data, trainRatio = 0.7, valRatio = 0.15, testRatio = 0.15) {
    const shuffled = [...data].sort(() => Math.random() - 0.5)
    
    const trainSize = Math.floor(shuffled.length * trainRatio)
    const valSize = Math.floor(shuffled.length * valRatio)
    
    this.trainingData = shuffled.slice(0, trainSize)
    this.validationData = shuffled.slice(trainSize, trainSize + valSize)
    this.testData = shuffled.slice(trainSize + valSize)return {
      training: this.trainingData,
      validation: this.validationData,
      test: this.testData
    }
  }

  /**
   * Prepare data for ML training
   */
  prepareMLData(data) {
    const features = []
    const labels = []
    
    for (const item of data) {
      const featureVector = this.extractFeatureVector(item)
      features.push(featureVector)
      labels.push([item.quality_score])
    }
    
    return { features, labels }
  }

  /**
   * Extract feature vector from processed item
   */
  extractFeatureVector(item) {
    return [
      item.course_duration / 120, // Normalize duration
      item.course_capacity / 100, // Normalize capacity
      item.teacher_experience / 10, // Normalize experience
      item.teacher_availability,
      item.room_capacity / 100, // Normalize room capacity
      item.room_utilization,
      item.time_slot / 7, // Normalize time slot
      item.day_of_week / 4, // Normalize day
      item.time_of_day,
      item.semester_progress,
      item.historical_success_rate,
      item.conflict_count / 10, // Normalize conflicts
      item.course_difficulty / 10, // Normalize difficulty
      item.course_priority / 10, // Normalize priority
      item.teacher_workload / 40 // Normalize workload
    ]
  }
}

export default DataPreprocessor
