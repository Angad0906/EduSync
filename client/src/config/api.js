// Centralized API Configuration
const getApiUrl = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://edusync-1-rn3w.onrender.com/api'
  }
  return 'http://localhost:3001/api'
}

export const API_BASE_URL = getApiUrl()

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: `${API_BASE_URL}/auth`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  
  // Schedule endpoints
  SCHEDULE: `${API_BASE_URL}/schedule`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/health`,
  
  // Other endpoints
  USERS: `${API_BASE_URL}/users`,
  COURSES: `${API_BASE_URL}/courses`,
  TIMETABLES: `${API_BASE_URL}/timetables`,
  ANALYTICS: `${API_BASE_URL}/analytics`,
  ML: `${API_BASE_URL}/ml`,
  TEACHING_PRACTICES: `${API_BASE_URL}/teaching-practices`,
  STUDENTS: `${API_BASE_URL}/students`,
  FIELD_WORKS: `${API_BASE_URL}/field-works`,
  SCENARIOS: `${API_BASE_URL}/scenarios`,
  EXPORT: `${API_BASE_URL}`
}

// Backward compatibility
export const API_URL = API_BASE_URL
export default API_ENDPOINTS