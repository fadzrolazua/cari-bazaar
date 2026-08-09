import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Bazaar, BazaarId, Coordinates } from '../../core/domain/models/bazaar.model';
import { EmptyStateComponent } from '../../shared/ui/empty-state';
import { LoadingStateComponent } from '../../shared/ui/loading-state';
import { BazaarCardComponent } from './components/bazaar-card/bazaar-card';

/** Presentational directory of bazaars. Data and state are supplied by the feature facade. */
@Component({
  selector: 'app-bazaar-list',
  standalone: true,
  imports: [BazaarCardComponent, EmptyStateComponent, LoadingStateComponent],
  templateUrl: './bazaar-list.html',
  styleUrl: './bazaar-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BazaarListComponent {
  readonly bazaars = input<readonly Bazaar[]>([]);
  readonly totalCount = input(0);
  readonly openCount = input(0);
  readonly selectedBazaarId = input<BazaarId | null>(null);
  readonly userLocation = input<Coordinates | null>(null);
  readonly searchQuery = input('');
  readonly showOpenOnly = input(false);
  readonly isLoading = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly searchChanged = output<string>();
  readonly openOnlyChanged = output<boolean>();
  readonly bazaarSelected = output<BazaarId>();
  readonly retryRequested = output<void>();

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchChanged.emit(input.value);
  }

  onOpenOnlyChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.openOnlyChanged.emit(input.checked);
  }

  clearSearch(): void {
    this.searchChanged.emit('');
  }

  clearFilters(): void {
    this.searchChanged.emit('');
    this.openOnlyChanged.emit(false);
  }
}
