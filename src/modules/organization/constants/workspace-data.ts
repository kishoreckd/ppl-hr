import type { IOrganizationWorkspace } from '../types/organization-types'

export const SETUP_STEPS = ['Company', 'Hierarchy', 'Policy and AI'] as const

export const USER_ROLES = ['HR Admin', 'Manager', 'Employee'] as const

export const ORGANIZATION_WORKSPACE: IOrganizationWorkspace = {
  approvals: [
    {
      chain: 'Asha Menon > HRBP South',
      employee: 'Nikhil Rao',
      id: 'REG-218',
      policyImpact: 'Missing punch affects payroll sync',
      request: 'Attendance regularization',
      sla: '1h 42m',
      status: 'Escalating',
    },
    {
      chain: 'Maya Singh > Finance Ops',
      employee: 'Irina George',
      id: 'LEV-902',
      policyImpact: 'Sandwich rule review required',
      request: 'Earned leave',
      sla: '5h 10m',
      status: 'Policy check',
    },
    {
      chain: 'Product Director',
      employee: 'Arun Kumar',
      id: 'OKR-144',
      policyImpact: 'Q3 KR ownership moves teams',
      request: 'Cross-team OKR alignment',
      sla: 'Today',
      status: 'Pending',
    },
  ],
  hierarchy: [
    { count: 1, label: 'Company head', owner: 'CXO Office' },
    { count: 3, label: 'Business units', owner: 'India and US Ops' },
    { count: 12, label: 'Departments', owner: 'Functional leaders' },
    { count: 46, label: 'Teams', owner: 'People managers' },
  ],
  holidays: [
    { date: '2026-05-28', title: 'Chennai optional holiday' },
    { date: '2026-06-05', title: 'US shift observance' },
    { date: '2026-06-19', title: 'Regional payroll freeze' },
  ],
  metrics: [
    { label: 'Headcount mapped', trend: '+38 onboarded', value: '684' },
    { label: 'Approval SLA health', trend: '94% in chain', value: '2.4h' },
    { label: 'Attendance anomalies', trend: '12 need manager action', value: '31' },
    { label: 'OKR alignment', trend: '+7% this cycle', value: '86%' },
  ],
}
