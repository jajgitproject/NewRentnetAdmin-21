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
  /**
   * Symmetric key used by `GeneralService.encrypt()` / `decrypt()` (AES via crypto-es).
   * TODO(security): this is a client-side key and therefore *not a secret* in
   * the cryptographic sense — anyone with the bundle can read it. The
   * runtime-config override exists so ops can rotate it per environment
   * without a rebuild, but real confidentiality needs server-side encryption.
   */
  cryptoSecretKey?: string;
}
