#!/usr/bin/env node

/**
 * Test ML Endpoints
 * Simple script to test if the ML endpoints are working
 */

import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3001'

async function testMLEndpoints() {)
  
  const tests = [
    {
      name: 'Health Check',
      url: `${BASE_URL}/api/health`,
      method: 'GET'
    },
    {
      name: 'ML Status',
      url: `${BASE_URL}/api/ml/status`,
      method: 'GET'
    }
  ]
  
  for (const test of tests) {
    try {const response = await fetch(test.url, { method: test.method })
      
      if (response.ok) {
        const data = await response.json())
      } else {}
    } catch (error) {}})}

// Run tests
testMLEndpoints().catch(console.error)
