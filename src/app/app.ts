import {
  Component, OnInit, AfterViewInit, OnDestroy,
  HostListener, ChangeDetectorRef, NgZone, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { DATA_LIST, PopUpData, MacroAlgaeInfo, MicroAlgaeInfo } from './app.data';

const REGION_BOUNDS: L.LatLngBoundsExpression = [[0, -20], [75, 100]];

type AlgaeItem = MacroAlgaeInfo | MicroAlgaeInfo;
type FilteredResult = { country: string; type: string; name: string };
type PartnerPopup = PopUpData & { macroAlgae: MacroAlgaeInfo[]; microAlgae: MicroAlgaeInfo[] };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit, AfterViewInit, OnDestroy {

  private map!: L.Map;
  private cachedGeoJson: any = null;
  private markerGroup: L.LayerGroup = L.layerGroup();
  private resizeTimeout: ReturnType<typeof setTimeout> | null = null;
  private partnerAlgaeCache = new Map<PopUpData, AlgaeItem[]>();

  public popupPartner: PartnerPopup | null = null;
  public selectedAlgae: AlgaeItem | null = null;
  public selectedAlgaeType = '';
  public filterOpen = false;
  public countries: string[] = [];
  public properties: string[] = [];
  public filteredResults: FilteredResult[] = [];
  public selectedFilters = { country: '', property: '' };

  constructor(private cdr: ChangeDetectorRef, private zone: NgZone) { }

  ngOnInit(): void {
    // Build the data list cache once
    DATA_LIST.forEach(p => {
      this.partnerAlgaeCache.set(p, [...(p.macroAlgae ?? []), ...(p.microAlgae ?? [])]);
    });
    this.extractFilterOptions();
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.initMap();
      this.map.whenReady(() => this.map.invalidateSize());
    });
  }

  ngOnDestroy(): void {
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
    this.map?.remove();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
    this.zone.runOutsideAngular(() => {
      this.resizeTimeout = setTimeout(() => this.map?.invalidateSize(), 150);
    });
  }

  private extractFilterOptions(): void {
    const countrySet = new Set<string>();
    const propertySet = new Set<string>();

    DATA_LIST.forEach(p => {
      const allAlgae = this.partnerAlgaeCache.get(p) ?? [];
      allAlgae.forEach(a => {
        if (a.country) countrySet.add(a.country);
        a.properties?.forEach(prop => propertySet.add(prop));
      });
    });

    this.countries = Array.from(countrySet).sort();
    this.properties = Array.from(propertySet).sort();
  }

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

    this.markerGroup.addTo(this.map);
    this.loadCountries();
    this.renderMarkers();
  }

  renderMarkers(): void {
    this.zone.runOutsideAngular(() => {
      this.markerGroup.clearLayers();
      const newResults: FilteredResult[] = [];
      const isAnyFilterActive = !!(this.selectedFilters.country || this.selectedFilters.property);

      DATA_LIST.forEach(partner => {
        const allAlgae = this.partnerAlgaeCache.get(partner) ?? [];

        const matchesCountry = !this.selectedFilters.country ||
          allAlgae.some(a => a.country === this.selectedFilters.country);
        const matchesProperty = !this.selectedFilters.property ||
          allAlgae.some(a => a.properties.includes(this.selectedFilters.property));

        if (!matchesCountry || !matchesProperty) return;

        const marker = L.marker(partner.coords as L.LatLngExpression);
        marker.on('click', () => this.zone.run(() => this.onPinClick(partner)));
        this.markerGroup.addLayer(marker);

        if (isAnyFilterActive) {
          allAlgae.forEach(algae => {
            const mCountry = !this.selectedFilters.country || algae.country === this.selectedFilters.country;
            const mProp = !this.selectedFilters.property || algae.properties.includes(this.selectedFilters.property);
            if (mCountry && mProp) {
              newResults.push({ country: algae.country, type: algae.type, name: algae.name });
            }
          });
        }
      });

      this.filteredResults = newResults;
      this.cdr.markForCheck();
    });
  }

  resetZoom(): void {
    this.zone.runOutsideAngular(() => {
      this.map.flyToBounds(REGION_BOUNDS, { duration: 0.6 });
    });
  }

  private loadCountries(): void {
    if (this.cachedGeoJson) {
      this.renderGeoJson(this.cachedGeoJson);
      return;
    }
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
      filter: f => f.geometry.type !== 'Point',
      style: { color: '#2fc989ff', fillColor: '#2fc989ff', weight: 1, fillOpacity: 0.6 },
      pointToLayer: (_f, latlng) => L.marker(latlng)
    }).addTo(this.map);
  }

  onPinClick(popData: PopUpData): void {
    this.popupPartner = popData as PartnerPopup;
    this.selectedAlgaeType = '';
    this.selectedAlgae = null;
    this.cdr.markForCheck();

    this.zone.runOutsideAngular(() => {
      this.map.flyTo(popData.coords as L.LatLngExpression, 12, { duration: 1.5 });
    });
  }

  closePopup(): void {
    this.popupPartner = null;
    this.selectedAlgae = null;
    this.selectedAlgaeType = '';
  }

  selectAlgae(algae: AlgaeItem): void {
    this.selectedAlgae = algae;
  }

  chossedAlgaeType(type: string): void {
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
  }

  clearFilters(): void {
    this.selectedFilters = { country: '', property: '' };
    this.renderMarkers();
  }

  openFilter(): void {
    this.filterOpen = !this.filterOpen;
  }
}