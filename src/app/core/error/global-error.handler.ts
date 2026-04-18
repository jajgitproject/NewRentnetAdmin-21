import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { RuntimeConfigService } from '../service/runtime-config.service';

/**
 * Optional client-side error reporting when `clientErrorReportUrl` is set in `assets/runtime-config.json`.
 * Uses `fetch(..., { keepalive: true })` so the request may complete during unload.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private readonly injector: Injector) {}

  handleError(error: unknown): void {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(err);

    let reportUrl: string | null = null;
    try {
      reportUrl = this.injector.get(RuntimeConfigService).getClientErrorReportUrl();
    } catch {
      return;
    }
    if (!reportUrl) {
      return;
    }

    const payload = {
      name: err.name,
      message: err.message,
      stack: err.stack,
      time: new Date().toISOString(),
      href: typeof location !== 'undefined' ? location.href : '',
    };

    void fetch(reportUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      /* ignore transport failures */
    });
  }
}
