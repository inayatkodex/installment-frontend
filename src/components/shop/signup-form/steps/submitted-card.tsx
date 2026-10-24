import Link from "next/link";
import { Clock } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge/StatusBadge";
import { ROUTES } from "@/constant/appRoutes";

const SubmittedCard = ({
  shopName,
  ownerName,
}: {
  shopName: string;
  ownerName: string;
}) => (
  <div className="su-done" role="status">
    <span className="su-clock">
      <Clock size={44} aria-hidden="true" />
    </span>
    <h1>Registration bhej di gayi</h1>
    <p className="ur" lang="ur">
      درخواست جمع ہو گئی
    </p>
    <p className="su-text">
      Admin aap ki maloomat check karega. Approve hone par aap login kar sakein
      ge.
    </p>
    <div className="su-card">
      <div>
        <span>Dukaan</span>
        <b>{shopName}</b>
      </div>
      <div>
        <span>Malik</span>
        <b>{ownerName}</b>
      </div>
      <div>
        <span>Status</span>
        <StatusBadge status="pending" />
      </div>
    </div>
    <Link href={ROUTES.SHOP.LOGIN} className="su-login">
      Login page par jayein
    </Link>
  </div>
);

export default SubmittedCard;
