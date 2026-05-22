import { create } from 'zustand'

interface IUiState {
  dark: boolean
  toggleTheme: () => void
}

export const useUiStore = create<IUiState>((set) => ({
  dark: false,
  toggleTheme: () => set((state) => ({ dark: !state.dark })),
}))
