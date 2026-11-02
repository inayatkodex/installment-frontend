import type { StatusReport } from "@/types/payment";

const formatAmount = (amount: number) =>
  `Rs. ${new Intl.NumberFormat("en-PK").format(amount)}`;

export async function downloadMonthlyReportPdf(
  report: StatusReport,
  shopName: string,
) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 14;
  const safeShopName = shopName.trim() || "Dukaan";

  pdf.setFillColor(23, 105, 170);
  pdf.rect(0, 0, pageWidth, 34, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(19);
  pdf.text(safeShopName, margin, 14);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text("Mahine ka asaan hisaab", margin, 22);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text(report.label, pageWidth - margin, 15, { align: "right" });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text("Monthly report", pageWidth - margin, 22, { align: "right" });

  const cards = [
    { label: "Is mahine lena tha", amount: report.expected, color: [23, 43, 69] },
    { label: "Wasooli ho gayi", amount: report.received, color: [22, 128, 71] },
    { label: "Abhi baqi hai", amount: report.remaining, color: [154, 90, 0] },
    { label: "Late raqam", amount: report.overdue, color: [180, 35, 24] },
  ] as const;
  const gap = 4;
  const cardY = 41;
  const cardWidth = (pageWidth - margin * 2 - gap * 3) / 4;
  cards.forEach((card, index) => {
    const x = margin + index * (cardWidth + gap);
    pdf.setDrawColor(216, 225, 235);
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(x, cardY, cardWidth, 21, 2, 2, "FD");
    pdf.setTextColor(82, 101, 123);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text(card.label, x + 4, cardY + 7);
    pdf.setTextColor(card.color[0], card.color[1], card.color[2]);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text(formatAmount(card.amount), x + 4, cardY + 16);
  });

  const progressX = margin;
  const progressY = 68;
  const progressWidth = pageWidth - margin * 2;
  const completion = Math.max(0, Math.min(100, report.collectedPercent));
  pdf.setTextColor(23, 43, 69);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text(`${completion}% wasooli mukammal`, progressX, progressY);
  pdf.setFillColor(231, 237, 243);
  pdf.roundedRect(progressX, progressY + 3, progressWidth, 4, 2, 2, "F");
  if (completion > 0) {
    pdf.setFillColor(22, 128, 71);
    pdf.roundedRect(
      progressX,
      progressY + 3,
      (progressWidth * completion) / 100,
      4,
      2,
      2,
      "F",
    );
  }

  pdf.setTextColor(23, 43, 69);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Har customer ka qiston ka hisaab", margin, 84);

  autoTable(pdf, {
    startY: 88,
    margin: { left: margin, right: margin, bottom: 17 },
    head: [[
      "#",
      "Customer aur mobile",
      "Lena tha",
      "Mila",
      "Baqi",
      "Late",
      "Ada / baqi qistein",
    ]],
    body: report.customers.length
      ? report.customers.map((customer, index) => [
          String(index + 1),
          `${customer.name}\n${customer.phone}`,
          formatAmount(customer.expected),
          formatAmount(customer.received),
          formatAmount(customer.remaining),
          formatAmount(customer.overdue),
          `${customer.paidInstallments} ada / ${customer.pendingInstallments} baqi`,
        ])
      : [["", "Is mahine koi qist schedule nahi thi.", "", "", "", "", ""]],
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [23, 43, 69],
      lineColor: [225, 231, 238],
      lineWidth: 0.15,
      valign: "middle",
    },
    headStyles: {
      fillColor: [243, 246, 249],
      textColor: [23, 43, 69],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [250, 251, 253] },
    columnStyles: {
      0: { cellWidth: 9, halign: "center" },
      1: { cellWidth: 58 },
      2: { halign: "right" },
      3: { textColor: [22, 128, 71], halign: "right" },
      4: { halign: "right" },
      5: { textColor: [180, 35, 24], halign: "right" },
      6: { cellWidth: 35, halign: "center" },
    },
    didDrawPage: ({ pageNumber }) => {
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text(
        "Samajh lein: Lena tha = is mahine ki qistain; Mila = wasool shuda; Baqi = abhi wasool karna hai; Late = guzri tareekh ki baqi qistain.",
        margin,
        pageHeight - 10,
        { maxWidth: pageWidth - margin * 2 - 25 },
      );
      pdf.text(
        `${pageNumber} / ${pdf.getNumberOfPages()}`,
        pageWidth - margin,
        pageHeight - 10,
        { align: "right" },
      );
    },
  });

  pdf.save(`mahine-ka-hisaab-${report.month}.pdf`);
}
