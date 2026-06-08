import { Injectable } from '@angular/core';

export interface LoginLocationPayload {
  loginLatitude: number;
  loginLongitude: number;
  locationAccuracyMeters?: number;
  locationCapturedAt: string;
}

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  requestLoginLocation(timeoutMs = 15000): Promise<LoginLocationPayload> {
    return new Promise((resolve, reject) => {
      if (!navigator?.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            loginLatitude: position.coords.latitude,
            loginLongitude: position.coords.longitude,
            locationAccuracyMeters: position.coords.accuracy,
            locationCapturedAt: new Date().toISOString(),
          });
        },
        (error) => {
          const message =
            error?.code === error.PERMISSION_DENIED
              ? 'Location permission is required to login. Please allow location access and try again.'
              : 'Unable to obtain location. Please enable location and try again.';
          reject(new Error(message));
        },
        { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 0 }
      );
    });
  }
}
