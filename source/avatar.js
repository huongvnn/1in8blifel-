/**
 * Procedural pixel-art avatar generator matching the iconic aesthetic of 1n8b.life
 */

export function generateAvatarSvg({ sex, age, region, seed = 12345 }) {
  // Deterministic PRNG from seed
  let s = (seed + 1) * 31337;
  const rnd = () => {
    s = (s + 0x6D2B79F5) | 0;
    return (((s ^ (s >>> 15)) >>> 0) % 1000) / 1000;
  };

  // Skin tones based on regional demographics
  const SKIN_TONES = {
    ssa: ['#3F2618', '#553420', '#6C432B'], // Sub-saharan Africa
    sa: ['#694732', '#835B40', '#9E7153', '#B68B6D'], // South Asia
    mena: ['#BD916F', '#CBA382', '#DEB897', '#E8C7AC'], // Middle East & North Africa
    eap: ['#EBC9A4', '#F3D6B5', '#F8E0C4'], // East Asia & Pacific
    lac: ['#A77A56', '#C19472', '#D8AD8E', '#E4C3A7'], // Latin America & Caribbean
    eca: ['#E6C5A8', '#F3D4B9', '#FAE3CE'], // Eastern Europe & Central Asia
    hi: ['#F5D6BD', '#FCE4D1', '#FBF0E4']  // High Income / North America / West Europe
  };

  const tones = SKIN_TONES[region] || SKIN_TONES.hi;
  const skin = tones[Math.floor(rnd() * tones.length)];

  // Hair color
  let hairColor = '#241c18';
  if (age >= 60) {
    hairColor = rnd() > 0.4 ? '#C5C9CD' : '#8E9499';
  } else if (region === 'hi' || region === 'eca') {
    const hr = rnd();
    hairColor = hr < 0.25 ? '#B98D58' : hr < 0.4 ? '#8B4513' : '#2A201C';
  }

  // Shirt color
  const SHIRT_COLORS = ['#8C1D3C', '#0F6E68', '#2A4B7C', '#4A5A61', '#7A5B35', '#3A6351', '#5B3758'];
  const shirt = SHIRT_COLORS[Math.floor(rnd() * SHIRT_COLORS.length)];

  // Stage of life
  const isBaby = age <= 3;
  const isChild = age > 3 && age <= 12;
  const isElder = age >= 60;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="64" height="80" style="image-rendering: pixelated; shape-rendering: crispEdges;">
      <!-- Background -->
      <rect width="32" height="40" fill="#F0F4F2" />
      
      <!-- Shoulders / Clothes -->
      <rect x="6" y="27" width="20" height="13" rx="2" fill="${shirt}" />
      <rect x="13" y="27" width="6" height="4" fill="#FFFFFF" opacity="0.6" />
      
      <!-- Neck -->
      <rect x="13" y="22" width="6" height="6" fill="${skin}" />

      <!-- Head Base -->
      <rect x="8" y="${isBaby ? 8 : 7}" width="16" height="${isBaby ? 15 : 16}" rx="${isBaby ? 4 : 2}" fill="${skin}" />

      <!-- Hair -->
      ${sex === 'F' && !isBaby ? `
        <!-- Female Hair (Longer / Framing) -->
        <rect x="7" y="6" width="18" height="6" fill="${hairColor}" />
        <rect x="6" y="9" width="3" height="15" fill="${hairColor}" />
        <rect x="23" y="9" width="3" height="15" fill="${hairColor}" />
      ` : !isBaby ? `
        <!-- Male / Short Hair -->
        <rect x="7" y="6" width="18" height="5" fill="${hairColor}" />
        <rect x="7" y="9" width="2" height="4" fill="${hairColor}" />
        <rect x="23" y="9" width="2" height="4" fill="${hairColor}" />
      ` : `
        <!-- Baby bonnet tuft -->
        <circle cx="16" cy="7" r="2" fill="${hairColor}" opacity="0.8" />
      `}

      <!-- Eyes -->
      ${isBaby ? `
        <!-- Closed / Happy Baby Eyes -->
        <rect x="11" y="14" width="3" height="1" fill="#13212A" />
        <rect x="18" y="14" width="3" height="1" fill="#13212A" />
      ` : `
        <rect x="11" y="13" width="2" height="3" fill="#13212A" />
        <rect x="19" y="13" width="2" height="3" fill="#13212A" />
        <rect x="11" y="13" width="1" height="1" fill="#FFFFFF" />
        <rect x="19" y="13" width="1" height="1" fill="#FFFFFF" />
      `}

      <!-- Eyebrows / Wrinkles -->
      ${isElder ? `
        <rect x="10" y="11" width="4" height="1" fill="${hairColor}" />
        <rect x="18" y="11" width="4" height="1" fill="${hairColor}" />
        <line x1="12" y1="18" x2="14" y2="18" stroke="#13212A" stroke-width="0.8" opacity="0.4" />
        <line x1="18" y1="18" x2="20" y2="18" stroke="#13212A" stroke-width="0.8" opacity="0.4" />
      ` : `
        <rect x="10" y="11" width="3" height="1" fill="${hairColor}" opacity="0.6" />
        <rect x="19" y="11" width="3" height="1" fill="${hairColor}" opacity="0.6" />
      `}

      <!-- Nose -->
      <rect x="15" y="${isBaby ? 15 : 16}" width="2" height="${isBaby ? 1 : 2}" fill="#000000" opacity="0.18" />

      <!-- Mouth -->
      <rect x="14" y="${isBaby ? 18 : 19}" width="4" height="1" fill="#B0362B" opacity="0.75" />

      <!-- Cheeks if baby or child -->
      ${(isBaby || isChild) ? `
        <rect x="9" y="15" width="2" height="2" fill="#F07B6B" opacity="0.4" />
        <rect x="21" y="15" width="2" height="2" fill="#F07B6B" opacity="0.4" />
      ` : ''}
    </svg>
  `;
}
