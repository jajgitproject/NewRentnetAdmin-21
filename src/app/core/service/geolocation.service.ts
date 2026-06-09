import { Injectable } from '@angular/core';

export interface LoginLocationPayload {
  loginLatitude: number;
  loginLongitude: number;
  locationAccuracyMeters?: number;
  locationCapturedAt: string;
}

export type GeolocationPermissionStatus = 'granted' | 'prompt' | 'denied' | 'unsupported';

export const DEFAULT_LOCATION_MAX_AGE_MS = 5 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  requestLoginLocation(timeoutMs = 10000): Promise<LoginLocationPayload> {
    return new Promise((resolve, reject) => {
      if (!navigator?.geolocation) {
        reject(new Error(
          'Location permission is required to login. Please allow location access and try again.'
        ));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            loginLatitude: position.coords.latitude,
            loginLongitude: position.coords.longitude,
            locationAccuracyMeters: position.coords.accuracy,
            locationCapturedAt: new Date(position.timestamp || Date.now()).toISOString(),
          });
        },
        (error) => {
          reject(new Error(this.mapGeolocationError(error)));
        },
        { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 0 }
      );
    });
  }

  async queryPermissionStatus(): Promise<GeolocationPermissionStatus> {
    if (!navigator?.geolocation) {
      return 'unsupported';
    }

    const permissions = navigator.permissions;
    if (!permissions?.query) {
      return 'prompt';
    }

    try {
      const result = await permissions.query({ name: 'geolocation' as PermissionName });
      return this.mapPermissionState(result.state);
    } catch {
      return 'prompt';
    }
  }

  watchPermissionStatus(onChange: (status: GeolocationPermissionStatus) => void): () => void {
    if (!navigator?.permissions?.query) {
      return () => undefined;
    }

    let disposed = false;
    let permissionStatus: PermissionStatus | null = null;

    const handler = () => {
      if (!disposed && permissionStatus) {
        onChange(this.mapPermissionState(permissionStatus.state));
      }
    };

    navigator.permissions
      .query({ name: 'geolocation' as PermissionName })
      .then((status) => {
        if (disposed) {
          return;
        }
        permissionStatus = status;
        onChange(this.mapPermissionState(status.state));
        status.addEventListener('change', handler);
      })
      .catch(() => undefined);

    return () => {
      disposed = true;
      permissionStatus?.removeEventListener('change', handler);
    };
  }

  isLocationFresh(
    payload: LoginLocationPayload | null | undefined,
    maxAgeMs = DEFAULT_LOCATION_MAX_AGE_MS
  ): boolean {
    if (!payload?.locationCapturedAt) {
      return false;
    }

    const capturedAt = Date.parse(payload.locationCapturedAt);
    if (Number.isNaN(capturedAt)) {
      return false;
    }

    return Date.now() - capturedAt <= maxAgeMs;
  }

  private mapPermissionState(state: PermissionState): GeolocationPermissionStatus {
    switch (state) {
      case 'granted':
        return 'granted';
      case 'denied':
        return 'denied';
      default:
        return 'prompt';
    }
  }

  private mapGeolocationError(error: GeolocationPositionError): string {
    switch (error?.code) {
      case error.PERMISSION_DENIED:
        return 'Location permission is required to login. Please allow location access for this site and try again.';
      case error.POSITION_UNAVAILABLE:
        return 'Unable to determine your location. Please enable location services and try again.';
      case error.TIMEOUT:
        return 'Location request timed out. Please allow location access and try again.';
      default:
        return 'Location permission is required to login. Please allow location access and try again.';
    }
  }
}
