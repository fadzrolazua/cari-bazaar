import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import {
  calculateDistanceInMeters,
  formatDistance,
} from '../../../../core/domain/services/distance';
import { Bazaar, Coordinates } from '../../../../core/domain/models/bazaar.model';
import { BazaarStatusBadgeComponent } from '../../../../shared/ui/bazaar-status-badge';

@Component({
  selector: 'app-bazaar-card',
  standalone: true,
  imports: [BazaarStatusBadgeComponent],
  templateUrl: './bazaar-card.html',
  styleUrl: './bazaar-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BazaarCardComponent {
  readonly bazaar = input.required<Bazaar>();
  readonly userLocation = input<Coordinates | null>(null);
  readonly selected = input(false);
  readonly selectedChange = output<number>();
  readonly distanceLabel = computed(() => {
    const location = this.userLocation();
    return location
      ? formatDistance(calculateDistanceInMeters(location, this.bazaar().location))
      : null;
  });

  select(): void {
    this.selectedChange.emit(this.bazaar().id);
  }
}
