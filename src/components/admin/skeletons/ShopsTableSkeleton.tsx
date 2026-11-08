import { Skeleton, SkeletonGroup } from "@/components/common/Skeleton/Skeleton";
import "./skeletons.scss";

const ShopCellSkeleton = () => (
  <div className="st-shop-cell">
    <Skeleton className="st-avatar" width={40} height={40} radius="50%" />
    <div className="st-shop">
      <Skeleton width={116} height={15} />
      <Skeleton width={92} height={12} />
    </div>
  </div>
);

const ShopsTableSkeleton = () => (
  <SkeletonGroup className="shops-table-skeleton">
    <div className="data-table">
      <div className="dt-scroll">
        <table>
          <thead>
            <tr>
              {["Shop", "Owner", "Phone", "Registered", "Status", "Fee (This Month)", "Action"].map(
                (heading) => (
                  <th key={heading}>{heading}</th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, index) => (
              <tr key={index}>
                <td><ShopCellSkeleton /></td>
                <td><Skeleton width={96} height={14} /></td>
                <td><Skeleton width={94} height={14} /></td>
                <td><Skeleton width={82} height={14} /></td>
                <td><Skeleton width={70} height={26} radius={999} /></td>
                <td><Skeleton width={92} height={30} radius={8} /></td>
                <td>
                  <div className="st-actions">
                    <Skeleton width={116} height={40} radius={10} />
                    <Skeleton width={54} height={38} radius={9} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="dt-cards">
        {Array.from({ length: 6 }, (_, index) => (
          <li key={index}>
            <div className="dt-card-title"><ShopCellSkeleton /></div>
            {[
              ["Owner", 95],
              ["Phone", 90],
              ["Registered", 82],
              ["Status", 68],
              ["Fee (This Month)", 92],
            ].map(([label, width]) => (
              <div className="dt-card-row" key={label}>
                <span>{label}</span>
                <Skeleton width={Number(width)} height={14} />
              </div>
            ))}
            <div className="dt-card-row">
              <span>Action</span>
              <div className="st-actions">
                <Skeleton width={108} height={38} radius={9} />
                <Skeleton width={48} height={38} radius={9} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </SkeletonGroup>
);

export default ShopsTableSkeleton;
