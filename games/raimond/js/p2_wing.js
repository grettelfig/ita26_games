// ==================== PART TWO: the bigger house, and the neon (v73) ====================
// A new wing on the north side of the house (z -6.5 to 0), built straight in new-plan coordinates:
//   ground floor, through the back door: the den (a low sofa, a wall screen, a fish tank, a little bar), the laundry
//   room (machines, pipes, a drain), and the workshop (Dad's bench, a motorbike under a sheet, a roller door)
//   upstairs, through a new doorway off the landing: a short corridor, the study (three screens, a server rack,
//   a corkboard), and a roof terrace open to the city
// And a pass over the whole house after Cyberpunk-style interiors: the neon is an accent, not the main light. LED
// strips in ceiling coves and under cabinets, vertical light framing the windows, a strip on every stair edge leading
// you up, little glowing control panels by the doors, conduit along the ceilings, and small coloured pools of light
// against a lot of shadow (amber, cyan and magenta, the colours of the city outside).
const WING_Z = -6.5;
const WROOMS = [ // id, floor, x0, z0, x1, z1
  ['den', 0, 0, WING_Z, 9.6, 0], ['laundry', 0, 9.6, WING_Z, 12.4, 0], ['workshop', 0, 12.4, WING_Z, 16.4, 0],
  ['study', 1, 0, WING_Z, 6.2, 0], ['wingcorr', 1, 6.2, WING_Z, 8.4, 0], ['terrace', 1, 8.4, WING_Z, 16.4, 0]];
function wingRoom(x, z, y) { if (z >= 0) return null; const f = y > 1.5 ? 1 : 0; const r = WROOMS.find(r => r[1] == f && x >= r[2] && x <= r[4] && z >= r[3] && z <= r[5]); return r ? r[0] : null }
const _roomAt73 = roomAt;
roomAt = function (x, z, y) { return wingRoom(x, z, y) || _roomAt73(x, z, y) };
function wingTex() {
  const N = (g, s, c, a, seed) => texNoise(g, s, c, a, seed, 1);
  tex('cpanel', 64, (g, s) => { N(g, s, '#454852', .08, 731); g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(0, 0, s, 1); g.fillRect(0, 0, 1, s); g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(1, 1, s - 2, 1); for (const [x, y] of [[4, 4], [s - 6, 4], [4, s - 6], [s - 6, s - 6]]) { g.fillStyle = '#3a3c44'; g.fillRect(x, y, 2, 2) } });
  tex('cfloor', 64, (g, s) => { N(g, s, '#4a4a50', .1, 732); g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(0, 0, s, 1); g.fillRect(0, 0, 1, s); });
  tex('deck', 32, (g, s) => { N(g, s, '#3a3430', .12, 733); g.fillStyle = 'rgba(0,0,0,.35)'; for (let y = 0; y < s; y += 8) g.fillRect(0, y, s, 1) });
  tex('grate', 16, (g, s) => { g.fillStyle = '#1a1a1e'; g.fillRect(0, 0, s, s); g.fillStyle = '#4a4c52'; for (let i = 0; i < s; i += 4) { g.fillRect(i, 0, 1, s); g.fillRect(0, i, s, 1) } });
  tex('sheet', 32, (g, s) => N(g, s, '#8a8a84', .1, 734));
  tex('neonmoon', 64, (g, s) => { g.clearRect(0, 0, s, s); g.strokeStyle = '#ff4ab0'; g.lineWidth = 3; g.beginPath(); g.arc(28, 32, 20, .6, 5.7); g.stroke(); g.beginPath(); g.arc(38, 28, 15, 1.2, 5.2, false); g.strokeStyle = '#40e0ff'; g.lineWidth = 2; g.stroke() });
  tex('neonsign', 128, (g, s) => { g.clearRect(0, 0, s, s); g.font = 'bold 30px sans-serif'; g.textAlign = 'center'; g.fillStyle = '#ffd040'; g.fillText('OPEN', s / 2, 52); g.font = 'bold 22px sans-serif'; g.fillStyle = '#40e8ff'; g.fillText('late night', s / 2, 84); g.strokeStyle = '#ff40a0'; g.lineWidth = 3; g.strokeRect(10, 18, s - 20, 78) });
  tex('wallscreen', 128, (g, s) => { const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, '#120a2a'); gr.addColorStop(1, '#0a2a3a'); g.fillStyle = gr; g.fillRect(0, 0, s, s); g.fillStyle = '#ff4ab0'; g.font = 'bold 14px sans-serif'; g.fillText('NIGHT CITY 24/7', 8, 22); g.fillStyle = '#9ae8ff'; g.font = '9px sans-serif'; ['rain until friday', 'metro: delays on the night line', 'the bay: 11°'].forEach((t, i) => g.fillText(t, 8, 44 + i * 13)); g.fillStyle = 'rgba(255,255,255,.08)'; for (let y = 0; y < s; y += 3) g.fillRect(0, y, s, 1) });
  tex('monitor', 64, (g, s) => { g.fillStyle = '#06101a'; g.fillRect(0, 0, s, s); g.fillStyle = '#3ad0ff'; for (let i = 0; i < 12; i++) g.fillRect(4, 5 + i * 5, 10 + ((i * 37) % 40), 2); g.fillStyle = '#ff5ab8'; g.fillRect(s - 18, 6, 12, 12) });
  tex('tankwater', 32, (g, s) => { const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, '#1a6a8a'); gr.addColorStop(1, '#0a2a4a'); g.fillStyle = gr; g.fillRect(0, 0, s, s); g.fillStyle = 'rgba(255,255,255,.25)'; for (let i = 0; i < 8; i++) g.fillRect((i * 13) % s, (i * 7) % s, 1, 1) });
  tex('cork2', 32, (g, s) => { N(g, s, '#9a7448', .2, 735) });
  tex('rollerdoor', 32, (g, s) => { N(g, s, '#5a5c60', .08, 736); g.fillStyle = 'rgba(0,0,0,.35)'; for (let y = 0; y < s; y += 4) g.fillRect(0, y, s, 1) });
}
// the wing's lights and the neon lights everywhere: [x, y, z, colour, radius, room-ish]
const NEONL = [];
function wingBuild() {
  wingTex(); NEONL.length = 0;
  const mb = new MB(), neon = new MB(), Y = 3, E = c => ({ col: [...c, 1] });
  const CY = [.25, .9, 1], MG = [1, .25, .7], AM = [1, .7, .3], VI = [.6, .4, 1], WH = [.85, .95, 1];
  const strip = (x0, y0, z0, x1, y1, z1, c) => neon.box('white', x0, y0, z0, x1, y1, z1, E(c));
  const lamp = (x, y, z, c, r, k = .55) => NEONL.push({ p: [x, y, z], c: c.map(v => v * k * 1.9), r: r * 1.15 });
  lRaw(() => {
    // ---------------------------------------------------------------- the wing's shell
    mb.box('cfloor', 0, -.1, WING_Z, HOUSE_W, 0, 0, { skip: 'nsewb', us: 1.6 });
    mb.box('deck', 8.4, 2.8, WING_Z, HOUSE_W, 3, 0, { skip: 'nsew', tf: { b: 'ceil' }, us: 1.4 });   // the ground floor's ceiling is the terrace's deck and the study's floor
    mb.box('cfloor', 0, 2.8, WING_Z, 8.4, 3, 0, { skip: 'nsew', tf: { b: 'ceil' }, us: 1.6 });
    mb.box('ceil', 0, 5.8, WING_Z, 8.4, 5.9, 0, { skip: 'nsewt', us: 2 });
    GAPS.length = 0;
    // outer walls (ground floor all round; upstairs the study and the corridor)
    wallXn(mb, WING_Z, 0, HOUSE_W, 0, [], 'cpanel'); wallZn(mb, 0, WING_Z, 0, 0, [], 'cpanel'); wallZn(mb, HOUSE_W, WING_Z, 0, 0, [], 'cpanel');
    wallXn(mb, WING_Z, 0, 8.4 + WT / 2, 1, [], 'cpanel'); wallZn(mb, 0, WING_Z, 0, 1, [], 'cpanel');
    // inner walls: den | laundry | workshop, and upstairs study | corridor | terrace
    wallZn(mb, 9.6, WING_Z, 0, 0, [[-3.3, -2.2]], 'cpanel'); wallZn(mb, 12.4, WING_Z, 0, 0, [[-3.3, -2.2]], 'cpanel');
    wallZn(mb, 6.2, WING_Z, 0, 1, [[-3.6, -2.5]], 'cpanel'); wallZn(mb, 8.4, WING_Z, 0, 1, [[-4.4, -2.0]], 'cpanel');
    doorTrimN(mb); GAPS.length = 0;
    doorN('laundry', 9.6, -3.3, 0, 'z', 1, { name: 'Laundry' }); doorN('workshop', 12.4, -3.3, 0, 'z', 1, { name: 'Workshop' }); doorN('study', 6.2, -3.6, 1, 'z', -1, { name: 'Study' });
    for (const d of H3.doors) if (!d.obj) d.obj = d.mb.build();
    // the terrace: a railing of glass panels round the open sides, and the back of the house above it
    const rail = (x0, z0, x1, z1) => { mb.box('chrome', x0, Y + 1.0, z0, x1, Y + 1.06, z1); mb.box('white', x0, Y + .08, z0, x1, Y + 1.0, z1, { col: [.25, .35, .45, 0] }); hs(x0, Y, z0, x1, Y + 1.1, z1) };
    rail(8.4, WING_Z - .03, HOUSE_W, WING_Z + .03); rail(HOUSE_W - .03, WING_Z, HOUSE_W + .03, 0);
    mb.box('siding', 8.4, Y, -.09, HOUSE_W, Y + 2.9, -.07, { us: 1.4 }); mb.box('roof', 8.2, Y + 2.88, -.5, HOUSE_W + .2, Y + 2.95, -.06, { us: 1 });
    strip(8.4, Y + .02, WING_Z + .06, HOUSE_W, Y + .05, WING_Z + .1, CY); strip(HOUSE_W - .1, Y + .02, WING_Z, HOUSE_W - .06, Y + .05, 0, CY);   // the deck's edge lights
    // string lights over the terrace
    for (let i = 0; i <= 14; i++) { const x = 8.8 + i * .52, y = Y + 2.4 - Math.sin(i / 14 * PI) * .35; neon.box('white', x - .03, y - .03, -2.8, x + .03, y + .03, -2.74, E([1, .8, .45])) } neon.box('darkplastic', 8.6, Y + 2.0, -2.79, HOUSE_W - .2, Y + 2.02, -2.77); lamp(12.4, Y + 2.1, -2.8, [1, .8, .45], 6.5, .5); lamp(14.2, Y + 1.0, -5.0, [.6, .4, 1], 5, .35);
    // a bench and two chairs on the terrace, plants, and a little table
    mb.box('dwood', 9.2, Y, -6.2, 11.8, Y + .45, -5.75); hs(9.2, Y, -6.2, 11.8, Y + .45, -5.75);
    for (const [x, z, r] of [[13.6, -3.4, -HP], [13.6, -4.6, -HP]]) { mb.at(x, Y, z, r, m => MOD.chair(m, 'dwood')); hs(x - .22, Y, z - .22, x + .22, Y + .5, z + .22) }
    mb.at(14.4, Y, -4.0, 0, m => MOD.table(m, .7, .7, .7, 'dwood')); hs(14.05, Y, -4.35, 14.75, Y + .72, -3.65);
    for (const [x, z] of [[16.0, -6.1], [8.8, -6.1], [16.0, -.5]]) { mb.at(x, Y, z, 0, m => MOD.plant(m, false)); hs(x - .2, Y, z - .2, x + .2, Y + .9, z + .2) }
    inter('terrace', [9.2, Y, -6.3, 11.8, Y + 1, -5.6], 'Bench', () => P2S.look('terrace'));
    // ---------------------------------------------------------------- the den
    { const z0 = WING_Z;
      mb.box('rug', 1.2, .003, -4.8, 5.6, .012, -1.6, { skip: 'nsewb', fit: 1 });
      mb.at(3.4, 0, -5.9, PI, m => MOD.sofa(m, 2.6)); hs(2.0, 0, -6.4, 4.8, .9, -5.5);
      mb.at(.7, 0, -3.2, -HP, m => MOD.sofa(m, 1.6)); hs(.2, 0, -4.05, 1.15, .9, -2.35);
      mb.at(3.4, 0, -4.0, 0, m => MOD.coffeeTable(m, 1.2, .6)); hs(2.8, 0, -4.3, 4.0, .45, -3.7);
      // the wall screen on the corridor side (facing the sofa), its glow, and a soundbar
      mb.box('darkplastic', 2.0, .9, -.2, 4.8, 2.4, -.12); neon.box('wallscreen', 2.06, .96, -.205, 4.74, 2.34, -.2, { col: [1, 1, 1, 1], fit: 1 });
      mb.box('darkplastic', 2.4, .55, -.3, 4.4, .66, -.15); inter('wallscreen', [2.0, .9, -.4, 4.8, 2.4, -.1], 'Screen', () => P2S.look('wallscreen'));
      lamp(3.4, 1.6, -.9, [.5, .3, 1], 4.5, .5);
      // the fish tank (the only living thing in here), on a low cabinet by the west wall
      mb.box('darkplastic', .1, 0, -1.6, .55, .7, -.4); hs(.1, 0, -1.6, .55, 1.3, -.4);
      neon.box('tankwater', .14, .72, -1.56, .52, 1.25, -.44, { col: [1, 1, 1, .85] }); neon.box('white', .12, 1.25, -1.58, .54, 1.29, -.42, E([.7, .95, 1]));
      for (let i = 0; i < 4; i++) neon.box('white', .25 + (i % 2) * .1, .85 + i * .08, -1.4 + i * .2, .29 + (i % 2) * .1, .88 + i * .08, -1.34 + i * .2, E([1, .6, .2]));
      inter('tank', [.1, .7, -1.6, .6, 1.3, -.4], 'Fish tank', () => P2S.look('tank')); lamp(.6, 1.2, -1.0, [.3, .8, 1], 3, .55);
      // the bar: a counter along the laundry wall, stools, bottles, the neon sign above it
      mb.box('darkplastic', 8.6, 0, -5.8, 9.5, 1.05, -2.0); mb.box('chrome', 8.5, 1.05, -5.85, 9.54, 1.1, -1.95); hs(8.5, 0, -5.85, 9.54, 1.1, -1.95);
      for (const z of [-5.2, -4.2, -3.2]) { mb.lathe('chrome', [[.18, 0], [.03, .05], [.03, .7], [.2, .72], [.2, .76], [0, .78]], { cx: 8.15, cz: z, seg: 10 }); hs(7.97, 0, z - .18, 8.33, .78, z + .18) }
      for (let i = 0; i < 6; i++) mb.lathe(['lacquer', 'glass', 'chrome'][i % 3] || 'glass', [[.035, 0], [.035, .2], [.012, .26], [.012, .32]], { cx: 9.3, cz: -5.6 + i * .3, seg: 8, yf: () => 1.1 });
      neon.decal('neonsign', 9.53, 2.0, -3.9, 1.3, 1.0, 'w', [1, 1, 1, 1]); lamp(9.0, 2.0, -3.9, MG, 4, .6);
      strip(8.52, .05, -5.85, 8.55, .1, -1.95, MG);   // the bar's kick light
      inter('bar', [8.5, .9, -5.85, 9.6, 1.4, -1.95], 'Bar', () => P2S.look('bar'));
      // the window out to the back, with the city in it, and a floor lamp
      mWindow(mb, 's', 6.6, 1.6, WING_Z + .06, 1.8, 1.2, { blinds: 1 }); strip(5.55, .3, WING_Z + .08, 5.6, 2.6, WING_Z + .12, CY); strip(7.6, .3, WING_Z + .08, 7.65, 2.6, WING_Z + .12, CY);
      mb.at(7.9, 0, -6.1, 0, m => MOD.floorLamp(m)); hs(7.75, 0, -6.25, 8.05, 1.6, -5.95);
      // cove light round the den's ceiling
      for (const [a, b, c, d] of [[.1, -6.4, 9.5, -6.36], [.1, -.14, 9.5, -.1]]) strip(a, 2.7, b, c, 2.74, d, VI); strip(.06, 2.7, -6.4, .1, 2.74, -.1, VI);
      lamp(2.0, 2.4, -5.0, VI, 5, .45); lamp(6.5, 2.4, -3.2, AM, 4.5, .45); lamp(7.9, 1.5, -6.0, [1, .75, .5], 4, .6);   // the floor lamp
    }
    // ---------------------------------------------------------------- the laundry room
    mb.box('tilef', 9.6, .001, WING_Z, 12.4, .004, 0, { skip: 'nsewb', us: 1 });
    for (const [x, t] of [[10.0, 'washer'], [10.75, 'dryer']]) { mb.box('porcelain', x - .32, 0, -6.4, x + .32, .86, -5.8, { bev: .02 }); mb.lathe('chrome', [[.2, 0], [.22, .02]], { cx: x, cz: -5.79, seg: 14 }); hs(x - .32, 0, -6.4, x + .32, .86, -5.8) }
    for (const x of [10.0, 10.75]) neon.box('white', x + .18, .78, -5.79, x + .24, .8, -5.78, E([.3, 1, .4]));
    mb.box('grate', 11.0, .005, -3.2, 11.5, .01, -2.7, { skip: 'nsewb' });
    for (const y of [2.3, 2.5]) mb.tube('chrome', [[9.7, y, -6.3], [12.3, y, -6.3]], [.04, .04], { seg: 6 });
    mb.tube('chrome', [[12.2, 0, -6.3], [12.2, 2.5, -6.3]], [.05, .05], { seg: 6 });
    for (let i = 0; i < 4; i++) mb.box(['sofa', 'curtain', 'duvet', 'linen'][i], 10.0 + i * .5, 1.5, -1.0, 10.3 + i * .5, 2.2, -.98);
    mb.box('chrome', 9.8, 2.22, -1.02, 12.2, 2.24, -.96); inter('laundryline', [9.8, 1.4, -1.2, 12.2, 2.3, -.8], 'Laundry', () => P2S.look('laundryline'));
    inter('washer', [9.6, 0, -6.45, 11.1, .9, -5.7], 'Washing machine', () => P2S.look('washer'));
    mb.box('white', 10.3, 2.74, -3.4, 11.7, 2.78, -3.2, E(WH)); lamp(11, 2.5, -3.3, [.75, .95, .85], 4.5, .5);
    // ---------------------------------------------------------------- the workshop
    mb.box('cfloor', 12.4, .002, WING_Z, HOUSE_W, .006, 0, { skip: 'nsewb', us: .8 });
    mb.box('rollerdoor', 13.0, 0, WING_Z + .07, 15.8, 2.5, WING_Z + .09); for (let y = .3; y < 2.5; y += .3) mb.box('darkplastic', 13.0, y, WING_Z + .09, 15.8, y + .02, WING_Z + .1);
    strip(12.9, 2.55, WING_Z + .08, 15.9, 2.6, WING_Z + .14, [1, .2, .2]);
    mb.box('walnut', 15.75, .9, -5.3, 16.35, .96, -1.2); mb.box('darkplastic', 15.8, 0, -5.25, 16.3, .9, -1.25); hs(15.75, 0, -5.3, 16.4, .96, -1.2);   // the workbench
    mb.box('grate', 16.32, 1.1, -5.2, 16.34, 2.3, -1.3, { us: .35 });   // the tool wall
    for (let i = 0; i < 9; i++) mb.box(i % 3 ? 'chrome' : 'lacquer', 16.24, 1.3 + (i % 3) * .3, -5.0 + i * .4, 16.3, 1.5 + (i % 3) * .3, -4.94 + i * .4);
    mb.at(16.0, .96, -3.0, -HP, m => MOD.tableLamp(m, .4)); lamp(15.9, 1.6, -3.0, AM, 3.5, .7);
    // the motorbike under its dust sheet
    mb.box('sheet', 13.2, .1, -3.9, 15.2, .9, -3.3, { bev: .2 }); mb.box('sheet', 13.6, .9, -3.85, 14.6, 1.15, -3.35, { bev: .15 }); hs(13.2, 0, -3.95, 15.2, 1.15, -3.25);
    inter('bike', [13.1, 0, -4.0, 15.3, 1.2, -3.2], 'Motorbike', () => P2S.look('bike'));
    mb.at(13.0, 0, -1.0, .3, m => MOD.boxes(m, 9, 3)); hs(12.6, 0, -1.4, 13.5, 1.2, -.5);
    mb.box('white', 13.6, 2.74, -3.7, 15.0, 2.78, -3.5, E([1, .9, .7])); lamp(14.3, 2.4, -3.6, AM, 4.5, .5);
    inter('rollerdoor', [13.0, 0, WING_Z, 15.8, 2.5, WING_Z + .3], 'Roller door', () => P2S.look('rollerdoor'));
    // ---------------------------------------------------------------- upstairs: the corridor and the study
    strip(6.26, Y + .05, WING_Z + .1, 6.3, Y + .08, -.1, AM); strip(8.3, Y + .05, WING_Z + .1, 8.34, Y + .08, -.1, AM);   // floor lights leading you along
    lamp(7.3, Y + 2.4, -3.3, AM, 4, .45);
    mb.box('rug', .9, Y + .003, -5.2, 4.8, Y + .012, -1.4, { skip: 'nsewb', fit: 1 });
    mb.at(3.0, Y, -5.9, 0, m => MOD.desk(m, 2.6, .7)); hs(1.7, Y, -6.3, 4.3, Y + .76, -5.55);
    for (const [x, ry] of [[2.2, .25], [3.0, 0], [3.8, -.25]]) mb.at(x, Y + .76, -6.05, ry, m => { m.box('darkplastic', -.33, .08, -.02, .33, .48, .02); m.box('monitor', -.31, .1, .021, .31, .46, .025, { col: [1, 1, 1, 1], fit: 1 }); m.box('darkplastic', -.03, 0, -.06, .03, .1, .0) });
    mb.at(3.0, Y + .76, -5.75, 0, m => MOD.keyboard(m)); mb.at(3.0, Y, -5.1, PI, m => MOD.officeChair(m)); hs(2.75, Y, -5.35, 3.25, Y + .5, -4.85);
    lamp(3.0, Y + 1.3, -5.4, [.3, .7, 1], 4, .55);
    inter('study', [1.7, Y + .7, -6.4, 4.3, Y + 1.4, -5.6], 'Computers', () => P2S.look('study'));
    // the server rack, blinking
    mb.box('darkplastic', .15, Y, -2.2, .75, Y + 1.9, -1.4); hs(.15, Y, -2.2, .75, Y + 1.9, -1.4);
    for (let i = 0; i < 10; i++) neon.box('white', .755, Y + .25 + i * .16, -2.0 + (i % 3) * .05, .76, Y + .27 + i * .16, -1.97 + (i % 3) * .05, E(i % 4 ? [.2, 1, .4] : [1, .5, .1]));
    inter('rack', [.1, Y, -2.3, .8, Y + 2, -1.3], 'Server rack', () => P2S.studyRack());
    // a corkboard of her sister's plans; a bookshelf; the study's window
    mb.box('cork2', 6.13, Y + 1.0, -5.6, 6.14, Y + 2.0, -4.0); for (let i = 0; i < 7; i++) mb.box(['white', 'linen', 'pol1', 'white'][i % 4], 6.125, Y + 1.15 + (i % 3) * .28, -5.45 + i * .2, 6.128, Y + 1.35 + (i % 3) * .28, -5.3 + i * .2, { fit: 1 });
    inter('corkplans', [5.9, Y + .9, -5.7, 6.2, Y + 2.1, -3.9], 'Corkboard', () => P2S.look('corkplans'));
    mb.at(.32, Y, -4.0, HP, m => MOD.bookshelf(m, 1.6, 2, .32, 77)); hs(.15, Y, -4.85, .5, Y + 2, -3.15);
    mWindow(mb, 'e', .06, Y + 1.55, -1.0, 1.0, 1.1, {}); strip(.08, Y + .6, -1.65, .12, Y + 2.4, -1.6, MG); strip(.08, Y + .6, -.4, .12, Y + 2.4, -.35, MG);
    for (const [a, b, c, d] of [[.1, -6.4, 6.1, -6.36]]) strip(a, Y + 2.7, b, c, Y + 2.74, d, CY);
    // ---------------------------------------------------------------- neon round the old house (new-plan positions)
    // the hall and the stairs: a light on every step's edge, vertical strips beside the front door, a control panel
    { const N = 15, Z0 = 12.6, RUN = .44, RISE = .2; for (let i = 0; i < N; i++) { const z1 = Z0 - i * RUN, y = (i + 1) * RISE; strip(5.78, y + .012, z1 + .01, 7.32, y + .022, z1 + .03, CY) } }
    const gF = lGap('x', 10, 6, 6.9, 0, 0, HOUSE_W); strip(gF[0] - .2, .1, HOUSE_D - .08, gF[0] - .16, 2.3, HOUSE_D - .07, CY); strip(gF[1] + .16, .1, HOUSE_D - .08, gF[1] + .2, 2.3, HOUSE_D - .07, CY);
    neon.box('white', gF[1] + .35, 1.25, HOUSE_D - .08, gF[1] + .5, 1.45, HOUSE_D - .07, E([.2, 1, .5]));   // the door's lock panel
    lamp((gF[0] + gF[1]) / 2, 2.0, HOUSE_D - .8, CY, 4, .4);
    strip(11.32, 2.62, .1, 11.34, 2.66, 6.4, AM); strip(11.32, 2.62, 11.85, 11.34, 2.66, 13.95, AM);   // cove strips along the hall's long walls
    // the living room: magenta cove light, a neon moon on the wall
    strip(.08, 2.7, 5.3, .12, 2.74, 13.9, MG); strip(.1, 2.7, 13.86, 5.5, 2.74, 13.9, MG);
    neon.decal('neonmoon', .075, 1.9, 10.6, .9, .9, 'e', [1, 1, 1, 1]); lamp(.6, 1.9, 10.6, MG, 4, .55); lamp(2.8, 2.5, 7.0, VI, 4.5, .3);
    // the kitchen: a light strip under the wall cabinets, a teal one along the ceiling
    strip(16.02, 1.48, 4.76, 16.06, 1.495, 6.56, WH); strip(16.02, 1.48, 9.72, 16.06, 1.495, 10.94, WH); lamp(15.6, 1.2, 6.5, [.7, .9, 1], 3.5, .45);
    strip(11.48, 2.7, 4.7, 11.52, 2.74, 13.9, CY); lamp(12.2, 2.3, 9.5, CY, 4, .3);
    // Hitori's room: violet behind the desk, light framing the window (the blinds still close over it)
    strip(11.48, Y + 2.7, 6.5, 11.52, Y + 2.74, 13.9, VI); strip(16.31, Y + .7, 12.12, 16.33, Y + 2.3, 12.16, CY); strip(16.31, Y + .7, 13.74, 16.33, Y + 2.3, 13.78, CY);
    lamp(15.9, Y + 1.5, 12.95, CY, 3, .35); lamp(13.5, Y + 2.4, 8.0, VI, 4, .3);
    // Hikari's room: pink along the ceiling
    strip(11.48, Y + 2.7, .1, 11.52, Y + 2.74, 6.3, MG); strip(11.5, Y + 2.7, .08, 16.3, Y + 2.74, .12, MG); lamp(13.9, Y + 2.3, 3.2, MG, 4, .3);
    // the landing: the gallery rail lit from below, and a lit frame round the new doorway
    strip(9.36, Y + .02, 6.1, 9.4, Y + .05, 12.2, AM); { const gU = lGap('x', 0, 5.0, 5.8, 1, 0, HOUSE_W); strip(gU[0] - .14, Y, .07, gU[0] - .1, Y + 2.25, .1, AM); strip(gU[1] + .1, Y, .07, gU[1] + .14, Y + 2.25, .1, AM) }
    // conduit along the ceilings (a few runs of pipe and cable)
    for (const [a, b, y] of [[[11.15, 0, .25], [11.15, 0, 13.7], 2.6], [[11.15, 0, .25], [11.15, 0, 13.7], Y + 2.62]]) mb.tube('chrome', [[a[0], y, a[2]], [b[0], y, b[2]]], [.025, .025], { seg: 5 });
  });
  H3.extra.wing = mb.build(); H3.extra.neon = neon.build();
}
// what she says about the new rooms
Object.assign(LOOK1, {
  terrace: ['|The roof terrace. The whole city hums out there, close enough to touch.', 'Hitori|We used to sit out here. Me and... someone. Counting the flying cars.'],
  wallscreen: ['|The den\'s wall screen. It shows the city news on a loop.', 'Hitori|Rain until Friday. It\'s always rain until Friday.'],
  tank: ['|A fish tank. Two little orange fish, still alive.', 'Hitori|...Somebody\'s been feeding them. Was it me?'],
  bar: ['|Dad\'s bar. Bottles nobody\'s opened in a year.', 'Hitori|Mom made him promise. He kept it.'],
  laundryline: ['|Clothes on the line. Some of them aren\'t hers. A hoodie that\'s too small for her.'],
  washer: ['|The washing machine. There\'s still a load inside, dry and stiff.', 'Hitori|...I should really do that.'],
  bike: ['|Something under a dust sheet. A motorbike.', 'Hitori|Dad\'s. He said he\'d teach us both when we were older.'],
  rollerdoor: ['|The roller door to the alley. It\'s padlocked from inside.'],
  study: ['|Three screens on the desk. A study timetable on one, physics and history. On another, an email: "Offer of a place. Start date: 14 September."', '|A sticky note on the frame, in small neat writing: "not yet. she\'s not ok yet."', 'Hitori|...This isn\'t my desk.', 'Hitori|Whoever sits here was waiting for something. For someone.'],
  corkplans: ['|A corkboard of plans: a university brochure, a coach timetable, a photo.', '|Somebody circled a date in red and wrote "tell her" next to it.'],
});
Object.assign(LOOK2, {
  terrace: ['|The city is loud tonight. Sirens, somewhere far off.', 'Hitori|...I could just sit here a while. Just sit.'],
  wallscreen: ['|The news loop. For a second the anchor seems to say her name. Then it\'s the weather again.'],
  study: ['|The sticky note again: "not yet. she\'s not ok yet."', '|The date on the email went past weeks ago.', 'Hitori|...She stayed. Whoever she is. She stayed as long as she could. For me.'],
  tank: ['|The fish are still there. Still alive.', 'Hitori|...Okay. Something in this house is okay.'],
});
Object.assign(LOOK3, {
  terrace: ['Hikari|We used to sit out here and count the flying cars.', 'Hikari|She always lost count on purpose so we\'d have to start again.'],
  tank: ['Hikari|She kept the fish alive.', 'Hikari|...She kept the fish alive, and nobody kept her.'],
  study: ['Hikari|My exams. My plans. All of it, up here, while she was downstairs alone.', 'Hikari|"Not yet. She\'s not okay yet." I kept moving the date. Then I just... went.'],
  corkplans: ['Hikari|"Tell her." I was going to tell her about the university.', 'Hikari|I told her the night before. And left in the morning.'],
});
// ---- hooks
const _buildHouse73 = buildHouse;
buildHouse = function () { const was = H3.built; _buildHouse73(); if (!was) wingBuild() };
const _houseScene73 = houseScene;
houseScene = function () {
  const s = _houseScene73(); if (!s || P2.outside) return s;
  const d = P2.day, dark = d == 3, sis = d == 4, k = sis ? .55 : dark ? .8 : 1;
  for (const l of NEONL) s.lights.push(dark ? { p: l.p, c: l.c.map(v => v * k), r: l.r, flick: () => (Math.random() < .03 ? .3 : 1) } : k == 1 ? l : { p: l.p, c: l.c.map(v => v * k), r: l.r });
  return s;
};

// ---------------------------------------------------------------- the study's server rack: the phone backup (v77)
// Dad's home lab backs up the family's phones. On day 1 it's still syncing; on day 2 the voice memo Hikari recorded
// on the coach, the one that never reached Hitori's broken phone, can finally be played. Listening to it counts as
// reaching out (it's one of the choices that can bring the phone call at the end), and for a while it quiets the house.
const LOOK4b = { study: ['Hitori|Her study. It\'s hers again, whenever she wants it.'] };
P2S.studyRack = function () {
  const c = P2.ch, d = P2.day;
  if (d == 1) return say3(['|Dad\'s "home lab": old servers, blinking to themselves. One screen is awake.', '|PHONE BACKUP — "hitori\'s phone" — syncing... 1 new voice memo (from ♡).', 'Hitori|...It won\'t open while it\'s still syncing.', 'Hitori|Who\'s "♡"? That\'s the number that keeps calling.']);
  if (d == 4) return say3(c.memo ? ['Hikari|My voice memo. From the coach. It says "played."', 'Hikari|...She heard me. She actually heard me.'] : ['Hikari|My voice memo, sitting in the backup. "Not played."', 'Hikari|~I said everything in that. Everything. And it never got to her.']);
  if (d == 5) return say3(c.memo ? ['Hitori|I listened to it again this morning. Twice.', 'Hitori|"I love you, stupid." ...She really says that.'] : ['Hitori|There\'s a voice memo from her in the backup.', 'Hitori|I\'ll listen to it with her here. Not alone.']);
  if (c.memo) return say3(['|The memo is still there. "Played."', 'Hitori|...I don\'t need to hear it again. I remember all of it.']);
  say3(['|The backup has finished. PHONE BACKUP — "hitori\'s phone" — 1 voice memo (from ♡), 4 minutes long.', '|Recorded the morning the letter was left. Never played.'],
    () => choose3(['Listen to it', 'Not now'], i => {
      if (i) return say3(['Hitori|...Not now. I can\'t. Not now.']);
      c.memo = 1; p2ChSave();
      say3(['|Road noise. A coach engine. Somebody breathing, trying to start.', '♡|...Hito. It\'s me.', '♡|I\'m on the coach. I left a letter on your desk. I know you won\'t read it for a while. That\'s okay.',
        '♡|I\'m not angry. I was never angry with you. I was scared, and I was tired, and I didn\'t know how to help.', '♡|Take them, okay? Even just one. And then call me. Any time. Three in the morning. Especially then.',
        '♡|...I love you, stupid.', '|The memo ends.', 'Hitori|...', 'Hitori|I know that voice. I know that voice and I can\'t find the name.', '|For a long while after, the house is quiet. No footsteps. No whispering. Just the hum of the servers.'],
        () => { if (P2.amb) { P2.amb.whT = 3600; P2.amb.footT = 3600 } });
    }));
};
const _look77 = P2S.look;
P2S.look = function (id) { if (P2.day == 5 && LOOK4b[id]) return say3(LOOK4b[id]); return _look77.apply(this, arguments) };
// listening to the memo counts as reaching out, and Hikari finds out about it
const _hope77 = p2Hope; p2Hope = function () { return _hope77() + (P2.ch && P2.ch.memo ? 1 : 0) };
const _regrets77 = p2SisterRegrets; p2SisterRegrets = function () { const L = _regrets77(); if (P2.ch && P2.ch.memo) L.push('Hikari|The backup says she played my voice memo. The one from the coach.'); return L };
