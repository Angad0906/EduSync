#!/usr/bin/env node

/**
 * TensorFlow Setup Script
 * Handles TensorFlow installation and model setup
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class TensorFlowSetup {
  constructor() {
    this.projectRoot = __dirname
  }

  /**
   * Install TensorFlow and ML dependencies
   */
  installDependencies() {const dependencies = [
      '@tensorflow/tfjs-node',
      'ml-matrix',
      'ml-regression', 
      'ml-kmeans'
    ]

    for (const dep of dependencies) {
      try {execSync(`npm install ${dep}`, { 
          cwd: this.projectRoot,
          stdio: 'inherit' 
        })} catch (error) {}
    }
  }

  /**
   * Create ML directories
   */
  createDirectories() {const directories = [
      'ml/models/saved',
      'ml/training/data',
      'ml/optimization',
      'ml/utils',
      'ml/test'
    ]

    for (const dir of directories) {
      const fullPath = path.join(this.projectRoot, dir)
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true })}
    }
  }

  /**
   * Test TensorFlow installation
   */
  async testTensorFlow() {try {
      const { default: tf } = await import('@tensorflow/tfjs-node')
      
      // Create a simple model to test
      const model = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [2], units: 1, activation: 'sigmoid' })
        ]
      })
      
      model.compile({ optimizer: 'adam', loss: 'meanSquaredError' })
      
      // Test prediction
      const testData = tf.tensor2d([[1, 2], [3, 4]])
      const prediction = model.predict(testData)
      const result = await prediction.data()}`)
      
      // Clean up
      testData.dispose()
      prediction.dispose()
      
      return true
    } catch (error) {
      console.error('❌ TensorFlow test failed:', error.message)
      return false
    }
  }

  /**
   * Train the ML model
   */
  async trainModel() {try {
      const { default: ModelTrainer } = await import('./ml/training/trainModel.js')
      const trainer = new ModelTrainer()
      
      const result = await trainer.runTraining()
      
      if (result.success) {return true
      } else {return false
      }
    } catch (error) {
      console.error('❌ Error during model training:', error)
      return false
    }
  }

  /**
   * Test ML integration
   */
  async testMLIntegration() {try {
      const { default: ScheduleOptimizer } = await import('./ml/optimization/scheduleOptimizer.js')
      const optimizer = new ScheduleOptimizer()
      
      const initialized = await optimizer.initialize()
      
      if (initialized) {return true
      } else {return true
      }
    } catch (error) {
      console.error('❌ ML integration test failed:', error)
      return false
    }
  }

  /**
   * Run complete setup
   */
  async setup() {)
    
    try {
      // Step 1: Install dependencies
      this.installDependencies()
      
      // Step 2: Create directories
      this.createDirectories()
      
      // Step 3: Test TensorFlow
      const tfWorking = await this.testTensorFlow()
      
      if (tfWorking) {
        // Step 4: Train model
        await this.trainModel()
        
        // Step 5: Test integration
        await this.testMLIntegration()
      })return true
      
    } catch (error) {
      console.error('\n❌ Setup failed:', error)
      return false
    }
  }
}

// Run setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new TensorFlowSetup()
  setup.setup()
    .then(success => {
      if (success) {process.exit(0)
      } else {process.exit(1)
      }
    })
    .catch(error => {
      console.error('\n💥 Unexpected error during setup:', error)
      process.exit(1)
    })
}

export default TensorFlowSetup
