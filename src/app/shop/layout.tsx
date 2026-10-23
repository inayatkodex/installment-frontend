import React from "react";
import Navbar from "@/components/shop/Navbar/Navbar";
import SideBar from "@/components/shop/sidebar/SideBar";

const ShopLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="shop-layout">
      <Navbar />
      <SideBar />
      <div className="shop-layout-content">{children}</div>
    </div>
  );
};

export default ShopLayout;
