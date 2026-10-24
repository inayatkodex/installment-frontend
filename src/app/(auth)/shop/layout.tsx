import React from "react";

const ShopAuthLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="shop-auth-layout">
      <div className="shop-auth-layout-content">{children}</div>
    </div>
  );
};

export default ShopAuthLayout;
