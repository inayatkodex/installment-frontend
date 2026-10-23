"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import CommonBtn from "@/components/common/CommonButton/Button";
import Loader from "@/components/common/Loader/Loader";
import MonthPicker from "@/components/common/MonthPicker/MonthPicker";
import StatusSummary from "@/components/shop/status-summary/StatusSummary";
import { fetchStatus } from "@/store/slices/shop/status/shopStatusSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { downloadCsv } from "@/shared/downloadUtils";
import { currentMonthKey } from "@/shared/planUtils";
import "./status.scss";

const StatusPage = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((s) => s.shopStatus);
  const max = currentMonthKey();
  const [month, setMonth] = useState(max);

  useEffect(() => {
    dispatch(fetchStatus(month));
  }, [dispatch, month]);

  const download = () => {
    if (!data) return;
    downloadCsv(`status-${data.month}.csv`, [
      ["Mahina", data.label],
      ["Expected", data.expected],
      ["Received", data.received],
      ["Remaining", data.remaining],
      ["Late amount", data.overdue],
      ["Wasooli %", data.collectedPercent],
      ["Total customers", data.totalCustomers],
      ["Paid qistein", data.paidInstallments],
      ["Baaki qistein", data.pendingInstallments],
      ["Late customers", data.overdueCustomers],
    ]);
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
          <Loader />
        ) : (
          <StatusSummary report={data} />
        )}
      </div>

      {data && !loading && (
        <div className="st-download">
          <CommonBtn
            text="Download Report"
            icon={<Download size={20} />}
            className="full-btn"
            onClick={download}
          />
        </div>
      )}
    </div>
  );
};

export default StatusPage;
