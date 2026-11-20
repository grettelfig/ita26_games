// ==================== PART TWO: the house's sounds ====================
// Made live in the browser (the ones approved in the Sound Lab), plus slots for recorded files: put a file in
// assets/sfx/ with the slot's name (.ogg, .mp3 or .wav) and it's used instead of the stand-in. See assets/sfx/SOUNDS_TO_FIND.txt.
// Positional sounds get quieter with distance, pan with where they are, and sound muffled from another room.
const SND = { bus: null, nb: null, loops: {}, files: {}, stepPhase: 0, nextRing: 0, nextPipes: 0, amb: false, dark: false };
const SND_SLOTS = ['door_creak', 'footstep_wood', 'footstep_tile', 'footstep_carpet', 'tap_running', 'pipes', 'clock_tick'];
function sndBoot() {
  if (SND.bus) return true; if (typeof AC == 'undefined' || !AC) return false;
  SND.bus = AC.createGain(); SND.bus.connect(AC.destination);
  const mk = kind => { const n = AC.sampleRate * 3, b = AC.createBuffer(1, n, AC.sampleRate), d = b.getChannelData(0); let b0 = 0, b1 = 0, b2 = 0, l = 0;
    for (let i = 0; i < n; i++) { const w = Math.random() * 2 - 1; if (kind == 'white') d[i] = w; else if (kind == 'pink') { b0 = .99765 * b0 + w * .099046; b1 = .963 * b1 + w * .2965164; b2 = .57 * b2 + w * 1.0526913; d[i] = (b0 + b1 + b2 + w * .1848) * .2 } else { l = (l + .02 * w) / 1.02; d[i] = l * 3.5 } } return b };
  SND.nb = { white: mk('white'), pink: mk('pink'), brown: mk('brown') };
  // the recorded sounds that came with the game (js/p2_sfxdata.js), decoded into buffers
  SND.buf = {}; if (typeof SFXDATA != 'undefined') for (const k in SFXDATA) { SND.buf[k] = []; for (const b64 of SFXDATA[k]) { const t = atob(b64), u8 = new Uint8Array(t.length); for (let i = 0; i < t.length; i++) u8[i] = t.charCodeAt(i);
    AC.decodeAudioData(u8.buffer, b => SND.buf[k].push(b), () => {}) } }
  SND.last = performance.now(); setInterval(() => { if (performance.now() - SND.last > 700 && Object.keys(SND.loops).length) sndStopAll() }, 300);   // left part two (or paused): go quiet
  return true;
}
// ---- recorded files: assets/sfx/<slot>.ogg|mp3|wav, and numbered variants <slot>_2, _3... picked at random
function sndFiles() {
  if (SND.filesTried) return; SND.filesTried = 1;
  const tryLoad = (name, k = 0, cb) => { const ext = ['ogg', 'mp3', 'wav'][k]; if (!ext) return cb(null); const a = new Audio(); a.preload = 'auto';
    a.addEventListener('canplaythrough', () => cb(a), { once: true }); a.addEventListener('error', () => tryLoad(name, k + 1, cb), { once: true }); a.src = 'assets/sfx/' + name + '.' + ext };
  for (const s of SND_SLOTS) { SND.files[s] = []; if (typeof SFXDATA != 'undefined' && SFXDATA[s]) continue; for (const v of ['', '_2', '_3', '_4']) tryLoad(s + v, 0, a => { if (a) SND.files[s].push(a) }) }
}
const sndHas = s => (SND.files[s] && SND.files[s].length > 0) || sndBuf(s);
const sndBuf = s => SND.buf && SND.buf[s] && SND.buf[s].length > 0;
// play a recorded buffer (a random variant, never the same twice running) into a node, at a speed
function sndPlayBuf(s, t, out, vol = 1, rate = 1) { const L = SND.buf[s]; let i = L.length > 1 ? Math.random() * L.length | 0 : 0; if (L.length > 1 && i === SND['last_' + s]) i = (i + 1) % L.length; SND['last_' + s] = i;
  const src = AC.createBufferSource(), g = sG(vol); src.buffer = L[i]; src.playbackRate.value = rate; sChain(src, g, out); src.start(t); return src }
function sndPlayFile(s, vol = 1) { const L = SND.files[s]; if (!L || !L.length) return false; const a = L[Math.random() * L.length | 0].cloneNode(); a.volume = clamp(vol * opt.s / 10, 0, 1); a.play().catch(() => {}); return true }

// ---- building blocks (as in the Sound Lab)
const sF = (type, f, q = 1) => { const b = AC.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b };
const sG = (v = 1) => { const g = AC.createGain(); g.gain.value = v; return g };
const sO = (type, f) => { const o = AC.createOscillator(); o.type = type; o.frequency.value = f; return o };
const sChain = (...n) => { for (let i = 0; i < n.length - 1; i++) n[i].connect(n[i + 1]); return n[n.length - 1] };
const sR = (a, b) => a + Math.random() * (b - a);
function sNoise(kind, loop = true) { const s = AC.createBufferSource(); s.buffer = SND.nb[kind]; s.loop = loop; return s }
function sBurst(src, t, a, d, peak, out, ...nodes) { const g = sG(0); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + a + d); sChain(src, ...nodes, g, out); src.start(t); src.stop(t + a + d + .05) }
function sTone(type, f0, f1, t, a, d, peak, out, ...nodes) { const o = sO(type, f0); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + a + d * .7); sBurst(o, t, a, d, peak, out, ...nodes) }
function sHit(kind, t, a, d, peak, out, ...nodes) { sBurst(sNoise(kind, false), t, a, d, peak, out, ...nodes) }
// where a sound is: a gain, a muffling filter and a pan, set from the listener's position (call again to update)
function sSpot(pos, range = 8) { const g = sG(0), lp = sF('lowpass', 20000, .5), p = AC.createStereoPanner ? AC.createStereoPanner() : null; sChain(g, lp, ...(p ? [p] : []), SND.bus); const s = { in: g, g, lp, p, pos, range }; sPlace(s, true); return s }
function sPlace(s, now) {
  const dx = s.pos[0] - CAM3.x, dy = s.pos[1] - CAM3.y, dz = s.pos[2] - CAM3.z, d = Math.hypot(dx, dy, dz), floorDiff = Math.abs((s.pos[1] > 1.5) - (PL3.y > 1.5));
  const same = !floorDiff && roomAt(s.pos[0], s.pos[2], s.pos[1]) == roomAt(CAM3.x, CAM3.z, PL3.y), r = camDir([1, 0, 0]);
  const v = Math.pow(clamp(1 - d / s.range, 0, 1), 1.6) * (same ? 1 : floorDiff ? .45 : .6), t = AC.currentTime, k = now ? .01 : .12;
  s.g.gain.setTargetAtTime(v, t, k); s.lp.frequency.setTargetAtTime(same ? 20000 : floorDiff ? 380 : 650, t, k);
  if (s.p) s.p.pan.setTargetAtTime(d > .01 ? clamp((dx * r[0] + dz * r[2]) / d, -1, 1) * .85 : 0, t, k);
}
function sOneShot(pos, range, fn) { if (!sndBoot()) return; const s = sSpot(pos, range); fn(AC.currentTime + .01, s.in); setTimeout(() => { try { s.g.disconnect() } catch (e) {} }, 4000) }

// ---- the sounds (Sound Lab versions)
function sCreakBuf(len = 1.1, pitch = 1) {
  const sr = AC.sampleRate, n = sr * len | 0, b = AC.createBuffer(1, n, sr), d = b.getChannelData(0), f = [sR(560, 680) * pitch, sR(1250, 1450) * pitch, sR(2500, 2900) * pitch]; let pos = 0;
  while (pos < n) { const u = pos / n, per = sr * (.0115 - .0062 * Math.sin(u * Math.PI) * sR(.75, 1.2)) / pitch, amp = Math.pow(Math.sin(u * Math.PI), .6) * sR(.5, 1), L = Math.min(per * 3, n - pos);
    for (let k = 0; k < L; k++) { const tt = k / sr; d[pos + k] += amp * Math.exp(-tt * 170) * (Math.sin(6.283 * f[0] * tt) * .6 + Math.sin(6.283 * f[1] * tt) * .3 + Math.sin(6.283 * f[2] * tt) * .14) } pos += Math.max(1, per | 0) }
  let m = 0; for (let i = 0; i < n; i++) m = Math.max(m, Math.abs(d[i])); for (let i = 0; i < n; i++) d[i] /= m || 1; return b;
}
function sMarimba(t, f, v, out) { sTone('sine', f, f, t, .002, .5, v, out); sTone('sine', f * 4, f * 4, t, .001, .08, v * .25, out); sTone('sine', f * 10, f * 10, t, .001, .02, v * .08, out) }
function sBuzz(t, dur, v, out) {
  const o = sO('square', 152), g = sG(0); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.16 * v, t + .02); g.gain.setValueAtTime(.16 * v, t + dur - .03); g.gain.linearRampToValueAtTime(0, t + dur); sChain(o, sF('lowpass', 850), g, out); o.start(t); o.stop(t + dur + .05);
  const r = sNoise('white', false), am = sO('square', 76), ag = sG(0), rg = sG(0); rg.gain.setValueAtTime(0, t); rg.gain.linearRampToValueAtTime(.08 * v, t + .02); rg.gain.setValueAtTime(.08 * v, t + dur - .03); rg.gain.linearRampToValueAtTime(0, t + dur);
  am.connect(ag.gain); sChain(r, sF('bandpass', 2600, 2), ag, rg, out); r.start(t); r.stop(t + dur + .05); am.start(t); am.stop(t + dur + .05);
}
function stepGen(t, surf, v, out) {
  if (surf == 'tile') { sHit('white', t, .001, .035, .55 * v, out, sF('highpass', 1800)); sHit('white', t, .001, .07, .3 * v, out, sF('bandpass', sR(2900, 3500), 5)); sTone('sine', 170, 120, t, .001, .03, .28 * v, out) }
  else { sHit('white', t, .003, .09, .55 * v, out, sF('lowpass', sR(900, 1300), .8)); sTone('sine', sR(105, 120), 55, t, .002, .08, .55 * v, out) }
}
const SFXN = {
  ping() { if (!sndBoot()) return; const t = AC.currentTime + .01, o = sG(.9 * opt.s / 10); o.connect(SND.bus); sMarimba(t, 1318.5, .2, o); sMarimba(t + .11, 1760, .2, o) },
  handBuzz() { if (!sndBoot()) return; const o = sG(.5 * opt.s / 10); o.connect(SND.bus); sBuzz(AC.currentTime + .01, .28, 1, o) },   // the phone vibrating in her hand
  thumb(soft = .5) { if (!sndBoot()) return; const t = AC.currentTime + .005, o = sG(.8 * opt.s / 10); o.connect(SND.bus); sHit('white', t, .0008, .015, .35, o, sF('bandpass', 4200 - soft * 2000, 2)); sTone('sine', 220, 180, t, .001, .02, .12, o) },
  heart(vol = .5) { if (!sndBoot()) return; const t = AC.currentTime + .01, o = sG(Math.min(1.4, vol * 1.4) * opt.s / 10); o.connect(SND.bus); sTone('sine', 58, 38, t, .006, .14, .9, o); sHit('brown', t, .005, .08, .5, o, sF('lowpass', 140)); sTone('sine', 52, 36, t + .27, .006, .11, .55, o) },
  doorClose(pos, force = .6) { sOneShot(pos, 14, (t, o) => { const v = force * opt.s / 10; sTone('sine', 85, 40, t, .002, .3, .9 * v, o); sHit('brown', t, .003, .18, .9 * v, o, sF('lowpass', 600)); sHit('white', t + .09, .001, .02, .5 * v, o, sF('highpass', 2600)); sTone('sine', 2300, 2300, t + .09, .001, .03, .08 * v, o) }) },
  doorOpen(pos) { if (sndBuf('door_creak')) return sOneShot(pos, 14, (t, o) => sndPlayBuf('door_creak', t, o, .9 * opt.s / 10, sR(.92, 1.08)));
    if (sndHas('door_creak')) { const d = Math.hypot(pos[0] - CAM3.x, pos[2] - CAM3.z); sndPlayFile('door_creak', clamp(1 - d / 14, 0, 1) * .9); return }
    sOneShot(pos, 14, (t, o) => { const s = AC.createBufferSource(); s.buffer = sCreakBuf(sR(.9, 1.4), sR(.85, 1.15)); sBurst(s, t, .05, 1.2, .45 * opt.s / 10, o, sF('highpass', 300)) }) },
  lightSwitch(pos) { sOneShot(pos, 8, (t, o) => { const v = opt.s / 10; sHit('white', t, .0005, .012, .8 * v, o, sF('highpass', 3000)); sHit('white', t, .0005, .03, .45 * v, o, sF('bandpass', 1900, 9)); sTone('sine', 320, 260, t, .001, .025, .18 * v, o) }) },
  step(surf, vol = .5) { if (sndBoot() && sndBuf('footstep_' + surf)) { sndPlayBuf('footstep_' + surf, AC.currentTime + .005, SND.bus, vol * 1.2 * opt.s / 10, sR(.94, 1.06)); return }
    if (sndHas('footstep_' + surf)) return sndPlayFile('footstep_' + surf, vol); if (!sndBoot()) return; const o = sG(vol * opt.s / 10); o.connect(SND.bus); stepGen(AC.currentTime + .01, surf, sR(.8, 1.1), o) },
  // the censor box (Hikari finding her): no build-up, no hit. The air goes heavy, a chord sags out of tune, a low throb
  // beats against itself, a thin ringing comes in late, something heavy creaks slowly. Then it fades. (Sound Lab: 8 s, sourness .6, creak .5)
  censor(L = 8, w = .6, rope = .5) { if (!sndBoot()) return; const t = AC.currentTime + .02, end = t + L + .1, out = sG(0), V = opt.s / 10; out.connect(SND.bus);
    out.gain.setValueAtTime(0, t); out.gain.linearRampToValueAtTime(V, t + 1.8); out.gain.setValueAtTime(V, t + L - 3); out.gain.linearRampToValueAtTime(0, t + L);
    const run = n => { n.start(t); n.stop(end); return n };
    { const n = run(sNoise('pink')), bp = sF('bandpass', 520, .8), g = sG(0); bp.frequency.setValueAtTime(520, t); bp.frequency.exponentialRampToValueAtTime(260, t + L); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.3, t + L * .5); sChain(n, bp, g, out) }
    { const lp = sF('lowpass', 700, .7), g = sG(.07), vib = run(sO('sine', .23)), vg = sG(1.6); vib.connect(vg); sChain(lp, g, out);
      for (const f of [196, 207.65, 293.7]) { const o = run(sO('triangle', f)); o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * Math.pow(2, -(.25 + w * .9) / 12), t + L); vg.connect(o.frequency); o.connect(lp) } }
    { const g = sG(.22); g.connect(out); for (const f of [41, 41 + .4 + w * .8]) run(sO('sine', f)).connect(g) }
    { const g = sG(0), a = sO('sine', 6150), b = sO('sine', 6150 + 3 + w * 5), pk = .018 * (.5 + w) * V; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(pk, t + L * .6); g.gain.setValueAtTime(pk, t + L - .5); g.gain.linearRampToValueAtTime(0, t + L + 1.5); g.connect(SND.bus);
      a.frequency.linearRampToValueAtTime(5980, t + L); a.connect(g); b.connect(g); a.start(t); b.start(t); a.stop(t + L + 1.6); b.stop(t + L + 1.6) }
    if (rope > 0) { let tt = t + sR(.8, 1.6); while (tt < t + L - 1.5) { const s = AC.createBufferSource(); s.buffer = sCreakBuf(sR(1.2, 1.8), sR(.42, .55)); sBurst(s, tt, .3, 1.4, .16 * rope * V, SND.bus, sF('lowpass', 900, .7), sF('highpass', 120)); tt += sR(2.6, 4.2) } }
  },
  pipes() { const pos0 = [CAM3.x + sR(-4, 4), CAM3.y + sR(-1, 1.5), CAM3.z + sR(-4, 4)];
    if (sndBuf('pipes')) return sOneShot(pos0, 12, (t, o) => { const r = sR(.85, 1.05); let tt = t; for (let i = 0, n = 2 + (Math.random() * 4 | 0); i < n; i++) { sndPlayBuf('pipes', tt, o, sR(.5, .9) * opt.s / 10, r * sR(.96, 1.04)); tt += sR(.16, .5) } });
    if (sndHas('pipes')) return sndPlayFile('pipes', .5);
    const pos = [CAM3.x + sR(-4, 4), CAM3.y + sR(-1, 1.5), CAM3.z + sR(-4, 4)]; sOneShot(pos, 12, (t, o) => { const f = sR(170, 240), v = .5 * opt.s / 10; let tt = t;
      for (let i = 0, n = 3 + (Math.random() * 4 | 0); i < n; i++) { const f0 = f * sR(.93, 1.08), w = sR(.5, 1) * v; [[1, .55, .5], [2.76, .3, .3], [5.4, .18, .2], [8.93, .1, .1]].forEach(([m, d, g]) => sTone('sine', f0 * m, f0 * m, tt, .001, d, g * w, o)); sHit('brown', tt, .002, .08, .7 * w, o, sF('lowpass', 220)); tt += sR(.13, .45) } }) },
};

// ---- loops: started and stopped by update() from where you are and what's happening
function loopMake(id, pos, range, build) { if (SND.loops[id]) return SND.loops[id]; const s = pos ? sSpot(pos, range) : { in: sG(0), g: null }; if (!pos) { s.g = s.in; s.in.connect(SND.bus) } s.level = sG(0); s.level.connect(s.in); s.nodes = []; s.timers = []; build(s); return SND.loops[id] = s }
function loopKill(id) { const s = SND.loops[id]; if (!s) return; delete SND.loops[id]; const t = AC.currentTime; s.level.gain.setTargetAtTime(0, t, .15); s.timers.forEach(clearInterval); if (s.file) { s.file.pause(); s.file = null }
  setTimeout(() => { s.nodes.forEach(n => { try { n.stop() } catch (e) {} }); try { s.level.disconnect() } catch (e) {} try { s.g.disconnect() } catch (e) {} }, 800) }
function loopLevel(s, v) { s.level.gain.setTargetAtTime(v * opt.s / 10, AC.currentTime, .3) }
function sched(s, step) { let next = AC.currentTime + .05; s.timers.push(setInterval(() => { while (next < AC.currentTime + .25) next = step(next) }, 40)) }
const LOOPS = {
  room(s) { const n = sNoise('brown'), lfo = sO('sine', .07), lg = sG(.05); lfo.connect(lg); lg.connect(s.level.gain); sChain(n, sF('lowpass', 260), s.level); n.start(); lfo.start(); s.nodes.push(n, lfo) },
  fridge(s) { const o1 = sO('sine', 50), o2 = sO('sawtooth', 100), g2 = sG(.05), n = sNoise('pink'), g3 = sG(.25), wob = sO('sine', .23), wg = sG(.03); o1.connect(s.level); sChain(o2, sF('lowpass', 320, 2), g2, s.level); sChain(n, sF('bandpass', 190, 3), g3, s.level); wob.connect(wg); wg.connect(s.level.gain);
    [o1, o2, n, wob].forEach(x => { x.start(); s.nodes.push(x) }); sched(s, t => { if (Math.random() < .5) { sHit('white', t + 1, .001, .02, .25, s.in, sF('highpass', 2500)); sTone('sine', 70, 50, t + 1, .002, .25, .35, s.in) } return t + sR(7, 14) }) },
  wind(s) { const n = sNoise('pink'), bp = sF('bandpass', 400, 1.2), g = sG(0), w = sNoise('white'), wb = sF('bandpass', 900, 14), wg = sG(0); sChain(n, bp, g, s.level); sChain(w, wb, wg, s.level); n.start(); w.start(); s.nodes.push(n, w);
    sched(s, t => { bp.frequency.setTargetAtTime(sR(250, 650) + 150, t, .8); g.gain.setTargetAtTime(sR(.15, .45) * .8, t, .9); wb.frequency.setTargetAtTime(sR(700, 1300), t, 1); wg.gain.setTargetAtTime(Math.random() < .3 ? .025 : 0, t, 1.2); return t + sR(.6, 1.4) }) },
  drip(s) { sched(s, t => { sTone('sine', sR(650, 800), sR(1500, 1900), t, .001, .09, .45, s.level); sTone('sine', 1700, 2100, t + .11, .001, .05, .08, s.level); return t + 1.6 * sR(.85, 1.2) }) },
  tap(s) { if (sndBuf('tap_running')) { const src = AC.createBufferSource(); src.buffer = SND.buf.tap_running[0]; src.loop = true; src.connect(s.level); src.start(); s.nodes.push(src); return }
    if (sndHas('tap_running')) { const a = SND.files.tap_running[0].cloneNode(); a.loop = true; a.volume = 0; a.play().catch(() => {}); s.file = a; return }
    const n = sNoise('white'), g = sG(.27), sp = sNoise('pink'), sg = sG(.44), fl = sO('sine', 9), fg = sG(.06); fl.connect(fg); fg.connect(g.gain); sChain(n, sF('bandpass', 2400, .8), g, s.level); sChain(sp, sF('bandpass', 650, 1), sg, s.level); [n, sp, fl].forEach(x => { x.start(); s.nodes.push(x) });
    sched(s, t => { sTone('sine', sR(320, 520), sR(700, 1100), t, .002, .04, .05, s.level); return t + sR(.05, .22) }) },
  static(s) { const n = sNoise('white'), h = sO('sawtooth', 60), hg = sG(.03), g = sG(.16); sChain(n, sF('bandpass', 3000, .5), g, s.level); sChain(h, sF('lowpass', 400), hg, g); n.start(); h.start(); s.nodes.push(n, h);
    sched(s, t => { if (Math.random() < (P2.day == 4 ? .55 : .3)) sHit('white', t, .0005, sR(.004, .02), sR(.2, .6), s.level, sF('highpass', 1500)); return t + sR(.02, .12) }) },
  dread(s) { const lp = sF('lowpass', 300, 3), os = [55, 55.35, 82.4].map(f => sO('sawtooth', f)), sub = sO('sine', 27.5), hi = sO('sine', 466.2), hg = sG(0), lfo = sO('sine', .09), lg = sG(140), g = sG(.15);
    os.forEach(o => o.connect(lp)); lp.connect(g); sub.connect(g); sChain(hi, hg, g); lfo.connect(lg); lg.connect(lp.frequency); g.connect(s.level); [...os, sub, hi, lfo].forEach(o => { o.start(); s.nodes.push(o) });
    s.tension = v => { const t = AC.currentTime; g.gain.setTargetAtTime(.12 + v * .12, t, .8); lp.frequency.setTargetAtTime(220 + v * 900, t, .8); os[1].frequency.setTargetAtTime(55.3 + v * 2.2, t, .8); hg.gain.setTargetAtTime(v * v * .05, t, .8) }; s.tension(.25) },
  clock(s) { const src = AC.createBufferSource(); src.buffer = SND.buf.clock_tick[0]; src.loop = true; src.connect(s.level); s.t0 = AC.currentTime + .02; src.start(s.t0); s.nodes.push(src) },
  shower(s) { LOOPS.tap(s) },
  ringing(s) {   // the smashed phone on the floor, ringing anyway: buzzing on the boards, the tune going wrong
    const notes = [659.3, 784, 1046.5, 784, 880, 1046.5]; let i = 0; s.tEnd = AC.currentTime + 7.5;
    sched(s, t => { if (t > s.tEnd) return t + 1; const k = i % 8; if (k == 0) { sBuzz(t, .42, 1, s.level); sBuzz(t + .65, .42, 1, s.level) } if (k < 6) sMarimba(t, notes[k] * Math.pow(2, (Math.random() < .45 ? (Math.random() < .5 ? -1 : 1) : 0) / 12) * (1 - .02 * Math.random()), .22, s.level); i++; return t + (k == 5 ? .9 : .17) * (1 + .2 * Math.random()) }) },
};
// fixed places in the house (new plan)
const SPOTS = {};
function sndSpots() {
  if (SPOTS.fridge) return; const f = LM(11.5, 8.75, 0), k = LM(11.63, 6.1, 0);
  Object.assign(SPOTS, { fridge: [f[0], 1, f[1]], sink: [k[0], 1, k[1]], tub: [.25, 3.9, .3], clock: [HALLCLOCK[0], HALLCLOCK[1], HALLCLOCK[2]] });
  // the rugs and bath mats you walk on (carpet footsteps): the old plan's rugs moved as the house was, the bathroom mats as built
  SND.rugs = [[5.75, 0, 5.6, 7.75, .1, 8.3], [1.3, 0, 5.9, 3.1, .1, 8.1], [9.85, 3, 6.3, 11.15, 3.1, 8.4], [1.4, 3, 5.9, 3.7, 3.1, 9.2]].map(b => LBOX(b)).concat([[14.45, 0, 1.35, 15.1, .1, 1.8], [.45, 3, .98, 1.35, 3.1, 1.5]]);
}
function surfaceAt() { if ((SND.rugs || []).some(b => CAM3.x > b[0] && CAM3.x < b[3] && CAM3.z > b[2] && CAM3.z < b[5] && Math.abs(PL3.y - b[1]) < .5)) return 'carpet'; const r = roomAt(CAM3.x, CAM3.z, PL3.y), up = PL3.y > 1.5; if (!up && (r == 'kitchen' || r == 'bath0' || r == 'hall' || r == 'corridor')) return 'tile'; if (up && r == 'ubath') return 'tile'; return 'wood' }
function sndUpdate() {
  if (!sndBoot()) return; SND.last = performance.now(); sndFiles(); sndSpots(); SND.bus.gain.value = 1;
  const inHouse = SND.amb && P2.scene == 'house' && !P2.outside && !P2.silent, u = P2.ui, out = !!P2.outside;
  const want = id => id == 'wind' ? true : inHouse && ({ room: 1, fridge: 1, drip: 1, tap: (P2.day == 3 && !(P2.ch && P2.ch.tapoff)) || P2.f.tapOn, shower: P2.f.showering, clock: sndBuf('clock_tick') && !SND.clockStopped, dread: SND.dark || (u && u.k == 'phone' && u.mode == 'texts'), static: u && u.k == 'phone' && u.mode == 'call' && u.connected && !u.ended, ringing: SND.ringing })[id];
  const pos = { clock: SPOTS.clock, fridge: SPOTS.fridge, drip: SPOTS.tub, tap: SPOTS.sink, shower: SPOTS.tub, ringing: H3.extra.phonebroken.vis && H3.brokenAt ? [H3.brokenAt[0], H3.brokenAt[1] + .05, H3.brokenAt[2]] : H3.extra.phone.M ? [H3.extra.phone.M[12], H3.extra.phone.M[13] + .05, H3.extra.phone.M[14]] : SPOTS.clock };
  const rng = { shower: 30, clock: 9, fridge: 7, drip: 7, tap: 12, ringing: 14 };
  const lvl = { shower: 1.6, clock: .55, room: .32, fridge: .2, wind: out ? .75 : P2.silent ? .22 : CAM3.y > 1.9 ? .5 : .3, drip: .5, tap: .5, dread: .9, static: .2, ringing: .6 };
  for (const id in LOOPS) {
    if (want(id)) { const s = loopMake(id, pos[id], rng[id], LOOPS[id]); if (s.pos) sPlace(s); loopLevel(s, lvl[id]);
      if (s.file) { const d = Math.hypot(s.pos[0] - CAM3.x, s.pos[1] - CAM3.y, s.pos[2] - CAM3.z), same = roomAt(s.pos[0], s.pos[2], s.pos[1]) == roomAt(CAM3.x, CAM3.z, PL3.y); s.file.volume = clamp(Math.pow(clamp(1 - d / s.range, 0, 1), 1.6) * (same ? 1 : .5) * lvl[id] * opt.s / 10, 0, 1) } }
    else if (SND.loops[id]) loopKill(id);
  }
  // the hall clock's pendulum: one swing per tick, in step with the recording
  if (H3.extra && H3.extra.pendulum && H3.pendAt && !SND.clockStopped) { const cl = SND.loops.clock, ph = cl && cl.t0 != null ? (AC.currentTime - cl.t0) : performance.now() / 1000; H3.extra.pendulum.M = M4.mul(M4.tr(...H3.pendAt), M4.rx(.13 * Math.sin(ph * Math.PI - Math.PI / 2 + .25))) }
  // reading the messages: the dread climbs with every one
  const dr = SND.loops.dread; if (dr && dr.tension) { const tx = u && u.k == 'phone' && u.mode == 'texts'; dr.tension(tx ? .3 + .7 * u.shown / Math.max(1, TEXTS.length) : .25) }
  // her own footsteps, one per stride, on boards or tile
  if (inHouse && PL3.moving && !P2.cut && !(u && u.k)) { const ph = Math.floor(PL3.bob / Math.PI); if (ph != SND.stepPhase) { SND.stepPhase = ph; SFXN.step(surfaceAt(), CAM3.y > 1.9 ? .45 : .4) } } else SND.stepPhase = Math.floor(PL3.bob / Math.PI);
  // cars going past outside: muffled through the walls in the house, close and loud out on the street (v77)
  if (!SND.nextCar || SND.nextCar - performance.now() > 60000) SND.nextCar = performance.now() + 4000;
  if (performance.now() > SND.nextCar) { SND.nextCar = performance.now() + (out ? 4000 + Math.random() * 6000 : 18000 + Math.random() * 26000); SFXN.car(out ? sR(.1, .5) : sR(.55, .9), !out) }
  // day 2: the smashed phone rings now and then; pipes knock in the walls
  const now = P2.t || 0;
  if (inHouse && P2.day == 3) {
    if (!SND.nextRing) SND.nextRing = now + 1500; if (now > SND.nextRing) { SND.nextRing = now + 5400 + Math.random() * 3600; if (!(P2.ch.called && !P2.ch.broke)) { SND.ringing = 1; setTimeout(() => SND.ringing = 0, 8000) } }
    if (!SND.nextPipes) SND.nextPipes = now + 900; if (now > SND.nextPipes) { SND.nextPipes = now + 2400 + Math.random() * 3000; SFXN.pipes() }
  } else if (inHouse && P2.day == 1) { if (!SND.nextPipes) SND.nextPipes = now + 2400; if (now > SND.nextPipes) { SND.nextPipes = now + 6000 + Math.random() * 5000; SFXN.pipes() } }
}
// a car passing (as in the Sound Lab): tyre roar and an engine note, swept from one side to the other; muffled = heard from inside
SFXN.car = function (dist = .6, muffled = false) {
  if (!sndBoot()) return; const t = AC.currentTime + .02, D = 7, v = (1 - dist * .6) * opt.s / 10 * (muffled ? .5 : 1), n = sNoise('brown'), lp = sF('lowpass', 200), g = sG(0), e = sO('sawtooth', 76), el = sF('lowpass', 260), eg = sG(0), m = sF('lowpass', muffled ? 420 : 20000);
  let pan = null; if (AC.createStereoPanner) { pan = AC.createStereoPanner(); const d = Math.random() < .5 ? 1 : -1; pan.pan.setValueAtTime(-.9 * d, t); pan.pan.linearRampToValueAtTime(.9 * d, t + D) }
  lp.frequency.setValueAtTime(180, t); lp.frequency.linearRampToValueAtTime(900 - dist * 450, t + D / 2); lp.frequency.linearRampToValueAtTime(180, t + D);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.6 * v, t + D / 2); g.gain.linearRampToValueAtTime(0, t + D);
  eg.gain.setValueAtTime(0, t); eg.gain.linearRampToValueAtTime(.06 * v, t + D / 2); eg.gain.linearRampToValueAtTime(0, t + D);
  e.frequency.setValueAtTime(80, t); e.frequency.linearRampToValueAtTime(78, t + D / 2 - .3); e.frequency.linearRampToValueAtTime(64, t + D / 2 + .5);
  const end = pan ? sChain(m, pan) : m; end.connect(SND.bus); sChain(n, lp, g, m); sChain(e, el, eg, m); n.start(t); n.stop(t + D); e.start(t); e.stop(t + D);
};
function sndStopAll() { for (const id in SND.loops) loopKill(id); SND.ringing = 0; SND.nextRing = 0; SND.nextPipes = 0 }

// ---- hooking into the rest of part two
AMB3.start = function (dark) { SND.amb = true; SND.dark = !!dark; sndStopAll() };   // the room tone and the day-2 drone are loops above now
AMB3.stop = function () { SND.amb = false; SND.dark = false; if (SND.bus) sndStopAll() };
SFX3.ping = () => { SFXN.ping(); SFXN.handBuzz() };
SFX3.heart = vol => SFXN.heart(vol);
// whispers are the recording now (js/whisper.js); the made-up one only plays if it hasn't loaded yet
const _whisper77 = SFX3.whisper; SFX3.whisper = function (vol = .12, dur = 1.6, pan) { if (typeof playWhisper == 'function' && playWhisper(Math.min(1, vol * 2.2), dur + .4, pan)) return; _whisper77.call(SFX3, vol, dur, pan) };
SFX3.door = function (open = true, d) {
  const dd = d || (H3.doors || []).reduce((b, x) => { const dist = Math.hypot(x.hx - CAM3.x, x.hz - CAM3.z) + Math.abs(x.y - CAM3.y + 1.5); return !b || dist < b.dist ? { x, dist } : b }, null)?.x;
  const pos = dd ? [dd.hx, (dd.y || 0) + 1, dd.hz] : [CAM3.x, CAM3.y, CAM3.z]; open ? SFXN.doorOpen(pos) : SFXN.doorClose(pos);
};
const _ambTick50 = p2AmbTick;
p2AmbTick = function () { _ambTick50(); try { sndUpdate() } catch (e) { console.warn(e) } };
// v77: the wind is always there in Part Two, also in the dealer's scene (only the wind and the cars play there)
if (typeof dealerFrame == 'function') { const _dealer77 = dealerFrame; dealerFrame = function (dt) { _dealer77(dt); try { sndUpdate() } catch (e) {} } }
