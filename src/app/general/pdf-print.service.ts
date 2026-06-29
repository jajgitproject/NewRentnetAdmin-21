// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom, Observable } from 'rxjs';
import { GeneralService } from './general.service';
import {
  DUTY_SLIP_PRINT_CSS,
  INVOICE_PRINT_CSS,
  PDF_IMAGE_PAGE_CSS
} from './invoice-print.styles';

const PRINT_DOCUMENT_CSS = `
${INVOICE_PRINT_CSS}
${DUTY_SLIP_PRINT_CSS}
${PDF_IMAGE_PAGE_CSS}
.print-actions-fixed, .no-print { display: none !important; }
`;

@Injectable({ providedIn: 'root' })
export class PdfPrintService {
  private static readonly SIGNATURE_WIDTH_PX = '100px';
  private static readonly SIGNATURE_HEIGHT_PX = '40px';
  private apiUrl: string;

  constructor(
    private httpClient: HttpClient,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {
    this.apiUrl = this.generalService.BaseURL + 'DutySlipPrinting';
  }

  printElementAsPdf(
    element: HTMLElement,
    fileName: string,
    options?: { baseUrl?: string; iframeImageFallback?: string; liveElement?: HTMLElement }
  ): void {
    if (!element) {
      this.snackBar.open('Nothing to print.', 'Close', { duration: 3000 });
      return;
    }

    void this.buildPdfHtml(element, options).then((html) => {
      const baseUrl = options?.baseUrl ?? this.generalService.BaseURL?.replace(/\/$/, '');
      const safeFileName = this.sanitizePdfFileName(fileName);
      this.generatePdf(html, safeFileName, baseUrl).subscribe({
        next: (blob) => this.openPdfBlob(blob, safeFileName),
        error: () => this.snackBar.open('Failed to generate PDF.', 'Close', { duration: 4000 })
      });
    }).catch(() => {
      this.snackBar.open('Failed to prepare PDF.', 'Close', { duration: 4000 });
    });
  }

  async buildPdfHtmlFromElement(
    element: HTMLElement,
    options?: { baseUrl?: string; iframeImageFallback?: string; liveElement?: HTMLElement }
  ): Promise<string> {
    return this.buildPdfHtml(element, options);
  }

  async generatePdfBlob(html: string, baseUrl?: string): Promise<Blob> {
    const resolvedBaseUrl = baseUrl ?? this.generalService.BaseURL?.replace(/\/$/, '');
    return firstValueFrom(this.generatePdf(html, 'invoice.pdf', resolvedBaseUrl));
  }

  private async buildPdfHtml(
    element: HTMLElement,
    options?: { baseUrl?: string; iframeImageFallback?: string; liveElement?: HTMLElement }
  ): Promise<string> {
    const clone = element.cloneNode(true) as HTMLElement;
    this.replaceIframesForPrint(clone, options?.iframeImageFallback, options?.liveElement ?? element);
    clone.querySelectorAll('.print-actions-fixed, .no-print, #print').forEach(el => el.remove());
    this.removeDutySlipLabels(clone);
    this.normalizeLogoForPdf(clone);
    await this.embedInvoiceLogoAsDataUrl(clone, options?.liveElement ?? element);
    this.normalizeAssetImages(clone);
    this.normalizeSignatureImagesForPdf(clone);
    this.applyDocumentPageBreaks(clone);
    this.prepareImagePages(clone);
    this.removeDutySlipLabels(clone);

    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${PRINT_DOCUMENT_CSS}</style></head><body>${clone.innerHTML}</body></html>`;
  }

  private generatePdf(html: string, fileName: string, baseUrl: string): Observable<Blob> {
    return this.httpClient.post(
      `${this.apiUrl}/GeneratePdfFromHtml`,
      { html, baseUrl, fileName },
      { responseType: 'blob' }
    );
  }

  private applyDocumentPageBreaks(root: HTMLElement): void {
    const invoiceContainer = root.querySelector('.invoice-container');
    if (invoiceContainer) {
      invoiceContainer.classList.add('document-page');
    }

    const attachments = root.querySelector('.invoice-attachments');
    if (attachments) {
      this.insertPageBreakBefore(attachments as HTMLElement);
      attachments.querySelectorAll('.invoice-attachment').forEach((block, index) => {
        if (index > 0) {
          this.insertPageBreakBefore(block as HTMLElement);
        }
        block.classList.add('document-page');
      });
    }
  }

  private insertPageBreakBefore(element: HTMLElement): void {
    const breaker = document.createElement('div');
    breaker.className = 'pdf-page-break';
    breaker.setAttribute('aria-hidden', 'true');
    breaker.style.pageBreakBefore = 'always';
    breaker.style.breakBefore = 'page';
    element.parentNode?.insertBefore(breaker, element);
  }

  private prepareImagePages(root: HTMLElement): void {
    const images = Array.from(
      root.querySelectorAll('img.attachment-image, img.invoice-attachment__image')
    ) as HTMLImageElement[];

    const targetImages = images.filter(img => !this.isExcludedPdfImage(img));
    const pageContainer =
      (root.querySelector('.invoice-attachments') as HTMLElement | null) ?? root;

    targetImages.forEach(img => {
      const page = this.buildPdfImagePage(img);
      this.insertPageBreakBefore(page);
      pageContainer.appendChild(page);
      this.removeOriginalImageContext(img);
    });

    this.cleanupEmptyElements(root);
  }

  private isExcludedPdfImage(img: HTMLImageElement): boolean {
    return !!(
      img.closest('.qr-logo-area') ||
      img.closest('.signature') ||
      img.classList.contains('signature-image') ||
      img.classList.contains('invoice-logo')
    );
  }

  private buildPdfImagePage(img: HTMLImageElement): HTMLElement {
    const page = document.createElement('div');
    page.className = 'pdf-image-page';

    const textCol = document.createElement('div');
    textCol.className = 'pdf-image-page__text';

    const labelEl = this.findImageLabel(img);
    const labelText = (labelEl?.textContent ?? img.alt ?? '').trim();
    if (labelEl && !this.isDutySlipLabel(labelText)) {
      textCol.appendChild(labelEl.cloneNode(true));
    } else if (labelText && !this.isDutySlipLabel(labelText)) {
      const label = document.createElement('p');
      label.className = 'invoice-attachment__label';
      label.textContent = labelText;
      textCol.appendChild(label);
    }

    const imgCol = document.createElement('div');
    imgCol.className = 'pdf-image-page__image';
    const clonedImg = img.cloneNode(true) as HTMLImageElement;
    clonedImg.src = this.absolutizeUrl(clonedImg.getAttribute('src') ?? clonedImg.src);
    imgCol.appendChild(clonedImg);

    page.appendChild(textCol);
    page.appendChild(imgCol);
    return page;
  }

  private findImageLabel(img: HTMLImageElement): Element | null {
    const attachment = img.closest('.invoice-attachment');
    const attachmentLabel = attachment?.querySelector('.invoice-attachment__label');
    if (attachmentLabel) {
      return attachmentLabel;
    }

    const tr = img.closest('tr');
    const rowLabel = tr?.querySelector('p.auto-style3');
    if (rowLabel) {
      return rowLabel;
    }

    const prev = img.previousElementSibling;
    if (prev && (prev.classList.contains('invoice-attachment__label') || prev.tagName === 'P')) {
      return prev;
    }

    return null;
  }

  private removeOriginalImageContext(img: HTMLImageElement): void {
    const tr = img.closest('tr');
    if (tr) {
      tr.remove();
      return;
    }

    const attachment = img.closest('.invoice-attachment');
    if (attachment) {
      attachment.remove();
      return;
    }

    const fallback = img.closest('.iframe-print-fallback');
    if (fallback) {
      fallback.remove();
      return;
    }

    img.remove();
  }

  private cleanupEmptyElements(root: HTMLElement): void {
    root.querySelectorAll('table').forEach(table => {
      const rows = table.querySelectorAll('tr');
      if (rows.length === 0 || !table.textContent?.trim()) {
        table.remove();
      }
    });

    root.querySelectorAll('.invoice-attachment').forEach(block => {
      const el = block as HTMLElement;
      if (!el.textContent?.trim() && el.children.length === 0) {
        el.remove();
      }
    });

    root.querySelectorAll('.iframe-print-fallback').forEach(block => {
      const el = block as HTMLElement;
      if (!el.querySelector('img') && !el.textContent?.trim()) {
        el.remove();
      }
    });

    root.querySelectorAll('div').forEach(div => {
      if (!div.classList.contains('printable-area') && !div.id && !div.className &&
          !div.textContent?.trim() && div.children.length === 0) {
        div.remove();
      }
    });
  }

  private normalizeLogoForPdf(root: HTMLElement): void {
    const coloredLogoUrl = this.resolveColoredLogoUrl();
    root.querySelectorAll('.qr-logo-area img').forEach((img: HTMLImageElement) => {
      const src = img.getAttribute('src') ?? img.src ?? '';
      if (src.startsWith('data:image') && img.classList.contains('qr-code-image')) {
        return;
      }
      if (src.startsWith('data:image') && !img.classList.contains('invoice-logo')) {
        img.classList.add('qr-code-image');
        return;
      }
      if (coloredLogoUrl) {
        img.src = coloredLogoUrl;
      } else {
        img.src = this.absolutizeUrl(src);
      }
      img.classList.add('invoice-logo');
      img.classList.remove('qr-code-image');
    });
  }

  private resolveColoredLogoUrl(): string {
    return `${window.location.origin}/assets/images/logoeco1.png`;
  }

  private getColoredLogoCandidates(): string[] {
    const origin = window.location.origin;
    return [
      `${origin}/assets/images/logoeco1.png`,
      'https://prodapi.ecoserp.in/StaticFiles/Images/logoeco1.png',
      this.generalService.resolveStaticImageUrl('logoeco1.png'),
      `${origin}/assets/images/logoeco.png`
    ].filter((url): url is string => !!url);
  }

  private async embedInvoiceLogoAsDataUrl(root: HTMLElement, liveElement?: HTMLElement): Promise<void> {
    let dataUrl = this.readLogoDataUrlFromLiveImage(liveElement);

    if (!dataUrl) {
      for (const url of this.getColoredLogoCandidates()) {
        dataUrl = await this.fetchImageAsDataUrl(url);
        if (dataUrl) {
          break;
        }
      }
    }

    if (!dataUrl) {
      return;
    }

    root.querySelectorAll('.invoice-logo').forEach((img: HTMLImageElement) => {
      img.src = dataUrl as string;
      img.classList.add('invoice-logo');
      img.classList.remove('qr-code-image');
      img.setAttribute(
        'style',
        '-webkit-print-color-adjust:exact;print-color-adjust:exact;color-adjust:exact;'
      );
    });
  }

  private readLogoDataUrlFromLiveImage(liveElement?: HTMLElement): string | null {
    const img = liveElement?.querySelector('.qr-logo-area .invoice-logo') as HTMLImageElement | null;
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

  private fetchImageAsDataUrl(url: string): Promise<string | null> {
    return firstValueFrom(this.httpClient.get(url, { responseType: 'blob' }))
      .then((blob) => this.blobToDataUrl(blob))
      .catch(() => null);
  }

  private blobToDataUrl(blob: Blob): Promise<string | null> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  }

  private removeDutySlipLabels(root: HTMLElement): void {
    root.querySelectorAll('.invoice-attachment__label').forEach((el) => {
      if (this.isDutySlipLabel(el.textContent ?? '')) {
        el.remove();
      }
    });
    root.querySelectorAll('.pdf-image-page__text .invoice-attachment__label').forEach((el) => {
      if (this.isDutySlipLabel(el.textContent ?? '')) {
        el.remove();
      }
    });
  }

  private isDutySlipLabel(text: string): boolean {
    return (text ?? '').trim().toLowerCase() === 'duty slip';
  }

  private normalizeSignatureImagesForPdf(root: HTMLElement): void {
    const { SIGNATURE_WIDTH_PX: width, SIGNATURE_HEIGHT_PX: height } = PdfPrintService;

    root.querySelectorAll('.signature-box').forEach((box: HTMLElement) => {
      box.style.width = width;
      box.style.height = height;
      box.style.maxWidth = width;
      box.style.maxHeight = height;
      box.style.margin = '0 auto';
      box.style.overflow = 'hidden';
      box.style.display = 'block';
      box.style.lineHeight = '0';
      box.style.boxSizing = 'border-box';
    });

    root.querySelectorAll('img.signature-image').forEach((img: HTMLImageElement) => {
      img.style.width = width;
      img.style.height = height;
      img.style.objectFit = 'contain';
      img.style.maxWidth = width;
      img.style.maxHeight = height;
      img.style.display = 'block';
      img.style.margin = '0 auto';
    });
  }

  private normalizeAssetImages(root: HTMLElement): void {
    root.querySelectorAll('img[src]').forEach((img: HTMLImageElement) => {
      if (img.classList.contains('invoice-logo')) {
        return;
      }
      const src = img.getAttribute('src') ?? img.src ?? '';
      img.src = this.absolutizeUrl(src);
    });
  }

  private replaceIframesForPrint(
    root: HTMLElement,
    imageFallback?: string,
    liveElement?: HTMLElement
  ): void {
    const cloneIframes = Array.from(root.querySelectorAll('iframe')) as HTMLIFrameElement[];
    const liveIframes = liveElement
      ? Array.from(liveElement.querySelectorAll('iframe')) as HTMLIFrameElement[]
      : [];

    cloneIframes.forEach((iframe, index) => {
      const replacement = this.buildIframePrintReplacement(
        liveIframes[index],
        imageFallback
      );
      iframe.parentNode?.replaceChild(replacement, iframe);
    });
  }

  private buildIframePrintReplacement(
    liveIframe: HTMLIFrameElement | undefined,
    imageFallback?: string
  ): HTMLElement {
    const inlined = this.extractInlinedIframeContent(liveIframe);
    if (inlined) {
      return inlined;
    }

    const replacement = document.createElement('div');
    replacement.className = 'iframe-print-fallback';

    if (imageFallback) {
      const img = document.createElement('img');
      img.src = this.absolutizeUrl(imageFallback);
      img.className = 'attachment-image';
      img.alt = '';
      replacement.appendChild(img);
    } else {
      replacement.textContent = 'Attachment preview unavailable for PDF export.';
    }

    return replacement;
  }

  private extractInlinedIframeContent(liveIframe?: HTMLIFrameElement): HTMLElement | null {
    if (!liveIframe) {
      return null;
    }

    try {
      const doc = liveIframe.contentDocument ?? liveIframe.contentWindow?.document;
      const printable = doc?.querySelector('.printable-area') as HTMLElement | null;
      if (!printable?.innerHTML?.trim()) {
        return null;
      }

      const replacement = document.createElement('div');
      replacement.className = 'iframe-print-inlined';
      replacement.innerHTML = printable.innerHTML;
      replacement.querySelectorAll('.print-actions-fixed, .no-print, #print').forEach(el => el.remove());
      replacement.querySelectorAll('img[src]').forEach((img: HTMLImageElement) => {
        img.src = this.absolutizeUrl(img.getAttribute('src') ?? img.src);
      });
      replacement.querySelectorAll('img.signature-image').forEach((img: HTMLImageElement) => {
        img.style.width = PdfPrintService.SIGNATURE_WIDTH_PX;
        img.style.height = PdfPrintService.SIGNATURE_HEIGHT_PX;
        img.style.objectFit = 'contain';
        img.style.maxWidth = PdfPrintService.SIGNATURE_WIDTH_PX;
        img.style.maxHeight = PdfPrintService.SIGNATURE_HEIGHT_PX;
        img.style.display = 'block';
        img.style.margin = '0 auto';
      });

      return replacement;
    } catch {
      return null;
    }
  }

  private absolutizeUrl(url: string): string {
    const trimmed = (url ?? '').trim();
    if (!trimmed) {
      return trimmed;
    }
    if (/^(https?:|data:|blob:)/i.test(trimmed)) {
      return trimmed;
    }
    if (trimmed.startsWith('//')) {
      return `${window.location.protocol}${trimmed}`;
    }
    if (trimmed.startsWith('assets/') || trimmed.includes('/assets/')) {
      const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
      return `${window.location.origin}${path}`;
    }
    const apiBase = this.generalService.BaseURL?.replace(/\/$/, '') ?? window.location.origin;
    if (trimmed.startsWith('/')) {
      return `${apiBase}${trimmed}`;
    }
    return `${apiBase}/${trimmed}`;
  }

  private sanitizePdfFileName(fileName: string): string {
    let safe = (fileName ?? '').trim().replace(/\.pdf$/i, '');
    safe = safe.replace(/[/\\:*?"<>|]/g, '-');
    safe = safe.replace(/-+/g, '-');
    safe = safe.replace(/[.\s]+$/g, '');
    return safe || 'Invoice_print';
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private openPdfBlob(blob: Blob, fileName: string): void {
    const title = this.sanitizePdfFileName(fileName);
    const url = URL.createObjectURL(blob);
    const win = window.open('', '_blank');
    if (!win) {
      URL.revokeObjectURL(url);
      this.snackBar.open('Please allow pop-ups to view the PDF.', 'Close', { duration: 4000 });
      return;
    }

    const escapedTitle = this.escapeHtml(title);
    win.document.write(
      `<!DOCTYPE html><html><head><title>${escapedTitle}</title></head>` +
      `<body style="margin:0"><embed src="${url}" type="application/pdf" width="100%" height="100%" ` +
      `style="position:absolute;top:0;left:0;bottom:0;right:0"/></body></html>`
    );
    win.document.close();

    setTimeout(() => {
      try {
        win.print();
      } catch {
        // User can print manually from the PDF tab.
      }
    }, 300);
  }
}
