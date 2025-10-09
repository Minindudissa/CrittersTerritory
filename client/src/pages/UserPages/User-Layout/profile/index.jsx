import { Outlet } from "react-router-dom";
import UserProfileSidePanel from "../../Common-Sections/SidePanel";

function UserProfileLayout() {
  return (
    <div className=" w-full h-full flex flex-row">
      <div>
        <UserProfileSidePanel />
      </div>
      <div className=" w-full">
        <Outlet />
      </div>
    </div>
  );
}

export default UserProfileLayout;
