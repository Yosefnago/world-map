import {
  Component, OnInit, ElementRef, ViewChild, AfterViewInit,
  HostListener, ChangeDetectorRef, NgZone, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { PARTNER_LIST, PopUpData, MacroAlgaeInfo, MicroAlgaeInfo } from './app.data';


const REGION_BOUNDS: L.LatLngBoundsExpression = [[0, -20], [75, 100]];


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit, AfterViewInit {
  @ViewChild('mapWrapper', { static: true }) mapWrapper!: ElementRef;

  private map!: L.Map;
  private cachedGeoJson: any = null;

  public popupPartner: (PopUpData & { macroAlgae: MacroAlgaeInfo[], microAlgae: MicroAlgaeInfo[] }) | null = null;
  public selectedAlgae: MacroAlgaeInfo | MicroAlgaeInfo | null = null;
  public selectedAlgaeType: string = '';

  constructor(private cdr: ChangeDetectorRef, private zone: NgZone) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.initMap();
      this.map.whenReady(() => {
        this.map.invalidateSize();
      });
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.zone.runOutsideAngular(() => {
      this.map?.invalidateSize();

    });
  }
  // Map init 
  private initMap(): void {
    this.map = L.map('map', {
      renderer: L.canvas({ tolerance: 3 }),

      minZoom: 3.5, maxZoom: 15,
      zoomSnap: 0, zoomDelta: 1,
      maxBounds: REGION_BOUNDS,
      maxBoundsViscosity: 1.0,
      zoomControl: false
    }).fitBounds(REGION_BOUNDS);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      detectRetina: false,
      attribution: '© OpenStreetMap contributors © CARTO'
    }).addTo(this.map);

    this.loadCountries();

    // Define a custom map pin with the Algae4IBD logo inside
    const algaeIcon = L.divIcon({
      className: 'custom-pin-wrapper',
      html: `
        <div class="css-pin">
          <div class="css-pin-inner">
            <img src="assets/logos/algae4IBD.png" alt="Algae4IBD">
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 48],
      popupAnchor: [0, -50]
    });

    PARTNER_LIST.forEach(partner => {
      const marker = L.marker(partner.coords as L.LatLngExpression, { icon: algaeIcon }).addTo(this.map);

      marker.on('click', () => {
        this.zone.run(() => this.onPinClick(partner));
      });
    });
  }

  resetZoom(): void {
    this.map.flyToBounds(REGION_BOUNDS, { duration: 0.6 });
  }
  // GeoJSON 
  private loadCountries(): void {
    if (this.cachedGeoJson) { this.renderGeoJson(this.cachedGeoJson); return; }
    fetch('/assets/map.geojson')
      .then(r => r.json())
      .then(data => {
        this.cachedGeoJson = data;
        this.zone.runOutsideAngular(() => this.renderGeoJson(data));
      });
  }

  private renderGeoJson(data: any): void {
    L.geoJSON(data, {
      interactive: false,
      filter: (f) => f.geometry.type !== 'Point',
      style: {
        color: "#2fc989ff",
        fillColor: "#2fc989ff",
        weight: 0.5,
        fillOpacity: 0.5
      }
    }).addTo(this.map);
  }

  // Interactions 
  onPinClick(popData: PopUpData): void {
    this.popupPartner = popData as PopUpData & { macroAlgae: MacroAlgaeInfo[], microAlgae: MicroAlgaeInfo[] };

    this.selectedAlgaeType = '';

    this.selectedAlgae = this.popupPartner.macroAlgae[0];
    this.cdr.detectChanges();

    // Fly to the pin smoothly
    this.map.flyTo(popData.coords as L.LatLngExpression, 12, {
      duration: 0.6, easeLinearity: 0.2
    });

  }

  closePopup(): void {
    this.popupPartner = null;
    this.selectedAlgae = null;
  }

  selectAlgae(algae: MacroAlgaeInfo | MicroAlgaeInfo): void {
    this.selectedAlgae = algae;

  }
  chossedAlgaeType(type: string) {
    this.selectedAlgaeType = type;
  }
  goBack(): void {
    if (this.selectedAlgaeType !== '') {
      this.selectedAlgaeType = '';
    } else {
      this.closePopup();
    }
  }
}