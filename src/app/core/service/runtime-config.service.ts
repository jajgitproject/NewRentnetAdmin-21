import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppRuntimeConfigPatch } from '../config/app-runtime-config.model';

function withTrailingSlash(url: string): string {
  const t = url.trim();
  if (!t) {
    return t;
  }
  return t.endsWith('/') ? t : `${t}/`;
}

@Injectable({ providedIn: 'root' })
export class RuntimeConfigService {
  private baseUrl = '';
  private imageUrl = '';
  private formUrl = '';
  private unlockEmployeeUrl = '';
  private clientErrorReportUrl: string | null = null;
  /**
   * Default preserves the legacy literal so existing payloads encrypted with
   * it remain decryptable. Override via `runtime-config.json#cryptoSecretKey`
   * once backend coordination is in place.
   */
  private cryptoSecretKey = 'your-secret-key';
  /**
   * Browser-exposed Google Maps JavaScript / Embed / Geocoding key.
   * TODO(security): this is a *public* key — it's always visible in the
   * bundle or in network requests. Protection is via Google Cloud Console
   * restrictions (HTTP referrers, API whitelist), NOT via secrecy. The
   * literal below is the legacy key committed to this repo; rotate it
   * (and lock it down) and override via `runtime-config.json#googleMapsApiKey`.
   */
  private googleMapsApiKey = 'AIzaSyAFoLcbOuZfbGJGCdlazGXZbOCYr8dW76c';

  constructor() {
    this.applyEnvironmentDefaults();
  }

  private applyEnvironmentDefaults(): void {
    this.baseUrl = withTrailingSlash(environment.BaseURL);
    this.imageUrl = withTrailingSlash(environment.ImageURL);
    this.formUrl = environment.FormURL;
    this.unlockEmployeeUrl = withTrailingSlash(environment.UnlockEmployeeUrl);
  }

  /** Fetch optional overrides before the app bootstraps (see `APP_INITIALIZER` in `AppModule`). */
  load(): Promise<void> {
    return (async () => {
      try {
        const res = await fetch('assets/runtime-config.json', { cache: 'no-store' });
        if (!res.ok) {
          return;
        }
        const patch = (await res.json()) as AppRuntimeConfigPatch;
        if (typeof patch.BaseURL === 'string' && patch.BaseURL.trim()) {
          this.baseUrl = withTrailingSlash(patch.BaseURL.trim());
        }
        if (typeof patch.ImageURL === 'string' && patch.ImageURL.trim()) {
          this.imageUrl = withTrailingSlash(patch.ImageURL.trim());
        }
        if (typeof patch.FormURL === 'string' && patch.FormURL.trim()) {
          this.formUrl = patch.FormURL.trim();
        }
        if (typeof patch.UnlockEmployeeUrl === 'string' && patch.UnlockEmployeeUrl.trim()) {
          this.unlockEmployeeUrl = withTrailingSlash(patch.UnlockEmployeeUrl.trim());
        }
        if (typeof patch.googleMapsApiKey === 'string' && patch.googleMapsApiKey.trim()) {
          this.googleMapsApiKey = patch.googleMapsApiKey.trim();
          this.loadGoogleMapsScript(this.googleMapsApiKey);
        }
        if (typeof patch.clientErrorReportUrl === 'string' && patch.clientErrorReportUrl.trim()) {
          this.clientErrorReportUrl = patch.clientErrorReportUrl.trim();
        }
        if (typeof patch.cryptoSecretKey === 'string' && patch.cryptoSecretKey.trim()) {
          this.cryptoSecretKey = patch.cryptoSecretKey.trim();
        }
      } catch {
        /* keep build-time defaults */
      }
    })();
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getImageUrl(): string {
    return this.imageUrl;
  }

  getFormUrl(): string {
    return this.formUrl;
  }

  getUnlockEmployeeUrl(): string {
    return this.unlockEmployeeUrl;
  }

  getClientErrorReportUrl(): string | null {
    return this.clientErrorReportUrl;
  }

  getCryptoSecretKey(): string {
    return this.cryptoSecretKey;
  }

  getGoogleMapsApiKey(): string {
    return this.googleMapsApiKey;
  }

  private loadGoogleMapsScript(apiKey: string): void {
    const marker = 'script[data-app="google-maps"]';
    document.querySelectorAll(marker).forEach((el) => el.remove());
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.dataset.app = 'google-maps';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async`;
    document.head.appendChild(script);
  }
}
