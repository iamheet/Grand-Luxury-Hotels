// WhatsApp service using backend API
export interface WhatsAppMessage {
  to: string
  type: 'text' | 'template'
  text?: {
    body: string
  }
  template?: {
    name: string
    language: {
      code: string
    }
    components?: any[]
  }
}

export class WhatsAppService {
  private static readonly API_BASE_URL = 'http://localhost:5000/api'

  static async sendMessage(message: WhatsAppMessage): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/whatsapp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: message.to,
          message: message.text?.body || ''
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        console.error('WhatsApp API Error:', result)
        return false
      }

      console.log('WhatsApp message sent successfully:', result)
      return true
    } catch (error) {
      console.error('WhatsApp service error:', error)
      return false
    }
  }

  static async sendBookingConfirmation(phoneNumber: string, bookingDetails: {
    hotelName: string
    roomType: string
    checkIn: string
    checkOut: string
    guestName: string
    bookingId: string
    nights?: number
    total?: number
  }): Promise<boolean> {
    try {
      // Send direct WhatsApp message to your number (hotel owner)
      const hotelOwnerNumber = '919825123456' // Replace with your actual WhatsApp number
      
      const message = `🏨 *NEW BOOKING ALERT*\n\n` +
        `📋 *Booking Details:*\n` +
        `🆔 Booking ID: ${bookingDetails.bookingId}\n` +
        `👤 Guest: ${bookingDetails.guestName}\n` +
        `🏨 Hotel: ${bookingDetails.hotelName}\n` +
        `🛏️ Room: ${bookingDetails.roomType}\n` +
        `📅 Check-in: ${bookingDetails.checkIn}\n` +
        `📅 Check-out: ${bookingDetails.checkOut}\n` +
        `🌙 Nights: ${bookingDetails.nights || 1}\n` +
        `💰 Total: ₹${bookingDetails.total || 0}\n` +
        `📱 Guest Phone: ${phoneNumber}\n\n` +
        `✅ *Booking Confirmed Successfully!*`

      const response = await fetch(`${this.API_BASE_URL}/whatsapp/send-direct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: hotelOwnerNumber,
          message: message
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        console.error('WhatsApp notification error:', data)
        return false
      }

      console.log('WhatsApp booking notification sent to hotel owner:', data)
      return true
    } catch (error) {
      console.error('WhatsApp booking notification error:', error)
      return false
    }
  }

  static async sendPaymentConfirmation(phoneNumber: string, paymentDetails: {
    amount: number
    paymentId: string
    guestName: string
  }): Promise<boolean> {
    try {
      // Send payment confirmation to hotel owner
      const hotelOwnerNumber = '919825123456' // Replace with your actual WhatsApp number
      
      const message = `💳 *PAYMENT RECEIVED*\n\n` +
        `✅ Payment Successful!\n` +
        `👤 Guest: ${paymentDetails.guestName}\n` +
        `💰 Amount: ₹${paymentDetails.amount}\n` +
        `🆔 Payment ID: ${paymentDetails.paymentId}\n` +
        `📱 Guest Phone: ${phoneNumber}\n\n` +
        `🎉 *Booking Payment Confirmed!*`

      const response = await fetch(`${this.API_BASE_URL}/whatsapp/send-direct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: hotelOwnerNumber,
          message: message
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        console.error('WhatsApp payment notification error:', result)
        return false
      }

      console.log('WhatsApp payment notification sent to hotel owner:', result)
      return true
    } catch (error) {
      console.error('WhatsApp payment notification error:', error)
      return false
    }
  }

  static async sendCheckInReminder(phoneNumber: string, reminderDetails: {
    guestName: string
    hotelName: string
    checkInDate: string
    bookingId: string
  }): Promise<boolean> {
    const message: WhatsAppMessage = {
      to: phoneNumber,
      type: 'text',
      text: {
        body: `⏰ *Check-in Reminder*\n\nHi ${reminderDetails.guestName},\n\nThis is a friendly reminder that your check-in is tomorrow!\n\n📍 Hotel: ${reminderDetails.hotelName}\n📅 Check-in Date: ${reminderDetails.checkInDate}\n🆔 Booking ID: ${reminderDetails.bookingId}\n\nWe look forward to welcoming you! 🎉`
      }
    }

    return this.sendMessage(message)
  }

  static formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '')
    
    // Add country code if not present (assuming India +91)
    if (cleaned.length === 10) {
      return `91${cleaned}`
    }
    
    // If already has country code, return as is
    if (cleaned.length > 10) {
      return cleaned
    }
    
    return cleaned
  }
}