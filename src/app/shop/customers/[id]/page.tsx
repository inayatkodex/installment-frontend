"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import CustomerProfile from "@/components/shop/customer-profile/CustomerProfile";
import CommonBtn from "@/components/common/CommonButton/Button";
import Loader from "@/components/common/Loader/Loader";
import { ROUTES } from "@/constant/appRoutes";
import ConfirmModal from "@/components/common/modal/confirm-modal/ConfirmModal";
import { showToast } from "@/shared/toastUtils";
import {
  clearCustomerDetail,
  deleteCustomer,
  fetchCustomerDetail,
} from "@/store/slices/shop/customers/shopCustomersSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import "./customer-detail.scss";

const CustomerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [askDelete, setAskDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { detail, detailLoading, error } = useAppSelector(
    (s) => s.shopCustomers,
  );

  const load = useCallback(() => {
    dispatch(fetchCustomerDetail(id));
  }, [dispatch, id]);
  useEffect(() => {
    load();
    return () => {
      dispatch(clearCustomerDetail());
    };
  }, [load, dispatch]);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteCustomer(id)).unwrap();
      showToast("Customer delete ho gaya", "success");
      router.push(ROUTES.SHOP.CUSTOMERS);
    } catch (e) {
      showToast(
        typeof e === "string" ? e : "Customer delete nahi ho saka",
        "error",
      );
      setDeleting(false);
    }
  };

  return (
    <div className="customer-detail-page">
      <Link href={ROUTES.SHOP.CUSTOMERS} className="cd-back">
        <ChevronLeft size={22} aria-hidden="true" /> Customers
      </Link>
      {detail && detail.id === id ? (
        <CustomerProfile
          customer={detail}
          onPaid={load}
          onDelete={() => setAskDelete(true)}
        />
      ) : detailLoading ? (
        <Loader />
      ) : error ? (
        <div className="cd-error" role="alert">
          <p>{error}</p>
          <CommonBtn text="Dobara koshish karein" onClick={load} />
        </div>
      ) : null}
      {askDelete && detail && (
        <ConfirmModal
          title={`${detail.name} ko delete karein?`}
          message="Is ki saari qistein poori ho chuki hain. Delete karne ke baad yeh customer list se hat jayega."
          confirmText="Haan, delete karein"
          cancelText="Nahi"
          tone="danger"
          loading={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setAskDelete(false)}
        />
      )}
    </div>
  );
};

export default CustomerDetailPage;
