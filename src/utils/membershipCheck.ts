import axios from 'axios'

export async function checkExclusiveMembership(email: string): Promise<boolean> {
  try {
    const response = await axios.post('https://thegrandstay.azurewebsites.net/api/auth/check-exclusive-member', { email })
    return response.data.isExclusive || false
  } catch {
    return false
  }
}
