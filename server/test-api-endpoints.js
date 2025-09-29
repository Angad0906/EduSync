#!/usr/bin/env node

/**
 * API Endpoints Test Script
 * Tests all the new API endpoints that MultiProgramDashboard needs
 */

import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3000/api'

// Test endpoints that MultiProgramDashboard is trying to access
const testEndpoints = [
  {
    name: "Courses API",
    url: `${BASE_URL}/courses?program=FYUP`,
    method: 'GET'
  },
  {
    name: "Timetables API", 
    url: `${BASE_URL}/timetables?program=FYUP`,
    method: 'GET'
  },
  {
    name: "Analytics Enrollment API",
    url: `${BASE_URL}/analytics/enrollment?program=FYUP`,
    method: 'GET'
  },
  {
    name: "Students API",
    url: `${BASE_URL}/students?program=FYUP`,
    method: 'GET'
  },
  {
    name: "Analytics Dashboard",
    url: `${BASE_URL}/analytics/dashboard?program=FYUP`,
    method: 'GET'
  },
  {
    name: "Course Statistics",
    url: `${BASE_URL}/courses/stats/overview?program=FYUP`,
    method: 'GET'
  },
  {
    name: "Timetable Statistics",
    url: `${BASE_URL}/timetables/stats/overview?program=FYUP`,
    method: 'GET'
  }
]

async function testEndpoint(endpoint) {try {
    const response = await fetch(endpoint.url, {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (response.ok) {
      const data = await response.json().substring(0, 100) + '...' : data}`)
      
      return { success: true, status: response.status, data }
    } else {
      const error = await response.text()}`)
      
      return { success: false, status: response.status, error }
    }
  } catch (error) {return { success: false, error: error.message }
  }
}

async function testServerHealth() {try {
    const response = await fetch(`${BASE_URL}/health`)
    if (response.ok) {
      const data = await response.json()return true
    } else {return false
    }
  } catch (error) {return false
  }
}

async function runAPITests() {// First check if server is running
  const serverHealthy = await testServerHealth()
  
  if (!serverHealthy) {return
  }
  
  const results = []
  
  // Test all endpoints
  for (const endpoint of testEndpoints) {
    const result = await testEndpoint(endpoint)
    results.push({ endpoint, result })
  }
  
  // Summaryconst successfulTests = results.filter(r => r.result.success).length
  const totalTests = results.lengthconst failedTests = results.filter(r => !r.result.success)
  if (failedTests.length > 0) {failedTests.forEach(test => {})
  }if (successfulTests === totalTests) {} else {}return results
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAPITests().catch(console.error)
}

export { runAPITests, testEndpoint }