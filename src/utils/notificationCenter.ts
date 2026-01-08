export interface Notification {
  id: string
  message: string
  type: 'error' | 'success' | 'info' | 'warning'
  timestamp: number
  read: boolean
}

export const addNotification = (message: string, type: 'error' | 'success' | 'info' | 'warning' = 'info') => {
  const notification: Notification = {
    id: Date.now().toString(),
    message,
    type,
    timestamp: Date.now(),
    read: false
  }
  
  const existing = JSON.parse(localStorage.getItem('notifications') || '[]')
  existing.unshift(notification)
  
  // Keep last 200 notifications and clean up old ones (older than 30 days)
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
  const filtered = existing.filter((n: Notification) => n.timestamp > thirtyDaysAgo).slice(0, 200)
  
  localStorage.setItem('notifications', JSON.stringify(filtered))
}

export const getNotifications = (): Notification[] => {
  return JSON.parse(localStorage.getItem('notifications') || '[]')
}

export const markAsRead = (id: string) => {
  const notifications = getNotifications()
  const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n)
  localStorage.setItem('notifications', JSON.stringify(updated))
}