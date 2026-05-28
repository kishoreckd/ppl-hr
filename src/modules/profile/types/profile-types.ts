import type { IAuthUser } from '../../auth/types/auth-types'

export type ProfileSectionType = 'overview' | 'contact' | 'interests' | 'documents'

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

export interface IProfileDocument {
  category: string
  lastUpdated: string
  title: string
  visibility: 'Employee' | 'Manager' | 'Admin' | 'Restricted'
}

export interface IEmployeeProfile {
  about: string
  activities: IProfileActivity[]
  bio: string
  contact: IProfileContact
  documents: IProfileDocument[]
  employment: IProfileEmployment
  interests: IProfileInterest[]
  managerNote: string
  profileCompleteness: number
  user: IAuthUser
}
