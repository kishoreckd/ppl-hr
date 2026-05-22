import type { IAuthSession, IAuthUser } from '../types/auth-types'
import type {
  EmailSchemaType,
  LoginSchemaType,
  ResetSchemaType,
  SignupSchemaType,
} from '../validations/auth-schema'

const SESSION_KEY = 'teampilot.auth.session'

function createToken(user: IAuthUser) {
  return `teampilot.${window.btoa(`${user.email}:${user.role}:${Date.now()}`)}.jwt`
}

function wait(duration: number) {
  return new Promise((resolve) => window.setTimeout(resolve, duration))
}

export async function login(values: LoginSchemaType): Promise<IAuthSession> {
  await wait(520)

  if (values.password.toLowerCase().includes('invalid')) {
    throw new Error('Invalid credentials. Check the work email and password.')
  }

  const role = getRoleFromEmail(values.email)

  return {
    token: createToken({
      email: values.email,
      name: values.email.split('@')[0].replace('.', ' '),
      role,
    }),
    user: {
      email: values.email,
      name: values.email.split('@')[0].replace('.', ' '),
      role,
    },
  }
}

export async function signup(values: SignupSchemaType): Promise<IAuthSession> {
  await wait(620)

  return {
    token: createToken(values),
    user: {
      email: values.email,
      name: values.name,
      role: values.role,
    },
  }
}

export async function requestReset(values: EmailSchemaType) {
  await wait(420)
  return values.email
}

export async function resetPassword(values: ResetSchemaType) {
  await wait(420)

  if (values.token === 'expired') {
    throw new Error('Reset token expired. Request a fresh password reset email.')
  }

  return true
}

export function loadSession(): IAuthSession | null {
  const rawSession = window.localStorage.getItem(SESSION_KEY)
  return rawSession ? (JSON.parse(rawSession) as IAuthSession) : null
}

export function persistSession(session: IAuthSession | null) {
  if (!session) {
    window.localStorage.removeItem(SESSION_KEY)
    return
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

function getRoleFromEmail(email: string) {
  if (email.toLowerCase().includes('admin')) {
    return 'Admin' as const
  }

  if (email.toLowerCase().includes('manager')) {
    return 'Manager' as const
  }

  return 'Employee' as const
}
