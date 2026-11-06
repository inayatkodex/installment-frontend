"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Info,
} from "lucide-react";
import { ROUTES } from "@/constant/appRoutes";
import { formatRs } from "@/shared/formatUtils";
import { StatusReport } from "@/types/payment";
import "./status-summary.scss";

const StatusSummary = ({ report }: { report: StatusReport }) => {
  const [showCashDetails, setShowCashDetails] = useState(false);
  const [showLateDetails, setShowLateDetails] = useState(false);
  const totalInstallments =
    report.paidInstallments + report.pendingInstallments;
  const remainingInstallments = Math.max(
    0,
    report.pendingInstallments - report.lateInstallments,
  );
  const remainingAmount = Math.max(0, report.remaining - report.overdue);
  const lateCustomers = report.customers.filter(
    (customer) => customer.overdue > 0,
  );
  const progress = Math.max(0, Math.min(100, report.collectedPercent));

  return (
    <div className="status-summary">
      <section className="ss-cash-card">
        <span className="ss-eyebrow">Is mahine paisa aaya</span>
        <strong className="ss-cash-total">{formatRs(report.cashCollected)}</strong>
        <button
          type="button"
          className="ss-cash-note"
          aria-expanded={showCashDetails}
          onClick={() => setShowCashDetails((shown) => !shown)}
        >
          <span>
            Is mein {formatRs(report.cashBreakdown.late)} purani late qiston ke
            hain
          </span>
          {showCashDetails ? <ChevronDown size={16} /> : <Info size={16} />}
        </button>
        {showCashDetails && (
          <div className="ss-cash-breakdown">
            <span>
              Is mahine ki qistein <b>{formatRs(report.cashBreakdown.thisMonth)}</b>
            </span>
            <span>
              Purani late qistein <b>{formatRs(report.cashBreakdown.late)}</b>
            </span>
            <span>
              Aagay ki qistein <b>{formatRs(report.cashBreakdown.advance)}</b>
            </span>
          </div>
        )}
      </section>

      <section className="ss-installments">
        <div className="ss-section-heading">
          <div>
            <h2>Is mahine ki qistein</h2>
            <p>
              {report.paidInstallments} / {totalInstallments} ada
            </p>
            <p className="ss-monthly-target">
              Is mahine wasool karna hai: <b>{formatRs(report.expected)}</b>
            </p>
          </div>
          <span
            className="ss-info-button"
            aria-label="Qiston ke hisaab ki tafseel"
            title="Sirf is mahine due qistein shamil hain"
          >
            <Info size={17} />
          </span>
        </div>

        <div
          className="ss-progress"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Is mahine ada shuda qistein"
        >
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="ss-status-list">
          <div className="ss-status-row is-paid">
            <span className="ss-status-icon">
              <CheckCircle2 size={18} />
            </span>
            <span className="ss-status-name">Ada</span>
            <strong>
              {report.paidInstallments} qistein
              <small>Wasool {formatRs(report.received)}</small>
            </strong>
          </div>
          <div className="ss-status-row is-pending">
            <span className="ss-status-icon">
              <Clock3 size={18} />
            </span>
            <span className="ss-status-name">Baqi</span>
            <strong>
              {remainingInstallments} qistein
              <small>{formatRs(remainingAmount)}</small>
            </strong>
          </div>
          <button
            type="button"
            className="ss-status-row is-late"
            aria-expanded={showLateDetails}
            onClick={() => setShowLateDetails((shown) => !shown)}
          >
            <span className="ss-status-icon">
              <AlertTriangle size={18} />
            </span>
            <span className="ss-status-name">Late</span>
            <strong>
              {report.lateInstallments} qistein
              <small>{formatRs(report.overdue)}</small>
            </strong>
            {showLateDetails ? (
              <ChevronDown className="ss-row-chevron" size={17} />
            ) : (
              <ChevronRight className="ss-row-chevron" size={17} />
            )}
          </button>
          {showLateDetails && (
            <div className="ss-late-customers">
              {lateCustomers.length ? (
                lateCustomers.map((customer) => (
                  <Link
                    key={customer.customerId}
                    href={ROUTES.SHOP.CUSTOMER_DETAIL(customer.customerId)}
                  >
                    <span>{customer.name}</span>
                    <b>{formatRs(customer.overdue)}</b>
                  </Link>
                ))
              ) : (
                <p>Is mahine koi late qist nahi.</p>
              )}
            </div>
          )}
        </div>

        <p className="ss-footnote">
          Mahina abhi chal raha hai
        </p>
      </section>

    </div>
  );
};

export default StatusSummary;
