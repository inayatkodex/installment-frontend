import { Skeleton, SkeletonGroup } from "@/components/common/Skeleton/Skeleton";
import "./skeletons.scss";

const ShopDetailSkeleton = () => (
  <SkeletonGroup className="shop-detail-skeleton">
    <div className="shop-detail">
      <div className="sd-head">
        <div className="sd-head-main">
          <Skeleton width={68} height={68} radius="50%" />
          <div className="sd-skeleton-title">
            <div className="sd-title">
              <Skeleton width={190} height={32} />
              <Skeleton width={72} height={26} radius={999} />
            </div>
            <Skeleton width={260} height={14} />
          </div>
        </div>
        <div className="sd-head-actions">
          <Skeleton width={132} height={44} radius={10} />
          <Skeleton width={44} height={44} radius={10} />
        </div>
      </div>

      <div className="sd-two">
        <section className="sd-card">
          <Skeleton width={125} height={23} />
          {Array.from({ length: 6 }, (_, index) => (
            <div className="sd-row sd-skeleton-row" key={index}>
              <Skeleton width={74} height={14} />
              <Skeleton width={`${38 + (index % 3) * 12}%`} height={14} />
            </div>
          ))}
        </section>
        <section className="fee-card">
          <div className="fc-head">
            <div className="fc-title">
              <Skeleton width={42} height={42} radius={12} />
              <div className="sd-skeleton-fee-heading">
                <Skeleton width={136} height={22} />
                <Skeleton width={172} height={13} />
              </div>
            </div>
            <Skeleton width={74} height={26} radius={999} />
          </div>
          <div className="fc-summary">
            <div><Skeleton width={110} height={13} /><Skeleton width={90} height={24} /></div>
            <div><Skeleton width={110} height={13} /><Skeleton width={90} height={24} /></div>
          </div>
          <div className="sd-skeleton-fee-form">
            <Skeleton width="100%" height={66} radius={10} />
            <Skeleton width={100} height={46} radius={10} />
          </div>
          <Skeleton width="90%" height={14} />
        </section>
      </div>

      <section className="sd-card sd-password-card">
        <div className="sd-password-heading">
          <div className="sd-skeleton-password-heading">
            <Skeleton width={136} height={23} />
            <Skeleton width="min(100%, 470px)" height={14} />
            <Skeleton width="min(100%, 360px)" height={14} />
          </div>
          <Skeleton width={142} height={40} radius={9} />
        </div>
      </section>

      <section className="sd-card">
        <Skeleton width={190} height={23} />
        <div className="sd-profile-card">
          <Skeleton width={140} height={140} radius={16} />
          <div className="sd-skeleton-profile-meta">
            <Skeleton width={148} height={18} />
            <Skeleton width={215} height={14} />
          </div>
        </div>
      </section>
    </div>
  </SkeletonGroup>
);

export default ShopDetailSkeleton;
