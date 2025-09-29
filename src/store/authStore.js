import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockUsers } from "../data/mockData";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Actions
      login: async (email, password) => {
        set({ loading: true, error: null });

        try {
          // Mock API call - find user in mock data
          const user = mockUsers.find(
            (u) => u.email === email && u.password === password
          );

          if (!user) {
            throw new Error("Email hoặc mật khẩu không đúng");
          }

          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 1000));

          set({
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
              profile: user.profile,
              business: user.business || null,
            },
            isAuthenticated: true,
            loading: false,
          });

          return { success: true };
        } catch (error) {
          set({ loading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      updateProfile: (profileData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              profile: { ...currentUser.profile, ...profileData },
            },
          });
        }
      },

      // Helper getters
      isAdmin: () => get().user?.role === "admin",
      isStaff: () => get().user?.role === "staff",
      isCustomer: () => get().user?.role === "customer",
    }),
    {
      name: "skaev-auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
