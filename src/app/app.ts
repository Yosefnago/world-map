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
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      detectRetina: false,
      attribution: '© OpenStreetMap contributors © CARTO'
    }).addTo(this.map);


    this.loadCountries();

    PARTNER_LIST.forEach(partner => {
      const marker = L.marker(partner.coords as L.LatLngExpression).addTo(this.map);
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
      },
      pointToLayer: (_feature, latlng) => L.marker(latlng)
    }).addTo(this.map);
  }

  // Interactions 
  onPinClick(popData: PopUpData): void {
    this.map.flyTo(popData.coords as L.LatLngExpression, 12, { duration: 0.6, easeLinearity: 0.2 });
    this.popupPartner = popData as PopUpData & { macroAlgae: MacroAlgaeInfo[], microAlgae: MicroAlgaeInfo[] };
    this.selectedAlgaeType = '';
    this.selectedAlgae = null;
    this.cdr.detectChanges();
  }

  closePopup(): void {
    this.popupPartner = null;
    this.selectedAlgae = null;
    this.selectedAlgaeType = '';
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
      this.selectedAlgae = null;
    } else {
      this.closePopup();
    }
  }
}