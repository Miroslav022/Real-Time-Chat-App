import { useAuth as useAuthContext } from "../context/AuthProvider";

export function useAuth() {
  return useAuthContext();
}
