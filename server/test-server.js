#!/usr/bin/env node

/**
 * Simple Server Test
 * Test if the server is running and ML endpoints work
 */

import http from 'http'

function testEndpoint(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data)
          resolve({ status: res.statusCode, data: jsonData })
        } catch (e) {
          resolve({ status: res.statusCode, data: data })
        }
      })
    })

    req.on('error', (err) => {
      reject(err)
    })

    req.end()
  })
}

async function testServer() {)
  
  const tests = [
    { name: 'Health Check', path: '/api/health' },
    { name: 'ML Status', path: '/api/ml/status' },
    { name: 'Root Endpoint', path: '/' }
  ]
  
  for (const test of tests) {
    try {const result = await testEndpoint(test.path)
      
      if (result.status === 200) {)
      } else {}
    } catch (error) {}})}

// Run tests
testServer().catch(console.error)
