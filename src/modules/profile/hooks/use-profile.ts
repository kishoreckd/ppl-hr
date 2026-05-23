import { useQuery } from '@tanstack/react-query'
import type { IAuthUser } from '../../auth/types/auth-types'
import { getProfile } from '../services/profile-service'

export function useProfile(user: IAuthUser) {
  return useQuery({
    queryFn: () => getProfile(user),
    queryKey: ['profile', user.email],
  })
}
