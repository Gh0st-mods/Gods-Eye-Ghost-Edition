import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INSPECT_CONTACT_EVENT,
  inspectContact,
  closeInspectContact,
  formatAirport,
  formatCoord,
  formatKnotsFromMps,
  formatFeetFromMeters,
} from './inspectDossier.js';

test('airport labels prefer code plus city', () => {
  assert.equal(formatAirport({ code: 'LHR', name: 'London' }), 'LHR  ·  LONDON');
  assert.equal(formatAirport(null), 'UNKNOWN');
});

test('inspectContact dispatches without requiring a DOM panel', () => {
  const target = new EventTarget();
  const seen = [];
  target.addEventListener(INSPECT_CONTACT_EVENT, (event) => seen.push(event.detail));
  assert.equal(inspectContact({ kind: 'aircraft', id: 'abc123', title: 'BAW12' }, target), true);
  assert.equal(seen[0].id, 'abc123');
  assert.equal(closeInspectContact(target), true);
});

test('kinematics formatters stay honest on missing numbers', () => {
  assert.equal(formatKnotsFromMps(null), 'UNKNOWN');
  assert.equal(formatFeetFromMeters(null), 'UNKNOWN');
  assert.equal(formatCoord(51.54, 0.71).includes('51.5400'), true);
});
