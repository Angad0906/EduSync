#!/usr/bin/env node

/**
 * Script to update all API URLs from port 3000 to 3001
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const filesToUpdate = [
  'src/components/TimetableManager.jsx',
  'src/components/TimetableEditor.jsx',
  'src/components/TeachingPracticeManager.jsx',
  'src/components/TeachersPage.jsx',
  'src/components/TeacherDashboard.jsx',
  'src/components/StudentDashboard.jsx',
  'src/components/SchedulePage.jsx',
  'src/components/ScenarioSimulator.jsx',
  'src/components/ReportsDashboard.jsx',
  'src/components/RegisterAdminPage.jsx',
  'src/components/MultiProgramDashboard.jsx',
  'src/components/FieldWorkManager.jsx',
  'src/components/ExportManager.jsx',
  'src/components/CourseForm.jsx',
  'src/components/ConflictViewer.jsx',
  'src/components/ConflictResolution.jsx',
  'src/components/AdminRegistration.jsx'
]

function updateApiUrls() {let updatedFiles = 0
  
  filesToUpdate.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath)
    
    if (fs.existsSync(fullPath)) {
      try {
        let content = fs.readFileSync(fullPath, 'utf8')
        
        // Replace localhost:3000 with localhost:3001
        const updatedContent = content.replace(
          /http:\/\/localhost:3000/g,
          'http://localhost:3001'
        )
        
        if (content !== updatedContent) {
          fs.writeFileSync(fullPath, updatedContent)updatedFiles++
        } else {}
      } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message)
      }
    } else {}
  })')')}

// Run the update
updateApiUrls()
