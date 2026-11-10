import { Skeleton, SkeletonGroup } from "@/components/common/Skeleton/Skeleton";
import { Download, Search } from "lucide-react";
import "./shop-skeletons.scss";

const SHOP_LOADING_LABEL = "Ruk jayen…";

export const StatCardSkeleton = ({
  tone = "blue",
  hint = false,
}: {
  tone?: "blue" | "green" | "yellow" | "red" | "gray";
  hint?: boolean;
}) => (
  <div className={`stat-card ${tone} stat-card-skeleton`}>
    <p className="stat-label">
      <Skeleton width="68%" height={14} />
      <Skeleton width={34} height={14} />
    </p>
    <Skeleton className="stat-value" width="72%" height={26} />
    {hint && <Skeleton className="stat-hint" width="92%" height={12} />}
  </div>
);

export const CustomerCardSkeleton = () => (
  <SkeletonGroup className="shop-customer-list-skeleton" label={SHOP_LOADING_LABEL}>
    <ul className="cu-list">
      {Array.from({ length: 5 }, (_, index) => (
        <li className="cc-wrap" key={index}>
          <div className="customer-card">
            <Skeleton className="cc-avatar" width={48} height={48} radius={15} />
            <div className="cc-body">
              <div className="cc-top">
                <Skeleton width="62%" height={19} />
                <Skeleton width={62} height={23} radius={999} />
              </div>
              <Skeleton className="cc-sub" width="72%" height={14} />
              <div className="cc-bottom">
                <Skeleton width="48%" height={16} />
                <Skeleton width="38%" height={13} />
              </div>
              <Skeleton className="cc-progress" width="100%" height={6} radius={99} />
            </div>
            <Skeleton className="cc-arrow" width={20} height={20} radius={4} />
          </div>
        </li>
      ))}
    </ul>
  </SkeletonGroup>
);

export const CollectionRowSkeleton = ({ showCall = false }: { showCall?: boolean }) => (
  <li className="collection-row cr-skeleton">
    <Skeleton className="cr-avatar" width={46} height={46} radius={14} />
    <div className="cr-info">
      <Skeleton className="cr-name" width="82%" height={18} />
      <Skeleton className="cr-phone" width="66%" height={15} />
      <Skeleton width={68} height={22} radius={999} />
    </div>
    <div className="cr-end">
      <Skeleton width={78} height={20} />
      <div className="cr-actions">
        {showCall && (
          <Skeleton className="cr-action" width={42} height={42} radius="50%" />
        )}
        <Skeleton className="cr-action" width={82} height={40} radius={10} />
      </div>
    </div>
  </li>
);

export const LateCardSkeleton = () => (
  <li className="late-card lc-skeleton">
    <div className="lc-top">
      <Skeleton className="lc-avatar" width={46} height={46} radius={14} />
      <div className="lc-name">
        <Skeleton width="78%" height={19} />
        <Skeleton width="68%" height={15} />
      </div>
      <Skeleton className="lc-status" width={76} height={24} radius={999} />
    </div>
    <div className="lc-mid">
      <Skeleton className="lc-amount" width={112} height={29} />
      <Skeleton className="lc-count" width={86} height={17} />
    </div>
    <Skeleton className="lc-last" width="74%" height={15} />
    <Skeleton className="lc-receive" width="100%" height={52} radius={12} />
  </li>
);

export const LifecycleListSkeleton = () => (
  <SkeletonGroup className="lifecycle-list-skeleton" label={SHOP_LOADING_LABEL}>
    <ul className="cl-list">
      {Array.from({ length: 4 }, (_, index) => (
        <li className="cl-item" key={index}>
          <div>
            <Skeleton width="min(100%, 220px)" height={21} />
            <span className="cl-meta">
              <Skeleton className="cl-code" width={86} height={24} radius={7} />
            </span>
            <span className="cl-date">
              <Skeleton className="cl-date-icon" width={15} height={15} radius={4} />
              <Skeleton width={150} height={15} />
            </span>
          </div>
          <div className="cl-restore">
            <Skeleton className="cl-restore-icon" width={16} height={16} radius={4} />
            <Skeleton className="cl-restore-label" width={82} height={14} />
          </div>
        </li>
      ))}
    </ul>
  </SkeletonGroup>
);

export const ShopDashboardSkeleton = () => (
  <SkeletonGroup className="shop-dashboard-skeleton" label={SHOP_LOADING_LABEL}>
    <div className="shop-dashboard">
      <header className="sd-welcome">
        <div className="sd-welcome-copy">
          <Skeleton className="sd-eyebrow" width={176} height={25} radius={99} />
          <Skeleton className="sd-greeting" width={194} height={18} />
          <Skeleton className="sd-title-line" />
          <div className="sd-description-lines">
            <Skeleton className="sd-description-line" />
            <Skeleton className="sd-description-line sd-description-second" />
          </div>
        </div>
        <div className="sd-welcome-mark">
          <Skeleton className="sd-mark-icon sd-welcome-mark-icon" />
          <Skeleton className="sd-mark-label" width={114} height={11} />
        </div>
      </header>

      <div className="sd-grid">
        <StatCardSkeleton tone="yellow" />
        <StatCardSkeleton tone="blue" />
        <StatCardSkeleton tone="green" hint />
        <StatCardSkeleton tone="red" />
      </div>

      <div className="sd-actions">
        <div className="sd-cta"><Skeleton width={190} height={17} /></div>
        <div className="sd-add"><Skeleton width={130} height={17} /></div>
      </div>

      <div className="sd-dashboard-grid">
        <section className="sd-panel sd-customers">
          <div className="sd-head">
            <div className="sd-skeleton-heading">
              <Skeleton width={148} height={22} />
              <Skeleton width={136} height={16} />
            </div>
            <Skeleton width={48} height={16} />
          </div>
          <ul className="sd-list">
            {Array.from({ length: 3 }, (_, index) => (
              <CollectionRowSkeleton key={index} />
            ))}
          </ul>
        </section>

        <aside className="sd-side">
          <div className="sd-late">
            <Skeleton width={40} height={40} radius={13} />
            <div className="sd-skeleton-late-copy">
              <Skeleton width={102} height={18} />
              <Skeleton width={150} height={14} />
            </div>
            <Skeleton width={72} height={17} />
          </div>
          <section className="sd-panel sd-month">
            <div className="sd-head">
              <div className="sd-skeleton-heading">
                <Skeleton width={124} height={22} />
                <Skeleton width={168} height={16} />
              </div>
              <Skeleton width={42} height={25} />
            </div>
            <Skeleton width="100%" height={9} radius={99} />
            <div className="sd-meta">
              <Skeleton width="47%" height={14} />
              <Skeleton width="43%" height={14} />
            </div>
          </section>
        </aside>
      </div>
    </div>
  </SkeletonGroup>
);

export const CollectionTopSkeleton = () => (
  <SkeletonGroup className="collection-top-skeleton" label={SHOP_LOADING_LABEL}>
    <div className="cp-top">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index}>
          <Skeleton width="74%" height={19} />
          <Skeleton width="88%" height={14} />
        </div>
      ))}
    </div>
    <div className="search-bar">
      <Search size={20} aria-hidden="true" />
      <Skeleton className="search-input-placeholder" width="38%" height={16} />
    </div>
    <ul className="cp-list">
      {Array.from({ length: 5 }, (_, index) => (
        <CollectionRowSkeleton key={index} showCall />
      ))}
    </ul>
  </SkeletonGroup>
);

export const CustomerProfileSkeleton = () => (
  <SkeletonGroup className="customer-profile-skeleton" label={SHOP_LOADING_LABEL}>
    <div className="customer-profile">
      <div className="cp-hero">
        <div className="cp-banner" />
        <Skeleton className="cp-menu-skeleton" width={40} height={40} radius={12} />
        <div className="cp-who">
          <Skeleton className="cp-photo" width={100} height={100} radius="50%" />
          <Skeleton width="min(72%, 230px)" height={27} />
          <Skeleton width="min(62%, 190px)" height={17} />
          <Skeleton width={82} height={25} radius={999} />
        </div>
      </div>

      <div className="cp-sum">
        {[0, 1, 2].map((index) => (
          <div className={["blue", "green", "red"][index]} key={index}>
            <Skeleton width="70%" height={14} />
            <Skeleton width="82%" height={18} />
          </div>
        ))}
      </div>
      <Skeleton className="cp-bar" width="calc(100% - 32px)" height={10} radius={99} />
      <div className="cp-bar-text">
        <Skeleton width={180} height={16} />
      </div>

      <section className="cp-section">
        <div className="cp-head">
          <Skeleton width={126} height={23} />
          <Skeleton width={54} height={17} />
        </div>
        <ul className="cp-skeleton-items">
          {Array.from({ length: 3 }, (_, index) => (
            <li className="cp-item" key={index}>
              <Skeleton className="cp-item-icon" width={48} height={48} radius={12} />
              <div className="cp-skeleton-item-copy">
                <Skeleton width="74%" height={17} />
                <Skeleton width="56%" height={14} />
              </div>
              <Skeleton width={64} height={18} />
            </li>
          ))}
        </ul>
        <div className="cp-total">
          <Skeleton width={46} height={17} />
          <Skeleton width={80} height={19} />
        </div>
      </section>

      <section className="cp-section">
        <div className="cp-head">
          <Skeleton width={126} height={23} />
        </div>
        <div className="cp-docs-row">
          <Skeleton width={20} height={20} radius={4} />
          <div className="cp-skeleton-doc-copy">
            <Skeleton width={148} height={17} />
            <Skeleton width={204} height={14} />
          </div>
          <Skeleton width={64} height={38} radius={10} />
        </div>
      </section>

      <section className="cp-section cp-installments-skeleton">
        <div className="cp-head">
          <Skeleton width={130} height={23} />
          <div className="cp-installment-actions">
            <Skeleton width={90} height={16} />
            <Skeleton width={74} height={16} />
          </div>
        </div>
        <ol className="cp-timeline">
          {Array.from({ length: 3 }, (_, index) => (
            <li className="cp-inst" key={index}>
              <Skeleton
                className={`cp-dot cp-dot-skeleton ${index === 0 ? "cp-dot-paid" : ""}`}
                width={36}
                height={36}
                radius="50%"
              />
              <div className="cp-inst-box cp-inst-box-skeleton">
                <div className="cp-row">
                  <Skeleton width={index === 0 ? 72 : 116} height={16} />
                  <Skeleton width={76} height={16} />
                </div>
                <Skeleton width={index === 0 ? 138 : 156} height={13} />
              </div>
            </li>
          ))}
        </ol>
        <Skeleton className="cp-show-installments" width="100%" height={48} radius={12} />
      </section>

      <div className="cp-footer cp-footer-skeleton">
        <Skeleton className="cp-pay-skeleton" width="100%" height={64} radius={16} />
      </div>
    </div>
  </SkeletonGroup>
);

export const CustomerEditSkeleton = () => (
  <SkeletonGroup className="customer-edit-skeleton" label={SHOP_LOADING_LABEL}>
    <div className="customer-edit-page">
      <div className="ce-back"><Skeleton width={112} height={18} /></div>
      <Skeleton className="ce-title" width={194} height={27} />
      <section className="ce-card">
        <div className="ce-skeleton-card-heading">
          <Skeleton width={158} height={21} />
          <Skeleton width={178} height={16} />
        </div>
        <div className="ce-form-grid">
          {[0, 1, 2, 3].map((index) => (
            <div className="ce-skeleton-field" key={index}>
              <Skeleton width="58%" height={14} />
              <div className="ce-skeleton-input">
                <Skeleton width={`${38 + (index % 3) * 12}%`} height={16} />
              </div>
            </div>
          ))}
          <div className="ce-full-field ce-skeleton-field">
            <Skeleton width="34%" height={14} />
            <div className="ce-skeleton-input ce-skeleton-textarea">
              <Skeleton width="52%" height={16} />
            </div>
          </div>
        </div>
      </section>

      <section className="ce-card">
        <Skeleton width={144} height={21} />
        <div className="ce-skeleton-plan">
          <Skeleton width="48%" height={14} />
          <div className="ce-skeleton-input">
            <Skeleton width="40%" height={16} />
          </div>
          <Skeleton width="88%" height={14} />
          <Skeleton width="54%" height={14} />
          <div className="ce-skeleton-input">
            <Skeleton width="34%" height={16} />
          </div>
          <Skeleton width="90%" height={14} />
        </div>
      </section>

      <section className="ce-card">
        <div className="ce-skeleton-card-heading">
          <Skeleton width={92} height={21} />
          <Skeleton width={184} height={16} />
        </div>
        <div className="ce-docs-list">
          {[0, 1, 2].map((index) => (
            <div className="ce-doc-row" key={index}>
              <div className="ce-doc-left">
                <Skeleton className="ce-doc-thumb" width={52} height={52} radius={10} />
                <div className="ce-doc-meta">
                  <Skeleton width={94} height={16} />
                  <Skeleton width={78} height={13} />
                </div>
              </div>
              <div className="ce-doc-actions">
                <Skeleton width={76} height={38} radius={10} />
              </div>
            </div>
          ))}
        </div>
        <div className="ce-footer-actions">
          <Skeleton width="100%" height={48} radius={10} />
          <Skeleton width="100%" height={48} radius={10} />
        </div>
      </section>
    </div>
  </SkeletonGroup>
);

export const StatusSummarySkeleton = () => (
  <SkeletonGroup className="status-summary-skeleton" label={SHOP_LOADING_LABEL}>
    <div className="status-summary">
      <section className="ss-cash-card">
        <Skeleton className="ss-eyebrow-skeleton" width={172} height={16} />
        <Skeleton className="ss-cash-total" width="min(100%, 230px)" height={42} />
        <div className="ss-cash-note-skeleton">
          <Skeleton width="min(100%, 315px)" height={16} />
          <Skeleton className="ss-cash-note-icon" width={16} height={16} radius="50%" />
        </div>
      </section>
      <section className="ss-installments">
        <div className="ss-section-heading">
          <div className="ss-skeleton-heading">
            <Skeleton width={190} height={20} />
            <Skeleton className="ss-paid-count" width={78} height={15} />
            <Skeleton className="ss-monthly-target" width="min(100%, 228px)" height={15} />
          </div>
          <Skeleton width={30} height={30} radius="50%" />
        </div>
        <Skeleton className="ss-progress" width="100%" height={9} radius={99} />
        <div className="ss-status-list">
          {[0, 1, 2].map((index) => (
            <div className={`ss-status-row ss-status-row-${index}`} key={index}>
              <Skeleton className="ss-status-icon-skeleton" width={24} height={24} radius="50%" />
              <Skeleton className="ss-status-name-skeleton" width={58} height={16} />
              <div className="ss-skeleton-status-values">
                <Skeleton width={78} height={15} />
                <Skeleton width={92} height={13} />
              </div>
              {index === 2 && <Skeleton className="ss-status-chevron" width={18} height={18} />}
            </div>
          ))}
        </div>
        <Skeleton className="ss-footnote" width={160} height={13} />
      </section>
    </div>
    <div className="st-download">
      <div className="ss-download-skeleton">
        <Download size={20} aria-hidden="true" />
        <Skeleton width={156} height={16} />
      </div>
    </div>
  </SkeletonGroup>
);

export const ShopProfileSkeleton = () => (
  <SkeletonGroup className="shop-profile-skeleton" label={SHOP_LOADING_LABEL}>
    <section className="sp-card">
      <div className="sp-heading">
        <Skeleton className="sp-photo" width={58} height={58} radius="50%" />
        <div className="sp-shop-name sp-skeleton-shop-name">
          <Skeleton width="min(100%, 230px)" height={24} />
          <Skeleton width={82} height={15} />
        </div>
        <div className="sp-heading-actions">
          <Skeleton width={76} height={28} radius={999} />
          <Skeleton width={114} height={38} radius={9} />
        </div>
      </div>
      <div className="sp-owner">
        <Skeleton className="sp-owner-icon" width={40} height={40} radius="50%" />
        <div className="sp-skeleton-owner">
          <Skeleton width={42} height={13} />
          <Skeleton width={142} height={17} />
        </div>
      </div>
      <dl className="sp-details">
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index}>
            <dt><Skeleton width={108} height={15} /></dt>
            <dd><Skeleton width={`${38 + (index % 3) * 10}%`} height={15} /></dd>
          </div>
        ))}
      </dl>
      <div className="sp-card-actions">
        <Skeleton width={168} height={44} radius={10} />
      </div>
    </section>
  </SkeletonGroup>
);

export const LatePageSkeleton = () => (
  <SkeletonGroup className="late-page-skeleton" label={SHOP_LOADING_LABEL}>
    <div className="lp-totals">
      <StatCardSkeleton tone="red" />
      <StatCardSkeleton tone="yellow" />
    </div>
    <div className="search-bar">
      <Search size={20} aria-hidden="true" />
      <Skeleton className="lp-search-placeholder" width="72%" height={16} />
    </div>
    <div className="lp-summary-skeleton">
      <Skeleton className="lp-summary-placeholder" width="min(100%, 360px)" height={18} />
    </div>
    <ul className="lp-list">
      {Array.from({ length: 4 }, (_, index) => (
        <LateCardSkeleton key={index} />
      ))}
    </ul>
  </SkeletonGroup>
);
