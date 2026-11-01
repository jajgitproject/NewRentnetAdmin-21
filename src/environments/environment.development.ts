// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Must match the API you attach the debugger to (see RententAPI/Properties/launchSettings.json):
  // - IIS Express profile: https://localhost:44368/
  // - RententAPI (Kestrel) profile: http://localhost:5000/ or https://localhost:5001/
  // Override without rebuild via src/assets/runtime-config.json → BaseURL
  apiUrl: 'https://localhost:44368/',
  BaseURL: 'https://localhost:44368/',
  ImageURL: 'https://localhost:44368/',
  FormURL: 'http://localhost:4200/#',
  UnlockEmployeeUrl: 'https://uatconnect.ecoserp.in/',
  googleMapsApiKey: 'AIzaSyAFoLcbOuZfbGJGCdlazGXZbOCYr8dW76c',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
