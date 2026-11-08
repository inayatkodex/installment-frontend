import { Skeleton, SkeletonGroup } from "@/components/common/Skeleton/Skeleton";
import "./skeletons.scss";

const DashboardSkeleton = () => (
  <SkeletonGroup className="admin-dashboard-skeleton">
    <div className="dashboard-stats">
      <section className="ds-section">
        <div className="ds-section-heading">
          <div className="adsk-heading">
            <Skeleton width={48} height={11} />
            <Skeleton width={145} height={25} />
          </div>
          <Skeleton width={104} height={30} radius={999} />
        </div>
        <div className="ds-grid">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="ds-card adsk-stat-card" key={index}>
              <div className="ds-card-top">
                <Skeleton width={64} height={15} />
                <Skeleton width={30} height={30} radius={9} />
              </div>
              <Skeleton width={70} height={38} />
              <div className="ds-card-bottom">
                <Skeleton width="68%" height={12} />
                <Skeleton width={38} height={12} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ds-section ds-fee-section">
        <div className="ds-section-heading">
          <div className="adsk-heading">
            <Skeleton width={54} height={11} />
            <Skeleton width={205} height={25} />
          </div>
          <Skeleton width={84} height={29} radius={9} />
        </div>
        <Skeleton className="adsk-fee-subtitle" width={240} height={14} />
        <div className="ds-fees">
          <div className="ds-fee adsk-fee">
            <Skeleton width={90} height={14} />
            <Skeleton width={126} height={32} />
            <Skeleton width={104} height={13} />
          </div>
          <div className="ds-fee adsk-fee">
            <Skeleton width={90} height={14} />
            <Skeleton width={126} height={32} />
            <Skeleton width={104} height={13} />
          </div>
          <div className="ds-fee white adsk-fee-progress">
            <div className="ds-progress-heading">
              <Skeleton width={140} height={16} />
              <Skeleton width={38} height={24} />
            </div>
            <Skeleton className="adsk-progress-bar" width="100%" height={9} radius={99} />
            <Skeleton width="75%" height={12} />
            <Skeleton width="100%" height={42} radius={10} />
          </div>
        </div>
      </section>
    </div>
  </SkeletonGroup>
);

export default DashboardSkeleton;
