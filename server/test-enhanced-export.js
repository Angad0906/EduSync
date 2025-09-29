#!/usr/bin/env node

/**
 * Enhanced PDF Export Test Script
 * Tests the new advanced PDF export features
 */

import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

const BASE_URL = 'http://localhost:5000/api/export'

// Test configurations for different export scenarios
const testConfigurations = [
  {
    name: "Default Professional Export",
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
    name: "Dark Theme with QR Code",
    config: {
      type: "timetables", 
      format: "pdf",
      filters: { program: "FYUP", year: 2, branch: "Mathematics", division: "B" },
      options: {
        theme: "dark",
        layout: "landscape",
        includeQR: true,
        includeStats: true,
        watermark: "CONFIDENTIAL"
      }
    }
  },
  {
    name: "Modern Theme with Logo",
    config: {
      type: "timetables",
      format: "pdf", 
      filters: { program: "B.Ed.", year: 1, branch: "Education", division: "A" },
      options: {
        theme: "modern",
        layout: "landscape",
        includeLogo: true,
        includeStats: true,
        customColors: {
          primary: "#8b5cf6",
          accent: "#06d6a0"
        }
      }
    }
  },
  {
    name: "Compact Layout",
    config: {
      type: "timetables",
      format: "pdf",
      filters: { program: "FYUP", year: 3, branch: "Physics", division: "A" },
      options: {
        theme: "default",
        layout: "compact",
        includeStats: false,
        selectedDays: ["Monday", "Wednesday", "Friday"]
      }
    }
  }
]

async function testExportFeature(testConfig) {try {
    const response = await fetch(`${BASE_URL}/export/${testConfig.config.type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testConfig.config)
    })

    if (response.ok) {
      const filename = `test_${testConfig.name.replace(/\s+/g, '_').toLowerCase()}.pdf`
      const buffer = await response.buffer()
      
      // Save test file
      fs.writeFileSync(path.join(process.cwd(), filename), buffer).toFixed(1)}KB)`)
      
      // Check response headers
      const exportType = response.headers.get('X-Export-Type')
      const exportVersion = response.headers.get('X-Export-Version')
      if (exportType && exportVersion) {}
      
      return { success: true, size: buffer.length, filename }
    } else {
      const error = await response.text()return { success: false, error }
    }
  } catch (error) {return { success: false, error: error.message }
  }
}

async function testThemesEndpoint() {try {
    const response = await fetch(`${BASE_URL}/themes`)
    if (response.ok) {
      const themes = await response.json().join(', ')}`)
      
      Object.entries(themes).forEach(([key, theme]) => {})
      
      return { success: true, themes }
    } else {return { success: false }
    }
  } catch (error) {return { success: false, error: error.message }
  }
}

async function testPreviewEndpoint() {const previewConfig = {
    filters: { program: "FYUP", year: 1 },
    options: {
      theme: "modern",
      includeQR: true,
      includeStats: true,
      watermark: "PREVIEW"
    }
  }
  
  try {
    const response = await fetch(`${BASE_URL}/preview/timetables`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(previewConfig)
    })
    
    if (response.ok) {
      const preview = await response.json().filter(([k,v]) => v).map(([k]) => k).join(', ')}`)
      
      return { success: true, preview }
    } else {return { success: false }
    }
  } catch (error) {return { success: false, error: error.message }
  }
}

async function testBatchExport() {const batchConfig = {
    format: 'pdf',
    exports: [
      {
        type: 'timetables',
        filters: { program: 'FYUP', year: 1 },
        options: { theme: 'default' },
        customFilename: 'fyup_year1_timetables'
      },
      {
        type: 'timetables', 
        filters: { program: 'B.Ed.', year: 1 },
        options: { theme: 'modern', includeQR: true },
        customFilename: 'bed_year1_timetables'
      }
    ]
  }
  
  try {
    const response = await fetch(`${BASE_URL}/batch-export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batchConfig)
    })
    
    if (response.ok) {
      const result = await response.json()result.results.forEach((r, i) => {`)
      })
      
      return { success: true, result }
    } else {return { success: false }
    }
  } catch (error) {return { success: false, error: error.message }
  }
}

async function testAnalytics() {try {
    const response = await fetch(`${BASE_URL}/analytics?timeRange=7d`)
    
    if (response.ok) {
      const analytics = await response.json().map(([k,v]) => `${k}(${v}%)`).join(', ')}`).map(([k,v]) => `${k}(${v}%)`).join(', ')}`)}`)return { success: true, analytics }
    } else {return { success: false }
    }
  } catch (error) {return { success: false, error: error.message }
  }
}

async function runAllTests() {const results = {
    themes: await testThemesEndpoint(),
    preview: await testPreviewEndpoint(),
    batchExport: await testBatchExport(),
    analytics: await testAnalytics(),
    exports: []
  }
  
  // Test different export configurations
  for (const testConfig of testConfigurations) {
    const result = await testExportFeature(testConfig)
    results.exports.push({ config: testConfig, result })
  }
  
  // Summaryconst successfulExports = results.exports.filter(e => e.result.success).length
  const totalExports = results.exports.lengthif (successfulExports > 0) {
    const totalSize = results.exports
      .filter(e => e.result.success)
      .reduce((sum, e) => sum + e.result.size, 0).toFixed(1)}KB`).map(e => e.result.filename).join(', ')}`)
  }return results
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error)
}

export { runAllTests, testExportFeature, testThemesEndpoint }