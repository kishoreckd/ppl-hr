import { create } from 'zustand'
import type { ProfileSectionType } from '../types/profile-types'

interface IProfileState {
  activeSection: ProfileSectionType
  setActiveSection: (section: ProfileSectionType) => void
}

export const useProfileStore = create<IProfileState>((set) => ({
  activeSection: 'overview',
  setActiveSection: (activeSection) => set({ activeSection }),
}))
