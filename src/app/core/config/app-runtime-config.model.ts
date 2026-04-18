/** Optional overrides loaded from `assets/runtime-config.json` at startup. */
export interface AppRuntimeConfigPatch {
  BaseURL?: string;
  ImageURL?: string;
  FormURL?: string;
  UnlockEmployeeUrl?: string;
  /** When set, loads the Google Maps JavaScript API (replaces static key in index). */
  googleMapsApiKey?: string;
  /**
   * Same-origin or CORS-enabled endpoint that accepts POST JSON client error payloads.
   * Leave unset to disable remote reporting (console only).
   */
  clientErrorReportUrl?: string;
}
