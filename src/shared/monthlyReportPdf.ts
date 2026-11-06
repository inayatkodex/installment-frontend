import type { StatusReport } from "@/types/payment";

const formatAmount = (amount: number) =>
  `Rs. ${new Intl.NumberFormat("en-PK").format(amount)}`;

const formatInstallmentDates = (dates: string[]) =>
  dates
    .map((date) => {
      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    })
    .join(", ");

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 14;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
type RgbColor = [number, number, number];

const COLORS: Record<string, RgbColor> = {
  ink: [23, 43, 69],
  muted: [82, 101, 123],
  line: [220, 228, 236],
  blue: [23, 105, 170],
  green: [22, 128, 71],
  red: [180, 35, 24],
  amber: [154, 90, 0],
  pale: [247, 249, 252],
};

export async function downloadMonthlyReportPdf(
  report: StatusReport,
  shopName: string,
) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  pdf.setDisplayMode("fullpage", "single");
  const safeShopName = shopName.trim() || "Dukaan";

  const drawHeader = (subtitle: string) => {
    pdf.setFillColor(...COLORS.blue);
    pdf.rect(0, 0, PAGE_WIDTH, 22, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    const shopNameMaxWidth = CONTENT_WIDTH - 75;
    let headerShopName = safeShopName;
    while (
      headerShopName.length > 1 &&
      pdf.getTextWidth(headerShopName) > shopNameMaxWidth
    ) {
      headerShopName = `${headerShopName.slice(0, -2).trimEnd()}…`;
    }
    pdf.text(headerShopName, MARGIN, 9);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text(subtitle, MARGIN, 16);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text(report.label, PAGE_WIDTH - MARGIN, 9, { align: "right" });
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text("MONTHLY REPORT", PAGE_WIDTH - MARGIN, 16, { align: "right" });
  };

  const drawSectionTitle = (title: string, y: number) => {
    pdf.setTextColor(...COLORS.ink);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text(title, MARGIN, y);
  };

  const drawDescription = (text: string, y: number) => {
    pdf.setTextColor(...COLORS.muted);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text(text, MARGIN, y, { maxWidth: CONTENT_WIDTH });
  };

  const drawAmountRow = (
    label: string,
    amount: number,
    y: number,
    color: RgbColor = COLORS.ink,
    strong = false,
  ) => {
    if (strong) {
      pdf.setDrawColor(...COLORS.line);
      pdf.setFillColor(...COLORS.pale);
      pdf.roundedRect(MARGIN, y, CONTENT_WIDTH, 12, 2, 2, "FD");
    } else {
      pdf.setDrawColor(...COLORS.line);
      pdf.line(MARGIN, y + 13, PAGE_WIDTH - MARGIN, y + 13);
    }
    pdf.setTextColor(...COLORS.muted);
    pdf.setFont("helvetica", strong ? "bold" : "normal");
    pdf.setFontSize(10);
    pdf.text(label, MARGIN + 5, y + 7.7);
    pdf.setTextColor(...color);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text(formatAmount(amount), PAGE_WIDTH - MARGIN - 5, y + 7.7, {
      align: "right",
    });
  };

  const drawFooter = (pageNumber: number, pageCount: number) => {
    pdf.setDrawColor(...COLORS.line);
    pdf.line(MARGIN, PAGE_HEIGHT - 13, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 13);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.muted);
    pdf.text(
      `${report.month} · ${pageNumber} / ${pageCount}`,
      PAGE_WIDTH / 2,
      PAGE_HEIGHT - 7,
      { align: "center" },
    );
  };

  drawHeader("Dukaan ka mahana hisaab");

  drawSectionTitle("Is mahine kitni cash aayi?", 47);
  drawDescription(
    "Is mahine receive hui raqam.",
    54,
  );
  drawAmountRow("Kul cash mila", report.cashCollected, 60, COLORS.green, true);
  drawAmountRow(
    "Is mahine due qiston par mila",
    report.cashBreakdown.thisMonth,
    76,
  );
  drawAmountRow(
    "Pichle mahino ki late qiston se mila",
    report.cashBreakdown.late,
    92,
    COLORS.red,
  );
  drawAmountRow(
    "Aane wali qiston ke liye mila",
    report.cashBreakdown.advance,
    108,
    COLORS.blue,
  );

  drawSectionTitle("Is mahine due qistein", 140);
  drawDescription(
    "Ab tak jama raqam mein pichle mahino ki wasooli bhi ho sakti hai.",
    147,
  );
  drawAmountRow("Kul qiston ki raqam", report.expected, 153);
  drawAmountRow("In qiston par ab tak jama", report.received, 169, COLORS.green);
  drawAmountRow(
    "Is mahine in qiston par jama",
    report.cashBreakdown.thisMonth,
    185,
    COLORS.blue,
  );
  drawAmountRow(
    "Baqi qistein",
    Math.max(0, report.remaining - report.overdue),
    201,
    COLORS.amber,
  );
  drawAmountRow("Late qistein", report.overdue, 217, COLORS.red);

  pdf.setTextColor(...COLORS.ink);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text(
    `Mukammal qistein: ${report.paidInstallments} / ${report.paidInstallments + report.pendingInstallments}`,
    MARGIN,
    239,
  );

  pdf.addPage("a4", "portrait");
  drawHeader("Customer ke mutabiq qiston ka hisaab");
  const wasoolCustomers = report.customers.filter(
    (customer) => customer.remaining <= 0,
  );
  const lateCustomers = report.customers.filter(
    (customer) => customer.remaining > 0 && customer.overdue > 0,
  );
  const baqiCustomers = report.customers.filter(
    (customer) => customer.remaining > 0 && customer.overdue === 0,
  );
  const tableOptions = {
    margin: { left: MARGIN, right: MARGIN, top: 26, bottom: 18 },
    theme: "grid" as const,
    styles: {
      font: "helvetica",
      fontSize: 10,
      cellPadding: { top: 2.2, right: 2, bottom: 2.2, left: 2 },
      textColor: COLORS.ink,
      lineColor: COLORS.line,
      lineWidth: 0.15,
      valign: "middle" as const,
      overflow: "linebreak" as const,
      minCellHeight: 9,
    },
    headStyles: {
      fillColor: COLORS.pale,
      textColor: COLORS.ink,
      fontStyle: "bold" as const,
      fontSize: 10,
      cellPadding: { top: 2.2, right: 2, bottom: 2.2, left: 2 },
    },
    alternateRowStyles: { fillColor: [252, 253, 254] as [number, number, number] },
    rowPageBreak: "avoid" as const,
    showHead: "everyPage" as const,
    didDrawPage: ({ pageNumber }: { pageNumber: number }) => {
      if (pageNumber > 1) {
        drawHeader("Customer ke mutabiq qiston ka hisaab");
      }
    },
  };

  let sectionY = 32;
  const drawCustomerSection = (
    title: string,
    customers: StatusReport["customers"],
    dates: (customer: StatusReport["customers"][number]) => string[],
    amountLabel: string,
    amount: (customer: StatusReport["customers"][number]) => number,
    amountColor: RgbColor,
  ) => {
    if (customers.length === 0) return;
    if (sectionY > PAGE_HEIGHT - 55) {
      pdf.addPage("a4", "portrait");
      drawHeader("Customer ke mutabiq qiston ka hisaab");
      sectionY = 32;
    }

    drawSectionTitle(`${title} (${customers.length})`, sectionY);
    autoTable(pdf, {
      ...tableOptions,
      startY: sectionY + 6,
      head: [["#", "Customer", "Mobile", "Qist ki tareekh", amountLabel]],
      body: customers.map((customer, index) => [
        String(index + 1),
        customer.name,
        customer.phone,
        formatInstallmentDates(dates(customer)),
        formatAmount(amount(customer)),
      ]),
      foot: [[
        "",
        "Kul",
        "",
        "",
        formatAmount(customers.reduce((total, customer) => total + amount(customer), 0)),
      ]],
      footStyles: {
        fillColor: COLORS.pale,
        textColor: COLORS.ink,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 43 },
        2: { cellWidth: 43 },
        3: { cellWidth: 43 },
        4: { cellWidth: 43, halign: "right", textColor: amountColor },
      },
    });
    sectionY =
      (pdf as typeof pdf & { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY ?? sectionY + 24;
    sectionY += 8;
  };

  drawCustomerSection(
    "Wasool",
    wasoolCustomers,
    (customer) => customer.paidInstallmentDates,
    "Jama raqam",
    (customer) => customer.received,
    COLORS.green,
  );
  drawCustomerSection(
    "Late",
    lateCustomers,
    (customer) => customer.lateInstallmentDates,
    "Late raqam",
    (customer) => customer.overdue,
    COLORS.red,
  );
  drawCustomerSection(
    "Baqi",
    baqiCustomers,
    (customer) => customer.pendingInstallmentDates,
    "Baqi raqam",
    (customer) => Math.max(0, customer.remaining - customer.overdue),
    COLORS.amber,
  );
  if (
    wasoolCustomers.length === 0 &&
    lateCustomers.length === 0 &&
    baqiCustomers.length === 0
  ) {
    drawDescription("Is mahine koi qist schedule nahi thi.", 46);
  }

  const pageCount = pdf.getNumberOfPages();
  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    pdf.setPage(pageNumber);
    drawFooter(pageNumber, pageCount);
  }

  pdf.save(`mahine-ka-hisaab-${report.month}.pdf`);
}
