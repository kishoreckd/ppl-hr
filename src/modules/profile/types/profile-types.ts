import type { IAuthUser } from '../../auth/types/auth-types'

export type ProfileSectionType = 'overview' | 'contact' | 'interests'

export interface IProfileContact {
  email: string
  phone: string
  workLocation: string
  address: string
}

export interface IProfileEmployment {
  businessUnit: string
  department: string
  designation: string
  employeeId: string
  hrbp: string
  manager: string
  shift: string
}

export interface IProfileInterest {
  label: string
  tone: 'brand' | 'success' | 'warning' | 'neutral'
}

export interface IProfileActivity {
  label: string
  value: string
}

export interface IEmployeeProfile {
  about: string
  activities: IProfileActivity[]
  bio: string
  contact: IProfileContact
  employment: IProfileEmployment
  interests: IProfileInterest[]
  managerNote: string
  profileCompleteness: number
  user: IAuthUser
}
