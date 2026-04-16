// OTP Service for phone and email verification - PHONE LOGIN DISABLED
export class OTPService {
  private static readonly API_BASE_URL = 'https://thegrandstay.azurewebsites.net/api'

  static async sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    return { success: false, message: 'Phone login feature has been disabled' }
  }

  static async sendEmailOTP(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/otp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        })
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response:', text)
        return { success: false, message: 'Server error - please check backend' }
      }

      const result = await response.json()
      
      if (!response.ok) {
        return { success: false, message: result.message || 'Failed to send email OTP' }
      }

      return { success: true, message: 'Email OTP sent successfully' }
    } catch (error) {
      console.error('Email OTP send error:', error)
      return { success: false, message: 'Backend not running or endpoint missing' }
    }
  }

  static async verifyEmailOTP(email: string, otp: string): Promise<{ success: boolean; message: string; token?: string }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: otp
        })
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response:', text)
        return { success: false, message: 'Server error - please check backend' }
      }

      const result = await response.json()
      
      if (!response.ok) {
        return { success: false, message: result.message || 'Invalid email OTP' }
      }

      return { 
        success: true, 
        message: 'Email OTP verified successfully',
        token: result.token 
      }
    } catch (error) {
      console.error('Email OTP verify error:', error)
      return { success: false, message: 'Backend not running or endpoint missing' }
    }
  }

  static async verifyOTP(phoneNumber: string, otp: string): Promise<{ success: boolean; message: string; token?: string }> {
    return { success: false, message: 'Phone login feature has been disabled' }
  }

  static formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '')
    
    // Add country code if not present (assuming India +91)
    if (cleaned.length === 10) {
      return `+91${cleaned}`
    }
    
    // If already has country code, return as is
    if (cleaned.length > 10) {
      return `+${cleaned}`
    }
    
    return phone
  }
}