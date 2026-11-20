// ==================== PART TWO: settings, breathing, choices, light switches, reaching hands, saving the moment ====================

// ---------------------------------------------------------------- settings (kept between sessions)
const P2O = Object.assign({ sens: 1, fov: 66, invert: 0, bob: 1, subs: 1, fx: 1 }, (() => { try { return JSON.parse(ST.get('syn_p2opt') || '{}') } catch (e) { return {} } })());
const p2OptSave = () => { try { ST.set('syn_p2opt', JSON.stringify(P2O)) } catch (e) {} };
const P2MENU = [
  { k: 'sens', n: 'Mouse sensitivity', min: .2, max: 3, step: .1, f: v => v.toFixed(1) + '×' },
  { k: 'fov', n: 'Field of view', min: 55, max: 100, step: 1, f: v => Math.round(v) + '°' },
  { k: 'invert', n: 'Invert mouse Y', opts: ['Off', 'On'] },
  { k: 'bob', n: 'Head bob and breathing', opts: ['Off', 'Low', 'Full'], vals: [0, .5, 1] },
  { k: 'subs', n: 'Subtitle size', opts: ['Small', 'Normal', 'Large', 'Huge'], vals: [.85, 1, 1.25, 1.5] },
  { k: 'fx', n: 'Film effects (glow, grain)', opts: ['Off', 'On'] },
  { k: 'vol', n: 'Volume', min: 0, max: 10, step: 1, f: v => Math.round(v * 10) + '%' },
];
const p2OptGet = r => r.k == 'vol' ? opt.s : P2O[r.k];
function p2OptSet(r, v) { if (r.k == 'vol') { opt.s = v; try { saveOpt && saveOpt() } catch (e) {} } else { P2O[r.k] = v; p2OptSave() } }
function p2OptStep(r, d) {
  if (r.opts) { const vals = r.vals || r.opts.map((_, i) => i); let i = vals.findIndex(v => Math.abs(v - p2OptGet(r)) < 1e-6); if (i < 0) i = 0; i = clamp(i + d, 0, vals.length - 1); p2OptSet(r, vals[i]) }
  else p2OptSet(r, clamp(Math.round((p2OptGet(r) + d * r.step) / r.step) * r.step, r.min, r.max));
  beep(520, .03);
}
// the pause menu: Resume / Settings / Quit to title. Opens with Tab or P, or when the mouse is let go (Esc) mid-game.
function p2Pause() { if (P2.ui || P2.cut || P2.choice || P2.scene != 'house') return; P2.ui = { k: 'menu', page: 'main', sel: 0, t: 0 }; p2Unlock() }
addEventListener('keydown', e => { if (sc == 'p2' && (e.code == 'Tab' || e.code == 'KeyP')) { e.preventDefault(); if (P2.ui && P2.ui.k == 'menu') p2MenuClose(); else p2Pause() } });
document.addEventListener('pointerlockchange', () => { if (!document.pointerLockElement && sc == 'p2' && P2.wantLock && !P2.ui && !P2.cut && !P2.choice && P2.scene == 'house') p2Pause() });
function p2MenuClose() { P2.ui = null; P2.wantLock = true }
function p2MenuItems(u) { return u.page == 'main' ? ['Resume', 'Settings', 'Quit to title'] : [...P2MENU.map(r => r.n), 'Back'] }
function p2MenuUpdate(u) {
  u.t++; const items = p2MenuItems(u), n = items.length, mx = P2MOUSE.x, my = P2MOUSE.y, rowY = i => (u.page == 'main' ? 72 : 44) + i * (u.page == 'main' ? 16 : 15);
  if (up()) { u.sel = (u.sel + n - 1) % n; beep(500, .03) } if (dn()) { u.sel = (u.sel + 1) % n; beep(500, .03) }
  let click = -1; if (P2MOUSE.moved || P2MOUSE.click) items.forEach((_, i) => { if (my > rowY(i) - 3 && my < rowY(i) + 11 && mx > 50 && mx < 270) { u.sel = i; if (P2MOUSE.click) click = i } });
  const row = u.page == 'settings' ? P2MENU[u.sel] : null;
  if (row) { if (lf()) p2OptStep(row, -1); if (rt()) p2OptStep(row, 1); if (click >= 0 && click < P2MENU.length) p2OptStep(row, mx < 160 ? -1 : 1) }
  const pick = (u.t > 4 && ok()) || (click >= 0 && !(u.page == 'settings' && click < P2MENU.length));
  if (pick) { const it = items[u.sel]; beep(700, .04);
    if (it == 'Resume') p2MenuClose(); else if (it == 'Settings') { u.page = 'settings'; u.sel = 0 } else if (it == 'Back') { u.page = 'main'; u.sel = 1 }
    else if (it == 'Quit to title') { P2.ui = null; AMB3.stop(); p2Unlock(); title() }
    else if (row && row.opts) p2OptStep(row, 1) }
  if (u.t > 4 && (esc() || hit.KeyX)) { if (u.page == 'settings') { u.page = 'main'; u.sel = 1 } else p2MenuClose() }
  P2MOUSE.click = 0; P2MOUSE.moved = 0;
}
function drawP2Menu(u) {
  sU(); X.globalAlpha = .82; r(0, 0, W, H, '#000'); X.globalAlpha = 1; const items = p2MenuItems(u);
  ptxt(u.page == 'main' ? 'Paused' : 'Settings', W / 2, u.page == 'main' ? 44 : 20, '#eee', 'center', 11, FONT, null);
  items.forEach((it, i) => { const on = u.sel == i, y = (u.page == 'main' ? 72 : 44) + i * (u.page == 'main' ? 16 : 15);
    if (u.page == 'main' || it == 'Back') { if (on) r(W / 2 - 50, y - 2, 100, 13, '#2a2630'); ptxt(it, W / 2, y, on ? '#fff' : '#999', 'center', 8, FONT, null); return }
    const row = P2MENU[i], v = p2OptGet(row), val = row.opts ? row.opts[Math.max(0, (row.vals || row.opts.map((_, j) => j)).findIndex(x => Math.abs(x - v) < 1e-6))] : row.f(v);
    if (on) r(54, y - 2, 212, 13, '#2a2630'); ptxt(row.n, 62, y, on ? '#fff' : '#aaa', 'left', 7, FONT, null); ptxt((on ? '‹ ' : '') + val + (on ? ' ›' : ''), 258, y, on ? '#f0d8a0' : '#888', 'right', 7, FONT, null) });
  ptxt(u.page == 'main' ? 'Z or click: choose      Tab, P or X: back to the game' : '← →: change      click: left half lowers, right half raises      X: back', W / 2, H - 16, '#666', 'center', 5.5, FONT, null);
}

// ---------------------------------------------------------------- breathing and head bob, tied to how she's doing
function p2Stress() {
  if (P2.day == 3) return .8 + (P2.d2 && P2.d2.climax ? .2 : 0);
  if (P2.day == 2) return .26;
  if (P2.day == 4) return P2.f.found ? .9 : .45;
  if (P2.day == 5) return .12;
  return .15 + (P2.f.texting ? .35 : 0) + (P2.f.thrown ? .1 : 0) + (P2.f.vomited ? .1 : 0);
}
function p2CamFx(mv) {   // called from p2Walk every frame you're free to move
  const k = P2O.bob, st = p2Stress(), dt = 1 / 60;
  P2.brP = (P2.brP || 0) + dt * Math.PI * 2 / (4.2 - st * 2.1 - (mv ? .4 : 0));   // a breath every 4 s when calm, every 2 s when frightened
  P2.stepAmt = (P2.stepAmt || 0) + ((mv ? 1 : 0) - (P2.stepAmt || 0)) * .12;
  const br = Math.sin(P2.brP), w = P2.stepAmt, b = PL3.bob, right = [Math.cos(CAM3.yaw), Math.sin(CAM3.yaw)];
  const shake = st > .5 ? (Math.sin(P2.t * .93) * .6 + Math.sin(P2.t * 1.71 + 1) * .4) * (st - .5) : 0;
  const sway = Math.sin(b / 2) * .011 * w * k;   // side to side, once per two steps
  CAM3.x = PL3.x + right[0] * sway; CAM3.z = PL3.z - right[1] * sway;
  CAM3.y = PL3.y + PL3.eye + (Math.abs(Math.sin(b)) * .03 - .015) * w * k + br * (.004 + st * .005) * k;
  CAM3.roll = (Math.sin(b / 2) * .007 * w + shake * .006 + br * .0015) * k;
}

// ---------------------------------------------------------------- choices: a short list over the subtitles
// choose3(['A', 'B'], i => ...): she stops, the options appear; arrows / mouse / Z pick one.
function choose3(opts, cb, o = {}) { P2.choice = { opts, cb, sel: 0, t: 0, q: o.q }; if (!P2.ui && !P2.cut) { P2.cut = { k: 'wait' }; P2.choice.wait = 1 } }
function choiceUpdate() {
  const c = P2.choice; c.t++; if (subsBusy()) return; const n = c.opts.length, bw = 170, bh = 13, x0 = W / 2 - bw / 2, y0 = 112 - n * 8;
  if (up()) { c.sel = (c.sel + n - 1) % n; beep(500, .03) } if (dn()) { c.sel = (c.sel + 1) % n; beep(500, .03) }
  let click = -1; c.opts.forEach((_, i) => { const y = y0 + i * (bh + 3); if (P2MOUSE.x > x0 && P2MOUSE.x < x0 + bw && P2MOUSE.y > y && P2MOUSE.y < y + bh) { if (P2MOUSE.moved) c.sel = i; if (P2MOUSE.click) click = i } });
  if ((c.t > 10 && ok()) || click >= 0) { if (click >= 0) c.sel = click; P2.choice = null; if (c.wait && P2.cut && P2.cut.k == 'wait') P2.cut = null; beep(700, .05); for (const k in hit) hit[k] = 0; P2MOUSE.click = 0; c.cb(c.sel) }
  for (const k in hit) hit[k] = 0; P2MOUSE.click = 0;
}
function drawChoice3() {
  const c = P2.choice; if (!c || subsBusy()) return; sU(); const n = c.opts.length, bw = 170, bh = 13, x0 = W / 2 - bw / 2, y0 = 112 - n * 8, a = Math.min(1, c.t / 10);
  X.globalAlpha = a; if (c.q) ptxt(c.q, W / 2, y0 - 12, '#bbb', 'center', 6.5, P2.font);
  c.opts.forEach((o, i) => { const y = y0 + i * (bh + 3), on = c.sel == i; r(x0, y, bw, bh, on ? '#ddd' : '#555'); r(x0 + 1, y + 1, bw - 2, bh - 2, on ? '#141218' : '#0a090c'); if (on) r(x0 + 5, y + 5, 3, 3, '#fff'); ptxt(o, W / 2, y + 2.5, on ? '#fff' : '#9a98a4', 'center', 7, P2.font, null) });
  X.globalAlpha = 1;
  const mx = P2MOUSE.x, my = P2MOUSE.y; X.fillStyle = '#fff'; X.beginPath(); X.moveTo(mx * U, my * U); X.lineTo(mx * U, (my + 7) * U); X.lineTo((mx + 5) * U, (my + 5) * U); X.closePath(); X.fill();
}
// what she chose (part two), kept through the days and in saves; and what she chose in the dream (part one)
P2.ch = {};
const p2ChSave = () => { try { ST2s('ch', JSON.stringify(P2.ch)) } catch (e) {} };
const p1Ch = () => { try { return JSON.parse(ST.get('syn_p1ch') || '{}') } catch (e) { return {} } };
// the choices that reach out (to her sister, her friends, herself): enough of them and somebody calls back
function p2Hope() { const c = P2.ch, p = p1Ch(); return [c.pill1, c.pillB, c.pill2, c.mail == 1, c.letter, c.curtains, c.gift, c.kept, c.reach2, c.glass, p.letgo].filter(Boolean).length }
const HOPE_NEEDED = 4;   // of eleven

// ---------------------------------------------------------------- the hand reaching for things (doors, switches, the pill bottle...)
function reachThen(pt, fn, o = {}) {
  if (P2.ui || P2.cut || !pt) return fn();
  P2.cut = { k: 'reach', t: 0, pt, fn, len: o.len || 26, curl: o.curl ?? .7 };
}
function reachCut(c) {
  const t = ++c.t, hit2 = Math.round(c.len * .55), rest = [.22, -.42, -.12];
  const q = t < hit2 ? ease3(t / hit2) : 1 - ease3((t - hit2) / (c.len - hit2)), at = V3.lerp(rest, toCam(c.pt), q * .92);
  ME.vm = { R: vmArm(1, at, [.05, .3, -1], [-.3, -.2, -1], q > .85 ? c.curl : .3, [1, -.7, .4]) };
  if (t == hit2) { const f = c.fn; c.fn = null; P2.cut = null; ME.vm = null; f && f(); if (!P2.cut && !P2.ui) { P2.cut = c; c.after = 1 } else return }
  if (t >= c.len) { if (P2.cut === c) P2.cut = null; ME.vm = null }
}
const bc = b => [(b[0] + b[3]) / 2, (b[1] + b[4]) / 2, (b[2] + b[5]) / 2];
const _doorUse53 = doorUse;
doorUse = function (d) { if (d.locked) { const m = typeof d.locked == 'function' ? d.locked() : d.locked; if (m) return _doorUse53(d) }
  const knob = M4.pt(d.obj.M, [DOORW - .09, 1.0, 0]); reachThen(knob, () => _doorUse53(d), { len: 24 }) };

// ---------------------------------------------------------------- light switches, one per room, by a door
const SWITCHES = [];
function lightRoom(p) { return roomAt(p[0], p[2], p[1] > 3 ? 3.1 : .1) }
function addSwitches() {
  SWITCHES.length = 0; const seen = {}, mb = new MB();
  for (const d of H3.doors) for (const s of [-1, 1]) {
    const W2 = DOORW, x = d.along == 'x' ? d.hx + W2 + .2 : d.hx + s * .075, z = d.along == 'x' ? d.hz + s * .075 : d.hz + W2 + .2, y = d.y + 1.2;
    const room = roomAt(d.along == 'x' ? x : d.hx + s * .5, d.along == 'x' ? d.hz + s * .5 : z, d.y + .1); if (!room || seen[room]) continue; seen[room] = 1;
    const ax = d.along == 'x', n = s;   // the plate sits flat on the wall, facing into the room
    if (ax) { mb.box('trimw', x - .04, y - .06, z, x + .04, y + .06, z + n * .012, { bev: .004 }); mb.box('darkplastic', x - .012, y - .02, z + n * .012, x + .012, y + .02, z + n * .02) }
    else { mb.box('trimw', x, y - .06, z - .04, x + n * .012, y + .06, z + .04, { bev: .004 }); mb.box('darkplastic', x + n * .012, y - .02, z - .012, x + n * .02, y + .02, z + .012) }
    const box = ax ? [x - .1, y - .12, Math.min(z, z + n * .1), x + .1, y + .12, Math.max(z, z + n * .1)] : [Math.min(x, x + n * .1), y - .12, z - .1, Math.max(x, x + n * .1), y + .12, z + .1];
    const sw = { room, p: [x + (ax ? 0 : n * .02), y, z + (ax ? n * .02 : 0)] }; SWITCHES.push(sw);
    inter('sw_' + room, box, 'Light switch', () => reachThen(sw.p, () => p2Switch(sw), { len: 20, curl: .2 }));
  }
  // rooms with only an open archway (the kitchen): a switch beside the opening
  for (const g of GAPS) { if (g.ax != 'z') continue; for (const s of [-1, 1]) { const x = g.c + s * .075, z = g.a - .25, y = (g.y || 0) + 1.2, room = roomAt(g.c + s * .5, z, (g.y || 0) + .1); if (!room || seen[room]) continue; seen[room] = 1;
    mb.box('trimw', Math.min(x, x + s * .012), y - .06, z - .04, Math.max(x, x + s * .012), y + .06, z + .04, { bev: .004 }); mb.box('darkplastic', Math.min(x + s * .012, x + s * .02), y - .02, z - .012, Math.max(x + s * .012, x + s * .02), y + .02, z + .012);
    const sw = { room, p: [x + s * .02, y, z] }; SWITCHES.push(sw); inter('sw_' + room, [Math.min(x, x + s * .1), y - .12, z - .1, Math.max(x, x + s * .1), y + .12, z + .1], 'Light switch', () => reachThen(sw.p, () => p2Switch(sw), { len: 20, curl: .2 })) } }
  H3.extra.switches = mb.build();
}
const _buildHouse53 = buildHouse;
buildHouse = function () { const was = H3.built; _buildHouse53(); if (!was) { addSwitches(); p2Extras(); p2ReachWrap() } };
// picking things up: the hand goes out to the pill bottle, the phone, the photographs, the landline, the fridge handle is its own scene
function p2ReachWrap() {
  for (const it of H3.inter) if (['pills', 'phone', 'polaroids', 'landline', 'brokenphone', 'tv', 'games'].includes(it.id)) { const o = it.on; it.on = () => reachThen(bc(it.box), o, { len: 26, curl: .75 }) }
  const ph = H3.inter.find(i => i.id == 'phone'); if (ph) ph.cond = () => H3.extra.phone.vis;
  if (H3.brokenInter) H3.brokenInter.cond = () => H3.extra.phonebroken.vis;
}
function p2LightDefault(room) { return P2.day == 4 ? room == 'hitori' : true }
const lightOn = room => P2.lights && room in P2.lights ? P2.lights[room] : p2LightDefault(room);
function p2Switch(sw) {
  P2.lights = P2.lights || {}; const on = !lightOn(sw.room); P2.lights[sw.room] = on; SFXN.lightSwitch(sw.p);
  // day 2: sometimes the light doesn't stay the way you left it
  if (P2.day == 3 && !on && Math.random() < .35) setTimeout(() => { if (P2.day == 3 && P2.lights[sw.room] === false) { P2.lights[sw.room] = true; SFXN.lightSwitch(sw.p); SFX3.whisper(.25, 1) } }, 1400 + Math.random() * 1500);
}
const _houseScene53 = houseScene;
houseScene = function () {
  const s = _houseScene53(); if (P2.outside) return s;
  const big = l => l.r >= 5;   // the room lights; lamps and the monitor are left alone
  if (P2.day != 4) s.lights = s.lights.filter(l => !big(l) || lightOn(lightRoom(l.p)));
  else for (const id in (P2.lights || {})) if (P2.lights[id]) { const L = ROOMLIGHT[id]; if (L) { const q = LM(L[0], L[2], L[1]); s.lights.push({ p: [q[0], L[1], q[1]], c: [.85, .7, .5], r: 9 }) } }
  if (P2.day == 5) s.amb = [.24, .23, .25]; if (P2.day == 2) s.amb = [.27, .26, .25];
  s.ao = 1; s.stress = P2.day == 3 ? .55 + (P2.d2 && P2.d2.climax ? .45 : 0) : P2.day == 4 && P2.f.found ? .5 : 0;
  if (H3.extra.daywin && H3.extra.daywin.vis) s.lights.push({ p: [15.5, 4.5, 12.95], c: P2.day == 3 ? [.5, .42, .4] : [1.0, .95, .8], r: 6.5 });
  if (P2.npc) s.objs.push(...poseModel(hikariModel(), P2.npc, { head: true }));
  return s;
};
const ROOMLIGHT = { hall: [6.2, 2.3, 7], kitchen: [10.3, 2.3, 6.5], living: [2, 2.3, 7], upstairs: [6.8, 5.3, 6], corridor: [6.2, 2.3, 2], bath0: [10.3, 2.3, 1.8], ubath: [2, 5.3, 2.2], parents: [2, 5.3, 7], sister: [10.3, 5.3, 2.5], hitori: [10.3, 5.3, 7.5] };

// ---------------------------------------------------------------- the house, changing from day to day
// day 2 (and what her sister finds): sticky notes round the hall mirror and on her door, a chair jammed under the front
// door handle, plates and takeout piled up in the kitchen and her room, the hall clock stopped.
function p2Extras() {
  if (!TX.sticky) { tex('sticky', 32, (g, s) => { g.fillStyle = '#e8d870'; g.fillRect(0, 0, s, s); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(0, 0, s, 4); g.strokeStyle = '#2a2a6a'; g.lineWidth = 1.3; const R = rng(91);
    for (let l = 0; l < 4; l++) { g.beginPath(); let x = 4, y = 9 + l * 6; g.moveTo(x, y); while (x < s - 4) { x += 1.5 + R() * 2.5; y += (R() - .5) * 2.2; g.lineTo(x, y) } g.stroke() } texNoiseOver(g, s, .06, 92) });
    tex('takeout', 16, (g, s) => { texNoise(g, s, '#d8d0c0', .1, 93, 1); g.fillStyle = '#a02020'; g.fillRect(4, 6, 8, 3) }) }
  const mb = new MB(), R = rng(31);
  // notes round the hall mirror (old plan: x 8.54, mirror at z 3.2) and over her door
  const hm = H3.mirrors.find(m => Math.abs(m.p[1] - 1.5) < .1 && m.p[1] < 2.5) || { p: [...L3P([8.54, 1.5, 3.2])] }, [mx, my, mz] = hm.p;
  // flat on the wall the mirror hangs on (found from the wall itself, not the mirror glass, so they don't float)
  const wx = wallFace(mx, my, mz, 1);
  for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283, rx = .42 + R() * .12, ry = .55 + R() * .12; mb.decal('sticky', wx - .004, my + Math.sin(a) * ry, mz + Math.cos(a) * rx, .075, .075, 'w') }
  // on her door itself (they swing with it)
  const hd = H3.doors.find(d => d.id == 'hitori');
  if (hd) { const dm = new MB(); for (let i = 0; i < 11; i++) { const u = .12 + R() * (DOORW - .3), v = .5 + R() * 1.4; dm.decal('sticky', u, v, .036, .075, .075, 's') } H3.extra.doorNotes = dm.build(); H3.extra.doorNotes.vis = false; H3.extra.doorNotes.door = hd }
  // takeout boxes and plates: the kitchen table, the counter by the sink, her floor
  const kt = [13.2, 12.0], hr = LM(10.6, 8.6, 3);   // the dining table (x 12.5-13.9, z 11.55-12.45, top at .78)
  for (let i = 0; i < 7; i++) { const [x, z] = [kt[0] + (R() - .5) * 1.0, kt[1] + (R() - .5) * .55]; mb.at(x, .785, z, R() * 3, m => { m.box('takeout', -.07, 0, -.05, .07, .07, .05, { bev: .005 }); m.box('takeout', -.072, .07, -.052, .072, .078, .052) }) }
  for (let i = 0; i < 6; i++) { const [x, z] = [hr[0] + (R() - .5) * 1.4, hr[1] + (R() - .5) * 1.2]; mb.at(x, 3, z, R() * 3, m => { if (i % 2) m.lathe('porcelain', [[0, 0], [.1, .004], [.12, .02]], { seg: 12, cap: 'b' }); else m.box('takeout', -.07, 0, -.05, .07, .07, .05, { bev: .005 }) }) }
  H3.extra.d2mess = mb.build(); H3.extra.d2mess.vis = false;
  // the chair under the front door handle
  const fd = H3.inter.find(i => i.id == 'frontdoor'); if (fd) { const c = bc(fd.box), cm = new MB(); cm.with(M4.chain(M4.tr(c[0] + .25, 0, HOUSE_D - .5), M4.rx(-.38)), m => MOD.chair(m));   // a kitchen chair tipped back, its top rail wedged under the handle
    H3.extra.d2chair = cm.build(); H3.extra.d2chair.vis = false; H3.d2chairSolid = hs(c[0] - .25, 0, HOUSE_D - .7, c[0] + .25, .9, HOUSE_D - .1); H3.d2chairSolid.off = true;
    inter('d2chair', [c[0] - .3, 0, HOUSE_D - .8, c[0] + .3, 1, HOUSE_D - .1], 'Chair', () => P2S.look('d2chair'), () => H3.extra.d2chair.vis) }
  inter('stickies', [mx - .1, my - .8, mz - .7, mx + .05, my + .8, mz + .7], 'Notes', () => P2S.look('stickies'), () => H3.extra.d2mess.vis);
}
// the nearest wall surface from a point, looking along x (dir -1 = towards smaller x): for sticking things flat onto it
function wallFace(x, y, z, dir) { let best = x;
  for (const b of H3.solids) { if (b.off || y < b.y0 || y > b.y1 || z < b.z0 || z > b.z1) continue; const f = dir < 0 ? b.x1 : b.x0; if ((f - x) * dir < -.3 || (f - x) * dir > .3) continue; if (best === x || (f - x) * dir < (best - x) * dir) best = f }
  return dir < 0 ? best + .0 : best }
function p2HouseForDay() {
  const mess = P2.day == 3 || P2.day == 4; if (H3.extra.d2mess) H3.extra.d2mess.vis = mess; if (H3.extra.doorNotes) H3.extra.doorNotes.vis = mess;
  if (H3.extra.d2chair) { H3.extra.d2chair.vis = P2.day == 3; H3.d2chairSolid.off = P2.day != 3 }
  if (P2.day == 3) for (const d of H3.doors) { if (d.id == 'parents' || d.id == 'ubath' || d.id == 'bath0') d.to = d.a = 1 }   // doors you closed are standing open
  SND.clockStopped = P2.day == 3 || P2.day == 4;   // the hall clock has stopped
}

// ---------------------------------------------------------------- starting a stage; saving and loading the exact moment
const _p2Begin53 = p2Begin, _p2Stage53 = p2Stage;
p2Begin = function (stage = 'day1', ex) {
  P2.ch = ex ? (ex.ch || {}) : stage == 'day1' ? {} : (() => { try { return JSON.parse(ST2('ch') || '{}') } catch (e) { return {} } })(); p2ChSave(); P2.lights = {}; P2.npc = null;
  _p2Begin53(stage); if (ex) { if (P2.ui && P2.ui.k == 'warn') { const n = P2.ui.next; P2.ui.next = () => { n(); p2Restore(ex) } } else p2Restore(ex) }
};
p2Stage = function (stage) {
  if (stage == 'home') return p2Home();
  P2.lights = {}; P2.npc = null; _p2Stage53(stage); p2HouseForDay();
  if (stage == 'sister') { H3.extra.phonebroken.vis = !!P2.ch.broke; H3.extra.phone.vis = !P2.ch.broke }
};
function p2Snapshot() {
  return { day: P2.day, stage: P2.stage, f: P2.f, ch: P2.ch, lights: P2.lights || {}, pl: [CHX - .7, 3, CHZ], yaw: -HP, objective: P2.objective, sisName: P2.sisName,
    doors: H3.doors.map(d => d.to), d2: P2.d2 ? { rooms: P2.d2.rooms, t: P2.d2.t } : null, shadows: SHADOWS.map(s => s.gone ? 1 : 0),
    d2b: P2.d2b || null, p1: p1Ch(), phone: H3.extra.phone.vis ? 1 : 0, broken: H3.extra.phonebroken.vis ? 1 : 0, brokenAt: H3.brokenAt, amb: P2.amb };
}
// save into a slot (from the computer): the whole state, so loading puts you back exactly here, standing up from the desk
function p2Save(i) { ST.set(SK(i), JSON.stringify({ p2: P2.stage == 'dealer' ? 'day1' : P2.stage == 'subway' ? 'day2' : P2.stage || 'day1', at: Date.now(), ex: p2Snapshot() })); ST.set('syn_played', 1) }
function p2Restore(ex) {
  P2.subs = []; P2.cut = null; P2.ui = null; P2.choice = null; P2.hideBody = 0; P2.blink = 0; P2.fade = 1; P2.fadeTo = 0; ME.vm = null; CAM3.roll = 0; CAM3.shake = 0;
  Object.assign(P2.f, ex.f || {}); P2.ch = ex.ch || {}; p2ChSave(); P2.lights = ex.lights || {}; P2.objective = ex.objective || ''; P2.sisName = ex.sisName || '???';
  (ex.doors || []).forEach((v, i) => { if (H3.doors[i]) H3.doors[i].to = H3.doors[i].a = v });
  if (ex.d2 && P2.d2) { P2.d2.rooms = ex.d2.rooms || {}; P2.d2.t = ex.d2.t || 0 } (ex.shadows || []).forEach((g, i) => { if (SHADOWS[i]) SHADOWS[i].gone = g });
  H3.extra.phone.vis = !!ex.phone; H3.extra.phonebroken.vis = !!ex.broken;
  if (ex.brokenAt) { H3.brokenAt = ex.brokenAt; H3.extra.phonebroken.M = M4.tr(...ex.brokenAt); const b = ex.brokenAt; H3.brokenInter.box = [b[0] - .18, b[1] - .05, b[2] - .18, b[0] + .18, b[1] + .2, b[2] + .18] }
  if (ex.amb) P2.amb = ex.amb; if (ex.d2b) { P2.d2b = ex.d2b; if (ex.f && ex.f.steam) H3.extra.steam.vis = true; if (ex.f && ex.f.blinds) H3.extra.daywin.vis = true; if (ex.d2b.todo.mochi && !ex.d2b.ev.bowl) H3.extra.bowlfood.vis = true }
  PL3.x = ex.pl[0]; PL3.y = ex.pl[1]; PL3.z = ex.pl[2]; CAM3.yaw = ex.yaw; CAM3.pitch = -.05; CAM3.x = PL3.x; CAM3.y = PL3.y + PL3.eye; CAM3.z = PL3.z; P2.wantLock = true;
  p2HouseForDay();
}
const p2DayName2 = st => ({ day1: 'Day 1', dealer: 'Day 1', day2: 'Day 2', subway: 'Day 2', day3: 'Day 3', sister: 'Hikari comes home', home: 'The morning after' })[st] || 'Day 1';

CUTS.reach = reachCut; CUTS.wait = () => {};
// ---------------------------------------------------------------- hooking the frame: the pause menu and choices sit on top of everything
const _xscP2_53 = XSC.p2;
XSC.p2 = function () {
  if (P2.ui && P2.ui.k == 'menu') p2MenuUpdate(P2.ui);
  if (P2.choice) choiceUpdate();
  _xscP2_53();
  if (P2.choice) drawChoice3();
  if (P2.ui && P2.ui.k == 'menu') { drawP2Menu(P2.ui); const mx = P2MOUSE.x, my = P2MOUSE.y; X.fillStyle = '#fff'; X.beginPath(); X.moveTo(mx * U, my * U); X.lineTo(mx * U, (my + 7) * U); X.lineTo((mx + 5) * U, (my + 5) * U); X.closePath(); X.fill() }
};
