import { callAdminAuthApi } from "@/services";
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AdminAuthContext = createContext(null);

function AdminAuthContextProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAdminCookie = async () => {
      try {
        setLoading(true);
        const data = await callAdminAuthApi();

        if (data?.success && data?.adminInfo) {
          setAdmin(data.adminInfo);
          
          // Admin is authenticated
          if (location.pathname === "/auth/admin/login") {
            // Redirect to appropriate admin page based on role/status
            if (data.adminInfo.accountStatus === 2) {
              setTimeout(() => navigate("/admin/controlRoom"), 0);
            } else {
              setTimeout(() => navigate("/admin/dashboard"), 0);
            }
          }
        } else {
          setAdmin(null);
          
          // If not authenticated and trying to access admin routes, redirect to admin login
          if (location.pathname.includes("/admin") && 
              !location.pathname.includes("/auth/admin")) {
            setTimeout(() => navigate("/auth/admin/login"), 0);
          }
        }
      } catch (error) {
        console.error("Admin auth verification failed:", error);
        setAdmin(null);
        
        // Redirect to admin login if on admin route and auth fails
        if (location.pathname.includes("/admin") && 
            !location.pathname.includes("/auth/admin")) {
          setTimeout(() => navigate("/auth/admin/login"), 0);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAdminCookie();
  }, [navigate, location.pathname]);

  const value = {
    admin,
    setAdmin,
    loading,
    isAuthenticated: !!admin,
    isSuperAdmin: admin?.firstName === "Admin",
    hasFullAccess: admin?.accountStatus !== 2,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export default AdminAuthContextProvider;