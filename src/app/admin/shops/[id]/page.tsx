"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import ShopDetail from "@/components/admin/shop-detail/ShopDetail";
import CommonBtn from "@/components/common/CommonButton/Button";
import Loader from "@/components/common/Loader/Loader";
import { ROUTES } from "@/constant/appRoutes";
import { fetchAdminShop } from "@/store/slices/admin/shops/adminShopsSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import "./shop-detail-page.scss";

const AdminShopDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { detail, detailLoading, error } = useAppSelector((s) => s.adminShops);

  useEffect(() => { dispatch(fetchAdminShop(id)); }, [dispatch, id]);

  return (
    <div className="admin-shop-detail-page">
      <Link href={ROUTES.ADMIN.SHOPS} className="asd-back"><ChevronLeft size={22} aria-hidden="true" /> Shops</Link>
      {detail && detail.id === id ? <ShopDetail shop={detail} /> : detailLoading ? <Loader /> : error ? (
        <div className="asd-error" role="alert"><p>{error}</p><CommonBtn text="Try again" onClick={() => dispatch(fetchAdminShop(id))} /></div>
      ) : null}
    </div>
  );
};

export default AdminShopDetailPage;
