# Credits and Attributions

This project uses several open-source libraries and services. Based on the mapping setup in your code, below are the required and recommended attributions:

## Map Data & Tiles

Your Leaflet map uses tiles from CARTO, which relies on OpenStreetMap data. You are legally required by their Terms of Service to attribute them. 

* **OpenStreetMap**: Map data is provided by OpenStreetMap. 
  * Required Attribution: `© OpenStreetMap contributors`
  * License: [Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/)
* **CARTO**: The map basemap tiles (Light theme) are hosted and designed by CARTO.
  * Required Attribution: `© CARTO`
  * License: Released under the Creative Commons Attribution license (CC BY 3.0).

> **Note:** Leaflet adds an attribution control to the bottom right of the map by default. Because you passed `attribution: '© OpenStreetMap contributors © CARTO'` in your `L.tileLayer(...)` code, Leaflet is already displaying these required credits dynamically on the map itself! As long as you don't hide that control via CSS, you are perfectly compliant.

## Core Technologies

These don't strictly require visible UI attribution, but it's good practice to acknowledge them in your repository:

* **Leaflet**: The interactive javascript map rendering engine. (Released under the 2-clause BSD License)
* **Angular**: The web application framework powering the app. (Released under the MIT License)

## Project Partners

*(Reminder)* You are rendering various partner logos within the map. You may want to formally list the research partners, organizations, and entities here (such as MIGAL, NORD, VITO, CCMAR, eloop, necton, etc.) to acknowledge their participation or trademarks.
