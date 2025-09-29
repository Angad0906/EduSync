#!/usr/bin/env node

/**
 * ML Integration Test Script
 * 
 * This script tests the ML integration to ensure everything works correctly
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import ScheduleOptimizer from '../optimization/scheduleOptimizer.js'
import ScheduleMLModel from '../models/ScheduleMLModel.js'
import DataPreprocessor from '../training/dataPreprocessor.js'

// Load environment variables
dotenv.config()

class MLIntegrationTester {
  constructor() {
    this.optimizer = new ScheduleOptimizer()
    this.mlModel = new ScheduleMLModel()
    this.dataPreprocessor = new DataPreprocessor()
  }

  async connectToDatabase() {
    try {
      if (process.env.MONGODB_URI) {
        await mongoose.connect(process.env.MONGODB_URI)return true
      } else {return false
      }
    } catch (error) {return false
    }
  }

  async testMLModelCreation() {try {
      this.mlModel.createModel()// Test feature extraction with mock data
      const mockScheduleData = [{
        course: { duration: 60, capacity: 30, difficulty: 5, priority: 8 },
        teacher: { teachableYears: [1, 2], workload: 15, availability: 0.8 },
        room: { capacity: 30, type: 'classroom', utilization: 0.6 },
        timeSlot: '09:00',
        day: 'Monday'
      }]
      
      const features = this.mlModel.extractFeatures(mockScheduleData)return true
    } catch (error) {
      console.error('❌ ML model creation failed:', error.message)
      return false
    }
  }

  async testDataPreprocessing() {try {
      // Test with mock data
      const mockData = [{
        course_duration: 60,
        course_capacity: 30,
        teacher_experience: 5,
        teacher_availability: 0.8,
        room_capacity: 30,
        room_utilization: 0.6,
        time_slot: 0,
        day_of_week: 0,
        time_of_day: 0.1,
        semester_progress: 0.5,
        historical_success_rate: 0.7,
        conflict_count: 0,
        course_difficulty: 5,
        course_priority: 8,
        teacher_workload: 15,
        quality_score: 0.8
      }]
      
      const { features, labels } = this.dataPreprocessor.prepareMLData(mockData)return true
    } catch (error) {
      console.error('❌ Data preprocessing failed:', error.message)
      return false
    }
  }

  async testScheduleOptimizer() {try {
      const initialized = await this.optimizer.initialize()// Test with mock data
      const mockCourses = [{
        _id: 'course1',
        name: 'Mathematics',
        duration: 60,
        capacity: 30,
        year: 1,
        branch: 'Computer Science',
        division: 'A',
        lectureType: 'theory'
      }]
      
      const mockTeachers = [{
        _id: 'teacher1',
        name: 'Dr. Smith',
        role: 'teacher',
        teachableYears: [1, 2],
        expertise: ['Mathematics']
      }]
      
      const mockRooms = [{
        _id: 'room1',
        name: 'Room 101',
        capacity: 30,
        type: 'classroom',
        isAvailable: true
      }]
      
      // Test ML recommendations
      if (this.optimizer.isModelLoaded) {
        const recommendations = await this.optimizer.getMLRecommendations(
          mockCourses, mockTeachers, mockRooms, {}
        )} else {}
      
      return true
    } catch (error) {
      console.error('❌ Schedule optimizer test failed:', error.message)
      return false
    }
  }

  async testAPIEndpoints() {try {
      // Test ML status endpoint
      const response = await fetch('http://localhost:3001/api/ml/status')
      if (response.ok) {
        const data = await response.json()return true
      } else {')
        return false
      }
    } catch (error) {')
      return false
    }
  }

  async testSyntheticDataGeneration() {try {
      // Generate synthetic training data
      const syntheticData = []
      const courses = [
        { name: 'Mathematics', duration: 60, capacity: 30, difficulty: 5, priority: 8 },
        { name: 'Physics', duration: 90, capacity: 25, difficulty: 6, priority: 7 }
      ]
      
      const teachers = [
        { experience: 5, workload: 15, availability: 0.8 },
        { experience: 8, workload: 20, availability: 0.9 }
      ]
      
      const rooms = [
        { capacity: 30, type: 'classroom', utilization: 0.6 },
        { capacity: 25, type: 'lab', utilization: 0.4 }
      ]
      
      // Generate 100 synthetic samples
      for (let i = 0; i < 100; i++) {
        const course = courses[Math.floor(Math.random() * courses.length)]
        const teacher = teachers[Math.floor(Math.random() * teachers.length)]
        const room = rooms[Math.floor(Math.random() * rooms.length)]
        
        const sample = {
          course_duration: course.duration,
          course_capacity: course.capacity,
          teacher_experience: teacher.experience,
          teacher_availability: teacher.availability,
          room_capacity: room.capacity,
          room_utilization: room.utilization,
          time_slot: Math.floor(Math.random() * 8),
          day_of_week: Math.floor(Math.random() * 5),
          time_of_day: Math.random(),
          semester_progress: Math.random(),
          historical_success_rate: 0.5 + Math.random() * 0.3,
          conflict_count: Math.floor(Math.random() * 3),
          course_difficulty: course.difficulty,
          course_priority: course.priority,
          teacher_workload: teacher.workload,
          quality_score: Math.random()
        }
        
        syntheticData.push(sample)
      }// Test data splitting
      const { training, validation, test } = this.dataPreprocessor.splitData(syntheticData)return true
    } catch (error) {
      console.error('❌ Synthetic data generation failed:', error.message)
      return false
    }
  }

  async runAllTests() {)
    
    const results = {
      database: false,
      mlModel: false,
      dataPreprocessing: false,
      optimizer: false,
      apiEndpoints: false,
      syntheticData: false
    }
    
    try {
      // Test database connection
      results.database = await this.connectToDatabase()
      
      // Test ML model creation
      results.mlModel = await this.testMLModelCreation()
      
      // Test data preprocessing
      results.dataPreprocessing = await this.testDataPreprocessing()
      
      // Test schedule optimizer
      results.optimizer = await this.testScheduleOptimizer()
      
      // Test API endpoints
      results.apiEndpoints = await this.testAPIEndpoints()
      
      // Test synthetic data generation
      results.syntheticData = await this.testSyntheticDataGeneration()
      
    } catch (error) {
      console.error('❌ Test execution failed:', error)
    } finally {
      // Close database connection
      if (results.database) {
        await mongoose.disconnect()}
    }
    
    // Print results))
    
    Object.entries(results).forEach(([test, passed]) => {
      const status = passed ? '✅ PASS' : '❌ FAIL'}: ${status}`)
    })
    
    const passedTests = Object.values(results).filter(Boolean).length
    const totalTests = Object.keys(results).length)if (passedTests === totalTests) {} else {}
    
    return results
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new MLIntegrationTester()
  tester.runAllTests()
    .then(results => {
      const allPassed = Object.values(results).every(Boolean)
      process.exit(allPassed ? 0 : 1)
    })
    .catch(error => {
      console.error('Test execution failed:', error)
      process.exit(1)
    })
}

export default MLIntegrationTester
