import { callUserAuthApi } from "@/services";
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const UserAuthContext = createContext(null);

function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyUserCookie = async () => {
      const data = await callUserAuthApi();

      if (data?.userInfo) {
        setUser(data?.userInfo);
      }

      const userProfilePaths = [
        "/user-profile/my-profile",
        "/user-profile/my-orders",
        "/user-profile/settings",
        "/shipping-details",
      ];

      // If the user is not authenticated, check if they are trying to access the user profile pages
      if (!data?.success) {
        // If trying to access profile pages, redirect to login
        if (userProfilePaths.includes(location.pathname)) {
          console.log(
            "Unauthorized access to profile page. Redirecting to login..."
          );

          // Use setTimeout to delay redirection and ensure it happens
          setTimeout(() => {
            navigate("/auth/login"); // Redirect to login if trying to access a profile page
          }, 0);
        }
      } else {
        // If the user is authenticated, check if they are trying to access the login or register pages
        if (
          location.pathname === "/auth/login" ||
          location.pathname === "/auth/register"
        ) {
          console.log(
            "User is already authenticated. Redirecting to home page..."
          );

          // Use setTimeout to delay redirection and ensure it happens
          setTimeout(() => {
            navigate("/"); // Redirect to home page if already authenticated
          }, 0);
        }
      }
    };

    // Check and handle the logic when component is mounted or pathname changes
    verifyUserCookie();
  }, [navigate, location.pathname]); // Ensure this runs when the pathname changes

  return (
    <UserAuthContext.Provider value={{ user, setUser }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export default UserAuthContextProvider;
