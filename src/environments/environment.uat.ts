/**
 * UAT deployment: same build settings as production (output hashing, budgets),
 * with UAT API hosts. Build with:
 *   npx ng build --configuration=uat
 * Artifacts: dist/lorax/ (copy to your UAT web host).
 * Set `FormURL` to your deployed UAT admin origin (hash route), or override at
 * runtime with `assets/runtime-config.json` on the server.
 */
export const environment = {
  production: true,
  /** Legacy single URL — kept for any code still referencing `apiUrl`. */
  apiUrl: 'https://uatapi.ecoserp.in/',
  BaseURL: 'https://uatapi.ecoserp.in/',
  ImageURL: 'https://uatapi.ecoserp.in/',
  FormURL: 'http://10.0.1.9/#',
  UnlockEmployeeUrl: 'https://uatconnect.ecoserp.in/',
  googleMapsApiKey: 'AIzaSyAFoLcbOuZfbGJGCdlazGXZbOCYr8dW76c',
};
