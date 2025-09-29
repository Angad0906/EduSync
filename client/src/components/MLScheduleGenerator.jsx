"use client"

import { useState, useEffect } from "react"
import { mlAPI } from "../utils/api"
import { 
  Brain, 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Clock,
  Users,
  Building,
  Zap
} from "lucide-react"

const YEARS = [1, 2, 3, 4]
const BRANCHES = ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"]
const DIVISIONS = ["A", "B", "C"]
const PROGRAMS = ["FYUP", "B.Ed.", "M.Ed.", "ITEP"]

function MLScheduleGenerator({ onScheduleGenerated, onError }) {
  const [formData, setFormData] = useState({
    year: 1,
    branch: "Computer Science",
    division: "A",
    program: "FYUP"
  })
  const [mlOptions, setMlOptions] = useState({
    useMLGuidance: true,
    maxIterations: 100,
    optimizeForConflicts: true,
    optimizeForTeacherWorkload: true,
    optimizeForRoomUtilization: true
  })
  const [loading, setLoading] = useState(false)
  const [mlStatus, setMlStatus] = useState(null)
  const [generatedSchedule, setGeneratedSchedule] = useState(null)
  const [scheduleScore, setScheduleScore] = useState(null)

  useEffect(() => {
    checkMLStatus()
  }, [])

  const checkMLStatus = async () => {
    try {
      const status = await mlAPI.getStatus()
      setMlStatus(status)
    } catch (error) {}
  }

  const handleGenerateSchedule = async () => {
    setLoading(true)
    setGeneratedSchedule(null)
    setScheduleScore(null)

    try {
      const params = {
        ...formData,
        options: mlOptions
      }

      const result = await mlAPI.generateSchedule(params)
      
      if (result.success) {
        setGeneratedSchedule(result.schedule)
        setScheduleScore(result.schedule.mlScore)
        onScheduleGenerated?.(result.schedule)
      } else {
        throw new Error(result.error || "Failed to generate schedule")
      }
    } catch (error) {onError?.(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleScoreSchedule = async () => {
    if (!generatedSchedule) return

    try {
      const scoreResult = await mlAPI.scoreSchedule(generatedSchedule.timetable || generatedSchedule)
      setScheduleScore(scoreResult.score)
    } catch (error) {}
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">ML-Enhanced Schedule Generator</h2>
        {mlStatus?.mlModelLoaded && (
          <div className="flex items-center space-x-1 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">ML Ready</span>
          </div>
        )}
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

      {/* Schedule Parameters */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
          <select
            value={formData.year}
            onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {YEARS.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
          <select
            value={formData.branch}
            onChange={(e) => setFormData({...formData, branch: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {BRANCHES.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Division</label>
          <select
            value={formData.division}
            onChange={(e) => setFormData({...formData, division: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {DIVISIONS.map(division => (
              <option key={division} value={division}>{division}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
          <select
            value={formData.program}
            onChange={(e) => setFormData({...formData, program: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {PROGRAMS.map(program => (
              <option key={program} value={program}>{program}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ML Options */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ML Optimization Options</h3>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={mlOptions.useMLGuidance}
              onChange={(e) => setMlOptions({...mlOptions, useMLGuidance: e.target.checked})}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Use ML Guidance</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={mlOptions.optimizeForConflicts}
              onChange={(e) => setMlOptions({...mlOptions, optimizeForConflicts: e.target.checked})}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Optimize for Conflicts</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={mlOptions.optimizeForTeacherWorkload}
              onChange={(e) => setMlOptions({...mlOptions, optimizeForTeacherWorkload: e.target.checked})}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Optimize Teacher Workload</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={mlOptions.optimizeForRoomUtilization}
              onChange={(e) => setMlOptions({...mlOptions, optimizeForRoomUtilization: e.target.checked})}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Optimize Room Utilization</span>
          </label>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerateSchedule}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating ML Schedule...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Generate ML-Optimized Schedule</span>
          </>
        )}
      </button>

      {/* Schedule Score */}
      {scheduleScore && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-900">Schedule Quality Score</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-green-600">
              {(scheduleScore * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-green-800">
              {scheduleScore > 0.8 ? "Excellent" : 
               scheduleScore > 0.6 ? "Good" : 
               scheduleScore > 0.4 ? "Fair" : "Poor"}
            </div>
          </div>
        </div>
      )}

      {/* Generated Schedule Info */}
      {generatedSchedule && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">Schedule Generated Successfully</span>
          </div>
          <div className="text-sm text-blue-800">
            <p>Courses: {generatedSchedule.timetable?.length || 0}</p>
            <p>ML Enhanced: {generatedSchedule.mlScore ? 'Yes' : 'No'}</p>
            {generatedSchedule.mlInsights && (
              <p>Insights: {generatedSchedule.mlInsights.length} recommendations</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MLScheduleGenerator
