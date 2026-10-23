import React from "react";
import Navbar from "@/components/admin/Navbar/Navbar";
import SideBar from "@/components/admin/sidebar/Sidebar";

const AdminLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="admin-layout">
      <Navbar />
      <SideBar />
      <div className="admin-layout-content">{children}</div>
    </div>
  );
};

export default AdminLayout;
