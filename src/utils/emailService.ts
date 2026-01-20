// Email service using backend API with Nodemailer
export interface BookingEmailData {
  guestName: string
  guestEmail: string
  hotelName: string
  roomType: string
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  total: number
  bookingId: string
  paymentId?: string
}

export class EmailService {
  private static readonly API_BASE_URL = 'http://localhost:5000/api'

  static async sendBookingConfirmation(bookingData: BookingEmailData): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/email/booking-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: bookingData.guestEmail,
          guestName: bookingData.guestName,
          hotelName: bookingData.hotelName,
          roomType: bookingData.roomType,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          nights: bookingData.nights,
          guests: bookingData.guests,
          total: bookingData.total,
          bookingId: bookingData.bookingId,
          paymentId: bookingData.paymentId
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        console.error('Email API Error:', result)
        return false
      }

      console.log('Email sent successfully:', result)
      return true
    } catch (error) {
      console.error('Email service error:', error)
      return false
    }
  }

  static async sendCustomEmail(to: string, subject: string, message: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: to,
          subject: subject,
          message: message
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        console.error('Custom email API Error:', result)
        return false
      }

      console.log('Custom email sent successfully:', result)
      return true
    } catch (error) {
      console.error('Custom email service error:', error)
      return false
    }
  }
}