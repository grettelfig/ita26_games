// ==================== PART TWO: day 2, "one normal day" ====================
// The order of Part Two is now:
//   day1  ->  dealer (the blackjack dream)  ->  day2 (this file)  ->  subway (the train dream, js/p2_subway.js)
//         ->  day3 (the house turning on her: what used to be day 2)  ->  sister (the ending) / home (the second ending)
// P2.day is 1, 1.5, 2, 2.5, 3, 4 (her sister) and 5 (the morning after).
// Day 2 is only a little stranger than day 1. The dealer told her to take her medicine, eat, and open the curtains,
// so she tries to have one normal day: a short list of things to do, most of them optional, and a few small things
// that aren't right (a heart in the steam on the mirror, a knock with nobody there, a cat that never comes).
const DAY2_TODO = [['pill', 'Take my medicine'], ['shower', 'Have a shower'], ['eat', 'Eat something'], ['dishes', 'Wash the dishes'], ['blinds', 'Open the blinds'], ['mochi', 'Feed Mochi'], ['mail', 'Check the post']];
const DAY2_NEED = ['pill', 'shower', 'eat', 'dishes'];   // what has to be done before bed; the rest is up to you
const todoDone = k => !!(P2.d2b && P2.d2b.todo[k]);
function todoTick(k) { if (!P2.d2b || P2.d2b.todo[k]) return; P2.d2b.todo[k] = 1; beep(880, .04, .5); if (DAY2_NEED.every(todoDone) && !P2.d2b.ready) { P2.d2b.ready = 1; P2.objective = 'That\'s enough for one day. Go to bed.' } }

function p2Day2() {
  P2.stage = 'day2'; ST2s('stage', 'day2'); P2.ui = null; P2.cut = null; P2.subs = []; P2.choice = null; ME.vm = null; P2.vmExtra = null; P2.pose = null; P2.hideBody = 0; P2.seated = 0; P2.wantLock = true; P2.silent = 0;
  P2.day = 2; P2.font = FONT; P2.name = 'Hitori'; P2.scene = 'house'; P2.lights = {}; P2.npc = null;
  P2.f = { thrown: 0, vomited: 1, history: 1, polaroids: 1, phoneSeen: 1, pills: 1 }; P2.d2b = { todo: {}, t: 0, ev: {} };
  H3.extra.phonebroken.vis = false; H3.extra.phone.vis = true; for (const d of H3.doors) if (d.id != 'kitchen') d.to = d.a = 0; p2HouseForDay();
  AMB3.start(false); P2.amb = { foot: 800, whisper: 1000 };
  [PL3.x, PL3.z] = LM(10.15, 8.85, 3); PL3.y = 3; CAM3.yaw = -Math.PI / 2; CAM3.pitch = 0; CAM3.roll = 0; P2.blink = 1; P2.hideBody = 1; P2.fade = 1; P2.fadeTo = 0; P2.cut = { k: 'wake', t: 0 };
  say3(['|...', 'Hitori|...Morning. I think it\'s actually morning.', 'Hitori|A man made of playing cards told me to take my medicine.', 'Hitori|Eat something. Open the curtains.', 'Hitori|...Okay. Okay. One normal day. I can do one normal day.'], () => { P2.cut = null; P2.hideBody = 0; P2.objective = 'One normal day.' });
}
const _p2Stage60 = p2Stage;
p2Stage = function (stage) {
  setDaylight(stage == 'day2' || stage == 'home');
  if (stage == 'day2') return p2Day2();
  if (stage == 'subway') { P2.stage = 'subway'; ST2s('stage', 'subway'); P2.day = 2.5; AMB3.stop(); P2.ui = null; P2.cut = null; P2.subs = []; return subwayStart() }
  if (H3.extra.steam) { H3.extra.steam.vis = false; H3.extra.bowlfood.vis = false; H3.extra.daywin.vis = stage == 'day3' || stage == 'sister' || stage == 'home' ? !!P2.ch.curtains : false; H3.extra.ribbon.vis = !!P2.ch.gift }
  _p2Stage60(stage);
};
// daylight in the windows on day 2 and on the morning after; night the rest of the time
function setDaylight(on) {
  const T = TX.night; if (!T) return; if (!T.nightCopy) { T.nightCopy = document.createElement('canvas'); T.nightCopy.width = T.nightCopy.height = T.size; T.nightCopy.getContext('2d').drawImage(T.cv, 0, 0) }
  const g = T.g, s = T.size; if (!on) g.drawImage(T.nightCopy, 0, 0);
  else { const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, '#c9d6e4'); gr.addColorStop(1, '#eee8d8'); g.fillStyle = gr; g.fillRect(0, 0, s, s); g.fillStyle = '#8f8f88'; g.fillRect(0, 44, s, 20); g.fillStyle = '#74746e'; for (const [x, w, h] of [[2, 10, 14], [16, 8, 20], [30, 14, 10], [48, 12, 16]]) g.fillRect(x, 44 - h, w, h);
    g.fillStyle = '#e8e4dc'; g.fillRect(0, 0, s, 2); g.fillRect(0, 31, s, 2); g.fillRect(0, 0, 2, s); g.fillRect(31, 0, 2, s); g.fillRect(62, 0, 2, s); g.fillRect(0, 62, s, 2) }
  T.dirty = 1;
}
const _buildHouse60 = buildHouse;
buildHouse = function () { const was = H3.built; if (!was) { MB.reg = new Map(); MB.lifted = 0 } try { _buildHouse60(); if (!was) buildDecor() } finally { MB.reg = null } };

// ---------------------------------------------------------------- the list, and the small wrong things
const _xscP2_60 = XSC.p2;
XSC.p2 = function () {
  _xscP2_60();
  if (P2.day == 2 && P2.d2b && !P2.ui && !P2.cut && !P2.choice && P2.scene == 'house') { sU(); DAY2_TODO.forEach(([k, n], i) => { const d = todoDone(k), need = DAY2_NEED.includes(k);
    ptxt((d ? '■ ' : '□ ') + n, 8, 17 + i * 7.5, d ? 'rgba(150,170,150,.5)' : need ? 'rgba(210,210,210,.6)' : 'rgba(170,170,180,.42)', 'left', 5.5, P2.font, 'rgba(0,0,0,.5)') }) }
};
const _ambTick60 = p2AmbTick;
p2AmbTick = function () {
  _ambTick60(); if (P2.day != 2 || !P2.d2b || P2.cut || P2.ui || P2.choice || subsBusy()) return;
  const D = P2.d2b, E = D.ev, n = Object.keys(D.todo).length, rm = roomAt(PL3.x, PL3.z, PL3.y), up = PL3.y > 1.5; D.t++;
  if (!E.sis && up && rm == 'sister') { E.sis = 1; SFX3.whisper(.3, 1.6); say3(['|(...hitori...)', 'Hitori|...Hello?', '|Nothing. A room that smells of somebody else\'s shampoo.']) }
  if (!E.tv && n >= 2 && !up && rm == 'living') { E.tv = 1; say3(['|The TV is on. She doesn\'t remember turning it on.', 'Hitori|...Old house. Old TV.']) }
  if (!E.knock && D.todo.mail && n >= 4 && (up || rm != 'hall')) { E.knock = D.t; const fd = H3.inter.find(i => i.id == 'frontdoor'), p = fd ? bc(fd.box) : [8.7, 1, 13.9];
    for (let i = 0; i < 3; i++) setTimeout(() => sOneShot(p, 30, (t, o) => { sHit('brown', t, .003, .12, 1.4 * opt.s / 10, o, sF('lowpass', 420)); sTone('sine', 110, 70, t, .003, .1, .8 * opt.s / 10, o) }), i * 420);
    setTimeout(() => { if (P2.day == 2) say3(['|Three knocks at the front door.', 'Hitori|...', 'Hitori|Nobody knocks. Nobody has knocked in weeks.']) }, 1500) }
  if (D.todo.mochi && !E.bowl && n >= D.mochiAt + 2 && rm != 'kitchen') { E.bowl = 1; H3.extra.bowlfood.vis = false }
};

// ---------------------------------------------------------------- reading something held in both hands (the diary, a letter)
function readThing(tex, lines, after, o = {}) { P2.cut = { k: 'read', t: 0, tex, lines, after, w: o.w || .17, h: o.h || .23 } }
const READMESH = {};
function readCut(c) {
  const t = ++c.t, key = c.tex + c.w, mesh = READMESH[key] || (READMESH[key] = single(m => { m.box(c.tex, -c.w / 2, -c.h / 2, -.006, c.w / 2, c.h / 2, .006, { fit: 1 }); if (c.tex == 'diary') { m.box('paper', -c.w / 2 + .004, -c.h / 2 + .004, .006, c.w / 2 - .004, c.h / 2 - .004, .012); for (let i = 0; i < 9; i++) m.box('dark', -c.w / 2 + .02, c.h / 2 - .03 - i * .021, .012, c.w / 2 - .02 - (i % 3) * .02, c.h / 2 - .026 - i * .021, .0125) } }));
  const up = c.said ? 1 - ease3((t - c.said) / 24) : ease3(t / 30), y = -.5 + up * .36, tilt = -.55 + Math.sin(t / 50) * .015;
  const L = M4.chain(M4.tr(0, y, -.36), M4.rx(tilt)); P2.vmExtra = [posed(mesh, M4.mul(camWorld(), L))];
  const hx = c.w / 2 + .015; ME.vm = { L: vmArm(-1, M4.pt(L, [-hx, -c.h * .3, .02]), [.5, .7, -.3], [1, 0, .4], .75, [-1, -.6, .4]), R: vmArm(1, M4.pt(L, [hx, -c.h * .3, .02]), [-.5, .7, -.3], [-1, 0, .4], .75, [1, -.6, .4]) };
  CAM3.pitch += (-.3 - CAM3.pitch) * .05;
  if (t == 1) pageTurn(); if (t == 30) say3(c.lines, () => { c.said = c.t; pageTurn() });
  if (c.said && t > c.said + 24) { P2.cut = null; P2.vmExtra = null; ME.vm = null; if (c.after) c.after() }
}
CUTS.read = readCut;

// ---------------------------------------------------------------- waking: she rubs her eyes
const _wake60 = CUTS.wake;
CUTS.wake = CUTS.wake2 = function (c) {
  _wake60(c); const t = c.t;
  if (t > 96 && t < 196) { const q = Math.min(1, (t - 96) / 18, (196 - t) / 18), r = Math.sin(t / 5) * .012; ME.vm = { L: vmArm(-1, [-.075 + r, -.3 + q * .27, -.13], [.25, 1, 0], [.3, 0, 1], .6, [-1, -.8, .2]), R: vmArm(1, [.075 - r, -.3 + q * .27, -.13], [-.25, 1, 0], [-.3, 0, 1], .6, [1, -.8, .2]) }; P2.blink = Math.max(P2.blink, q * .55) }
  else if (t == 196) ME.vm = null;
};
// taking a pill: the hand comes up to her mouth
function pillCut(c) {
  const t = ++c.t, q = t < 26 ? ease3(t / 26) : t < 50 ? 1 : 1 - ease3((t - 50) / 22);
  ME.vm = { R: vmArm(1, V3.lerp([.2, -.42, -.2], [.03, -.06, -.22], q), [-.3, .9, -.2], [-.2, 0, 1], .8, [1, -.7, .3]) };
  CAM3.pitch += ((q > .8 ? .22 : 0) - CAM3.pitch) * .08;
  if (t == 34) noiseBurst(.08, 300, 1, .3); if (t >= 72) { ME.vm = null; P2.cut = null; c.after && c.after() }
}
CUTS.pill = pillCut;

// ---------------------------------------------------------------- the day's things
P2S.shower = function () {
  if (P2.day == 4) return say3(['Hikari|The tub\'s still wet.']); if (P2.day != 2) return say3(P2.day == 3 ? ['|The shower is running. She doesn\'t remember turning it on.', 'Hitori|...I\'ll turn it off later.'] : ['Hitori|...Later. I can\'t face it yet.']);
  if (todoDone('shower')) return say3(['Hitori|Once is enough.']);
  P2.cut = { k: 'shower', t: 0 };
};
CUTS.shower = function (c) {
  const t = ++c.t;
  if (t == 1) { P2.fadeTo = 1; P2.f.showering = 1 }
  if (t == 70) say3(['|Hot water. She stands under it until her fingers wrinkle.', '|For a few minutes there is nothing in her head but the sound of it.'], null, { dur: 190 });
  if (t == 470) { P2.f.showering = 0; H3.extra.steam.vis = true; P2.f.steam = 1; PL3.x = 3.25; PL3.z = 1.5; PL3.y = 3; CAM3.x = PL3.x; CAM3.z = PL3.z; CAM3.yaw = 0; CAM3.pitch = .05; P2.fadeTo = 0 }
  if (t == 560) say3(['|The mirror has fogged over.', '|Somebody has drawn a little heart in the steam.', 'Hitori|...I didn\'t do that.', 'Hitori|...Did I do that?'], () => { P2.cut = null; todoTick('shower') });
};
P2S.blinds = function () {
  if (P2.day == 4) return say3(P2.ch.curtains ? ['Hikari|She opened the blinds.', 'Hikari|...She never opens the blinds.'] : ['Hikari|Shut. They\'ve been shut since I left.']);
  if (P2.day == 5) return say3(['Hitori|Sun\'s out.']);
  if (P2.f.blinds || (P2.day == 3 && P2.ch.curtains)) return say3(P2.day == 3 ? ['|Daylight. Somebody is standing down on the pavement, looking up. Probably just waiting for a bus.', 'Hitori|...Probably.'] : ['|The street. A parked car. A lamppost.']);
  if (P2.day != 2) return say3([P2.day == 3 ? 'Hitori|Not today. I don\'t want anyone looking in.' : 'Hitori|Leave them shut.']);
  reachThen([16.3, 4.3, 13.5], () => { P2.f.blinds = 1; P2.ch.curtains = 1; p2ChSave(); H3.extra.daywin.vis = true; noiseBurst(.5, 900, .6, .5);
    say3(['|She pulls the cord. The blinds rattle all the way up.', '|Daylight. Actual daylight. It hurts.', 'Hitori|...There\'s a street out there. I forgot there was a street.', '|Down on the pavement somebody in a brown coat is looking up at the window.', '|She blinks, and it\'s a lamppost.'], () => todoTick('blinds')) }, { len: 30, curl: .8 });
};
P2S.bowl = function () {
  if (P2.day == 4) return say3(['Hikari|Mochi\'s bowl.', 'Hikari|...Mochi died two winters ago. Hitori, what have you been feeding?']);
  if (P2.day == 5) return say3(['Hitori|...We should get another cat. Someday.']);
  if (P2.day == 3) return say3(['|The bowl is full. She doesn\'t remember filling it.', 'Hitori|...Mochi? Here, Mochi.']);
  if (P2.day != 2) return say3(['|Mochi\'s bowl. Empty, and a bit dusty.', 'Hitori|...Where is that cat?']);
  if (!todoDone('mochi')) return reachThen([12.1, .1, 10.9], () => { H3.extra.bowlfood.vis = true; P2.d2b.mochiAt = Object.keys(P2.d2b.todo).length; noiseBurst(.4, 2500, .8, .3);
    say3(['|She shakes dry food into the bowl. That sound usually brings Mochi running.', '|It doesn\'t.', 'Hitori|...Mochi? Breakfast.'], () => todoTick('mochi')) }, { len: 34 });
  if (P2.d2b.ev.bowl) return say3(['|The bowl is empty. Licked clean.', 'Hitori|...Good girl. Where are you hiding?', '|There is no cat hair on anything in this house.']);
  say3(['|Still full.']);
};
P2S.mail = function () {
  if (P2.day != 2) return say3(['|A drift of post under the letterbox. Weeks of it.', 'Hitori|Later.']);
  if (todoDone('mail')) return say3(['|Menus. A final notice. The school.', P2.ch.letter ? '|The letter is in her pocket.' : '|And the envelope with her name on it, unopened.']);
  reachThen([9.55, .05, 13.55], () => say3(['|Takeaway menus. Something from the school. A final notice in red.', '|And one envelope with her name written by hand.', '|The handwriting makes her chest hurt, and she doesn\'t know why.'],
    () => choose3(['Open it', 'Put it back'], i => { todoTick('mail');
      if (i) return say3(['Hitori|...Not today.']);
      P2.ch.letter = 1; p2ChSave();
      readThing('paper', ['|"Hitori. I\'m at Aunt Liis\'s. I\'m okay. Don\'t be scared."', '|"I\'m sorry about what I said. I\'m not sorry I left. I couldn\'t keep watching you stop."', '|"When you\'re taking them again, call me. Even at three in the morning. Especially then."', '|It\'s signed with a little heart. No name.', 'Hitori|...Whoever you are.', 'Hitori|I\'m trying. Today I\'m actually trying.'], null, { w: .2, h: .27 }) })), { len: 34 });
};
// her sister's room
P2S.sis = function (id) {
  const d = P2.day, L = {
    uniform: d == 4 ? ['Hikari|My old blazer. She kept it hanging up.'] : d == 5 ? ['Hitori|Her blazer. It\'ll still fit her.'] : ['|A school blazer on a hanger, a size smaller than hers.', '|There\'s a bus pass in the pocket. Somebody has scratched the photo off with a key.', ...(d == 2 ? ['Hitori|...I think that was me. Why would I do that?'] : [])],
    corkboard: d == 4 ? ['Hikari|Our photo-booth pictures.', 'Hikari|...She scratched me out of every one. Oh, Hitori.'] : d == 5 ? ['Hitori|We\'ll take new ones.'] : ['|Ticket stubs, a pressed flower, a strip of photo-booth pictures.', '|Four frames. In every one somebody is pulling a face next to you.', '|In every one, their face is a thumbprint of light.'],
  }[id]; if (L) say3(L);
};
P2S.diary = function () {
  const d = P2.day;
  if (d == 4) return say3(['Hikari|My diary.', P2.ch.diary ? 'Hikari|The ribbon\'s on a different page. She read it.' : 'Hikari|She never opened it.', ...(P2.ch.diary ? ['Hikari|~She read what I wrote about her. And then I wasn\'t here.'] : [])]);
  if (d == 5) return say3(['Hitori|I shouldn\'t have read it. I\'ll tell her I did.']);
  if (P2.ch.diary) return say3(['Hitori|"I\'m going anyway."', 'Hitori|...Yeah. I would have, too.']);
  reachThen([15.92, 3.77, 3.8], () => choose3(['Read it', 'Leave it shut'], i => { if (i) return say3(['Hitori|...It isn\'t mine.']);
    P2.ch.diary = 1; p2ChSave();
    readThing('diary', ['|"3 March. H didn\'t sleep again. She says the walls are talking. I said it\'s the pipes. She looked at me like I was one of them."', '|"9 March. Found her pills in the kitchen bin. Fished them out. She cried and promised. Mom and Dad are away again. It\'s just me."', '|"11 March. Her birthday. She forgot it was her birthday. I\'m keeping the present until she can be happy about it."', '|"20 March. I can\'t be her nurse and her sister and seventeen all at the same time."', '|"21 March. I\'m going to Aunt Liis\'s. I hate myself. I\'m going anyway."', 'Hitori|..."H." That\'s me. I\'m H.', 'Hitori|Somebody wrote all this about me. Somebody who lived in this room.', 'Hitori|...Why can\'t I picture your face?']) }), { len: 30 });
};
P2S.gift = function () {
  const d = P2.day;
  if (d == 4) return say3(['Hikari|Her present. Still wrapped.', 'Hikari|...I was going to give it to her when she was better.']);
  if (d == 5) return say3(['Hitori|She can give it to me herself.']);
  say3(['|A present, wrapped in lilac paper. The tag says: "For H. Happy birthday!! Do NOT open before the 11th."', 'Hitori|...The 11th of what? What month is it?'],
    () => choose3(['Open it', 'Leave it wrapped'], i => { if (i) return say3(['Hitori|It says not to.', 'Hitori|...It\'ll keep.']);
      P2.ch.gift = 1; p2ChSave(); H3.extra.ribbon.vis = true; noiseBurst(.4, 3000, .5, .35);
      say3(['|Inside: a ribbon, exactly the red of the ones she always wears, and a card.', '|"So you match yourself. Love you, idiot."', 'Hitori|...', 'Hitori|I don\'t know who you are, and I miss you so much.']) }));
};
// the looks that change on day 2
const LOOKB = {
  hallmirror: () => todoDone('shower') ? ['Hitori|Still thin. But I washed my hair.', 'Hitori|...That\'s a person. More or less.'] : LOOK1.hallmirror,
  mirror: () => P2.f.steam ? ['|The heart is still there in the steam. A drip runs down from the point of it.', 'Hitori|...I must have done it without thinking.'] : LOOK1.mirror,
  tv: ['|Static. She turns the volume down. A second later it\'s back up.', 'Hitori|...Old TV.'],
  familyphoto: ['|Five people squeezed onto the couch.', '|The fifth face is still a smear of light. But today she can almost see a brown coat.', 'Hitori|...Somebody who wore brown.'],
  games: ['|Two controllers. One has a little heart sticker on it.', 'Hitori|Player two.'],
  landline: ['|Unplugged. She picks it up and listens anyway.', '|Nothing. Of course nothing.'],
  frontdoor: () => P2.d2b && P2.d2b.ev.knock ? ['|She looks through the spyhole. The step is empty.', '|There\'s a wet footprint on the mat. Just the one.', 'Hitori|...Kids. It was kids.'] : ['Hitori|Not today. Tomorrow, maybe.', 'Hitori|...Maybe.'],
  sisroom: ['|The bed is made, with proper corners. Nobody has slept in it for weeks.', 'Hitori|Somebody neat lived here. Somebody who made her bed.'],
  parents: ['|Mom and Dad\'s room. Dust sheets. A postcard on the dresser from somewhere warm.', '|"Back in the spring. Be good, both of you."', 'Hitori|...Both?'],
  ksink: () => {
    if (todoDone('dishes')) return ['|A rack of clean plates. The sink smells of lemon instead of everything else.'];
    P2.cut = { k: 'dishes', t: 0 }; return [];
  },
};
LOOK1.sisroom = ['|Somebody\'s room. The bed is made. There\'s a thin layer of dust on everything.', 'Hitori|...Whose room is this?'];
LOOK3.sisroom = ['Hikari|My room. She didn\'t touch anything.', 'Hikari|...She dusted. There\'s no dust on the desk.'];
CUTS.dishes = function (c) {
  const t = ++c.t, sk = LM(11.63, 6.1, 0), at = [sk[0] - .85, PL3.y + PL3.eye, sk[1]];
  if (t == 1) { c.from = [CAM3.x, CAM3.y, CAM3.z, CAM3.yaw, CAM3.pitch]; P2.f.tapOn = 1 }
  const e = ease3(t / 40), dy = Math.atan2(Math.sin(-HP - c.from[3]), Math.cos(-HP - c.from[3]));
  if (t <= 40) { CAM3.x = c.from[0] + (at[0] - c.from[0]) * e; CAM3.z = c.from[2] + (at[2] - c.from[2]) * e; CAM3.yaw = c.from[3] + dy * e; CAM3.pitch = c.from[4] + (-.5 - c.from[4]) * e; PL3.x = CAM3.x; PL3.z = CAM3.z }
  if (t > 30 && t < 330) { const q = Math.min(1, (t - 30) / 30, (330 - t) / 30), a = t / 9; P2.vmSh = [.24, -.5, .05];   // one hand holds the plate, the other scrubs in circles
    ME.vm = { L: vmArm(-1, [-.11, -.35 + q * .17, -.35], [.3, .1, -1], [.2, -1, .1], .6, [-1, -.6, .4]), R: vmArm(1, [.08 + Math.cos(a) * .04, -.35 + q * .17 + Math.sin(a * 2) * .006, -.35 + Math.sin(a) * .03], [-.3, .1, -1], [0, -1, .1], .5, [1, -.6, .4]) };
    if (t % 34 == 0) noiseBurst(.12, 1800 + Math.random() * 800, 1, .12); CAM3.pitch = -.5 + Math.sin(t / 40) * .02 }
  if (t == 60) say3(['|One plate. Then another. The water goes grey, and then it runs clear.'], null, { dur: 200 });
  if (t == 330) { ME.vm = null; P2.vmSh = null; P2.f.tapOn = 0 }
  if (t == 350) say3(['Hitori|...Okay. That\'s most of them.', 'Hitori|I forgot the kitchen could smell of nothing.'], () => { P2.cut = null; todoTick('dishes') });
};
CUTS.eat2 = function (c) {
  const t = ++c.t; if (t == 1) P2.fadeTo = 1; if (t == 50) { H3.fridge.to = H3.fridge.a = 0; say3(['|Toast. An egg. She eats at the table, sitting down, like a person.'], null, { dur: 190 }) }
  if (t > 60 && t < 230 && t % 37 == 0) noiseBurst(.07, 700 + Math.random() * 400, 1.2, .22);
  if (t == 250) { [PL3.x, PL3.z] = [14.4, 12.0]; PL3.y = 0; CAM3.x = PL3.x; CAM3.z = PL3.z; CAM3.yaw = HP; CAM3.pitch = -.15; P2.fadeTo = 0 }
  if (t == 320) say3(['Hitori|...', 'Hitori|It stayed down.'], () => { P2.cut = null; todoTick('eat') });
};

// ---------------------------------------------------------------- the same things, on day 2 (pills, fridge, bed, phone, looks)
const _pills60 = P2S.pills, _fridge60 = P2S.fridge, _bed60 = P2S.bed, _phone60 = P2S.phone, _look60 = P2S.look;
P2S.pills = function () {
  if (P2.day != 2) return _pills60(); const c = P2.ch;
  if (c.pillB != null) return say3([c.pillB ? '|One less than yesterday.' : '|She looks at the bottle. The bottle looks back.'], () => todoTick('pill'));   // never leave the list stuck
  say3([c.pill1 ? '|The bottle on the nightstand. One gone, twenty-nine to go.' : '|The bottle on the nightstand. The seal is still on.', 'Hitori|"Take your medicine," he said.'],
    () => choose3(['Take one', 'Not today'], i => { c.pillB = i == 0 ? 1 : 0; p2ChSave(); todoTick('pill');
      if (i) return say3(['Hitori|...Tomorrow. I\'ll start tomorrow.'], () => todoTick('pill'));
      P2.cut = { k: 'pill', t: 0, after: () => say3(['|Bitter. She swallows it with water from the bathroom tap.', 'Hitori|There. Done.'], () => todoTick('pill')) } }));
};
P2S.fridge = function () {
  if (P2.day != 2) return _fridge60();
  if (todoDone('eat')) return fridgeOpen(['|Half a loaf. One egg fewer.', 'Hitori|I\'m alright for now.']);
  fridgeOpen(['|Bread. Butter that\'s still okay. Two eggs.', 'Hitori|Toast. I can keep toast down.'], () => { P2.cut = { k: 'eat2', t: 0 } }, true);
};
P2S.bed = function () {
  if (P2.day != 2) return _bed60();
  if (!P2.d2b.ready) return say3(['Hitori|Not yet. I said a normal day.', 'Hitori|Normal people do things first.']);
  P2.cut = { k: 'sleep', t: 0, next: 'subway' }; P2.hideBody = 1;
  say3(['Hitori|One normal day.', 'Hitori|...I did it. I actually did it.', 'Hitori|Please. No cards tonight.']);
};
P2S.look = function (id) {
  if (P2.day == 2 && LOOKB[id]) { const L = LOOKB[id]; return say3(typeof L == 'function' ? L() : L) }
  return _look60(id);
};
// the phone: on day 2 it works, and nobody is there; on day 3 it won't stop
const CALLSB = {
  Caroline: [['x', 'Hi, this is Caroline! I can\'t pick up right now, so leave me something nice.'], ['h', '...Hi. It\'s me. I had a shower today.'], ['h', 'That\'s it. That\'s the message. Sorry.']],
  Steven: [['x', 'The person you are calling is not accepting calls from this number.'], ['h', '...Yeah. Fair.']],
  Uku: [['x', 'It rings eleven times, and then it stops ringing.']],
  Mom: [['x', 'The mailbox of the person you are calling is full.'], ['h', 'Mom. Pick up. Please pick up.']],
  '♡': [['x', 'The number you have dialled is no longer in service.'], ['h', '...Somebody had this number. Somebody I gave a heart to.']],
};
const _callScript60 = p2CallScript;
p2CallScript = function (sis, n) { return P2.day == 2 && !sis ? (CALLSB[n] || []) : _callScript60(sis, n) };
P2S.phone = function () {
  if (P2.day == 2) { H3.extra.phone.vis = false; P2.ui = { k: 'phone', mode: 'contacts', sel: 0, t: 0, who: 'h', lift: 0 }; p2Unlock(); SFX3.click();
    if (!P2.f.phone2) { P2.f.phone2 = 1; say3(['|One new message.', 'Hitori|...From Mom.']) } return }
  if (P2.day == 3) return p2Day3Phone();
  return _phone60();
};
function p2Day3Phone() {
  const c = P2.ch; if (c.called) return say3(['|No new calls.']);
  say3(['|Her phone is buzzing itself across the nightstand. 37 missed calls, all from one number. No name.', 'Hitori|...Who keeps calling me?'],
    () => choose3(['Call it back', 'Throw it'], i => { H3.extra.phone.vis = false; p2Unlock();
      if (i == 0) { c.called = 1; c.kept = 1; p2ChSave(); P2.ui = { k: 'phone', mode: 'call', c: { n: 'Unknown', k: -3 }, ct: 0, sel: 0, t: 0, lift: 0, connected: 0, ended: 0, who: 'h' }; SFX3.click() }
      else { c.broke = 1; c.called = 1; p2ChSave(); P2.ui = { k: 'phone', mode: 'throw', th: 0, sel: 0, t: 0, lift: 1, who: 'h' } } }));
}

// ---------------------------------------------------------------- the computer: the group chat
APPS.chat = { n: 'Chat', i: 'chat', w: 330, h: 262 };
APPDRAW.chat = function (u, w, x, y, ww, hh) {
  R2(x, y, ww, hh, '#1b1d24'); R2(x, y, ww, 22, '#23262f'); T2('day trip crew', x + 10, y + 5, '#fff', 10, 600); T2('4 members', x + ww - 10, y + 7, '#888', 8, 400, 'right');
  const L = [['Caroline', 'PHOTO!!! best day ever', '#e8a0b0'], ['Uku', 'five on a seat for three lol', '#e0a060'], ['♡', 'my legs are still dead', '#e8a8b8'], ['Hitori', 'worth it', '#9ab0e0'], [null, '3 weeks ago'],
    ['Hitori', 'i know youre all listening', '#9ab0e0', '03:02'], ['Hitori', 'which one of you took her', '#9ab0e0', '03:04'], ['Hitori', 'ANSWER ME', '#9ab0e0', '03:11'], ['Steven', 'Hitori. Stop.', '#a0c8a0', '03:12'], ['Caroline', 'please go to sleep. please', '#e8a0b0', '03:12'], ['Hitori', 'ILL COME OVER THERE', '#9ab0e0', '03:15'],
    [null, 'Steven removed Hitori from the group'], [null, '♡ left the group']];
  let yy = y + 30; for (const [n, t, c, tm] of L) { if (!n) { T2(t, x + ww / 2, yy + 1, '#777', 7.5, 400, 'center'); yy += 14; continue } T2(n, x + 10, yy, c, 8, 600); if (tm) T2(tm, x + ww - 10, yy, '#666', 7, 400, 'right'); T2(t, x + 62, yy, '#ddd', 8.5); yy += 15 }
  RR(x + 8, y + hh - 24, ww - 16, 17, 4, '#15161b', '#2c2f38'); T2('You can\'t send messages to this group.', x + 16, y + hh - 20, '#666', 8);
  if (!u.said.chat) { u.said.chat = 1; say3(['Hitori|..."Which one of you took her."', 'Hitori|Took who? Who did I think they took?', 'Hitori|There was a fifth person in this chat. With a heart for a name.']) }
};
