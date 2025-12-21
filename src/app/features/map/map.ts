import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { Bazaar } from '../../core/models/bazaar.model';
import { BazaarService } from '../../core/services/bazaar';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class MapComponent implements AfterViewInit {
  // -------------------
  // Properties
  // -------------------
  private map!: L.Map;
  bazaars: Bazaar[] = [];
  currentLocation: [number, number] = [0, 0];

  // -------------------
  // Constructor
  // -------------------
  constructor(private bazaarService: BazaarService) {}

  // -------------------
  // Lifecycle Hooks
  // -------------------
  ngAfterViewInit(): void {
    this.initMap();
    this.loadBazaarData();
  }

  // -------------------
  // Methods
  // -------------------
  private initMap() {
    this.currentLocation = [2.9264, 101.6964];

    this.map = L.map('map', {
      center: [3.139, 101.6869],
      zoom: 13,
      zoomControl: false,
      doubleClickZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    this.map.setView([this.currentLocation[0], this.currentLocation[1]], 16);
  }

  private loadBazaarData() {
    this.bazaarService.getBazaars().subscribe((result: Bazaar[]) => {
      this.bazaars = result;
      this.loadMarker();
    });
  }

  private loadMarker() {
    let userLocation: any = undefined;
    let bazaarLocation: any = undefined;

    // Marker
    const userIcon = L.divIcon({
      html: '<div style="background: #4285f4; width: 20px; height: 20px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
      className: 'user-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    userLocation = L.marker([this.currentLocation[0], this.currentLocation[1]], { icon: userIcon }).addTo(this.map);
    userLocation.bindPopup('Current Location');
    userLocation.on('click', () => {
        this.map.setView([this.currentLocation[0], this.currentLocation[1]], 16);
      });

    // Circle
    L.circle([this.currentLocation[0], this.currentLocation[1]], {
        color: '#4285f4',
        fillColor: '#4285f4',
        fillOpacity: 0.1,
        radius: 1500,
    }).addTo(this.map);

    this.bazaars.forEach((bazaar) => {
      bazaarLocation = L.marker([bazaar.lat, bazaar.lng], { icon: userIcon }).addTo(this.map);
      bazaarLocation.bindPopup(`${bazaar.name}`);
      bazaarLocation.on('click', () => {
        this.map.setView([bazaar.lat, bazaar.lng], 16);
      });
    });
  }
}
