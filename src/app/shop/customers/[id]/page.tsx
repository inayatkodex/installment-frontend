"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import CustomerProfile from "@/components/shop/customer-profile/CustomerProfile";
import { CustomerProfileSkeleton } from "@/components/shop/skeletons/ShopSkeletons";
import CommonBtn from "@/components/common/CommonButton/Button";
import { ROUTES } from "@/constant/appRoutes";
import ConfirmModal from "@/components/common/modal/confirm-modal/ConfirmModal";
import { showToast } from "@/shared/toastUtils";
import {
  archiveCustomer,
  clearCustomerDetail,
  deleteCustomer,
  fetchCustomerDetail,
  undoDeleteCustomer,
} from "@/store/slices/shop/customers/shopCustomersSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { formatRs } from "@/shared/formatUtils";
import "./customer-detail.scss";

const CustomerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [askDelete, setAskDelete] = useState(false);
  const [askArchive, setAskArchive] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { detail, error } = useAppSelector((s) => s.shopCustomers);

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
      showToast(
        <span>
          Delete ho gaya. 7 din tak wapas la sakte hain{" "}
          <button
            type="button"
            onClick={() => {
              void dispatch(undoDeleteCustomer(id))
                .unwrap()
                .then(() => showToast("Customer wapas aa gaya", "success"))
                .catch((e: unknown) =>
                  showToast(
                    typeof e === "string" ? e : "Customer wapas nahi aa saka",
                    "error",
                  ),
                );
            }}
          >
            Undo
          </button>
        </span>,
        "success",
        undefined,
        { autoClose: false },
      );
      router.push(ROUTES.SHOP.CUSTOMERS);
    } catch (e) {
      showToast(
        typeof e === "string" ? e : "Customer delete nahi ho saka",
        "error",
      );
      setDeleting(false);
    }
  };

  const confirmArchive = async () => {
    setDeleting(true);
    try {
      await dispatch(archiveCustomer(id)).unwrap();
      showToast("Customer archive ho gaya", "success");
      router.push(ROUTES.SHOP.ARCHIVED_CUSTOMERS);
    } catch (e) {
      showToast(
        typeof e === "string" ? e : "Customer archive nahi ho saka",
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
          onArchive={() => setAskArchive(true)}
        />
      ) : error ? (
        <div className="cd-error" role="alert">
          <p>{error}</p>
          <CommonBtn text="Dobara koshish karein" onClick={load} />
        </div>
      ) : (
        <CustomerProfileSkeleton />
      )}
      {askDelete && detail && (
        <ConfirmModal
          title="Customer delete karein?"
          message={
            <>
              Kya aap {detail.name} ko delete karna chahte hain?
              {(detail.remaining > 0 || detail.hasPayments) && (
                <strong className="cd-delete-warning">
                  Is customer ka {formatRs(detail.remaining)} baqaya hai /{" "}
                  {formatRs(detail.paid)} wasool ho chuka hai. Phir bhi delete
                  karein?
                </strong>
              )}
            </>
          }
          confirmText="Haan"
          cancelText="Nahi"
          tone="danger"
          loading={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setAskDelete(false)}
        />
      )}
      {askArchive && (
        <ConfirmModal
          title="Customer archive karein?"
          message="Yeh mukammal customer main list se hat jayega. Archived list se wapas la sakte hain."
          confirmText="Haan"
          cancelText="Nahi"
          loading={deleting}
          onConfirm={confirmArchive}
          onCancel={() => setAskArchive(false)}
        />
      )}
    </div>
  );
};

export default CustomerDetailPage;
