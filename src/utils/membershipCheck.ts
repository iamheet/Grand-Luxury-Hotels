import axios from 'axios'

export async function checkExclusiveMembership(email: string): Promise<boolean> {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/check-exclusive-member', { email })
    return response.data.isExclusive || false
  } catch {
    return false
  }
}
