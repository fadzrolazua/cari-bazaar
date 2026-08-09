import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, take } from 'rxjs/operators';
import { GetActiveBazaarsUseCase } from '../../core/application/use-cases/get-active-bazaars.use-case';
import { GetUserLocationUseCase } from '../../core/application/use-cases/get-user-location.use-case';
import { calculateDistanceInMeters } from '../../core/domain/services/distance';
import { Bazaar, BazaarId, Coordinates } from '../../core/domain/models/bazaar.model';

/**
 * Coordinates screen state and user actions for the bazaar explorer.
 * Components stay presentational; this class owns loading, filtering, and selection.
 */
@Injectable()
export class BazaarExplorerFacade {
  private readonly getActiveBazaars = inject(GetActiveBazaarsUseCase);
  private readonly getUserLocation = inject(GetUserLocationUseCase);
  private readonly destroyRef = inject(DestroyRef);

  readonly bazaars = signal<readonly Bazaar[]>([]);
  readonly userLocation = signal<Coordinates | null>(null);
  readonly locationRadiusMeters = signal(1500);
  readonly isLocationLoading = signal(false);
  readonly locationErrorMessage = signal<string | null>(null);
  readonly searchQuery = signal('');
  readonly openOnly = signal(false);
  readonly selectedBazaarId = signal<BazaarId | null>(null);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly visibleBazaars = computed(() => {
    const query = this.searchQuery().trim().toLocaleLowerCase();
    const showOpenOnly = this.openOnly();
    const location = this.userLocation();

    const matchingBazaars = this.bazaars().filter((bazaar) => {
      const matchesQuery =
        query.length === 0 ||
        [bazaar.name, bazaar.city, bazaar.state].some((value) =>
          value.toLocaleLowerCase().includes(query),
        );

      return matchesQuery && (!showOpenOnly || bazaar.openToday);
    });

    if (!location) {
      return matchingBazaars;
    }

    return matchingBazaars.sort(
      (first, second) =>
        calculateDistanceInMeters(location, first.location) -
        calculateDistanceInMeters(location, second.location),
    );
  });

  readonly totalCount = computed(() => this.bazaars().length);
  readonly openCount = computed(() => this.bazaars().filter((bazaar) => bazaar.openToday).length);
  readonly hasUserLocation = computed(() => this.userLocation() !== null);

  load(): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.getActiveBazaars
      .execute()
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (bazaars) => {
          this.bazaars.set(bazaars);

          const selectedId = this.selectedBazaarId();
          if (selectedId !== null && !bazaars.some((bazaar) => bazaar.id === selectedId)) {
            this.selectedBazaarId.set(null);
          }
        },
        error: () => {
          this.errorMessage.set('We could not load the bazaars. Please try again.');
        },
      });
  }

  requestUserLocation(): void {
    if (this.isLocationLoading()) {
      return;
    }

    this.isLocationLoading.set(true);
    this.locationErrorMessage.set(null);

    this.getUserLocation
      .execute()
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLocationLoading.set(false)),
      )
      .subscribe({
        next: (location) => this.userLocation.set(location),
        error: (error: unknown) => {
          this.locationErrorMessage.set(
            error instanceof Error ? error.message : 'Unable to access your location.',
          );
        },
      });
  }

  clearUserLocation(): void {
    this.userLocation.set(null);
    this.locationErrorMessage.set(null);
  }

  setLocationRadius(radius: number): void {
    const safeRadius = Number.isFinite(radius) ? radius : 1500;
    this.locationRadiusMeters.set(Math.min(5000, Math.max(500, safeRadius)));
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
    this.clearHiddenSelection();
  }

  setOpenOnly(openOnly: boolean): void {
    this.openOnly.set(openOnly);
    this.clearHiddenSelection();
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.openOnly.set(false);
  }

  private clearHiddenSelection(): void {
    const selectedId = this.selectedBazaarId();
    if (selectedId !== null && !this.visibleBazaars().some((bazaar) => bazaar.id === selectedId)) {
      this.selectedBazaarId.set(null);
    }
  }

  selectBazaar(id: BazaarId | null): void {
    if (id === null || this.bazaars().some((bazaar) => bazaar.id === id)) {
      this.selectedBazaarId.set(id);
    }
  }
}
