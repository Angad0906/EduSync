"use client"

import { useState, useEffect } from "react"
import { mlAPI } from "../utils/api"
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  Zap,
  Target,
  BarChart3,
  Settings,
  RefreshCw
} from "lucide-react"

function MLOptimizationDashboard({ scheduleId, onOptimizationComplete }) {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [mlStatus, setMlStatus] = useState(null)
  const [optimizationResults, setOptimizationResults] = useState(null)

  useEffect(() => {
    if (scheduleId) {
      fetchSuggestions()
    }
    checkMLStatus()
  }, [scheduleId])

  const checkMLStatus = async () => {
    try {
      const status = await mlAPI.getStatus()
      setMlStatus(status)
    } catch (error) {}
  }

  const fetchSuggestions = async () => {
    if (!scheduleId) return

    setLoading(true)
    try {
      const result = await mlAPI.getSuggestions(scheduleId)
      if (result.success) {
        setSuggestions(result.suggestions)
      }
    } catch (error) {} finally {
      setLoading(false)
    }
  }

  const handleOptimizeSchedule = async () => {
    if (!scheduleId) return

    setLoading(true)
    try {
      const result = await mlAPI.optimizeSchedule(scheduleId)
      if (result.success) {
        setOptimizationResults(result)
        onOptimizationComplete?.(result.optimizedSchedule)
      }
    } catch (error) {} finally {
      setLoading(false)
    }
  }

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'reschedule':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'improve':
        return <TrendingUp className="w-4 h-4 text-yellow-500" />
      default:
        return <Target className="w-4 h-4 text-blue-500" />
    }
  }

  const getSuggestionColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200'
      case 'medium':
        return 'bg-yellow-50 border-yellow-200'
      case 'low':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">ML Optimization Dashboard</h2>
        </div>
        <button
          onClick={fetchSuggestions}
          disabled={loading}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* ML Status */}
      {mlStatus && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">ML Model Status</span>
          </div>
          <div className="text-sm text-blue-800">
            <p>Status: <span className="font-medium">{mlStatus.status}</span></p>
            <p>Model Loaded: <span className="font-medium">{mlStatus.mlModelLoaded ? 'Yes' : 'No'}</span></p>
          </div>
        </div>
      )}

      {/* Optimization Actions */}
      <div className="mb-6">
        <button
          onClick={handleOptimizeSchedule}
          disabled={loading || !scheduleId}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Optimizing...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Optimize Schedule with ML</span>
            </>
          )}
        </button>
      </div>

      {/* Optimization Results */}
      {optimizationResults && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-900">Optimization Complete</span>
          </div>
          <div className="text-sm text-green-800">
            <p>Original Score: {(optimizationResults.originalScore * 100).toFixed(1)}%</p>
            <p>Items Optimized: {optimizationResults.itemsToOptimize}</p>
            {optimizationResults.insights && (
              <p>Insights: {optimizationResults.insights.length} recommendations</p>
            )}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="w-4 h-4 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">ML Suggestions</h3>
          {suggestions.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {suggestions.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading suggestions...</span>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getSuggestionColor(suggestion.priority)}`}
              >
                <div className="flex items-start space-x-3">
                  {getSuggestionIcon(suggestion.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900 capitalize">
                        {suggestion.type} Suggestion
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                        suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {suggestion.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{suggestion.reason}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span>Current Score: {(suggestion.currentScore * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No suggestions available</p>
            <p className="text-sm">Generate a schedule to see ML recommendations</p>
          </div>
        )}
      </div>

      {/* ML Features */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-purple-900">Smart Optimization</span>
          </div>
          <p className="text-sm text-purple-800">
            AI-powered schedule optimization using machine learning
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-900">Quality Scoring</span>
          </div>
          <p className="text-sm text-green-800">
            Real-time schedule quality assessment and improvement
          </p>
        </div>
      </div>
    </div>
  )
}

export default MLOptimizationDashboard
