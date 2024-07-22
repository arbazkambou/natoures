import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import UserNav from "../components/UserNav";
import AdminNav from "../components/AdminNav";
import { Outlet } from "react-router";

function Account() {
  const { user } = useContext(AuthContext);
  const { role } = user;

  return (
    <div className="user-view">
      <nav className="user-view__menu">
        <UserNav />
        {role === "admin" && <AdminNav />}
      </nav>

      <div className=" w-[100%] m-6 overflow-x-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default Account;
