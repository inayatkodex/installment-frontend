"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  AlertTriangle,
  Check,
  Eye,
  FileText,
  MoreVertical,
  Package,
  Plus,
  X,
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
import { ROUTES } from "@/constant/appRoutes";
import { formatDate, formatRs } from "@/shared/formatUtils";
import { fileToDataUrl, resolveMediaUrl } from "@/shared/imageUtils";
import { MAX_SCHEDULE_INSTALLMENTS } from "@/shared/planUtils";
import {
  CustomerDetail,
  InstallmentRow,
} from "@/types/customer";
import { addCustomerPurchase } from "@/store/slices/shop/customers/shopCustomersSlice";
import { useAppDispatch } from "@/store/store";
import { showToast } from "@/shared/toastUtils";
import ItemPhoto from "@/components/shop/customer-form/steps/item-photo";
import DatePartsPicker from "@/components/common/ui/DatePartsPicker";
import "./customer-profile.scss";

interface Props {
  customer: CustomerDetail;
  onPaid: () => void;
  onDelete?: () => void;
}

const VISIBLE = 6;

type PurchaseError = {
  field: "name" | "price" | "downPayment" | "monthlyPayment" | "firstDueDate";
  itemIndex?: number;
  message: string;
};

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
          <strong>
            {row.planLabel
              ? `${row.planLabel} · Qist ${row.no}`
              : `Installment ${row.no}`}
          </strong>
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
  const dispatch = useAppDispatch();
  const [showAll, setShowAll] = useState(false);
  const [viewer, setViewer] = useState<{
    src: string;
    title: string;
  } | null>(null);
  const [target, setTarget] = useState<ReceiveTarget | null>(null);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [savingPurchase, setSavingPurchase] = useState(false);
  const [purchaseItems, setPurchaseItems] = useState<
    { name: string; price: string; photo?: File }[]
  >([{ name: "", price: "" }]);
  const [purchaseDownPayment, setPurchaseDownPayment] = useState("0");
  const [purchaseMonthly, setPurchaseMonthly] = useState("");
  const [purchaseFirstDueDate, setPurchaseFirstDueDate] = useState("");
  const [purchaseError, setPurchaseError] = useState<PurchaseError | null>(
    null,
  );

  const savePurchase = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPurchaseError(null);
    setSavingPurchase(true);
    try {
      const cleanItems = purchaseItems.map((item) => ({
        name: item.name.trim(),
        price: Number(item.price),
      }));
      const downPayment = Number(purchaseDownPayment || "0");
      const monthlyPayment = Number(purchaseMonthly);
      const purchaseTotal = cleanItems.reduce(
        (sum, item) => sum + item.price,
        0,
      );
      const invalidNameIndex = cleanItems.findIndex(
        (item) => !/^[\p{L}\s]+$/u.test(item.name),
      );
      if (invalidNameIndex !== -1) {
        setPurchaseError({
          field: "name",
          itemIndex: invalidNameIndex,
          message: "Cheez ka naam sirf huroof mein likhein",
        });
        return;
      }
      const invalidPriceIndex = cleanItems.findIndex(
        (item) =>
          !Number.isSafeInteger(item.price) ||
          item.price < 1 ||
          item.price > 2147483647,
      );
      if (invalidPriceIndex !== -1) {
        setPurchaseError({
          field: "price",
          itemIndex: invalidPriceIndex,
          message: "Qeemat 1 se 2,147,483,647 ke darmiyan likhein",
        });
        return;
      }
      if (!Number.isSafeInteger(purchaseTotal) || purchaseTotal > 2147483647) {
        setPurchaseError({
          field: "price",
          itemIndex: cleanItems.length - 1,
          message: "Cheezon ki kul qeemat bohat zyada hai",
        });
        return;
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(purchaseFirstDueDate)) {
        setPurchaseError({
          field: "firstDueDate",
          message: "Plan B ki pehli qist ki tareekh chunein",
        });
        return;
      }
      if (
        !Number.isSafeInteger(downPayment) ||
        downPayment < 0 ||
        downPayment > 2147483647
      ) {
        setPurchaseError({
          field: "downPayment",
          message: "Advance ki raqam sahi likhein",
        });
        return;
      }
      if (
        !Number.isSafeInteger(monthlyPayment) ||
        monthlyPayment < 1 ||
        monthlyPayment > 2147483647
      ) {
        setPurchaseError({
          field: "monthlyPayment",
          message: "Mahana qist ki raqam sahi likhein",
        });
        return;
      }
      if (
        downPayment > purchaseTotal ||
        monthlyPayment > purchaseTotal ||
        downPayment + monthlyPayment > purchaseTotal
      ) {
        setPurchaseError({
          field: "monthlyPayment",
          message:
            "Advance aur mahana qist alag alag bhi aur mila kar bhi kul qeemat se zyada nahi ho sakte",
        });
        return;
      }
      if (
        Math.ceil((purchaseTotal - downPayment) / monthlyPayment) >
        MAX_SCHEDULE_INSTALLMENTS
      ) {
        setPurchaseError({
          field: "monthlyPayment",
          message:
            "Mahana qist itni honi chahiye ke schedule 1200 qiston se zyada na ho",
        });
        return;
      }
      if (c.monthlyTotal + monthlyPayment > 2147483647) {
        setPurchaseError({
          field: "monthlyPayment",
          message: "Kul mahana qist ki raqam bohat zyada hai",
        });
        return;
      }

      const items = await Promise.all(
        purchaseItems.map(async (item, index) => ({
          ...cleanItems[index],
          photo: item.photo ? await fileToDataUrl(item.photo) : undefined,
        })),
      );

      await dispatch(
        addCustomerPurchase({
          customerId: c.id,
          items,
          downPayment,
          monthlyPayment,
          firstDueDate: purchaseFirstDueDate,
        }),
      ).unwrap();
      showToast("Nayi khareedari save ho gayi", "success");
      setShowPurchaseForm(false);
      setPurchaseError(null);
      setPurchaseItems([{ name: "", price: "", photo: undefined }]);
      setPurchaseDownPayment("0");
      setPurchaseMonthly("");
      setPurchaseFirstDueDate("");
      onPaid();
    } catch (error) {
      setPurchaseError({
        field: "monthlyPayment",
        message:
          typeof error === "string"
            ? error
            : "Khareedari save nahi ho saki, dobara koshish karein",
      });
    } finally {
      setSavingPurchase(false);
    }
  };

  const pay = c.next;
  const rows = showAll ? c.installments : c.installments.slice(0, VISIBLE);
  const docCount = DOC_CONFIGS.filter((d) => !!c.documents?.[d.key]).length;

  return (
    <div className="customer-profile">
      <div className="cp-hero">
        <div className="cp-banner" />
        {onDelete && (
          <div className="cp-menu">
            <DropdownMenu
              ariaLabel="Customer ke options"
              trigger={<MoreVertical size={22} />}
              triggerClassName="icon-only"
              items={[
                {
                  label:
                    c.status === "completed"
                      ? "Delete"
                      : "Qistein mukammal hone k bad delete ho ga",
                  tone: "danger",
                  onClick: onDelete,
                  disabled: c.status !== "completed",
                },
              ]}
            />
          </div>
        )}
        <div className="cp-who">
          <span className="cp-photo">
            {c.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveMediaUrl(c.photo)}
                alt={c.name}
                className="cp-photo-img"
              />
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
                  Agli: {formatRs(c.next.amount)}
                  {c.next.planLabel ? ` (${c.next.planLabel})` : ""}
                  {c.next.dueDate
                    ? ` on ${formatDate(c.next.dueDate)}`
                    : c.plans.length > 1
                      ? " · tareekh baad mein set hogi"
                      : ""}
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
          <span>{c.plans.reduce((sum, plan) => sum + plan.items.length, 0)} items</span>
        </div>
        {c.plans.length === 1 ? (
          <>
            <ul>
              {c.items.map((i) => (
                <li key={i.name} className="cp-item">
                  {i.photo ? (
                    <button
                      type="button"
                      className="cp-item-photo"
                      onClick={() =>
                        setViewer({
                          src: resolveMediaUrl(i.photo)!,
                          title: i.name,
                        })
                      }
                      aria-label={`${i.name} ki photo dekhein`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={resolveMediaUrl(i.photo)} alt={i.name} />
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
          </>
        ) : (
          <div className="cp-plan-list">
            {c.plans.map((plan) => (
              <article className="cp-plan-card" key={plan.id}>
                <div className="cp-plan-heading">
                  <h3>{plan.label}</h3>
                  <span>{formatRs(plan.monthly)} / month</span>
                </div>
                {plan.firstDueDate && (
                  <p className="cp-plan-date">
                    Pehli qist: {formatDate(plan.firstDueDate)}
                  </p>
                )}
                <ul>
                  {plan.items.map((item, index) => (
                    <li key={`${item.name}-${index}`} className="cp-item">
                      {item.photo ? (
                        <button
                          type="button"
                          className="cp-item-photo"
                          onClick={() =>
                            setViewer({
                              src: resolveMediaUrl(item.photo)!,
                              title: item.name,
                            })
                          }
                          aria-label={`${item.name} ki photo dekhein`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={resolveMediaUrl(item.photo)} alt={item.name} />
                        </button>
                      ) : (
                        <span className="cp-item-icon">
                          <Package size={24} aria-hidden="true" />
                        </span>
                      )}
                      <div>
                        <strong>{item.name}</strong>
                        <p>Bought {formatDate(item.boughtOn)}</p>
                      </div>
                      <b>{formatRs(item.price)}</b>
                    </li>
                  ))}
                </ul>
                <div className="cp-plan-stats">
                  <div>
                    <span>Kul qeemat</span>
                    <b>{formatRs(plan.total)}</b>
                  </div>
                  <div>
                    <span>Advance</span>
                    <b>{formatRs(plan.downPayment)}</b>
                  </div>
                  <div>
                    <span>Wasool hue</span>
                    <b>{formatRs(plan.paid)}</b>
                  </div>
                  <div>
                    <span>Baaki</span>
                    <b>{formatRs(plan.remaining)}</b>
                  </div>
                </div>
                <p className="cp-plan-progress">
                  {plan.receivedInstallments} of {plan.totalInstallments} qistein
                  wasool
                </p>
              </article>
            ))}
          </div>
        )}
        <CommonBtn
          text="Nayi cheez add karein"
          icon={<Plus size={18} />}
          className="outline-btn full-btn cp-add-purchase"
          onClick={() => {
            setPurchaseFirstDueDate(c.next?.dueDate ?? c.firstDueDate);
            setShowPurchaseForm(true);
          }}
        />
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
            <FileText
              size={20}
              className="cp-docs-row-icon"
              aria-hidden="true"
            />
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
          <div className="cp-installment-actions">
            <span>{formatRs(c.plans.length > 1 ? c.monthlyTotal : c.monthly)} / month</span>
            <Link
              href={ROUTES.SHOP.CUSTOMER_EDIT(c.id)}
              className="cp-edit-link"
            >
              Plan badlein
            </Link>
          </div>
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
            <InstallmentItem
              key={`${r.planId ?? "base"}-${r.no}`}
              row={r}
              isNext={c.next?.planId === r.planId && c.next?.no === r.no}
            />
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
                planLabel: c.plans.length > 1 ? "Tamam plans" : undefined,
                dueDate: pay.dueDate,
                amount: pay.amount,
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
              {c.plans.length > 1 ? "Tamam plans · " : ""}
              {formatRs(pay.amount)}{" "}
              {pay.daysLate > 0
                ? "late hain"
                : c.plans.length > 1
                  ? "baqi hain"
                  : "due hain"}
            </small>
          </button>
        )}
      </div>

      {showDocsModal && (
        <DocumentsModal customer={c} onClose={() => setShowDocsModal(false)} />
      )}
      {showPurchaseForm && (
        <div className="cp-purchase-backdrop">
          <form
            className="cp-purchase-form"
            onSubmit={savePurchase}
            noValidate
            aria-labelledby="cp-purchase-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="cp-purchase-form-head">
              <h2 id="cp-purchase-title">Nayi khareedari add karein</h2>
              <button
                type="button"
                aria-label="Form band karein"
                onClick={() => setShowPurchaseForm(false)}
              >
                <X size={20} />
              </button>
            </div>
            <p>Ek ya do cheezen aur unki mahana qist likhein.</p>
            <div className="cp-monthly-input">
              <DatePartsPicker
                label="Plan B ki pehli qist ki tareekh"
                value={purchaseFirstDueDate}
                onChange={(date) => {
                  setPurchaseError(null);
                  setPurchaseFirstDueDate(date);
                }}
                error={
                  purchaseError?.field === "firstDueDate"
                    ? purchaseError.message
                    : undefined
                }
              />
            </div>
            {purchaseItems.map((item, index) => (
              <div className="cp-purchase-item" key={index}>
                <label>
                  Cheez ka naam
                  <input
                    required
                    value={item.name}
                    onChange={(event) => {
                      setPurchaseError(null);
                      const name = event.target.value.replace(
                        /[^\p{L}\s]/gu,
                        "",
                      );
                      setPurchaseItems((current) =>
                        current.map((entry, itemIndex) =>
                          itemIndex === index
                            ? { ...entry, name }
                            : entry,
                        ),
                      );
                    }}
                  />
                  {purchaseError?.field === "name" &&
                    purchaseError.itemIndex === index && (
                      <span className="cp-purchase-error" role="alert">
                        {purchaseError.message}
                      </span>
                    )}
                </label>
                <label>
                  Qeemat (Rs.)
                  <input
                    required
                    min="1"
                    step="1"
                    type="text"
                    inputMode="numeric"
                    value={item.price}
                    onChange={(event) => {
                      setPurchaseError(null);
                      setPurchaseItems((current) =>
                        current.map((entry, itemIndex) =>
                          itemIndex === index
                            ? {
                                ...entry,
                                price: event.target.value
                                  .replace(/\D/g, "")
                                  .replace(/^0+(?=\d)/, ""),
                              }
                            : entry,
                        ),
                      );
                    }}
                  />
                  {purchaseError?.field === "price" &&
                    purchaseError.itemIndex === index && (
                      <span className="cp-purchase-error" role="alert">
                        {purchaseError.message}
                      </span>
                    )}
                </label>
                <ItemPhoto
                  itemName={item.name}
                  file={item.photo}
                  onChange={(photo) =>
                    setPurchaseItems((current) =>
                      current.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, photo } : entry,
                      ),
                    )
                  }
                />
                {purchaseItems.length > 1 && (
                  <button
                    type="button"
                    className="cp-remove-purchase-item"
                    onClick={() =>
                      setPurchaseItems((current) =>
                        current.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                  >
                    Hatayein
                  </button>
                )}
              </div>
            ))}
            {purchaseItems.length < 2 && (
              <button
                className="cp-add-item"
                type="button"
                onClick={() =>
                  setPurchaseItems((current) => [
                    ...current,
                      { name: "", price: "", photo: undefined },
                  ])
                }
              >
                <Plus size={16} /> Ek aur cheez
              </button>
            )}
            <label className="cp-monthly-input">
              Advance (Rs.)
              <input
                min="0"
                step="1"
                type="text"
                inputMode="numeric"
                value={purchaseDownPayment}
                onFocus={() => {
                  setPurchaseError(null);
                  if (purchaseDownPayment === "0") setPurchaseDownPayment("");
                }}
                onBlur={() => {
                  if (!purchaseDownPayment) setPurchaseDownPayment("0");
                }}
                onChange={(event) => {
                  setPurchaseError(null);
                  setPurchaseDownPayment(
                    event.target.value
                      .replace(/\D/g, "")
                      .replace(/^0+(?=\d)/, ""),
                  );
                }}
              />
              {purchaseError?.field === "downPayment" && (
                <span className="cp-purchase-error" role="alert">
                  {purchaseError.message}
                </span>
              )}
            </label>
            <label className="cp-monthly-input">
              Mahana qist (Rs.)
              <input
                required
                min="1"
                step="1"
                type="text"
                inputMode="numeric"
                value={purchaseMonthly}
                onChange={(event) => {
                  setPurchaseError(null);
                  setPurchaseMonthly(
                    event.target.value
                      .replace(/\D/g, "")
                      .replace(/^0+(?=\d)/, ""),
                  );
                }}
              />
              {purchaseError?.field === "monthlyPayment" && (
                <span className="cp-purchase-error" role="alert">
                  {purchaseError.message}
                </span>
              )}
            </label>
            <div className="cp-purchase-actions">
              <button
                type="button"
                onClick={() => setShowPurchaseForm(false)}
                disabled={savingPurchase}
              >
                Wapas
              </button>
              <button type="submit" disabled={savingPurchase}>
                {savingPurchase ? "Save ho raha hai..." : "Khareedari save karein"}
              </button>
            </div>
          </form>
        </div>
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
