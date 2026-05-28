import type { IAuthUser } from '../../auth/types/auth-types'
import type { IEmployeeProfile } from '../types/profile-types'

export function buildProfile(user: IAuthUser): IEmployeeProfile {
  const manager = user.role === 'Admin' ? 'Leadership Office' : user.role === 'Manager' ? 'Asha Menon' : 'Mugesh Rajapandiyan'
  const designation = user.role === 'Admin' ? 'HRMS Administrator' : user.role === 'Manager' ? 'Engineering Manager' : 'Product Engineer'

  return {
    about:
      user.role === 'Employee'
        ? 'Owns attendance hygiene, request quality, and consistent delivery across TeamPilot workflows.'
        : 'Drives execution quality, approvals, and cross-team coordination for attendance and leave operations.',
    activities: [
      { label: 'Attendance status', value: 'Present today' },
      { label: 'Last check in', value: '09:22 AM' },
      { label: 'Weekly hours', value: '38h 20m' },
      { label: 'Pending approvals', value: user.role === 'Employee' ? '1 request' : '6 requests' },
    ],
    bio:
      user.role === 'Employee'
        ? 'Product-focused engineer with a strong bias for clarity, ownership, and predictable execution.'
        : 'Operations-focused leader improving team quality, approval SLAs, and workforce reliability.',
    contact: {
      address: 'Chennai, Tamil Nadu, India',
      email: user.email,
      phone: '+91 98765 43210',
      workLocation: user.role === 'Admin' ? 'HQ - Hybrid' : 'Chennai Office - Hybrid',
    },
    documents:
      user.role === 'Employee'
        ? []
        : [
            {
              category: 'Identity',
              lastUpdated: '2026-05-22',
              title: 'Government ID metadata',
              visibility: user.role === 'Admin' ? 'Admin' : 'Manager',
            },
            {
              category: 'Compliance',
              lastUpdated: '2026-05-19',
              title: 'Signed policy acknowledgement',
              visibility: 'Restricted',
            },
          ],
    employment: {
      businessUnit: 'CXOntology',
      department: user.role === 'Admin' ? 'People Operations' : 'Product Engineering',
      designation,
      employeeId: user.role === 'Admin' ? 'TP-ADM-001' : user.role === 'Manager' ? 'TP-MGR-014' : 'TP-EMP-108',
      hrbp: 'Leanna Alvord',
      manager,
      shift: 'General Shift (US)',
    },
    interests: [
      { label: 'People analytics', tone: 'brand' },
      { label: 'Workflow automation', tone: 'success' },
      { label: 'OKR alignment', tone: 'warning' },
    ],
    managerNote:
      user.role === 'Employee'
        ? 'Keep profile details current for smoother approvals and manager visibility.'
        : 'Use this profile view to keep role, reporting, and collaboration metadata up to date.',
    profileCompleteness: user.role === 'Employee' ? 82 : 90,
    user,
  }
}
