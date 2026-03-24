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

  public filterOpen: boolean = false;
  public countries: string[] = [];
  public properties: string[] = [];
  public filteredResults: { country: string, type: string, name: string }[] = [];

  private markers: L.Marker[] = [];

  public selectedFilters = {
    country: '' as string,
    property: '' as string
  };

  constructor(private cdr: ChangeDetectorRef, private zone: NgZone) { }

  ngOnInit(): void {
    this.extractFilterOptions();
  }
  private extractFilterOptions(): void {
    const countrySet = new Set<string>();
    const propertySet = new Set<string>();

    PARTNER_LIST.forEach(p => {
      const allAlgae = [...(p.macroAlgae || []), ...(p.microAlgae || [])];
      allAlgae.forEach(a => {
        if (a.country) countrySet.add(a.country);
        a.properties?.forEach(prop => propertySet.add(prop));
      });
    });

    this.countries = Array.from(countrySet).sort();
    this.properties = Array.from(propertySet).sort();
  }

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
      zoomControl: true
    }).fitBounds(REGION_BOUNDS);
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      crossOrigin: true
    }).addTo(this.map);


    this.loadCountries();
    this.renderMarkers();
  }
  renderMarkers(): void {
    this.zone.runOutsideAngular(() => {
      this.markers.forEach(m => m.remove());
      this.markers = [];
      const newResults: any[] = [];

      const isAnyFilterActive = !!(this.selectedFilters.country || this.selectedFilters.property);

      PARTNER_LIST.forEach(partner => {
        const allAlgae = [...(partner.macroAlgae || []), ...(partner.microAlgae || [])];

        const matchesCountry = !this.selectedFilters.country ||
          allAlgae.some(a => a.country === this.selectedFilters.country);

        const matchesProperty = !this.selectedFilters.property ||
          allAlgae.some(a => a.properties.includes(this.selectedFilters.property));

        if (matchesCountry && matchesProperty) {
          const marker = L.marker(partner.coords as L.LatLngExpression).addTo(this.map);
          marker.on('click', () => {
            this.zone.run(() => this.onPinClick(partner));
          });
          this.markers.push(marker);

          if (isAnyFilterActive) {
            allAlgae.forEach(algae => {
              const mCountry = !this.selectedFilters.country || algae.country === this.selectedFilters.country;
              const mProp = !this.selectedFilters.property || algae.properties.includes(this.selectedFilters.property);

              if (mCountry && mProp) {
                newResults.push({
                  country: algae.country,
                  type: algae.type,
                  name: algae.name
                });
              }
            });
          }
        }
      });
      this.zone.run(() => {
        this.filteredResults = newResults;
        this.cdr.detectChanges();
      });
    });
  }

  resetZoom(): void {
    this.map.flyToBounds(REGION_BOUNDS, { duration: 0.6 });
  }

  // GeoJSON 
  private loadCountries(): void {
    if (this.cachedGeoJson) { this.renderGeoJson(this.cachedGeoJson); return; }
    fetch('assets/map.geojson')
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
        weight: 1,
        fillOpacity: 0.6
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
  applyFilter(type: 'country' | 'property', value: string): void {
    this.selectedFilters[type] = value;
    this.renderMarkers();
    this.cdr.detectChanges();
  }

  clearFilters(): void {
    this.selectedFilters = { country: '', property: '' };
    this.renderMarkers();
    this.cdr.detectChanges();
  }

  openFilter() {
    this.filterOpen = !this.filterOpen;
    this.cdr.detectChanges();
  }
}