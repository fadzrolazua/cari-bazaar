import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Bazaar } from '../../domain/models/bazaar.model';

/**
 * Application code depends on this port instead of a concrete data source.
 * This keeps the use cases independent from HTTP, files, or a future API.
 */
export interface BazaarRepository {
  getAll(): Observable<readonly Bazaar[]>;
}

export const BAZAAR_REPOSITORY = new InjectionToken<BazaarRepository>('BazaarRepository');
