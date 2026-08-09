import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BazaarRepository, BAZAAR_REPOSITORY } from '../ports/bazaar.repository';
import { Bazaar } from '../../domain/models/bazaar.model';

/** Returns bazaars that are currently available to users. */
@Injectable({ providedIn: 'root' })
export class GetActiveBazaarsUseCase {
  private readonly repository = inject<BazaarRepository>(BAZAAR_REPOSITORY);

  execute(): Observable<readonly Bazaar[]> {
    return this.repository.getAll().pipe(
      map((bazaars: readonly Bazaar[]) => bazaars.filter((bazaar) => bazaar.isActive)),
    );
  }
}
