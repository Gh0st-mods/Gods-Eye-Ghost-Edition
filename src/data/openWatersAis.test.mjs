import test from 'node:test';
import assert from 'node:assert/strict';
import {
  bboxFromAnchor,
  bboxFromView,
  formatOpenWatersBbox,
  normalizeOpenWatersCollection,
  OPENWATERS_DEFAULT_LAT,
  OPENWATERS_DEFAULT_LON,
} from './openWatersAis.js';

test('bbox around London stays a local live-AIS window', () => {
  const bbox = bboxFromAnchor(OPENWATERS_DEFAULT_LAT, OPENWATERS_DEFAULT_LON, 3.5);
  assert.ok(bbox.minLat < OPENWATERS_DEFAULT_LAT);
  assert.ok(bbox.maxLat > OPENWATERS_DEFAULT_LAT);
  assert.ok(bbox.maxLat - bbox.minLat <= 8);
  assert.ok(bbox.minLon < OPENWATERS_DEFAULT_LON);
  assert.ok(bbox.maxLon > OPENWATERS_DEFAULT_LON);
  const formatted = formatOpenWatersBbox(bbox);
  assert.match(formatted, /49\.\d+,/);
  assert.match(formatted, /,53\.\d+,/);
});

test('bbox from a view rectangle keeps west/south/east/north order', () => {
  const bbox = bboxFromView(-6, 48, 2, 52);
  assert.equal(bbox.minLon, -6);
  assert.equal(bbox.minLat, 48);
  assert.equal(bbox.maxLon, 2);
  assert.equal(bbox.maxLat, 52);
});

test('normalizes Open Waters GeoJSON into AIS live rows', () => {
  const rows = normalizeOpenWatersCollection({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: 232009347,
        geometry: { type: 'Point', coordinates: [0.53, 51.41] },
        properties: {
          mmsi: 232009347,
          name: 'GPS VINCIA',
          sog: 0,
          cog: 131.6,
          heading: 352,
          type: 52,
          nav_status: 0,
          source: 'kystverket',
          seen: '2026-08-25T11:30:19Z',
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: ['bad', 51] },
        properties: { mmsi: 1 },
      },
    ],
  });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].mmsi, '232009347');
  assert.equal(rows[0].name, 'GPS VINCIA');
  assert.equal(rows[0].lat, 51.41);
  assert.equal(rows[0].lon, 0.53);
  assert.equal(rows[0].speed, 0);
  assert.equal(rows[0].heading, 352);
  assert.equal(rows[0].navStatus, 0);
  assert.equal(rows[0].source, 'kystverket');
  assert.equal(rows[0].last_position_epoch, Date.parse('2026-08-25T11:30:19Z') / 1000);
});
