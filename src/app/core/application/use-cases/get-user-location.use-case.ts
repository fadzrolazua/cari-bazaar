import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserLocationProvider, USER_LOCATION_PROVIDER } from '../ports/user-location.provider';
import { Coordinates } from '../../domain/models/bazaar.model';

/** Requests the user's current location from the configured platform adapter. */
@Injectable({ providedIn: 'root' })
export class GetUserLocationUseCase {
  private readonly provider = inject<UserLocationProvider>(USER_LOCATION_PROVIDER);

  execute(): Observable<Coordinates> {
    return this.provider.getCurrentLocation();
  }
}
