import type { IAuthUser } from '../../auth/types/auth-types'
import { fetchProfile } from '../api/profile-api'

export async function getProfile(user: IAuthUser) {
  return fetchProfile(user)
}
