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
  const issuedAt = formatDate(invoice.sentAt ?? invoice.createdAt);
  const fontUrl = new URL("/fonts/vazirmatn.woff2", window.location.origin)
    .href;
  printWindow.document.write(`<!doctype html>
    <html lang="fa" dir="rtl">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>فاکتور ${escapeHtml(invoice.serviceRequest.title)}</title>
          <style>
            @font-face{font-family:Vazirmatn;src:url("${fontUrl}") format("woff2");font-style:normal;font-weight:100 900;font-display:swap}
            *{box-sizing:border-box}
            body{font-family:Vazirmatn,sans-serif;color:#18332d;margin:0;padding:28px;background:#eef4f1;-webkit-print-color-adjust:exact;print-color-adjust:exact}
            main{max-width:820px;margin:auto;background:#fff;border:1px solid #dce9e3;border-radius:24px;overflow:hidden;box-shadow:0 18px 60px rgba(19,75,57,.08)}
            .topbar{height:8px;background:linear-gradient(90deg,#1f7a5c,#50a982,#a6d8bd)}
            .content{padding:30px}
            header{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;padding-bottom:24px;border-bottom:1px solid #e8efeb}
            .brand{display:flex;align-items:center;gap:12px}
            .brand-mark{width:48px;height:48px;display:grid;place-items:center;flex:none;border-radius:16px;background:#1f7a5c;color:#fff}
            .brand-mark svg{width:28px;height:28px}
            .brand-name{font-size:15px;font-weight:800;color:#1f7a5c}
            .brand-caption{margin-top:2px;color:#71847b;font-size:10px}
            .invoice-heading{text-align:left}
            h1{font-size:23px;margin:0;color:#18332d}
            .invoice-label{display:inline-flex;align-items:center;gap:6px;margin-top:8px;padding:5px 10px;border-radius:999px;background:#eaf5ef;color:#267452;font-size:10px;font-weight:700}
            .invoice-label svg{width:13px;height:13px}
            .summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:22px 0}
            .summary-card{min-width:0;padding:13px 14px;border:1px solid #e6eee9;border-radius:15px;background:#fbfdfc}
            .summary-label{display:block;color:#7a8b83;font-size:10px}
            .summary-value{display:block;margin-top:6px;color:#233d34;font-size:12px;font-weight:700;overflow-wrap:anywhere}
            .section-title{margin:24px 0 10px;font-size:12px;font-weight:800;color:#294b3c}
            table{width:100%;border-collapse:separate;border-spacing:0;overflow:hidden;border:1px solid #e5ede8;border-radius:14px;font-size:11px}
            th,td{text-align:right;padding:12px 11px;border-bottom:1px solid #eaf0ec}
            th{background:#f0f7f3;color:#476458;font-size:10px;font-weight:700}
            tbody tr:last-child td{border-bottom:0}
            tbody tr:nth-child(even){background:#fbfdfc}
            td:first-child{width:42px;color:#72847b}
            td:nth-child(3),td:nth-child(4),td:nth-child(5),th:nth-child(3),th:nth-child(4),th:nth-child(5){white-space:nowrap}
            .total-card{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-top:18px;padding:17px 18px;border:1px solid #cce6d8;border-radius:16px;background:linear-gradient(110deg,#eff8f2,#f8fcf9)}
            .total-title{font-size:12px;font-weight:700;color:#406555}
            .total-subtitle{margin-top:4px;color:#7a8b83;font-size:10px}
            .total-amount{color:#176443;font-size:18px;font-weight:900;white-space:nowrap}
            footer{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:25px;padding-top:15px;border-top:1px solid #e8efeb;color:#809087;font-size:9px}
            .footer-brand{color:#1f7a5c;font-weight:800}
            @media(max-width:560px){body{padding:10px}.content{padding:18px 14px}header{gap:10px}.brand{gap:8px}.brand-mark{width:40px;height:40px;border-radius:13px}.brand-name{font-size:13px}.brand-caption{font-size:9px}h1{font-size:18px}.summary{gap:7px;margin:16px 0}.summary-card{padding:10px 8px}.summary-label{font-size:9px}.summary-value{font-size:10px}table{font-size:9px}th,td{padding:9px 5px}th{font-size:8px}.total-card{padding:13px}.total-amount{font-size:15px}}
            @page{size:A4;margin:14mm}
            @media print{body{padding:0;background:#fff}main{max-width:none;border:0;border-radius:0;box-shadow:none}.content{padding:20px}.topbar{height:6px}.summary-card,.total-card,th{print-color-adjust:exact;-webkit-print-color-adjust:exact}tr{break-inside:avoid}}
          </style>
        </head>
        <body>
          <main>
            <div class="topbar"></div>
            <div class="content">
              <header>
                <div class="brand">
                  <span class="brand-mark" aria-hidden="true">
                    <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M132 116h58v117h132V116h58v280h-58V285H190v111h-58z" fill="currentColor"/>
                      <circle cx="362" cy="354" r="26" fill="#b8e3ce"/>
                    </svg>
                  </span>
                  <span><span class="brand-name">هلپا۲۴</span><span class="brand-caption">خدمات مطمئن، شفاف و ساده</span></span>
                </div>
                <div class="invoice-heading">
                  <h1>فاکتور خدمات</h1>
                  <span class="invoice-label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3"/><path d="M18 2h4v4"/><path d="m22 2-10 10"/><path d="M8 12h4"/><path d="M8 16h8"/></svg>
                    نسخه مشتری
                  </span>
                </div>
              </header>
              <section class="summary" aria-label="مشخصات فاکتور">
                <div class="summary-card"><span class="summary-label">شماره فاکتور</span><span class="summary-value" dir="ltr">${escapeHtml(invoice.id.slice(0, 8).toUpperCase())}</span></div>
                <div class="summary-card"><span class="summary-label">تاریخ صدور</span><span class="summary-value">${escapeHtml(issuedAt)}</span></div>
                <div class="summary-card"><span class="summary-label">عنوان درخواست</span><span class="summary-value">${escapeHtml(invoice.serviceRequest.title)}</span></div>
              </section>
              <section class="summary" aria-label="مشخصات طرفین">
                <div class="summary-card"><span class="summary-label">متخصص</span><span class="summary-value">${escapeHtml(invoice.providerProfile.user.name)}</span></div>
                <div class="summary-card"><span class="summary-label">مشتری</span><span class="summary-value">${escapeHtml(invoice.customer.name)}</span></div>
                <div class="summary-card"><span class="summary-label">تعداد ردیف‌ها</span><span class="summary-value">${new Intl.NumberFormat("fa-IR").format(invoice.items.length)} مورد</span></div>
              </section>
              <h2 class="section-title">شرح خدمات و هزینه‌ها</h2>
              <table>
                <thead><tr><th>ردیف</th><th>شرح</th><th>تعداد</th><th>قیمت واحد</th><th>جمع</th></tr></thead>
                <tbody>${rows}</tbody>
              </table>
              <section class="total-card" aria-label="مبلغ نهایی فاکتور">
                <div><div class="total-title">مبلغ قابل پرداخت</div><div class="total-subtitle">مبالغ به تومان محاسبه شده‌اند.</div></div>
                <div class="total-amount">${formatMoney(invoice.totalToman)}</div>
              </section>
              <footer><span>این فاکتور از طریق <span class="footer-brand">هلپا۲۴</span> صادر شده است.</span><span>از اعتماد شما سپاسگزاریم.</span></footer>
            </div>
          </main>
          <script>window.addEventListener("load",()=>document.fonts.ready.then(()=>window.print()))</script>
        </body>
    </html>`);
  printWindow.document.close();
}
