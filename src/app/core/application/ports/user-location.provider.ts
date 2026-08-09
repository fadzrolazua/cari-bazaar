import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinates } from '../../domain/models/bazaar.model';

/** Port for obtaining a user's location without coupling the app to browser APIs. */
export interface UserLocationProvider {
  getCurrentLocation(): Observable<Coordinates>;
}

export const USER_LOCATION_PROVIDER = new InjectionToken<UserLocationProvider>('UserLocationProvider');
