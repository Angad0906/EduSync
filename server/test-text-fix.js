#!/usr/bin/env node

/**
 * Text Fix Validation Test Script
 * Tests that text in timetable PDFs is properly positioned and readable
 */

import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

const BASE_URL = 'http://localhost:5000/api/export'

// Test configurations to validate text rendering
const testConfigurations = [
  {
    name: "Standard Text Layout",
    config: {
      type: "timetables",
      format: "pdf",
      filters: { program: "FYUP", year: 1, branch: "Computer Science", division: "A" },
      options: {
        theme: "default",
        layout: "landscape",
        includeStats: true,
        includeConflicts: true
      }
    }
  },
  {
    name: "Compact Text Layout",
    config: {
      type: "timetables", 
      format: "pdf",
      filters: { program: "FYUP", year: 2, branch: "Mathematics", division: "B" },
      options: {
        theme: "default",
        layout: "compact",
        includeStats: true,
        includeConflicts: true
      }
    }
  },
  {
    name: "Long Course Names Test",
    config: {
      type: "timetables",
      format: "pdf", 
      filters: { program: "B.Ed.", year: 1, branch: "Education", division: "A" },
      options: {
        theme: "modern",
        layout: "landscape",
        includeStats: true,
        includeConflicts: true
      }
    }
  },
  {
    name: "Narrow Columns Test",
    config: {
      type: "timetables",
      format: "pdf",
      filters: { program: "FYUP", year: 3, branch: "Physics", division: "A" },
      options: {
        theme: "default",
        layout: "compact",
        selectedDays: ["Monday", "Tuesday", "Wednesday"], // Fewer days = wider columns
        includeStats: false,
        includeConflicts: false
      }
    }
  }
]

async function testTextRendering(testConfig) {try {
    const response = await fetch(`${BASE_URL}/export/${testConfig.config.type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testConfig.config)
    })

    if (response.ok) {
      const filename = `text_fix_${testConfig.name.replace(/\s+/g, '_').toLowerCase()}.pdf`
      const buffer = await response.buffer()
      
      // Save test file
      fs.writeFileSync(path.join(process.cwd(), filename), buffer).toFixed(1)}KB)`)
      
      // Basic validation checks
      const sizeKB = buffer.length / 1024
      
      // Check if file size is reasonable (not too small indicating errors)
      if (sizeKB < 50) {}KB seems too small`)
      } else if (sizeKB > 500) {}KB might be too large`)
      } else {}KB`)
      }
      
      // Check response headers for any issues
      const contentType = response.headers.get('content-type')
      if (contentType !== 'application/pdf') {} else {}
      
      return { success: true, size: buffer.length, filename, sizeKB }
    } else {
      const error = await response.text()return { success: false, error }
    }
  } catch (error) {return { success: false, error: error.message }
  }
}

async function runTextFixTests() {const results = []
  
  // Test different configurations
  for (const testConfig of testConfigurations) {
    const result = await testTextRendering(testConfig)
    results.push({ config: testConfig, result })
  }
  
  // Summaryconst successfulTests = results.filter(r => r.result.success).length
  const totalTests = results.lengthif (successfulTests > 0) {
    const avgSize = results
      .filter(r => r.result.success)
      .reduce((sum, r) => sum + r.result.sizeKB, 0) / successfulTests}KB`)results.filter(r => r.result.success).forEach(r => {})
  }return results
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTextFixTests().catch(console.error)
}

export { runTextFixTests, testTextRendering }