"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Pencil, Phone } from "lucide-react";
import Modal from "@/components/common/modal/Modal";
import PhotoViewer from "@/components/common/PhotoViewer/PhotoViewer";
import { ROUTES } from "@/constant/appRoutes";
import { CustomerDetail } from "@/types/customer";
import "./documents-modal.scss";

interface Props {
  customer: CustomerDetail;
  onClose: () => void;
}

const DOC_CONFIGS = [
  { key: "cnicFront" as const, label: "CNIC front", labelUr: "شناختی کارڈ آگے" },
  { key: "cnicBack" as const, label: "CNIC back", labelUr: "شناختی کارڈ پیچھے" },
  { key: "other" as const, label: "Other paper", labelUr: "دوسرا کاغذ" },
];

const DocumentsModal = ({ customer, onClose }: Props) => {
  const [viewer, setViewer] = useState<{ src: string; title: string } | null>(null);

  const cleanPhone = customer.phone ? customer.phone.replace(/[^\d+]/g, "") : "";

  return (
    <>
      <Modal
        title="Documents"
        titleUr="کاغذات"
        centered
        headerAction={
          <Link
            href={ROUTES.SHOP.CUSTOMER_EDIT(customer.id)}
            className="dm-edit-btn"
            aria-label="Documents edit karein"
          >
            <Pencil size={15} aria-hidden="true" />
            <span>Edit</span>
          </Link>
        }
        onClose={onClose}
      >
        <div className="documents-modal-content">
          <div className="dm-info-card">
            <div className="dm-info-row">
              <span className="dm-label">Father name</span>
              <strong className="dm-value">{customer.fatherName || "—"}</strong>
            </div>
            <div className="dm-info-row">
              <span className="dm-label">CNIC</span>
              <strong className="dm-value">{customer.cnic || "—"}</strong>
            </div>
            <div className="dm-info-row">
              <span className="dm-label">Mobile</span>
              <div className="dm-phone-wrap">
                <strong className="dm-value">{customer.phone || "—"}</strong>
                {customer.phone && (
                  <a
                    href={`tel:${cleanPhone}`}
                    className="dm-call-btn"
                    aria-label={`${customer.name} ko call karein`}
                  >
                    <Phone size={13} aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
            <div className="dm-info-row">
              <span className="dm-label">Address</span>
              <strong className="dm-value">{customer.address || "—"}</strong>
            </div>
          </div>

          <div className="dm-tiles-grid">
            {DOC_CONFIGS.map((doc) => {
              const photoUrl = customer.documents?.[doc.key];
              if (photoUrl) {
                return (
                  <button
                    key={doc.key}
                    type="button"
                    className="dm-tile has-photo"
                    onClick={() =>
                      setViewer({
                        src: photoUrl,
                        title: `${customer.name} · ${doc.label}`,
                      })
                    }
                    aria-label={`${doc.label} photo dekhein`}
                  >
                    <div className="dm-tile-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photoUrl} alt={doc.label} />
                      <span className="dm-tile-badge">Photo hai</span>
                    </div>
                    <strong className="dm-tile-title">{doc.label}</strong>
                    <span className="dm-tile-sub ur" lang="ur">{doc.labelUr}</span>
                  </button>
                );
              }
              return (
                <div key={doc.key} className="dm-tile empty" aria-hidden="true">
                  <div className="dm-tile-empty-box">
                    <FileText size={24} className="dm-empty-icon" />
                    <span>Photo nahi hai</span>
                  </div>
                  <strong className="dm-tile-title">{doc.label}</strong>
                  <span className="dm-tile-sub ur" lang="ur">{doc.labelUr}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>

      {viewer && (
        <PhotoViewer
          src={viewer.src}
          title={viewer.title}
          onClose={() => setViewer(null)}
        />
      )}
    </>
  );
};

export default DocumentsModal;
