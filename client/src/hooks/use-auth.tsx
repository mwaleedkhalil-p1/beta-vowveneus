import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "../lib/api-config";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, InsertUser>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | null>({
    queryKey: [API_ENDPOINTS.USER],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", API_ENDPOINTS.LOGIN, credentials);
      const data = await res.json();
      return data;
    },
    onSuccess: (data: { user: SelectUser; token: string }) => {
      // Store JWT token in localStorage
      localStorage.setItem('auth_token', data.token);
      queryClient.setQueryData([API_ENDPOINTS.USER], data.user);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      const res = await apiRequest("POST", API_ENDPOINTS.REGISTER, credentials);
      const data = await res.json();
      return data;
    },
    onSuccess: (data: { user: SelectUser; token: string }) => {
      // Store JWT token in localStorage
      localStorage.setItem('auth_token', data.token);
      queryClient.setQueryData([API_ENDPOINTS.USER], data.user);
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", API_ENDPOINTS.LOGOUT);
    },
    onSuccess: () => {
      // Remove JWT token from localStorage
      localStorage.removeItem('auth_token');
      queryClient.setQueryData([API_ENDPOINTS.USER], null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    },
    onError: (error: Error) => {
      // Even if logout fails, remove token locally
      localStorage.removeItem('auth_token');
      queryClient.setQueryData([API_ENDPOINTS.USER], null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
