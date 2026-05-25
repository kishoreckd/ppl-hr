export type UserRoleType = 'HR Admin' | 'Manager' | 'Employee'
export type ApprovalStatusType = 'Pending' | 'Escalating' | 'Policy check'

export interface ICompanySetup {
  adminEmployees: string
  companyDomain: string
  companyName: string
  companyWebsite: string
  email: string
  employeeBand: string
  firstName: string
  headName: string
  lastName: string
  location: string
}

export interface IApprovalRequest {
  id: string
  employee: string
  chain: string
  policyImpact: string
  request: string
  sla: string
  status: ApprovalStatusType
}

export interface IHierarchyNode {
  label: string
  owner: string
  count: number
}

export interface IWorkspaceMetric {
  label: string
  trend: string
  value: string
}

export interface IHolidayEvent {
  date: string
  title: string
}

export interface IOrganizationWorkspace {
  approvals: IApprovalRequest[]
  holidays: IHolidayEvent[]
  hierarchy: IHierarchyNode[]
  metrics: IWorkspaceMetric[]
}
