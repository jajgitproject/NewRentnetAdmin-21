// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GeneralService } from './general.service';
import { resolveViewBillRoute } from './view-bill-route.util';

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

  async archiveGeneralBillFromViewBill(
    invoiceId: number,
    performedBy: number,
    templateAddress?: string | null,
    invoiceType?: string | null
  ): Promise<any> {
    const captured = await this.captureGeneralBillHtml(invoiceId, templateAddress, invoiceType);
    try {
      return await firstValueFrom(
        this.httpClient.post(
          `${this.documentManagementApiUrl}/invoice/${invoiceId}/generate-pdf-from-view-bill-html/${performedBy}`,
          { html: captured.html, baseUrl: captured.baseUrl }
        )
      );
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7532/ingest/f2c32722-bd0e-4386-883a-e749a4372080',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ac95ba'},body:JSON.stringify({sessionId:'ac95ba',runId:'post-fix',hypothesisId:'H6',location:'view-bill-pdf.service.ts:archiveGeneralBillFromViewBill',message:'archive api failed',data:{invoiceId,status:err?.status,errorMessage:err?.error?.message??err?.message??String(err)},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      throw err;
    }
  }

  async captureGeneralBillHtml(
    invoiceId: number,
    templateAddress?: string | null,
    invoiceType?: string | null,
    timeoutMs = 45000
  ): Promise<{ html: string; baseUrl: string }> {
    const viewBillUrl = this.buildViewBillUrl(invoiceId, templateAddress, invoiceType);
    const loaded = await this.loadGeneralBillContainer(viewBillUrl, timeoutMs);
    try {
      const baseUrl = window.location.origin;
      const html = await this.buildGeneralBillPdfHtml(loaded.element, loaded.liveDocument);
      // #region agent log
      fetch('http://127.0.0.1:7532/ingest/f2c32722-bd0e-4386-883a-e749a4372080',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ac95ba'},body:JSON.stringify({sessionId:'ac95ba',hypothesisId:'H1,H5',location:'view-bill-pdf.service.ts:captureGeneralBillHtml',message:'captured html summary',data:{invoiceId,htmlLength:html?.length,hasTableTag:html?.includes('<table'),thCount:(html?.match(/<th/gi)||[]).length,hasInvoiceNoLabel:html?.includes('Invoice No:'),sampleText:loaded.captureMeta?.textSample,hasBillingData:loaded.captureMeta?.hasBillingData,hasInvoiceNumber:loaded.captureMeta?.hasInvoiceNumber,tbodyRowCount:loaded.captureMeta?.tbodyRowCount},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      return { html, baseUrl };
    } finally {
      loaded.cleanup();
    }
  }

  /**
   * Preserve generalBillDetails markup exactly as View Bill / browser print (Eco.pdf).
   * Do not run single-duty PdfPrintService transforms on this template.
   */
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
    await this.embedGeneralBillImages(clone, liveDocument);
    this.applySelectPdfTableStyles(clone);

    const bodyHtml = clone.outerHTML;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
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
    const tbodyTdBorderNoneCount = (bodyHtml.match(/border:\s*none\s*!important/gi) ?? []).length;
    const cssTdBorderNone = /#invoiceContainer\s+td\s*\{[^}]*border:\s*none/i.test(billStyles);
    // #region agent log
    fetch('http://127.0.0.1:7532/ingest/f2c32722-bd0e-4386-883a-e749a4372080',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ac95ba'},body:JSON.stringify({sessionId:'ac95ba',runId:'post-fix',hypothesisId:'H15,H16',location:'view-bill-pdf.service.ts:buildGeneralBillPdfHtml',message:'html packaging for selectpdf',data:{styleLength:billStyles.length,cssTdBorderNone,tbodyTdBorderNoneCount,hasCombinedTdBorderRule:/#invoiceContainer\s+th,\s*#invoiceContainer\s+td\s*\{[^}]*border:\s*1px/i.test(billStyles)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    return html;
  }

  /** Read styles from live iframe DOM (clone breaks :scope selectors). */
  private extractGeneralBillStyles(container: HTMLElement): string {
    const styleEl = container.querySelector('style');
    let css = (styleEl?.textContent ?? '').trim();
    if (!css) {
      return ViewBillPdfService.GENERAL_BILL_PDF_CSS.trim();
    }
    css = css.replace(/@media\s+print\s*\{([\s\S]*?)\}/gi, '$1');
    return this.normalizeGeneralBillPdfCss(css);
  }

  /** SelectPdf applies td borders from combined th,td rules — split to header-only borders. */
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

  /** SelectPdf needs inline table layout hints when stylesheet parsing is unreliable. */
  private applySelectPdfTableStyles(root: HTMLElement): void {
    const chargeColumnWidths = ['18%', '57%', '25%'];
    let chargeTableFixed = false;

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
        chargeTableFixed = true;

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

    // #region agent log
    fetch('http://127.0.0.1:7532/ingest/f2c32722-bd0e-4386-883a-e749a4372080',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ac95ba'},body:JSON.stringify({sessionId:'ac95ba',runId:'post-fix',hypothesisId:'H15',location:'view-bill-pdf.service.ts:applySelectPdfTableStyles',message:'charge table layout applied',data:{chargeTableFixed,headerOnlyBorders:true},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }

  private async embedGeneralBillImages(
    root: HTMLElement,
    liveDocument?: Document | null
  ): Promise<void> {
    const liveImages = liveDocument
      ? Array.from(liveDocument.querySelectorAll('#invoiceContainer img')) as HTMLImageElement[]
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

  private loadGeneralBillContainer(
    viewBillUrl: string,
    timeoutMs: number
  ): Promise<{ element: HTMLElement; liveDocument: Document | null; cleanup: () => void; captureMeta: any }> {
    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('aria-hidden', 'true');
      iframe.style.position = 'fixed';
      iframe.style.left = '-10000px';
      iframe.style.top = '0';
      iframe.style.width = '220mm';
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
            const container = doc?.querySelector('#invoiceContainer') as HTMLElement | null;
            const text = container?.textContent ?? '';
            const billingCell = doc?.querySelector('#invoiceContainer td[width="70%"]');
            const invoiceCell = doc?.querySelector('#invoiceContainer td[width="30%"]');
            const billingText = (billingCell?.textContent ?? '').replace(/\s+/g, ' ').trim();
            const invoiceText = (invoiceCell?.textContent ?? '').replace(/\s+/g, ' ').trim();
            const hasInvoiceNumber = /Invoice No:\s*[A-Z0-9][A-Z0-9/_-]*/i.test(invoiceText);
            const billToMatch = billingText.match(/Bill To:\s*(.+?)(?:State of Service:|$)/i);
            const billToValue = (billToMatch?.[1] ?? '').replace(/,/g, '').trim();
            const hasBillingName = billToValue.length > 2;
            const tbodyRowCount = container?.querySelectorAll('tbody tr').length ?? 0;
            const hasRenderedBill = !!container
              && text.includes('TAX INVOICE')
              && !text.includes('{{')
              && hasInvoiceNumber
              && hasBillingName
              && tbodyRowCount >= 1;

            if (container && hasRenderedBill) {
              const captureMeta = {
                textSample: text.slice(0, 220),
                hasBillingData: hasBillingName,
                hasInvoiceNumber,
                tbodyRowCount,
                billingTextSample: billingText.slice(0, 120),
                invoiceTextSample: invoiceText.slice(0, 80),
              };
              // #region agent log
              fetch('http://127.0.0.1:7532/ingest/f2c32722-bd0e-4386-883a-e749a4372080',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ac95ba'},body:JSON.stringify({sessionId:'ac95ba',hypothesisId:'H1,H3,H4',location:'view-bill-pdf.service.ts:loadGeneralBillContainer',message:'iframe capture ready',data:{viewBillUrl,...captureMeta,elapsedMs:Date.now()-started},timestamp:Date.now()})}).catch(()=>{});
              // #endregion
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
            // #region agent log
            fetch('http://127.0.0.1:7532/ingest/f2c32722-bd0e-4386-883a-e749a4372080',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ac95ba'},body:JSON.stringify({sessionId:'ac95ba',runId:'post-fix',hypothesisId:'H1',location:'view-bill-pdf.service.ts:loadGeneralBillContainer',message:'capture timed out waiting for bill data',data:{viewBillUrl,elapsedMs:Date.now()-started},timestamp:Date.now()})}).catch(()=>{});
            // #endregion
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
}
