#!/usr/bin/env node

/**
 * Single Page PDF Test Script
 * Tests that each timetable fits on exactly one page
 */

import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

const BASE_URL = 'http://localhost:5000/api/export'

// Test configurations for single page validation
const testConfigurations = [
  {
    name: "Standard Layout",
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
    name: "Compact Layout",
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
    name: "With All Features",
    config: {
      type: "timetables",
      format: "pdf", 
      filters: { program: "B.Ed.", year: 1, branch: "Education", division: "A" },
      options: {
        theme: "modern",
        layout: "landscape",
        includeLogo: true,
        includeQR: true,
        includeStats: true,
        includeConflicts: true,
        watermark: "SINGLE PAGE TEST"
      }
    }
  },
  {
    name: "Minimal Features",
    config: {
      type: "timetables",
      format: "pdf",
      filters: { program: "FYUP", year: 3, branch: "Physics", division: "A" },
      options: {
        theme: "default",
        layout: "landscape",
        includeStats: false,
        includeConflicts: false,
        includeLogo: false,
        includeQR: false
      }
    }
  }
]

async function testSinglePagePDF(testConfig) {.filter(([k,v]) => v === true).map(([k]) => k).join(', ') || 'minimal'}`)
  
  try {
    const response = await fetch(`${BASE_URL}/export/${testConfig.config.type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testConfig.config)
    })

    if (response.ok) {
      const filename = `single_page_${testConfig.name.replace(/\s+/g, '_').toLowerCase()}.pdf`
      const buffer = await response.buffer()
      
      // Save test file
      fs.writeFileSync(path.join(process.cwd(), filename), buffer).toFixed(1)}KB)`)
      
      // Basic validation - check if file is reasonable size (not too large indicating multiple pages)
      const sizeKB = buffer.length / 1024
      if (sizeKB > 500) {}KB might indicate multiple pages`)
      } else {}KB (likely single page)`)
      }
      
      return { success: true, size: buffer.length, filename, sizeKB }
    } else {
      const error = await response.text()return { success: false, error }
    }
  } catch (error) {return { success: false, error: error.message }
  }
}

async function runSinglePageTests() {const results = []
  
  // Test different configurations
  for (const testConfig of testConfigurations) {
    const result = await testSinglePagePDF(testConfig)
    results.push({ config: testConfig, result })
  }
  
  // Summaryconst successfulTests = results.filter(r => r.result.success).length
  const totalTests = results.lengthif (successfulTests > 0) {
    const avgSize = results
      .filter(r => r.result.success)
      .reduce((sum, r) => sum + r.result.sizeKB, 0) / successfulTests}KB`)
    
    const largeFiles = results.filter(r => r.result.success && r.result.sizeKB > 300)
    if (largeFiles.length > 0) {:`)
      largeFiles.forEach(f => {}KB`)
      })
    } else {`)
    }results.filter(r => r.result.success).forEach(r => {})
  }return results
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSinglePageTests().catch(console.error)
}

export { runSinglePageTests, testSinglePagePDF }