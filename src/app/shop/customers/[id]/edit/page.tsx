"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Camera, ChevronLeft, FileText, Plus, Trash2 } from "lucide-react";
import CommonBtn from "@/components/common/CommonButton/Button";
import ConfirmModal from "@/components/common/modal/confirm-modal/ConfirmModal";
import FormInput from "@/components/common/ui/FormInput";
import Loader from "@/components/common/Loader/Loader";
import PhotoSourceSheet from "@/components/common/PhotoSourceSheet/PhotoSourceSheet";
import { ROUTES } from "@/constant/appRoutes";
import { fileToDataUrl } from "@/shared/imageUtils";
import { maskCnic, maskMobile } from "@/shared/formatUtils";
import { showToast } from "@/shared/toastUtils";
import {
  deleteCustomerDocument,
  fetchCustomerDetail,
  updateCustomer,
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

  const hasInfoChanges = useMemo(() => {
    if (!detail || detail.id !== id) return false;
    return (
      formData.name.trim() !== (detail.name || "").trim() ||
      formData.fatherName.trim() !== (detail.fatherName || "").trim() ||
      formData.cnic.trim() !== (detail.cnic || "").trim() ||
      formData.phone.trim() !== (detail.phone || "").trim() ||
      formData.address.trim() !== (detail.address || "").trim()
    );
  }, [detail, id, formData]);

  const hasDocChanges = useMemo(() => {
    return DOC_ITEMS.some((d) => {
      const orig = initialDocs[d.key] ?? null;
      const current = docs[d.key] ?? null;
      return orig !== current;
    });
  }, [initialDocs, docs]);

  const hasChanges = hasInfoChanges || hasDocChanges;

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
                      <img src={currentPhoto!} alt={doc.label} />
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
