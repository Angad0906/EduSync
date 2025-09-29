import mongoose from 'mongoose'
import dotenv from 'dotenv'
import ScheduleMLModel from '../models/ScheduleMLModel.js'
import DataPreprocessor from './dataPreprocessor.js'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * ML Model Training Script
 * 
 * This script:
 * 1. Connects to MongoDB
 * 2. Collects historical scheduling data
 * 3. Preprocesses the data
 * 4. Trains the ML model
 * 5. Saves the trained model
 */
class ModelTrainer {
  constructor() {
    this.mlModel = new ScheduleMLModel()
    this.dataPreprocessor = new DataPreprocessor()
    this.modelPath = path.join(__dirname, '../models/saved')
  }

  async connectToDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URI)} catch (error) {
      console.error('MongoDB connection error:', error)
      throw error
    }
  }

  async collectAndPreprocessData() {try {
      // Collect raw data
      const rawData = await this.dataPreprocessor.collectTrainingData()
      
      if (rawData.length === 0) {return this.generateSyntheticData()
      }// Split data
      const { training, validation, test } = this.dataPreprocessor.splitData(rawData)
      
      // Prepare ML data
      const trainingMLData = this.dataPreprocessor.prepareMLData(training)
      const validationMLData = this.dataPreprocessor.prepareMLData(validation)
      const testMLData = this.dataPreprocessor.prepareMLData(test)
      
      return {
        training: trainingMLData,
        validation: validationMLData,
        test: testMLData
      }
      
    } catch (error) {
      console.error('Error in data collection:', error)
      throw error
    }
  }

  /**
   * Generate synthetic training data when no historical data is available
   */
  generateSyntheticData() {const syntheticData = []
    const courses = [
      { name: 'Mathematics', duration: 60, capacity: 30, difficulty: 5, priority: 8 },
      { name: 'Physics', duration: 90, capacity: 25, difficulty: 6, priority: 7 },
      { name: 'Chemistry', duration: 60, capacity: 30, difficulty: 5, priority: 6 },
      { name: 'Computer Science', duration: 90, capacity: 20, difficulty: 7, priority: 9 },
      { name: 'English', duration: 60, capacity: 35, difficulty: 4, priority: 5 }
    ]
    
    const teachers = [
      { experience: 5, workload: 15, availability: 0.8 },
      { experience: 8, workload: 20, availability: 0.9 },
      { experience: 3, workload: 10, availability: 0.7 },
      { experience: 10, workload: 25, availability: 0.85 }
    ]
    
    const rooms = [
      { capacity: 30, type: 'classroom', utilization: 0.6 },
      { capacity: 25, type: 'lab', utilization: 0.4 },
      { capacity: 50, type: 'lecture-hall', utilization: 0.8 }
    ]
    
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    
    // Generate 1000 synthetic samples
    for (let i = 0; i < 1000; i++) {
      const course = courses[Math.floor(Math.random() * courses.length)]
      const teacher = teachers[Math.floor(Math.random() * teachers.length)]
      const room = rooms[Math.floor(Math.random() * rooms.length)]
      const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)]
      const day = days[Math.floor(Math.random() * days.length)]
      
      // Calculate quality score based on various factors
      let qualityScore = 0.5
      
      // Teacher experience factor
      qualityScore += (teacher.experience / 10) * 0.2
      
      // Room suitability
      if (room.capacity >= course.capacity) {
        qualityScore += 0.1
      }
      
      // Time preference (morning classes preferred)
      if (timeSlot === '09:00' || timeSlot === '10:00') {
        qualityScore += 0.1
      }
      
      // Teacher availability
      qualityScore += teacher.availability * 0.1
      
      // Add some randomness
      qualityScore += (Math.random() - 0.5) * 0.2
      
      // Ensure score is between 0 and 1
      qualityScore = Math.max(0, Math.min(1, qualityScore))
      
      const sample = {
        course_duration: course.duration,
        course_capacity: course.capacity,
        teacher_experience: teacher.experience,
        teacher_availability: teacher.availability,
        room_capacity: room.capacity,
        room_utilization: room.utilization,
        time_slot: timeSlots.indexOf(timeSlot),
        day_of_week: days.indexOf(day),
        time_of_day: timeSlots.indexOf(timeSlot) / 7,
        semester_progress: Math.random(),
        historical_success_rate: 0.5 + Math.random() * 0.3,
        conflict_count: Math.floor(Math.random() * 3),
        course_difficulty: course.difficulty,
        course_priority: course.priority,
        teacher_workload: teacher.workload,
        quality_score: qualityScore
      }
      
      syntheticData.push(sample)
    }
    
    // Split synthetic data
    const { training, validation, test } = this.dataPreprocessor.splitData(syntheticData)
    
    return {
      training: this.dataPreprocessor.prepareMLData(training),
      validation: this.dataPreprocessor.prepareMLData(validation),
      test: this.dataPreprocessor.prepareMLData(test)
    }
  }

  async trainModel(trainingData, validationData) {try {
      // Create the model
      this.mlModel.createModel()// Train the model
      const history = await this.mlModel.train(trainingData, validationData, 50)return history
      
    } catch (error) {
      console.error('Error during training:', error)
      throw error
    }
  }

  async evaluateModel(testData) {try {
      const predictions = await this.mlModel.predict(testData.features)
      const actual = testData.labels
      
      // Calculate metrics
      let mse = 0
      let mae = 0
      let correctPredictions = 0
      
      for (let i = 0; i < predictions.length; i++) {
        const pred = predictions[i]
        const actual_val = actual[i][0]
        const error = Math.abs(pred - actual_val)
        
        mse += Math.pow(pred - actual_val, 2)
        mae += error
        
        // Consider prediction correct if within 0.1 of actual value
        if (error < 0.1) {
          correctPredictions++
        }
      }
      
      mse /= predictions.length
      mae /= predictions.length
      const accuracy = correctPredictions / predictions.length}`)}`): ${(accuracy * 100).toFixed(2)}%`)
      
      return { mse, mae, accuracy }
      
    } catch (error) {
      console.error('Error during evaluation:', error)
      throw error
    }
  }

  async saveModel() {try {
      await this.mlModel.saveModel(this.modelPath)} catch (error) {
      console.error('Error saving model:', error)
      throw error
    }
  }

  async runTraining() {
    try {)
      
      // Connect to database
      await this.connectToDatabase()
      
      // Collect and preprocess data
      const data = await this.collectAndPreprocessData()
      
      // Train model
      const history = await this.trainModel(data.training, data.validation)
      
      // Evaluate model
      const metrics = await this.evaluateModel(data.test)
      
      // Save model
      await this.saveModel())return {
        success: true,
        metrics,
        modelPath: this.modelPath
      }
      
    } catch (error) {
      console.error('❌ Training failed:', error)
      return {
        success: false,
        error: error.message
      }
    } finally {
      // Close database connection
      await mongoose.disconnect()}
  }
}

// Run training if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const trainer = new ModelTrainer()
  trainer.runTraining()
    .then(result => {
      if (result.success) {process.exit(0)
      } else {
        console.error('Training failed:', result.error)
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error)
      process.exit(1)
    })
}

export default ModelTrainer
