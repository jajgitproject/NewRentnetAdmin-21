/**
 * CSS for downloaded Booking Request HTML only.
 * Must stay unscoped (no _ngcontent) so the file looks correct when opened from disk.
 */
export const EMAIL_INFO_DOWNLOAD_STYLES = `
* { box-sizing: border-box; }
html, body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f4f6f9;
}
.email-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f6f9;
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
}
.email-body {
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}
.email-header {
  background-color: #0066b2;
  color: #ffffff;
  padding: 20px 30px;
  text-align: center;
}
.email-header h2 {
  margin: 0;
  font-size: 22px;
}
.email-section {
  padding: 15px 20px;
  width: 100%;
  max-width: 720px;
}
.email-summary-section {
  padding: 15px 20px;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.email-section h3,
.email-summary-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #0066b2;
  font-size: 18px;
  font-weight: 600;
}
.email-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  border: 1px solid #ccc;
}
.email-summary-section .email-table {
  table-layout: auto;
  min-width: 1200px;
}
.email-table th,
.email-table td {
  text-align: left;
  padding: 10px 8px;
  border: 1px solid #ccc;
  font-size: 12px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  vertical-align: top;
}
.email-table th {
  background-color: #f1f1f1;
  font-weight: 700;
  font-size: 11px;
  line-height: 1.35;
  white-space: normal;
}
.email-footer {
  background-color: #f8f8f8;
  text-align: center;
  padding: 15px;
  font-size: 13px;
  color: #555;
}
`.trim();
