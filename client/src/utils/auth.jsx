import axios from "axios"

const API_URL = "http://localhost:3000/api"

const checkServerConnection = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`, { timeout: 5000 })
    return true
  } catch (error) {
    console.error("[v0] Server connection failed:", error.message)
    if (error.code === "ECONNREFUSED") {
      console.error("[v0] Server is not running on port 3000")
    } else if (error.code === "TIMEOUT") {
      console.error("[v0] Server connection timed out")
    }
    return false
  }
}

// Login user and store in localStorage
export const login = async (email, password) => {
  try {const serverReachable = await checkServerConnection()
    if (!serverReachable) {
      throw new Error("Cannot connect to server. Please ensure the server is running on port 3000.")
    }

    const response = await axios.post(
      `${API_URL}/auth/login`,
      { email, password },
      {
        timeout: 10000, // 10 second timeout
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
    const userData = response.data

    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify(userData))
    return userData
  } catch (error) {
    console.error("[v0] Login error details:", error)

    if (error.code === "ECONNREFUSED") {
      throw new Error("Server is not running. Please start the server on port 3000.")
    } else if (error.code === "TIMEOUT") {
      throw new Error("Request timed out. Please check your connection.")
    } else if (error.response?.status === 401) {
      throw new Error("Invalid email or password. Please check your credentials.")
    } else if (error.response?.status === 500) {
      throw new Error("Server error. Please try again later.")
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error(error.message || "Login failed. Please try again.")
    }
  }
}

// Register user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData)
    return response.data
  } catch (error) {
    console.error("[v0] Registration error details:", error)
    console.error("[v0] Error response:", error.response?.data)
    console.error("[v0] Error status:", error.response?.status)
    console.error("[v0] Network error:", error.code)
    throw error
  }
}

// Get current user from localStorage
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user")
    if (!userStr) return null

    return JSON.parse(userStr)
  } catch (error) {
    return null
  }
}

// Update user profile in localStorage
export const updateUserProfile = (userData) => {
  try {
    localStorage.setItem("user", JSON.stringify(userData))
    return userData
  } catch (error) {
    throw error
  }
}

// Logout user
export const logout = () => {
  localStorage.removeItem("user")
  // Redirect to login page
  window.location.href = "/"
}

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getCurrentUser()
}

// Redirect based on user role
export const redirectBasedOnRole = (user) => {
  if (!user) return

  switch (user.role) {
    case "admin":
      window.location.href = "/admin-dashboard"
      break
    case "teacher":
      window.location.href = "/teacher-dashboard"
      break
    case "student":
      window.location.href = "/student-dashboard"
      break
    default:
      window.location.href = "/"
  }
}

// Add a function to validate user data
export const validateUserData = (user) => {
  if (!user) return false

  // Check for required fields based on role
  if (user.role === "student") {
    return !!user.year && !!user.department && !!user.division
  } else if (user.role === "teacher") {
    return !!user.department
  }

  return true
}
