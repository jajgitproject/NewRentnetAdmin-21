/** CSS bundled into SelectPdf HTML so JAJ invoice PDF matches on-screen layout. */
export const INVOICE_PRINT_CSS = `
body {
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
  color: #000;
  background: #fff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.addContainer,
.printable-area {
  margin: 0;
  padding: 0;
  background: #fff;
}
.invoice-container {
  width: 100%;
  max-width: 200mm;
  margin: 0 auto;
  border: 1px solid #000;
  padding: 5mm;
  box-sizing: border-box;
  page-break-inside: avoid;
  break-inside: avoid;
  page-break-after: always;
  break-after: page;
}
.pdf-page-break {
  page-break-before: always !important;
  break-before: page !important;
  height: 0;
  margin: 0;
  padding: 0;
  border: none;
  display: block;
  clear: both;
}
.header {
  border-bottom: 1px solid #000;
  padding-bottom: 8px;
  width: 100%;
}
.header-title {
  text-align: center;
  margin-bottom: 6px;
  font-weight: bold;
}
.header-body {
  width: 100%;
  border-collapse: collapse;
  border: none;
}
.header-body td {
  border: none;
  vertical-align: top;
  padding: 0;
}
.header-left {
  width: 72%;
  padding-right: 3mm;
}
.company-address {
  margin-top: 0;
  font-size: 11px;
  line-height: 15px;
}
.text-heading {
  font-family: arial, verdana, sans-serif;
  font-size: 15pt;
  font-weight: bold;
  text-align: center;
  line-height: 16px;
  display: block;
}
.qr-logo-area {
  width: 28%;
  text-align: right;
}
.invoice-logo {
  width: 32mm;
  height: auto;
  max-width: 32mm;
  max-height: 36mm;
  object-fit: contain;
  display: block;
  margin-left: auto;
  margin-right: 0;
  margin-bottom: 6px;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}
.qr-logo-area .qr-code-image,
.qr-logo-area img[src^="data:image"] {
  width: 30mm;
  height: 30mm;
  max-width: 30mm;
  max-height: 30mm;
  object-fit: contain;
  display: block;
  margin-left: auto;
  margin-right: 0;
}
.no-image-box {
  width: 28mm;
  height: 28mm;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #777;
}
.info-section {
  width: 100%;
  border-collapse: collapse;
  border: none;
  margin-top: 6px;
  border-bottom: 1px solid #000;
}
.info-section td {
  border: none;
  vertical-align: top;
  padding: 0 0 6px 0;
  font-size: 12px;
  line-height: 16px;
}
.customer-box,
.bill-box {
  font-size: 12px;
  line-height: 16px;
}
.customer-box {
  width: 68%;
  padding-right: 3mm;
}
.bill-box {
  width: 32%;
  text-align: right;
}
.extra-info {
  margin-top: 4px;
  font-size: 12px;
  border-bottom: 1px solid #000;
  padding-bottom: 4px;
}
.table-div {
  width: 100%;
  overflow: visible;
  border-left: 1px solid #000;
  border-right: 1px solid #000;
  box-sizing: border-box;
}
.table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
.invoice-container .table thead th {
  background-color: #f0f0f0 !important;
  font-weight: bold !important;
  text-align: center !important;
  color: #000 !important;
  border-bottom: 1px solid #000 !important;
  padding: 4px 6px;
  vertical-align: middle;
}
.table-firstrow-firstcolumn,
.table-midrow-firstcolumn {
  width: 58%;
  padding-left: 8px;
  border-top: none !important;
  border-bottom: none !important;
  border-left: 1px solid #000 !important;
  border-right: 2px solid #000 !important;
  font-size: 10pt;
  line-height: 15px;
  text-align: left;
  vertical-align: top;
}
.table-firstrow-secondcolumn,
.table-midrow-secondcolumn {
  width: 18%;
  min-width: 22mm;
  text-align: center !important;
  padding-right: 6px;
  padding-left: 4px;
  border-top: none !important;
  border-bottom: none !important;
  border-left: none !important;
  border-right: 2px solid #000 !important;
  font-size: 10pt;
  vertical-align: top;
}
.invoice-container .table thead th.table-firstrow-secondcolumn {
  text-align: center !important;
  color: #000 !important;
}
.table-firstrow-thirdcolumn,
.table-midrow-thirdcolumn {
  width: 24%;
  text-align: center;
  padding-right: 6px;
  border-top: none !important;
  border-bottom: none !important;
  border-left: none !important;
  border-right: 1px solid #000 !important;
  font-size: 10pt;
  vertical-align: top;
}
.gst-section {
  margin-top: 6px;
  border: 1px solid #000;
  padding: 6px;
  font-size: 12px;
  width: 100%;
  box-sizing: border-box;
  page-break-inside: avoid;
}
.gst-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 4px 8px;
  padding: 2px 0;
  width: 100%;
  line-height: 1.35;
}
.gst-row-label,
.gst-row strong {
  flex: 1 1 55%;
  min-width: 0;
  font-weight: bold;
}
.gst-row span {
  flex: 0 0 auto;
  margin-left: auto;
  text-align: right;
  white-space: nowrap;
}
.gst-row-grand-total {
  font-size: 14px;
  font-weight: bold;
  border-top: 1px solid #000;
  margin-top: 4px;
  padding-top: 4px;
}
.amount-words {
  margin-top: 4px;
  padding: 4px 6px;
  border: 1px solid #000;
  font-size: 12px;
  page-break-inside: avoid;
}
.footer {
  margin-top: 4px;
  border-top: 1px solid #000;
  width: 100%;
  border-collapse: collapse;
  border-left: none;
  border-right: none;
  page-break-inside: avoid;
}
.footer td {
  border: none;
  vertical-align: top;
  padding-top: 6px;
}
.terms {
  width: 66%;
  font-size: 10px;
  line-height: 14px;
  padding-right: 4mm;
}
.signature {
  width: 34%;
  text-align: right;
  font-size: 12px;
  padding-right: 8px;
  font-weight: bold;
}
.signature img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.text6, .text7 {
  font-family: arial, sans-serif;
  font-size: 10pt;
  line-height: 15px;
  border: none !important;
}
.text6 { text-align: left; }
.text7 { text-align: right; }
.invoice-attachments {
  margin-top: 0;
  width: 100%;
  page-break-before: always;
  break-before: page;
}
.invoice-attachment {
  page-break-inside: avoid;
  break-inside: avoid;
}
.invoice-attachment + .invoice-attachment,
.pdf-image-page {
  page-break-before: always;
  break-before: page;
}
.invoice-attachment__label {
  font-weight: bold;
  margin: 0 0 6px 0;
  text-align: left;
}
.invoice-attachment--duty-slip .invoice-attachment__label,
.invoice-attachment__label--hidden {
  display: none !important;
}
.iframe-print-inlined,
.iframe-print-fallback {
  page-break-inside: avoid;
  break-inside: avoid;
  width: 100%;
  max-width: 210mm;
  margin: 0 auto;
}
`;

export const DUTY_SLIP_PRINT_CSS = `
.duty-slip-sheet { width: 100%; max-width: 210mm; margin: 0 auto; }
.duty-slip-sheet table { width: 100%; border-collapse: collapse; }
.duty-slip-sheet td, .duty-slip-sheet th { border: solid 1px #999; }
.text1 { font-family: arial; font-size: 7pt; text-align: left; padding-left: 2px; }
.text2 { font-family: arial; font-size: 7pt; text-align: center; padding-left: 2px; }
.attachment-image {
  width: 100%;
  height: auto;
  max-width: 186mm;
  display: block;
  margin: 0 auto;
  object-fit: contain;
}
.signature-cell {
  text-align: center;
  vertical-align: top;
  padding: 1px 2px;
  max-width: 110px;
  line-height: 1.1;
}
.signature-box {
  width: 100px;
  height: 40px;
  margin: 0 auto;
  overflow: hidden;
  display: block;
  line-height: 0;
  border: 1px solid #999;
  box-sizing: border-box;
}
.signature-image {
  width: 100px;
  height: 40px;
  max-width: 100px;
  max-height: 40px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}
.map-image {
  width: auto; height: auto; max-width: 100%; display: block; margin: 0 auto; border: 1px solid #ccc;
}
`;

export const PDF_IMAGE_PAGE_CSS = `
.pdf-image-page {
  page-break-inside: avoid;
  break-inside: avoid;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 50%);
  gap: 8mm;
  align-items: start;
  width: 100%;
  max-width: 186mm;
  margin: 0 auto;
  padding: 8mm 0;
  box-sizing: border-box;
}
.pdf-image-page__text { text-align: left; }
.pdf-image-page__text .auto-style3,
.pdf-image-page__text .invoice-attachment__label {
  font-weight: bold;
  margin: 0 0 8px 0;
}
.pdf-image-page__image { text-align: right; }
.pdf-image-page__image img {
  max-width: 100%;
  max-height: 260mm;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  margin-left: auto;
}
`;
