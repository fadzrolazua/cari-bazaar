import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { BazaarListComponent } from '../bazaar-list/bazaar-list';
import { BazaarMapComponent } from '../map/map';
import { SettingsPanelComponent } from '../settings/settings-panel';
import { BazaarExplorerFacade } from './bazaar-explorer.facade';

/** Container component that connects the facade to reusable UI components. */
@Component({
  selector: 'app-bazaar-explorer',
  standalone: true,
  imports: [BazaarListComponent, BazaarMapComponent, SettingsPanelComponent],
  templateUrl: './bazaar-explorer.html',
  styleUrl: './bazaar-explorer.scss',
  providers: [BazaarExplorerFacade],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BazaarExplorerComponent implements OnInit {
  readonly facade = inject(BazaarExplorerFacade);
  readonly isSettingsOpen = signal(false);

  ngOnInit(): void {
    this.facade.load();
  }

  toggleSettings(): void {
    this.isSettingsOpen.update((isOpen) => !isOpen);
  }

  closeSettings(): void {
    this.isSettingsOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  closeSettingsOnEscape(): void {
    this.closeSettings();
  }

  @HostListener('document:click', ['$event'])
  closeSettingsOnOutsideClick(event: MouseEvent): void {
    if (!this.isSettingsOpen() || !(event.target instanceof Element)) {
      return;
    }

    if (!event.target.closest('.settings-button, app-settings-panel')) {
      this.closeSettings();
    }
  }
}
