"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import CommonBtn from "@/components/common/CommonButton/Button";
import MonthPicker from "@/components/common/MonthPicker/MonthPicker";
import { StatusSummarySkeleton } from "@/components/shop/skeletons/ShopSkeletons";
import StatusSummary from "@/components/shop/status-summary/StatusSummary";
import { showToast } from "@/shared/toastUtils";
import { downloadMonthlyReportPdf } from "@/shared/monthlyReportPdf";
import { fetchStatus } from "@/store/slices/shop/status/shopStatusSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { currentMonthKey } from "@/shared/planUtils";
import "./status.scss";

const StatusPage = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((s) => s.shopStatus);
  const shop = useAppSelector((s) => s.shopAuth.user);
  const max = currentMonthKey();
  const [month, setMonth] = useState(max);

  useEffect(() => {
    dispatch(fetchStatus(month));
  }, [dispatch, month]);

  const downloadPdf = async () => {
    if (!data) return;
    try {
      await downloadMonthlyReportPdf(data, shop?.shopName || "Dukaan");
    } catch {
      showToast("PDF download nahi ho saki. Dobara koshish karein.", "error");
    }
  };

  return (
    <div className="status-page">
      <h1 className="page-title">
        Status{" "}
        <span className="ur" lang="ur">
          اسٹیٹس
        </span>
      </h1>
      <MonthPicker value={month} maxValue={max} onChange={setMonth} />
      {month < max && (
        <p className="st-saved-report" aria-label="Report mehfooz hai">
          Report mehfooz hai
        </p>
      )}

      <div className="st-body">
        {error ? (
          <div className="st-error" role="alert">
            <p>{error}</p>
            <CommonBtn
              text="Dobara koshish karein"
              onClick={() => dispatch(fetchStatus(month))}
            />
          </div>
        ) : !data || loading ? (
          <StatusSummarySkeleton />
        ) : (
          <StatusSummary report={data} />
        )}
      </div>

      {data && !loading && (
        <div className="st-download">
          <CommonBtn
            text="PDF download karein"
            icon={<Download size={20} />}
            className="full-btn"
            onClick={downloadPdf}
          />
        </div>
      )}
    </div>
  );
};

export default StatusPage;
