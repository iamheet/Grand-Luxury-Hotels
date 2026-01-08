import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addNotification } from '../utils/notificationCenter'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: credentials.username.trim(),
          password: credentials.password.trim()
        })
      })
      
      const data = await response.json()
      
      console.log('Login response:', data) // Debug log
      
      if (data.success) {
        // Store JWT token and admin info
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminAuth', 'true')
        
        // ONLY admin/luxury2024 gets main admin access
        if (data.admin.type === 'super') {
          localStorage.setItem('adminType', 'super')
          localStorage.removeItem('currentHotel')
          localStorage.removeItem('subAdminData')
          navigate('/admin-dashboard')
        } else {
          // ALL others go to sub-admin dashboard
          localStorage.setItem('adminType', 'subadmin')
          const subAdminData = data.subAdminData || data.hotelData || { name: data.admin.username || 'Admin' }
          localStorage.setItem('subAdminData', JSON.stringify(subAdminData))
          navigate('/subadmin-dashboard')
        }
        return
      } else {
        const errorMsg = data.message || 'Invalid credentials'
        setError(errorMsg)
        addNotification(errorMsg, 'error')
      }
    } catch (error) {
      const errorMsg = 'Server connection failed. Admin access requires server authentication.'
      setError(errorMsg)
      addNotification(errorMsg, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23, #1a1a2e, #16213e, #0f3460)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <div style={{
        background: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(20px)',
        padding: '50px',
        borderRadius: '30px',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(251, 191, 36, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        width: '100%',
        maxWidth: '450px',
        position: 'relative'
      }}>
        {/* Luxury Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '32px',
            boxShadow: '0 10px 30px rgba(251, 191, 36, 0.4)',
            animation: 'pulse 2s infinite'
          }}>
            👑
          </div>
          <h1 style={{
            fontSize: '36px',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px',
            fontWeight: '700',
            letterSpacing: '1px'
          }}>
            ADMIN PORTAL
          </h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            fontSize: '16px',
            fontWeight: '300',
            letterSpacing: '0.5px'
          }}>
            The Grand Stay Management System
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '25px', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(251, 191, 36, 0.7)',
              fontSize: '18px'
            }}>👤</div>
            <input
              type="text"
              placeholder="Administrator Username"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              autoComplete="off"
              style={{
                width: '100%',
                padding: '18px 18px 18px 50px',
                background: 'rgba(255,255,255,0.05)',
                border: '2px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '15px',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#fbbf24'
                e.target.style.boxShadow = '0 0 20px rgba(251, 191, 36, 0.3)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(251, 191, 36, 0.3)'
                e.target.style.boxShadow = 'none'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '30px', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(251, 191, 36, 0.7)',
              fontSize: '18px'
            }}>🔐</div>
            <input
              type="password"
              placeholder="Secure Password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              autoComplete="new-password"
              style={{
                width: '100%',
                padding: '18px 18px 18px 50px',
                background: 'rgba(255,255,255,0.05)',
                border: '2px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '15px',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#fbbf24'
                e.target.style.boxShadow = '0 0 20px rgba(251, 191, 36, 0.3)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(251, 191, 36, 0.3)'
                e.target.style.boxShadow = 'none'
              }}
              required
            />
          </div>

          {error && (
            <div style={{ 
              color: '#ef4444', 
              marginBottom: '25px', 
              textAlign: 'center',
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              fontSize: '14px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: isLoading 
                ? 'rgba(251, 191, 36, 0.5)' 
                : 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
              color: '#0f0f23',
              padding: '18px',
              border: 'none',
              borderRadius: '15px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              transform: isLoading ? 'scale(0.98)' : 'scale(1)',
              boxShadow: isLoading ? 'none' : '0 10px 30px rgba(251, 191, 36, 0.3)',
              marginBottom: '15px'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'scale(1.02)'
                e.target.style.boxShadow = '0 15px 40px rgba(251, 191, 36, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'scale(1)'
                e.target.style.boxShadow = '0 10px 30px rgba(251, 191, 36, 0.3)'
              }
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(15, 15, 35, 0.3)',
                  borderTop: '2px solid #0f0f23',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Authenticating...
              </div>
            ) : (
              <>🚀 ACCESS ADMIN PORTAL</>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            style={{
              width: '100%',
              background: 'transparent',
              color: 'rgba(251, 191, 36, 0.8)',
              padding: '12px',
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Forgot Password?
          </button>
        </form>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}