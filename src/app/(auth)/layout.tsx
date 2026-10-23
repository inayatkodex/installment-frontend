import React from "react";

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="auth-layout">
      <div className="auth-layout-content">{children}</div>
    </div>
  );
};

export default AuthLayout;
