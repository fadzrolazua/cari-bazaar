import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinates } from '../../domain/models/bazaar.model';
import { UserLocationProvider } from '../../application/ports/user-location.provider';

/** Browser adapter for the Geolocation API. */
@Injectable()
export class BrowserGeolocationProvider implements UserLocationProvider {
  getCurrentLocation(): Observable<Coordinates> {
    return new Observable<Coordinates>((subscriber) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        subscriber.error(new Error('Location is not available in this browser.'));
        return;
      }

      if (this.requiresSecureContext()) {
        subscriber.error(new Error('Location access requires HTTPS or a local development URL.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          subscriber.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          subscriber.complete();
        },
        (error) => subscriber.error(this.toError(error)),
        {
          enableHighAccuracy: true,
          maximumAge: 300_000,
          timeout: 10_000,
        },
      );
    });
  }

  private requiresSecureContext(): boolean {
    if (typeof window === 'undefined' || window.isSecureContext) {
      return false;
    }

    return !['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
  }

  private toError(error: GeolocationPositionError): Error {
    const messageByCode: Record<number, string> = {
      1: 'Location permission was denied. You can enable it in your browser settings.',
      2: 'Your location could not be determined right now.',
      3: 'The location request timed out. Please try again.',
    };

    return new Error(messageByCode[error.code] ?? 'Unable to access your location.');
  }
}
