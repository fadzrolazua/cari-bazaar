import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { Bazaar, BazaarId, Coordinates } from '../../core/domain/models/bazaar.model';

const DEFAULT_MAP_CENTER: Coordinates = {
  latitude: 3.139,
  longitude: 101.6869,
};

/**
 * Leaflet adapter for the explorer.
 * It only renders the inputs it receives and emits marker selections.
 */
@Component({
  selector: 'app-bazaar-map',
  standalone: true,
  templateUrl: './map.html',
  styleUrl: './map.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BazaarMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) bazaars: readonly Bazaar[] = [];
  @Input() selectedBazaarId: BazaarId | null = null;
  @Input() userLocation: Coordinates | null = null;
  @Input() locationRadius = 1500;
  @Output() readonly bazaarSelected = new EventEmitter<BazaarId>();

  @ViewChild('mapContainer', { static: true })
  private readonly mapContainer!: ElementRef<HTMLDivElement>;

  private map?: L.Map;
  private markerLayer?: L.LayerGroup;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.createMap();
    this.renderMarkers();
    this.observeMapSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map || !this.markerLayer) {
      return;
    }

    if (
      changes['bazaars'] ||
      changes['selectedBazaarId'] ||
      changes['userLocation'] ||
      changes['locationRadius']
    ) {
      this.renderMarkers();
    }

    if (changes['selectedBazaarId'] && !changes['selectedBazaarId'].firstChange) {
      this.focusSelectedBazaar();
    }

    if (changes['userLocation'] && !changes['userLocation'].firstChange && this.userLocation) {
      this.map.flyTo(this.toLatLng(this.userLocation), 14, { duration: 0.45 });
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.map?.remove();
  }

  private observeMapSize(): void {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.map?.invalidateSize({ pan: false, debounceMoveend: true });
    });
    this.resizeObserver.observe(this.mapContainer.nativeElement);
  }

  private createMap(): void {
    const initialPosition = this.toLatLng(this.userLocation ?? DEFAULT_MAP_CENTER);

    this.map = L.map(this.mapContainer.nativeElement, {
      center: initialPosition,
      zoom: this.userLocation ? 14 : 11,
      zoomControl: false,
      doubleClickZoom: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    this.markerLayer = L.layerGroup().addTo(this.map);
  }

  private renderMarkers(): void {
    if (!this.markerLayer) {
      return;
    }

    this.markerLayer.clearLayers();

    if (this.userLocation) {
      this.renderUserLocation(this.userLocation);
    }

    for (const bazaar of this.bazaars) {
      this.renderBazaarMarker(bazaar);
    }
  }

  private renderUserLocation(location: Coordinates): void {
    if (!this.markerLayer) {
      return;
    }

    const position = this.toLatLng(location);
    const marker = L.marker(position, { icon: this.createUserIcon(), title: 'Your location' }).addTo(
      this.markerLayer,
    );

    marker.bindPopup('Your current location');
    marker.on('click', () => this.map?.setView(position, 14));

    L.circle(position, {
      color: '#3b82f6',
      fillColor: '#60a5fa',
      fillOpacity: 0.12,
      radius: this.locationRadius,
      weight: 1,
    }).addTo(this.markerLayer);
  }

  private renderBazaarMarker(bazaar: Bazaar): void {
    if (!this.markerLayer) {
      return;
    }

    const position = this.toLatLng(bazaar.location);
    const marker = L.marker(position, {
      icon: this.createBazaarIcon(bazaar.id === this.selectedBazaarId),
      title: bazaar.name,
    }).addTo(this.markerLayer);

    marker.bindPopup(this.createPopupContent(bazaar));
    marker.on('click', () => {
      this.bazaarSelected.emit(bazaar.id);
      this.focusOnBazaar(bazaar);
    });
  }

  private focusSelectedBazaar(): void {
    const selectedBazaar = this.bazaars.find((bazaar) => bazaar.id === this.selectedBazaarId);
    if (selectedBazaar) {
      this.focusOnBazaar(selectedBazaar);
    }
  }

  private focusOnBazaar(bazaar: Bazaar): void {
    this.map?.flyTo(this.toLatLng(bazaar.location), 14, { duration: 0.45 });
  }

  private createUserIcon(): L.DivIcon {
    return L.divIcon({
      className: 'user-marker-wrapper',
      html: '<span class="user-marker"><span></span></span>',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
  }

  private createBazaarIcon(selected: boolean): L.DivIcon {
    return L.divIcon({
      className: 'bazaar-marker-wrapper',
      html: `<span class="bazaar-marker${selected ? ' bazaar-marker--selected' : ''}"><span></span></span>`,
      iconSize: [34, 42],
      iconAnchor: [17, 42],
      popupAnchor: [0, -38],
    });
  }

  private createPopupContent(bazaar: Bazaar): HTMLElement {
    const content = document.createElement('div');
    content.className = 'map-popup';

    const title = document.createElement('strong');
    title.className = 'map-popup__title';
    title.textContent = bazaar.name;

    const address = document.createElement('span');
    address.className = 'map-popup__address';
    address.textContent = `${bazaar.city}, ${bazaar.state}`;

    const status = document.createElement('span');
    status.className = `map-popup__status ${bazaar.openToday ? 'map-popup__status--open' : ''}`;
    status.textContent = bazaar.openToday ? 'Open today' : 'Closed today';

    content.append(title, address, status);
    return content;
  }

  private toLatLng(coordinates: Coordinates): L.LatLngExpression {
    return [coordinates.latitude, coordinates.longitude];
  }
}
