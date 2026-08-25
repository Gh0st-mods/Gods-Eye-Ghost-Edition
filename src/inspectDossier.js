/**
 * Top-of-screen inspect dossier for a clicked aircraft or vessel.
 * Clicking a contact no longer moves the camera; this panel shows identity.
 * Aircraft may load a Planespotters photo. Vessels use a static graphic and
 * origin country from the AIS MMSI flag state (registry), not a live photo.
 */

export const INSPECT_CONTACT_EVENT = 'gev:inspect-contact';
export const INSPECT_CONTACT_CLOSE_EVENT = 'gev:inspect-contact-close';

const AIRCRAFT_SILHOUETTE = `<svg viewBox="0 0 240 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path fill="none" stroke="#39ffd5" stroke-width="1.4" d="M12 52h70l28-28h18l-10 28h48l22-16h14l-12 16h28l8 8H12z"/>
  <path fill="none" stroke="#39ffd5" stroke-width="1.2" opacity=".55" d="M82 52l36 26h16l-18-26"/>
</svg>`;

const VESSEL_STATIC_SRC = '/inspect-vessel.svg';

let _root = null;
let _openId = null;
let _seq = 0;
let _initialized = false;

/**
 * Announce an inspect target. The panel listener renders it; tests can
 * observe the event without a DOM.
 * @param {object} payload
 * @param {EventTarget} [eventTarget]
 */
export function inspectContact(payload, eventTarget = globalThis.window) {
  if (!payload || typeof payload !== 'object') return false;
  const id = String(payload.id || '').trim();
  if (!id) return false;
  if (typeof eventTarget?.dispatchEvent !== 'function') return false;
  eventTarget.dispatchEvent(new CustomEvent(INSPECT_CONTACT_EVENT, { detail: payload }));
  return true;
}

/** Close the inspect panel. */
export function closeInspectContact(eventTarget = globalThis.window) {
  if (typeof eventTarget?.dispatchEvent !== 'function') return false;
  eventTarget.dispatchEvent(new CustomEvent(INSPECT_CONTACT_CLOSE_EVENT));
  return true;
}

export function formatAirport(airport) {
  if (!airport || typeof airport !== 'object') return 'UNKNOWN';
  const code = String(airport.code || '').trim().toUpperCase();
  const name = String(airport.name || '').trim().toUpperCase();
  if (code && name && name !== code) return `${code}  ·  ${name}`;
  return code || name || 'UNKNOWN';
}

export function formatCoord(lat, lon) {
  const latitude = Number(lat);
  const longitude = Number(lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return 'UNKNOWN';
  const ns = latitude >= 0 ? 'N' : 'S';
  const ew = longitude >= 0 ? 'E' : 'W';
  return `${Math.abs(latitude).toFixed(4)}°${ns}  ${Math.abs(longitude).toFixed(4)}°${ew}`;
}

export function formatKnotsFromMps(mps) {
  if (mps === null || mps === undefined || mps === '') return 'UNKNOWN';
  const speed = Number(mps);
  if (!Number.isFinite(speed)) return 'UNKNOWN';
  return `${Math.round(speed * 1.94384)} KT`;
}

export function formatFeetFromMeters(meters) {
  if (meters === null || meters === undefined || meters === '') return 'UNKNOWN';
  const altitude = Number(meters);
  if (!Number.isFinite(altitude)) return 'UNKNOWN';
  return `${Math.round(altitude * 3.28084).toLocaleString('en-US')} FT`;
}

export function initInspectDossier(doc = globalThis.document, eventTarget = globalThis.window) {
  if (_initialized) return;
  _root = doc?.getElementById?.('inspect-dossier') || null;
  if (!_root || typeof eventTarget?.addEventListener !== 'function') return;
  _initialized = true;
  eventTarget.addEventListener(INSPECT_CONTACT_EVENT, (event) => {
    void renderDossier(event.detail, eventTarget);
  });
  eventTarget.addEventListener(INSPECT_CONTACT_CLOSE_EVENT, () => hideDossier());
  _root.querySelector('[data-inspect-close]')?.addEventListener('click', () => {
    closeInspectContact(eventTarget);
  });
  doc.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && _openId) closeInspectContact(eventTarget);
  });
}

async function renderDossier(payload) {
  if (!_root || !payload?.id) return;
  const seq = ++_seq;
  _openId = String(payload.id);
  _root.hidden = false;
  _root.dataset.kind = payload.kind || 'unknown';
  _root.setAttribute('aria-hidden', 'false');

  const title = _root.querySelector('[data-inspect-title]');
  const klass = _root.querySelector('[data-inspect-class]');
  const photo = _root.querySelector('[data-inspect-photo]');
  const credit = _root.querySelector('[data-inspect-credit]');
  const fields = _root.querySelector('[data-inspect-fields]');
  const originEl = _root.querySelector('[data-inspect-origin]');
  const destEl = _root.querySelector('[data-inspect-destination]');
  const originLabel = _root.querySelector('[data-inspect-origin-label]');
  const destLabel = _root.querySelector('[data-inspect-destination-label]');
  const status = _root.querySelector('[data-inspect-status]');

  if (title) title.textContent = payload.title || payload.id;
  if (klass) klass.textContent = payload.classification || 'CONTACT';
  if (status) status.textContent = payload.kind === 'vessel' ? 'LIVE' : 'LOCK';
  if (originLabel) originLabel.textContent = payload.originLabel || 'ORIGIN';
  if (destLabel) destLabel.textContent = payload.destinationLabel || 'DESTINATION';
  if (photo) {
    photo.replaceChildren();
    if (payload.kind === 'vessel') {
      fillVesselStaticPhoto(photo, payload);
    } else {
      photo.insertAdjacentHTML('afterbegin', AIRCRAFT_SILHOUETTE);
      photo.dataset.state = 'silhouette';
    }
  }
  if (credit) {
    credit.textContent = payload.kind === 'vessel'
      ? 'STATIC GRAPHIC  ·  ORIGIN FROM AIS FLAG STATE'
      : 'ADS-B LIVE FEED';
  }
  if (originEl) originEl.textContent = payload.origin || 'UNKNOWN';
  if (destEl) destEl.textContent = payload.destination || 'UNKNOWN';
  if (fields) {
    fields.replaceChildren();
    for (const row of payload.fields || []) {
      appendInspectField(fields, row);
    }
  }

  if (payload.kind === 'vessel') return;

  const enriched = await enrichPayload(payload);
  if (seq !== _seq || !_openId) return;
  if (originEl && enriched.origin) originEl.textContent = enriched.origin;
  if (destEl && enriched.destination) destEl.textContent = enriched.destination;
  if (title && enriched.title) title.textContent = enriched.title;
  if (fields && Array.isArray(enriched.extraFields)) {
    for (const row of enriched.extraFields) {
      if (!row?.label || !row?.value) continue;
      const exists = [...fields.querySelectorAll('dt')].some((node) => node.textContent === row.label);
      if (exists) {
        const dt = [...fields.querySelectorAll('dt')].find((node) => node.textContent === row.label);
        if (dt?.nextElementSibling) dt.nextElementSibling.textContent = row.value;
        continue;
      }
      appendInspectField(fields, row);
    }
  }
  if (photo && enriched.photoUrl) {
    const img = new Image();
    img.alt = payload.title || 'Contact photograph';
    img.addEventListener('load', () => {
      if (seq !== _seq) return;
      photo.replaceChildren(img);
      photo.dataset.state = 'live';
    });
    img.src = enriched.photoUrl;
  }
  if (credit && enriched.credit) credit.textContent = enriched.credit;
  if (status) status.textContent = 'LIVE';
}

function fillVesselStaticPhoto(photo, payload) {
  const img = document.createElement('img');
  img.src = VESSEL_STATIC_SRC;
  img.alt = payload.title || 'Surface vessel';
  photo.append(img);
  const caption = document.createElement('figcaption');
  caption.className = 'inspect-dossier-country';
  const kicker = document.createElement('span');
  kicker.textContent = 'ORIGIN COUNTRY';
  const name = document.createElement('strong');
  const country = String(payload.country || payload.origin || '').trim() || 'UNKNOWN';
  const code = String(payload.countryCode || '').trim();
  name.textContent = code ? `${code}  ·  ${country}` : country;
  caption.append(kicker, name);
  const mid = String(payload.mid || '').trim();
  if (mid) {
    const midEl = document.createElement('em');
    midEl.textContent = `MID ${mid}`;
    caption.append(midEl);
  }
  photo.append(caption);
  photo.dataset.state = 'static';
}

function appendInspectField(fields, row) {
  const dt = docCreate('dt', row.label);
  const dd = docCreate('dd', row.value || 'UNKNOWN');
  if (row.label === 'PROFILE') {
    dt.className = 'inspect-dossier-profile';
    dd.className = 'inspect-dossier-profile';
  }
  fields.append(dt, dd);
}

function hideDossier() {
  _openId = null;
  if (!_root) return;
  _root.hidden = true;
  _root.setAttribute('aria-hidden', 'true');
}

function docCreate(tag, text) {
  const node = document.createElement(tag);
  node.textContent = text;
  return node;
}

async function enrichPayload(payload) {
  const out = {};
  if (payload.kind !== 'aircraft') return out;
  const hex = String(payload.hex || payload.id || '').toLowerCase();
  const callsign = String(payload.callsign || '').trim().toUpperCase();
  const jobs = [];
  if (callsign) {
    jobs.push(
      fetchJson(`/api/adsbdb/route/${encodeURIComponent(callsign)}`).then((data) => {
        if (!data?.found) return;
        if (data.origin) out.origin = formatAirport(data.origin);
        if (data.destination) out.destination = formatAirport(data.destination);
        if (data.airline) out.extraFields = [...(out.extraFields || []), { label: 'OPERATOR', value: data.airline }];
      }),
    );
  }
  if (/^[0-9a-f]{6}$/.test(hex)) {
    jobs.push(
      fetchJson(`/api/adsbdb/type/${hex}`).then((data) => {
        if (!data?.found) return;
        out.extraFields = out.extraFields || [];
        if (data.typeName) out.extraFields.push({ label: 'AIRFRAME', value: data.typeName });
        if (data.registration) {
          out.extraFields.push({ label: 'REGISTRATION', value: data.registration });
          out.title = String(payload.title || '').trim() || data.registration;
        }
      }),
    );
    jobs.push(
      fetchJson(`/api/contact-photo?hex=${encodeURIComponent(hex)}`).then((data) => {
        if (!data?.found || !data.url) return;
        out.photoUrl = data.url;
        out.credit = data.photographer
          ? `PHOTO  ·  ${data.photographer}`
          : 'PLANESPOTTERS.NET';
      }),
    );
  }
  await Promise.allSettled(jobs);
  return out;
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) return null;
  return response.json();
}
