import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { AlgaeData, ALGAE_LIST, PartnerData, PARTNER_LIST } from './app.data';

const EUROPE_CODES = ['ALB', 'AND', 'AUT', 'BEL', 'BGR', 'BIH', 'BLR', 'CHE', 'CYP', 'CZE', 'DEU', 'DNK', 'ESP', 'EST', 'FIN', 'FRA', 'GBR', 'GRC', 'HRV', 'HUN', 'IRL', 'ISL', 'ISR', 'ITA', 'LIE', 'LTU', 'LUX', 'LVA', 'MDA', 'MKD', 'MLT', 'MNE', 'NLD', 'NOR', 'POL', 'PRT', 'ROU', 'RUS', 'SVK', 'SVN', 'SWE', 'TUR', 'UKR', 'VAT'];
const ASIA_CODES = ['AFG', 'ARM', 'AZE', 'BGD', 'BHR', 'BRN', 'BTN', 'CHN', 'GEO', 'IDN', 'IND', 'IRN', 'IRQ', 'JOR', 'JPN', 'KAZ', 'KGZ', 'KHM', 'KOR', 'KWT', 'LAO', 'LBN', 'LKA', 'MMR', 'MNG', 'MYS', 'NPL', 'OMN', 'PAK', 'PHL', 'PSE', 'QAT', 'SAU', 'SGP', 'SYR', 'THA', 'TJK', 'TKM', 'TLS', 'UZB', 'VNM', 'YEM'];
const AFRICA_CODES = ['AGO', 'BDI', 'BEN', 'BFA', 'BWA', 'CAF', 'CIV', 'CMR', 'COD', 'COG', 'COM', 'CPV', 'DJI', 'DZA', 'EGY', 'ERI', 'ETH', 'GAB', 'GHA', 'GIN', 'GMB', 'GNB', 'GNQ', 'KEN', 'LBR', 'LBY', 'LSO', 'MAR', 'MDG', 'MLI', 'MOZ', 'MRT', 'MUS', 'MWI', 'NAM', 'NER', 'NGA', 'RWA', 'SDN', 'SEN', 'SLE', 'SOM', 'SSD', 'STP', 'SWZ', 'SYC', 'TCD', 'TGO', 'TUN', 'TZA', 'UGA', 'ZAF', 'ZMB', 'ZWE'];

const CONTINENT_COLORS: Record<string, string> = {
  Europe: '#3498db',
  Asia: '#f1c40f',
  Africa: '#2ecc71',
  Other: '#cccccc'
};

const REGION_BOUNDS: L.LatLngBoundsExpression = [[0, -20], [75, 170]];

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private map: L.Map | undefined;
  private cachedGeoJson: any = null;

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    if (this.map) return;

    const iconDefault = L.icon({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;

    this.map = L.map('map', {
      renderer: L.canvas(),
      minZoom: 3,
      maxZoom: 10,
      zoomSnap: 0,
      zoomDelta: 0.25,
      maxBounds: REGION_BOUNDS,
      maxBoundsViscosity: 1.0,
    }).fitBounds(REGION_BOUNDS);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      minZoom: 3,
      maxZoom: 10,
    }).addTo(this.map);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
      minZoom: 3,
      maxZoom: 10,
      pane: 'shadowPane'
    }).addTo(this.map);


    const coordsPopup = L.popup();

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat.toFixed(4);
      const lng = e.latlng.lng.toFixed(4);

      coordsPopup
        .setLatLng(e.latlng)
        .setContent(`
          <div style="font-family: sans-serif; text-align: center;">
            <b style="color: #2c3e50;">Coordinates</b><br>
            <code style="background: #f4f4f4; padding: 2px 4px; border-radius: 4px;">
              [${lat}, ${lng}]
            </code>
          </div>
        `)
        .openOn(this.map!);
    });


    this.loadCountries();
    this.addAlgaeMarkers();
    this.addPartnerMarkers();

    window.addEventListener('resize', () => this.map?.invalidateSize());
    setTimeout(() => this.map?.invalidateSize(), 100);
  }

  private loadCountries(): void {
    if (this.cachedGeoJson) {
      this.renderGeoJson(this.cachedGeoJson);
      return;
    }

    fetch('/assets/countries.json')
      .then(res => res.json())
      .then(data => {
        this.cachedGeoJson = data;
        this.renderGeoJson(data);
      })
      .catch(err => console.error('Error loading JSON:', err));
  }

  private renderGeoJson(data: any): void {
    if (!this.map) return;

    L.geoJSON(data, {
      style: (feature) => {
        const code = feature?.properties?.['ISO3166-1-Alpha-3'] ?? '';
        let continent = 'Other';

        if (EUROPE_CODES.includes(code)) continent = 'Europe';
        else if (ASIA_CODES.includes(code)) continent = 'Asia';
        else if (AFRICA_CODES.includes(code)) continent = 'Africa';

        return {
          fillColor: CONTINENT_COLORS[continent],
          fillOpacity: 0.6,
          color: 'white',
          weight: 1,
          smoothFactor: 1.9
        };
      }
    }).addTo(this.map);
  }

  private addAlgaeMarkers(): void {
    if (!this.map) return;

    ALGAE_LIST.forEach(algae => {
      L.marker(algae.coords)
        .addTo(this.map!)
        .bindPopup(this.buildAlgaePopup(algae));
    });
  }

  private addPartnerMarkers(): void {
    if (!this.map) return;

    PARTNER_LIST.forEach(partner => {
      const partnerIcon = L.divIcon({
        className: 'custom-partner-icon',
        html: `
          <div class="partner-marker-content">
            <div class="partner-hexagon-shadow">
              <div class="partner-hexagon-wrapper">
                <div class="inner-hexagon">
                  <img class="partner-logo-img" src="${partner.logo}" alt="logo">
                </div>
              </div>
            </div>
            <div class="partner-line"></div>
            <div class="partner-dot"></div>
          </div>
        `,
        iconSize: [80, 110],
        iconAnchor: [40, 110],
        popupAnchor: [0, -105]
      });

      L.marker(partner.coords, { icon: partnerIcon })
        .addTo(this.map!)
        .bindPopup(this.buildPartnerPopup(partner));
    });
  }

  private buildAlgaePopup(algae: AlgaeData): string {
    const items = algae.properties.map(p => `<li>${p}</li>`).join('');
    return `
      <div style="font-family: sans-serif; min-width: 200px;">
        <b style="color: #2c3e50; font-size: 1.1em;">${algae.name}</b><br>
        <i style="color: #7f8c8d;">${algae.scientificName}</i><br>
        <small>Type: ${algae.type}</small>
        <hr style="margin: 8px 0; border: 0; border-top: 1px solid #ddd;">
        <ul style="margin: 0; padding-left: 18px; font-size: 0.9em;">
          ${items}
        </ul>
      </div>
    `;
  }
  private buildPartnerPopup(partner: PartnerData): string {
    return `
      <div style="font-family: sans-serif; min-width: 200px;">
        <b style="color: #2c3e50; font-size: 1.1em;">${partner.name}</b><br>
        <i style="color: #7f8c8d;">${partner.url}</i><br>
        <small>Type: ${partner.coords}</small>
        <hr style="margin: 8px 0; border: 0; border-top: 1px solid #ddd;">
      </div>
    `;
  }
}