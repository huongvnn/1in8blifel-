// Authentic 1in8b.life Pixel Art Rendering Engine
// Faithfully reconstructed from 1in8b.life core graphics system

export const PX = { W: 192, H: 60, G: 48 };

export const PX_PAL = {
  light: {
    sky: {
      m: ['#A9D8E8', '#F6E9D2'],
      d: ['#8FCFE3', '#E8F2EC'],
      e: ['#D7A79E', '#F4D29A']
    },
    sun: '#FFE39A', sunhi: '#FFF7DC', star: null,
    cloud: '#FFFFFF', cloudsh: '#D6E4EC', cloudlow: '#BCC6CA', cloudlowsh: '#9DA9AE',
    far1: '#BCD7E0', far2: '#A3C3CD', hill1: '#B3D3C2', hill2: '#93BEA3',
    grass: '#8CC07A', grass2: '#5E9A5E', grasshi: '#B6DB8F', soil: '#7E6858', soil2: '#5F4D42', stone: '#A2917F',
    pave: '#CDD0C8', pave2: '#A9ADA6', road: '#6E7479', roadline: '#DDD6C6', sand: '#ECD5A2', sand2: '#D3B47E',
    water: '#6FB7CF', water2: '#B4E2EE',
    wall: '#F3EEE3', wall2: '#D5D9D3', wall3: '#AEB6B1', roof: '#C25550', roof2: '#953D3B', thatch: '#CBA968', thatch2: '#A6864A', mud: '#BB906A', brick: '#A86B4E',
    win: '#7FA9BA', winlit: '#F2C76E', ol: '#3B4046', tree: '#6FA766', tree2: '#4E8550', treehi: '#9DCD80', trunk: '#7A5A43',
    skin: '#CF9F7C', sk0: '#F2CDB0', sk1: '#E2B48F', sk2: '#CF9F7C', sk3: '#B07C58', sk4: '#8A583A', sk5: '#5E3A25',
    hair: '#3F3530', hairold: '#DDDAD3', pants: '#4F5661', me: '#1F8A80', pt: '#6C8091', kid: '#E2A33A', par: '#9AA8AE', sib: '#9A86C8', inlaw: '#B07A86',
    metal: '#8E979C', crane: '#E8B33A', smoke: '#A7AEB1', accent: '#BE4A52', stamp: '#2C8C82', gold: '#E2AE45', lit: false
  },
  dark: {
    sky: {
      m: ['#1F2E45', '#3A3F52'],
      d: ['#17283A', '#2C3F49'],
      e: ['#2A2238', '#4B3838']
    },
    sun: '#E8D7A0', sunhi: '#FFF4CF', star: '#C9D3DA',
    cloud: '#4A5A64', cloudsh: '#3A4851', cloudlow: '#3A444A', cloudlowsh: '#2E363B',
    far1: '#2B3D48', far2: '#22323C', hill1: '#25382F', hill2: '#1E3029',
    grass: '#2F4B36', grass2: '#22382A', grasshi: '#3F6146', soil: '#2E2621', soil2: '#211B17', stone: '#40362F',
    pave: '#3A3F42', pave2: '#2E3336', road: '#262B30', roadline: '#6B6A60', sand: '#4A4030', sand2: '#3A3226',
    water: '#1F4554', water2: '#3A7A8E',
    wall: '#4B545A', wall2: '#3D464C', wall3: '#333B40', roof: '#7A3638', roof2: '#5A282A', thatch: '#6E5B3B', thatch2: '#574730', mud: '#5E4835', brick: '#5E3E30',
    win: '#2C3D47', winlit: '#F0C35E', ol: '#0D1114', tree: '#2F5A3E', tree2: '#224530', treehi: '#3F7350', trunk: '#4A3828',
    skin: '#A9876D', sk0: '#C6AE9B', sk1: '#B9997E', sk2: '#A9876D', sk3: '#90694D', sk4: '#714B33', sk5: '#4D3121',
    hair: '#1F1A17', hairold: '#A9A6A0', pants: '#2B3036', me: '#4CC0AF', pt: '#8C9DA3', kid: '#D9AF59', par: '#66777B', sib: '#9C8CC9', inlaw: '#B58A94',
    metal: '#5E676C', crane: '#B8902F', smoke: '#4A5357', accent: '#E2678A', stamp: '#4CC0AF', gold: '#D9AF59', lit: true
  }
};

export const pxRGB = h => {
  if (!h || typeof h !== 'string' || !h.startsWith('#')) return [128, 128, 128];
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const pxMix = (a, b, t) => {
  const c1 = Array.isArray(a) ? a : pxRGB(a);
  const c2 = Array.isArray(b) ? b : pxRGB(b);
  return c1.map((v, i) => Math.round(v + (c2[i] - v) * t));
};

export const PX_BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);

export function pxPalette(forceDark = false) {
  const src = PX_PAL[forceDark ? 'dark' : 'light'];
  const P = { dark: forceDark };
  for (const [k, v] of Object.entries(src)) {
    P[k] = typeof v === 'string' && v.startsWith('#') ? pxRGB(v) : v;
  }
  P.shade = (c, k) => pxMix(c, P.ol, k);
  P.light = (c, k) => pxMix(c, [255, 255, 255], k);
  return P;
}

export class PxR {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.d = new Array(w * h).fill(null);
  }
  px(x, y, c) {
    x = Math.round(x);
    y = Math.round(y);
    if (c && x >= 0 && y >= 0 && x < this.w && y < this.h) {
      this.d[y * this.w + x] = Array.isArray(c) ? c : pxRGB(c);
    }
  }
  get(x, y) {
    return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.d[y * this.w + x] : null;
  }
  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.px(x + i, y + j, c);
  }
  disc(cx, cy, r, c) {
    for (let j = -r; j <= r; j++) {
      for (let i = -r; i <= r; i++) {
        if (i * i + j * j <= r * r + r * 0.8) this.px(cx + i, cy + j, c);
      }
    }
  }
  line(x0, y0, x1, y1, c) {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let e = dx + dy;
    for (;;) {
      this.px(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * e;
      if (e2 >= dy) { e += dy; x0 += sx; }
      if (e2 <= dx) { e += dx; y0 += sy; }
    }
  }
  dither(x, y, c, t) {
    if (t > PX_BAYER[(y & 3) * 4 + (x & 3)]) this.px(x, y, c);
  }
  blit(s, x, y, ol) {
    for (let j = -1; j <= s.h; j++) {
      for (let i = -1; i <= s.w; i++) {
        const v = s.get(i, j);
        if (v) {
          this.px(x + i, y + j, v);
        } else if (ol && (s.get(i - 1, j) || s.get(i + 1, j) || s.get(i, j - 1) || s.get(i, j + 1))) {
          this.px(x + i, y + j, ol);
        }
      }
    }
  }
}

export function pxSprite(rows, map) {
  const s = new PxR(Math.max(...rows.map(r => r.length)), rows.length);
  rows.forEach((r, y) => {
    for (let x = 0; x < r.length; x++) {
      if (r[x] !== '.' && map[r[x]] != null) s.px(x, y, map[r[x]]);
    }
  });
  return s;
}

// Full Authentic Character Sprite Matrices
export const PX_PEOPLE = {
  M: {
    adult: [
      '..HHHHH..', '.HHHHHHH.', 'HHHHHHHHH', 'HHSSSSHHH', 'HSSSSSSSH', 'SSESSSESS',
      'ScSSSSScS', '.SSSmSSS.', '..SSSSS..', '.BBBBBBB.', 'BBBBBBBBB', 'BbBBBBBbB',
      'SbBBBBBbS', '..PPPPP..', '..PP.PP..', '..PP.PP..', '..FF.FF..'
    ],
    teen: [
      '..HHHHH..', '.HHHHHHH.', 'HHHHHHHHH', 'HHSSSSHHH', 'HSSSSSSSH', 'SSESSSESS',
      'ScSSSSScS', '.SSSmSSS.', '..SSSSS..', '.BBBBBBB.', 'BbBBBBBbB', 'SbBBBBBbS',
      '..PPPPP..', '..PP.PP..', '..PP.PP..', '..FF.FF..'
    ],
    child: [
      '.HHHHH.', 'HHHHHHH', 'HHSSSHH', 'SESSSES', 'ScSSScS',
      '.SSmSS.', '..SSS..', '.BBBBB.', 'BbBBBbB', 'SbBBBbS',
      '.PPPPP.', '.PP.PP.', '.FF.FF.'
    ],
    small: [
      '.HHHHH.', 'HHSSSHH', 'SESSSES', 'ScSmScS',
      '.SSSSS.', '.BBBBB.', 'SBBBBBS', '.PPPPP.', '.PP.PP.', '.FF.FF.'
    ],
    baby: [
      '.HHHH.', 'HSSSSH', 'SESSES', 'ScSScS', '.SSSS.', 'BBBBBB', 'BB..BB'
    ]
  },
  F: {
    adult: [
      '..HHHHH..', '.HHHHHHH.', 'HHHHHHHHH', 'HHSSSSHHH', 'HSSSSSSSH', 'HSESSSESH',
      'HcSSSSScH', 'HHSSmSSHH', 'HHHSSSHHH', 'HBBBBBBBH', 'BBBBBBBBB', 'SbBBBBBbS',
      '.DDDDDDD.', '.DDDDDDD.', 'ddddddddd', '..S...S..', '..F...F..'
    ],
    teen: [
      '..HHHHH..', '.HHHHHHH.', 'HHHHHHHHH', 'HHSSSSHHH', 'HSSSSSSSH', 'HSESSSESH',
      'HcSSSSScH', 'HHSSmSSHH', 'HHHSSSHHH', 'HBBBBBBBH', 'SbBBBBBbS',
      '.DDDDDDD.', 'ddddddddd', '..S...S..', '..F...F..'
    ],
    child: [
      '.HHHHH.', 'HHHHHHH', 'HHSSSHH', 'HESSSEH', 'HcSSScH',
      'HSSmSSH', 'H.SSS.H', '.BBBBB.', 'SbBBBbS', '.DDDDD.', 'ddddddd', '.S...S.', '.F...F.'
    ],
    small: [
      '.HHHHH.', 'HHSSSHH', 'HESSSEH', 'HcSmScH',
      'HSSSSSH', '.BBBBB.', 'SDDDDDS', 'ddddddd', '.S...S.', '.F...F.'
    ],
    baby: [
      '.HHHH.', 'HSSSSH', 'SESSES', 'ScSScS', '.SSSS.', 'BBBBBB', 'BB..BB'
    ]
  }
};

export const PX_PET = {
  d: [
    '..BBB........', '.EBBBB......T', '.EBkBB......T', 'NBBBBB.....T.',
    '..cBBBBBBBBB.', '...BBBBBBBBB.', '...BBwwwwBBB.', '...B.B...B.B.', '...B.B...B.B.'
  ],
  c: [
    'B.B.........', 'BBB........T', 'BkBB.......T', 'NBBB......T.',
    '.BBBBBBBBBT.', '..BBBBBBBB..', '..BBwwwBBB..', '..B.B..B.B..'
  ],
  h: ['.B..B..', 'BBBBBB.', 'BkBBBBB', 'NBBBBBB', '.wwwww.'],
  r: ['.B.....', '.BB....', '.BB....', 'BBBB...', 'kBBBBB.', 'NBBBBBw', '.BBBBBw', '..w..w.'],
  b: ['..BB...', '.BkBB..', 'cBBBBB.', '.BBBww.', '..BBT..', 'yyyyyyy', '...y...', '...y...', '...y...', '..yyy..'],
  f: [
    'GGGGGGGGGG', 'WWWWWWWWWW', 'WWWoWWWWWW', 'WWooWWWpWW', 'WWWoWWWpWW',
    'WWWWWWpWWW', 'ssssssssss', 'GGGGGGGGGG', '.G......G.', '.G......G.'
  ]
};

export const PX_NEWBORN = [
  '..WWWWW..', '.WWHHHWW.', '.WHSSSHW.', '.WSESESW.',
  '.WcSSScW.', '.WWSSSWW.', '.WwWWWwW.', '.WWwWwWW.',
  '.WWWwWWW.', '..WWWWW..', '...WWW...'
];

export function pxPet(k, P) {
  if (!PX_PET[k]) k = 'c';
  if (k === 'f') return pxSprite(PX_PET.f, { G: P.ol, W: P.water2 || P.win, o: P.gold || P.accent, p: P.grass2, s: P.sand });
  const B = k === 'd' ? pxMix(P.trunk, P.sun || P.accent, 0.3)
    : k === 'h' ? pxMix(P.gold || P.sun, P.trunk, 0.35)
    : k === 'b' ? pxMix(P.grass, P.sun || P.accent, 0.25)
    : k === 'r' ? P.light(P.hairold, 0.3)
    : P.hairold;
  const sh = P.shade(B, 0.28);
  return pxSprite(PX_PET[k], {
    B, E: sh, T: B, k: P.ol, N: k === 'b' ? P.gold || P.accent : P.ol,
    w: P.light(B, 0.4), c: k === 'b' ? P.gold || P.accent : P.accent, y: P.trunk
  });
}

export function pxPerson(p, P, ot, anim = {}) {
  const kind = p.age < 3 ? 'baby' : p.age < 7 ? 'small' : p.age < 13 ? 'child' : p.age < 18 ? 'teen' : 'adult';
  const B = p.role === 'me' && ot ? ot[0] : P[p.role] || P.par;
  const low = p.role === 'me' && ot ? ot[1] : P.pants;
  const D = p.sex === 'F' && p.role !== 'me' && p.role !== 'mourn' ? pxMix(B, P.light(B, 0.4), 0.3) : p.sex === 'F' ? B : low;
  const sk = p.sk != null && P['sk' + p.sk] ? P['sk' + p.sk] : P.skin;
  const map = {
    H: p.age >= 65 ? P.hairold : P.hair,
    S: sk,
    E: anim.blink ? sk : P.ol,
    c: pxMix(sk, P.accent, 0.38),
    m: P.shade(pxMix(sk, P.accent, 0.5), 0.2),
    B,
    b: P.shade(B, 0.22),
    P: low,
    D,
    d: P.shade(D, 0.25),
    F: P.ol
  };
  return pxSprite(PX_PEOPLE[p.sex === 'F' ? 'F' : 'M'][kind], map);
}

export function lvRand(seed) {
  let h = 2166136261;
  for (const ch of String(seed || 'seed')) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 100000) / 100000;
  };
}

export const SC_PROP = {
  farm: 'crops', farmhand: 'crops', agbiz: 'crops', herder: 'herd', fisher: 'boat',
  construct: 'crane', miner: 'crane', factory: 'factory', garment: 'factory',
  artisan: 'stall', mechanic: 'stall', electric: 'pole', engineer: 'office',
  vendor: 'stall', domestic: 'laundry', driver: 'truck', delivery: 'moto', shop: 'stall',
  cook: 'stall', care: 'clinic', clerk: 'office', teacher: 'school', nurse: 'clinic',
  police: 'flag', soldier: 'flag', civil: 'office', finance: 'office', dev: 'office',
  doctor: 'clinic', lawyer: 'office', prof: 'school', creator: 'easel', artist: 'easel',
  designer: 'office', owner: 'stall', mp: 'dome', leader: 'dome', astro: 'rocket',
  athlete: 'flag', musician: 'mic', idol: 'mic', homemaker: 'laundry', retired: 'bench',
  student: 'school', seeking: 'sign'
};

export const SKIN_C = {
  e: 'CHN,KOR,PRK,JPN,TWN,HKG,MNG,SGP',
  se: 'VNM,THA,LAO,KHM,MMR,MYS,IDN,PHL,TLS,BRN',
  s: 'IND,PAK,BGD,NPL,LKA,BTN,MDV,MUS',
  ca: 'KAZ,UZB,KGZ,TJK,TKM,AZE,GEO,ARM',
  m: 'TUR,IRN,ISR,AFG',
  c: 'HTI,JAM,DOM,CUB,TTO,GUY,SUR',
  sc: 'ARG,URY,CHL',
  pa: 'PNG,SLB,FJI,VUT',
  ha: 'ETH,ERI,SOM,DJI,SDN',
  n: 'BRA'
};

export function skinForCountry(iso) {
  if (SKIN_C.e.includes(iso)) return 1;
  if (SKIN_C.se.includes(iso)) return 2;
  if (SKIN_C.s.includes(iso)) return 3;
  if (SKIN_C.ha.includes(iso)) return 4;
  if (['NGA', 'GHA', 'KEN', 'ZAF', 'CMR', 'COD'].includes(iso)) return 5;
  if (['FRA', 'DEU', 'GBR', 'ITA', 'USA', 'CAN', 'RUS'].includes(iso)) return 0;
  return 2;
}

export function pxSky(r, m, P, R) {
  const stage = m.stage || 'd';
  const skyPair = P.sky[stage] || P.sky.d;
  const [top, bot] = m.mood === 'low'
    ? skyPair.map(c => pxMix(pxRGB(c), P.cloudlow, 0.35))
    : skyPair.map(pxRGB);
  const bands = [0, 1, 2, 3, 4].map(k => pxMix(top, bot, k / 4));
  for (let y = 0; y < PX.G; y++) {
    const v = (y / (PX.G - 6)) * 4;
    const b = Math.min(3, Math.floor(v));
    const f = Math.min(1, v - b);
    const t = b < 3 ? Math.max(0, (f - 0.7) / 0.3) : 0;
    for (let x = 0; x < PX.W; x++) {
      r.px(x, y, t > PX_BAYER[(y & 3) * 4 + (x & 3)] ? bands[b + 1] : bands[b]);
    }
  }
  if (P.star && m.mood !== 'low') {
    for (let i = 0; i < 14; i++) r.px(R() * PX.W, R() * 22, P.star);
  }
  const [sx, sy, sr] = { m: [30, 14, 4], d: [98, 9, 4], e: [166, 21, 5] }[stage] || [98, 9, 4];
  const sun = m.mood === 'low' ? pxMix(P.sun, P.cloudlow, 0.55) : P.sun;
  r.disc(sx, sy, sr + 2, pxMix(sun, r.get(sx, sy - sr - 3) || sun, 0.6));
  r.disc(sx, sy, sr + 1, pxMix(sun, r.get(sx, sy - sr - 3) || sun, 0.3));
  r.disc(sx, sy, sr, sun);
  r.disc(sx - 1, sy - 1, sr - 2, m.mood === 'low' ? sun : P.sunhi);
}

export function pxCloud(r, cx, by, len, P, R, low) {
  const s = new PxR(len + 8, 14);
  const n = 3 + Math.floor(len / 8);
  const c = low ? P.cloudlow : P.cloud;
  const sh = low ? P.cloudlowsh : P.cloudsh;
  for (let i = 0; i < n; i++) {
    const bx = 4 + ((i + 0.5) * len) / n;
    const br = 2 + Math.round(R() * 2) + (i > 0 && i < n - 1 ? 1 : 0);
    s.disc(bx, 12 - br, br, c);
  }
  s.rect(4, 10, len, 3, c);
  for (let x = 0; x < s.w; x++) {
    if (s.get(x, 12)) s.px(x, 12, sh);
    if (s.get(x, 11) && R() < 0.5) s.px(x, 11, sh);
  }
  r.blit(s, Math.round(cx - s.w / 2), by - 12, null);
}

export function pxBirds(r, P, R) {
  for (let i = 0; i < 3; i++) {
    const x = 60 + R() * 70, y = 6 + R() * 12;
    r.px(x - 1, y - 1, P.ol);
    r.px(x, y, P.ol);
    r.px(x + 1, y - 1, P.ol);
  }
}

export function pxBuilding(r, x, w, h, base, wall, win, R, opt = {}) {
  const top = base - h;
  r.rect(x, top, w, h, wall);
  r.rect(x, top, w, 1, pxMix(wall, [255, 255, 255], 0.12));
  if (opt.step && w > 7) r.rect(x + 2, top - 3, w - 4, 3, wall);
  if (opt.antenna) r.line(x + (w >> 1), top - (opt.step ? 3 : 0) - 5, x + (w >> 1), top - (opt.step ? 3 : 0), wall);
  for (let y = top + 2; y < base - 2; y += 3) {
    for (let i = x + 1; i < x + w - 1; i += 2) {
      if (R() < 0.7) r.px(i, y, opt.lit && R() < 0.4 ? opt.lit : win);
    }
  }
}

export function pxHills(r, P, R, f, base, amp, c, top) {
  const a = R() * 6, b = R() * 6;
  for (let x = 0; x < PX.W; x++) {
    const y = Math.round(base - amp * (0.6 + 0.4 * Math.sin(x * f + a)) - amp * 0.35 * Math.sin(x * f * 2.7 + b));
    for (let j = y; j < PX.G; j++) r.px(x, j, c);
    if (top) r.px(x, y, top);
  }
}

export function pxTree(r, x, base, kind, P) {
  if (kind === 'pine') {
    for (let j = 0; j < 9; j++) {
      const w = 1 + (j >> 1);
      for (let i = -w; i <= w; i++) r.px(x + i, base - 12 + j, i < 0 ? P.tree2 : P.tree);
    }
    r.rect(x, base - 3, 1, 3, P.trunk);
    r.px(x, base - 12, P.treehi);
    return;
  }
  if (kind === 'palm') {
    for (let j = 0; j < 11; j++) r.px(x + Math.round(Math.sin(j / 4) * 1.5), base - 1 - j, j % 3 ? P.trunk : P.shade(P.trunk, 0.3));
    const tx = x + Math.round(Math.sin(10 / 4) * 1.5), ty = base - 12;
    for (const [dx, dy] of [[-5, 3], [-4, -1], [0, -3], [4, -1], [5, 3]]) r.line(tx, ty, tx + dx, ty + dy, P.tree);
    r.px(tx, ty, P.tree2);
    return;
  }
  if (kind === 'acacia') {
    r.line(x, base - 1, x, base - 8, P.trunk);
    r.line(x, base - 6, x - 3, base - 9, P.trunk);
    r.line(x, base - 6, x + 3, base - 9, P.trunk);
    r.rect(x - 7, base - 11, 15, 2, P.tree);
    r.rect(x - 5, base - 12, 11, 1, P.treehi);
    r.rect(x - 6, base - 9, 13, 1, P.tree2);
    return;
  }
  // Round deciduous tree
  r.rect(x, base - 4, 1, 4, P.trunk);
  r.disc(x, base - 8, 4, P.tree);
  r.disc(x + 1, base - 7, 2, P.tree2);
  r.px(x - 2, base - 10, P.treehi);
  r.px(x - 1, base - 11, P.treehi);
}

export function pxPole(r, x, P, urban) {
  const c = urban ? P.metal : P.trunk, top = PX.G - 30;
  r.rect(x, top, 2, 30, c);
  r.rect(x + 1, top, 1, 30, P.shade(c, 0.25));
  r.rect(x - 5, top + 3, 12, 1, c);
  r.rect(x - 3, top + 7, 8, 1, c);
  for (const dx of [-5, 6]) r.px(x + dx, top + 2, P.wall2);
  const wire = pxMix(P.ol, pxRGB(P.sky.d[1]), 0.4);
  for (const [dx, dy] of [[-5, 3], [6, 3]]) {
    for (let X = 0; X < PX.W; X++) {
      const span = X < x + dx ? [-40, x + dx] : [x + dx, PX.W + 60];
      const t = (X - span[0]) / (span[1] - span[0]);
      r.px(X, Math.round(top + dy + 16 * t * (1 - t)), wire);
    }
  }
}

export function pxGround(r, m, P, R) {
  const G = PX.G, W = PX.W, H = PX.H;
  if (m.urban) {
    r.rect(0, G, W, 3, P.pave);
    for (let x = 0; x < W; x += 7) r.px(x, G + 1, P.pave2);
    r.rect(0, G + 3, W, 1, P.pave2);
    r.rect(0, G + 4, W, H - G - 4, P.road);
    for (let x = 3; x < W; x += 12) r.rect(x, G + 8, 6, 1, P.roadline);
    for (let x = 0; x < W; x++) if (R() < 0.08) r.px(x, G + 5 + R() * 6, P.shade(P.road, 0.25));
    return;
  }
  const sand = m.region === 'mena';
  const top = sand ? P.sand : P.grass;
  const top2 = sand ? P.sand2 : P.grass2;
  const soil = sand ? P.sand2 : P.soil;
  const soil2 = sand ? P.shade(P.sand2, 0.2) : P.soil2;
  r.rect(0, G, W, 2, top);
  r.rect(0, G, W, 1, sand ? P.light(P.sand, 0.2) : P.grasshi);
  r.rect(0, G + 2, W, H - G - 2, soil);
  for (let x = 0; x < W; x++) {
    if (R() < 0.5) r.px(x, G + 2, top2);
    if (R() < 0.12) r.px(x, G + 3 + R() * (H - G - 4), R() < 0.5 ? soil2 : P.stone);
    if (!sand && R() < 0.22) { r.px(x, G - 1, top2); if (R() < 0.4) r.px(x, G - 2, top); }
  }
  r.rect(0, H - 1, W, 1, soil2);
}

export function pxHome(m, P, R) {
  const homeType = m.home || (m.wealth > 20000 ? 'mansion' : m.wealth > 5000 ? 'house' : m.urban ? 'flat' : 'hut');
  const lit = P.lit || m.stage === 'e';
  switch (homeType) {
    case 'tent': {
      const s = new PxR(26, 14);
      for (let y = 1; y < 14; y++) {
        const half = y;
        for (let i = 13 - half; i < 13 + half; i++) {
          s.px(i, y, y === 9 || y === 10 ? P.stamp : i < 13 ? P.light(P.wall2, 0.25) : P.wall2);
        }
      }
      return s;
    }
    case 'hut': {
      const s = new PxR(22, 19);
      for (let j = 0; j < 10; j++) {
        const half = Math.round((j + 1) * 11 / 10);
        for (let i = 11 - half; i <= 11 + half; i++) s.px(i, j, (i + j * 2) % 3 === 0 ? P.thatch2 : P.thatch);
      }
      s.rect(2, 10, 18, 9, P.mud);
      s.rect(10, 13, 3, 6, P.ol);
      return s;
    }
    case 'flat': {
      const s = new PxR(30, 40);
      s.rect(0, 2, 30, 38, P.wall);
      s.rect(26, 2, 4, 38, P.shade(P.wall, 0.1));
      for (let f = 0; f < 5; f++) {
        const y = 5 + f * 6;
        s.rect(0, y + 4, 30, 1, P.shade(P.wall, 0.12));
        for (let k = 0; k < 4; k++) {
          const L = lit && R() < 0.5, g = L ? P.winlit : P.win, x = 3 + k * 7;
          s.rect(x - 1, y - 1, 6, 5, P.shade(P.wall, 0.16));
          s.rect(x, y, 4, 3, g);
        }
      }
      s.rect(11, 34, 8, 6, P.shade(P.wall, 0.3));
      return s;
    }
    case 'mansion': {
      const s = new PxR(36, 32);
      s.rect(2, 8, 32, 24, P.wall);
      s.rect(0, 0, 36, 8, P.roof2);
      for (let f = 0; f < 2; f++) {
        for (let k = 0; k < 4; k++) {
          s.rect(5 + k * 7, 12 + f * 9, 4, 4, lit ? P.winlit : P.win);
        }
      }
      s.rect(16, 25, 4, 7, P.trunk);
      return s;
    }
    case 'house':
    default: {
      const s = new PxR(28, 24);
      for (let j = 0; j < 10; j++) {
        const half = Math.round((j + 1) * 14 / 10);
        for (let i = 14 - half; i <= 14 + half; i++) s.px(i, j, P.roof);
      }
      s.rect(3, 10, 22, 14, P.wall);
      s.rect(6, 13, 4, 4, lit ? P.winlit : P.win);
      s.rect(18, 13, 4, 4, lit ? P.winlit : P.win);
      s.rect(12, 17, 4, 7, P.trunk);
      s.rect(21, 2, 3, 5, P.brick); // Chimney
      return s;
    }
  }
}

export function pxCar(P, c) {
  return pxSprite([
    '....CCCCCC....', '...CwwCwwwC....', '..CCwwCwwwCC...',
    'CCCCCCCCCCCCCCC', 'CCCCCCCCCCCCCCY', 'cc.OO.cccc.OO.c', '...OO......OO..'
  ], { C: c, c: P.shade(c, 0.3), w: P.win, O: P.ol, Y: P.gold });
}

export function pxMoto(P, box) {
  return pxSprite([
    box ? 'GGG.......HH..' : '..........HH..',
    box ? 'GGG.SSSS..H...' : '....SSSS..H...',
    '..MMMMMMMMMMY.', '..O...MM...O..', '.OhO......OhO.', '..O........O..'
  ], { M: P.accent, G: P.gold, O: P.ol, S: P.ol, H: P.metal, h: P.metal, Y: P.gold });
}

export function pxWork(r, m, P, R) {
  const G = PX.G;
  const prop = m.prop || 'office';
  switch (prop) {
    case 'office': {
      pxBuilding(r, 150, 14, 28, G, P.wall2, P.win, R, { lit: P.winlit });
      return;
    }
    case 'factory': {
      const s = new PxR(36, 18);
      s.rect(0, 4, 36, 14, P.wall2);
      s.rect(2, 6, 32, 2, P.win);
      s.rect(28, 0, 4, 18, P.brick);
      r.blit(s, 144, G - 18, P.ol);
      for (let k = 0; k < 3; k++) r.disc(174 + k * 2, G - 20 - k * 3, 2, P.smoke);
      return;
    }
    case 'school': {
      const s = new PxR(32, 20);
      s.rect(2, 6, 28, 14, P.wall);
      s.rect(0, 0, 32, 6, P.stamp);
      s.rect(6, 9, 4, 4, P.win);
      s.rect(14, 9, 4, 4, P.win);
      s.rect(22, 9, 4, 4, P.win);
      r.blit(s, 148, G - 20, P.ol);
      return;
    }
    case 'clinic': {
      const s = new PxR(28, 20);
      s.rect(0, 2, 28, 18, P.wall);
      s.rect(12, 4, 4, 8, P.accent);
      s.rect(10, 6, 8, 4, P.accent); // Red Cross
      r.blit(s, 150, G - 20, P.ol);
      return;
    }
    case 'crane': {
      r.rect(160, G - 38, 2, 38, P.crane);
      r.rect(140, G - 38, 45, 2, P.crane);
      r.line(180, G - 38, 180, G - 24, P.ol);
      return;
    }
    case 'crops': {
      r.rect(136, G, 56, 10, P.soil);
      for (let x = 138; x < 188; x += 5) {
        r.px(x, G + 1, P.treehi);
        r.px(x + 1, G + 2, P.tree);
      }
      return;
    }
    case 'boat': {
      r.rect(130, G, 62, PX.H - G, P.water);
      for (let x = 132; x < PX.W; x += 8) r.px(x, G, P.water2);
      const boat = pxSprite([
        '........M.......', '.......MSS......', '.......MSSS.....',
        'HHHHHHHHHHHHHHHH', '.hhhhhhhhhhhhhh.'
      ], { M: P.trunk, S: P.wall, H: P.brick, h: P.shade(P.brick, 0.3) });
      r.blit(boat, 150, G - 5, P.ol);
      return;
    }
    default:
      return;
  }
}

// Master Scene Rendering Function
export function pxScene(m, P, anim = {}) {
  const R = lvRand(m.seed || 12345);
  const r = new PxR(PX.W, PX.H);
  const G = PX.G;

  // 1. Sky & Celestial
  pxSky(r, m, P, R);

  // 2. Animated Clouds drifting
  const clouds = m.mood === 'low' ? 5 : m.mood === 'mid' ? 3 : 2;
  const cloudOffset = anim.cloudOffset || 0;
  for (let i = 0; i < clouds; i++) {
    const cx = (14 + ((i + 0.3 + R() * 0.5) * (PX.W - 28)) / clouds + cloudOffset) % (PX.W + 40) - 20;
    pxCloud(r, cx, 10 + Math.round(R() * 12), 16 + Math.round(R() * 16), P, R, m.mood === 'low');
  }

  // 3. Birds in high mood
  if (m.mood === 'high' && !P.dark) pxBirds(r, P, R);

  // 4. Backdrop & Hills
  if (m.urban) {
    let x = -4;
    while (x < PX.W) {
      const w = 6 + Math.round(R() * 9), h = 10 + Math.round(R() * 17);
      pxBuilding(r, x, w, h, G - 2, P.far1, pxMix(P.far1, P.wall, 0.35), R, { step: R() < 0.3 });
      x += w + 2 + Math.round(R() * 3);
    }
  } else {
    pxHills(r, P, R, 0.04, G - 10, 8, P.hill1, P.light(P.hill1, 0.15));
    pxHills(r, P, R, 0.06, G - 2, 5, P.hill2, P.light(P.hill2, 0.15));
  }

  // 5. Trees & Poles
  const treeKind = m.region === 'ssa' ? 'acacia' : ['se', 's', 'mena'].includes(m.region) ? 'palm' : 'round';
  if (!m.urban) {
    pxTree(r, 58, G, treeKind, P);
    pxTree(r, 70, G, treeKind, P);
  } else {
    pxTree(r, 64, G, 'round', P);
  }
  pxPole(r, 80, P, m.urban);

  // 6. Ground & Fence
  pxGround(r, m, P, R);

  // 7. Work & Workplace Props
  pxWork(r, m, P, R);

  // 8. Character's Home
  const home = pxHome(m, P, R);
  const hx = 4;
  r.blit(home, hx, G - home.h, P.ol);

  // Vehicles
  if (m.wealth >= 8000) {
    r.blit(pxCar(P, P.accent), hx + home.w + 3, G - 6, P.ol);
  } else if (m.wealth >= 1500) {
    r.blit(pxMoto(P, false), hx + home.w + 4, G - 5, null);
  }

  // 9. People / Family Characters
  const people = m.people || [{ role: 'me', sex: m.sex || 'M', age: m.age || 0, sk: m.sk || 2 }];
  const sprites = people.map(p => ({
    p,
    s: pxPerson(p, P, p.role === 'me' ? [P.me, P.pants] : null, p.role === 'me' ? anim : {})
  }));

  const tot = sprites.reduce((t, x) => t + x.s.w + 3, -3);
  let pxStart = Math.round(Math.max(hx + home.w + 14, Math.min(108 - tot / 2, 136 - tot)));

  for (const { p, s } of sprites) {
    const bounceY = (p.role === 'me' && anim.jump) ? -3 : (anim.breathe && p.role === 'me' ? -1 : 0);
    r.blit(s, pxStart, G - s.h + bounceY, P.ol);

    // Emote Heart Bubble on click
    if (p.role === 'me' && anim.heart) {
      r.rect(pxStart + 2, G - s.h - 8, 5, 4, [255, 255, 255]);
      r.px(pxStart + 3, G - s.h - 7, [220, 50, 80]);
      r.px(pxStart + 5, G - s.h - 7, [220, 50, 80]);
      r.px(pxStart + 4, G - s.h - 6, [220, 50, 80]);
    }

    pxStart += s.w + 3;
  }

  // Pet
  if (m.pet) {
    const ps = pxPet(m.pet, P);
    r.blit(ps, pxStart, G - ps.h, P.ol);
  }

  return r;
}

// Funeral Altar Ceremony Scene
export function pxFuneral(m, P, mourners = []) {
  const R = lvRand(m.seed + 'f');
  const r = new PxR(PX.W, PX.H);
  const G = PX.G;
  const ax = 96;

  pxSky(r, { stage: 'e', mood: 'low' }, P, R);
  pxGround(r, { urban: false }, P, R);

  // Altar
  r.rect(ax - 16, G - 7, 32, 7, P.shade(P.trunk, 0.15));
  r.rect(ax - 17, G - 8, 34, 2, P.wall);

  // Memorial Portrait
  r.rect(ax - 7, G - 25, 14, 17, P.ol);
  r.rect(ax - 6, G - 24, 12, 15, P.wall2);
  r.rect(ax - 3, G - 13, 6, 4, P.me);
  r.disc(ax, G - 17, 2, m.sk != null && P['sk' + m.sk] ? P['sk' + m.sk] : P.skin);
  r.rect(ax - 2, G - 20, 5, 2, m.old ? P.hairold : P.hair);

  // Flowers & Incense
  for (let k = 0; k < 6; k++) {
    r.disc(ax - 14 + k * 1.5, G - 9 - (k % 2), 1, P.wall);
    r.disc(ax + 7 + k * 1.5, G - 9 - (k % 2), 1, P.wall);
  }
  // Incense bowl
  r.rect(ax - 2, G - 7, 5, 2, P.metal);
  r.px(ax, G - 8, P.accent);
  r.px(ax, G - 9, P.smoke);
  r.px(ax + 1, G - 11, P.smoke);

  // Mourners
  const mList = mourners.length ? mourners : [
    { role: 'pt', sex: 'F', age: 70 },
    { role: 'kid', sex: 'M', age: 40 },
    { role: 'kid', sex: 'F', age: 36 }
  ];

  let lx = ax - 24;
  for (const p of mList.filter((_, i) => i % 2 === 0)) {
    const s = pxPerson(p, P, [P.wall, P.wall]); // White mourning clothes for VN/Asia
    lx -= s.w;
    if (lx > 4) r.blit(s, lx, G - s.h, P.ol);
    lx -= 3;
  }

  let rx = ax + 24;
  for (const p of mList.filter((_, i) => i % 2 === 1)) {
    const s = pxPerson(p, P, [P.wall, P.wall]);
    if (rx + s.w < PX.W - 4) r.blit(s, rx, G - s.h, P.ol);
    rx += s.w + 3;
  }

  return r;
}

export function pxDrawToCanvas(r, canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(PX.W, PX.H);
  for (let i = 0; i < r.d.length; i++) {
    const c = r.d[i] || [0, 0, 0];
    img.data[i * 4] = c[0];
    img.data[i * 4 + 1] = c[1];
    img.data[i * 4 + 2] = c[2];
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
}
