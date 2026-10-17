/**
 * Living Pixel-Art Diorama & Character Animation Engine for 1in8b.life
 * Renders authentic pixel sprites for characters, family, home, environment,
 * with eye blinking, breathing bobbing, and cloud drifting animations.
 */

export const PX_W = 192;
export const PX_H = 60;
export const PX_GROUND = 48;

// Color palettes for Light and Dark themes
const PALETTES = {
  light: {
    skyTop: [143, 207, 227],
    skyBot: [232, 242, 236],
    sun: [255, 227, 154],
    cloud: [255, 255, 255],
    cloudShade: [214, 228, 236],
    hillFar: [188, 215, 224],
    hillNear: [179, 211, 194],
    grass: [140, 192, 122],
    grassShade: [94, 154, 94],
    dirt: [126, 104, 88],
    pave: [205, 208, 200],
    paveShade: [169, 173, 166],
    wall: [243, 238, 227],
    wallShade: [213, 217, 211],
    roof: [194, 85, 80],
    roofShade: [149, 61, 59],
    roofTile: [100, 110, 125],
    window: [127, 169, 186],
    windowLit: [242, 199, 110],
    treeFoliage: [111, 167, 102],
    treeTrunk: [122, 90, 67],
    hair: [63, 53, 48],
    hairOld: [221, 218, 211],
    skin: [207, 159, 124],
    eye: [19, 33, 42],
    blush: [235, 140, 130],
    mouth: [176, 54, 43],
    shirtMe: [31, 138, 128], // Teal
    shirtDad: [74, 90, 97],
    shirtMom: [140, 29, 60], // Burgundy
    shirtPartner: [108, 128, 145],
    shirtKid: [226, 163, 58],
    pants: [79, 86, 97],
    shoes: [19, 33, 42]
  },
  dark: {
    skyTop: [23, 40, 58],
    skyBot: [44, 63, 73],
    sun: [232, 215, 160], // Moon
    cloud: [74, 90, 100],
    cloudShade: [58, 72, 81],
    hillFar: [43, 61, 72],
    hillNear: [37, 56, 47],
    grass: [47, 75, 54],
    grassShade: [34, 56, 42],
    dirt: [46, 38, 33],
    pave: [58, 63, 66],
    paveShade: [46, 51, 54],
    wall: [75, 84, 90],
    wallShade: [61, 70, 76],
    roof: [122, 54, 56],
    roofShade: [90, 40, 42],
    roofTile: [50, 60, 70],
    window: [44, 61, 71],
    windowLit: [240, 195, 94],
    treeFoliage: [47, 90, 62],
    treeTrunk: [74, 56, 40],
    hair: [31, 26, 23],
    hairOld: [169, 166, 160],
    skin: [169, 135, 109],
    eye: [10, 15, 18],
    blush: [180, 90, 80],
    mouth: [140, 40, 30],
    shirtMe: [76, 192, 175],
    shirtDad: [102, 119, 123],
    shirtMom: [226, 103, 138],
    shirtPartner: [140, 157, 163],
    shirtKid: [217, 175, 89],
    pants: [43, 48, 54],
    shoes: [15, 18, 20]
  }
};

// Raster buffer class
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
      this.d[y * this.w + x] = c;
    }
  }

  get(x, y) {
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) {
      return this.d[y * this.w + x];
    }
    return null;
  }

  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        this.px(x + i, y + j, c);
      }
    }
  }

  blit(s, x, y) {
    for (let j = 0; j < s.h; j++) {
      for (let i = 0; i < s.w; i++) {
        const v = s.get(i, j);
        if (v) this.px(x + i, y + j, v);
      }
    }
  }
}

// Convert sprite character rows into pixel buffer
export function pxSprite(rows, colorMap) {
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  const s = new PxR(w, h);
  for (let y = 0; y < h; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch !== '.' && colorMap[ch]) {
        s.px(x, y, colorMap[ch]);
      }
    }
  }
  return s;
}

// Authentic sprite rows from 1in8b.life
export const SPRITES = {
  M: {
    adult: [
      '..HHHHH..',
      '.HHHHHHH.',
      'HHHHHHHHH',
      'HHSSSSHHH',
      'HSSSSSSSH',
      'SSESSSESS',
      'ScSSSSScS',
      '.SSSmSSS.',
      '..SSSSS..',
      '.BBBBBBB.',
      'BBBBBBBBB',
      'BbBBBBBbB',
      'SbBBBBBbS',
      '..PPPPP..',
      '..PP.PP..',
      '..PP.PP..',
      '..FF.FF..'
    ],
    teen: [
      '..HHHHH..',
      '.HHHHHHH.',
      'HHHHHHHHH',
      'HHSSSSHHH',
      'HSSSSSSSH',
      'SSESSSESS',
      'ScSSSSScS',
      '.SSSmSSS.',
      '..SSSSS..',
      '.BBBBBBB.',
      'BbBBBBBbB',
      'SbBBBBBbS',
      '..PPPPP..',
      '..PP.PP..',
      '..PP.PP..',
      '..FF.FF..'
    ],
    child: [
      '.HHHHH.',
      'HHHHHHH',
      'HHSSSHH',
      'SESSSES',
      'ScSSScS',
      '.SSmSS.',
      '..SSS..',
      '.BBBBB.',
      'BbBBBbB',
      'SbBBBbS',
      '.PPPPP.',
      '.PP.PP.',
      '.FF.FF.'
    ],
    small: [
      '.HHHHH.',
      'HHSSSHH',
      'SESSSES',
      'ScSmScS',
      '.SSSSS.',
      '.BBBBB.',
      'SBBBBBS',
      '.PPPPP.',
      '.PP.PP.',
      '.FF.FF.'
    ],
    baby: [
      '.HHHH.',
      'HSSSSH',
      'SESSES',
      'ScSScS',
      '.SSSS.',
      'BBBBBB',
      'BB..BB'
    ]
  },
  F: {
    adult: [
      '..HHHHH..',
      '.HHHHHHH.',
      'HHHHHHHHH',
      'HHSSSSHHH',
      'HSSSSSSSH',
      'HSESSSESH',
      'HcSSSSScH',
      'HHSSmSSHH',
      'HHHSSSHHH',
      'HBBBBBBBH',
      'BBBBBBBBB',
      'SbBBBBBbS',
      '.DDDDDDD.',
      '.DDDDDDD.',
      'ddddddddd',
      '..S...S..',
      '..F...F..'
    ],
    teen: [
      '..HHHHH..',
      '.HHHHHHH.',
      'HHHHHHHHH',
      'HHSSSSHHH',
      'HSSSSSSSH',
      'HSESSSESH',
      'HcSSSSScH',
      'HHSSmSSHH',
      'HHHSSSHHH',
      'HBBBBBBBH',
      'SbBBBBBbS',
      '.DDDDDDD.',
      'ddddddddd',
      '..S...S..',
      '..F...F..'
    ],
    child: [
      '.HHHHH.',
      'HHHHHHH',
      'HHSSSHH',
      'HESSSEH',
      'HcSSScH',
      'HSSmSSH',
      'H.SSS.H',
      '.BBBBB.',
      'SbBBBbS',
      '.DDDDD.',
      'ddddddd',
      '.S...S.',
      '.F...F.'
    ],
    small: [
      '.HHHHH.',
      'HHSSSHH',
      'HESSSEH',
      'HcSmScH',
      'HSSSSSH',
      '.BBBBB.',
      'SDDDDDS',
      'ddddddd',
      '.S...S.',
      '.F...F.'
    ],
    baby: [
      '.HHHH.',
      'HSSSSH',
      'SESSES',
      'ScSScS',
      '.SSSS.',
      'BBBBBB',
      'BB..BB'
    ]
  }
};

// Newborn swaddled baby sprite
export const SPRITE_NEWBORN = [
  '..WWWWW..',
  '.WWHHHWW.',
  '.WHSSSHW.',
  '.WSESESW.',
  '.WcSSScW.',
  '.WWSSSWW.',
  '.WwWWWwW.',
  '.WWwWwWW.',
  '.WWWwWWW.',
  '..WWWWW..',
  '...WWW...'
];

// Helper: build character sprite with blinking and aging
export function buildPersonSprite({ sex, age, role, isBlinking, pal, skinOverride, shirtColor }) {
  const isOld = age >= 65;
  const isFemale = sex === 'F';
  const roleShirt = shirtColor || (role === 'me' ? pal.shirtMe : role === 'dad' ? pal.shirtDad : role === 'mom' ? pal.shirtMom : role === 'partner' ? pal.shirtPartner : pal.shirtKid);

  // Newborn swaddle
  if (age < 1) {
    const swaddle = [235, 235, 235];
    const map = {
      W: swaddle,
      w: [190, 190, 190],
      H: pal.hair,
      S: skinOverride || pal.skin,
      E: isBlinking ? (skinOverride || pal.skin) : pal.eye,
      c: pal.blush
    };
    return pxSprite(SPRITE_NEWBORN, map);
  }

  const kind = age < 3 ? 'baby' : age < 7 ? 'small' : age < 13 ? 'child' : age < 18 ? 'teen' : 'adult';
  const rows = SPRITES[isFemale ? 'F' : 'M'][kind];

  const map = {
    H: isOld ? pal.hairOld : pal.hair,
    S: skinOverride || pal.skin,
    E: isBlinking ? (skinOverride || pal.skin) : pal.eye,
    c: pal.blush,
    m: pal.mouth,
    B: roleShirt,
    b: [Math.round(roleShirt[0] * 0.75), Math.round(roleShirt[1] * 0.75), Math.round(roleShirt[2] * 0.75)],
    P: pal.pants,
    D: roleShirt,
    d: [Math.round(roleShirt[0] * 0.8), Math.round(roleShirt[1] * 0.8), Math.round(roleShirt[2] * 0.8)],
    F: pal.shoes
  };

  return pxSprite(rows, map);
}

// Draw trees
export function drawTree(r, x, y, pal) {
  // Trunk
  r.rect(x + 3, y + 8, 2, 7, pal.treeTrunk);
  // Foliage
  r.rect(x + 1, y + 1, 6, 8, pal.treeFoliage);
  r.rect(x + 2, y, 4, 1, pal.treeFoliage);
  r.rect(x, y + 3, 8, 4, pal.treeFoliage);
}

// Draw home (Cottage, Flat, Hut, House)
export function drawHouse(r, x, y, type, pal) {
  if (type === 'hut') {
    // Round thatched mud hut
    r.rect(x, y + 6, 20, 10, pal.dirt);
    r.rect(x + 8, y + 10, 4, 6, pal.wallShade); // Door
    // Thatched cone roof
    for (let j = 0; j < 6; j++) {
      const span = j * 2 + 8;
      r.rect(x + 10 - span / 2, y + j, span, 1, pal.roofShade);
    }
  } else if (type === 'flat') {
    // City apartment building
    r.rect(x, y - 6, 28, 22, pal.wallShade);
    r.rect(x + 1, y - 5, 26, 21, pal.wall);
    // Grid of windows
    for (let wy = y - 3; wy < y + 12; wy += 5) {
      for (let wx = x + 3; wx < x + 24; wx += 6) {
        r.rect(wx, wy, 3, 3, pal.windowLit);
      }
    }
    r.rect(x + 12, y + 10, 4, 6, pal.pants); // Entrance door
  } else {
    // Standard cottage / house with gabled roof
    r.rect(x + 2, y + 6, 26, 11, pal.wall);
    // Roof triangle
    for (let j = 0; j < 6; j++) {
      const span = (j + 1) * 5;
      r.rect(x + 15 - span / 2, y + j, span, 1, pal.roof);
    }
    // Door and window
    r.rect(x + 6, y + 10, 4, 7, pal.treeTrunk); // Door
    r.rect(x + 16, y + 9, 5, 5, pal.window);
    r.rect(x + 17, y + 10, 3, 3, pal.windowLit);
  }
}

/**
 * Main Living Diorama Scene Renderer
 * Draws background, moving clouds, home, and animated family members!
 */
export function renderLivingDiorama(canvas, state, animTime = 0, theme = 'light', extraAnim = null) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const pal = PALETTES[theme === 'dark' ? 'dark' : 'light'];

  const r = new PxR(PX_W, PX_H);

  // 1. Sky Gradient
  for (let y = 0; y < PX_GROUND; y++) {
    const t = y / PX_GROUND;
    const c = [
      Math.round(pal.skyTop[0] + (pal.skyBot[0] - pal.skyTop[0]) * t),
      Math.round(pal.skyTop[1] + (pal.skyBot[1] - pal.skyTop[1]) * t),
      Math.round(pal.skyTop[2] + (pal.skyBot[2] - pal.skyTop[2]) * t)
    ];
    r.rect(0, y, PX_W, 1, c);
  }

  // 2. Sun / Moon
  const sunX = 160;
  const sunY = 10;
  r.rect(sunX - 1, sunY, 7, 5, pal.sun);
  r.rect(sunX, sunY - 1, 5, 7, pal.sun);

  // 3. Drifting Clouds (smoothly animated with animTime)
  const cloudOffset = Math.floor((animTime / 120) % PX_W);
  const clouds = [
    { x: (20 + cloudOffset) % (PX_W + 40) - 20, y: 8, w: 18 },
    { x: (100 + cloudOffset * 0.7) % (PX_W + 40) - 20, y: 14, w: 24 }
  ];
  for (const cl of clouds) {
    const cx = Math.round(cl.x);
    r.rect(cx + 3, cl.y, cl.w - 6, 4, pal.cloud);
    r.rect(cx, cl.y + 1, cl.w, 3, pal.cloud);
    r.rect(cx + 2, cl.y + 3, cl.w - 4, 2, pal.cloudShade);
  }

  // 4. Background Hills / Distant City skyline
  if (state.urban) {
    // Distant city silhouette
    for (let x = 0; x < PX_W; x += 12) {
      const bH = 8 + ((x * 17) % 11);
      r.rect(x, PX_GROUND - bH, 10, bH, pal.hillFar);
    }
  } else {
    // Rolling hills
    for (let x = 0; x < PX_W; x++) {
      const h1 = Math.round(Math.sin(x * 0.05) * 5 + 8);
      r.rect(x, PX_GROUND - h1, 1, h1, pal.hillFar);
      const h2 = Math.round(Math.sin((x + 30) * 0.07) * 4 + 5);
      r.rect(x, PX_GROUND - h2, 1, h2, pal.hillNear);
    }
  }

  // 5. Ground (Pavement if urban, Grass if rural)
  const groundColor = state.urban ? pal.pave : pal.grass;
  r.rect(0, PX_GROUND, PX_W, PX_H - PX_GROUND, groundColor);
  r.rect(0, PX_GROUND, PX_W, 1, state.urban ? pal.paveShade : pal.grassShade);

  // Road or path line
  if (state.urban) {
    r.rect(0, PX_GROUND + 4, PX_W, 6, [70, 75, 80]);
    for (let x = 0; x < PX_W; x += 14) {
      r.rect(x, PX_GROUND + 6, 8, 1, [230, 220, 180]);
    }
  }

  // 6. Draw House / Residence
  const houseX = 20;
  const houseY = PX_GROUND - 17;
  const houseType = state.urban ? 'flat' : state.flags.ownsHome ? 'house' : (state.q <= 2 ? 'hut' : 'cottage');
  drawHouse(r, houseX, houseY, houseType, pal);

  // Trees around house
  drawTree(r, houseX - 10, PX_GROUND - 15, pal);
  drawTree(r, houseX + 34, PX_GROUND - 15, pal);

  // 7. Characters & Animation Parameters
  // Breathing cycle: sine wave of period ~1600ms -> vertical offset 0 or 1
  const breathCycle = Math.sin((animTime / 800) * Math.PI);
  const breathBob = breathCycle > 0.3 ? -1 : 0;

  // Eye blinking: blink for ~150ms every 3200ms
  const blinkCycle = animTime % 3200;
  const isBlinking = blinkCycle < 160;

  // Jump bounce animation on year advance (or user click)
  const jumpOffset = extraAnim?.jump ? Math.round(Math.sin(extraAnim.jump * Math.PI) * -3) : 0;

  // People positioning on ground:
  const groundY = PX_GROUND - 1;

  // Build the list of characters standing in front of house
  const people = [];

  // If character is young (<18), parents stand beside them
  if (state.yearsLived < 18) {
    if (state.family.dad.alive && !state.family.dad.absent) {
      people.push({
        role: 'dad',
        sex: 'M',
        age: state.family.dad.age,
        name: 'Cha'
      });
    }
    if (state.family.mom.alive) {
      people.push({
        role: 'mom',
        sex: 'F',
        age: state.family.mom.age,
        name: 'Mẹ'
      });
    }
  }

  // Character (Me)
  people.push({
    role: 'me',
    sex: state.sex,
    age: state.yearsLived,
    isMe: true,
    name: state.name.full
  });

  // If adult and married, spouse stands beside them
  if (state.family.partner && state.family.partner.alive) {
    people.push({
      role: 'partner',
      sex: state.sex === 'M' ? 'F' : 'M',
      age: state.yearsLived,
      name: state.family.partner.name
    });
  }

  // Children
  state.family.children.slice(0, 3).forEach((kid) => {
    const kidAge = state.yearsLived - kid.bornAtAge;
    people.push({
      role: 'kid',
      sex: kid.gender,
      age: kidAge,
      name: kid.name
    });
  });

  // Blit people onto ground
  let currentX = 95;
  for (let i = 0; i < people.length; i++) {
    const p = people[i];
    const pBlinking = p.isMe ? isBlinking : ((animTime + i * 900) % 3600 < 150);
    const pBob = p.isMe ? (breathBob + jumpOffset) : (Math.sin(((animTime + i * 400) / 800) * Math.PI) > 0.3 ? -1 : 0);

    const s = buildPersonSprite({
      sex: p.sex,
      age: p.age,
      role: p.role,
      isBlinking: pBlinking,
      pal
    });

    const py = groundY - s.h + pBob;
    r.blit(s, currentX, py);

    // Floating heart above protagonist when reacting
    if (p.isMe && extraAnim?.showHeart) {
      const heartRows = [
        '.CC.CC.',
        'CCCCCCC',
        'CCCCCCC',
        '.CCCCC.',
        '..CCC..',
        '...C...'
      ];
      const heartSprite = pxSprite(heartRows, { C: pal.roof });
      r.blit(heartSprite, currentX + Math.floor((s.w - 7) / 2), py - 9);
    }

    currentX += s.w + 3;
  }

  // 8. Put pixel buffer into HTML5 Canvas with crisp pixelated rendering
  const imgData = ctx.createImageData(PX_W, PX_H);
  for (let i = 0; i < r.d.length; i++) {
    const col = r.d[i] || [0, 0, 0];
    const idx = i * 4;
    imgData.data[idx] = col[0];
    imgData.data[idx + 1] = col[1];
    imgData.data[idx + 2] = col[2];
    imgData.data[idx + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
}
