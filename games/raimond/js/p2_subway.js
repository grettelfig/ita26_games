// ==================== PART TWO: the second dream, the last train home ====================
// After day 2 Hitori dreams the night of the photograph: five of them on a seat for three, on the last train.
// Top-down like Part One (same sprites, same dialogue boxes), four carriages:
//   1  warm, everyone there. Talk to all four; the lights go out in a tunnel; when they come back she's gone.
//   2  the same carriage again. Her friends are still in their seats and don't know who you mean.
//   3  the same carriage again, dim and wrong: they sit with their backs to you, the passengers watch, a phone rings.
//   4  empty. A platform slides by outside, and she is on it, on the other side of the glass.
// Runs as its own screen (sc == 'p2sub'); p2Stage('subway') starts it and it ends in p2Stage('day3').
// Hikari's sprite is assets/sprites/npc_hikari_{down,left,right,up}.png (4 frames of 28x34 each, made from her new sprite sheet in v76) and her
// portraits are assets/portraits/npc_hikari_neutral.png / _dark.png (face scratched out): replace the files to change her.
const HIK = { n: '???', key: 'npc_hikari' }; loadSheet('npc_hikari'); LK['???'] = HIK;
if (!PORTRAITS['npc_hikari:neutral']) PORTRAITS['npc_hikari:neutral'] = loadImg('assets/portraits/npc_hikari_neutral.png'); PORTRAITS['npc_hikari:dark'] = loadImg('assets/portraits/npc_hikari_dark.png');
const SUB = { on: 0 };
// v72: the carriage is drawn to the characters' scale (a seated passenger's head reaches the window) and the camera is zoomed in 2x and follows you.
const SUBG = { ceil: 78, wallT: 84, winT: 108, winB: 138, benchT: 150, aisleT: 172, aisleB: 222, backB: 256, x0: 16, x1: 624 }, SUBZ = 2;
const AY = y => Math.round(SUBG.aisleT + (y - 172) * (SUBG.aisleB - SUBG.aisleT) / 90);   // old aisle (172..262) -> new aisle
const SUBWIN = [[48, 118], [124, 194], [200, 270], [370, 440], [446, 516], [522, 592]], SUBDOOR = [[296, 318], [322, 344]];
const subFriend = n => CH.find(c => c.n == n), subNPC = i => { const L = Object.values(ND); return L[(i * 7 + 3) % L.length] };

function subwayStart() {
  if (typeof p2Unlock == 'function') p2Unlock(); P2.wantLock = false; P2.ui = null; P2.cut = null; P2.subs = []; sc = 'p2sub'; DL = null; CHO = null;
  Object.assign(SUB, { on: 1, car: 0, x: 182, y: AY(200), d: 3, cx: 182, step: 0, t: 0, f: {}, dark: 1, obj: '', ents: [], trans: null, ev: null, plat: 0, hx: 80, hstep: 0, face: null });
  subCar(1); subSound(true);
  SUB.ev = { k: 'open', t: 0 };
}
const subEnt = (c, x, y, d, o = {}) => Object.assign({ c, x, y, d, r: 9 }, o);
function subCar(n) {
  SUB.car = n; const E2 = SUB.ents = [], F = SUB.f, T = SUBG.aisleT + 6, B = SUBG.backB - 10, st = subFriend('Steven'), ca = subFriend('Caroline'), uk = subFriend('Uku');
  const say = L => () => D(L);
  if (n == 1) {
    E2.push(subEnt(uk, 80, T, 0, { seat: 1, id: 'uku', talk: () => subTalk1('uku') }), subEnt(ca, 114, T, 0, { seat: 1, id: 'caroline', talk: () => subTalk1('caroline') }), subEnt(st, 148, T, 0, { seat: 1, id: 'steven', talk: () => subTalk1('steven') }),
      subEnt(HIK, 216, T, 0, { seat: 1, id: 'hikari', talk: () => subTalk1('hikari') }));
    [[400, T, 0], [520, T, 0], [70, B, 3], [130, B, 3], [420, B, 3], [470, B, 3], [560, B, 3]].forEach(([x, y, d], i) => E2.push(subEnt(subNPC(i), x, y, d, { seat: 1, dim: .25, talk: say([['|A stranger, half asleep against the window.'], ['|Somebody\'s dad, holding a cake box on his knees very carefully.'], ['|She\'s reading the same page of her book over and over.'], ['|Headphones in. You can hear the tinny beat from here.'], ['|He nods at you. Last-train solidarity.'], ['|Asleep, mouth open.'], ['|A kid drawing on the fogged window with one finger.']][i]) })));
  }
  if (n == 2) {
    E2.push(subEnt(uk, 80, T, 0, { seat: 1, talk: say(['Uku:neutral|Nah, you\'re good. Probably.', 'Uku:neutral|...I don\'t know, man.', 'Uku:sad|I can\'t do this again.']) }),
      subEnt(ca, 114, T, 0, { seat: 1, talk: say(['Caroline:worried|Please sit down. You\'re scaring people.', 'Caroline:sad|...You\'re scaring me.']) }),
      subEnt(st, 148, T, 0, { seat: 1, talk: say(['Hitori:shock|...How are you here? I left you in the last carriage.', 'Steven:neutral|What last carriage?', 'Steven:neutral|We haven\'t moved, Hitori. YOU keep moving.']) }),
      { x: 216, y: T - 4, hot: 'bag', talk: say(['|The small grey bag. Again.', '|The name inside the flap is still there. You still can\'t keep hold of it.']) },
      { x: 300, y: AY(214), hot: 'photo', r: 0, talk: say(['|A photograph on the floor. Five people on a seat for three.', '|Someone has scratched one of the faces out with a key.', 'Hitori:scared|...I did that.', 'Hitori:scared|Why did I do that?']) });
    [[400, T, 3], [520, T, 3], [70, B, 3], [130, B, 3], [420, B, 3], [470, B, 3], [560, B, 3], [452, AY(190), 3], [566, AY(250), 2]].forEach(([x, y, d], i) => E2.push(subEnt(subNPC(i), x, y, d, { seat: i < 7, dim: .45, talk: say([i % 2 ? '|They don\'t look up.' : '|They turn their face away before you can see it.']) })));
  }
  if (n == 3) {
    E2.push(subEnt(uk, 80, T, 3, { seat: 1, talk: say(['Uku:dark|We\'re not really here, you know.', 'Uku:dark|You\'re the only one on this train.']) }),
      subEnt(ca, 114, T, 3, { seat: 1, talk: say(['Caroline:dark|You screamed at me until I cried.', '|She doesn\'t turn around.']) }),
      subEnt(st, 148, T, 3, { seat: 1, talk: say(['Steven:dark|You broke my window.', 'Steven:dark|You don\'t even remember it. That\'s the part I can\'t forgive.']) }),
      { x: 216, y: T - 4, hot: 'bag', talk: say(['|Her bag. It\'s open now. It\'s empty.']) },
      { x: 388, y: AY(232), hot: 'phone', r: 0, talk: () => { F.phone = 1; D(['|A phone, face down, buzzing its way across the floor. 37 missed calls.', '|You answer.', '???:dark|Hitori? Where are you?', '???:dark|You missed your stop.', '???:dark|...You missed all of them.', '|The line goes dead.']) } });
    [[400, T, 0], [460, T, 0], [520, T, 0], [580, T, 0], [70, B, 0], [130, B, 0], [250, B, 0], [420, B, 0], [470, B, 0], [560, B, 0], [300, AY(186), 0], [470, AY(252), 0], [540, AY(190), 0], [246, AY(254), 0]].forEach(([x, y, d], i) => E2.push(subEnt(subNPC(i), x, y, d, { seat: i < 10, sil: 1, watch: i >= 10, talk: say(['|It has no face. It is looking at you anyway.']) })));
  }
  if (n == 4) { SUB.hx = 40; SUB.plat = 0 }
  subProps(n);
}
// v72: grab poles, litter, things to look at
function subProps(n) {
  const E2 = SUB.ents, say = L => () => D(L), py = SUBG.aisleT + 9;
  for (const x of [104, 268, 372, 536]) E2.push({ x, y: py, pole: 1 });
  if (n == 1) E2.push({ x: 176, y: AY(240), hot: 'paper', talk: say(['|Today\'s evening paper. Somebody did the crossword in pen.', '|Every answer is the same word. The ink has run, you can\'t read it.']) },
    { x: 450, bx: 450, y: AY(232), hot: 'can', talk: say(['|An empty can of melon soda, rolling back and forth with the train.', 'Hitori:neutral|...Somebody always gets melon.']) },
    { x: 598, y: AY(196), hot: 'umb', talk: say(['|A clear umbrella, hooked on the rail. It hasn\'t rained all day.']) });
  if (n == 2) E2.push({ x: 176, y: AY(240), hot: 'paper', talk: say(['|The same evening paper. The crossword is blank now.', '|Somebody has written one word in the margin and rubbed it out.']) },
    { x: 450, bx: 450, y: AY(232), hot: 'can', talk: say(['|The melon soda can. Full again. Unopened.', '|Like nobody ever got to drink it.']) });
  if (n == 3) E2.push({ x: 176, y: AY(240), hot: 'paper', dark: 1, talk: say(['|The paper is the same page, over and over.', '|MISSING. The photo underneath is just grey.', 'Hitori:scared|...Nobody put that up. Nobody even looked.']) });
  if (n == 4) E2.push({ x: 330, y: AY(236), hot: 'clip', talk: say(['|A hair clip, a little red star, on the floor by the doors.', 'Hitori:sad|...I bought her this. For her birthday.', 'Hitori:sad|Whose birthday?']) });
}
const SUBADS = [   // [background, accent, text colour, motif, what Hitori reads]
  ['#e8d8b0', '#c0402c', '#3a2a20', 'bowl', 'NOODLE KING. Open till the last train. Five-for-three on Fridays.'],
  ['#b8d8e8', '#2c5c9c', '#1a2a3a', 'wave', 'A beach, a blue sky, a phone number. "You deserve a holiday."'],
  ['#f0c8d8', '#a03070', '#3a1a2a', 'star', 'A girl group, all smiles. A concert date that already passed.'],
  ['#d0e0c0', '#3c7a40', '#1a2a1a', 'pill', '"Can\'t sleep? Talk to someone." A phone number, and a sad cartoon moon.'],
  ['#f0e0a0', '#d08020', '#3a2a10', 'cam', 'An instant camera. "Keep every moment." Somebody drew a moustache on it.'],
  ['#c8c0e8', '#5040a0', '#1a1a3a', 'eye', 'An eye clinic. "See clearly again." The eye follows you a little.']];

// carriage 1: talk to all four, then the tunnel
function subTalk1(who) {
  const F = SUB.f;
  if (F.gone) return D({
    steven: ['Hitori:worried|Where did she go?', 'Steven:neutral|Who?', 'Hitori:worried|She was RIGHT here. Next to me.', 'Steven:neutral|Hitori. There\'s four of us.', 'Steven:sad|There\'s always been four of us.'],
    caroline: ['Caroline:worried|You\'re doing the thing again.', 'Caroline:worried|The thing where you stare at an empty seat.'],
    uku: ['Uku:neutral|Probably went to the next carriage. People do that.', 'Uku:neutral|...Wait. Who are we talking about?'] }[who]);
  F['t_' + who] = 1;
  D({ uku: ['Uku:happy|Dude. Best. Day. Ever.', 'Uku:neutral|My feet are dead, though. Somebody carry me home.', 'Hitori:neutral|No.'],
    caroline: ['Caroline:happy|Look at the photo! We all fit!', 'Caroline:laugh|Barely. Steven\'s elbow is in my ribs.', 'Hitori:happy|...It\'s a good one.'],
    steven: ['Steven:neutral|Five people on a seat for three.', 'Steven:smug|I call it efficient.'],
    hikari: ['???:dark|You\'re falling asleep again.', 'Hitori:neutral|...Am not.', '???:dark|You always fall asleep before our stop.', '???:dark|It\'s okay. I\'ll wake you. I always do.'] }[who],
    () => { if (['uku', 'caroline', 'steven', 'hikari'].every(k => F['t_' + k]) && !F.gone) SUB.ev = { k: 'tunnel', t: 0 } });
}
function subEvent(e) {
  const t = ++e.t, F = SUB.f;
  if (e.k == 'open') { SUB.dark = clamp(1 - t / 60, 0, 1); if (t == 30) D(['|The last train home.', '|Five of you on a seat for three. Somebody\'s camera is still warm.', 'Hitori:neutral|...I know this night.'], () => { SUB.ev = null; SUB.dark = 0; SUB.obj = 'Talk to everyone.' }) }
  if (e.k == 'tunnel') {
    if (t == 1) { subChime(); D(['|Ding-dong.', '|"The next stop is —"', '|The speaker crackles. The name doesn\'t come.']) }
    if (t > 1 && t < 40) SUB.dark = (t % 9 < 3) ? .8 : .1;   // the lights stutter
    if (t >= 40) SUB.dark = t < 150 ? 1 : clamp(1 - (t - 150) / 40, 0, 1);
    if (t == 40) noiseBurst(.5, 300, .5, .6);
    if (t == 90) { const i = SUB.ents.findIndex(q => q.id == 'hikari'); SUB.ents.splice(i, 1, { x: 216, y: SUBG.aisleT + 2, hot: 'bag', talk: () => D(['|A small grey bag, left on the seat.', '|There\'s a name written inside the flap.', '|You read it. The moment you look away, it\'s gone from your head.']) }); F.gone = 1 }
    if (t == 195) D(['Hitori:shock|...', 'Hitori:shock|Where did she go?'], () => { SUB.ev = null; SUB.dark = 0; SUB.obj = 'Find her.' });
  }
  if (e.k == 'glass') {   // carriage 4: the train pulls away
    e.v = (e.v || 0) + .012 + e.v * .012; SUB.plat += e.v;
    if (t == 160) SUB.dark = .5; if (t > 200) SUB.dark = clamp(.5 + (t - 200) / 80, 0, 1);
    if (t == 300) D(['|"You left her there," somebody says.', '|"No," you say. "She left me."', '|"Does it matter?"', 'Hitori:sad|...What is her name?'], () => subwayEnd());
  }
}
function subDoorTalk() {
  const F = SUB.f; if (F.doorDone) return;
  if (Math.abs(SUB.hx - SUB.x) > 60) return D(['|The platform slides slowly past. Somebody is walking along it, keeping level with you.']);
  F.doorDone = 1; SUB.obj = '';
  D(['|She\'s right there, on the other side of the glass.', '|The doors don\'t open.', '???:neutral|...', '|Her mouth makes the shape of your name.', 'Hitori:sad|I can\'t... What\'s yours?', 'Hitori:sad|What\'s YOUR name?', '|You try to make the shape of hers. Nothing comes.'],
    () => ask(['|The train starts to move.'], ['Bang on the glass', 'Let her go'], i => {
      if (i == 0) { if (P2.ch) { P2.ch.glass = 1; if (typeof p2ChSave == 'function') p2ChSave() } shake = 20; noiseBurst(.2, 200, .8, .9); D(['Hitori:scared|Wait! Stop the train!', '|She runs along the platform with you as far as it goes.'], () => { SUB.ev = { k: 'glass', t: 0, v: .2 } }) }
      else D(['Hitori:sad|...', '|You put your hand flat on the glass. She puts hers on the other side.', '|It isn\'t warm.'], () => { SUB.ev = { k: 'glass', t: 0, v: .2 } }) }));
}
function subwayEnd() { subSound(false); SUB.on = 0; DL = null; CHO = null; sc = 'p2'; P2.fade = 1; p2Stage('day3') }

function subUpdate() {
  SUB.t++; const G = SUBG;
  if (SUB.trans) { const tr = SUB.trans; tr.t++; if (tr.t == 20) { subCar(tr.to); SUB.x = 44; SUB.y = AY(216); SUB.cx = 44; SUB.d = 2; if (tr.to == 3) setTimeout(() => { if (SUB.on && SUB.car == 3 && !DL) { subChime(); D(['|"This train does not stop."', '|"This train has never stopped."']) } }, 900) } if (tr.t >= 40) SUB.trans = null; return }
  if (DL) return dialogUpdate(); if (CHO) return choUpdate();
  if (SUB.ev) { subEvent(SUB.ev); if (SUB.ev && SUB.ev.k != 'x') return }
  // walking
  const dx = (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0), dy = (keys.ArrowDown || keys.KeyS ? 1 : 0) - (keys.ArrowUp || keys.KeyW ? 1 : 0);
  if (dx || dy) { const sp = dx && dy ? 1.2 : 1.7; if (dy) SUB.d = dy > 0 ? 0 : 3; if (dx) SUB.d = dx > 0 ? 2 : 1;
    const free = (x, y) => x > 30 && x < 610 && y > G.aisleT + 12 && y < G.aisleB - 4 && !SUB.ents.some(q => q.r && !q.seat && Math.hypot(q.x - x, q.y - y) < q.r + 6);
    if (free(SUB.x + dx * sp, SUB.y)) SUB.x += dx * sp; if (free(SUB.x, SUB.y + dy * sp)) SUB.y += dy * sp;
    SUB.step++; if (SUB.step % 18 == 9 && typeof SFXN != 'undefined') SFXN.step('tile', .22) } else SUB.step = 0;
  // carriage 4: she keeps level with you on the platform
  if (SUB.car == 4 && !SUB.f.doorDone) { const tx = SUB.x - 24, d = tx - SUB.hx; if (Math.abs(d) > 2) { SUB.hx += clamp(d * .05, -1.5, 1.5); SUB.hstep++ } else SUB.hstep = 0; SUB.hd = Math.abs(d) > 2 ? (d > 0 ? 2 : 1) : 0 }
  // the doors at each end
  if (SUB.x > 606 && dx > 0) { if (SUB.car == 1 && !SUB.f.gone) D(['Hitori:neutral|We\'re nearly home. I should sit down.']); else if (SUB.car < 4) { SUB.trans = { t: 0, to: SUB.car + 1 }; noiseBurst(.3, 500, .6, .5) } else if (!SUB.f.end4) { SUB.f.end4 = 1; D(['|The door at the end is welded shut. There is no next carriage.']) } SUB.x = 606 }
  if (SUB.x < 34 && dx < 0) { if (!SUB.f.back) { SUB.f.back = 1; D(SUB.car == 1 ? ['|The driver\'s cab. The blind is down.'] : ['|The door you came through won\'t open again.', 'Hitori:worried|...You can\'t go back.']) } SUB.x = 34 }
  // talking / looking
  if (ok()) { const v = [[0, 1], [-1, 0], [1, 0], [0, -1]][SUB.d], px = SUB.x + v[0] * 14, py = SUB.y + v[1] * 16;
    let best = null, bd = 1e9; for (const q of SUB.ents) { if (!q.talk) continue; const d = Math.hypot((q.x - px) * .9, q.y - py); if (d < 24 && d < bd) { bd = d; best = q } }
    if (best) best.talk();
    else if (SUB.d == 3 && SUB.y < G.aisleT + 22 && SUB.x > 286 && SUB.x < 354) { if (SUB.car == 4) subDoorTalk(); else D([['|Black tunnel wall, and your own face in the glass, going past at speed.'], ['|A station slides past the glass without slowing. The name on the sign has been painted over.'], ['|The line map above the door has one stop on it, over and over, all the way round.', '|The name has been scratched off every one.']][SUB.car - 1]) }
    else if (SUB.d == 3 && SUB.y < G.aisleT + 24) { const i = SUBWIN.findIndex(w => SUB.x > w[0] - 6 && SUB.x < w[1] + 6); if (i >= 0) { const A = SUBADS[i];
      D(SUB.car == 4 ? ['|The advert above the window is a blank white card.', '|So are all the others.'] : SUB.car == 3 ? ['|Every advert in the carriage is the same photograph now.', '|Five people on a seat for three. One face scratched out.'] : SUB.car == 2 ? ['|An advert: ' + A[4], '|It\'s faded, like it\'s been up there for years.'] : ['|An advert: ' + A[4]]) } } }
}

// ---------------------------------------------------------------- drawing
const SUBSIL = {};
function subSil(c, d) {   // a sprite's first frame filled in black
  const k = c.key + d; if (SUBSIL[k]) return SUBSIL[k]; const im = SHEETS[c.key] && SHEETS[c.key][d]; if (!ready(im)) return null;
  const cv = document.createElement('canvas'); cv.width = im.naturalWidth / 4; cv.height = im.naturalHeight; const g = cv.getContext('2d'); g.drawImage(im, 0, 0); g.globalCompositeOperation = 'source-atop'; g.fillStyle = '#08070c'; g.fillRect(0, 0, cv.width, cv.height); return SUBSIL[k] = cv;
}
function subDrawEnt(q) {
  if (q.hot == 'bag') { r(q.x - 7, q.y - 16, 14, 11, '#4a5060'); r(q.x - 5, q.y - 19, 10, 3, '#3a3f4c'); r(q.x - 7, q.y - 12, 14, 1, '#2c303a'); return }
  if (q.pole) { const top = SUBG.wallT + 14; r(q.x - 1, top, 3, q.y - top, '#b8bec8'); r(q.x - 1, top, 1, q.y - top, '#e8ecf0'); r(q.x - 2, q.y - 2, 5, 2, '#6a707a'); r(q.x - 2, top - 2, 5, 2, '#6a707a'); return }
  if (q.hot == 'paper') { r(q.x - 7, q.y - 4, 14, 7, q.dark ? '#c8c4b8' : '#dcd8cc'); r(q.x - 6, q.y - 3, 5, 2, '#5a5850'); r(q.x, q.y - 3, 6, 1, '#8a8880'); r(q.x, q.y - 1, 6, 1, '#8a8880'); r(q.x - 6, q.y, 12, 1, '#8a8880'); if (q.dark) r(q.x - 5, q.y - 3, 4, 3, '#4a4a48'); return }
  if (q.hot == 'can') { if (q.bx) q.x = q.bx + Math.round(Math.sin(SUB.t / 70) * 18); const k = (q.x >> 1) & 1; r(q.x - 3, q.y - 3, 6, 4, '#8ac860'); r(q.x - 3, q.y - 3 + k, 6, 1, '#d8e8c0'); r(q.x + 3, q.y - 3, 1, 4, '#b8c0b0'); return }
  if (q.hot == 'umb') { r(q.x, q.y - 26, 1, 24, '#d8dce4'); r(q.x - 3, q.y - 20, 7, 16, 'rgba(220,230,240,.35)'); r(q.x - 1, q.y - 28, 3, 3, '#3a3a40'); return }
  if (q.hot == 'clip') { const s = (SUB.t >> 4) & 1; r(q.x - 2, q.y - 3, 5, 3, '#d02838'); r(q.x - 1, q.y - 4, 3, 5, '#d02838'); if (s) r(q.x, q.y - 3, 1, 1, '#ffd0d0'); return }
  if (q.hot == 'photo') { r(q.x - 5, q.y - 4, 10, 8, '#e8e4d8'); r(q.x - 4, q.y - 3, 8, 5, '#3a3440'); return }
  if (q.hot == 'phone') { const b = SUB.f.phone ? 0 : ((SUB.t >> 2) & 1); r(q.x - 3 + b, q.y - 5, 7, 11, '#16161c'); if (!SUB.f.phone && (SUB.t >> 4) & 1) r(q.x - 5, q.y - 7, 11, 15, 'rgba(160,200,255,.18)'); return }
  if (!q.c) return;
  let d = q.d; if (q.watch) { const ax = SUB.x - q.x, ay = SUB.y - q.y; d = Math.abs(ax) > Math.abs(ay) ? (ax > 0 ? 2 : 1) : (ay > 0 ? 0 : 3) }
  if (q.sil) { const cv = subSil(q.c, d); if (!cv) return; X.imageSmoothingEnabled = false; X.drawImage(cv, Math.round(q.x - cv.width / 2), Math.round(q.y - cv.height + 1));
    if (d == 0) { r(q.x - 5, q.y - 19, 2, 2, '#fff'); r(q.x + 3, q.y - 19, 2, 2, '#fff') } else if (d == 1) r(q.x - 6, q.y - 19, 2, 2, '#fff'); else if (d == 2) r(q.x + 4, q.y - 19, 2, 2, '#fff'); return }
  drawChar(q.c, q.x, q.y, d, 0);
  if (q.dim) { X.globalAlpha = q.dim; const cv = subSil(q.c, d); if (cv) X.drawImage(cv, Math.round(q.x - cv.width / 2), Math.round(q.y - cv.height + 1)); X.globalAlpha = 1 }
}
function subWindows() {
  const G = SUBG, car = SUB.car, t = SUB.t, all = [...SUBWIN.map(w => [w[0], w[1], G.winT, G.winB]), ...SUBDOOR.map(w => [w[0], w[1], G.winT, G.benchT + 8])];
  for (const [a, b, y0, y1] of all) {
    r(a - 2, y0 - 2, b - a + 4, y1 - y0 + 4, '#2a2e36'); X.save(); X.beginPath(); X.rect(a, y0, b - a, y1 - y0); X.clip();
    if (car < 4) { r(a, y0, b - a, y1 - y0, '#05060a');
      for (let i = 0; i < 9; i++) { const px = ((i * 113 - t * 9) % 1000 + 1000) % 1000 - 120; r(px, y0 + 4 + (i % 3) * 7, 3, 18, 'rgba(70,74,84,.5)') }   // the tunnel ribs
      for (let i = 0; i < 6; i++) { const px = ((i * 173 - t * 9) % 1000 + 1000) % 1000 - 120; r(px, y0 + 6, 18, 2, car == 3 ? '#7fae8a' : '#ffe9a8'); r(px - 26, y0 + 7, 26, 1, 'rgba(255,233,168,.3)') }
      for (let i = 0; i < 4; i++) { const px = ((i * 251 - t * 9) % 1000 + 1000) % 1000 - 120; r(px, y0 + 20, 120, 1, 'rgba(120,120,130,.35)') }   // cables
      if (car == 2 && t % 1100 > 900) { r(a, y0, b - a, y1 - y0, 'rgba(170,176,186,.55)'); const sx = ((2000 - (t % 1100 - 900) * 14) % 1400) - 300; r(sx, y0 + 6, 90, 12, '#e8e4d8'); r(sx + 6, y0 + 10, 78, 4, '#1a1a20') }
      // the reflections of the people sitting under the window
      X.globalAlpha = .1; for (const q of SUB.ents) if (q.seat && q.c && q.y < G.aisleT + 10 && q.x > a - 14 && q.x < b + 14) { const cv = subSil(q.c, 3); if (cv) X.drawImage(cv, Math.round(q.x - cv.width / 2), y0 + 4) } X.globalAlpha = 1;
      r(a, y0, b - a, y1 - y0, 'rgba(120,140,170,.05)');
    } else {   // the platform, at the same height in every window
      const off = SUB.plat, end = 900 - off, P0 = G.winT; r(a, y0, b - a, y1 - y0, '#05060a');
      if (end > a) { X.save(); X.beginPath(); X.rect(a, y0, Math.min(b, end) - a, y1 - y0); X.clip();
        r(a, P0, b - a, 26, '#8f8b80'); for (let x = -((off) % 14); x < 660; x += 14) r(x, P0, 1, 26, '#7d796f'); r(a, P0 + 9, b - a, 1, '#7d796f'); r(a, P0 + 18, b - a, 1, '#7d796f');
        r(a, P0 + 26, b - a, 40, '#b9b29a'); r(a, P0 + 26, b - a, 2, '#d8c860'); for (let x = -((off * 1.2) % 30); x < 660; x += 30) r(x, P0 + 34, 14, 1, '#a8a088');
        for (let i = 0; i < 6; i++) { const px = i * 210 + 60 - off; r(px, P0, 8, 30, '#6c685f'); r(px - 1, P0 + 28, 10, 2, '#5a564e'); r(px + 1, P0 + 4, 6, 3, '#e8e2c8') }
        const sx = 360 - off; r(sx, P0 + 3, 60, 10, '#e8e4d8'); for (let i = 0; i < 7; i++) r(sx + 5 + i * 7, P0 + 6 + (i * 5 % 3), 6, 4 - (i % 2), '#141218');
        r(sx + 120, P0 + 14, 10, 12, '#5a6a8a'); r(sx + 121, P0 + 15, 8, 5, '#c8d8e8');   // a vending machine
        X.restore() }
      const hx = SUB.hx - off; if (hx > -30 && hx < 670) drawChar(HIK, hx, P0 + 46, SUB.hd || 0, SUB.hstep ? 1 + ((SUB.hstep >> 3) % 4) : 0);
      r(a, y0, b - a, y1 - y0, 'rgba(140,170,200,.08)');
    }
    if (SUB.face && SUB.face[0] == a && car == 3) { const fx = (a + b) / 2; ell(fx, y0 + 15, 8, 10, '#d8d4d0'); r(fx - 4, y0 + 12, 2, 3, '#000'); r(fx + 2, y0 + 12, 2, 3, '#000') }
    X.restore(); r(a, y0, 2, y1 - y0, 'rgba(255,255,255,.08)'); r(a + 6, y0 + 2, 1, 10, 'rgba(255,255,255,.06)');
  }
}
function subAd(i, x, y, w, h) {   // one advert placard above a window
  const car = SUB.car, A = SUBADS[i % SUBADS.length];
  r(x - 1, y - 1, w + 2, h + 2, '#3a3f4a');
  if (car == 4) { r(x, y, w, h, '#d8d8d4'); return }
  if (car == 3) { r(x, y, w, h, '#2a2e2a'); r(x + 3, y + 2, h - 4, h - 4, '#8a8a84'); r(x + 5, y + 4, h - 8, h - 8, '#3a3a38'); r(x + 4, y + 5, h - 6, 1, '#d8d4d0');
    for (let k = 0; k < 3; k++) r(x + h + 2, y + 3 + k * 3, w - h - 6 - k * 9, 1, '#6a6a64'); return }
  const fade = car == 2 ? .35 : 0;
  r(x, y, w, h, A[0]); r(x, y + h - 3, w, 3, A[1]);
  const mx = x + 4, my = y + 2, m = A[3];
  if (m == 'bowl') { ell(mx + 5, my + 6, 5, 3, A[1]); r(mx + 1, my + 2, 1, 4, '#fff'); r(mx + 4, my + 1, 1, 4, '#fff') }
  if (m == 'wave') { r(mx, my + 1, 12, 5, '#f0f0c0'); ell(mx + 9, my + 2, 2, 2, '#f0c040'); r(mx, my + 6, 12, 3, A[1]) }
  if (m == 'star') { for (let k = 0; k < 3; k++) { ell(mx + 2 + k * 4, my + 3, 1.6, 1.6, '#f0d0b0'); r(mx + 1 + k * 4, my + 5, 3, 4, [A[1], '#fff', '#202030'][k]) } }
  if (m == 'pill') { ell(mx + 5, my + 4, 4, 4, '#f0f0d0'); ell(mx + 6, my + 3, 3, 3, A[0]) }
  if (m == 'cam') { r(mx + 1, my + 2, 10, 7, '#303030'); ell(mx + 6, my + 5, 2.4, 2.4, '#90b0d0'); r(mx + 8, my + 3, 2, 1, '#fff') }
  if (m == 'eye') { ell(mx + 6, my + 4, 5, 3, '#fff'); const ex = clamp((SUB.x - x) / 120, -2, 2); ell(mx + 6 + ex, my + 4, 1.8, 1.8, '#202040') }
  for (let k = 0; k < 2; k++) r(x + 18, y + 3 + k * 4, w - 24 - k * 12, 2, A[2]); r(x + 18, y + 11, 14, 1, A[1]);
  if (fade) r(x, y, w, h, 'rgba(160,165,175,' + fade + ')');
}
function subWTxt(s, x, y, c, sz) { X.save(); X.font = sz + 'px ' + (typeof TXTF != 'undefined' && TXTF || FONT); X.textAlign = 'left'; X.textBaseline = 'top'; X.fillStyle = c; X.fillText(s, x, y); X.restore() }
function subDraw() {
  const G = SUBG, car = SUB.car, t = SUB.t, seat = ['#8a3040', '#7a3444', '#3c5244', '#3a3a44'][car - 1], seatD = ['#5e2030', '#52242e', '#28382e', '#26262e'][car - 1];
  const jy = (t % 54 < 3 || (t % 54 > 8 && t % 54 < 11)) ? .5 : 0, sway = Math.sin(t / 47) * .6;   // the rails
  const vw = 320 / SUBZ;
  const tx = clamp(SUB.x, G.x0 + vw - 4, G.x1 - vw + 4); SUB.cx = SUB.cx == null ? tx : SUB.cx + (tx - SUB.cx) * .1;
  sW(); r(0, 0, 640, 360, '#000'); X.save(); X.translate(320, 180); X.scale(SUBZ, SUBZ); X.translate(-Math.round(SUB.cx * 4) / 4 + sway, -163 + jy);
  // the ceiling and its strip lights
  r(G.x0, G.ceil - 20, G.x1 - G.x0, G.wallT - G.ceil + 20, '#c4c8d0'); r(G.x0, G.wallT - 2, G.x1 - G.x0, 2, '#9aa0aa');
  for (let i = 0; i < 8; i++) { const lx = 30 + i * 76, on = !(car >= 3 && ((t >> 3) + i * 5) % 37 < (car == 4 ? 9 : 3)); r(lx, G.ceil - 1, 56, 4, '#8a8e96'); r(lx + 1, G.ceil, 54, 2, on ? (car == 3 ? '#c8f0d0' : '#fffbe8') : '#6a6e76'); if (on) r(lx - 6, G.ceil + 3, 68, 2, 'rgba(255,250,230,.25)') }
  // the back wall: adverts, luggage rack, windows
  r(G.x0, G.wallT, G.x1 - G.x0, G.benchT - G.wallT + 22, '#8b919c'); r(G.x0, G.winB + 2, G.x1 - G.x0, G.benchT - G.winB, '#6b717c');
  SUBWIN.forEach((w, i) => subAd(i, w[0] + 2, G.wallT + 2, w[1] - w[0] - 4, 15));
  r(288, G.winT - 3, 64, G.benchT + 14 - G.winT, '#5a606b'); r(G.x0, G.benchT + 22, G.x1 - G.x0, 2, '#5a5f6a');
  subWindows();
  r(G.x0, G.winT - 5, G.x1 - G.x0, 2, '#c8ccd4'); r(G.x0, G.winT - 3, G.x1 - G.x0, 1, '#5a5f6a');
  for (let x = 40; x < 610; x += 18) if (!(x > 280 && x < 360)) { const sw = Math.round(Math.sin(t / 30 + x) * (car >= 3 ? 1 : .5)); r(x, G.winT - 3, 1, 6, '#d8d8dc'); r(x - 2 + sw, G.winT + 3, 5, 4, '#d8d8dc'); r(x - 1 + sw, G.winT + 4, 3, 2, '#8b919c') }
  // the doors in the middle, the line display above them
  r(286, G.wallT, 68, G.winT - G.wallT - 2, '#7b818c'); r(292, G.wallT + 3, 56, 11, '#101216');
  const msg = car == 1 ? 'LAST TRAIN · NEXT STOP: HOME · ' : car == 2 ? 'NEXT STOP: ---- · NEXT STOP: ---- · ' : car == 3 ? 'THIS TRAIN DOES NOT STOP · ' : '                  ';
  X.save(); X.beginPath(); X.rect(293, G.wallT + 4, 54, 9); X.clip(); X.font = '6px ' + (typeof TXTF != 'undefined' && TXTF || FONT); const mw = Math.max(20, X.measureText(msg).width); subWTxt(msg + msg + msg, 293 - (t * .4) % mw, G.wallT + 5, car == 3 ? '#5ad07a' : '#ff8a30', 6); X.restore();
  for (let i = 0; i < 7; i++) r(300 + i * 6, G.wallT + 16, 3, 2, car == 1 && i == 2 ? '#ffb040' : car == 3 ? '#3a6a48' : '#5a2a2a');
  r(319, G.winT - 2, 2, G.benchT + 10 - G.winT, '#3a3f4a');
  r(574, G.winB + 4, 30, 8, '#1c1e24'); subWTxt(car == 4 ? 'CAR' : 'CAR 3', 577, G.winB + 5, '#c8b060', 6);
  // the benches along the back wall
  for (const [a, b] of [[40, 272], [368, 600]]) { r(a, G.benchT - 14, b - a, 16, seatD); r(a, G.benchT, b - a, 22, seat); r(a, G.benchT + 20, b - a, 3, seatD); for (let x = a + 34; x < b; x += 34) r(x, G.benchT, 1, 20, seatD); r(a - 3, G.benchT - 16, 3, 40, '#a9aeb8'); r(b, G.benchT - 16, 3, 40, '#a9aeb8') }
  // the floor, and the light the ceiling strips throw on it
  r(G.x0, G.aisleT, G.x1 - G.x0, G.backB - G.aisleT, '#3c4049'); for (let x = G.x0; x < G.x1; x += 20) r(x, G.aisleT, 1, G.backB - G.aisleT, '#363a43');
  for (let y = G.aisleT + 6; y < G.aisleB; y += 9) for (let x = G.x0 + ((y >> 1) % 7); x < G.x1; x += 13) r(x, y, 1, 1, '#454a54');   // the rubber studs
  r(270, G.aisleT, 100, G.aisleB - G.aisleT, 'rgba(216,200,96,.06)'); r(270, G.aisleT + 1, 100, 1, 'rgba(216,200,96,.4)'); r(270, G.aisleB - 2, 100, 1, 'rgba(216,200,96,.4)');
  for (let i = 0; i < 8; i++) { const on = !(car >= 3 && ((t >> 3) + i * 5) % 37 < (car == 4 ? 9 : 3)); if (on) r(26 + i * 76, G.aisleT + 14, 64, 18, car == 3 ? 'rgba(140,200,150,.06)' : 'rgba(255,240,200,.06)') }
  r(G.x0, G.aisleT, G.x1 - G.x0, 3, 'rgba(0,0,0,.25)');
  // the doors at each end, with the next carriage swaying behind their windows
  for (const x of [G.x0, G.x1 - 12]) { r(x, G.winT - 6, 12, G.aisleB - G.winT + 6, '#555b66'); r(x + 2, G.winT, 8, 34, '#101218'); if (car < 4) r(x + 3 + Math.round(Math.sin(t / 20)), G.winT + 6, 6, 3, 'rgba(255,233,168,.35)'); r(x + 5, G.winT + 40, 2, 8, '#c8ccd4') }
  // everyone, back to front; then the row with their backs to us and the seat backs over their legs
  const P = { pl: 1, x: SUB.x, y: SUB.y }, L = [...SUB.ents.filter(q => q.y < G.aisleB + 4), P].sort((a, b) => a.y - b.y);
  for (const q of L) if (q.pl) drawChar(subFriend('Hitori'), SUB.x, SUB.y, SUB.d, SUB.step ? 1 + ((SUB.step >> 3) % 4) : 0); else subDrawEnt(q);
  for (const q of SUB.ents) if (q.y >= G.aisleB + 4) subDrawEnt(q);
  for (const [a, b] of [[40, 272], [368, 600]]) { r(a, G.aisleB + 12, b - a, 26, seat); r(a, G.aisleB + 12, b - a, 3, seatD); for (let x = a + 34; x < b; x += 34) r(x, G.aisleB + 14, 1, 24, seatD); r(a - 3, G.aisleB + 8, 3, 32, '#a9aeb8'); r(b, G.aisleB + 8, 3, 32, '#a9aeb8') }
  r(G.x0 - 40, G.backB, G.x1 - G.x0 + 80, 80, '#000'); r(G.x0, G.backB, G.x1 - G.x0, 2, '#20232a');
  r(G.x0 - 60, G.ceil - 40, 60, 260, '#000'); r(G.x1, G.ceil - 40, 60, 260, '#000');
  X.restore();
  // the light: warm, then colder, then green, then barely there
  sU(); const tint = ['rgba(255,190,110,.07)', 'rgba(110,150,255,.10)', 'rgba(40,110,70,.20)', 'rgba(10,14,30,.42)'][car - 1]; r(0, 0, W, H, tint);
  const fl = car >= 3 ? (((t * 7) % 211 < 6 || (t * 3) % 173 < 4) ? .5 : 0) + (car == 4 ? .12 * Math.sin(t / 7) + .12 : 0) : car == 2 && t % 400 < 4 ? .35 : 0;
  const dk = clamp(SUB.dark + fl, 0, 1); if (dk > 0) r(0, 0, W, H, 'rgba(0,0,0,' + dk + ')');
  const g = X.createRadialGradient(W / 2 * U, H / 2 * U, 60 * U, W / 2 * U, H / 2 * U, 190 * U); X.setTransform(1, 0, 0, 1, 0, 0); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,' + (car >= 3 ? .75 : .45) + ')'); X.fillStyle = g; X.fillRect(0, 0, C.width, C.height); sU();
  if (SUB.trans) { const a = SUB.trans.t < 20 ? SUB.trans.t / 20 : 1 - (SUB.trans.t - 20) / 20; r(0, 0, W, H, 'rgba(0,0,0,' + clamp(a, 0, 1) + ')') }
  if (SUB.obj && !DL && !CHO) txt(SUB.obj, 8, 6, '#b8b4c0', 'left', 6);
  if (DL) drawDialog(); if (CHO) drawChoice();
}
XSC.p2sub = function () {
  if (SUB.car == 3 && SUB.t % 420 == 0) { const w = SUBWIN[(Math.random() * 6) | 0]; SUB.face = [w[0], SUB.t] } if (SUB.face && SUB.t - SUB.face[1] > 7) SUB.face = null;
  subUpdate(); if (sc == 'p2sub') subDraw();
};

// ---------------------------------------------------------------- sound: the rails, the chime
function subSound(on) {
  if (typeof sndBoot != 'function' || !sndBoot()) return;
  if (SUB.snd) { const s = SUB.snd; SUB.snd = null; clearInterval(s.timer); s.g.gain.setTargetAtTime(0, AC.currentTime, .3); setTimeout(() => { s.nodes.forEach(n => { try { n.stop() } catch (e) {} }); try { s.g.disconnect() } catch (e) {} }, 1200) }
  if (!on) return;
  const g = sG(0), n = sNoise('brown'), lp = sF('lowpass', 210, .8), hum = sO('sawtooth', 48), hg = sG(.05); sChain(n, lp, g, SND.bus); sChain(hum, sF('lowpass', 140), hg, g); n.start(); hum.start(); g.gain.setTargetAtTime(.55 * opt.s / 10, AC.currentTime, .8);
  let next = AC.currentTime + .3;
  const timer = setInterval(() => { if (sc != 'p2sub') return subSound(false); const fast = SUB.ev && SUB.ev.k == 'glass' ? Math.max(.35, 1 - SUB.ev.t / 300) : 1; g.gain.setTargetAtTime((SUB.car == 4 && !SUB.ev ? .25 : .55) * opt.s / 10, AC.currentTime, .5);
    while (next < AC.currentTime + .25) { for (const o of [0, .09]) { sHit('brown', next + o, .004, .08, .9, g, sF('lowpass', 320)); sTone('sine', 70, 50, next + o, .003, .07, .5, g) } next += .9 * fast } }, 60);
  SUB.snd = { g, nodes: [n, hum], timer };
}
function subChime() { if (typeof sndBoot != 'function' || !sndBoot()) return; const t = AC.currentTime + .02, o = sG(.5 * opt.s / 10); o.connect(SND.bus); sTone('sine', 784, 784, t, .01, .7, .5, o); sTone('sine', 622, 622, t + .45, .01, .9, .5, o) }
