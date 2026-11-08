import { Skeleton, SkeletonGroup } from "@/components/common/Skeleton/Skeleton";
import "./skeletons.scss";

const PendingRequestsSkeleton = () => (
  <SkeletonGroup className="pending-requests-skeleton">
    <ul>
      {Array.from({ length: 3 }, (_, index) => (
        <li key={index}>
          <Skeleton className="pr-avatar" width={44} height={44} radius="50%" />
          <div className="pr-skeleton-details">
            <Skeleton width="65%" height={16} />
            <Skeleton width="78%" height={13} />
            <Skeleton width="54%" height={12} />
          </div>
          <Skeleton className="pr-skeleton-badge" width={72} height={26} radius={999} />
          <Skeleton className="pr-skeleton-review" width={76} height={40} radius={9} />
        </li>
      ))}
    </ul>
  </SkeletonGroup>
);

export default PendingRequestsSkeleton;
