/**
 * Keyless live AIS snapshot from Open Waters (ais.openwaters.io).
 * Used when AISSTREAM_API_KEY is not set so the vessel layer still shows
 * real positions instead of UNAVAILABLE.
 */

/** Default camera anchor when a view rectangle is not sent (central London). */
export const OPENWATERS_DEFAULT_LAT = 51.5074;
export const OPENWATERS_DEFAULT_LON = -0.1278;
/** Half-span of a fallback request box, degrees. */
export const OPENWATERS_DEFAULT_SPAN_DEG = 8;
/** Hard cap for a single fallback box. */
export const OPENWATERS_MAX_SPAN_DEG = 40;

/**
 * Build a minLat,minLon,maxLat,maxLon box around an anchor.
 * @param {number} latitude
 * @param {number} longitude
 * @param {number} [spanDeg]
 * @returns {{minLat:number,minLon:number,maxLat:number,maxLon:number}}
 */
export function bboxFromAnchor(latitude, longitude, spanDeg = OPENWATERS_DEFAULT_SPAN_DEG) {
  const lat = clamp(latitude, -90, 90);
  const lon = wrapLon(longitude);
  const span = clamp(spanDeg, 0.25, OPENWATERS_MAX_SPAN_DEG);
  const latPad = span / 2;
  const lonPad = span / (2 * Math.max(0.2, Math.cos((lat * Math.PI) / 180)));
  return {
    minLat: clamp(lat - latPad, -90, 90),
    maxLat: clamp(lat + latPad, -90, 90),
    minLon: wrapLon(lon - lonPad),
    maxLon: wrapLon(lon + lonPad),
  };
}

/**
 * Visible-globe rectangle from Cesium, as an Open Waters bbox.
 * @param {number} west
 * @param {number} south
 * @param {number} east
 * @param {number} north
 * @returns {{minLat:number,minLon:number,maxLat:number,maxLon:number}}
 */
export function bboxFromView(west, south, east, north) {
  const minLat = clamp(Math.min(south, north), -90, 90);
  const maxLat = clamp(Math.max(south, north), -90, 90);
  return {
    minLat,
    maxLat,
    minLon: wrapLon(west),
    maxLon: wrapLon(east),
  };
}

/**
 * Query-string form expected by ais.openwaters.io.
 * @param {{minLat:number,minLon:number,maxLat:number,maxLon:number}} bbox
 * @returns {string}
 */
export function formatOpenWatersBbox(bbox) {
  return `${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon}`;
}

/**
 * Convert an Open Waters GeoJSON FeatureCollection into AIS live rows.
 * @param {object} payload
 * @returns {Array<object>}
 */
export function normalizeOpenWatersCollection(payload) {
  const features = Array.isArray(payload?.features) ? payload.features : [];
  const rows = [];
  const seen = new Set();
  for (const feature of features) {
    const row = normalizeOpenWatersFeature(feature);
    if (!row || seen.has(row.mmsi)) continue;
    seen.add(row.mmsi);
    rows.push(row);
  }
  return rows;
}

function normalizeOpenWatersFeature(feature) {
  const coords = feature?.geometry?.coordinates;
  const lon = Number(Array.isArray(coords) ? coords[0] : NaN);
  const lat = Number(Array.isArray(coords) ? coords[1] : NaN);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  const props = feature?.properties && typeof feature.properties === 'object'
    ? feature.properties
    : {};
  const mmsi = String(props.mmsi ?? feature?.id ?? '').trim();
  if (!mmsi) return null;
  const seen = String(props.seen || '').trim();
  const epoch = Date.parse(seen);
  return {
    lat,
    lon,
    mmsi,
    name: String(props.name || '').trim() || `MMSI ${mmsi}`,
    type: String(props.type ?? ''),
    kind: String(props.kind || ''),
    speed: finiteNumber(props.sog),
    course: finiteNumber(props.cog),
    heading: finiteNumber(props.heading),
    navStatus: finiteNumber(props.nav_status),
    destination: String(props.destination || '').trim(),
    imo: String(props.imo || props.IMO || '').trim(),
    callsign: String(props.callsign || props.call_sign || '').trim(),
    source: String(props.source || '').trim(),
    station: String(props.station || '').trim(),
    last_position_UTC: seen,
    last_position_epoch: Number.isFinite(epoch) ? Math.floor(epoch / 1000) : null,
  };
}

function finiteNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function wrapLon(value) {
  let lon = Number(value);
  if (!Number.isFinite(lon)) return 0;
  while (lon < -180) lon += 360;
  while (lon > 180) lon -= 360;
  return lon;
}
