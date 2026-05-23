import type { IAuthUser } from '../../auth/types/auth-types'
import type { IEmployeeProfile } from '../types/profile-types'

export function buildProfile(user: IAuthUser): IEmployeeProfile {
  const manager = user.role === 'Admin' ? 'Leadership Office' : user.role === 'Manager' ? 'Asha Menon' : 'Mugesh Rajapandiyan'
  const designation = user.role === 'Admin' ? 'HRMS Administrator' : user.role === 'Manager' ? 'Engineering Manager' : 'Product Engineer'

  return {
    about: '',
    activities: [
      { label: 'Attendance status', value: 'Present today' },
      { label: 'Last check in', value: '09:22 AM' },
      { label: 'Weekly hours', value: '38h 20m' },
      { label: 'Pending approvals', value: user.role === 'Employee' ? '1 request' : '6 requests' },
    ],
    bio: '',
    contact: {
      address: '',
      email: user.email,
      phone: '',
      workLocation: '',
    },
    employment: {
      businessUnit: 'CXOntology',
      department: user.role === 'Admin' ? 'People Operations' : 'Product Engineering',
      designation,
      employeeId: user.role === 'Admin' ? 'TP-ADM-001' : user.role === 'Manager' ? 'TP-MGR-014' : 'TP-EMP-108',
      hrbp: 'Leanna Alvord',
      manager,
      shift: 'General Shift (US)',
    },
    interests: [],
    managerNote:
      user.role === 'Employee'
        ? 'Add bio, contact, and interests to complete the employee profile.'
        : 'Review team attendance exceptions before weekly workforce planning.',
    profileCompleteness: user.role === 'Employee' ? 28 : 72,
    user,
  }
}
