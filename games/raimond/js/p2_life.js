// ==================== PART TWO: the city is alive (v73) ====================
// Traffic on the street out front and the side street down to the river, more flying cars (some low and close),
// an advertising blimp, and people: walking both ways along the pavements and the river promenade, standing
// under the shop awnings, a few with umbrellas, some with glowing jacket trims. Loaded after p2_v62.js.
const LIFE = { cars: [], peds: [], obj: null, t: 0 };
const _buildCity73 = buildCity;
buildCity = function () {
  const fresh = !CITY.obj; _buildCity73(); if (!fresh) return;
  const R = rng(4242), NE = [[.3, .95, 1, 1], [1, .25, .7, 1], [.75, .5, 1, 1], [1, .82, .3, 1], [.4, 1, .6, 1]];
  const BODY = [[.12, .12, .14, 0], [.5, .06, .1, 0], [.06, .12, .3, 0], [.75, .75, .72, 0], [.6, .45, .1, 0], [.18, .3, .22, 0], [.4, .1, .45, 0], [.08, .08, .09, 0]];
  // ---- cars: a body, a cabin, lights, and a neon strip underneath; three shapes (saloon, van, low sports car)
  const carMesh = (kind, c, glow) => single(q => {
    const L = kind == 1 ? 2.5 : 2.2, W = .95, H = kind == 1 ? 1.55 : kind == 2 ? .75 : .95;
    q.box('white', -L, .28, -W, L, .28 + H * .55, W, { col: c, bev: .12 });
    if (kind == 1) q.box('white', -L + .3, .28 + H * .55, -W + .05, L - .1, .28 + H, W - .05, { col: c, bev: .08 });
    else q.box('white', -L * .5, .28 + H * .55, -W + .1, L * .45, .28 + H * .55 + (kind == 2 ? .38 : .5), W - .1, { col: [.04, .05, .08, 0], bev: .08 });
    q.box('white', L, .5, -W + .15, L + .04, .68, -W + .45, { col: [1, .97, .85, 1] }); q.box('white', L, .5, W - .45, L + .04, .68, W - .15, { col: [1, .97, .85, 1] });   // headlights
    q.box('white', -L - .04, .55, -W + .1, -L, .7, W - .1, { col: [1, .08, .15, 1] });   // a tail-light bar
    q.box('white', -L + .3, .08, -W + .2, L - .3, .14, W - .2, { col: glow });   // underglow
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) q.box('white', sx * L * .62 - .3, 0, sz * W - .12, sx * L * .62 + .3, .55, sz * W + .12, { col: [.03, .03, .04, 0] });
  });
  const lane = (kind) => { const c = BODY[(R() * BODY.length) | 0], g = NE[(R() * NE.length) | 0]; return carMesh(kind, c, R() < .6 ? g : [.02, .02, .02, 0]) };
  // main road: two lanes each way (z 20..30); the side street to the river (x 2..12)
  for (let i = 0; i < 26; i++) { const dir = i % 2 ? 1 : -1, z = dir > 0 ? (R() < .5 ? 21.6 : 23.9) : (R() < .5 ? 26.1 : 28.4);
    LIFE.cars.push({ obj: lane((R() * 3) | 0), road: 'main', dir, x: -300 + R() * 600, z, v: (9 + R() * 7) / 60 }) }
  for (let i = 0; i < 8; i++) { const dir = i % 2 ? 1 : -1; LIFE.cars.push({ obj: lane((R() * 3) | 0), road: 'side', dir, x: dir > 0 ? 9.2 : 4.8, z: 34 + R() * 74, v: (6 + R() * 4) / 60 }) }
  // more flying cars: a close lane over the street, and the usual wide circles
  for (let i = 0; i < 30; i++) { const near = i < 12, m = single(q => { q.box('white', -1.6, -.4, -.8, 1.6, .4, .8, { col: [.12, .12, .16, 0], bev: .2 }); q.box('white', 1.6, -.2, -.6, 1.7, .1, .6, { col: [1, .95, .8, 1] }); q.box('white', -1.7, -.2, -.6, -1.6, .1, .6, { col: [1, .1, .2, 1] }); q.box('white', -1.2, -.5, -.7, 1.2, -.42, .7, { col: NE[i % NE.length] }) });
    CITY.movers.push(near ? { obj: m, r: 120 + R() * 160, h: 22 + R() * 30, sp: (R() < .5 ? -1 : 1) * (.0012 + R() * .001), a: R() * 6.283, cx: 8 + (R() - .5) * 60, cz: 160 + R() * 60 }
      : { obj: m, r: 80 + R() * 400, h: 30 + R() * 200, sp: (R() < .5 ? -1 : 1) * (.0006 + R() * .0012), a: R() * 6.283, cx: (R() - .5) * 400, cz: 300 + R() * 500 }) }
  // an advertising blimp, slowly circling the river
  { const m = single(q => { q.with(M4.rz(HP), m2 => m2.lathe('white', [[0, -9], [2.6, -7], [3.4, -3], [3.5, 3], [2.8, 7], [0, 9]], { seg: 12, col: [.16, .16, .2, 0] })); q.decal('ad_logo', 0, 0, 3.55, 9, 4.5, 's', [1, 1, 1, 1]); q.decal('ad_logo', 0, 0, -3.55, 9, 4.5, 'n', [1, 1, 1, 1]); q.box('white', -.6, -4.2, -1.2, .6, -3.2, 1.2, { col: [1, .3, .7, 1] }) });
    CITY.movers.push({ obj: m, r: 220, h: 70, sp: .00022, a: 1, cx: 8, cz: 340, blimp: 1 }) }
  // ---- v77: the side street down to the river is a real street now (the last scene walks down it): pavements with
  // kerbs, a zebra crossing over the main road, buildings shoulder to shoulder on both sides with shops at street level,
  // awnings, neon signs, steam, bins, parked cars, and the noodle place on Fourth with its flickering O
  { const st = new MB(), E = [1, 1, 1, 1], W0 = -.6, E0 = 14.6;
    tex('noodle', 128, (g, s, h) => { g.fillStyle = '#0a0608'; g.fillRect(0, 0, s, h); g.font = 'bold 24px sans-serif'; g.textAlign = 'center'; g.fillStyle = '#ff5a3a'; g.shadowColor = '#ff5a3a'; g.shadowBlur = 6; g.fillText('N  ODLES', s / 2, 26); g.strokeStyle = '#ffd040'; g.lineWidth = 2; g.strokeRect(3, 3, s - 6, h - 6) }, 36);
    tex('zebra', 16, (g, s) => { g.fillStyle = '#1a1a1e'; g.fillRect(0, 0, s, s); g.fillStyle = '#d8d8d0'; g.fillRect(0, 0, s, s / 2) });
    st.box('cwalk', W0 - 2, 0, 31.6, 2, .12, 110, { us: 2 }); st.box('cwalk', 12, 0, 31.6, E0 + 2, .12, 110, { us: 2 });   // pavements
    st.box('chrome', 1.95, 0, 31.6, 2.05, .13, 110); st.box('chrome', 11.95, 0, 31.6, 12.05, .13, 110);   // kerbs
    for (let x = -.8; x < 3.2; x += .8) st.box('zebra', x, .001, 20.2, x + .45, .006, 29.8, { skip: 'nsewb' });   // the crossing they use
    const NEON = ['neon0', 'neon1', 'neon2', 'neon3', 'neon4', 'neon5'], SC = [[1, .25, .7], [.25, .9, 1], [1, .8, .25], [.6, .4, 1], [.4, 1, .6]];
    for (const side of [-1, 1]) { let z = 33.5;
      while (z < 106) { const w = 6 + R() * 7, h = (z < 60 ? 9 : 14) + R() * (z < 60 ? 9 : 22), d = 10 + R() * 6, fx = side < 0 ? W0 : E0, x0 = side < 0 ? fx - d : fx, x1 = side < 0 ? fx : fx + d;
        st.box(['cw1', 'cw4', 'cw3'][(R() * 3) | 0], x0, 0, z, x1, h, z + w - .2, { us: 14, col: E, tf: { t: 'cwtop' } });
        st.box('cshop', side < 0 ? fx - .05 : fx - .02, 0, z + .3, side < 0 ? fx + .02 : fx + .05, 3.6, z + w - .5, { us: 6, col: E });   // the shop window
        const c = SC[(R() * SC.length) | 0], ax = side < 0 ? fx : fx;   // an awning with a lit edge
        st.box('white', side < 0 ? ax : ax - 1.6, 3.7, z + .4, side < 0 ? ax + 1.6 : ax, 3.82, z + w - .6, { col: [c[0] * .25, c[1] * .25, c[2] * .25, 0] });
        st.box('white', side < 0 ? ax + 1.55 : ax - 1.6, 3.62, z + .4, side < 0 ? ax + 1.6 : ax - 1.55, 3.7, z + w - .6, { col: [...c, 1] });
        const sh = 2 + R() * 4, sz = z + w / 2; st.decal(NEON[(R() * 6) | 0], side < 0 ? fx + .32 : fx - .32, 5 + R() * Math.max(1, h - 9), sz, 1.2 + R(), sh, side < 0 ? 'e' : 'w', E);   // a vertical neon sign
        if (R() < .5) { st.box('darkplastic', side < 0 ? fx + .1 : fx - .9, 0, sz - .4, side < 0 ? fx + .9 : fx - .1, .9, sz + .4) }   // bins
        z += w;
      }
      for (let z = 40; z < 104; z += 17 + R() * 10) { const x = side < 0 ? 2.9 : 11.1, c = [[.25, .05, .08, 0], [.08, .1, .2, 0], [.15, .15, .17, 0], [.4, .35, .3, 0]][(R() * 4) | 0];   // parked cars
        st.box('white', x - .9, .25, z - 2.1, x + .9, 1.05, z + 2.1, { col: c, bev: .15 }); st.box('white', x - .8, 1.05, z - 1.2, x + .8, 1.55, z + 1.1, { col: [.05, .06, .09, 0], bev: .1 }) }
    }
    // the noodle place on Fourth, on the west side where they walk past it: its sign, and the O that flickers
    st.decal('noodle', W0 + .33, 4.6, 44, 4.2, 1.2, 'e', E);
    LIFE.flick = single(q => q.box('white', W0 + .34, 4.38, 43.55, W0 + .36, 4.82, 43.85, { col: [1, .35, .2, 1] }));
    // steam from a grate, and lamp posts along both pavements
    for (let z = 38; z < 108; z += 12) for (const x of [-.2, 13.4]) { st.box('darkplastic', x - .05, 0, z - .05, x + .05, 5, z + .05); st.box('white', x - .25, 4.9, z - .12, x + .25, 5, z + .12, { col: [1, .85, .6, 1] }) }
    LIFE.street = st.build();
  }
  // ---- people: where they walk, which way, how fast, what they look like
  const SKIN = [[.95, .8, .68], [.82, .62, .48], [.6, .42, .3], [.4, .28, .2], [.9, .74, .62]], COAT = [[.1, .1, .12], [.25, .2, .3], [.35, .12, .14], [.12, .2, .3], [.5, .45, .4], [.2, .22, .2], [.06, .06, .08]];
  const ped = (path, x, z, dir, y0 = .12) => ({ path, x, z, y0, dir, v: (1.1 + R() * .7) / 60, ph: R() * 6.28, h: 1.55 + R() * .3, skin: SKIN[(R() * SKIN.length) | 0], coat: COAT[(R() * COAT.length) | 0], legs: COAT[(R() * COAT.length) | 0],
    trim: R() < .35 ? NE[(R() * NE.length) | 0] : null, umb: R() < .18 ? NE[(R() * NE.length) | 0] : null, bag: R() < .3, hair: R() < .5 ? [.08, .06, .05] : NE[(R() * NE.length) | 0].slice(0, 3).map(v => v * .7), stand: 0 });
  for (let i = 0; i < 70; i++) { const s = R() < .5 ? 0 : 1, z = s ? 30.4 + R() * .9 : 18.7 + R() * .9; LIFE.peds.push(ped('main', -140 + R() * 300, z, R() < .5 ? -1 : 1)) }
  for (let i = 0; i < 40; i++) { const west = R() < .45, p = ped('side', west ? .3 + R() * 1.3 : 12.6 + R() * 1.4, west ? 62 + R() * 44 : 36 + R() * 70, R() < .5 ? -1 : 1);   /* (none on their pavement near the house: they walk there) */ LIFE.peds.push(p) }
  for (let i = 0; i < 26; i++) LIFE.peds.push(ped('river', -150 + R() * 320, 111.5 + R() * 3, R() < .5 ? -1 : 1, .5));
  for (let i = 0; i < 14; i++) { const p = ped('main', -120 + R() * 260, R() < .5 ? 31.2 : 18.6, 1); if (Math.abs(p.x - 8) < 12) p.x += 30; p.stand = 1; p.v = 0; p.face = R() < .5 ? 1 : -1; LIFE.peds.push(p) }
};
function lifeTick() {
  if (!CITY.obj) return; const t = ++LIFE.t;
  if (LIFE.flick) LIFE.flick.vis = !(t % 97 < 6 || t % 211 < 9 || (t % 400 > 200 && t % 400 < 214));   // the O, flickering for six years
  // the crossing: while the two of them walk out to the side street, the cars on the main road stop and queue
  const xing = P2.cut && P2.cut.k == 'cityend' && P2.cut.t < 700;
  for (const c of LIFE.cars) {
    if (c.road == 'main') { const nx = c.x + c.dir * c.v, lane = LIFE.cars.filter(o => o != c && o.road == 'main' && Math.abs(o.z - c.z) < .5 && (o.x - c.x) * c.dir > 0 && (o.x - c.x) * c.dir < 6.5);
      if (xing && ((c.dir > 0 && c.x < -4 && nx >= -4) || (c.dir < 0 && c.x > 6 && nx <= 6))) { c.stopped = 1; continue } if (lane.length && lane.some(o => o.stopped)) { c.stopped = 1; continue } c.stopped = 0; }
    if (c.road == 'main') { c.x += c.dir * c.v * 60 / 60; if (c.x > 320) c.x = -320; if (c.x < -320) c.x = 320;
      // now and then a car turns down the side street
      if (c.dir > 0 && Math.abs(c.x - 9.2) < c.v && (c.z > 23) && Math.random() < .25) { c.road = 'side'; c.dir = 1; c.x = 9.2; c.z = 31.5 } }
    else { c.z += c.dir * c.v; if (c.z > 109) { c.road = 'main'; c.dir = -1; c.z = 28.4; c.x = 300 } if (c.z < 31.5) { c.road = 'main'; c.dir = -1; c.z = 26.1; c.x = 4.8 } }
    const yaw = c.road == 'main' ? (c.dir > 0 ? 0 : Math.PI) : (c.dir > 0 ? -HP : HP);
    c.obj.M = M4.mul(M4.tr(c.x, 0, c.z), M4.ry(yaw));
  }
  if (t % 2) return;
  const mb = new MB(), cx = CAM3.x, cz = CAM3.z;
  for (const p of LIFE.peds) {
    if (!p.stand) { if (p.path == 'side') { const lo = p.x < 7 ? 62 : 34; p.z += p.dir * p.v * 2; if (p.z > 108) p.z = lo; if (p.z < lo) p.z = 108 } else { p.x += p.dir * p.v * 2; if (p.x > 180) p.x = -160; if (p.x < -160) p.x = 180 } }
    if (Math.hypot(p.x - cx, p.z - cz) > 260) continue;
    const w = p.stand ? 0 : Math.sin(t * .09 * (p.v * 60) + p.ph), d = p.stand ? p.face : p.dir, h = p.h, x = p.x, z = p.z, y = p.y0, s = h / 1.7, sw = p.path == 'side';
    // (people on the side street walk along z: the same body, turned a quarter)
    const B = sw ? (a0, b0, c0, a1, b1, c1, col) => mb.box('white', x + Math.min(c0, c1), y + b0, z + Math.min(a0 * d, a1 * d), x + Math.max(c0, c1), y + b1, z + Math.max(a0 * d, a1 * d), { col: [...col, 0] })
      : (a0, b0, c0, a1, b1, c1, col) => mb.box('white', x + Math.min(a0 * d, a1 * d), y + b0, z + c0, x + Math.max(a0 * d, a1 * d), y + b1, z + c1, { col: [...col, 0] });
    // legs swinging, the torso, arms, the head and hair
    B(-.07 + w * .18 * s, 0, -.13 * s, .07 + w * .18 * s, .82 * s, -.03 * s, p.legs); B(-.07 - w * .18 * s, 0, .03 * s, .07 - w * .18 * s, .82 * s, .13 * s, p.legs);
    B(-.12 * s, .8 * s, -.2 * s, .12 * s, 1.42 * s, .2 * s, p.coat); if (p.trim) mb.box('white', x - .125 * s, y + .8 * s, z - .21 * s, x + .125 * s, y + .86 * s, z + .21 * s, { col: p.trim });
    B(-.05 - w * .12 * s, .85 * s, -.27 * s, .05 - w * .12 * s, 1.38 * s, -.2 * s, p.coat); B(-.05 + w * .12 * s, .85 * s, .2 * s, .05 + w * .12 * s, 1.38 * s, .27 * s, p.coat);
    B(-.1 * s, 1.44 * s, -.1 * s, .1 * s, 1.66 * s, .1 * s, p.skin); B(-.11 * s, 1.58 * s, -.11 * s, .08 * s, 1.7 * s, .11 * s, p.hair);
    if (p.bag) B(-.08 * s, .9 * s, .2 * s, .08 * s, 1.15 * s, .3 * s, [.15, .1, .08]);
    if (p.umb) { mb.box('white', x - .015, y + 1.3 * s, z - .015, x + .015, y + 2.05 * s, z + .015, { col: [.1, .1, .1, 0] }); mb.box('white', x - .5, y + 2.02 * s, z - .5, x + .5, y + 2.08 * s, z + .5, { col: [p.umb[0] * .5, p.umb[1] * .5, p.umb[2] * .5, 0] }); mb.box('white', x - .52, y + 2.0 * s, z - .52, x + .52, y + 2.02 * s, z + .52, { col: p.umb }) }
  }
  LIFE.obj = dynObj(LIFE.obj, mb);
}
const _cityTick73 = cityTick;
cityTick = function () { _cityTick73(); lifeTick() };
