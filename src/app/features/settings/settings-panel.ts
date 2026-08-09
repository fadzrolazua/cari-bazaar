import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  input,
  output,
} from '@angular/core';

/** Presentational settings panel for location and demo data preferences. */
@Component({
  selector: 'app-settings-panel',
  standalone: true,
  templateUrl: './settings-panel.html',
  styleUrl: './settings-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPanelComponent implements AfterViewInit {
  @ViewChild('closeButton') private readonly closeButton?: ElementRef<HTMLButtonElement>;

  readonly locationEnabled = input(false);
  readonly locationLoading = input(false);
  readonly locationErrorMessage = input<string | null>(null);
  readonly locationRadius = input(1500);
  readonly dataCount = input(0);
  readonly dataLoading = input(false);

  readonly closed = output<void>();
  readonly locationRequested = output<void>();
  readonly locationCleared = output<void>();
  readonly radiusChanged = output<number>();
  readonly dataRefreshRequested = output<void>();

  ngAfterViewInit(): void {
    queueMicrotask(() => this.closeButton?.nativeElement.focus());
  }

  onRadiusInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.radiusChanged.emit(Number(input.value));
  }

  formatRadius(meters: number): string {
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
  }
}
