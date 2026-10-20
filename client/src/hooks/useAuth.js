import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/** Access the auth state and actions from any component. */
export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
