import { callUserAuthApi } from "@/services";
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const UserAuthContext = createContext(null);

function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyUserCookie = async () => {
      try {
        setLoading(true);
        const data = await callUserAuthApi();

        if (data?.success && data?.userInfo) {
          setUser(data.userInfo);
          
          // If user is authenticated and trying to access login/register, redirect to home
          if (location.pathname === "/auth/login" || location.pathname === "/auth/register") {
            setTimeout(() => navigate("/"), 0);
          }
        } else {
          setUser(null);
          
          // User profile paths that require authentication
          const userProfilePaths = [
            "/user-profile/my-profile",
            "/user-profile/my-orders", 
            "/user-profile/settings",
            "/shipping-details",
          ];

          // If not authenticated and trying to access protected routes, redirect to login
          if (userProfilePaths.includes(location.pathname)) {
            setTimeout(() => navigate("/auth/login"), 0);
          }
        }
      } catch (error) {
        console.error("User auth verification failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUserCookie();
  }, [navigate, location.pathname]);

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
}

export default UserAuthContextProvider;