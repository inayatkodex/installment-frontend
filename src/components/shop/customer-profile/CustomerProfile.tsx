"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Check,
  Eye,
  FileText,
  MoreVertical,
  Package,
} from "lucide-react";
import DropdownMenu from "@/components/common/DropdownMenu/DropdownMenu";
import PhotoViewer from "@/components/common/PhotoViewer/PhotoViewer";
import CommonBtn from "@/components/common/CommonButton/Button";
import StatusBadge, {
  BadgeKind,
} from "@/components/common/StatusBadge/StatusBadge";
import ReceivePaymentForm, {
  ReceiveTarget,
} from "../receive-payment-form/ReceivePaymentForm";
import DocumentsModal from "../documents-modal/DocumentsModal";
import { PersonIcon } from "@/svgs";
import { formatDate, formatRs } from "@/shared/formatUtils";
import { CustomerDetail, InstallmentRow } from "@/types/customer";
import "./customer-profile.scss";

interface Props {
  customer: CustomerDetail;
  onPaid: () => void;
  onDelete?: () => void;
}

const VISIBLE = 6;

const DOC_CONFIGS = [
  {
    key: "cnicFront" as const,
    label: "CNIC front",
    labelUr: "شناختی کارڈ آگے",
  },
  {
    key: "cnicBack" as const,
    label: "CNIC back",
    labelUr: "شناختی کارڈ پیچھے",
  },
  { key: "other" as const, label: "Other paper", labelUr: "دوسرا کاغذ" },
];

const InstallmentItem = ({
  row,
  isNext,
}: {
  row: InstallmentRow;
  isNext: boolean;
}) => {
  const left = row.expected - row.paid;
  const kind: BadgeKind =
    row.status === "paid"
      ? "paid"
      : row.status === "partial"
        ? "partial"
        : row.status === "overdue"
          ? "overdue"
          : isNext
            ? "next"
            : "pending";
  const dot =
    row.status === "paid"
      ? "ok"
      : row.status === "pending"
        ? isNext
          ? "next"
          : "idle"
        : row.status === "overdue"
          ? "late"
          : "partial";

  return (
    <li className="cp-inst">
      <span className={`cp-dot ${dot}`}>
        {row.status === "paid" ? (
          <Check size={18} aria-hidden="true" />
        ) : (
          row.no
        )}
      </span>
      <div className={`cp-inst-box ${dot}`}>
        <div className="cp-row">
          <strong>Installment {row.no}</strong>
          {row.status === "pending" && !isNext ? (
            <span className="cp-due">Due {formatDate(row.dueDate)}</span>
          ) : (
            <StatusBadge status={kind} />
          )}
        </div>
        {row.status === "partial" && (
          <div
            className="cp-mini"
            role="progressbar"
            aria-valuenow={Math.round((row.paid / row.expected) * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Kitni raqam ada hui"
          >
            <i style={{ width: `${(row.paid / row.expected) * 100}%` }} />
          </div>
        )}
        <div className="cp-row">
          <span className="cp-meta">
            {row.status === "paid" && (
              <>
                Due {formatDate(row.dueDate)} · Paid {formatDate(row.paidOn!)}
                <br />
                {row.method}
                {row.note ? ` · Note: ${row.note}` : ""}
              </>
            )}
            {row.status === "partial" && (
              <>
                Paid {formatRs(row.paid)}
                {row.paidOn ? ` on ${formatDate(row.paidOn)}` : ""} ·{" "}
                {row.method}
              </>
            )}
            {(row.status === "overdue" ||
              (row.status === "pending" && isNext)) && (
              <>Due {formatDate(row.dueDate)}</>
            )}
          </span>
          <strong className="cp-amount">{formatRs(row.expected)}</strong>
        </div>
        {row.daysLate > 0 && (
          <p className="cp-late-line">
            {row.status === "partial" ? `${formatRs(left)} baaki · ` : ""}
            {row.daysLate} din late
          </p>
        )}
      </div>
    </li>
  );
};

const CustomerProfile = ({ customer: c, onPaid, onDelete }: Props) => {
  const [showAll, setShowAll] = useState(false);
  const [viewer, setViewer] = useState<{
    src: string;
    title: string;
  } | null>(null);
  const [target, setTarget] = useState<ReceiveTarget | null>(null);
  const [showDocsModal, setShowDocsModal] = useState(false);

  // Which installment will the "Receive" button collect? Oldest late one, otherwise the next due one.
  const pay =
    c.installments.find((r) => r.daysLate > 0) ??
    c.installments.find(
      (r) =>
        r.status !== "paid" &&
        r.dueDate >= new Date().toISOString().slice(0, 10) &&
        r.paid < r.expected,
    ) ??
    c.installments.find((r) => r.status !== "paid");
  const rows = showAll ? c.installments : c.installments.slice(0, VISIBLE);
  const docCount = DOC_CONFIGS.filter((d) => !!c.documents?.[d.key]).length;

  return (
    <div className="customer-profile">
      <div className="cp-hero">
        <div className="cp-banner" />
        {c.status === "completed" && onDelete && (
          <div className="cp-menu">
            <DropdownMenu
              ariaLabel="Customer ke options"
              trigger={<MoreVertical size={22} />}
              triggerClassName="icon-only"
              items={[
                {
                  label: "Customer delete karein",
                  tone: "danger",
                  onClick: onDelete,
                },
              ]}
            />
          </div>
        )}
        <div className="cp-who">
          <span className="cp-photo">
            {c.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.photo} alt={c.name} className="cp-photo-img" />
            ) : (
              <PersonIcon size={60} />
            )}
          </span>
          <h1>{c.name}</h1>
          <p>
            {c.phone} · {c.code}
          </p>
          <StatusBadge status={c.status === "overdue" ? "overdue" : c.status} />
        </div>
      </div>

      <div className="cp-sum">
        <div className="blue">
          <span>
            Total{" "}
            <span className="ur" lang="ur">
              کل
            </span>
          </span>
          <b>{formatRs(c.total)}</b>
        </div>
        <div className="green">
          <span>
            Paid{" "}
            <span className="ur" lang="ur">
              ادا
            </span>
          </span>
          <b>{formatRs(c.paid)}</b>
        </div>
        <div className="red">
          <span>
            Left{" "}
            <span className="ur" lang="ur">
              باقی
            </span>
          </span>
          <b>{formatRs(c.remaining)}</b>
        </div>
      </div>
      <div
        className="cp-bar"
        role="progressbar"
        aria-valuenow={c.progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Kitni raqam ada hui"
      >
        <i style={{ width: `${c.progress}%` }} />
      </div>
      <p className="cp-bar-text">
        {c.paidCount} of {c.totalCount} installments paid · {c.progress}%
      </p>

      {c.late && (
        <div className="cp-alert" role="alert">
          <span>
            <AlertTriangle size={20} aria-hidden="true" />
          </span>
          <div>
            <b>{formatRs(c.late.amount)} late hain</b>
            <p>
              Qist {c.late.installmentNo} · {c.late.days} din late
              {c.next ? (
                <>
                  <br />
                  Agli: {formatRs(c.next.amount)} on{" "}
                  {formatDate(c.next.dueDate)}
                </>
              ) : null}
            </p>
          </div>
        </div>
      )}

      <section className="cp-section">
        <div className="cp-head">
          <h2>
            Items{" "}
            <span className="ur" lang="ur">
              خریدی گئی چیزیں
            </span>
          </h2>
          <span>{c.items.length} items</span>
        </div>
        <ul>
          {c.items.map((i) => (
            <li key={i.name} className="cp-item">
              {i.photo ? (
                <button
                  type="button"
                  className="cp-item-photo"
                  onClick={() => setViewer({ src: i.photo!, title: i.name })}
                  aria-label={`${i.name} ki photo dekhein`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.photo} alt={i.name} />
                </button>
              ) : (
                <span className="cp-item-icon">
                  <Package size={24} aria-hidden="true" />
                </span>
              )}
              <div>
                <strong>{i.name}</strong>
                <p>Bought {formatDate(i.boughtOn)}</p>
              </div>
              <b>{formatRs(i.price)}</b>
            </li>
          ))}
        </ul>
        <div className="cp-total">
          <span>
            Total{" "}
            <span className="ur" lang="ur">
              کل
            </span>
          </span>
          <b>{formatRs(c.total)}</b>
        </div>
      </section>

      <section className="cp-section">
        <div className="cp-head">
          <h2>
            Documents{" "}
            <span className="ur" lang="ur">
              کاغذات
            </span>
          </h2>
          <span>
            {docCount} of {DOC_CONFIGS.length} photos
          </span>
        </div>
        <div className="cp-docs-row">
          <div className="cp-docs-row-info">
            <FileText size={20} className="cp-docs-row-icon" aria-hidden="true" />
            <span>CNIC front, CNIC back aur dosra kaghaz</span>
          </div>
          <CommonBtn
            text="Show"
            icon={<Eye size={18} />}
            className="sm-btn"
            onClick={() => setShowDocsModal(true)}
            ariaLabel="Documents dekhein"
          />
        </div>
      </section>

      <section className="cp-section">
        <div className="cp-head">
          <h2>
            Installments{" "}
            <span className="ur" lang="ur">
              قسطیں
            </span>
          </h2>
          <span>{formatRs(c.monthly)} / month</span>
        </div>
        <ol className="cp-timeline">
          <li className="cp-inst">
            <span className="cp-dot ok">
              <Check size={18} aria-hidden="true" />
            </span>
            <div className="cp-inst-box ok">
              <div className="cp-row">
                <strong>Advance</strong>
                <strong className="cp-amount">{formatRs(c.downPayment)}</strong>
              </div>
              <span className="cp-meta">Pehli baar di gayi raqam</span>
            </div>
          </li>
          {rows.map((r) => (
            <InstallmentItem key={r.no} row={r} isNext={c.next?.no === r.no} />
          ))}
        </ol>
        {c.installments.length > VISIBLE && (
          <CommonBtn
            text={
              showAll
                ? "Kam dikhayen"
                : `Saari ${c.installments.length} qistein dekhein`
            }
            className="outline-btn full-btn"
            onClick={() => setShowAll((v) => !v)}
          />
        )}
      </section>

      <div className="cp-footer">
        {c.status === "completed" || !pay ? (
          <p className="cp-done">Saari qistein poori ho gayi hain.</p>
        ) : (
          <button
            type="button"
            className="cp-pay"
            onClick={() =>
              setTarget({
                customerId: c.id,
                name: c.name,
                installmentNo: pay.no,
                dueDate: pay.dueDate,
                amount: pay.expected - pay.paid,
                daysLate: pay.daysLate,
              })
            }
          >
            <span>
              Receive Payment{" "}
              <span className="ur" lang="ur">
                رقم وصول کریں
              </span>
            </span>
            <small>
              {formatRs(pay.expected - pay.paid)}{" "}
              {pay.daysLate > 0 ? "late hain" : "due hain"}
            </small>
          </button>
        )}
      </div>

      {showDocsModal && (
        <DocumentsModal
          customer={c}
          onClose={() => setShowDocsModal(false)}
        />
      )}
      {viewer && (
        <PhotoViewer
          src={viewer.src}
          title={viewer.title}
          onClose={() => setViewer(null)}
        />
      )}
      {target && (
        <ReceivePaymentForm
          target={target}
          onClose={() => setTarget(null)}
          onDone={onPaid}
        />
      )}
    </div>
  );
};

export default CustomerProfile;
