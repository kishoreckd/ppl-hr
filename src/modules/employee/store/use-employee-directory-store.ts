import { create } from 'zustand'

export type EmployeeRoleType = 'Employee' | 'Manager' | 'Admin' | 'Custom'

export interface IEmployeeDirectoryRecord {
  department: string
  email: string
  id: string
  manager: string
  name: string
  role: string
}

interface IEmployeeDirectoryInput {
  customRole?: string
  department: string
  email: string
  manager: string
  name: string
  role: EmployeeRoleType
}

interface IEmployeeDirectoryStore {
  addEmployee: (input: IEmployeeDirectoryInput) => { ok: boolean; message: string }
  employees: IEmployeeDirectoryRecord[]
  roles: string[]
}

const INITIAL_ROLES = ['Employee', 'Manager', 'Admin', 'Product Manager', 'HRBP']

const INITIAL_EMPLOYEES: IEmployeeDirectoryRecord[] = [
  {
    department: 'Product Engineering',
    email: 'kishorekumardckap@gmail.com',
    id: 'emp-101',
    manager: 'Mugesh Rajapandiyan',
    name: 'Kishorekumardckap',
    role: 'Employee',
  },
  {
    department: 'Product Engineering',
    email: 'mugesh@cxontology.com',
    id: 'emp-102',
    manager: 'Leanna Alvord',
    name: 'Mugesh Rajapandiyan',
    role: 'Manager',
  },
]

export const useEmployeeDirectoryStore = create<IEmployeeDirectoryStore>((set, get) => ({
  addEmployee: (input) => {
    const name = input.name.trim()
    const email = input.email.trim().toLowerCase()
    const department = input.department.trim()
    const manager = input.manager.trim()

    if (!name || !email || !department || !manager) {
      return { message: 'Fill name, email, department, and manager.', ok: false }
    }

    const duplicate = get().employees.some((employee) => employee.email === email)
    if (duplicate) {
      return { message: 'Employee email already exists.', ok: false }
    }

    const nextRole =
      input.role === 'Custom'
        ? (input.customRole ?? '').trim()
        : input.role

    if (!nextRole) {
      return { message: 'Enter a custom role name.', ok: false }
    }

    set((state) => {
      const roleExists = state.roles.includes(nextRole)
      return {
        employees: [
          {
            department,
            email,
            id: `emp-${Date.now()}`,
            manager,
            name,
            role: nextRole,
          },
          ...state.employees,
        ],
        roles: roleExists ? state.roles : [...state.roles, nextRole],
      }
    })

    return { message: `${name} added successfully.`, ok: true }
  },
  employees: INITIAL_EMPLOYEES,
  roles: INITIAL_ROLES,
}))
