/**
 * AIS identity helpers: MMSI flag, nav-status labels, inspect-panel fields.
 * Live feeds often omit IMO/destination; this still shows everything the
 * position report actually carried.
 */

const NAV_STATUS = {
  0: 'UNDER WAY',
  1: 'ANCHORED',
  2: 'NOT UNDER COMMAND',
  3: 'RESTRICTED MANEUVER',
  4: 'CONSTRAINED BY DRAUGHT',
  5: 'MOORED',
  6: 'AGROUND',
  7: 'FISHING',
  8: 'SAILING',
  9: 'RESERVED',
  10: 'RESERVED',
  11: 'TOWING ASTERN',
  12: 'TOWING AHEAD/ALONGSIDE',
  14: 'AIS-SART',
  15: 'NOT DEFINED',
};

/** ITU Maritime Identification Digits → flag state. Common broadcast MIDs. */
const MID_FLAG = {
  201: 'ALBANIA', 202: 'ANDORRA', 203: 'AUSTRIA', 204: 'AZORES', 205: 'BELGIUM',
  206: 'BELARUS', 207: 'BULGARIA', 208: 'VATICAN', 209: 'CYPRUS', 210: 'CYPRUS',
  211: 'GERMANY', 212: 'CYPRUS', 213: 'GEORGIA', 214: 'MOLDOVA', 215: 'MALTA',
  216: 'ARMENIA', 218: 'GERMANY', 219: 'DENMARK', 220: 'DENMARK',
  224: 'SPAIN', 225: 'SPAIN', 226: 'FRANCE', 227: 'FRANCE', 228: 'FRANCE',
  230: 'FINLAND', 231: 'FAROE ISLANDS', 232: 'UNITED KINGDOM', 233: 'UNITED KINGDOM',
  234: 'UNITED KINGDOM', 235: 'UNITED KINGDOM', 236: 'GIBRALTAR', 237: 'GREECE',
  238: 'CROATIA', 239: 'GREECE', 240: 'GREECE', 241: 'GREECE', 242: 'MOROCCO',
  243: 'HUNGARY', 244: 'NETHERLANDS', 245: 'NETHERLANDS', 246: 'NETHERLANDS',
  247: 'ITALY', 248: 'MALTA', 249: 'MALTA', 250: 'IRELAND', 251: 'ICELAND',
  252: 'LIECHTENSTEIN', 253: 'LUXEMBOURG', 254: 'MONACO', 255: 'MADEIRA',
  256: 'MALTA', 257: 'NORWAY', 258: 'NORWAY', 259: 'NORWAY',
  261: 'POLAND', 262: 'MONTENEGRO', 263: 'PORTUGAL', 264: 'ROMANIA',
  265: 'SWEDEN', 266: 'SWEDEN', 267: 'SLOVAKIA', 268: 'SAN MARINO',
  269: 'SWITZERLAND', 270: 'CZECHIA', 271: 'TURKEY', 272: 'UKRAINE',
  273: 'RUSSIA', 274: 'MACEDONIA', 275: 'LATVIA', 276: 'ESTONIA', 277: 'LITHUANIA',
  278: 'SLOVENIA', 279: 'SERBIA',
  301: 'ANGUILLA', 303: 'ALASKA', 304: 'ANTIGUA', 305: 'ANTIGUA',
  306: 'CURACAO', 307: 'ARUBA', 308: 'BAHAMAS', 309: 'BAHAMAS', 310: 'BERMUDA',
  311: 'BAHAMAS', 312: 'BELIZE', 314: 'BARBADOS', 316: 'CANADA',
  319: 'CAYMAN ISLANDS', 321: 'COSTA RICA', 323: 'CUBA', 325: 'DOMINICA',
  327: 'DOMINICAN REPUBLIC', 329: 'GUADELOUPE', 330: 'GRENADA', 331: 'GREENLAND',
  332: 'GUATEMALA', 334: 'HONDURAS', 336: 'HAITI', 338: 'UNITED STATES',
  339: 'JAMAICA', 341: 'ST KITTS', 343: 'ST LUCIA', 345: 'MEXICO',
  347: 'MARTINIQUE', 348: 'MONTSERRAT', 350: 'NICARAGUA', 351: 'PANAMA',
  352: 'PANAMA', 353: 'PANAMA', 354: 'PANAMA', 355: 'PANAMA', 356: 'PANAMA',
  357: 'PANAMA', 358: 'PUERTO RICO', 359: 'EL SALVADOR', 361: 'ST PIERRE',
  362: 'TRINIDAD', 364: 'TURKS AND CAICOS', 366: 'UNITED STATES',
  367: 'UNITED STATES', 368: 'UNITED STATES', 369: 'UNITED STATES',
  370: 'PANAMA', 371: 'PANAMA', 372: 'PANAMA', 373: 'PANAMA', 374: 'PANAMA',
  375: 'ST VINCENT', 376: 'ST VINCENT', 377: 'ST VINCENT', 378: 'BVI', 379: 'USVI',
  401: 'AFGHANISTAN', 403: 'SAUDI ARABIA', 405: 'BANGLADESH', 408: 'BAHRAIN',
  410: 'BHUTAN', 412: 'CHINA', 413: 'CHINA', 414: 'CHINA', 416: 'TAIWAN',
  417: 'SRI LANKA', 419: 'INDIA', 422: 'IRAN', 423: 'AZERBAIJAN', 425: 'IRAQ',
  428: 'ISRAEL', 431: 'JAPAN', 432: 'JAPAN', 434: 'TURKMENISTAN', 436: 'KAZAKHSTAN',
  437: 'UZBEKISTAN', 438: 'JORDAN', 440: 'SOUTH KOREA', 441: 'SOUTH KOREA',
  443: 'PALESTINE', 445: 'NORTH KOREA', 447: 'KUWAIT', 450: 'LEBANON',
  451: 'KYRGYZSTAN', 453: 'MACAO', 455: 'MALDIVES', 457: 'MONGOLIA',
  459: 'NEPAL', 461: 'OMAN', 463: 'PAKISTAN', 466: 'QATAR', 468: 'SYRIA',
  470: 'UAE', 471: 'UAE', 472: 'TAJIKISTAN', 473: 'YEMEN', 475: 'YEMEN',
  477: 'HONG KONG', 478: 'BOSNIA',
  501: 'ADELIE LAND', 503: 'AUSTRALIA', 506: 'MYANMAR', 508: 'BRUNEI',
  510: 'MICRONESIA', 511: 'PALAU', 512: 'NEW ZEALAND', 514: 'CAMBODIA',
  515: 'CAMBODIA', 516: 'CHRISTMAS ISLAND', 518: 'COOK ISLANDS', 520: 'FIJI',
  523: 'COCOS ISLANDS', 525: 'INDONESIA', 529: 'KIRIBATI', 531: 'LAOS',
  533: 'MALAYSIA', 536: 'N MARIANAS', 538: 'MARSHALL ISLANDS', 540: 'NEW CALEDONIA',
  542: 'NIUE', 544: 'NAURU', 546: 'FRENCH POLYNESIA', 548: 'PHILIPPINES',
  553: 'PAPUA NEW GUINEA', 555: 'PITCAIRN', 557: 'SOLOMON ISLANDS',
  559: 'AMERICAN SAMOA', 561: 'SAMOA', 563: 'SINGAPORE', 564: 'SINGAPORE',
  565: 'SINGAPORE', 566: 'SINGAPORE', 567: 'THAILAND', 570: 'TONGA',
  572: 'TUVALU', 574: 'VIETNAM', 576: 'VANUATU', 577: 'VANUATU', 578: 'WALLIS',
  601: 'SOUTH AFRICA', 603: 'ANGOLA', 605: 'ALGERIA', 607: 'ST PAUL ISLAND',
  608: 'ASCENSION', 609: 'BURUNDI', 610: 'BENIN', 611: 'BOTSWANA',
  612: 'CENTRAL AFRICAN REP', 613: 'CAMEROON', 615: 'CONGO', 616: 'COMOROS',
  617: 'CAPE VERDE', 618: 'ANTARCTICA', 619: "COTE D'IVOIRE", 620: 'COMOROS',
  621: 'DJIBOUTI', 622: 'EGYPT', 624: 'ETHIOPIA', 625: 'ERITREA', 626: 'GABON',
  627: 'GHANA', 629: 'GAMBIA', 630: 'GUINEA-BISSAU', 631: 'EQUATORIAL GUINEA',
  632: 'GUINEA', 633: 'BURKINA FASO', 634: 'KENYA', 635: 'KENYA', 636: 'LIBERIA',
  637: 'LIBERIA', 638: 'SOUTH SUDAN', 642: 'LIBYA', 644: 'LESOTHO', 645: 'MAURITIUS',
  647: 'MADAGASCAR', 649: 'MALI', 650: 'MOZAMBIQUE', 654: 'MAURITANIA',
  655: 'MALAWI', 656: 'NIGER', 657: 'NIGERIA', 659: 'NAMIBIA', 660: 'REUNION',
  661: 'RWANDA', 662: 'SUDAN', 663: 'SENEGAL', 664: 'SEYCHELLES', 665: 'ST HELENA',
  666: 'SOMALIA', 667: 'SIERRA LEONE', 668: 'SAO TOME', 669: 'ESWATINI',
  670: 'CHAD', 671: 'TOGO', 672: 'TUNISIA', 674: 'TANZANIA', 675: 'UGANDA',
  676: 'DR CONGO', 677: 'TANZANIA', 678: 'ZAMBIA', 679: 'ZIMBABWE',
  701: 'ARGENTINA', 710: 'BRAZIL', 720: 'BOLIVIA', 725: 'CHILE', 730: 'COLOMBIA',
  735: 'ECUADOR', 740: 'FALKLANDS', 745: 'GUIANA', 750: 'GUYANA', 755: 'PARAGUAY',
  760: 'PERU', 765: 'SURINAME', 770: 'URUGUAY', 775: 'VENEZUELA',
};

/** Country name → ISO 3166-1 alpha-2, for logging fleets by origin state. */
const COUNTRY_ISO = {
  ALBANIA: 'AL', ANDORRA: 'AD', AUSTRIA: 'AT', AZORES: 'PT', BELGIUM: 'BE',
  BELARUS: 'BY', BULGARIA: 'BG', VATICAN: 'VA', CYPRUS: 'CY', GERMANY: 'DE',
  GEORGIA: 'GE', MOLDOVA: 'MD', MALTA: 'MT', ARMENIA: 'AM', DENMARK: 'DK',
  SPAIN: 'ES', FRANCE: 'FR', FINLAND: 'FI', 'FAROE ISLANDS': 'FO',
  'UNITED KINGDOM': 'GB', GIBRALTAR: 'GI', GREECE: 'GR', CROATIA: 'HR',
  MOROCCO: 'MA', HUNGARY: 'HU', NETHERLANDS: 'NL', ITALY: 'IT', IRELAND: 'IE',
  ICELAND: 'IS', LIECHTENSTEIN: 'LI', LUXEMBOURG: 'LU', MONACO: 'MC',
  MADEIRA: 'PT', NORWAY: 'NO', POLAND: 'PL', MONTENEGRO: 'ME', PORTUGAL: 'PT',
  ROMANIA: 'RO', SWEDEN: 'SE', SLOVAKIA: 'SK', 'SAN MARINO': 'SM',
  SWITZERLAND: 'CH', CZECHIA: 'CZ', TURKEY: 'TR', UKRAINE: 'UA', RUSSIA: 'RU',
  MACEDONIA: 'MK', LATVIA: 'LV', ESTONIA: 'EE', LITHUANIA: 'LT', SLOVENIA: 'SI',
  SERBIA: 'RS', ANGUILLA: 'AI', ALASKA: 'US', ANTIGUA: 'AG', CURACAO: 'CW',
  ARUBA: 'AW', BAHAMAS: 'BS', BERMUDA: 'BM', BELIZE: 'BZ', BARBADOS: 'BB',
  CANADA: 'CA', 'CAYMAN ISLANDS': 'KY', 'COSTA RICA': 'CR', CUBA: 'CU',
  DOMINICA: 'DM', 'DOMINICAN REPUBLIC': 'DO', GUADELOUPE: 'GP', GRENADA: 'GD',
  GREENLAND: 'GL', GUATEMALA: 'GT', HONDURAS: 'HN', HAITI: 'HT',
  'UNITED STATES': 'US', JAMAICA: 'JM', 'ST KITTS': 'KN', 'ST LUCIA': 'LC',
  MEXICO: 'MX', MARTINIQUE: 'MQ', MONTSERRAT: 'MS', NICARAGUA: 'NI',
  PANAMA: 'PA', 'PUERTO RICO': 'PR', 'EL SALVADOR': 'SV', 'ST PIERRE': 'PM',
  TRINIDAD: 'TT', 'TURKS AND CAICOS': 'TC', 'ST VINCENT': 'VC', BVI: 'VG',
  USVI: 'VI', AFGHANISTAN: 'AF', 'SAUDI ARABIA': 'SA', BANGLADESH: 'BD',
  BAHRAIN: 'BH', BHUTAN: 'BT', CHINA: 'CN', TAIWAN: 'TW', 'SRI LANKA': 'LK',
  INDIA: 'IN', IRAN: 'IR', AZERBAIJAN: 'AZ', IRAQ: 'IQ', ISRAEL: 'IL',
  JAPAN: 'JP', TURKMENISTAN: 'TM', KAZAKHSTAN: 'KZ', UZBEKISTAN: 'UZ',
  JORDAN: 'JO', 'SOUTH KOREA': 'KR', PALESTINE: 'PS', 'NORTH KOREA': 'KP',
  KUWAIT: 'KW', LEBANON: 'LB', KYRGYZSTAN: 'KG', MACAO: 'MO', MALDIVES: 'MV',
  MONGOLIA: 'MN', NEPAL: 'NP', OMAN: 'OM', PAKISTAN: 'PK', QATAR: 'QA',
  SYRIA: 'SY', UAE: 'AE', TAJIKISTAN: 'TJ', YEMEN: 'YE', 'HONG KONG': 'HK',
  BOSNIA: 'BA', 'ADELIE LAND': 'TF', AUSTRALIA: 'AU', MYANMAR: 'MM',
  BRUNEI: 'BN', MICRONESIA: 'FM', PALAU: 'PW', 'NEW ZEALAND': 'NZ',
  CAMBODIA: 'KH', 'CHRISTMAS ISLAND': 'CX', 'COOK ISLANDS': 'CK', FIJI: 'FJ',
  'COCOS ISLANDS': 'CC', INDONESIA: 'ID', KIRIBATI: 'KI', LAOS: 'LA',
  MALAYSIA: 'MY', 'N MARIANAS': 'MP', 'MARSHALL ISLANDS': 'MH',
  'NEW CALEDONIA': 'NC', NIUE: 'NU', NAURU: 'NR', 'FRENCH POLYNESIA': 'PF',
  PHILIPPINES: 'PH', 'PAPUA NEW GUINEA': 'PG', PITCAIRN: 'PN',
  'SOLOMON ISLANDS': 'SB', 'AMERICAN SAMOA': 'AS', SAMOA: 'WS',
  SINGAPORE: 'SG', THAILAND: 'TH', TONGA: 'TO', TUVALU: 'TV', VIETNAM: 'VN',
  VANUATU: 'VU', WALLIS: 'WF', 'SOUTH AFRICA': 'ZA', ANGOLA: 'AO',
  ALGERIA: 'DZ', 'ST PAUL ISLAND': 'TF', ASCENSION: 'SH', BURUNDI: 'BI',
  BENIN: 'BJ', BOTSWANA: 'BW', 'CENTRAL AFRICAN REP': 'CF', CAMEROON: 'CM',
  CONGO: 'CG', COMOROS: 'KM', 'CAPE VERDE': 'CV', ANTARCTICA: 'AQ',
  "COTE D'IVOIRE": 'CI', DJIBOUTI: 'DJ', EGYPT: 'EG', ETHIOPIA: 'ET',
  ERITREA: 'ER', GABON: 'GA', GHANA: 'GH', GAMBIA: 'GM', 'GUINEA-BISSAU': 'GW',
  'EQUATORIAL GUINEA': 'GQ', GUINEA: 'GN', 'BURKINA FASO': 'BF', KENYA: 'KE',
  LIBERIA: 'LR', 'SOUTH SUDAN': 'SS', LIBYA: 'LY', LESOTHO: 'LS',
  MAURITIUS: 'MU', MADAGASCAR: 'MG', MALI: 'ML', MOZAMBIQUE: 'MZ',
  MAURITANIA: 'MR', MALAWI: 'MW', NIGER: 'NE', NIGERIA: 'NG', NAMIBIA: 'NA',
  REUNION: 'RE', RWANDA: 'RW', SUDAN: 'SD', SENEGAL: 'SN', SEYCHELLES: 'SC',
  'ST HELENA': 'SH', SOMALIA: 'SO', 'SIERRA LEONE': 'SL', 'SAO TOME': 'ST',
  ESWATINI: 'SZ', CHAD: 'TD', TOGO: 'TG', TUNISIA: 'TN', TANZANIA: 'TZ',
  UGANDA: 'UG', 'DR CONGO': 'CD', ZAMBIA: 'ZM', ZIMBABWE: 'ZW',
  ARGENTINA: 'AR', BRAZIL: 'BR', BOLIVIA: 'BO', CHILE: 'CL', COLOMBIA: 'CO',
  ECUADOR: 'EC', FALKLANDS: 'FK', GUIANA: 'GF', GUYANA: 'GY', PARAGUAY: 'PY',
  PERU: 'PE', SURINAME: 'SR', URUGUAY: 'UY', VENEZUELA: 'VE',
};

export function midFromMmsi(mmsi) {
  const digits = String(mmsi || '').replace(/\D/g, '');
  if (digits.length < 3) return '';
  const mid = Number(digits.slice(0, 3));
  return Number.isFinite(mid) ? String(mid) : '';
}

export function flagFromMmsi(mmsi) {
  const mid = Number(midFromMmsi(mmsi));
  if (!Number.isFinite(mid) || !mid) return '';
  return MID_FLAG[mid] || `MID ${mid}`;
}

export function isoFromMmsi(mmsi) {
  const name = flagFromMmsi(mmsi);
  if (!name || name.startsWith('MID ')) return '';
  return COUNTRY_ISO[name] || '';
}

export function navStatusLabel(code) {
  if (code === null || code === undefined || code === '') return '';
  const number = Number(code);
  if (!Number.isFinite(number)) return String(code).trim().toUpperCase();
  return NAV_STATUS[number] || `STATUS ${number}`;
}

export function isMilitaryVesselType(type) {
  const text = String(type || '').trim();
  if (!text) return false;
  if (text === '35') return true;
  return /military|warship|naval|navy|frigate|destroyer|submarine|corvette/i.test(text);
}

function present(value) {
  const text = String(value ?? '').trim();
  if (!text || text.toUpperCase() === 'UNKNOWN') return '';
  return text;
}

function formatReportTime(iso) {
  const text = String(iso || '').trim();
  if (!text) return '';
  const epoch = Date.parse(text);
  if (!Number.isFinite(epoch)) return text.toUpperCase();
  return `${new Date(epoch).toISOString().replace('T', ' ').slice(0, 19)} UTC`;
}

function field(label, value) {
  const text = present(value);
  return text ? { label, value: text.toUpperCase() } : null;
}

/**
 * Inspect-panel model from a live AIS record. Omits empty voyage fields
 * instead of padding the dossier with UNKNOWN.
 * Origin country is the AIS flag state (country of registry encoded in the
 * MMSI MID). AIS does not carry shipyard / country of construction.
 * @param {object} record
 * @param {{normalizeType?: (type: string) => string, positionText?: string}} [options]
 */
export function vesselInspectModel(record, options = {}) {
  const normalizeType = typeof options.normalizeType === 'function'
    ? options.normalizeType
    : (type) => type;
  const type = present(normalizeType(record?.type) || record?.type) || 'VESSEL';
  const military = isMilitaryVesselType(record?.type) || isMilitaryVesselType(type);
  const flag = flagFromMmsi(record?.mmsi);
  const countryCode = isoFromMmsi(record?.mmsi);
  const mid = midFromMmsi(record?.mmsi);
  const status = navStatusLabel(record?.navStatus);
  const heading = record?.heading ?? record?.course;
  const origin = flag || 'UNKNOWN';
  const destination = present(record?.destination)
    || status
    || present(formatReportTime(record?.lastPositionUtc))
    || 'UNKNOWN';
  const fields = [
    field('MMSI', record?.mmsi),
    field('ORIGIN COUNTRY', flag),
    field('COUNTRY CODE', countryCode),
    field('MID', mid),
    field('IMO', record?.imo),
    field('CALLSIGN', record?.callsign),
    field('CLASS', type),
    field('KIND', record?.kind && String(record.kind).toLowerCase() !== 'vessel' ? record.kind : ''),
    field('NAV STATUS', status),
    field('SPEED', Number.isFinite(Number(record?.speed)) ? `${Math.round(Number(record.speed))} KT` : ''),
    field('COURSE', Number.isFinite(Number(record?.course)) ? `${Math.round(Number(record.course))}°` : ''),
    field('HEADING', Number.isFinite(Number(heading)) ? `${Math.round(Number(heading))}°` : ''),
    field('POSITION', options.positionText),
    field('BOUND FOR', record?.destination),
    field('LAST REPORT', formatReportTime(record?.lastPositionUtc)),
    field('SOURCE', record?.source),
    field('STATION', record?.station),
  ].filter(Boolean);

  return {
    classification: military ? 'MILITARY VESSEL' : 'SURFACE VESSEL',
    originLabel: 'ORIGIN COUNTRY',
    destinationLabel: present(record?.destination) ? 'BOUND FOR' : (status ? 'STATUS' : 'LAST REPORT'),
    origin,
    destination,
    country: flag,
    countryCode,
    mid,
    fields,
  };
}
