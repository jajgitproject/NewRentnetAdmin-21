// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GeneralService } from './general.service';
import { resolveViewBillRoute } from './view-bill-route.util';

type BillCaptureKind = 'general' | 'jajSingleDuty' | 'jajMultiDuty';

@Injectable({ providedIn: 'root' })
export class ViewBillPdfService {
  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private generalService: GeneralService
  ) {}

  private get documentManagementApiUrl(): string {
    return `${this.generalService.BaseURL}documentManagement`;
  }

  buildViewBillUrl(
    invoiceId: number,
    templateAddress?: string | null,
    invoiceType?: string | null
  ): string {
    const route = resolveViewBillRoute(templateAddress, invoiceType);
    const serialized = this.router.serializeUrl(
      this.router.createUrlTree([`/${route}`], {
        queryParams: { invoiceID: invoiceId }
      })
    );
    return this.generalService.buildAppWindowUrl(serialized);
  }

  isGeneralBillRoute(templateAddress?: string | null, invoiceType?: string | null): boolean {
    return resolveViewBillRoute(templateAddress, invoiceType) === 'generalBillDetails';
  }

  isSupportedViewBillRoute(templateAddress?: string | null, invoiceType?: string | null): boolean {
    const route = resolveViewBillRoute(templateAddress, invoiceType);
    return route === 'generalBillDetails'
      || route === 'jajInvoiceMultiDuties'
      || route === 'jajSingleDutySingleBillForLocal';
  }

  async archiveBillFromViewBill(
    invoiceId: number,
    performedBy: number,
    templateAddress?: string | null,
    invoiceType?: string | null
  ): Promise<any> {
    const route = resolveViewBillRoute(templateAddress, invoiceType);
    const kind = this.resolveBillCaptureKind(route);
    const captured = await this.captureViewBillHtml(invoiceId, templateAddress, invoiceType);
    return firstValueFrom(
      this.httpClient.post(
        `${this.documentManagementApiUrl}/invoice/${invoiceId}/generate-pdf-from-view-bill-html/${performedBy}`,
        {
          html: captured.html,
          baseUrl: captured.baseUrl,
          landscape: kind === 'jajMultiDuty',
        }
      )
    );
  }

  async archiveGeneralBillFromViewBill(
    invoiceId: number,
    performedBy: number,
    templateAddress?: string | null,
    invoiceType?: string | null
  ): Promise<any> {
    return this.archiveBillFromViewBill(invoiceId, performedBy, templateAddress, invoiceType);
  }

  async captureViewBillHtml(
    invoiceId: number,
    templateAddress?: string | null,
    invoiceType?: string | null,
    timeoutMs = 45000
  ): Promise<{ html: string; baseUrl: string }> {
    const route = resolveViewBillRoute(templateAddress, invoiceType);
    const kind = this.resolveBillCaptureKind(route);
    const viewBillUrl = this.buildViewBillUrl(invoiceId, templateAddress, invoiceType);
    const loaded = await this.loadViewBillContainer(viewBillUrl, kind, timeoutMs);
    try {
      const baseUrl = window.location.origin;
      const html = kind === 'general'
        ? await this.buildGeneralBillPdfHtml(loaded.element, loaded.liveDocument)
        : kind === 'jajMultiDuty'
        ? await this.buildJajMultiDutyBillPdfHtml(loaded.element, loaded.liveDocument)
        : await this.buildJajBillPdfHtml(loaded.element, loaded.liveDocument);
      return { html, baseUrl };
    } finally {
      loaded.cleanup();
    }
  }

  async captureGeneralBillHtml(
    invoiceId: number,
    templateAddress?: string | null,
    invoiceType?: string | null,
    timeoutMs = 45000
  ): Promise<{ html: string; baseUrl: string }> {
    return this.captureViewBillHtml(invoiceId, templateAddress, invoiceType, timeoutMs);
  }

  private resolveBillCaptureKind(route: string): BillCaptureKind {
    if (route === 'generalBillDetails') {
      return 'general';
    }
    if (route === 'jajInvoiceMultiDuties') {
      return 'jajMultiDuty';
    }
    return 'jajSingleDuty';
  }

  private static readonly JAJ_MULTI_DUTY_PDF_CSS = `
@page { size: A4 landscape; margin: 8mm; }
html, body {
  width: 1123px;
  max-width: 1123px;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  font-size: 10px;
}
.invoice-container {
  width: 100%;
  border: 1px solid #000;
  padding: 8px;
  box-sizing: border-box;
}
.invoice-title { text-align: center; font-weight: bold; font-size: 16px; }
.invoice-subtitle { text-align: center; font-size: 12px; margin-bottom: 6px; }
.header-grid {
  display: table;
  width: 100%;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  table-layout: fixed;
}
.company-box {
  display: table-cell;
  width: 60%;
  border-right: 1px solid #000;
  padding: 6px;
  line-height: 15px;
  vertical-align: top;
}
.invoice-box {
  display: table-cell;
  width: 40%;
  padding: 6px;
  vertical-align: top;
}
.invoice-box-layout {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
.invoice-box-layout td {
  border: none;
  padding: 0;
}
.invoice-info {
  line-height: 15px;
}
.logo-qr {
  margin-top: 0;
  width: 100%;
}
.logo-qr-layout {
  width: 100%;
  border-collapse: collapse;
}
.logo-qr-layout td {
  border: none;
  padding: 0;
  vertical-align: middle;
}
.logo-qr-layout .logo-cell {
  text-align: left;
  width: 55%;
}
.logo-qr-layout .qr-cell {
  text-align: right;
  width: 45%;
}
.logo { width: 90px; height: 45px; border: 1px solid #000; }
.qr { width: 55px; height: 55px; border: 1px solid #000; }
.slip-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 6px;
  font-size: 7px;
  table-layout: fixed;
}
.slip-table thead { display: table-header-group; }
.slip-table tr { page-break-inside: avoid; }
.slip-table th,
.slip-table td {
  border: 1px solid #000;
  padding: 2px;
  text-align: center;
  vertical-align: middle;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.1;
}
.slip-table th { background: #f2f2f2; font-weight: bold; }
.text2 { font-size: 7pt; text-align: center; }
.totals-wrapper {
  display: table;
  width: 100%;
  margin-top: 6px;
  page-break-inside: avoid;
}
.amount-words {
  display: table-cell;
  width: 65%;
  border: 1px solid #000;
  padding: 6px;
  font-size: 11px;
  vertical-align: top;
}
.totals-box {
  display: table-cell;
  width: 35%;
  border: 1px solid #000;
  border-left: none;
  padding: 6px;
  vertical-align: top;
}
.totals-row {
  display: table;
  width: 100%;
  padding: 3px 0;
}
.totals-row > span {
  display: table-cell;
}
.totals-row > span:last-child { text-align: right; }
.totals-row.bold {
  font-weight: bold;
  border-top: 1px solid #000;
  margin-top: 6px;
  padding-top: 6px;
}
.terms-footer {
  display: table;
  width: 100%;
  margin-top: 6px;
  border: 1px solid #000;
  page-break-inside: avoid;
}
.terms-content {
  display: table-cell;
  width: 65%;
  padding: 6px;
  border-right: 1px solid #000;
  vertical-align: top;
}
.terms-footer .signature {
  display: table-cell;
  width: 35%;
  text-align: right;
  padding: 6px;
  font-weight: bold;
  vertical-align: top;
}
.text-heading { font-size: 15pt; font-weight: bold; }
.no-print { display: none !important; }
`;

  private static readonly GENERAL_BILL_PDF_CSS = `
#invoiceContainer table { width: 100%; border-collapse: collapse; }
#invoiceContainer th, #invoiceContainer td { padding: 6px; }
#invoiceContainer th { border: 1px solid #000; background: #f2f2f2; text-align: center; }
#invoiceContainer td { border: none; }
#invoiceContainer .no-border td { border: none !important; }
#invoiceContainer table.charge-table { table-layout: fixed; width: 100%; }
#invoiceContainer .text-right { text-align: right; }
#invoiceContainer .text-center { text-align: center; }
#invoiceContainer h3 { margin: 0; font-size: 16pt; }
#invoiceContainer small { font-size: 9pt; }
#invoiceContainer hr { border: none; border-top: 1px solid #000; margin: 10px 0; }
.no-print { display: none !important; }
html, body { width: 794px; max-width: 794px; margin: 0; padding: 0; box-sizing: border-box; }
#invoiceContainer {
  width: 794px;
  max-width: 794px;
  padding: 15mm;
  box-sizing: border-box;
  margin: 0;
}
`;

  private async buildGeneralBillPdfHtml(
    container: HTMLElement,
    liveDocument?: Document | null
  ): Promise<string> {
    const billStyles = this.extractGeneralBillStyles(container);
    const clone = container.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('style').forEach((el) => el.remove());
    clone.querySelectorAll('.no-print').forEach((el) => el.remove());
    clone.style.boxSizing = 'border-box';
    clone.style.width = '794px';
    clone.style.maxWidth = '794px';
    clone.style.padding = '15mm';
    clone.style.margin = '0';
    clone.style.minHeight = 'auto';
    await this.embedBillImages(clone, liveDocument, '#invoiceContainer img');
    this.applySelectPdfTableStyles(clone);

    const bodyHtml = clone.outerHTML;
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
${billStyles}
body {
  margin: 0;
  padding: 0;
  width: 794px;
  max-width: 794px;
  box-sizing: border-box;
  background: #fff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
</style></head><body>${bodyHtml}</body></html>`;
  }

  private async buildJajMultiDutyBillPdfHtml(
    container: HTMLElement,
    liveDocument?: Document | null
  ): Promise<string> {
    const clone = container.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.no-print').forEach((el) => el.remove());
    clone.style.boxSizing = 'border-box';
    clone.style.width = '1123px';
    clone.style.maxWidth = '1123px';
    clone.style.margin = '0';
    clone.style.padding = '0';
    clone.style.minHeight = 'auto';
    clone.style.overflow = 'hidden';
    await this.embedBillImages(clone, liveDocument, 'img');
    this.applyJajMultiDutyHeaderLayout(clone);
    this.applyJajMultiDutySlipTableStyles(clone);

    const bodyHtml = clone.outerHTML;
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
${ViewBillPdfService.JAJ_MULTI_DUTY_PDF_CSS}
body {
  margin: 0;
  padding: 0;
  width: 1123px;
  max-width: 1123px;
  box-sizing: border-box;
  background: #fff;
  overflow: hidden;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
</style></head><body>${bodyHtml}</body></html>`;
  }

  private async buildJajBillPdfHtml(
    container: HTMLElement,
    liveDocument?: Document | null
  ): Promise<string> {
    const billStyles = this.extractDocumentStyles(liveDocument);
    const clone = container.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.no-print').forEach((el) => el.remove());
    clone.style.boxSizing = 'border-box';
    clone.style.width = '794px';
    clone.style.maxWidth = '794px';
    clone.style.margin = '0';
    clone.style.minHeight = 'auto';
    await this.embedBillImages(clone, liveDocument, 'img');
    this.applyJajSlipTableStyles(clone);

    const bodyHtml = clone.outerHTML;
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
${billStyles}
body {
  margin: 0;
  padding: 0;
  width: 794px;
  max-width: 794px;
  box-sizing: border-box;
  background: #fff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
</style></head><body>${bodyHtml}</body></html>`;
  }

  private extractGeneralBillStyles(container: HTMLElement): string {
    const styleEl = container.querySelector('style');
    let css = (styleEl?.textContent ?? '').trim();
    if (!css) {
      return ViewBillPdfService.GENERAL_BILL_PDF_CSS.trim();
    }
    css = css.replace(/@media\s+print\s*\{([\s\S]*?)\}/gi, '$1');
    return this.normalizeGeneralBillPdfCss(css);
  }

  private extractDocumentStyles(liveDocument?: Document | null): string {
    if (!liveDocument) {
      return '';
    }
    const css = Array.from(liveDocument.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
      .replace(/@media\s+print\s*\{[\s\S]*?\}/gi, '');
    return css.trim();
  }

  private normalizeGeneralBillPdfCss(css: string): string {
    css = css.replace(
      /#invoiceContainer\s+th,\s*#invoiceContainer\s+td\s*\{([^}]*)\}/gi,
      (_match, body: string) => {
        const padding = body.match(/padding:\s*[^;]+/i)?.[0] ?? 'padding: 6px';
        return `#invoiceContainer th, #invoiceContainer td { ${padding}; }`;
      }
    );
    if (!/#invoiceContainer\s+th\s*\{[^}]*border/i.test(css)) {
      css += `
#invoiceContainer th { border: 1px solid #000; background: #f2f2f2; text-align: center; }`;
    }
    if (!/#invoiceContainer\s+td\s*\{[^}]*border:\s*none/i.test(css)) {
      css += `
#invoiceContainer td { border: none; }`;
    }
    if (!css.includes('table.charge-table')) {
      css += `
#invoiceContainer table.charge-table { table-layout: fixed; width: 100%; }`;
    }
    return css;
  }

  private applySelectPdfTableStyles(root: HTMLElement): void {
    const chargeColumnWidths = ['18%', '57%', '25%'];

    root.querySelectorAll('table').forEach((table) => {
      const el = table as HTMLTableElement;
      const isChargeTable = !!el.querySelector('thead th');
      el.style.borderCollapse = 'collapse';
      el.style.width = '100%';

      if (isChargeTable) {
        el.classList.add('no-border', 'charge-table');
        el.style.tableLayout = 'fixed';
        el.removeAttribute('border');
        el.removeAttribute('cellpadding');
        el.removeAttribute('cellspacing');

        if (!el.querySelector('colgroup')) {
          const colgroup = document.createElement('colgroup');
          chargeColumnWidths.forEach((width) => {
            const col = document.createElement('col');
            col.style.width = width;
            colgroup.appendChild(col);
          });
          el.insertBefore(colgroup, el.firstChild);
        }

        el.querySelectorAll('thead th').forEach((cell, index) => {
          const th = cell as HTMLElement;
          th.style.setProperty('border', '1px solid #000', 'important');
          th.style.padding = '6px';
          th.style.background = '#f2f2f2';
          th.style.textAlign = 'center';
          if (chargeColumnWidths[index]) {
            th.style.width = chargeColumnWidths[index];
          }
        });

        el.querySelectorAll('tbody td').forEach((cell) => {
          const td = cell as HTMLElement;
          td.style.setProperty('border', 'none', 'important');
          td.style.padding = '6px';
          if (td.colSpan > 1) {
            td.style.textAlign = 'right';
          } else if (td.classList.contains('text-right')) {
            td.style.textAlign = 'right';
          }
        });
        return;
      }

      el.querySelectorAll('td, th').forEach((cell) => {
        (cell as HTMLElement).style.setProperty('border', 'none', 'important');
      });
    });
  }

  private applyJajMultiDutyHeaderLayout(root: HTMLElement): void {
    root.querySelectorAll('.invoice-box').forEach((boxEl) => {
      const box = boxEl as HTMLElement;
      const info = box.querySelector('.invoice-info');
      const logoQr = box.querySelector('.logo-qr');
      if (!info || !logoQr) {
        return;
      }

      const layoutTable = document.createElement('table');
      layoutTable.className = 'invoice-box-layout';
      layoutTable.setAttribute('cellpadding', '0');
      layoutTable.setAttribute('cellspacing', '0');

      const layoutRow = document.createElement('tr');
      const infoCell = document.createElement('td');
      infoCell.style.width = '65%';
      infoCell.style.verticalAlign = 'top';
      infoCell.appendChild(info);

      const logoCell = document.createElement('td');
      logoCell.style.width = '35%';
      logoCell.style.verticalAlign = 'middle';
      this.applyJajMultiDutyLogoQrLayout(logoQr as HTMLElement);
      logoCell.appendChild(logoQr);

      layoutRow.appendChild(infoCell);
      layoutRow.appendChild(logoCell);
      layoutTable.appendChild(layoutRow);

      box.innerHTML = '';
      box.appendChild(layoutTable);
    });
  }

  private applyJajMultiDutyLogoQrLayout(logoQr: HTMLElement): void {
    const logo = logoQr.querySelector('.logo');
    const qr = logoQr.querySelector('.qr');
    if (!logo && !qr) {
      return;
    }

    const table = document.createElement('table');
    table.className = 'logo-qr-layout';
    table.setAttribute('cellpadding', '0');
    table.setAttribute('cellspacing', '0');

    const row = document.createElement('tr');
    const logoTd = document.createElement('td');
    logoTd.className = 'logo-cell';
    const qrTd = document.createElement('td');
    qrTd.className = 'qr-cell';

    if (logo) {
      logoTd.appendChild(logo);
    }
    if (qr) {
      qrTd.appendChild(qr);
    }

    row.appendChild(logoTd);
    row.appendChild(qrTd);
    table.appendChild(row);

    logoQr.innerHTML = '';
    logoQr.style.marginTop = '0';
    logoQr.appendChild(table);
  }

  private applyJajMultiDutySlipTableStyles(root: HTMLElement): void {
    root.querySelectorAll('table.slip-table').forEach((table) => {
      const el = table as HTMLTableElement;
      el.style.borderCollapse = 'collapse';
      el.style.width = '100%';
      el.style.maxWidth = '100%';
      el.style.tableLayout = 'fixed';
      el.style.fontSize = '7px';
      el.removeAttribute('cellpadding');
      el.removeAttribute('cellspacing');

      const headerCells = el.querySelectorAll('thead tr:first-child th, thead tr:first-child td');
      const colCount = headerCells.length;
      if (colCount > 0 && !el.querySelector('colgroup')) {
        const colgroup = document.createElement('colgroup');
        const colWidth = `${(100 / colCount).toFixed(4)}%`;
        for (let i = 0; i < colCount; i++) {
          const col = document.createElement('col');
          col.style.width = colWidth;
          colgroup.appendChild(col);
        }
        el.insertBefore(colgroup, el.firstChild);
      }

      el.querySelectorAll('thead th, thead td').forEach((cell) => {
        const node = cell as HTMLElement;
        node.style.setProperty('border', '1px solid #000', 'important');
        node.style.padding = '2px';
        node.style.fontSize = '7px';
        node.style.lineHeight = '1.1';
        node.style.textAlign = 'center';
        node.style.background = '#f2f2f2';
        node.style.fontWeight = 'bold';
        node.style.verticalAlign = 'middle';
      });

      el.querySelectorAll('tbody td').forEach((cell) => {
        const td = cell as HTMLElement;
        td.style.setProperty('border', '1px solid #000', 'important');
        td.style.padding = '2px';
        td.style.fontSize = '7px';
        td.style.lineHeight = '1.1';
        td.style.textAlign = 'center';
        td.style.verticalAlign = 'middle';
      });
    });
  }

  private applyJajSlipTableStyles(root: HTMLElement): void {
    root.querySelectorAll('table.slip-table, table').forEach((table) => {
      const el = table as HTMLTableElement;
      el.style.borderCollapse = 'collapse';
      el.style.width = '100%';
      el.style.tableLayout = 'fixed';
      el.style.fontSize = '6pt';

      el.querySelectorAll('thead th, thead td').forEach((cell) => {
        const node = cell as HTMLElement;
        node.style.setProperty('border', '1px solid #000', 'important');
        node.style.padding = '2px';
        node.style.textAlign = 'center';
        node.style.background = '#f2f2f2';
      });

      el.querySelectorAll('tbody td').forEach((cell) => {
        const td = cell as HTMLElement;
        td.style.setProperty('border', '1px solid #000', 'important');
        td.style.padding = '2px';
      });
    });
  }

  private async embedBillImages(
    root: HTMLElement,
    liveDocument: Document | null | undefined,
    imageSelector: string
  ): Promise<void> {
    const liveImages = liveDocument
      ? Array.from(liveDocument.querySelectorAll(imageSelector)) as HTMLImageElement[]
      : [];
    const cloneImages = Array.from(root.querySelectorAll('img')) as HTMLImageElement[];

    for (let index = 0; index < cloneImages.length; index++) {
      const img = cloneImages[index];
      const liveImg = liveImages[index];
      const dataUrl = this.readImageDataUrl(liveImg) ?? await this.fetchImageDataUrl(img.getAttribute('src') ?? img.src);
      if (dataUrl) {
        img.src = dataUrl;
      } else {
        img.src = this.absolutizeAssetUrl(img.getAttribute('src') ?? img.src);
      }
    }
  }

  private readImageDataUrl(img?: HTMLImageElement | null): string | null {
    if (!img?.complete || !img.naturalWidth) {
      return null;
    }
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return null;
      }
      ctx.drawImage(img, 0, 0);
      return canvas.toDataURL('image/png');
    } catch {
      return null;
    }
  }

  private async fetchImageDataUrl(url: string): Promise<string | null> {
    const absolute = this.absolutizeAssetUrl(url);
    if (!absolute) {
      return null;
    }
    try {
      const response = await fetch(absolute);
      if (!response.ok) {
        return null;
      }
      const blob = await response.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  }

  private absolutizeAssetUrl(url: string): string {
    const trimmed = (url ?? '').trim();
    if (!trimmed) {
      return trimmed;
    }
    if (/^(https?:|data:|blob:)/i.test(trimmed)) {
      return trimmed;
    }
    const origin = window.location.origin;
    if (trimmed.startsWith('assets/') || trimmed.includes('/assets/')) {
      const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
      return `${origin}${path}`;
    }
    if (trimmed.startsWith('/')) {
      return `${origin}${trimmed}`;
    }
    return `${origin}/${trimmed}`;
  }

  private loadViewBillContainer(
    viewBillUrl: string,
    kind: BillCaptureKind,
    timeoutMs: number
  ): Promise<{ element: HTMLElement; liveDocument: Document | null; cleanup: () => void; captureMeta: any }> {
    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('aria-hidden', 'true');
      iframe.style.position = 'fixed';
      iframe.style.left = '-10000px';
      iframe.style.top = '0';
      iframe.style.width = kind === 'jajMultiDuty' ? '297mm' : '220mm';
      iframe.style.height = '320mm';
      iframe.style.border = '0';
      iframe.src = viewBillUrl;

      let settled = false;
      const cleanup = (error?: Error) => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
        if (error) {
          reject(error);
        }
      };

      const timer = setTimeout(() => {
        cleanup(new Error('View Bill page load timed out.'));
      }, timeoutMs);

      iframe.onload = () => {
        const started = Date.now();
        const poll = () => {
          if (settled) {
            return;
          }

          try {
            const doc = iframe.contentDocument ?? iframe.contentWindow?.document ?? null;
            const container = this.findCaptureContainer(doc, kind);
            const text = container?.textContent ?? '';
            const hasRenderedBill = kind === 'general'
              ? this.isGeneralBillReady(doc, container, text)
              : this.isJajBillReady(container, text);

            if (container && hasRenderedBill) {
              const captureMeta = {
                textSample: text.slice(0, 220),
                tbodyRowCount: container.querySelectorAll('tbody tr').length,
              };
              settled = true;
              clearTimeout(timer);
              resolve({
                element: container,
                liveDocument: doc,
                captureMeta,
                cleanup: () => {
                  if (iframe.parentNode) {
                    iframe.parentNode.removeChild(iframe);
                  }
                }
              });
              return;
            }
          } catch {
            // Same-origin iframe required.
          }

          if (Date.now() - started >= timeoutMs) {
            cleanup(new Error('View Bill content did not finish loading.'));
            return;
          }

          setTimeout(poll, 300);
        };

        setTimeout(poll, 500);
      };

      iframe.onerror = () => cleanup(new Error('Failed to load View Bill page.'));
      document.body.appendChild(iframe);
    });
  }

  private findCaptureContainer(doc: Document | null, kind: BillCaptureKind): HTMLElement | null {
    if (!doc) {
      return null;
    }
    if (kind === 'general') {
      return doc.querySelector('#invoiceContainer') as HTMLElement | null;
    }
    return (doc.querySelector('#printSection .invoice-container')
      ?? doc.querySelector('#printSection')
      ?? doc.querySelector('.invoice-container')) as HTMLElement | null;
  }

  private isGeneralBillReady(doc: Document | null, container: HTMLElement | null, text: string): boolean {
    if (!container) {
      return false;
    }
    const billingCell = doc?.querySelector('#invoiceContainer td[width="70%"]');
    const invoiceCell = doc?.querySelector('#invoiceContainer td[width="30%"]');
    const billingText = (billingCell?.textContent ?? '').replace(/\s+/g, ' ').trim();
    const invoiceText = (invoiceCell?.textContent ?? '').replace(/\s+/g, ' ').trim();
    const hasInvoiceNumber = /Invoice No:\s*[A-Z0-9][A-Z0-9/_-]*/i.test(invoiceText);
    const billToMatch = billingText.match(/Bill To:\s*(.+?)(?:State of Service:|$)/i);
    const billToValue = (billToMatch?.[1] ?? '').replace(/,/g, '').trim();
    const hasBillingName = billToValue.length > 2;
    const tbodyRowCount = container.querySelectorAll('tbody tr').length;
    return text.includes('TAX INVOICE')
      && !text.includes('{{')
      && hasInvoiceNumber
      && hasBillingName
      && tbodyRowCount >= 1;
  }

  private isJajBillReady(container: HTMLElement | null, text: string): boolean {
    if (!container) {
      return false;
    }
    const hasInvoiceNumber = /Invoice No:\s*[A-Z0-9][A-Z0-9/_-]*/i.test(text);
    const tbodyRowCount = container.querySelectorAll('tbody tr').length;
    return text.includes('TAX INVOICE')
      && !text.includes('{{')
      && hasInvoiceNumber
      && tbodyRowCount >= 1;
  }
}
