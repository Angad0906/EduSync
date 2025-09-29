import { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../config/api.js'

function APITest() {
  const [status, setStatus] = useState('Testing...')
  const [apiUrl, setApiUrl] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    const testAPI = async () => {
      try {
        setApiUrl(API_ENDPOINTS.HEALTH)
        console.log('Testing API URL:', API_ENDPOINTS.HEALTH)
        
        const response = await fetch(API_ENDPOINTS.HEALTH, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          setStatus(`✅ Connected! Server says: ${data.message}`)
        } else {
          setStatus(`❌ Server responded with status: ${response.status}`)
          setError(`HTTP ${response.status}: ${response.statusText}`)
        }
      } catch (err) {
        console.error('API Test Error:', err)
        setStatus('❌ Connection failed')
        setError(err.message)
      }
    }

    testAPI()
  }, [])

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-bold text-sm mb-2">API Connection Test</h3>
      <p className="text-xs mb-1"><strong>URL:</strong> {apiUrl}</p>
      <p className="text-xs mb-1"><strong>Status:</strong> {status}</p>
      {error && (
        <p className="text-xs text-red-600 mt-2"><strong>Error:</strong> {error}</p>
      )}
      <p className="text-xs text-gray-500 mt-2">
        Environment: {import.meta.env.PROD ? 'Production' : 'Development'}
      </p>
    </div>
  )
}

export default APITest