import type { Invoice } from "../types/invoice.types";
import { formatDate, formatMoney } from "@/src/utils/format";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export function printInvoice(invoice: Invoice) {
  const printWindow = window.open("about:blank", "_blank");
  if (!printWindow) {
    throw new Error("پنجره‌ی چاپ باز نشد. اجازه‌ی بازشدن پنجره را فعال کنید.");
  }
  printWindow.opener = null;
  const rows = invoice.items
    .map(
      (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(item.description)}</td>
          <td>${item.quantity}</td>
          <td>${formatMoney(item.unitPriceToman)}</td>
          <td>${formatMoney(item.amountToman)}</td>
        </tr>`,
    )
    .join("");
  printWindow.document.write(`<!doctype html>
    <html lang="fa" dir="rtl">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>فاکتور ${escapeHtml(invoice.serviceRequest.title)}</title>
        <style>
          *{box-sizing:border-box}body{font-family:Tahoma,Arial,sans-serif;color:#17231e;margin:0;padding:32px}
          main{max-width:780px;margin:auto;border:1px solid #dce5df;border-radius:16px;padding:28px}
          header{display:flex;justify-content:space-between;gap:16px;border-bottom:1px solid #e5ebe7;padding-bottom:20px}
          h1{font-size:22px;margin:0 0 10px}p{margin:5px 0;color:#53625b;font-size:13px}
          table{width:100%;border-collapse:collapse;margin-top:24px;font-size:13px}
          th,td{text-align:right;padding:12px 8px;border-bottom:1px solid #e8eeea}
          th{background:#f3f7f4;font-weight:700}.total{margin-top:20px;text-align:left;font-size:18px;font-weight:700;color:#1f7a5c}
          footer{margin-top:28px;border-top:1px solid #e5ebe7;padding-top:14px;color:#69766f;font-size:11px}
          @media print{body{padding:0}main{border:0;border-radius:0;padding:12mm}}
        </style>
      </head>
      <body>
        <main>
          <header>
            <div><h1>فاکتور خدمات</h1><p>درخواست: ${escapeHtml(invoice.serviceRequest.title)}</p><p>شماره فاکتور: ${escapeHtml(invoice.id.slice(0, 8))}</p></div>
            <div><p>متخصص: ${escapeHtml(invoice.providerProfile.user.name)}</p><p>مشتری: ${escapeHtml(invoice.customer.name)}</p><p>تاریخ: ${formatDate(invoice.sentAt ?? invoice.createdAt)}</p></div>
          </header>
          <table><thead><tr><th>ردیف</th><th>شرح</th><th>تعداد</th><th>قیمت واحد</th><th>جمع</th></tr></thead><tbody>${rows}</tbody></table>
          <p class="total">مبلغ نهایی: ${formatMoney(invoice.totalToman)}</p>
          <footer>این فاکتور از طریق هلپا۲۴ صادر شده است.</footer>
        </main>
        <script>window.addEventListener("load",()=>window.print())</script>
      </body>
    </html>`);
  printWindow.document.close();
}
