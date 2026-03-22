import { create } from "zustand";

interface State {
  userId: string;
  email: string;
  role: "AUTHOR" | "READER" | null;
  token: string;
}

interface Action {
  login: (
    userId: string,
    email: string,
    role: "AUTHOR" | "READER",
    token: string,
  ) => void;

  clearAuth: () => void;
}

export const useAuthStore = create<State & Action>((set) => ({
  userId: "",
  email: "",
  role: null,
  token: "",

  login: (userId, email, role, token) => {
    set({ userId, email, role, token });
  },

  clearAuth: () => set({ userId: "", email: "", role: null, token: "" }),
}));
