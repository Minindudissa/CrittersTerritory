import { callAdminAuthApi } from "@/services";
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AdminAuthContext = createContext(null);

function AdminAuthContextProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAdminCookie = async () => {
      const data = await callAdminAuthApi();

      if (!data?.success) {
        navigate(location.pathname.includes("/admin") ? "/auth/admin/login" : location.pathname);
        return;
      }

      setAdmin(data?.adminInfo);

      if (data?.adminInfo?.firstName === "Admin") {
        if (location.pathname.includes("/admin")) {
          navigate("/admin/profile");
        }
      } else {
        const restrictedPaths = [
          "/admin/variations",
          "/admin/page-top-banner",
          "/admin/registerAdmin",
          "/admin/category",
          "/admin/vouchers-discounts",
        ];
        
        if (data?.adminInfo?.accountStatus !== 2 && restrictedPaths.includes(location.pathname)) {
          navigate("/admin/controlRoom");
        } else if (location.pathname === "/auth/admin" || location.pathname === "/auth/admin/login") {
          navigate("/admin/dashboard");
        }
      }
    };

    verifyAdminCookie();
  }, [navigate, location.pathname]);

  return (
    <AdminAuthContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export default AdminAuthContextProvider;
