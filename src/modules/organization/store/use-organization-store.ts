import { create } from 'zustand'
import type { ICompanySetup, UserRoleType } from '../types/organization-types'

interface IOrganizationState {
  company: ICompanySetup
  currentStep: number
  role: UserRoleType
  setCompany: (company: ICompanySetup) => void
  setRole: (role: UserRoleType) => void
  setStep: (step: number) => void
}

export const useOrganizationStore = create<IOrganizationState>((set) => ({
  company: {
    companyName: '',
    employeeBand: '201-1000 employees',
    headName: '',
    location: 'Chennai',
  },
  currentStep: 0,
  role: 'HR Admin',
  setCompany: (company) => set({ company }),
  setRole: (role) => set({ role }),
  setStep: (currentStep) => set({ currentStep }),
}))
