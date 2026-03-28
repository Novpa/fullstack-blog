import { create } from "zustand";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "READER" | "AUTHOR";
  createdAt: string;
}

interface State {
  accessToken: string | null;
  user: User | null;
  isInitializing: boolean;
}

interface Action {
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setInitializing: (boolean: boolean) => void;
}

export const useAuthStore = create<State & Action>((set) => ({
  accessToken: null,
  user: null,
  isInitializing: true,

  setAuth: (token, user) => set({ accessToken: token, user }),
  clearAuth: () => set({ accessToken: null, user: null }),
  setInitializing: (boolean) => set({ isInitializing: boolean }),
}));
