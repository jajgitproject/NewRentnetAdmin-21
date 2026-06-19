import { Injectable } from '@angular/core';



export interface LoginLocationPayload {

  loginLatitude: number;

  loginLongitude: number;

  locationAccuracyMeters?: number;

  locationCapturedAt: string;

}



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

        (error) => reject(new Error(this.mapGeolocationError(error))),

        { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 0 }

      );

    });

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

