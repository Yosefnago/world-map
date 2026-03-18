import {
  Component, OnInit, ElementRef, ViewChild, AfterViewInit,
  HostListener, ChangeDetectorRef, NgZone, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { PARTNER_LIST, PartnerData, AlgaeInfo } from './app.data';

// Map colours
const EUROPE_CODES = ['ALB', 'AND', 'AUT', 'BEL', 'BGR', 'BIH', 'BLR', 'CHE', 'CYP', 'CZE', 'DEU', 'DNK', 'ESP', 'EST', 'FIN', 'FRA', 'GBR', 'GRC', 'HRV', 'HUN', 'IRL', 'ISL', 'ISR', 'ITA', 'LIE', 'LTU', 'LUX', 'LVA', 'MDA', 'MKD', 'MLT', 'MNE', 'NLD', 'NOR', 'POL', 'PRT', 'ROU', 'RUS', 'SVK', 'SVN', 'SWE', 'TUR', 'UKR', 'VAT'];
const ASIA_CODES = ['AFG', 'ARM', 'AZE', 'BGD', 'BHR', 'BRN', 'BTN', 'CHN', 'GEO', 'IDN', 'IND', 'IRN', 'IRQ', 'JOR', 'JPN', 'KAZ', 'KGZ', 'KHM', 'KOR', 'KWT', 'LAO', 'LBN', 'LKA', 'MMR', 'MNG', 'MYS', 'NPL', 'OMN', 'PAK', 'PHL', 'PSE', 'QAT', 'SAU', 'SGP', 'SYR', 'THA', 'TJK', 'TKM', 'TLS', 'UZB', 'VNM', 'YEM'];
const AFRICA_CODES = ['AGO', 'BDI', 'BEN', 'BFA', 'BWA', 'CAF', 'CIV', 'CMR', 'COD', 'COG', 'COM', 'CPV', 'DJI', 'DZA', 'EGY', 'ERI', 'ETH', 'GAB', 'GHA', 'GIN', 'GMB', 'GNB', 'GNQ', 'KEN', 'LBR', 'LBY', 'LSO', 'MAR', 'MDG', 'MLI', 'MOZ', 'MRT', 'MUS', 'MWI', 'NAM', 'NER', 'NGA', 'RWA', 'SDN', 'SEN', 'SLE', 'SOM', 'SSD', 'STP', 'SWZ', 'SYC', 'TCD', 'TGO', 'TUN', 'TZA', 'UGA', 'ZAF', 'ZMB', 'ZWE'];
const CONTINENT_COLORS: Record<string, string> = {
  Europe: '#3a7bd5'
};

const REGION_BOUNDS: L.LatLngBoundsExpression = [[0, -20], [75, 170]];


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

  public popupPartner: (PartnerData & { algaeInfo: AlgaeInfo }) | null = null;
  public selectedAlgae: AlgaeInfo | null = null;

  constructor(private cdr: ChangeDetectorRef, private zone: NgZone) { }

  //  Lifecycle 
  ngOnInit(): void {}

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

      minZoom: 3, maxZoom: 12,
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

    // Create interactive markers for partners
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
      filter: (f) => f.geometry.type !== 'Point', // Let L.marker handle the points
      style: f => {
        const code = f?.properties?.['ISO3166-1-Alpha-3'] ?? '';
        const continent = EUROPE_CODES.includes(code) ? 'Europe'
          : ASIA_CODES.includes(code) ? 'Asia'
            : AFRICA_CODES.includes(code) ? 'Africa' : 'Other';
        return {
          fillColor: CONTINENT_COLORS[continent],
          fillOpacity: 0.55,
          color: '#fff',
          weight: 0.8,
          smoothFactor: 2.0
        };
      }
    }).addTo(this.map);
  }

  // Interactions 

  onPinClick(partner: PartnerData): void {
    this.popupPartner = null;
    this.selectedAlgae = null;
    this.cdr.detectChanges(); // clear it first

    // Fly to the pin smoothly
    this.map.flyTo(partner.coords as L.LatLngExpression, 7, {
      duration: 0.6, easeLinearity: 0.2
    });

    if (partner.algaeInfo) {
      this.map.once('moveend', () => {
        this.zone.run(() => {
          this.popupPartner = partner as PartnerData & { algaeInfo: AlgaeInfo };
          this.selectedAlgae = this.popupPartner.algaeInfo[0];
          this.cdr.detectChanges();
        });
      });
    }
  }

  closePopup(): void {
    this.popupPartner = null;
    this.selectedAlgae = null;
  }

  selectAlgae(algae: AlgaeInfo): void {
    this.selectedAlgae = algae;
  }
}