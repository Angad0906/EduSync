/**
 * API Configuration and ML Integration Utilities
 */

// Base API URL - Environment-based configuration
const getApiUrl = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://edusync-1-rn3w.onrender.com/api'
  }
  return 'http://localhost:3001/api'
}

export const API_URL = getApiUrl()
export const ML_API_URL = `${getApiUrl()}/ml`

// ML API endpoints
export const ML_ENDPOINTS = {
  STATUS: `${ML_API_URL}/status`,
  GENERATE_SCHEDULE: `${ML_API_URL}/generate-schedule`,
  OPTIMIZE_SCHEDULE: `${ML_API_URL}/optimize-schedule`,
  SCORE_SCHEDULE: `${ML_API_URL}/score-schedule`,
  SUGGESTIONS: (scheduleId) => `${ML_API_URL}/suggestions/${scheduleId}`,
  RECOMMENDATIONS: (courseId) => `${ML_API_URL}/recommendations/${courseId}`,
  TRAIN: `${ML_API_URL}/train`
}

// ML API functions
export const mlAPI = {
  // Check ML model status
  async getStatus() {
    const response = await fetch(ML_ENDPOINTS.STATUS)
    return response.json()
  },

  // Generate ML-optimized schedule
  async generateSchedule(params) {
    const response = await fetch(ML_ENDPOINTS.GENERATE_SCHEDULE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    return response.json()
  },

  // Optimize existing schedule
  async optimizeSchedule(scheduleId) {
    const response = await fetch(ML_ENDPOINTS.OPTIMIZE_SCHEDULE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduleId })
    })
    return response.json()
  },

  // Score schedule quality
  async scoreSchedule(schedule) {
    const response = await fetch(ML_ENDPOINTS.SCORE_SCHEDULE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schedule })
    })
    return response.json()
  },

  // Get optimization suggestions
  async getSuggestions(scheduleId) {
    const response = await fetch(ML_ENDPOINTS.SUGGESTIONS(scheduleId))
    return response.json()
  },

  // Get course recommendations
  async getRecommendations(courseId) {
    const response = await fetch(ML_ENDPOINTS.RECOMMENDATIONS(courseId))
    return response.json()
  },

  // Train ML model
  async trainModel() {
    const response = await fetch(ML_ENDPOINTS.TRAIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    return response.json()
  }
}

export default mlAPI
