// ==================== PART TWO v62: the city outside, pictures that aren't all the same, the calendar, the endings ====================

// ---------------------------------------------------------------- textures
function v62Tex() {
  if (TX.cw1) return;
  const R = rng(620);
  // building faces: a dark grid of windows, some lit (warm flats, cold offices, the odd pink one)
  const facade = (name, base, lit, cols) => tex(name, 64, (g, s) => {
    g.fillStyle = base; g.fillRect(0, 0, s, s);
    for (let y = 1; y < s; y += 4) for (let x = 1; x < s; x += 3) { const on = R() < lit; g.fillStyle = on ? cols[(R() * cols.length) | 0] : (R() < .5 ? '#1a1c26' : '#222432'); g.fillRect(x, y, 2, 2) }
    g.fillStyle = 'rgba(0,0,0,.35)'; for (let x = 0; x < s; x += 12) g.fillRect(x, 0, 1, s) });
  facade('cw1', '#0c0b12', .32, ['#ffd890', '#ffc870', '#f0e0b0']);
  facade('cw2', '#0a0d14', .45, ['#9ad8ff', '#c8f0ff', '#70b0ff', '#ffffff']);
  facade('cw3', '#100a14', .28, ['#ff70c0', '#ffd890', '#a070ff', '#70fff0']);
  facade('cw4', '#121014', .18, ['#ffb060', '#ffd890']);
  tex('cwtop', 16, (g, s) => texNoise(g, s, '#16141c', .2, 621, 1));
  tex('cshop', 64, (g, s) => { g.fillStyle = '#0c0a10'; g.fillRect(0, 0, s, s); for (let x = 0; x < s; x += 16) { const c = ['#ff3a9a', '#30e8ff', '#ffd040', '#9a5aff', '#40ff9a'][(R() * 5) | 0]; g.fillStyle = c; g.fillRect(x + 1, 8, 14, 3); g.globalAlpha = .45; g.fillRect(x + 2, 14, 12, 40); g.globalAlpha = 1; g.fillStyle = '#05040a'; g.fillRect(x + 4, 20, 8, 34) } });
  // neon signs: glowing strokes that look like letters from far away (not any real alphabet), on dark boards
  const NEON = ['#ff2a8a', '#22e8ff', '#ffd23a', '#ff4a3a', '#46ff8a', '#b46aff'];
  NEON.forEach((c, i) => tex('neon' + i, 32, (g, s, h) => { g.fillStyle = '#07060c'; g.fillRect(0, 0, s, h); g.strokeStyle = c; g.lineWidth = 2; g.shadowColor = c;
    for (let k = 0; k < 4; k++) { const y0 = 6 + k * 14; g.beginPath(); for (let j = 0; j < 4; j++) { const a = R() * s, b = y0 + R() * 10, x2 = 6 + R() * 20, y2 = y0 + R() * 10; g.moveTo(Math.min(s - 4, Math.max(4, a)), b); g.lineTo(x2, y2) } g.stroke() }
    g.strokeRect(2, 2, s - 4, h - 4) }, 64));
  // big holographic adverts (shapes and colour, no real brands)
  tex('holo0', 64, (g, s) => { const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, '#ff2a9a'); gr.addColorStop(1, '#3a10a0'); g.fillStyle = gr; g.fillRect(0, 0, s, s); g.fillStyle = '#ffe0f4'; g.beginPath(); g.arc(40, 26, 14, 0, 7); g.fill(); g.fillStyle = '#2a0a40'; g.beginPath(); g.arc(44, 24, 12, 0, 7); g.fill(); g.fillStyle = '#ffffff'; for (let i = 0; i < 3; i++) g.fillRect(6, 44 + i * 6, 30 - i * 8, 3) });
  tex('holo1', 64, (g, s) => { g.fillStyle = '#04141c'; g.fillRect(0, 0, s, s); g.strokeStyle = '#30f0ff'; g.lineWidth = 3; g.beginPath(); g.moveTo(8, 50); g.lineTo(24, 14); g.lineTo(40, 40); g.lineTo(56, 10); g.stroke(); g.fillStyle = '#ffd040'; g.fillRect(8, 54, 48, 4) });
  tex('holo2', 64, (g, s) => { g.fillStyle = '#1a0606'; g.fillRect(0, 0, s, s); g.fillStyle = '#ff3a2a'; g.beginPath(); g.moveTo(32, 6); g.lineTo(58, 52); g.lineTo(6, 52); g.closePath(); g.fill(); g.fillStyle = '#1a0606'; g.beginPath(); g.moveTo(32, 22); g.lineTo(46, 46); g.lineTo(18, 46); g.closePath(); g.fill(); g.fillStyle = '#ffe0c0'; g.fillRect(10, 56, 44, 3) });
  tex('road', 64, (g, s) => { texNoise(g, s, '#1a1a1e', .12, 622, 1); g.fillStyle = '#c8a030'; for (let x = 0; x < s; x += 16) g.fillRect(x, 31, 9, 2); g.fillStyle = '#9a9aa0'; g.fillRect(0, 2, s, 1); g.fillRect(0, s - 3, s, 1) });
  tex('cwalk', 32, (g, s) => { texNoise(g, s, '#3a3840', .1, 623, 1); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(0, 0, s, 1); g.fillRect(0, 0, 1, s) });
  tex('cground', 32, (g, s) => texNoise(g, s, '#141418', .15, 624, 1));
  tex('hwy', 64, (g, s) => { texNoise(g, s, '#2a2830', .1, 625, 1); g.fillStyle = '#ff3030'; for (let x = 0; x < s; x += 5) g.fillRect(x, 50, 2, 2); g.fillStyle = '#fff0c0'; for (let x = 2; x < s; x += 7) g.fillRect(x, 56, 2, 2) });
  // pictures for the walls round the house: all different now
  const art = (name, fn) => tex(name, 64, fn);
  art('art_sea', (g, s) => { const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, '#f0c8a0'); gr.addColorStop(.5, '#f8e0c0'); gr.addColorStop(.52, '#3a6a8a'); gr.addColorStop(1, '#1a3a5a'); g.fillStyle = gr; g.fillRect(0, 0, s, s); g.fillStyle = '#fff4d8'; g.beginPath(); g.arc(44, 28, 6, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.4)'; for (let i = 0; i < 8; i++) g.fillRect(4 + i * 7, 40 + (i % 3) * 5, 5, 1) });
  art('art_hills', (g, s) => { g.fillStyle = '#a8c8e0'; g.fillRect(0, 0, s, s); g.fillStyle = '#6a8a5a'; g.beginPath(); g.moveTo(0, 40); g.quadraticCurveTo(20, 24, 40, 38); g.quadraticCurveTo(54, 30, 64, 36); g.lineTo(64, 64); g.lineTo(0, 64); g.fill(); g.fillStyle = '#4a6a3a'; g.beginPath(); g.moveTo(0, 52); g.quadraticCurveTo(30, 40, 64, 50); g.lineTo(64, 64); g.lineTo(0, 64); g.fill(); g.fillStyle = '#fff'; g.fillRect(10, 10, 10, 3); g.fillRect(14, 8, 8, 3) });
  art('art_blocks', (g, s) => { g.fillStyle = '#2a1a1a'; g.fillRect(0, 0, s, s); g.fillStyle = '#b04a2a'; g.fillRect(6, 6, 52, 24); g.fillStyle = '#e0a040'; g.fillRect(6, 34, 52, 8); g.fillStyle = '#5a2a3a'; g.fillRect(6, 46, 52, 12) });
  art('art_moon', (g, s) => { g.fillStyle = '#0e1430'; g.fillRect(0, 0, s, s); g.fillStyle = '#f0ecd0'; g.beginPath(); g.arc(46, 16, 7, 0, 7); g.fill(); g.fillStyle = '#0e1430'; g.beginPath(); g.arc(49, 14, 6, 0, 7); g.fill(); g.fillStyle = '#1e2a4a'; g.beginPath(); g.moveTo(0, 50); g.lineTo(18, 30); g.lineTo(34, 48); g.lineTo(50, 34); g.lineTo(64, 50); g.lineTo(64, 64); g.lineTo(0, 64); g.fill(); g.fillStyle = '#fff'; for (let i = 0; i < 14; i++) g.fillRect(R() * 64, R() * 28, 1, 1) });
  art('art_vase', (g, s) => { g.fillStyle = '#d8ccb0'; g.fillRect(0, 0, s, s); g.fillStyle = '#8a6a4a'; g.fillRect(0, 48, s, 16); g.fillStyle = '#3a5a8a'; g.beginPath(); g.ellipse(32, 40, 9, 12, 0, 0, 7); g.fill(); g.fillRect(29, 24, 6, 8); for (const [x, y, c] of [[24, 16, '#c83a3a'], [32, 12, '#e8c040'], [40, 17, '#c83a6a'], [28, 22, '#e8e0d0'], [37, 23, '#c83a3a']]) { g.fillStyle = c; g.beginPath(); g.arc(x, y, 4, 0, 7); g.fill() } });
  art('art_boat', (g, s) => { g.fillStyle = '#8ab0c8'; g.fillRect(0, 0, s, 34); g.fillStyle = '#2a5a7a'; g.fillRect(0, 34, s, 30); g.fillStyle = '#f4f0e0'; g.beginPath(); g.moveTo(30, 12); g.lineTo(30, 34); g.lineTo(44, 34); g.fill(); g.fillStyle = '#6a3a2a'; g.fillRect(22, 34, 26, 4) });
  art('art_forest', (g, s) => { g.fillStyle = '#c8d0b0'; g.fillRect(0, 0, s, s); for (let i = 0; i < 9; i++) { const x = 4 + i * 7 + R() * 3, h = 26 + R() * 18; g.fillStyle = i % 2 ? '#2a4a2a' : '#3a5a32'; g.beginPath(); g.moveTo(x, 60 - h); g.lineTo(x + 6, 60); g.lineTo(x - 6, 60); g.fill() } g.fillStyle = '#5a4a3a'; g.fillRect(0, 60, s, 4) });
  art('art_field', (g, s) => { g.fillStyle = '#7aa8e0'; g.fillRect(0, 0, s, 30); g.fillStyle = '#e0c048'; g.fillRect(0, 30, s, 34); g.fillStyle = '#c8a030'; for (let i = 0; i < 40; i++) g.fillRect(R() * 64, 32 + R() * 30, 1, 3); g.fillStyle = '#fff'; g.beginPath(); g.arc(14, 12, 6, 0, 7); g.arc(22, 12, 7, 0, 7); g.fill() });
  art('art_abstract', (g, s) => { g.fillStyle = '#e8e0d0'; g.fillRect(0, 0, s, s); g.strokeStyle = '#1a1a1a'; g.lineWidth = 2; g.beginPath(); g.arc(24, 30, 14, 0, 5); g.stroke(); g.fillStyle = '#c83a2a'; g.fillRect(36, 10, 18, 18); g.fillStyle = '#2a4a9a'; g.beginPath(); g.arc(44, 46, 8, 0, 7); g.fill() });
  // Hikari's own posters: softer than her sister's
  art('hk_p1', (g, s) => { const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, '#f8c8d8'); gr.addColorStop(1, '#a8a0e0'); g.fillStyle = gr; g.fillRect(0, 0, s, s); g.fillStyle = '#fff8e0'; g.beginPath(); g.arc(44, 18, 9, 0, 7); g.fill(); g.fillStyle = '#3a2a4a'; g.beginPath(); g.ellipse(24, 46, 8, 14, 0, 0, 7); g.fill(); g.beginPath(); g.arc(24, 30, 6, 0, 7); g.fill(); g.fillStyle = '#fff'; g.fillRect(6, 58, 52, 2) });
  art('hk_p2', (g, s) => { g.fillStyle = '#f0ead8'; g.fillRect(0, 0, s, s); g.strokeStyle = '#3a6a3a'; g.lineWidth = 2; g.beginPath(); g.moveTo(32, 60); g.quadraticCurveTo(30, 30, 34, 6); g.stroke(); for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? '#5a8a4a' : '#7aa85a'; g.beginPath(); g.ellipse(32 + (i % 2 ? 9 : -9), 14 + i * 7, 8, 3.5, i % 2 ? -.5 : .5, 0, 7); g.fill() } g.fillStyle = '#5a4a3a'; g.fillRect(8, 58, 20, 1) });
  art('hk_p3', (g, s) => { g.fillStyle = '#5a1018'; g.fillRect(0, 0, s, s); g.fillStyle = '#f0c8a0'; g.beginPath(); g.arc(32, 26, 16, 0, 7); g.fill(); g.fillStyle = '#5a1018'; g.beginPath(); g.arc(32, 26, 9, 0, 7); g.fill(); g.fillStyle = '#f0e0d0'; for (let i = 0; i < 3; i++) g.fillRect(10, 48 + i * 5, 44 - i * 10, 2) });
  art('hk_p4', (g, s) => { g.fillStyle = '#0e1a3a'; g.fillRect(0, 0, s, s); g.fillStyle = '#fff'; for (let i = 0; i < 40; i++) g.fillRect(R() * 64, R() * 64, 1, 1); g.strokeStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.moveTo(10, 14); g.lineTo(22, 22); g.lineTo(30, 18); g.lineTo(42, 30); g.lineTo(52, 26); g.stroke(); g.fillStyle = '#e8d8a0'; g.fillRect(8, 56, 48, 2) });
  art('hk_p5', (g, s) => { g.fillStyle = '#f4e8c8'; g.fillRect(0, 0, s, s); g.fillStyle = '#e86a3a'; g.beginPath(); g.arc(32, 34, 14, Math.PI, 0); g.fill(); g.fillStyle = '#3a8ab0'; g.fillRect(0, 34, s, 30); g.fillStyle = '#f4e8c8'; for (let i = 0; i < 4; i++) g.fillRect(6 + i * 14, 42 + i * 4, 10, 1); g.fillStyle = '#3a2a2a'; g.fillRect(8, 6, 30, 3) });
  // Hitori's: the two you gave (loaded below), and two of her own
  art('hi_p1', (g, s) => { g.fillStyle = '#060608'; g.fillRect(0, 0, s, s); g.fillStyle = '#e8e8f0'; g.beginPath(); g.ellipse(32, 30, 18, 9, 0, 0, 7); g.fill(); g.fillStyle = '#c81a3a'; g.beginPath(); g.arc(32, 30, 7, 0, 7); g.fill(); g.fillStyle = '#060608'; g.beginPath(); g.arc(32, 30, 3, 0, 7); g.fill(); for (let y = 0; y < s; y += 3) { g.fillStyle = 'rgba(255,255,255,' + (R() * .08) + ')'; g.fillRect((R() - .5) * 6, y, s, 1) } g.fillStyle = '#c81a3a'; g.fillRect(6, 52, 30, 3) });
  art('hi_p2', (g, s) => { for (let y = 0; y < s; y++) for (let x = 0; x < s; x += 2) { const v = (R() * 90) | 0; g.fillStyle = 'rgb(' + v + ',' + v + ',' + (v + 10) + ')'; g.fillRect(x, y, 2, 1) } g.fillStyle = '#ff5ab0'; g.fillRect(8, 26, 48, 6); g.fillStyle = '#000'; g.fillRect(10, 27, 44, 4); g.fillStyle = '#ff5ab0'; for (let i = 0; i < 6; i++) g.fillRect(12 + i * 7, 28, 4, 2) });
  // the calendar by her desk: November, the 3rd circled
  tex('calendar', 64, (g, s) => { g.fillStyle = '#f4f0e8'; g.fillRect(0, 0, s, s); g.fillStyle = '#8ab0d8'; g.fillRect(0, 0, s, 22); g.fillStyle = '#fff'; g.beginPath(); g.ellipse(16, 11, 7, 5, 0, 0, 7); g.ellipse(26, 9, 5, 4, 0, 0, 7); g.fill();
    g.fillStyle = '#c83a3a'; g.fillRect(0, 22, s, 6); g.fillStyle = '#fff'; g.fillRect(22, 24, 20, 2);
    g.fillStyle = '#9a9a9a'; for (let r2 = 0; r2 < 5; r2++) for (let c = 0; c < 7; c++) g.fillRect(3 + c * 8.5, 31 + r2 * 6.5, 6, 4);
    g.strokeStyle = '#d02040'; g.lineWidth = 1.5; g.beginPath(); g.ellipse(3 + 1 * 8.5 + 3, 33, 5, 3.5, 0, 0, 7); g.stroke(); g.fillStyle = '#d02040'; g.fillRect(14, 28.5, 2, 2) });
  // the posters you gave: drawn in when they've loaded
  if (typeof P2POSTERS_SRC != 'undefined') for (const k in P2POSTERS_SRC) { const T = tex(k, 128, (g, s) => { g.fillStyle = '#111'; g.fillRect(0, 0, s, s) }); const im = new Image(); im.onload = () => { T.g.drawImage(im, 0, 0, 128, 128); T.dirty = 1 }; im.src = P2POSTERS_SRC[k] }
}

// ---------------------------------------------------------------- pictures on the walls: no two the same, none on top of each other or over a door
const ART_POOL = ['art_sea', 'art_hills', 'art_blocks', 'art_moon', 'art_vase', 'art_boat', 'art_forest', 'art_field', 'art_abstract', 'painting'];
const FRAMES62 = []; let artNext = 0, HORNED62 = null;
const _mFrame62 = mFrame;
mFrame = function (mb, t, face, cx, cy, cz, w, h, frame) {
  if (!FR62on) return _mFrame62.apply(this, arguments);   // only while the house is being built
  // where it will really end up (the old plan is moved onto the new one)
  let p = [cx, cy, cz]; if (mb.M) p = M4.pt(mb.M, p); if (LAYOUT.on && !LAYOUT.raw) { const q = LM(p[0], p[2], p[1]); p = [q[0], p[1], q[1]] }
  const ax = face == 'n' || face == 's' ? 'x' : 'z', u = ax == 'x' ? p[0] : p[2], pl = ax == 'x' ? p[2] : p[0];
  if (t) {
    const room = p[1] > 3 && p[0] > 11.3 ? (p[2] < 6.4 ? 'hikari' : 'hitori') : null;
    if (room == 'hitori') t = { poster2: 'upost1', poster4: 'upost2', poster5: 'hi_p1', poster3: 'horned' }[t] || t;
    else if (room == 'hikari') t = { poster2: 'hk_p1', poster5: 'hk_p2', poster4: 'hk_p3' }[t] || t;
    else if (t == 'painting' || t == 'poster3' || t == 'poster2') t = ART_POOL[artNext++ % ART_POOL.length];
    if (t == 'upost1' || t == 'upost2' || t == 'horned') { const m = Math.max(w, h) * .92; w = h = m }
    if (room == 'hitori' && t == 'horned') return;   // that spot is behind her wardrobe: the horned picture is hung in v62House instead
    // skip it if it would overlap a picture already on that wall, or hang over a doorway
    const r = { face, ax, pl, u0: u - w / 2 - .06, u1: u + w / 2 + .06, y0: p[1] - h / 2 - .06, y1: p[1] + h / 2 + .06 };
    if (FRAMES62.some(o => o.ax == ax && Math.abs(o.pl - pl) < .2 && o.u0 < r.u1 && r.u0 < o.u1 && o.y0 < r.y1 && r.y0 < o.y1)) return;
    for (const d of H3.doors) { const dax = d.along, dpl = dax == 'x' ? d.hz : d.hx, d0 = dax == 'x' ? d.hx : d.hz; if (dax == ax && Math.abs(dpl - pl) < .3 && d0 - .1 < r.u1 && r.u0 < d0 + DOORW + .1 && d.y < r.y1 && r.y0 < d.y + DOORH + .1) return }
    FRAMES62.push(r);
  }
  return _mFrame62.call(this, mb, t, face, cx, cy, cz, w, h, frame);
};
let FR62on = 0;
const WINDOWS62 = [['n', 2.8, 1.6, 13.94, 1.6, 1.2], ['e', .06, 1.75, 13, .9, 1], ['w', 16.34, 1.75, 7.5, .9, .7], ['w', 16.34, 4.5, 12.95, 1.3, 1.3], ['w', 16.34, 4.5, 2.73, 1.1, 1.2], ['e', .06, 4.55, 13.1, 1.1, 1.1], ['n', 2.8, 4.5, 13.94, 1.2, 1.1]];
const _buildHouse62 = buildHouse;
buildHouse = function () {
  const was = H3.built; if (!was) { FRAMES62.length = 0; artNext = 0; FR62on = 1;
    // the windows (where they land on the new plan): no pictures hung over them
    for (const [face, x, y, z, w, h] of WINDOWS62) { const ax = face == 'n' || face == 's' ? 'x' : 'z', u = ax == 'x' ? x : z; FRAMES62.push({ ax, pl: ax == 'x' ? z : x, u0: u - w / 2 - .25, u1: u + w / 2 + .25, y0: y - h / 2 - .2, y1: y + h / 2 + .2 }) } }
  try { _buildHouse62() } finally { FR62on = 0 }
  if (!was) v62House();
};

// ---------------------------------------------------------------- things added to the finished house
function v62House() {
  v62Tex(); const mb = new MB(), Y = 3;
  // blinds with gaps between the slats, so the city shows through
  tex('blinds', 32, (g, s) => { g.clearRect(0, 0, s, s); for (let y = 0; y < s; y += 4) { g.fillStyle = '#7a7a80'; g.fillRect(0, y, s, 3); g.fillStyle = '#5a5a60'; g.fillRect(0, y + 2, s, 1) } });
  // the calendar by her desk (the password clue), and more posters in both girls' rooms
  mb.decal('calendar', 16.33, Y + 1.55, 10.75, .34, .4, 'w', [1, 1, 1, .15]); mb.box('darkplastic', 16.33, Y + 1.76, 10.74, 16.34, Y + 1.78, 10.76);
  inter('calendar', [16.1, Y + 1.3, 10.5, 16.4, Y + 1.8, 11.0], 'Calendar', () => say3(['|A cat calendar, still on November. The 3rd is circled in red.', '|In her handwriting: "Mochi came home ♡ 03.11"']));
  const poster = (t, face, x, y, z, w, h) => { const r = { ax: face == 'n' || face == 's' ? 'x' : 'z' }; _mFrame62(mb, t, face, x, y, z, w, h, 'darkplastic') };
  poster('hk_p4', 's', 15.4, Y + 1.75, .075, .42, .56); poster('hk_p5', 'n', 15.2, Y + 1.7, 6.335, .42, .56);
  // Hikari's room: the glitched poster from Hitori's wall, and the one the horned picture replaced
  poster('poster', 'w', 16.325, Y + 1.8, 5.15, .42, .55); poster('hi_p2', 'w', 16.325, Y + 1.75, 4.3, .4, .54);
  // the horned picture in Hitori's room: "It's me."
  poster('horned', 'w', 16.325, Y + 1.72, 9.0, .5, .5); HORNED62 = [16.325, Y + 1.72, 9.0, 'w'];
  if (HORNED62) { const [hx, hy, hz, f] = HORNED62, ex = f == 'e' || f == 'w' ? .25 : .3, ez = f == 'n' || f == 's' ? .25 : .3;
    inter('horned', [hx - ex, hy - .35, hz - ez, hx + ex, hy + .35, hz + ez], 'Poster', () => say3(['Hitori|It\'s me.'])) }
  H3.extra.v62 = mb.build();
  // Hikari, in the last ending: you can talk to her wherever she's standing
  H3.hikInter = inter('hikari_npc', [0, 0, 0, 0, 0, 0], 'Hikari', () => homeTalk(), () => !!(P2.npc && P2.f && P2.f.follow));
  buildCity();
}

// ---------------------------------------------------------------- the city
// the city: like the reference you sent. Lower blocks round the house, then the river, then a skyline of tall thin towers:
// blue-white windows, glowing edges, huge screen adverts up their sides, bridges between them, flying cars
function cityTex() {
  if (TX.ct1) return; const R = rng(631);
  // tower glass: fine grid of small windows, mostly cold blue-white, a few warm; faint floor lines
  const glass = (name, base, lit, cols, fl) => tex(name, 64, (g, s) => {
    g.fillStyle = base; g.fillRect(0, 0, s, s);
    for (let y = 0; y < s; y += 2) { if (fl && y % 8 == 0) { g.fillStyle = fl; g.fillRect(0, y, s, 1); continue } for (let x = 0; x < s; x += 2) { if (R() < lit) { g.fillStyle = cols[(R() * cols.length) | 0]; g.fillRect(x, y, 1, 1) } } } });
  glass('ct1', '#070a16', .38, ['#bfe0ff', '#88b8ff', '#e8f4ff', '#5a8cff'], 'rgba(90,140,255,.35)');
  glass('ct2', '#0a0716', .3, ['#d8b0ff', '#ff8ad8', '#b8c8ff', '#ffffff'], 'rgba(200,90,255,.3)');
  glass('ct3', '#05080e', .45, ['#a8f0ff', '#58d8ff', '#ffffff'], null);
  glass('ct4', '#0c0a10', .26, ['#ffd890', '#ffb060', '#bfe0ff'], 'rgba(255,170,90,.25)');
  // giant screen adverts (all made up): a face in magenta and teal, a column of glowing text, a logo, a model, a drink
  tex('ad_face', 64, (g, s, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2a0a5a'); gr.addColorStop(1, '#ff2a8a'); g.fillStyle = gr; g.fillRect(0, 0, s, h);
    g.fillStyle = '#ffd8e8'; g.beginPath(); g.ellipse(32, 62, 17, 22, 0, 0, 7); g.fill(); g.fillStyle = '#1a0830'; g.beginPath(); g.moveTo(10, 66); g.quadraticCurveTo(14, 30, 32, 34); g.quadraticCurveTo(52, 30, 56, 72); g.lineTo(52, 56); g.quadraticCurveTo(40, 44, 22, 50); g.closePath(); g.fill();
    g.fillStyle = '#30f0ff'; g.fillRect(22, 62, 7, 3); g.fillRect(36, 62, 7, 3); g.fillStyle = '#ff2a6a'; g.fillRect(29, 76, 7, 2); g.fillStyle = 'rgba(48,240,255,.6)'; for (let y = 0; y < h; y += 4) g.fillRect(0, y, s, 1); g.fillStyle = '#fff'; g.fillRect(6, 104, 52, 4); g.fillRect(6, 112, 34, 3) }, 128);
  tex('ad_text', 32, (g, s, h) => { g.fillStyle = '#04060c'; g.fillRect(0, 0, s, h); const c = ['#30f0ff', '#ff3aa0', '#ffd23a']; for (let y = 4; y < h - 4; y += 9) { g.fillStyle = c[(y / 9 | 0) % 3]; g.fillRect(8 + (R() * 4 | 0), y, 12 + (R() * 6 | 0), 5); g.fillStyle = '#04060c'; g.fillRect(12, y + 2, 3, 3) } g.strokeStyle = '#30f0ff'; g.strokeRect(1, 1, s - 2, h - 2) }, 128);
  tex('ad_logo', 64, (g, s) => { g.fillStyle = '#0a0418'; g.fillRect(0, 0, s, s); g.strokeStyle = '#ff3aa0'; g.lineWidth = 4; g.beginPath(); g.arc(32, 28, 16, 0, 7); g.stroke(); g.strokeStyle = '#30f0ff'; g.beginPath(); g.moveTo(16, 28); g.lineTo(48, 28); g.stroke(); g.fillStyle = '#fff'; g.fillRect(12, 50, 40, 5) });
  tex('ad_model', 64, (g, s, h) => { g.fillStyle = '#081830'; g.fillRect(0, 0, s, h); g.fillStyle = '#30f0ff'; g.beginPath(); g.ellipse(32, 40, 13, 16, 0, 0, 7); g.fill(); g.fillStyle = '#08304a'; g.fillRect(14, 54, 36, 60); g.fillStyle = '#ff7ae0'; g.fillRect(14, 54, 36, 6); g.fillStyle = '#fff'; g.fillRect(8, 8, 30, 6) }, 128);
  tex('ad_drink', 32, (g, s, h) => { g.fillStyle = '#ffd23a'; g.fillRect(0, 0, s, h); g.fillStyle = '#c81a3a'; g.fillRect(9, 14, 14, 34); g.fillStyle = '#fff'; g.fillRect(11, 24, 10, 4); g.fillStyle = '#1a0a0a'; g.fillRect(4, 52, 24, 6) }, 64);
  tex('cwater', 64, (g, s) => { g.fillStyle = '#04050c'; g.fillRect(0, 0, s, s); for (let i = 0; i < 70; i++) { const c = ['#3a5aff', '#ff3aa0', '#30f0ff', '#ffd890'][(R() * 4) | 0]; g.fillStyle = c; g.globalAlpha = .3 + R() * .5; g.fillRect(R() * s, R() * s, 1 + R() * 3, 1) } g.globalAlpha = 1 });
}
function buildCity() {
  if (CITY.obj) return; cityTex();
  const mb = new MB(), R = rng(777), E = [1, 1, 1, 1], LOW = ['cw1', 'cw4', 'cw3'], HIGH = ['ct1', 'ct1', 'ct2', 'ct3', 'ct4'];
  const NE = [[.3, .95, 1, 1], [1, .25, .7, 1], [.75, .5, 1, 1], [1, 1, 1, 1], [1, .82, .3, 1]];
  const faceTo = (x, z) => Math.abs(x - 8) > Math.abs(z - 7) ? (x > 8 ? 'w' : 'e') : (z > 7 ? 'n' : 's');
  // a low block in the neighbourhood: flats with shops, a sign or two
  const low = (x, z, w, d, h) => {
    const f = LOW[(R() * LOW.length) | 0]; mb.box(f, x - w / 2, 0, z - d / 2, x + w / 2, h, z + d / 2, { us: 14, col: E, tf: { t: 'cwtop' } });
    mb.box('cshop', x - w / 2 - .02, 0, z - d / 2 - .02, x + w / 2 + .02, 4, z + d / 2 + .02, { us: 8, col: E, skip: 'tb' });
    const fc = faceTo(x, z); for (let i = 0; i < 2; i++) { const sh = 3 + R() * 6, sw = sh * (R() < .5 ? .35 : .9), sy = 5 + R() * Math.max(1, h - sh - 6), off = (R() - .5) * (fc == 'n' || fc == 's' ? w : d) * .6, t = 'neon' + ((R() * 6) | 0);
      if (fc == 'n') mb.decal(t, x + off, sy, z - d / 2 - .3, sw, sh, 'n', E); else if (fc == 's') mb.decal(t, x + off, sy, z + d / 2 + .3, sw, sh, 's', E); else if (fc == 'w') mb.decal(t, x - w / 2 - .3, sy, z + off, sw, sh, 'w', E); else mb.decal(t, x + w / 2 + .3, sy, z + off, sw, sh, 'e', E) }
  };
  // a skyline tower: slim, very tall, glowing edges, sometimes a giant screen up its side, a crown of light on top
  const tower = (x, z, w, d, h) => {
    const f = HIGH[(R() * HIGH.length) | 0], us = 30 + R() * 20; mb.box(f, x - w / 2, 0, z - d / 2, x + w / 2, h, z + d / 2, { us, col: E, tf: { t: 'cwtop' } });
    const ec = NE[(R() * NE.length) | 0], e2 = .35; for (const [ax, az] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) if (R() < .7) mb.box('white', x + ax * w / 2 - e2, h * .05, z + az * d / 2 - e2, x + ax * w / 2 + e2, h, z + az * d / 2 + e2, { col: ec });
    // setbacks
    let hh = h; for (let k = 0; k < 2 && R() < .7; k++) { const sw = w * (.6 - k * .15), sd = d * (.6 - k * .15), ex = h * (.12 + R() * .2); mb.box(f, x - sw / 2, hh, z - sd / 2, x + sw / 2, hh + ex, z + sd / 2, { us, col: E, tf: { t: 'cwtop' } }); mb.box('white', x - sw / 2 - .3, hh + ex - 1.2, z - sd / 2 - .3, x + sw / 2 + .3, hh + ex - .2, z + sd / 2 + .3, { col: ec, skip: 'tb' }); hh += ex }
    if (R() < .6) { mb.box('darkplastic', x - .6, hh, z - .6, x + .6, hh + h * .18, z + .6); mb.box('white', x - 1.4, hh + h * .18, z - 1.4, x + 1.4, hh + h * .18 + 2.4, z + 1.4, { col: [1, .12, .12, 1] }) }
    // vertical light lines running up the face that looks towards the house (like the reference towers)
    if (R() < .55 && h > 90) { const fc = faceTo(x, z), n = 1 + ((R() * 4) | 0), c = NE[(R() * NE.length) | 0], along = fc == 'n' || fc == 's' ? w : d;
      for (let i = 0; i < n; i++) { const u = (i + 1) / (n + 1) - .5, t0 = h * (.08 + R() * .2), t1 = h * (.75 + R() * .25), k = .25;
        if (fc == 'n') mb.box('white', x + u * along - k, t0, z - d / 2 - .6, x + u * along + k, t1, z - d / 2 - .1, { col: c });
        else if (fc == 's') mb.box('white', x + u * along - k, t0, z + d / 2 + .1, x + u * along + k, t1, z + d / 2 + .6, { col: c });
        else if (fc == 'w') mb.box('white', x - w / 2 - .6, t0, z + u * along - k, x - w / 2 - .1, t1, z + u * along + k, { col: c });
        else mb.box('white', x + w / 2 + .1, t0, z + u * along - k, x + w / 2 + .6, t1, z + u * along + k, { col: c }) } }
    // lit floor bands every so often
    if (R() < .35) for (let y = h * .2; y < h * .9; y += 18 + R() * 30) mb.box('white', x - w / 2 - .2, y, z - d / 2 - .2, x + w / 2 + .2, y + .8, z + d / 2 + .2, { col: [.55, .75, 1, 1], skip: 'tb' });
    // a huge screen on the side that faces the house
    if (R() < .45 && h > 120) { const fc = faceTo(x, z), t = ['ad_face', 'ad_text', 'ad_model', 'ad_logo', 'ad_drink'][(R() * 5) | 0], ah = Math.min(h * .5, 40 + R() * 80), aw = t == 'ad_text' || t == 'ad_drink' ? ah * .28 : t == 'ad_logo' ? ah : ah * .5, ay = h * (.25 + R() * .3);
      const ww = Math.min(aw, (fc == 'n' || fc == 's' ? w : d) * 1.15);
      if (fc == 'n') mb.decal(t, x, ay, z - d / 2 - .8, ww, ah, 'n', E); else if (fc == 's') mb.decal(t, x, ay, z + d / 2 + .8, ww, ah, 's', E); else if (fc == 'w') mb.decal(t, x - w / 2 - .8, ay, z, ww, ah, 'w', E); else mb.decal(t, x + w / 2 + .8, ay, z, ww, ah, 'e', E) }
    return hh;
  };
  const clearOf = (x, z, w, d) => !(x + w / 2 > -6 && x - w / 2 < 23 && z + d / 2 > -7 && z - d / 2 < 33) && !(Math.abs(x - 7) < 13 && z > 0 && z < 110);
  // ground, the street out front, pavements, lamps, parked cars
  mb.box('cground', -2000, -.08, -2000, 2000, -.05, 2000, { skip: 'nsewb', us: 6 });
  mb.box('road', -700, -.05, 20, 700, .0, 30, { skip: 'nsewb', us: 10 });
  for (const [a, b] of [[18.4, 20], [30, 31.6]]) mb.box('cwalk', -700, 0, a, 700, .12, b, { us: 2 });
  mb.box('road', 2, -.05, 31.6, 12, .0, 112, { skip: 'nsewb', us: 10 });   // the side street down to the river
  mb.box('cwalk', -400, 0, 110, 400, .5, 116, { us: 2 }); for (let x = -400; x <= 400; x += 6) mb.box('white', x - .05, .5, 115.8, x + .05, 1.6, 115.9, { col: [.25, .25, .3, 0] }); mb.box('white', -400, 1.55, 115.75, 400, 1.62, 115.95, { col: [.3, .3, .34, 0] });   // the embankment and its railing
  mb.box('cwater', -2000, -1.2, 116, 2000, -1.1, 420, { skip: 'nsewb', us: 30, col: [1, 1, 1, .85] });   // the river, full of reflected lights
  const L = [];
  for (let x = -120; x <= 140; x += 16) for (const [z, s] of [[19.4, 1], [30.6, -1]]) { mb.box('darkplastic', x - .07, 0, z - .07, x + .07, 6, z + .07); mb.box('darkplastic', x - .05, 5.9, z, x + .05, 6, z + s * 1.2); mb.box('white', x - .25, 5.75, z + s * 1.1 - .12, x + .25, 5.85, z + s * 1.1 + .12, { col: [1, .85, .6, 1] }); L.push({ p: [x, 5.6, z + s * 1.1], c: [1, .72, .45], r: 14 }) }
  for (let z = 36; z < 108; z += 14) { mb.box('white', 1.5, 5.75, z - .1, 1.9, 5.85, z + .1, { col: [.7, .85, 1, 1] }); mb.box('darkplastic', 1.4, 0, z - .05, 1.5, 6, z + .05) }
  for (let i = 0; i < 14; i++) { const x = -90 + i * 13 + R() * 5, z = R() < .5 ? 21.2 : 28.8; const c = [[.25, .05, .08, 0], [.08, .1, .2, 0], [.15, .15, .17, 0], [.4, .35, .3, 0]][(R() * 4) | 0];
    if (x > -4 && x < 22) continue; mb.box('white', x - 2.1, .25, z - .9, x + 2.1, 1.05, z + .9, { col: c, bev: .15 }); mb.box('white', x - 1.2, 1.05, z - .8, x + 1.1, 1.55, z + .8, { col: [.05, .06, .09, 0], bev: .1 }); mb.box('white', x + 2.1, .7, z - .8, x + 2.14, .82, z - .5, { col: [1, .1, .1, 1] }); mb.box('white', x + 2.1, .7, z + .5, x + 2.14, .82, z + .8, { col: [1, .1, .1, 1] }) }
  // the neighbourhood: low, so the skyline shows over it from every window
  for (let x = -160; x < 180; x += 13 + R() * 8) for (const z of [-20, 44, 72, 96]) { const w = 10 + R() * 7, d = 11 + R() * 8, h = 8 + R() * 12; if (clearOf(x, z, w, d)) low(x, z + (R() - .5) * 5, w, d, h) }
  for (const x of [-15, -29, 31, 45]) low(x, 6, 10 + R() * 4, 16, 7 + R() * 8);
  for (let i = 0; i < 90; i++) { const a = R() * 6.283, rr = 70 + R() * 160, x = 8 + Math.cos(a) * rr, z = 7 + Math.sin(a) * rr, w = 12 + R() * 12, d = 12 + R() * 12; if (clearOf(x, z, w, d) && z < 110) low(x, z, w, d, 10 + R() * 26) }
  // across the river: the skyline. The tallest towers stand in the middle of the view from the front of the house
  const tops = [];
  for (let i = 0; i < 110; i++) { const x = (R() - .5) * (500 + i * 6), z = 440 + R() * 700, w = 18 + R() * 26, d = 18 + R() * 26, h = 120 + R() * 380 * (1 - Math.min(1, Math.abs(x) / 900)); tops.push([x, z, w, d, tower(x, z, w, d, h)]) }
  for (let i = 0; i < 14; i++) { const x = -200 + i * 30 + (R() - .5) * 20, z = 430 + R() * 40; tower(x, z, 14 + R() * 10, 14 + R() * 10, 260 + R() * 260) }
  // sky-bridges between neighbouring towers
  for (let i = 0; i < 26; i++) { const a = tops[(R() * tops.length) | 0], b = tops.reduce((m, t) => t != a && Math.hypot(t[0] - a[0], t[1] - a[1]) < (m ? Math.hypot(m[0] - a[0], m[1] - a[1]) : 1e9) ? t : m, null); if (!b) continue;
    const y = Math.min(a[4], b[4]) * (.3 + R() * .4), c = NE[(R() * NE.length) | 0]; mb.box('white', Math.min(a[0], b[0]), y, (a[1] + b[1]) / 2 - 2, Math.max(a[0], b[0]), y + 3, (a[1] + b[1]) / 2 + 2, { col: [.05, .05, .08, 0] }); mb.box('white', Math.min(a[0], b[0]), y + 3, (a[1] + b[1]) / 2 - 2.2, Math.max(a[0], b[0]), y + 3.4, (a[1] + b[1]) / 2 + 2.2, { col: c }) }
  // behind the house and to the sides: more of the city, further off
  for (let i = 0; i < 70; i++) { const a = Math.PI + R() * Math.PI, rr = 300 + R() * 900, x = Math.cos(a) * rr, z = Math.sin(a) * rr * .8, w = 24 + R() * 30; tower(x, z, w, w, 90 + R() * 260) }
  // the arcology on the far left of the skyline, and the elevated highway behind the house
  for (let i = 0; i < 6; i++) { const s2 = 300 - i * 46; mb.box('ct1', -620 - s2 / 2, i * 80, 900 - s2 / 2, -620 + s2 / 2, i * 80 + 80, 900 + s2 / 2, { us: 40, col: E, tf: { t: 'cwtop' } }); mb.box('white', -620 - s2 / 2 - 1, i * 80 + 78, 900 - s2 / 2 - 1, -620 + s2 / 2 + 1, i * 80 + 80, 900 + s2 / 2 + 1, { col: [1, .3, .7, 1], skip: 'tb' }) }
  mb.box('hwy', -900, 16, -70, 900, 18, -58, { us: 10, col: [1, 1, 1, .6] }); for (let x = -900; x <= 900; x += 40) mb.box('cwtop', x - 1, 0, -66, x + 1, 16, -62);
  // ---- more depth: towers either side of the river, a far hazy wall of silhouettes, ring towers, platforms of billboards
  for (let i = 0; i < 60; i++) { const side = R() < .5 ? -1 : 1, x = side * (220 + R() * 700), z = 140 + R() * 300, w = 16 + R() * 22; tower(x, z, w, w * (.8 + R() * .5), 70 + R() * 220) }
  for (let i = 0; i < 90; i++) { const x = (R() - .5) * 3200, z = 1250 + R() * 900, w = 40 + R() * 80, h = 150 + R() * 500; mb.box(R() < .5 ? 'ct3' : 'ct1', x - w / 2, 0, z - w / 2, x + w / 2, h, z + w / 2, { us: 60, col: [.55, .6, .8, .4], tf: { t: 'cwtop' } }); if (R() < .4) mb.box('white', x - .8, h, z - .8, x + .8, h + 6, z + .8, { col: [1, .15, .15, 1] }) }
  // cylinder towers ringed with light
  for (let i = 0; i < 9; i++) { const x = -420 + i * 105 + (R() - .5) * 40, z = 470 + R() * 300, rr = 9 + R() * 8, h = 160 + R() * 260, c = NE[(R() * NE.length) | 0];
    mb.lathe('ct2', [[rr, 0], [rr, h]], { cx: x, cz: z, seg: 12, ur: 6, vr: .03, col: E }); for (let y = h * .3; y < h; y += 14 + R() * 20) mb.lathe('white', [[rr + .8, y], [rr + .8, y + 1.6]], { cx: x, cz: z, seg: 12, col: c });
    mb.lathe('white', [[rr * .6, h], [rr * .6, h + 10], [0, h + 14]], { cx: x, cz: z, seg: 8, col: [1, .35, .75, 1] }) }
  // billboards up on poles and platforms, between the neighbourhood and the river
  for (let i = 0; i < 12; i++) { const x = -150 + i * 30 + (R() - .5) * 14, z = 60 + R() * 45, h = 16 + R() * 18, bw = 10 + R() * 8, t = ['ad_face', 'ad_model', 'ad_logo', 'holo0', 'holo1', 'holo2'][(R() * 6) | 0];
    if (Math.abs(x - 7) < 14) continue; mb.box('darkplastic', x - .3, 0, z - .3, x + .3, h, z + .3); mb.box('darkplastic', x - bw / 2 - .4, h - .2, z - .6, x + bw / 2 + .4, h + bw * .6 + .4, z - .2); mb.decal(t, x, h + bw * .3, z - .62, bw, bw * .6, 'n', E) }
  // street level: vertical neon banners on the flats along the street, lit shop awnings, cables overhead
  for (let x = -130; x < 150; x += 9 + R() * 9) for (const [zf, f] of [[-12.6, 's'], [36.4, 'n']]) { if (Math.abs(x - 8) < 15) continue; if (R() < .6) { const t = 'neon' + ((R() * 6) | 0), hh = 4 + R() * 5; mb.decal(t, x, 5 + hh / 2 + R() * 4, zf + (f == 's' ? .35 : -.35), 1.2 + R() * .8, hh, f, E) }
    if (R() < .5) { const c = NE[(R() * NE.length) | 0]; mb.box('white', x - 2, 3.4, f == 's' ? zf : zf - 1.4, x + 2, 3.6, f == 's' ? zf + 1.4 : zf, { col: c }) } }
  for (let x = -120; x <= 140; x += 16) { const a = [x, 5.8, 20.6], b = [x + 16, 5.8, 20.6]; mb.box('darkplastic', a[0], 5.3 - Math.sin(.5) * .3, 20.55, b[0], 5.36, 20.65); mb.box('darkplastic', x, 5.8, 20.6, x + .05, 5.85, 29.4) }
  const o = mb.build(); o.vis = true; CITY.obj = o; CITY.lamps = L;
  CITY.movers = [];
  for (let i = 0; i < 40; i++) { const m = single(q => { q.box('white', -1.6, -.4, -.8, 1.6, .4, .8, { col: [.12, .12, .16, 0], bev: .2 }); q.box('white', 1.6, -.2, -.6, 1.7, .1, .6, { col: [1, .95, .8, 1] }); q.box('white', -1.7, -.2, -.6, -1.6, .1, .6, { col: [1, .1, .2, 1] }); q.box('white', -1.2, -.5, -.7, 1.2, -.42, .7, { col: [.2, .8, 1, 1] }) });
    CITY.movers.push({ obj: m, r: 80 + R() * 400, h: 30 + R() * 200, sp: (R() < .5 ? -1 : 1) * (.0006 + R() * .0012), a: R() * 6.283, cx: (R() - .5) * 400, cz: 300 + R() * 500 }) }
}
function cityTick() { for (const m of CITY.movers) { m.a += m.sp; const x = m.cx + Math.cos(m.a) * m.r, z = m.cz + Math.sin(m.a) * m.r; m.obj.M = M4.mul(M4.tr(x, m.h + Math.sin(m.a * 3) * 2, z), M4.ry(-m.a + (m.sp > 0 ? -HP : HP))) } }
function cityParams() {
  const day = P2.day == 2 || (P2.day == 5 && !P2.f.evening);
  const near = (CITY.lamps || []).slice().sort((a, b) => Math.hypot(a.p[0] - CAM3.x, a.p[2] - CAM3.z) - Math.hypot(b.p[0] - CAM3.x, b.p[2] - CAM3.z)).slice(0, 6);
  if (day) return { fog: [.66, .7, .76], fogR: [40, 1100], amb: [.85, .85, .9], tint: [.72, .76, .82, .38], lights: [] };
  if (P2.day == 3) return { fog: [.12, .03, .05], fogR: [30, 900], amb: [.3, .14, .16], tint: [.4, 0, .05, .25], lights: near };
  return { fog: [.045, .04, .11], fogR: [90, 1900], amb: [.3, .26, .42], lights: near };
}
const _houseScene62 = houseScene;
houseScene = function () {
  const s = _houseScene62(); if (!s) return s; cityTick(); s.city = cityParams();
  if (P2.npc2) s.objs.push(...poseModel(hitoriModel(), P2.npc2, { head: true }));
  if (P2.outside) {   // out in the street: lit by the streetlamps, and the haze is the city's
    s.lights = [...(s.lights || []).slice(0, 2), ...s.city.lights]; s.amb = [.3, .27, .4]; s.fog = s.city.fog; s.fogR = [40, 400] }
  return s;
};
// every window looks out at the city now (the flat night picture was a stand-in)
const _mWindow62 = mWindow;
mWindow = function (mb, face, cx, cy, cz, w, h, o = {}) {
  _mWindow62(mb, face, cx, cy, cz, w, h, o);
  // the city, just behind the window's own picture (so blinds still show in front of it)
  const k = o.blinds ? -.003 : .003, n = { e: [1, 0], w: [-1, 0], s: [0, 1], n: [0, -1] }[face];   // in front of the old night picture; behind blinds (they have gaps now)
  mb.decal('cityview', cx + n[0] * k, cy, cz + n[1] * k, w, h, face, [1, 1, 1, 1]);
};

// ---------------------------------------------------------------- the bad ending: she walks to the doorway (it really opens) and sees
P2S.found = function () {
  P2.f.found = 1; const hd = H3.doors.find(d => d.id == 'hitori'); hd.locked = null; hd.to = 1; SFX3.door(true, hd);
  P2.cut = { k: 'found', t: 0, from: [CAM3.x, CAM3.z, CAM3.yaw, CAM3.pitch], door: [hd.hx - .55, hd.hz + DOORW / 2] };
};
const _foundCut62 = CUTS.found;
CUTS.found = function (c) {
  // the old version walked her to a spot on the old plan; this one walks her to her sister's door
  const t = c.t + 1, door = c.door || [10.85, 9.2], q = ease3(Math.min(1, t / 50));
  _foundCut62(c);
  PL3.x = c.from[0] + (door[0] - c.from[0]) * q; PL3.z = c.from[1] + (door[1] - c.from[1]) * q; PL3.y = 3;
  CAM3.x = PL3.x; CAM3.z = PL3.z; CAM3.y = PL3.y + GIRL.eye;
  if (t < 300) { const target = Math.atan2(-(HANG[0] - PL3.x), -(HANG[1] - PL3.z)); CAM3.yaw = c.from[2] + Math.atan2(Math.sin(target - c.from[2]), Math.cos(target - c.from[2])) * ease3(Math.min(1, t / 60)) }
};

// ---------------------------------------------------------------- the good ending: she comes down, they talk, they walk round the house, they go out
const HOME_ROOMS = {
  kitchen: ['Hikari|You did the dishes. Who are you and what have you done with my sister?', 'Hitori|...I did them once. Don\'t get used to it.'],
  living: ['Hikari|The TV\'s still on the same channel.', 'Hitori|I couldn\'t find the remote. For like a week.', 'Hikari|It\'s in the couch. It\'s always in the couch.'],
  hikari: ['Hikari|You kept my room the same.', 'Hitori|I couldn\'t go in. I opened the door a few times. That\'s it.', 'Hikari|...It smells like me in here. That\'s weird. Good weird.'],
  hitori: ['Hikari|Hitori. Your room.', 'Hitori|I know.', 'Hikari|We\'ll do it together. One bag at a time. Not today.'],
  parents: ['Hikari|Did they call?', 'Hitori|Once. I didn\'t pick up.', 'Hikari|We\'ll call them tomorrow. Both of us.'],
  bath0: ['Hikari|...You drew a heart on the mirror.', 'Hitori|It was there already. I think.'],
  ubath: ['Hikari|You drew a heart on the mirror.', 'Hitori|It was there when I got out of the shower. I thought it was you.', 'Hikari|...Maybe it was.']
};
const HOME_TALK = [
  ['Hikari|So. What did you eat while I was gone? Honestly.', 'Hitori|...Cereal. Dry. Out of the box.', 'Hikari|Oh my god.'],
  ['Hikari|Steven texted me. Like forty times.', 'Hitori|He texted me too. I didn\'t read them.', 'Hikari|Read them. He\'s been so worried he started baking. STEVEN. Baking.'],
  ['Hitori|Where did you go? When you left.', 'Hikari|Caroline\'s cousin\'s place. On the coast. I sat on a beach for three weeks and felt terrible.', 'Hitori|...Was it a nice beach?', 'Hikari|It was a really nice beach. That made it worse.'],
  ['Hikari|You know what I missed? The noise out there. The city never shuts up.', 'Hitori|I kept the blinds down. All the time.', 'Hikari|Then tonight we go out. Like we used to. Noodles, the bridge, all of it.'],
  ['Hitori|Hikari.', 'Hikari|Mm?', 'Hitori|I\'m still... not okay.', 'Hikari|I know. You don\'t have to be okay tonight. You just have to come with me.']
];
function homeTalk() {
  const f = P2.f, i = f.talks || 0; f.talks = i + 1;
  if (i < HOME_TALK.length) say3(HOME_TALK[i], () => homeCheckReady()); else say3(['Hikari|Come on. The city\'s waiting. Front door.']);
}
function homeCheckReady() { const f = P2.f; if (!f.ready && ((f.talks || 0) >= 3 || Object.keys(f.seenRooms || {}).length >= 3)) { f.ready = 1; say3(['Hikari|Hey. Let\'s get out of this house for a bit.', 'Hikari|Tonight. Like we used to.', 'Hitori|...Okay. Yeah.'], () => { P2.objective = 'Go out with Hikari. (The front door, downstairs.)' }) } }

// she waits upstairs; when you come to the stairs, the front door opens downstairs
CUTS.reunion = function (c) {
  const t = ++c.t, N = P2.npc, foot = [6.55, 0, 13.35];
  if (t == 1) { const fdI = H3.inter.find(i => i.id == 'frontdoor'), fd = fdI ? bc(fdI.box) : [8.7, 0, 14]; c.fd = fd; SFXN.doorOpen([fd[0], 1, HOUSE_D - .2]); P2.npc = { x: fd[0], y: 0, z: HOUSE_D - .5, yaw: PI, sit: 0, walk: 0, walkAmt: 0, t: 0, look: [0, 0] }; P2.objective = '';
    say3(['Hikari|Hitori? I\'m home!', 'Hikari|...I mean. I\'m back. Hi.']) }
  if (t == 50) SFXN.doorClose([c.fd[0], 1, HOUSE_D - .2], .35);
  const M = P2.npc; M.t++;
  // she walks in, round the newel post, to the foot of the stairs, and looks up at you
  if (t > 40 && !c.atFoot) { const tg = M.x > 7.6 ? [7.6, 13.35] : [foot[0], foot[2]], dx = tg[0] - M.x, dz = tg[1] - M.z, d = Math.hypot(dx, dz); if (d < .05) { if (tg[0] == foot[0]) c.atFoot = t } else { M.x += dx / d * Math.min(d, 1.1 / 60); M.z += dz / d * Math.min(d, 1.1 / 60); M.walk += .15; M.walkAmt = 1; M.yaw = Math.atan2(-dx, -dz) } }
  if (c.atFoot) { M.walkAmt = 0; M.yaw += (0 - M.yaw) * .1 }
  // you: walked down the stairs (the camera does it, slowly, looking at her)
  if (!c.from) c.from = [PL3.x, PL3.y, PL3.z];
  const path = [[6.55, 3, 5.7], [6.55, 3, 6.0], [6.55, houseFloor(6.55, 11.7, 1), 11.7]];
  if (t > 60 && c.from[1] > 2.5) { const k = clamp((t - 60) / 420, 0, 1), e = ease3(k), seg = e < .12 ? 0 : 1, a = seg ? path[1] : c.from, b = seg ? path[2] : path[0], kk = seg ? (e - .12) / .88 : e / .12;
    PL3.x = a[0] + (b[0] - a[0]) * kk; PL3.z = a[2] + (b[2] - a[2]) * kk; PL3.y = houseFloor(PL3.x, PL3.z, PL3.y) }
  CAM3.x = PL3.x; CAM3.z = PL3.z; CAM3.y = PL3.y + GIRL.eye + Math.sin(t / 9) * .015;
  const yawT = Math.atan2(-(M.x - CAM3.x), -(M.z - CAM3.z)), pitchT = Math.atan2(M.y + 1.45 - CAM3.y, Math.hypot(M.x - CAM3.x, M.z - CAM3.z) || 1);
  CAM3.yaw += Math.atan2(Math.sin(yawT - CAM3.yaw), Math.cos(yawT - CAM3.yaw)) * .05; CAM3.pitch += (pitchT - CAM3.pitch) * .05;
  if (t == 490) {
    const ch = P2.ch, p = p1Ch(), L = [];
    L.push('Hikari|...Hi.', 'Hitori|...Hi.', 'Hikari|You look awful.', 'Hitori|You too.');
    if (p.reassure || p.sorry || p.letgo) L.push('Hikari|I had the strangest dream on the train. You and Steven and Caroline, walking through a forest. You were looking for someone.', 'Hitori|...Uku. We were looking for Uku.', 'Hitori|I think it was you. I think it was always you.');
    else L.push('Hikari|I\'m sorry I left like that. I was so angry. I didn\'t think about what it would do to you.', 'Hitori|I don\'t remember most of the last few weeks. I\'m scared of what I did.');
    L.push('Hikari|We\'ll find out together. Okay?');
    if (ch.pill1 || ch.pill2 || ch.pillB) L.push('Hitori|I took my pills. I\'m going to keep taking them. You can nag me.', 'Hikari|Oh, I\'m going to be SO annoying about it.');
    L.push('Hitori|I want to call them. Steven, Caroline, Uku. To say sorry. Even if they don\'t pick up.', 'Hikari|Then we\'ll call. And if they don\'t pick up, we\'ll keep trying.', '|She comes up two steps and holds on, and doesn\'t let go for a long time.');
    say3(L, () => { c.hug = c.t });
  }
  if (c.hug) { const k = c.t - c.hug; P2.white = clamp(Math.min(k / 50, (130 - k) / 50), 0, .75);
    if (k == 140) { P2.white = 0; P2.cut = null; PL3.x = 6.55; PL3.z = 12.3; PL3.y = houseFloor(6.55, 12.3, 0); M.x = 6.55; M.z = 13.5; M.y = 0; P2.f.follow = 1; P2.f.trail = []; P2.f.seenRooms = {};
      say3(['Hikari|Okay. Okay. Show me what you did to the house.'], () => { P2.objective = 'Spend some time with Hikari. (Z to talk to her.)' }) } }
};
// she follows you round the house (along the way you walked, so she doesn't go through walls), and says things about the rooms
const _ambTick62 = p2AmbTick;
p2AmbTick = function () {
  if (P2.day == 5 && !P2.cut && !P2.ui && !P2.f.reunion && PL3.y > 2 && PL3.x > 5.6 && PL3.x < 9.6 && PL3.z < 7.4) { P2.f.reunion = 1; P2.cut = { k: 'reunion', t: 0 }; return }
  const f = P2.f, N = P2.npc;
  if (P2.day == 5 && f.follow && N && !P2.outside) {
    const tr = f.trail; const last = tr[tr.length - 1]; if (!last || Math.hypot(last[0] - PL3.x, last[2] - PL3.z) > .12) tr.push([PL3.x, PL3.y, PL3.z]);
    const d = Math.hypot(N.x - PL3.x, N.z - PL3.z); N.t++;
    if (d > 1.3 && tr.length > 1) { let tg = tr[0]; while (tr.length > 1 && Math.hypot(tg[0] - N.x, tg[2] - N.z) < .1) { tr.shift(); tg = tr[0] }
      const dx = tg[0] - N.x, dz = tg[2] - N.z, dd = Math.hypot(dx, dz) || 1, sp = Math.min(dd, (d > 3 ? 2.2 : 1.3) / 60); N.x += dx / dd * sp; N.z += dz / dd * sp; N.y += (tg[1] - N.y) * .3; N.walk += .16; N.walkAmt = 1; N.yaw = Math.atan2(-dx, -dz) }
    else { N.walkAmt = Math.max(0, N.walkAmt - .1); const yT = Math.atan2(-(PL3.x - N.x), -(PL3.z - N.z)); N.yaw += Math.atan2(Math.sin(yT - N.yaw), Math.cos(yT - N.yaw)) * .08; while (tr.length > 40) tr.shift() }
    N.look = [0, Math.atan2(PL3.y + GIRL.eye - (N.y + 1.45), d || 1)];
    const hb = H3.hikInter; if (hb) hb.box = [N.x - .3, N.y, N.z - .3, N.x + .3, N.y + 1.7, N.z + .3];
    const rm = roomAt(PL3.x, PL3.z, PL3.y + .1); if (rm && HOME_ROOMS[rm] && !f.seenRooms[rm] && !subsBusy()) { f.seenRooms[rm] = 1; say3(HOME_ROOMS[rm], () => homeCheckReady()) }
  }
  _ambTick62();
};
// the front door: on the last day, with Hikari, it's the way out
const _look62 = P2S.look;
P2S.look = function (k) { if (k == 'frontdoor' && v62FrontDoor()) return; return _look62.apply(this, arguments) };
function v62FrontDoor() {
  if (P2.day == 5 && P2.f.ready && !P2.cut) { P2.f.follow = 0; P2.objective = ''; P2.ui = { k: 'card', t: 0, text: 'That evening.', next: () => { P2.f.evening = 1; P2.cut = { k: 'cityend', t: 0 } } }; return true }
  return false;
}
// the walk out into the city: both of them, seen from behind, then the camera rises and the city opens up
CUTS.cityend = function (c) {
  const t = ++c.t;
  if (t == 1) { P2.outside = 1; H3.ext.vis = true; P2.hideBody = 1; P2.fade = 1; P2.fadeTo = 0; P2.blink = 0; P2.white = 0; AMB3.stop(); P2.silent = 1;
    P2.npc = { x: 8.2, y: 0, z: 14.6, yaw: PI, walk: 0, walkAmt: 1, t: 0, look: [0, 0] }; P2.npc2 = { x: 9.2, y: 0, z: 14.6, yaw: PI, walk: 1.5, walkAmt: 1, t: 0, look: [0, 0] };
    if (typeof SFXN != 'undefined' && SFXN.doorClose) SFXN.doorClose([8.7, 1, 14], .3) }
  // the path: out of the gate, to the pavement, then along it towards the side street and downtown
  const P = [[8.7, 14.6], [8.7, 19.2], [1.3, 19.2], [1.3, 34], [.9, 90]]   /* v77: across the zebra crossing and down the pavement of the side street */, L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
  const at = (s) => { for (let i = 1; i < P.length; i++) if (s <= L[i]) { const k = (s - L[i - 1]) / (L[i] - L[i - 1]); return [P[i - 1][0] + (P[i][0] - P[i - 1][0]) * k, P[i - 1][1] + (P[i][1] - P[i - 1][1]) * k, Math.atan2(-(P[i][0] - P[i - 1][0]), -(P[i][1] - P[i - 1][1]))] } return [...P[P.length - 1], PI] };
  const s = Math.min(L[L.length - 1], t * 1.15 / 60), A = at(s), side = [Math.cos(A[2]) * .45, -Math.sin(A[2]) * .45];
  for (const [N, k] of [[P2.npc, 1], [P2.npc2, -1]]) { N.x = A[0] + side[0] * k; N.z = A[1] + side[1] * k; N.yaw = A[2]; N.walk += .16; N.walkAmt = 1; N.t++; N.look = [k * -.35 * (Math.sin(t / 90) > .3 ? 1 : 0), 0] }
  // the camera: behind them, low; then up and back over the street until the whole city is in front of it
  const back = at(Math.max(0, s - 4.5)), up = clamp((t - 900) / 1000, 0, 1), e = up * up * (3 - 2 * up);
  const cx = back[0] - side[0] * 1.2, cz = back[1] - side[1] * 1.2;
  CAM3.x = cx + (cx - A[0]) * e * 4; CAM3.z = cz + (cz - A[1]) * e * 4 - e * 30; CAM3.y = 1.9 + e * 150;
  const ty = 1.4 + e * 110, tx = A[0] + e * 40, tz = A[1] + e * 520;
  CAM3.yaw = Math.atan2(-(tx - CAM3.x), -(tz - CAM3.z)); CAM3.pitch = Math.atan2(ty - CAM3.y, Math.hypot(tx - CAM3.x, tz - CAM3.z)); CAM3.roll = 0;
  if (t == 80) say3(['Hitori|It\'s so loud out here.', 'Hikari|You forgot what outside sounds like.', 'Hitori|...Kind of.']);
  if (t == 420) say3(['Hikari|The noodle place on Fourth is still open. The one with the broken sign.', 'Hitori|Where the O flickers?', 'Hikari|It\'s been flickering for six years. It\'s basically a landmark now.']);
  if (t == 760) say3(['Hitori|...Hikari?', 'Hikari|Mm?', 'Hitori|Thanks for coming back.', 'Hikari|Thanks for picking up.']);
  if (t == 1800) P2.fadeTo = 1;
  if (t == 1960) { P2.cut = null; P2.npc = null; P2.npc2 = null; P2.outside = 0; H3.ext.vis = false; P2.silent = 0; P2.ui = { k: 'end', t: 0, sub: 'still here' }; ST2s('stage', 'day1'); ST.set('syn_part2', 1); ST.set('syn_p2_good', 1) }
};
