export type AuthRoleType = 'Employee' | 'Manager' | 'Admin'
export type AuthModeType = 'login' | 'signup' | 'forgot' | 'reset'

export interface IAuthUser {
  email: string
  name: string
  role: AuthRoleType
}

export interface IAuthSession {
  token: string
  user: IAuthUser
}
