import { Component, signal, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

interface AlgaeData {
  name: string;
  scientificName: string;
  type: string;
  properties: string[];
  coords: L.LatLngExpression;
}
const ALGAE_LIST: AlgaeData[] = [
  {
    name: 'Nori',
    scientificName: 'Porphyra',
    type: 'Red Algae',
    coords: [35.15, 139.85],
    properties: [
      'High protein, Vitamins A, B12, C.',
      'Thin, papery, becomes chewy when hydrated.',
      'Wrapping sushi rolls.'
    ]
  },
  {
    name: 'Kombu',
    scientificName: 'Laminaria',
    type: 'Brown Algae (Kelp family)',
    coords: [43.06, 141.35],
    properties: [
      'Extremely high in glutamic acid (strong Umami taste).',
      'Grows in large underwater "forests" in cold ocean waters.',
      'Primarily used for Dashi (soup stock).'
    ]
  }
];
@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  protected readonly title = signal('world-map');

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const worldBounds: L.LatLngBoundsExpression = [[-90, -180], [90, 180]];

    const map = L.map('map', {
      maxBounds: worldBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 2,
    }).setView([20, 0], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      bounds: worldBounds,

      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    ALGAE_LIST.forEach(algae => {
      L.marker(algae.coords)
        .addTo(map)
        .bindPopup(this.generateAlgaePopup(algae));
    });

    const clickPopup = L.popup();
    map.on('click', (e: L.LeafletMouseEvent) => {
      clickPopup
        .setLatLng(e.latlng)
        .setContent(`Coords: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`)
        .openOn(map);
    });

    window.addEventListener('resize', () => map.invalidateSize());
    setTimeout(() => map.invalidateSize(), 100);
  }

  private generateAlgaePopup(algae: AlgaeData): string {
    const listItems = algae.properties.map(p => `<li>${p}</li>`).join('');
    return `
      <div style="font-family: sans-serif; min-width: 200px;">
        <b style="color: #2c3e50; font-size: 1.1em;">${algae.name}</b><br>
        <i style="color: #7f8c8d;">${algae.scientificName}</i><br>
        <small>Type: ${algae.type}</small>
        <hr style="margin: 8px 0; border: 0; border-top: 1px solid #201e1eff;">
        <ul style="margin: 0; padding-left: 18px; font-size: 0.9em;">
          ${listItems}
        </ul>
      </div>
    `;
  }
}
