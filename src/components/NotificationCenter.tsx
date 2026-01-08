import { useState, useEffect } from 'react'
import { getNotifications, markAsRead, type Notification } from '../utils/notificationCenter'

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  darkMode?: boolean
}

export default function NotificationCenter({ isOpen, onClose, darkMode = false }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (isOpen) {
      setNotifications(getNotifications())
    }
  }, [isOpen])

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
    setNotifications(getNotifications())
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error': return '❌'
      case 'success': return '✅'
      case 'warning': return '⚠️'
      default: return 'ℹ️'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'error': return 'border-red-200 bg-red-50'
      case 'success': return 'border-green-200 bg-green-50'
      case 'warning': return 'border-yellow-200 bg-yellow-50'
      default: return 'border-blue-200 bg-blue-50'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className={`relative w-96 max-h-[80vh] rounded-xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gradient-to-r from-gray-700 to-gray-600' : 'border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50'}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              🔔 Notifications
            </h3>
            <button
              onClick={onClose}
              className={`p-1 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              ✕
            </button>
          </div>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {notifications.length} total notifications
          </p>
        </div>
        
        <div className="overflow-y-auto max-h-96">
          {notifications.length === 0 ? (
            <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="text-4xl mb-2">🔕</div>
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    notification.read 
                      ? (darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200')
                      : getNotificationColor(notification.type)
                  } ${!notification.read ? 'shadow-sm' : ''}`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'} ${!notification.read ? 'font-medium' : ''}`}>
                        {notification.message}
                      </p>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}