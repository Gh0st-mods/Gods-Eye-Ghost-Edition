import test from 'node:test';
import assert from 'node:assert/strict';
import {
  flagFromMmsi,
  isoFromMmsi,
  isMilitaryVesselType,
  midFromMmsi,
  navStatusLabel,
  vesselInspectModel,
} from './aisIdentity.js';

test('MMSI MID 257/259 maps to Norway', () => {
  assert.equal(flagFromMmsi('257123456'), 'NORWAY');
  assert.equal(flagFromMmsi('259019000'), 'NORWAY');
  assert.equal(isoFromMmsi('259019000'), 'NO');
  assert.equal(midFromMmsi('259019000'), '259');
});

test('MMSI MID maps origin country ISO for logging', () => {
  assert.equal(flagFromMmsi('232000001'), 'UNITED KINGDOM');
  assert.equal(isoFromMmsi('232000001'), 'GB');
  assert.equal(isoFromMmsi('338123456'), 'US');
  assert.equal(isoFromMmsi('227000001'), 'FR');
  assert.equal(isoFromMmsi('999000001'), '');
});

test('nav status 0 is under way', () => {
  assert.equal(navStatusLabel(0), 'UNDER WAY');
  assert.equal(navStatusLabel('5'), 'MOORED');
});

test('AIS type 35 is military', () => {
  assert.equal(isMilitaryVesselType('35'), true);
  assert.equal(isMilitaryVesselType('MILITARY'), true);
  assert.equal(isMilitaryVesselType('70'), false);
});

test('inspect model keeps AIS kinematics and drops empty IMO/destination', () => {
  const model = vesselInspectModel({
    mmsi: '259019000',
    name: 'KNM OTTO SVERDRUP',
    type: '35',
    speed: 12.4,
    course: 210,
    heading: 208,
    navStatus: 0,
    lastPositionUtc: '2026-08-25T12:00:00Z',
    source: 'kystverket',
  }, {
    normalizeType: (type) => (type === '35' ? 'MILITARY' : type),
    positionText: '59.1234°N  10.4321°E',
  });
  assert.equal(model.classification, 'MILITARY VESSEL');
  assert.equal(model.origin, 'NORWAY');
  assert.equal(model.originLabel, 'ORIGIN COUNTRY');
  assert.equal(model.countryCode, 'NO');
  assert.equal(model.mid, '259');
  assert.equal(model.destinationLabel, 'STATUS');
  assert.equal(model.destination, 'UNDER WAY');
  assert.deepEqual(model.fields.map((row) => row.label), [
    'MMSI', 'ORIGIN COUNTRY', 'COUNTRY CODE', 'MID', 'CLASS', 'NAV STATUS',
    'SPEED', 'COURSE', 'HEADING', 'POSITION', 'LAST REPORT', 'SOURCE',
  ]);
  assert.equal(model.fields.some((row) => row.label === 'IMO'), false);
  assert.equal(model.fields.some((row) => row.value === 'UNKNOWN'), false);
});
