import { AfterViewInit, Component, signal } from '@angular/core';
import { MapComponent } from './features/map/map';
import { BazaarListComponent } from './features/bazaar-list/bazaar-list';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [MapComponent, BazaarListComponent]
})
export class App {
  protected readonly title = signal('cari-bazaar');
}
