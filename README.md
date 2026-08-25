<div align="center">

# Gods Eye — Ghost Edition

**A live 3D intelligence globe in the browser.**  
Track aircraft and ships, inspect contacts, and fly the planet — without a Google Maps bill, without OpenAI, and without signing up for an API key.

Rebuild of the open-source [God's Eye View](https://github.com/bilawalsidhu/gods-eye-view) client: smoother contact handling, a rebuilt ship/plane inspect flow, and a default path that stays **keyless**. Full credit to the original developer for creating an amazing and beautiful tool. I simply wanted to make it easier for people and make some changes to improve the UI.

[Quick start](#quick-start) · [Why Ghost Edition](#why-ghost-edition) · [What's live](#whats-live) · [Ships and planes](#ships--planes) · [Screenshots](#screenshots)

</div>
𝘾𝙡𝙞𝙘𝙠 𝙩𝙝𝙚 𝙫𝙞𝙙𝙚𝙤 𝙗𝙚𝙡𝙤𝙬 𝙩𝙤 𝙬𝙖𝙩𝙘𝙝 𝙖 𝙙𝙚𝙢𝙤
[![Gods Eye Ghost Edition — Live Tracking Demo](https://img.youtube.com/vi/6zXQPCAVU60/maxresdefault.jpg)](https://www.youtube.com/watch?v=6zXQPCAVU60)

---

## Why Ghost Edition

Most “live map” stacks quietly depend on a paid Google Maps Platform key for the planet, then another metered key if you want an AI mic. Ghost Edition is built so the **default experience costs nothing to run**.

| You do not need | What you get instead |
|-----------------|----------------------|
| **Google Maps billing** | Satellite and OSM globe stacks out of the box. Photorealistic Google 3D stays optional — never required. |
| **An OpenAI key** | The console, layers, HUD, and inspect panel all work without voice. The mic is extra, not the product. |
| **Paid map / AIS / ADS-B APIs** | `npm install` and `npm run dev`. Live flights and ships come from public feeds. No account, no credit card. |

**Benefits you feel immediately**

- **Zero-cost start.** Clone, install, open the globe. No Cloud Console, no usage alerts, no “Map Tiles API not enabled.”
- **Smoother contacts.** Clicking a ship or plane inspects it in place. The camera no longer yanks you off the scene.
- **Rebuilt inspect.** Aircraft can still show a live airframe photo when one exists. Vessels use a clear static graphic plus **origin country** from the AIS flag state (MMSI MID + ISO code) so you can log fleets by country.
- **Honest globe.** Public transponders, public cameras, public orbital elements — labeled when something is delayed, simulated, or missing.

---

## Quick start

**Requires Node.js 18+.** No `.env` file is required.

```bash
npm install
npm run dev -- --host localhost --port 4173
```

Open **http://localhost:4173**.

That is the whole entry fee. Optional keys (Google 3D, OpenAI voice, AISStream, FIRMS, TomTom, Cesium ion) live in `.env.example` if you ever want extras. Leave them blank and Ghost Edition keeps running.

---

## Screenshots

![Live globe](docs/screenshots/01-hero.png)

*Keyless satellite globe: live flights, AIS vessels, and the Ghost Edition HUD over the United Kingdom.*

![Inspect a live military aircraft among ships](docs/screenshots/02-inspect.png)

*Click-to-inspect stays on your view. Aircraft dossier with live telemetry and airframe photo; ships remain labeled on the water.*

---

## Ships & planes

Ghost Edition rebuilds how you **look at** live traffic — not just how it is drawn.

**Click does not steal the camera.** Select a contact and the inspect dossier opens at the top of the screen. You stay on the view you chose.

**Aircraft**

- Live ADS-B from public networks (anonymous OpenSky + adsb.lol).
- Trail, heading, and kinematics stay on the globe.
- Inspect panel: identity, route when the public lookup has one, photo when Planespotters has one.

**Vessels**

- Live AIS without an AISStream key (Open Waters snapshot). Optional AISStream key only if you want a denser private stream.
- Military / type-35 contacts render in **bright red**.
- Inspect panel: name, class, speed, course, and **origin country** (flag state from MMSI), plus ISO country code and MID for logging.
- Static vessel graphic instead of broken Wikipedia photos.

Motion is interpolated between sparse live fixes, and icons keep **true-world heading** as you orbit — no spinning glyphs.

---

## What's live

Turn layers on from the tray. Most of them need **no key**.

| Layer | What you see | Needs a key? |
|-------|----------------|--------------|
| **Satellite / OSM globe** | Worldwide basemap + terrain | No |
| **Live flights** | Civilian ADS-B traffic | No |
| **Military flights** | Military ADS-B (adsb.lol) | No |
| **Live vessels** | AIS ships, origin country on inspect | No |
| **Satellites** | Catalog + ISS-class tracks (CelesTrak) | No |
| **Earthquakes** | USGS, last 24h | No |
| **CCTV** | Public city cameras in the 3D scene | No |
| **Radio / bikeshare / launches** | Geolocated public feeds | No |
| **Traffic** | Simulated flow keyless; TomTom optional for live jams | No |
| **Fires** | NASA FIRMS | Optional free map key |
| **Google Photorealistic 3D** | Street-level mesh | Optional, **billed by Google** |
| **Voice / AI HUD** | OpenAI Realtime | Optional, **billed by OpenAI** |

**Keyboard:** `1`–`7` visual styles · `H` HUD · `D` detection · `C` cockpit · `Esc` close inspect.

---

## How it stays free

Ghost Edition does not proxy your wallet through Google or OpenAI unless **you** add those keys.

- **Globe:** Esri satellite and OpenStreetMap by default. Cesium ion is optional for Bing stacks.
- **Air:** OpenSky anonymous mode + adsb.lol. No ADS-B vendor contract.
- **Sea:** Keyless AIS snapshot. Flag state is decoded from the MMSI — useful for country logs, not a shipyard “built in” field (AIS does not carry that).
- **Voice:** Off until `OPENAI_API_KEY` exists. The rest of the product does not wait on it.

If you later enable Google Map Tiles or OpenAI, those providers bill you — Ghost Edition never requires them.

---

## Run notes

- The dev server binds to **localhost** by default so nothing on your LAN can spend optional keys you might add later.
- Cold start is typically a couple of seconds on a recent laptop.
- Live data can be delayed, incomplete, or wrong. This is an exploration console, not a navigation or emergency tool.

```
src/
├── main.js                 # Ghost Edition bootstrap, Cesium viewer
├── inspectDossier.js       # Ship / aircraft inspect panel
├── data/aisLiveVessels.js  # AIS layer + click-to-inspect
├── data/flights.js         # ADS-B layer + click-to-inspect
├── data/aisIdentity.js     # MMSI origin country / MID / ISO
└── mapStackController.js   # Satellite, OSM, optional Google 3D
```

---

## Responsible use

Public signals only. This project visualizes **aircraft, vessels, satellites, infrastructure, and cameras**. It is not a people-search, face-recognition, or named-individual tracker.

Upstream: [God's Eye View](https://github.com/bilawalsidhu/gods-eye-view) by Bilawal Sidhu. Ghost Edition is a local-first rebuild of interactions and the default cost path.

Released under the **MIT License** of the parent project unless you add your own. Dataset terms: see `DATA_SOURCES.md` if present.

> **Important.** Do not use this for flight or maritime navigation, emergency response, or other safety-critical work. Verify anything that matters against authoritative sources.
