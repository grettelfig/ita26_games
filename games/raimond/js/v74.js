// ==================== v74: the new portraits and the new text box ====================
// Portraits come from the dialogue sheets (assets/portraits_v74: hitori, hikari, caroline, steven, uku, each with
// happy / neutral / sad / angry / scared). They're used for every text box (Part One, the subway) and the battle cards.
// The text box follows the sheets' layout: a square portrait box on the left, a long text box beside it, a small name
// box above the text, all with chalky cream borders on black, and the little pointing hand when a line is done.
const P74 = {}, EMO74 = { happy: 'happy', laugh: 'happy', blush: 'happy', smug: 'happy', ecstatic: 'happy', manic: 'happy',
  neutral: 'neutral', sad: 'sad', dark: 'sad', depressed: 'sad', miserable: 'sad',
  angry: 'angry', enraged: 'angry', furious: 'angry', scared: 'scared', shock: 'scared', worried: 'scared', afraid: 'scared', stressed: 'scared' };
const KEY74 = { npc_hikari: 'hikari' };
function port74(key, e) {
  const k = KEY74[key] || key; if (!['hitori', 'hikari', 'caroline', 'steven', 'uku'].includes(k)) return null;
  const em = EMO74[e] || 'neutral', id = k + '_' + em;
  if (!P74[id]) { P74[id] = loadImg('assets/portraits_v74/' + id + '.png'); P74[id].v74 = 1 }
  return P74[id];
}
const PTR74 = loadImg('assets/portraits_v74/pointer.png');
const CHALK = '#efe4d6';
// a hand-drawn looking border: short dashes with a little wobble, the same every frame for the same box
function chalkBox(x, y, w, h, fill = '#000', col = CHALK) {
  if (fill) r(x, y, w, h, fill);
  let s = (Math.round(x * 7 + y * 13 + w * 31 + h * 17) >>> 0) || 1; const R = () => (s = (s * 16807) % 2147483647) / 2147483647;
  X.fillStyle = col;
  const t = 1.25, st = .9;
  for (let u = 0; u < w; u += st) { const j = (R() - .5) * .45, k = (R() - .5) * .45; X.globalAlpha = .75 + R() * .25; X.fillRect(x + u, y + j, st + .15, t); X.fillRect(x + u, y + h - t + k, st + .15, t) }
  for (let v = 0; v < h; v += st) { const j = (R() - .5) * .45, k = (R() - .5) * .45; X.globalAlpha = .75 + R() * .25; X.fillRect(x + j, y + v, t, st + .15); X.fillRect(x + w - t + k, y + v, t, st + .15) }
  X.globalAlpha = .35; for (let i = 0; i < (w + h) / 6; i++) X.fillRect(x + R() * w, R() < .5 ? y + t : y + h - t - .5, .6, .5);   // chalk dust along the inside edge
  X.globalAlpha = 1;
}
// a portrait fitted whole inside a box (the sheets' pictures are a little taller than wide; the sides stay black)
function drawPort74(im, x, y, w, h, dy = 0) {
  if (!ready(im)) return; const s = Math.min(w / im.naturalWidth, h / im.naturalHeight), dw = im.naturalWidth * s, dh = im.naturalHeight * s;
  X.save(); X.beginPath(); X.rect(x, y, w, h); X.clip(); X.imageSmoothingEnabled = true; X.imageSmoothingQuality = 'high';
  X.drawImage(im, x + (w - dw) / 2, y + (h - dh) / 2 + dy, dw, dh); X.imageSmoothingEnabled = false; X.restore();
}
drawDialog = function () {
  if (!DL || !DL.q[DL.i]) return;
  sU(); X.globalAlpha = 1; X.imageSmoothingEnabled = false;
  const l = DL.q[DL.i], d0 = LK[l.n], def = d0 && (CH.includes(d0) || d0.key == 'npc_hikari') ? d0 : null, im = def ? port74(def.key, l.e) : null;
  const M = 6, PS = 52, TH = 38, TY = H - M - TH, TX = im ? M + PS + 5 : M, TW = W - M - TX, TS = 8.6;
  if (DL.wl74 !== DL.i) { DL.wl74 = DL.i; DL.lines74 = wrapPx(l.t, TW - 16, TS) }
  if (DL.sp !== l.n) { DL.sp = l.n; DL.slide = 0 } DL.slide = (DL.slide || 0) + 1;
  // the portrait box
  if (im) { const rise = Math.min(1, DL.slide / 7), py = H - M - PS + Math.round((1 - rise) * 8), hop = DL.pt < 6 ? -Math.round(Math.sin(DL.pt / 6 * Math.PI) * 1.5) : 0;
    X.globalAlpha = rise; chalkBox(M, py, PS, PS); drawPort74(im, M + 2, py + 2, PS - 4, PS - 4, hop); X.globalAlpha = 1 }
  // the text box, and the name box above it
  chalkBox(TX, TY, TW, TH);
  const tag = l.n && l.n != '' ? l.n : null;
  if (tag) { const nm = tag, nw = Math.max(36, Math.ceil(tw(nm, 7.5)) + 14); chalkBox(TX, TY - 13, nw, 11); txt(nm, TX + nw / 2, TY - 11.2, CHALK, 'center', 7.5) }
  let left = DL.c | 0; (DL.lines74 || []).slice(0, 3).forEach((line, i) => { if (left <= 0) return; txt(line.slice(0, left), TX + 8, TY + 5 + i * 10.6, '#fff', 'left', TS); left -= line.length + 1 });
  // the pointing hand when the line is finished
  if (DL.c >= l.t.length && ready(PTR74)) { const bob = Math.round(Math.sin(tick / 8) * 1.2); X.imageSmoothingEnabled = false; X.drawImage(PTR74, TX + TW - 20 + bob, TY + TH - 10, 14, 7.5) }
};
drawChoice = function () {
  if (CHO.q) { DL = { q: [CHO.q], i: 0, c: 999, pt: 99, age: 99, slide: 99, sp: CHO.q.n }; drawDialog(); DL = null }
  sU(); const w2 = Math.max(...CHO.opts.map(o => tw(o, 8))) + 28, h2 = CHO.opts.length * 12 + 9, x0 = W - w2 - 8, y0 = H - h2 - 52;
  chalkBox(x0, y0, w2, h2);
  CHO.opts.forEach((o, i) => { const sel = i == CHO.i; if (sel && ready(PTR74)) X.drawImage(PTR74, x0 + 4 + Math.round(Math.sin(tick / 8)), y0 + 6 + i * 12, 9, 5); txt(o, x0 + 16, y0 + 4.5 + i * 12, sel ? '#fff' : '#9a9aa8', 'left', 8) });
};
// battle cards: the same portraits, whole, on black, with a thin border in the emotion's colour
cutPortrait = function (i, e) { return port74(CH[i].key, e) || PCUT_FALLBACK(i, e) };
function PCUT_FALLBACK(i, e) { const k = CH[i].key + '_' + e; if (!PCUT[k]) PCUT[k] = loadImg('assets/portraits_cut/' + CH[i].key + '_' + e + '.png'); return PCUT[k] }
const _drawCard74 = drawCard;
drawCard = function (i, j) {
  _drawCard74(i, j);
  // redraw the picture window with the new portrait over whatever the old card drew there
  const [cx, cy] = CARDXY[j], left = j < 2, hp = S.hp[i], e = S.emo[i] || 'neutral', G = EMOGRAD[e] || EMOGRAD.neutral, dead = hp <= 0;
  const act = B.mode == 'menu' && B.act == i, hitT = B.hit == i && B.hitT > 0 ? B.hitT : 0, shk = hitT ? (hitT % 2 ? 3 : -3) : 0;
  const lp = B.lunge && B.lunge.i == i ? Math.sin(Math.min(1, B.lunge.t / 22) * Math.PI) : 0;
  const x = cx + shk + Math.round(lp * 26 * (left ? 1 : -1)), y = cy - (act ? 2 + Math.round(Math.sin(tick / 8)) : 0) + Math.round(lp * (j % 2 ? -10 : 10));
  const px = x + 2, py = y + 11, pw = CARD.w - 4, ph = CARD.w - 4, im = port74(CH[i].key, e); if (!im) return;
  r(px - 1, py - 1, pw + 2, ph + 2, G[2]); r(px, py, pw, ph, '#000'); drawPort74(im, px, py, pw, ph, act ? Math.round(Math.sin(tick / 10)) : 0);
  if (hitT) r(px, py, pw, ph, 'rgba(255,40,40,' + (hitT / 14 * .5).toFixed(2) + ')');
  if (dead) { r(px, py, pw, ph, 'rgba(10,8,20,.72)'); txt('DOWN', px + pw / 2, py + ph / 2 - 4, '#aaa', 'center', 7) }
  const et = e.toUpperCase(), ew = tw(et, 4.5) + 4; r(px + pw - ew, py + ph - 7, ew, 7, 'rgba(0,0,0,.75)'); txt(et, px + pw - 2, py + ph - 6.5, G[2], 'right', 4.5);
};
// load every portrait up front, so a battle card or a text box never shows an empty frame for a moment
for (const k of ['hitori', 'hikari', 'caroline', 'steven', 'uku']) for (const e of ['happy', 'neutral', 'sad', 'angry', 'scared']) port74(k, e);
// v77: the whispering recording at the creepy moments of Part One (a line about a cold wind out of the dark, something
// swaying with no wind, a whisper in the text), as well as all through the fear places (js/whisper.js)
const _D77 = D;
D = function (L, cb) {
  try { if (Array.isArray(L) && typeof playWhisper == 'function' && L.some(l => typeof l == 'string' && /whisper(?!ing woods)|breathes out of it|though there is no wind|\(\.\.\./i.test(l))) setTimeout(() => playWhisper(.4, 2.4), 300) } catch (e) {}
  return _D77.apply(this, arguments);
};
