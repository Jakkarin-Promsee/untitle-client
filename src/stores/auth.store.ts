import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "trainer" | "admin";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isCheckingSession: boolean;
  hasHydrated: boolean;
  error: string | null;
  login: (
    email: string,
    password: string,
    portal?: "user" | "trainer" | "admin",
  ) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  createTrainer: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;
  validateSession: () => Promise<void>;
  setHasHydrated: (value: boolean) => void;
  logout: () => void;
}

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as { exp?: number };
    if (!payload.exp) return false;
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ── Persisted data ──────────────────────
      user: null,
      token: null,

      // ── NOT persisted (but inside persist is fine) ──
      isLoading: false,
      isCheckingSession: false,
      hasHydrated: false,
      error: null,

      // ── Functions ───────────────────────────
      login: async (email, password, portal = "user") => {
        set({ isLoading: true, error: null });
        const res = await api.post("/auth/login", { email, password, portal });
        set({ user: res.data.user, token: res.data.token, isLoading: false });
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        const res = await api.post("/auth/register", { name, email, password });
        set({ user: res.data.user, token: res.data.token, isLoading: false });
      },

      createTrainer: async (name, email, password) => {
        set({ isLoading: true, error: null });
        await api.post("/auth/admin/create-trainer", { name, email, password });
        set({ isLoading: false });
      },

      validateSession: async () => {
        const { token, user } = get();

        // Inconsistent persisted state should be cleared immediately.
        if ((token && !user) || (!token && user)) {
          set({ user: null, token: null, isCheckingSession: false });
          return;
        }

        if (!token || !user) {
          set({ isCheckingSession: false });
          return;
        }

        if (!["user", "trainer", "admin"].includes(user.role)) {
          set({ user: null, token: null, isCheckingSession: false });
          return;
        }

        if (isTokenExpired(token)) {
          set({ user: null, token: null, isCheckingSession: false });
          return;
        }

        set({ isCheckingSession: true });
        console.log("Checking session...", token);
        try {
          const res = await api.get("/auth/me");
          set({
            user: res.data.user,
            token: res.data.token,
            isCheckingSession: false,
          });
        } catch {
          set({ user: null, token: null, isCheckingSession: false });
        }
      },

      setHasHydrated: (value) => set({ hasHydrated: value }),

      logout: () => {
        set({ user: null, token: null, isCheckingSession: false, error: null });
      },
    }),
    {
      name: "auth-storage",
      // ✅ Only persist what matters
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        void state?.validateSession();
      },
    },
  ),
);
