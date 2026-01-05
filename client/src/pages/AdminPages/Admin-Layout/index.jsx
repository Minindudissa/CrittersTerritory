import { Outlet, useNavigate } from "react-router-dom";
import SidePanel from "../Common-Sections/SidePanel";
import { useContext } from "react";
import { AdminAuthContext } from "@/context/AdminAuthContext";

function AdminLayout() {
  const { admin } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  return (
    <div className=" w-full h-full flex flex-row">
      <div>
        <SidePanel />
      </div>
      <div
        className=" w-full"
        style={{
          backgroundImage:
            "url('/assets/Site_Images/black-370118_1920.webp')",
          backgroundSize: "cover", // or 'contain', depending on your need
          backgroundPosition: "center",
          minHeight: "100vh",
          height: "100%", // adjust the height as needed
          width: "100%",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
