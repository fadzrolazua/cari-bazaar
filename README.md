# CariBazaar

CariBazaar is a small Angular portfolio project for discovering local bazaars on an interactive Leaflet map. The app demonstrates a clean separation between domain rules, application state, infrastructure, and reusable UI components.

## Features

- Browse active bazaars on a responsive split-screen layout
- Keep the explorer within one viewport; only the directory list scrolls
- Search by bazaar name, city, or state
- Filter bazaars that are open today
- Select a bazaar from the list or map and focus the map automatically
- Optional browser geolocation with a configurable map radius
- Sort results by distance when location access is enabled
- Settings panel for location preferences and refreshing demo data
- Loading, empty, and error states
- Accessible controls, keyboard focus styles, and responsive mobile layout

## Architecture

The project follows a lightweight Clean Architecture approach:

```text
src/app/
├── core/
│   ├── domain/             # Business models and value objects
│   ├── application/       # Use cases and repository ports
│   └── infrastructure/    # HTTP/file-backed repository adapters
├── features/
│   ├── bazaar-explorer/   # Screen facade and container component
│   ├── bazaar-list/       # Presentational list and reusable bazaar card
│   ├── map/               # Reusable Leaflet map adapter
│   └── settings/          # Location and data preferences
└── shared/ui/             # Reusable loading, empty, and status components
```

The dependency direction is intentional:

```text
UI components → feature facade → use cases → repository port ← infrastructure adapter
```

The UI does not fetch data directly. `GetActiveBazaarsUseCase` owns the active-bazaar rule, while `HttpBazaarRepository` validates and maps the JSON record shape into the domain model. Replacing the local JSON file with an API only requires a new repository adapter. Geospatial calculations live in a pure domain utility and the Leaflet adapter handles map lifecycle and resizing.

## Getting started

```bash
npm install
npm start
```

Open <http://localhost:4200/> in a browser. The development server reloads automatically when source files change. Browser geolocation requires HTTPS (or localhost).

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Run the development server |
| `npm run build` | Create a production build |
| `npm test` | Run unit tests with Karma |
| `npm run test:ci` | Run headless unit tests once |
| `npm run watch` | Build continuously in development mode |
| `npm audit` | Check dependency security advisories |

## Data and map attribution

Demo data lives in `public/assets/data/bazaars.json`. Map tiles are provided by [OpenStreetMap](https://www.openstreetmap.org/) and displayed through [Leaflet](https://leafletjs.com/). The map includes the required OpenStreetMap attribution.
