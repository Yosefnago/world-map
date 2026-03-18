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

const HEX_W = 76;
const HEX_H = 88;
const MIN_LOGO_DIST = 84;
const EDGE_PAD = 48;

const SEED_POSITIONS_PCT: Array<{ x: number; y: number }> = [
  //  0 CCMAR
  { x: 4, y: 58 },
  //  1 IMG
  { x: 35, y: 30 },
  //  2 NORD
  { x: 22, y: 20 },
  //  3 ESCI
  { x: 35, y: 23 },
  //  4 MIGAL
  { x: 42, y: 59 },
  //  5 ALGAIA
  { x: 7, y: 51 },
  //  6 BRC
  { x: 37, y: 51 },
  //  7 ELOOP
  { x: 23, y: 83 },
  //  8 IRCCS
  { x: 33, y: 61 },
  //  9 MBU
  { x: 39, y: 41 },
  // 10 NECTON
  { x: 4, y: 71 },
  // 11 SOLARIS
  { x: 30, y: 72 },
  // 12 SYNOVO
  { x: 6, y: 40 },
  // 13 TEAGASC
  { x: 9, y: 31 },
  // 14 UNINA
  { x: 18, y: 76 },
  // 15 VITO
  { x: 15, y: 26 },
  // 16 YEMOJA
  { x: 42, y: 72 },
];

export interface ProcessedPartner extends PartnerData {
  logoX: number;
  logoY: number;
  transformStr: string;
  dotX: number;
  dotY: number;
  linePath: string;
  offScreen: boolean;
  index: number;
}

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

  private rafIdSilent: number | null = null;
  private rafIdFull: number | null = null;

  private lastZoom = -1;

  public processedPartners: ProcessedPartner[] = [];
  public activeIndex: number | null = null;
  public popupPartner: (ProcessedPartner & { algaeInfo: AlgaeInfo }) | null = null;
  public selectedAlgae: AlgaeInfo | null = null;

  constructor(private cdr: ChangeDetectorRef, private zone: NgZone) { }

  //  Lifecycle 
  ngOnInit(): void {
    this.processedPartners = PARTNER_LIST.map((p, i) => ({
      ...p,
      logoX: -500, logoY: -500,
      transformStr: `translate3d(-500px, -500px, 0) translate(-50%, -50%)`,
      dotX: 0, dotY: 0,
      linePath: '', offScreen: false, index: i
    }));
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.initMap();
      this.map.whenReady(() => {
        this.map.invalidateSize();
        this.recalculate();
      });

      this.map.on('move zoom', () => this.scheduleRecalcSilent());

      this.map.on('moveend zoomend', () => this.scheduleRecalcFull());
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.zone.runOutsideAngular(() => {
      this.map?.invalidateSize();
      this.recalculate();
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

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
      detectRetina: false,
      attribution: '© OpenStreetMap contributors © CARTO'
    }).addTo(this.map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
      detectRetina: false,
      pane: 'shadowPane'
    }).addTo(this.map);

    this.loadCountries();

    // White dot markers at the actual partner coordinates
    this.processedPartners.forEach(p => {
      L.circleMarker(p.coords as L.LatLngExpression, {
        radius: 5, fillColor: '#fff', color: '#1a3a5c',
        weight: 2.5, fillOpacity: 1, interactive: false
      }).addTo(this.map);
    });
  }

  resetZoom(): void {
    this.map.flyToBounds(REGION_BOUNDS, { duration: 0.6 });
  }

  //Position engine 
  private scheduleRecalcSilent(): void {
    if (this.rafIdSilent !== null) return;
    this.rafIdSilent = requestAnimationFrame(() => {
      this.rafIdSilent = null;
      this.recalculateGeometry(false);
    });
  }

  private scheduleRecalcFull(): void {
    if (this.rafIdFull !== null) return;
    this.rafIdFull = requestAnimationFrame(() => {
      this.rafIdFull = null;
      this.recalculate();
    });
  }

  private recalculate(): void {
    if (!this.map) return;
    const el = this.mapWrapper.nativeElement as HTMLElement;
    const W = el.clientWidth;
    const H = el.clientHeight;
    if (!W || !H) return;

    const currentZoom = this.map.getZoom();
    const zoomChanged = currentZoom !== this.lastZoom;

    for (const p of this.processedPartners) {
      const pt = this.map.latLngToContainerPoint(p.coords as L.LatLngExpression);
      p.dotX = pt.x;
      p.dotY = pt.y;
    }

    if (zoomChanged) {
      this.lastZoom = currentZoom;
      this.recalculateLogoPositions(W, H);
      this.resolveCollisions(15);
    }

    for (const p of this.processedPartners) {
      p.logoX = Math.max(EDGE_PAD, Math.min(W - EDGE_PAD, p.logoX));
      p.logoY = Math.max(EDGE_PAD, Math.min(H - EDGE_PAD, p.logoY));
      p.transformStr = `translate3d(${p.logoX}px, ${p.logoY}px, 0) translate(-50%, -50%)`;
      const cpX = (p.dotX + p.logoX) * 0.5;
      const cpY = (p.dotY + p.logoY) * 0.5 - 28;
      p.linePath = `M ${p.dotX} ${p.dotY} Q ${cpX} ${cpY} ${p.logoX} ${p.logoY}`;
    }

    this.cdr.detectChanges();
  }

  private recalculateGeometry(triggerCD: boolean): void {
    if (!this.map) return;
    const el = this.mapWrapper.nativeElement as HTMLElement;
    const W = el.clientWidth;
    const H = el.clientHeight;
    if (!W || !H) return;

    for (const p of this.processedPartners) {
      const pt = this.map.latLngToContainerPoint(p.coords as L.LatLngExpression);
      p.dotX = pt.x;
      p.dotY = pt.y;

      const cpX = (p.dotX + p.logoX) * 0.5;
      const cpY = (p.dotY + p.logoY) * 0.5 - 28;
      p.linePath = `M ${p.dotX} ${p.dotY} Q ${cpX} ${cpY} ${p.logoX} ${p.logoY}`;
    }

    if (triggerCD) {
      this.cdr.detectChanges();
    }
  }

  private recalculateLogoPositions(W: number, H: number): void {
    for (let i = 0; i < this.processedPartners.length; i++) {
      const p = this.processedPartners[i];
      const dotInView = p.dotX > -HEX_W && p.dotX < W + HEX_W
        && p.dotY > -HEX_H && p.dotY < H + HEX_H;

      if (!dotInView) {
        p.offScreen = true;
        p.logoX = Math.max(EDGE_PAD, Math.min(W - EDGE_PAD, p.dotX));
        p.logoY = Math.max(EDGE_PAD, Math.min(H - EDGE_PAD, p.dotY));
      } else {
        p.offScreen = false;
        const seed = SEED_POSITIONS_PCT[i] ?? { x: 50, y: 50 };
        p.logoX = (seed.x / 100) * W;
        p.logoY = (seed.y / 100) * H;
      }
    }
  }

  private resolveCollisions(iterations: number): void {
    const minDistSq = MIN_LOGO_DIST * MIN_LOGO_DIST;
    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 0; i < this.processedPartners.length; i++) {
        for (let j = i + 1; j < this.processedPartners.length; j++) {
          const a = this.processedPartners[i];
          const b = this.processedPartners[j];
          const dx = b.logoX - a.logoX;
          const dy = b.logoY - a.logoY;
          const distSq = dx * dx + dy * dy;

          if (distSq < minDistSq) {
            const dist = Math.sqrt(distSq) || 0.01;
            const push = (MIN_LOGO_DIST - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;
            const wa = a.offScreen ? 0.3 : 0.5;
            const wb = b.offScreen ? 0.3 : 0.5;
            a.logoX -= nx * push * wa * 2;
            a.logoY -= ny * push * wa * 2;
            b.logoX += nx * push * wb * 2;
            b.logoY += ny * push * wb * 2;
          }
        }
      }
    }
  }

  // GeoJSON 
  private loadCountries(): void {
    if (this.cachedGeoJson) { this.renderGeoJson(this.cachedGeoJson); return; }
    fetch('/assets/countries.json')
      .then(r => r.json())
      .then(data => {
        this.cachedGeoJson = data;
        this.zone.runOutsideAngular(() => this.renderGeoJson(data));
      });
  }

  private renderGeoJson(data: any): void {
    L.geoJSON(data, {
      interactive: false,
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

  onHexHover(index: number, on: boolean): void {
    this.activeIndex = on ? index : null;
  }

  onHexClick(partner: ProcessedPartner): void {
    this.popupPartner = null;
    this.selectedAlgae = null;

    this.map.flyTo(partner.coords as L.LatLngExpression, 7, {
      duration: 0.6, easeLinearity: 0.2
    });

    if (partner.algaeInfo) {
      this.map.once('moveend', () => {
        this.zone.run(() => {
          this.popupPartner = partner as ProcessedPartner & { algaeInfo: AlgaeInfo };
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