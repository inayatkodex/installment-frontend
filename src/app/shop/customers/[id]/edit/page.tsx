"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Camera, ChevronLeft, FileText, Plus, Trash2 } from "lucide-react";
import CommonBtn from "@/components/common/CommonButton/Button";
import ConfirmModal from "@/components/common/modal/confirm-modal/ConfirmModal";
import FormInput from "@/components/common/ui/FormInput";
import DatePartsPicker from "@/components/common/ui/DatePartsPicker";
import Loader from "@/components/common/Loader/Loader";
import PhotoSourceSheet from "@/components/common/PhotoSourceSheet/PhotoSourceSheet";
import { ROUTES } from "@/constant/appRoutes";
import { fileToDataUrl, resolveMediaUrl } from "@/shared/imageUtils";
import {
  digits,
  maskCnic,
  maskMobile,
  maskMoney,
  toNumber,
} from "@/shared/formatUtils";
import { showToast } from "@/shared/toastUtils";
import {
  deleteCustomerDocument,
  fetchCustomerDetail,
  updateCustomer,
  updateCustomerBasePayment,
  updateCustomerPurchaseDate,
  updateCustomerPurchasePayment,
  uploadCustomerDocument,
} from "@/store/slices/shop/customers/shopCustomersSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import "./customer-edit.scss";

type DocKey = "cnicFront" | "cnicBack" | "other";

interface DocItemConfig {
  key: DocKey;
  label: string;
  labelUr: string;
}

const DOC_ITEMS: DocItemConfig[] = [
  { key: "cnicFront", label: "CNIC front", labelUr: "شناختی کارڈ آگے" },
  { key: "cnicBack", label: "CNIC back", labelUr: "شناختی کارڈ پیچھے" },
  { key: "other", label: "Other paper", labelUr: "دوسرا کاغذ" },
];

const CustomerEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { detail, detailLoading, error } = useAppSelector(
    (s) => s.shopCustomers,
  );

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    cnic: "",
    phone: "",
    address: "",
    firstDueDate: "",
    monthlyPayment: "",
    purchaseDates: {} as Record<string, string>,
    purchaseMonthlyPayments: {} as Record<string, string>,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [docs, setDocs] = useState<Record<DocKey, string | null>>({
    cnicFront: null,
    cnicBack: null,
    other: null,
  });
  const [initialized, setInitialized] = useState(false);
  const [pickDoc, setPickDoc] = useState<DocItemConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const load = useCallback(() => {
    dispatch(fetchCustomerDetail(id));
  }, [dispatch, id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (detail && detail.id === id && !initialized) {
      setFormData({
        name: detail.name || "",
        fatherName: detail.fatherName || "",
        cnic: detail.cnic || "",
        phone: detail.phone || "",
        address: detail.address || "",
        firstDueDate: detail.firstDueDate,
        monthlyPayment: String(
          detail.plans.find((plan) => plan.id === "base")?.monthly ??
            detail.monthly,
        ),
        purchaseDates: Object.fromEntries(
          detail.plans
            .filter((plan) => plan.id !== "base")
            .map((plan) => [plan.id, plan.firstDueDate ?? ""]),
        ),
        purchaseMonthlyPayments: Object.fromEntries(
          detail.plans
            .filter((plan) => plan.id !== "base")
            .map((plan) => [plan.id, String(plan.monthly)]),
        ),
      });
      setDocs({
        cnicFront: detail.documents?.cnicFront ?? null,
        cnicBack: detail.documents?.cnicBack ?? null,
        other: detail.documents?.other ?? null,
      });
      setInitialized(true);
    }
  }, [detail, id, initialized]);

  const initialDocs = useMemo<Record<DocKey, string | null>>(() => {
    if (!detail || detail.id !== id) {
      return { cnicFront: null, cnicBack: null, other: null };
    }
    return {
      cnicFront: detail.documents?.cnicFront ?? null,
      cnicBack: detail.documents?.cnicBack ?? null,
      other: detail.documents?.other ?? null,
    };
  }, [detail, id]);

  const hasMonthlyPaymentChange = useMemo(() => {
    if (!detail || detail.id !== id) return false;
    const basePlan = detail.plans.find((plan) => plan.id === "base");
    return (
      toNumber(formData.monthlyPayment) !==
      (basePlan?.monthly ?? detail.monthly)
    );
  }, [detail, id, formData.monthlyPayment]);

  const hasInfoChanges = useMemo(() => {
    if (!detail || detail.id !== id) return false;
    return (
      formData.name.trim() !== (detail.name || "").trim() ||
      formData.fatherName.trim() !== (detail.fatherName || "").trim() ||
      formData.cnic.trim() !== (detail.cnic || "").trim() ||
      formData.phone.trim() !== (detail.phone || "").trim() ||
      formData.address.trim() !== (detail.address || "").trim() ||
      formData.firstDueDate !== detail.firstDueDate ||
      hasMonthlyPaymentChange
    );
  }, [detail, id, formData, hasMonthlyPaymentChange]);

  const hasPurchaseDateChanges = useMemo(() => {
    if (!detail || detail.id !== id) return false;
    return detail.plans.some(
      (plan) =>
        plan.id !== "base" &&
        formData.purchaseDates[plan.id] !== (plan.firstDueDate ?? ""),
    );
  }, [detail, id, formData.purchaseDates]);

  const hasPurchasePaymentChanges = useMemo(() => {
    if (!detail || detail.id !== id) return false;
    return detail.plans.some((plan) => {
      if (plan.id === "base") return false;
      const currentDueDate =
        formData.purchaseDates[plan.id] ?? plan.firstDueDate ?? "";
      return (
        currentDueDate !== formData.firstDueDate &&
        toNumber(formData.purchaseMonthlyPayments[plan.id] ?? "") !==
          plan.monthly
      );
    });
  }, [
    detail,
    id,
    formData.firstDueDate,
    formData.purchaseDates,
    formData.purchaseMonthlyPayments,
  ]);

  const hasDocChanges = useMemo(() => {
    return DOC_ITEMS.some((d) => {
      const orig = initialDocs[d.key] ?? null;
      const current = docs[d.key] ?? null;
      return orig !== current;
    });
  }, [initialDocs, docs]);

  const hasChanges =
    hasInfoChanges ||
    hasPurchaseDateChanges ||
    hasPurchasePaymentChanges ||
    hasDocChanges;

  const handlePickFile = async (file: File) => {
    if (!pickDoc) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setDocs((prev) => ({ ...prev, [pickDoc.key]: dataUrl }));
    } catch {
      showToast("Photo load nahi ho saki", "error");
    }
  };

  const handleRemove = (key: DocKey) => {
    setDocs((prev) => ({ ...prev, [key]: null }));
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelConfirm(true);
    } else {
      router.push(ROUTES.SHOP.CUSTOMER_DETAIL(id));
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = "Customer ka naam likhein";
    }
    if (!formData.phone.trim()) {
      errs.phone = "Mobile number likhein";
    }
    if (!formData.firstDueDate) {
      errs.firstDueDate = "Pehli qist ki tareekh chunein";
    }
    detail?.plans
      .filter((plan) => plan.id !== "base")
      .forEach((plan) => {
        if (!formData.purchaseDates[plan.id]) {
          errs[`purchaseDate-${plan.id}`] =
            `${plan.label} ki pehli qist ki tareekh chunein`;
        }
        const planDate =
          formData.purchaseDates[plan.id] ?? plan.firstDueDate ?? "";
        if (
          planDate !== formData.firstDueDate &&
          (!digits(formData.purchaseMonthlyPayments[plan.id] ?? "") ||
            toNumber(formData.purchaseMonthlyPayments[plan.id] ?? "") < 1)
        ) {
          errs[`purchasePayment-${plan.id}`] =
            `${plan.label} ki mahana qist sahi likhein`;
        }
      });
    if (
      (detail?.plans.find((plan) => plan.id === "base")?.remaining ?? 0) > 0 &&
      (!digits(formData.monthlyPayment) ||
        !Number.isSafeInteger(toNumber(formData.monthlyPayment)) ||
        toNumber(formData.monthlyPayment) < 1)
    ) {
      errs.monthlyPayment =
        "Mahine ki qist kam az kam 1 rupay ki poori raqam honi chahiye";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!detail) return;
    if (!validate()) {
      showToast("Zaroori khaney pur karein", "error");
      return;
    }

    setSaving(true);
    try {
      if (hasInfoChanges) {
        await dispatch(
          updateCustomer({
            id: detail.id,
            name: formData.name.trim(),
            fatherName: formData.fatherName.trim(),
            phone: formData.phone.trim(),
            cnic: formData.cnic.trim(),
            address: formData.address.trim(),
            firstDueDate: formData.firstDueDate,
          }),
        ).unwrap();
      }

      if (hasPurchaseDateChanges) {
        for (const plan of detail.plans.filter(
          (item) =>
            item.id !== "base" &&
            formData.purchaseDates[item.id] !== (item.firstDueDate ?? ""),
        )) {
          await dispatch(
            updateCustomerPurchaseDate({
              customerId: detail.id,
              purchaseId: plan.id,
              firstDueDate: formData.purchaseDates[plan.id],
            }),
          ).unwrap();
        }
      }

      if (hasPurchasePaymentChanges) {
        for (const plan of detail.plans.filter((item) => {
          if (item.id === "base") return false;
          const currentDueDate =
            formData.purchaseDates[item.id] ?? item.firstDueDate ?? "";
          return (
            currentDueDate !== formData.firstDueDate &&
            toNumber(formData.purchaseMonthlyPayments[item.id] ?? "") !==
              item.monthly
          );
        })) {
          await dispatch(
            updateCustomerPurchasePayment({
              customerId: detail.id,
              purchaseId: plan.id,
              monthlyPayment: toNumber(
                formData.purchaseMonthlyPayments[plan.id],
              ),
            }),
          ).unwrap();
        }
      }

      if (hasMonthlyPaymentChange) {
        await dispatch(
          updateCustomerBasePayment({
            customerId: detail.id,
            monthlyPayment: toNumber(formData.monthlyPayment),
          }),
        ).unwrap();
      }

      if (hasDocChanges) {
        for (const d of DOC_ITEMS) {
          const orig = initialDocs[d.key] ?? null;
          const current = docs[d.key] ?? null;
          if (orig !== current) {
            if (current) {
              await dispatch(
                uploadCustomerDocument({
                  customerId: detail.id,
                  docKey: d.key,
                  photo: current,
                }),
              ).unwrap();
            } else {
              await dispatch(
                deleteCustomerDocument({
                  customerId: detail.id,
                  docKey: d.key,
                }),
              ).unwrap();
            }
          }
        }
      }

      showToast("Customer save ho gaya", "success");
      router.push(ROUTES.SHOP.CUSTOMER_DETAIL(id));
    } catch (e) {
      showToast(
        typeof e === "string" ? e : "Tabdeeliyan save nahi ho sakeen",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  if (detailLoading && !detail) {
    return <Loader />;
  }

  if (error && !detail) {
    return (
      <div className="customer-edit-page">
        <button
          type="button"
          className="ce-back"
          onClick={() => router.push(ROUTES.SHOP.CUSTOMER_DETAIL(id))}
        >
          <ChevronLeft size={22} aria-hidden="true" /> Wapas
        </button>
        <div className="ce-error" role="alert">
          <p>{error}</p>
          <CommonBtn text="Dobara koshish karein" onClick={load} />
        </div>
      </div>
    );
  }

  return (
    <div className="customer-edit-page">
      <button
        type="button"
        className="ce-back"
        onClick={handleCancel}
        aria-label="Customer detail par wapas jayein"
      >
        <ChevronLeft size={22} aria-hidden="true" />
        <span>Customer detail</span>
      </button>

      <h1 className="ce-title">Customer edit karein</h1>

      <section className="ce-card">
        <h2>
          <span>Customer ki maloomat</span>
          <span className="muted">Naam, Walid, CNIC, Phone, Pata</span>
        </h2>
        <div className="ce-form-grid">
          <FormInput
            label="Full name"
            labelUr="پورا نام"
            value={formData.name}
            onChange={(e) => {
              setFormData((p) => ({ ...p, name: e.target.value }));
              if (errors.name) setErrors((err) => ({ ...err, name: "" }));
            }}
            placeholder="Customer ka naam"
            autoComplete="off"
            error={errors.name}
          />
          <FormInput
            label="Father / husband name"
            labelUr="والد / شوہر کا نام"
            optional
            value={formData.fatherName}
            onChange={(e) =>
              setFormData((p) => ({ ...p, fatherName: e.target.value }))
            }
            placeholder="Walid ka naam"
            autoComplete="off"
          />
          <FormInput
            label="CNIC number"
            labelUr="شناختی کارڈ نمبر"
            optional
            inputMode="numeric"
            value={formData.cnic}
            onChange={(e) =>
              setFormData((p) => ({ ...p, cnic: maskCnic(e.target.value) }))
            }
            placeholder="xxxxx-xxxxxxx-x"
            autoComplete="off"
          />
          <FormInput
            label="Mobile number"
            labelUr="موبائل نمبر"
            type="tel"
            inputMode="numeric"
            value={formData.phone}
            onChange={(e) => {
              setFormData((p) => ({ ...p, phone: maskMobile(e.target.value) }));
              if (errors.phone) setErrors((err) => ({ ...err, phone: "" }));
            }}
            placeholder="03xx-xxxxxxx"
            autoComplete="off"
            error={errors.phone}
          />
          <div className="ce-full-field">
            <FormInput
              label="Address"
              labelUr="پتہ"
              optional
              value={formData.address}
              onChange={(e) =>
                setFormData((p) => ({ ...p, address: e.target.value }))
              }
              placeholder="Customer ka pata"
              autoComplete="off"
            />
          </div>
        </div>
      </section>

      {detail?.plans
        .slice()
        .sort((left, right) =>
          left.id === "base" ? -1 : right.id === "base" ? 1 : 0,
        )
        .map((plan) => {
          const isBasePlan = plan.id === "base";
          const planDate = isBasePlan
            ? formData.firstDueDate
            : (formData.purchaseDates[plan.id] ?? plan.firstDueDate ?? "");
          const canEditRate =
            isBasePlan || planDate !== formData.firstDueDate;
          const paymentValue = isBasePlan
            ? formData.monthlyPayment
            : (formData.purchaseMonthlyPayments[plan.id] ?? "");
          const paymentError = isBasePlan
            ? errors.monthlyPayment
            : errors[`purchasePayment-${plan.id}`];

          return (
            <section className="ce-card" key={plan.id}>
              <h2>
                <span>{plan.label} - {isBasePlan ? "Pehli khareedari" : "Nayi khareedari"}</span>
              </h2>

              <DatePartsPicker
                label={`${plan.label} first installment date`}
                labelUr="پہلی قسط کی تاریخ"
                value={planDate}
                onChange={(firstDueDate) =>
                  isBasePlan
                    ? setFormData((previous) => ({
                        ...previous,
                        firstDueDate,
                      }))
                    : setFormData((previous) => ({
                        ...previous,
                        purchaseDates: {
                          ...previous.purchaseDates,
                          [plan.id]: firstDueDate,
                        },
                      }))
                }
                error={
                  isBasePlan
                    ? errors.firstDueDate
                    : errors[`purchaseDate-${plan.id}`]
                }
              />
              <p className="muted">
                Is tareekh ko badalne se sirf {plan.label} ka schedule update
                hoga.
              </p>

              <FormInput
                label={`${plan.label} monthly installment (Rs.)`}
                labelUr="ماہانہ قسط"
                inputMode="numeric"
                value={paymentValue}
                disabled={plan.remaining === 0 || !canEditRate}
                onChange={(event) => {
                  const monthlyPayment = maskMoney(event.target.value);
                  setFormData((previous) =>
                    isBasePlan
                      ? { ...previous, monthlyPayment }
                      : {
                          ...previous,
                          purchaseMonthlyPayments: {
                            ...previous.purchaseMonthlyPayments,
                            [plan.id]: monthlyPayment,
                          },
                        },
                  );
                  const errorKey = isBasePlan
                    ? "monthlyPayment"
                    : `purchasePayment-${plan.id}`;
                  if (errors[errorKey]) {
                    setErrors((previous) => ({ ...previous, [errorKey]: "" }));
                  }
                }}
                error={paymentError}
              />
              <p className="muted">
                {!canEditRate
                  ? "Alag qist ki raqam edit karne ke liye is plan ki tareekh Plan A se alag rakhein."
                  : "Nayi qist ki raqam agli unpaid qist se lagu hogi. Pehle se di hui ya adhoori qist ki raqam nahi badlegi."}
              </p>
            </section>
          );
        })}

      <section className="ce-card">
        <h2>
          <span>Documents</span>
          <span className="muted">CNIC front, CNIC back aur dosra kaghaz</span>
        </h2>

        <div className="ce-docs-list">
          {DOC_ITEMS.map((doc) => {
            const currentPhoto = docs[doc.key];
            const hasPhoto = !!currentPhoto;

            return (
              <div key={doc.key} className="ce-doc-row">
                <div className="ce-doc-left">
                  {hasPhoto ? (
                    <div className="ce-doc-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={resolveMediaUrl(currentPhoto)} alt={doc.label} />
                    </div>
                  ) : (
                    <div className="ce-doc-empty-box">
                      <FileText size={22} aria-hidden="true" />
                    </div>
                  )}
                  <div className="ce-doc-meta">
                    <strong>{doc.label}</strong>
                    {hasPhoto ? (
                      <span className="ce-has-photo-badge">Photo hai</span>
                    ) : (
                      <span className="ce-no-photo-badge">Photo nahi hai</span>
                    )}
                  </div>
                </div>

                <div className="ce-doc-actions">
                  {hasPhoto ? (
                    <>
                      <button
                        type="button"
                        className="ce-action-btn change-btn"
                        onClick={() => setPickDoc(doc)}
                        aria-label={`${doc.label} photo badlein`}
                      >
                        <Camera size={16} aria-hidden="true" />
                        <span>Photo badlein</span>
                      </button>
                      <button
                        type="button"
                        className="ce-action-btn remove-btn"
                        onClick={() => handleRemove(doc.key)}
                        aria-label={`${doc.label} photo hata dein`}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                        <span>Hata dein</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="ce-action-btn add-btn"
                      onClick={() => setPickDoc(doc)}
                      aria-label={`${doc.label} photo add karein`}
                    >
                      <Plus size={16} aria-hidden="true" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="ce-footer-actions">
          <CommonBtn
            text="Cancel"
            className="gray-btn"
            onClick={handleCancel}
            disabled={saving}
          />
          <CommonBtn
            text={saving ? "Save ho raha hai…" : "Save karein"}
            className="full-btn"
            onClick={handleSave}
            disabled={saving}
          />
        </div>
      </section>

      {pickDoc && (
        <PhotoSourceSheet
          title={pickDoc.label}
          titleUr={pickDoc.labelUr}
          onPick={handlePickFile}
          onClose={() => setPickDoc(null)}
        />
      )}

      {showCancelConfirm && (
        <ConfirmModal
          title="Tabdeeliyan zaya ho jayengi"
          message="Aap ki ki hui tabdeeliyan save nahi huin. Kya aap wapas jana chahte hain?"
          confirmText="Haan, wapas jayein"
          cancelText="Nahi"
          tone="danger"
          onConfirm={() => router.push(ROUTES.SHOP.CUSTOMER_DETAIL(id))}
          onCancel={() => setShowCancelConfirm(false)}
        />
      )}
    </div>
  );
};

export default CustomerEditPage;
