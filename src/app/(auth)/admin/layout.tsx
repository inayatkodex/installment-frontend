import React from "react";

const AdminAuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="admin-auth-layout">
      <div className="admin-auth-layout-content">{children}</div>
    </div>
  );
};

export default AdminAuthLayout;
