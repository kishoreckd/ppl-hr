export type RegularizationStatusType = 'New Request' | 'On Hold' | 'Approved' | 'Rejected'

export interface IRegularizationRequest {
  dates: string
  days: number
  employeeName: string
  id: string
  status: RegularizationStatusType
  time: string
}
