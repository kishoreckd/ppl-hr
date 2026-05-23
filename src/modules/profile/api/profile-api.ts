import type { IAuthUser } from '../../auth/types/auth-types'
import { buildProfile } from '../constants/profile-data'

function wait(duration: number) {
  return new Promise((resolve) => window.setTimeout(resolve, duration))
}

export async function fetchProfile(user: IAuthUser) {
  await wait(360)
  return buildProfile(user)
}
