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
          this.loadGoogleMapsScript(patch.googleMapsApiKey.trim());
        }
        if (typeof patch.clientErrorReportUrl === 'string' && patch.clientErrorReportUrl.trim()) {
          this.clientErrorReportUrl = patch.clientErrorReportUrl.trim();
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
