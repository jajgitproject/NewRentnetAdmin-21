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
  private googleMapsApiKey = '';

  constructor() {
    this.applyEnvironmentDefaults();
  }

  private applyEnvironmentDefaults(): void {
    this.baseUrl = withTrailingSlash(environment.BaseURL);
    this.imageUrl = withTrailingSlash(environment.ImageURL);
    this.formUrl = environment.FormURL;
    this.unlockEmployeeUrl = withTrailingSlash(environment.UnlockEmployeeUrl);
    const k = (environment as { googleMapsApiKey?: string }).googleMapsApiKey;
    if (typeof k === 'string' && k.trim()) {
      this.googleMapsApiKey = k.trim();
    } else {
      this.googleMapsApiKey = 'AIzaSyAFoLcbOuZfbGJGCdlazGXZbOCYr8dW76c';
    }
  }

  /** Fetch optional overrides before the app bootstraps (see `APP_INITIALIZER` in `AppModule`). */
  load(): Promise<void> {
    return (async () => {
      try {
        const res = await fetch('assets/runtime-config.json', { cache: 'no-store' });
        if (res.ok) {
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
          }
          if (typeof patch.clientErrorReportUrl === 'string' && patch.clientErrorReportUrl.trim()) {
            this.clientErrorReportUrl = patch.clientErrorReportUrl.trim();
          }
          if (typeof patch.cryptoSecretKey === 'string' && patch.cryptoSecretKey.trim()) {
            this.cryptoSecretKey = patch.cryptoSecretKey.trim();
          }
        }
      } catch {
        /* keep build-time defaults */
      }

      // Always inject the Maps JS API (with places library) using the
      // effective key - default from source, or override from runtime-config.
      // Without this, `window.google` never exists and every
      // `ngx-google-places-autocomplete` input on the site is a dead field.
      if (this.googleMapsApiKey) {
        this.loadGoogleMapsScript(this.googleMapsApiKey);
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
    // If a maps script is already on the page (e.g. from a previous call with
    // the same key), don't re-inject - doing so would reload the library and
    // invalidate any Autocomplete instances already wired up.
    const existing = document.querySelector<HTMLScriptElement>('script[data-app="google-maps"]');
    if (existing && existing.dataset.key === apiKey) {
      return;
    }
    if (existing) {
      existing.remove();
    }
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.dataset.app = 'google-maps';
    script.dataset.key = apiKey;
    // `libraries=places` for Autocomplete. Omit `loading=async` from the URL
    // so the Places module can load predictably; importLibrary in onload
    // loads the new Places module when the loader exposes it.
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}` + `&libraries=places`;
    script.addEventListener('load', () => {
      const maps = (window as any).google?.maps;
      if (typeof maps?.importLibrary === 'function') {
        maps.importLibrary('places').catch(() => {
          /* non-fatal */
        });
      }
    });
    document.head.appendChild(script);
  }
}
