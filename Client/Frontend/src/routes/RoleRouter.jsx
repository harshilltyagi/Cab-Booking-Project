import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";

function RoleRouter() {
  const { user, profile, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (!profile) return <div>Loading profile ...</div>;

  if (profile.role === "driver") {
    return <Navigate to="/dashboard-driver" />;
  }

  return <Navigate to="/dashboard-rider" />;
}

export default RoleRouter;
