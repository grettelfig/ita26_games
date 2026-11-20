// ==================== PART TWO: choices, what they change, and the second ending ====================
// The choices (kept in P2.ch, through the days and in saves):
//   day 1  pill1   take a pill from the bottle on the nightstand, or put it back
//   day 1  mail    send the draft "please come home" from her computer (it waits in the outbox), or delete it
//   day 1  kept    after the messages: throw the phone, or put it down (then it's still on her desk on day 2)
//   day 2  pill2   take one anyway, with "them" watching
//   day 2  reach2  call back the number that keeps calling (her voicemail), or speak into the unplugged landline
//   day 2  tapoff  turn off the kitchen tap that's running by itself
// And from the dream (Part One): reassure Caroline by the fire, say sorry to Steven, let Uku go at the observatory.
// Each choice changes lines later on (on day 2, in her sister's last scene, in her friends' calls). The ones that reach
// out (pills, the email, keeping the phone, calling back, letting go in the dream) count: with three or more, when the
// house goes quiet at the end of day 2 a phone rings. Answer it, and the story ends a different way.

// ---------------------------------------------------------------- day 1 and day 2: the pills
const _pills55 = P2S.pills;
P2S.pills = function () {
  const c = P2.ch;
  if (P2.day == 5) return say3(['Hitori|One today.', '|She takes it with a glass of water this time. It\'s still bitter.']);
  if (P2.day == 4) { const n = (c.pill1 ? 1 : 0) + (c.pill2 ? 1 : 0) + (c.pillB ? 1 : 0); if (!n) return _pills55(); const w = ['', 'One', 'Two', 'Three'][n];
    return say3(['Hikari|Her pills.', '|' + w + ' missing. ' + w + ', out of thirty.', 'Hikari|...You were trying.', 'Hikari|~You were trying, and I wasn\'t here.']) }
  if (P2.day == 3) { if (c.pill2 != null) return say3([c.pill2 ? '|One less than this morning.' : '|She won\'t touch it.']);
    return say3([c.pill1 ? '|One missing. The one she took yesterday.' : '|The bottle is still full.', 'Hitori|He said I should take them.', 'Hitori|...Not right now. I feel like someone\'s watching.'],
      () => choose3(['Take one anyway', 'Put it back'], i => { c.pill2 = i == 0 ? 1 : 0; p2ChSave();
        say3(i == 0 ? ['Hitori|...Fine. One.', '|She swallows it dry. Her hands are shaking a little.'] : ['Hitori|Later. I\'ll take it later.']) })) }
  if (P2.f.pills) return say3([c.pill1 ? '|One missing now.' : '|Still full.']);
  P2.f.pills = 1;
  say3(['|A bottle of pills on the nightstand. Her name is on the label. Take one tablet daily.', '|The seal has never been broken.', 'Hitori|...I\'m supposed to be taking these. I think.', 'Hitori|I don\'t remember the last time I did.'],
    () => choose3(['Take one', 'Put them back'], i => { c.pill1 = i == 0 ? 1 : 0; p2ChSave();
      say3(i == 0 ? ['|She breaks the seal and takes one. It\'s bitter.', 'Hitori|...Okay. One. That\'s something.'] : ['Hitori|...Later.']) }));
};

// ---------------------------------------------------------------- day 1: after the messages, throw the phone or put it down
function p2ThrowChoice(u) {   // (the phone isn't thrown on day 1 any more: that's day 3, js/p2_day2.js. P2.f.thrown now just means "done with the phone today")
  P2.f.thrown = 1; u.mode = 'contacts';
  say3(['Hitori|...', 'Hitori|I can\'t look at this.', '|She puts the phone face down on the nightstand, and her hand won\'t stop shaking.', 'Hitori|I need to eat something. I can\'t think.'], () => { u.closing = 1; P2.objective = 'Eat something.' });
}
const _phone55 = P2S.phone;
P2S.phone = function () {
  if (P2.day == 5) return say3(['Hitori|Fully charged. For once.']);
  if (P2.day == 4) return say3(['|Her phone, face down on the desk. The lock screen says 37 missed calls.', 'Hikari|...They\'re all from me.']);
  if (P2.day == 1 && P2.f.thrown) return say3(['Hitori|...Not right now. I can\'t look at it right now.']);
  return _phone55();
};
// day 2, if she kept it: the number that keeps calling
function p2MissedCalls() {
  if (P2.ch.called) return say3(['|No new calls.']);
  say3(['|Her phone, face down on the desk. 37 missed calls, all from one number. No name.', 'Hitori|...Who keeps calling me?'],
    () => choose3(['Call it back', 'Leave it'], i => { if (i) return; P2.ch.called = 1; p2ChSave(); H3.extra.phone.vis = false;
      P2.ui = { k: 'phone', mode: 'call', c: { n: 'Unknown', k: -3 }, ct: 0, sel: 0, t: 0, lift: 0, connected: 0, ended: 0, who: 'h' }; p2Unlock(); SFX3.click() }));
}
function p2VoicemailCall(u) {
  const ph = { voice: 'friend', phone: true, f0: 225 };
  say3(['Hikari|Hey, it\'s me. I can\'t get to the phone right now.', 'Hikari|...If this is you, Hitori, please, please leave a message. I\'ll call back. I promise.'], null, ph);
  say3(['|Beep.'], () => choose3(['"I\'m sorry. Please come home."', 'Hang up'], i => {
    if (i == 0) { P2.ch.reach2 = 'voicemail'; p2ChSave(); say3(['Hitori|...Hi. It\'s me.', 'Hitori|I don\'t know who you are. That\'s the worst part. I know I should.', 'Hitori|I\'m sorry. For whatever I did. Please come home.'], () => { SFX3.hangup(); u.ended = u.ct }) }
    else { SFX3.hangup(); u.ended = u.ct } }));
}

// ---------------------------------------------------------------- what she sees, by day (new lines, and lines that remember)
Object.assign(LOOK2, {
  stickies: ['|Sticky notes, all the way round the mirror. Her handwriting, smaller and smaller.', '|"DON\'T LOOK."  "they can hear you."  "it\'s not you in there."  "it IS you in there."', 'Hitori|...That\'s my handwriting. I don\'t remember writing them.'],
  d2chair: ['|A chair, jammed under the front door handle.', 'Hitori|Nobody comes in. Nobody.'],
  landline: () => {
    if (P2.ch.landline) return ['|Quiet now. Just an unplugged phone.'];
    say3(['|The unplugged phone is ringing.', '|When you lift it, there is only breathing. Slow. Patient. Very far away.'], () => choose3(['Say something', 'Hang up'], i => { P2.ch.landline = 1;
      if (i == 0) { if (!P2.ch.reach2) P2.ch.reach2 = 'landline'; p2ChSave(); say3(['Hitori|...Hello?', 'Hitori|If you\'re who I think you are. The one I keep forgetting.', 'Hitori|I\'m sorry. Whatever I did. Please come home.', '|The breathing stops. For a second you hear a train, a long way off.', '|Then the line is dead.']) }
      else { p2ChSave(); say3(['|She puts it down. The breathing goes on in the receiver, very small.']) } }));
    return [];
  },
  ksink: () => {
    if (P2.ch.tapoff != null) return [P2.ch.tapoff ? '|Off. It stays off.' : '|Still running.'];
    say3(['|The tap is dripping.'], () => choose3(['Turn it off', 'Leave it'], i => { P2.ch.tapoff = i == 0 ? 1 : 0; p2ChSave();
      say3(i == 0 ? ['|She turns it off. Her hand comes away wet and very cold.', 'Hitori|...There. Off.'] : ['Hitori|...I\'ll deal with it later.']) }));
    return [];
  },
});
Object.assign(LOOK3, {
  stickies: ['Hikari|"they can hear you."', 'Hikari|...Oh, Hitori. Nobody was listening. That was the whole problem.'],
  ksink: () => P2.ch.tapoff ? ['Hikari|Oh god, what is that smell.', 'Hikari|Hitori, are you sick?'] : ['|The tap is still running. The sink overflowed a long time ago. The floor is wet.', 'Hikari|...Hitori?'],
  landline: () => P2.ch.reach2 == 'landline' ? ['Hikari|Unplugged.', 'Hikari|...Two nights ago I called the house from the train. Somebody picked up and said sorry.', 'Hikari|~I hung up. I thought I\'d got the wrong number.'] : ['Hikari|Unplugged.'],
});
// the morning after (the second ending): the house is the same, she isn't
const LOOK4 = {
  familyphoto: ['|Five people squeezed onto the couch.', 'Hitori|...Hikari\'s the blur on the end. She always moved when the flash went.'],
  books: ['Hitori|Her name\'s scratched out of hers. She did that the night she left.', 'Hitori|...I\'ll buy her a new one.'],
  sisroom: ['Hitori|Hikari\'s room. I\'ll open the window. It\'s been shut for weeks.'], sisbox: ['Hitori|Her things. She can unpack them herself. I\'ll help.'],
  games: ['Hitori|Player two. ...Tonight, maybe.'], parents: ['Hitori|Still away. I should call them too. After.'], tv: ['Hitori|Still nothing on. That\'s fine.'],
  hallmirror: ['Hitori|I still look like shit.', 'Hitori|...But it\'s me.'], mirror: ['Hitori|...Hi.'], landline: ['Hitori|Unplugged. It always was.'],
  ksink: () => P2.ch.tapoff ? ['Hitori|Dishes. A lot of them. We can do them together.'] : ['|The tap is still running.', 'Hitori|...I\'ll turn it off. Now.'],
  backdoor: ['Hitori|Maybe later we\'ll go outside. Maybe.'], frontdoor: ['Hitori|She\'ll come in through there.'], brokenphone: ['Hitori|...I\'ll get a new one.'],
  stickies: ['Hitori|...I\'ll take them down. Later. With her.'],
};
P2S.look = function (id) {
  const L = (P2.day == 3 ? LOOK2[id] : P2.day == 4 ? LOOK3[id] : P2.day == 5 ? LOOK4[id] : null) || LOOK1[id]; if (!L) return;
  say3(typeof L == 'function' ? L() : L);
};
const _computer55 = P2S.computer, _fridge55 = P2S.fridge, _pol55 = P2S.polaroids, _bed55 = P2S.bed;
P2S.computer = function () {
  if (P2.day == 5) return say3(['Hitori|Not now. She\'s almost here.']);
  if (P2.day == 4 && P2.ch.mail == 1) return say3(['Hikari|Her computer\'s still on.', '|An email, stuck in the outbox. To: ♡. Subject: please come home.', 'Hikari|...It\'s to me.', 'Hikari|~It never sent. It was sitting here the whole time.']);
  return _computer55();
};
P2S.fridge = function () { if (P2.day == 5) return fridgeOpen(['|Still almost empty.', 'Hitori|We\'ll go shopping. Together. Outside, even.']); return _fridge55() };
P2S.polaroids = function () { if (P2.day == 5) return say3(['Hitori|The one with her face scribbled out.', 'Hitori|...I know who that is now.']); return _pol55() };
P2S.bed = function () { if (P2.day == 5) return say3(['Hitori|No more sleeping. She\'s almost here.']); return _bed55() };

// ---------------------------------------------------------------- her friends' calls remember the dream
function p2CallScript(sis, n) {
  const p = p1Ch(), s = ((sis ? CALLS3 : CALLS)[n] || []).slice(), at = (i, l) => s.splice(i, 0, ...l);
  if (!sis) {
    if (n == 'Caroline' && p.reassure) at(s.length - 1, [['f', '...I dreamt about you last night. We were in the woods and you told me he always turns up.'], ['f', 'You sounded like you again.']]);
    if (n == 'Steven' && p.sorry) at(s.length - 1, [['f', 'Weird thing. I had a dream where you said sorry to me. Some city full of lights.'], ['f', 'That\'s the only reason I picked up.']]);
    if (n == 'Uku' && p.letgo) at(s.length - 1, [['f', '...I had this dream. You found my hoodie and told me I could go.'], ['f', 'Felt like goodbye, man.']]);
  } else {
    if (n == 'Steven' && p.sorry) at(s.length, [['f', 'She called me last week. Just to say sorry. I let it ring.']]);
    if (n == 'Caroline' && p.reassure) at(s.length, [['f', 'I dreamt about her, you know. She told me someone always turns up.']]);
    if (n == 'Uku' && p.letgo) at(s.length, [['f', 'I dreamt she let me go. Like she was the one saying goodbye.']]);
  }
  return s;
}
// her sister, at the end (the first ending), finding out what she missed
function p2SisterRegrets() {
  const c = P2.ch, L = [];
  if (c.reach2 == 'voicemail') L.push('Hikari|...She left me a voicemail. Two nights ago.', 'Hikari|I didn\'t listen to it. I was on the train. I thought I had time.');
  if (c.reach2 == 'landline') L.push('Hikari|When I called the house, somebody picked up and said sorry.', 'Hikari|~It was her. Of course it was her.');
  if (c.mail == 1) L.push('Hikari|There\'s an email in her outbox. "please come home." It never sent.');
  if (c.letter) L.push('Hikari|My letter. It\'s open. She read it.');
  if (c.curtains) L.push('Hikari|She opened her blinds. She never opens her blinds.');
  if (c.pill1 || c.pill2 || c.pillB) L.push('Hikari|She was trying. With the pills. She was trying.');
  return L;
}

// ---------------------------------------------------------------- the second ending: somebody calls, and she answers
function p2FinalCall(c) {
  const kept = !P2.ch.broke, M = H3.extra.phone.M, ll = H3.inter.find(i => i.id == 'landline'), pos = kept && M ? [M[12], M[13] + .05, M[14]] : ll ? bc(ll.box) : [CAM3.x, CAM3.y, CAM3.z];
  SFXN.ringAt(pos, kept ? 'phone' : 'bell');
  say3(['|...', '|Somewhere in the house, a phone is ringing.', kept ? 'Hitori|...My phone.' : 'Hitori|...The landline. It isn\'t even plugged in.'],
    () => choose3(['Answer it', 'Let it ring'], i => {
      if (i == 0) P2.cut = { k: 'goodcall', t: 0 };
      else { SFXN.ringStop(); c.hold = 0; say3(['Hitori|...', 'Hitori|Let it ring.']) } }));
}
function goodCallCut(c) {
  const t = ++c.t;
  if (t == 1) {
    SFXN.ringStop(); SFX3.click(); CAM3.shake = 0; ME.vm = null; P2.fadeTo = .6; const ch = P2.ch, ph = { voice: 'friend', phone: true, f0: 225 };
    const K = a => say3(a.map(x => 'Hikari|' + x), null, ph), T = a => say3(a.map(x => 'Hitori|' + x));
    K(['...Hitori? It\'s me. Can you hear me?']); T(['...Who is this?']); K(['It\'s me. I\'m on the night train. I\'ll be home in the morning.']);
    if (ch.mail == 1) K(['I got your email. "please come home." That\'s all it said. It was enough.']);
    if (ch.reach2 == 'voicemail') K(['I got your voicemail. I\'ve listened to it about twenty times.']);
    if (ch.reach2 == 'landline') K(['I called the house last night. Somebody picked up and said sorry. That was you, wasn\'t it?']);
    if (ch.kept) K(['And you called back. I\'ve been calling and calling.']);
    if (ch.letter) K(['You read my letter, didn\'t you. You sound like you again.']);
    T(['I can\'t... I can\'t remember your name. I\'m sorry. I know I should.']); K(['That\'s okay. That\'s okay.']);
    P2.subs.push({ cb: () => { P2.sisName = SISTER } });
    K(['It\'s Hikari.']); T(['...Hikari.', '~Hikari. Hikari. I\'m sorry. I\'m so sorry.']); K(['I know. Me too. I shouldn\'t have left like that.']);
    if (ch.pill1 || ch.pill2 || ch.pillB) { T(['I took one of my pills. It\'s not much.']); K(['It\'s something. It\'s a lot.']) }
    K(['Stay on the line with me? Until you fall asleep?']); T(['...Okay.']);
    P2.subs.push({ cb: () => { c.done = t + 1; c.at = 0 } });
  }
  if (c.done) { c.at++; if (c.at == 60) P2.fadeTo = 1; if (c.at == 200) { P2.cut = null; P2.silent = 0; P2.ui = { k: 'card', t: 0, text: 'The next morning.', next: () => p2Stage('home') } } }
}
function p2Home() {
  P2.stage = 'home'; ST2s('stage', 'home'); P2.ui = null; P2.cut = null; P2.subs = []; P2.choice = null; ME.vm = null; P2.vmExtra = null; P2.pose = null; P2.seated = 0; P2.wantLock = true; P2.silent = 0;
  P2.day = 5; P2.font = FONT; P2.name = 'Hitori'; P2.scene = 'house'; P2.f = { thrown: 1, vomited: 1, history: 1, polaroids: 1, pills: 1 }; P2.lights = {}; P2.npc = null; P2.sisName = SISTER;
  resetHouse(); for (const e of EYES) e.born = 1e9; p2HouseForDay();
  H3.extra.phonebroken.vis = !!P2.ch.broke; H3.extra.phone.vis = !P2.ch.broke;
  AMB3.start(false); P2.amb = { foot: 0, whisper: 0 };
  [PL3.x, PL3.z] = LM(10.15, 8.85, 3); PL3.y = 3; CAM3.yaw = -Math.PI / 2; CAM3.pitch = 0; CAM3.roll = 0; P2.blink = 1; P2.hideBody = 1; P2.fade = 1; P2.fadeTo = 0; P2.cut = { k: 'wake', t: 0 };
  say3(['|Morning. Real morning. There\'s sunlight on the ceiling.', 'Hitori|...I slept.', 'Hitori|No man with cards. No dreams at all.', 'Hitori|She said the morning train.'], () => { P2.cut = null; P2.hideBody = 0; P2.objective = 'Wait for Hikari downstairs.' });
}
// downstairs: the front door opens and her sister walks in
function reunionCut(c) {
  const t = ++c.t, fdI = H3.inter.find(i => i.id == 'frontdoor'), fd = fdI ? bc(fdI.box) : [8, 0, HOUSE_D], door = [fd[0], 1, HOUSE_D - .2];
  if (t == 1) { SFXN.doorOpen(door); P2.npc = { x: fd[0], y: 0, z: HOUSE_D - .55, yaw: 0, sit: 0, walk: 0, walkAmt: 0, t: 0, look: [0, 0] }; P2.objective = '' }
  if (t == 55) SFXN.doorClose(door, .35);
  const N = P2.npc; N.t++; const dx = PL3.x - N.x, dz = PL3.z - N.z, d = Math.hypot(dx, dz) || 1; N.yaw = Math.atan2(-dx, -dz);
  const stopAt = c.hug ? .5 : 1.4;
  if (t > 60 && d > stopAt) { const sp = (c.hug ? .6 : 1.05) / 60; N.x += dx / d * sp; N.z += dz / d * sp; N.walk += .15; N.walkAmt = 1 } else N.walkAmt = 0;
  const yawT = Math.atan2(-(N.x - CAM3.x), -(N.z - CAM3.z)), pitchT = Math.atan2(1.42 - CAM3.y, d);
  CAM3.yaw += Math.atan2(Math.sin(yawT - CAM3.yaw), Math.cos(yawT - CAM3.yaw)) * .06; CAM3.pitch += (pitchT - CAM3.pitch) * .06;
  if (t == 150) {
    const ch = P2.ch, p = p1Ch(), L = [];
    L.push('Hikari|...Hi.', 'Hitori|...Hi.', 'Hikari|You look awful.', 'Hitori|You too.');
    if (p.reassure || p.sorry || p.letgo) L.push('Hikari|I had the strangest dream on the train. You and Steven and Caroline, walking through a forest. You were looking for someone.', 'Hitori|...Uku. We were looking for Uku.', 'Hitori|I think it was you. I think it was always you.');
    else L.push('Hikari|I\'m sorry I left like that. I was so angry. I didn\'t think about what it would do to you.', 'Hitori|I don\'t remember most of the last few weeks. I\'m scared of what I did.');
    L.push('Hikari|We\'ll find out together. Okay?');
    if (ch.pill1 || ch.pill2 || ch.pillB) L.push('Hitori|I took my pills. I\'m going to keep taking them. You can nag me.', 'Hikari|Oh, I\'m going to be SO annoying about it.');
    L.push('Hitori|I want to call them. Steven, Caroline, Uku. To say sorry. Even if they don\'t pick up.', 'Hikari|Then we\'ll call. And if they don\'t pick up, we\'ll keep trying.', 'Hitori|...Hikari.', 'Hikari|Yeah?', 'Hitori|Nothing. I just wanted to say it.', '|Her sister steps in and holds on, and doesn\'t let go for a long time.');
    say3(L, () => { c.hug = t; c.hugAt = c.t });
  }
  if (c.hugAt) { const k = c.t - c.hugAt; P2.white = clamp((k - 40) / 120, 0, 1);
    if (k == 230) { P2.cut = null; P2.npc = null; P2.white = 0; P2.fade = 1; P2.ui = { k: 'end', t: 0, sub: 'still here' }; ST2s('stage', 'day1'); ST.set('syn_part2', 1); ST.set('syn_p2_good', 1) } }
}
CUTS.goodcall = goodCallCut; CUTS.reunion = reunionCut;
const _ambTick55 = p2AmbTick;
p2AmbTick = function () {
  _ambTick55();
  if (P2.day == 5 && !P2.cut && !P2.ui && !P2.f.reunion && PL3.y < 1.5) { const rm = roomAt(PL3.x, PL3.z, 0); if (rm == 'hall' || rm == 'corridor' || rm == 'living' || rm == 'kitchen') { P2.f.reunion = 1; P2.cut = { k: 'reunion', t: 0 } } }
};
// the white the hug fades into
const _xscP2_55 = XSC.p2;
XSC.p2 = function () { _xscP2_55(); if (P2.white > 0) { sU(); X.globalAlpha = clamp(P2.white, 0, 1); r(0, 0, W, H, '#f4f0ea'); X.globalAlpha = 1 } };

// ---------------------------------------------------------------- the phone rings (her phone on the desk, or the dead landline)
SFXN.ringAt = function (pos, kind) {
  if (!sndBoot()) return; SFXN.ringStop(); const s = sSpot(pos, 18), g = sG(opt.s / 10 * .9); g.connect(s.in);
  const notes = [659.3, 784, 1046.5, 784, 880, 1046.5]; let next = AC.currentTime + .05, i = 0;
  SND.ringTimer = setInterval(() => { sPlace(s); while (next < AC.currentTime + .25) {
    if (kind == 'phone') { const k = i % 8; if (k == 0) { sBuzz(next, .42, 1, g); sBuzz(next + .65, .42, 1, g) } if (k < 6) sMarimba(next, notes[k], .22, g); next += k == 5 ? .9 : .17 }
    else { for (let j = 0; j < 20; j++) sTone('sine', j % 2 ? 1320 : 1050, j % 2 ? 1320 : 1050, next + j * .05, .002, .045, .12, g); next += 3 }
    i++ } }, 40);
  SND.ringSpot = s;
};
SFXN.ringStop = function () { clearInterval(SND.ringTimer); SND.ringTimer = 0; const s = SND.ringSpot; SND.ringSpot = null; if (s && AC) { s.g.gain.setTargetAtTime(0, AC.currentTime, .05); setTimeout(() => { try { s.g.disconnect() } catch (e) {} }, 500) } };

// ---------------------------------------------------------------- the phone: a Messages tab next to Contacts
const THREADS = [
  { n: '♡', m: [['t', 'i\'m not mad at you. i just need to go for a while.', '6 weeks ago'], ['t', 'please keep taking your meds. promise me.'], ['t', 'i\'ll call when i\'m settled'], ['t', 'hitori?'], ['t', 'please answer'], ['t', 'ok. i love you. i\'ll come back. i promise.'], ['m', 'who is this', '2 weeks ago']] },
  { n: 'Mom', m: [['t', 'Dad and I are staying another month. Money is in the kitchen drawer. EAT PROPERLY!!', '5 weeks ago'], ['t', 'Is your sister answering you? She isn\'t answering us.'], ['t', 'Hitori?']] },
  { n: 'Caroline', m: [['t', 'movie night saturday??', '2 months ago'], ['m', 'yes!!!'], ['t', 'hitori are you ok. you sounded really weird on the phone', '3 weeks ago'], ['t', 'please call me back'], ['t', 'i\'m scared of you right now. i\'m sorry. i need a break']] },
];
// the phone's notes, and the messages as they stand today (a new one from Mom on day 2; on day 3 the heart writes back)
const NOTESP = [
  { n: 'groceries', m: [['n', 'rice'], ['n', 'eggs'], ['n', 'bread'], ['n', 'cat food'], ['n', 'the nice biscuits (hers)']] },
  { n: 'say sorry', m: [['n', 'steven: the window. pay for it'], ['n', 'caroline: i dont think you took anyone'], ['n', 'uku: the glass'], ['n', 'dont call at night. DONT call at night']], say: ['Hitori|I wrote a list of apologies. And then I didn\'t make any of them.'] },
  { n: 'dr kask', m: [['n', 'appt 2 feb (missed)'], ['n', 'appt 16 feb (missed)'], ['n', '"one tablet, every morning, with food"'], ['n', '"if the voices come back, tell someone the same day"']] },
  { n: 'names', m: [['n', 'mom'], ['n', 'dad'], ['n', 'steven'], ['n', 'caroline'], ['n', 'uku'], ['n', 'mochi'], ['n', '_ _ _ _ _ _']], say: ['Hitori|Seven names. I wrote them down so I wouldn\'t lose them.', 'Hitori|...I lost one anyway.'] },
];
function p2Threads() {
  if (P2.day != 2 && P2.day != 3) return THREADS; const T = THREADS.map(t => ({ n: t.n, m: t.m.slice() }));
  T[1].m.push(['t', 'Is your sister home yet? Tell her to call me.', 'today']);
  if (P2.day == 3) T[0].m.push(['t', 'i can see your light on', 'now'], ['t', 'look out of the window']);   // (her number is out of service)
  return T;
}
const phoneTabList = u => u.tab == 'notes' ? NOTESP : p2Threads();
function p2TabsUpdate(u, m) {   // returns true while the Messages tab is showing (it handles its own input)
  const hitTab = P2MOUSE.click && m[1] > 7 && m[1] < 19;
  const TABS = ['contacts', 'msgs', 'notes'], ti = Math.max(0, TABS.indexOf(u.tab));
  if (lf() || rt() || hitTab) { u.tab = hitTab ? TABS[m[0] < 21 ? 0 : m[0] < 41 ? 1 : 2] : TABS[(ti + (rt() ? 1 : 2)) % 3]; u.sel = 0; SFX3.click() }
  if (u.tab != 'msgs' && u.tab != 'notes') return false;
  const LIST = phoneTabList(u), n = LIST.length; if (up()) u.sel = (u.sel + n - 1) % n; if (dn()) u.sel = (u.sel + 1) % n;
  let clicked = -1; LIST.forEach((c, i) => { const y = 24 + i * 19; if (m[0] > 2 && m[0] < 58 && m[1] > y - 2 && m[1] < y + 17) { if (P2MOUSE.moved) u.sel = i; if (P2MOUSE.click && !hitTab) clicked = i } });
  if ((ok() || clicked >= 0) && !subsBusy() && u.lift >= 1) { if (clicked >= 0) u.sel = clicked; u.mode = 'thread'; u.thr = u.sel; SFX3.click();
    if (u.tab == 'notes' && LIST[u.thr].say && !P2.f['note' + u.thr]) { P2.f['note' + u.thr] = 1; say3(LIST[u.thr].say) }
    if (u.tab == 'msgs' && u.thr == 0 && !P2.f.sawThread) { P2.f.sawThread = 1; say3(['Hitori|"i\'ll come back. i promise."', 'Hitori|...And I answered "who is this".', 'Hitori|...Who is this? Why don\'t I know?']) } }
  if ((esc() || hit.KeyX || (P2MOUSE.click && m[1] > 116 && m[1] < 131)) && !P2.f.texting && u.lift >= 1) { u.closing = 1; SFX3.click() }
  return true;
}
function p2ThreadUpdate(u, m) { if (esc() || hit.KeyX || ok() || (P2MOUSE.click && m[1] > 116)) { u.mode = 'contacts'; SFX3.click() } }
function p2DrawTabs(u, m) { const TABS = [['contacts', 'Calls', 4], ['msgs', 'Msgs', 23], ['notes', 'Notes', 41]], cur = TABS.find(t => t[0] == u.tab) || TABS[0]; TABS.forEach(([k, n, x]) => phTxt(n, x, 10.5, k == cur[0] ? '#fff' : '#777', 5.6)); phR(cur[2], 18, 14, .8, '#fff'); return; const on = u.tab == 'msgs'; phTxt('Contacts', 4, 10.5, on ? '#777' : '#fff', 6); phTxt('Messages', 33, 10.5, on ? '#fff' : '#777', 6); phR(on ? 33 : 4, 18, on ? 24 : 25, .8, '#fff') }
function p2DrawThreads(u, m) {
  phoneTabList(u).forEach((c, i) => { const y = 24 + i * 19, on = u.sel == i, hov = m[0] > 2 && m[0] < 58 && m[1] > y - 2 && m[1] < y + 17; if (on || hov) phRR(2, y - 2, PH.w - 4, 18, 3, on ? '#26262f' : '#1a1a22');
    phAvatar(10, y + 7, 6, null); phT(); X.imageSmoothingEnabled = false; phTxt(c.n, 20, y + 2, c.n == '♡' ? '#e8a8b8' : '#eee', 6);
    const last = c.m[c.m.length - 1][1]; phTxt(last.length > 18 ? last.slice(0, 17) + '…' : last, 20, y + 9.5, '#888', 3.6) });
}
function p2DrawThread(u, m) {
  const c = phoneTabList(u)[u.thr || 0], W2 = PH.w, H2 = PH.h; phR(0, 9, W2, 10, '#16161c'); phTxt('‹', 4, 9.5, '#aaa', 7); phT(); phTxt(c.n, W2 / 2, 10.5, c.n == '♡' ? '#e8a8b8' : '#fff', 6, 'center');
  const B = []; for (const [w, s, when] of c.m) { const lines = pwrapLocal(s, 34, 4.2); B.push({ w, lines, when, h: 4 + lines.length * 5 + (when ? 6 : 0) }) }
  const total = B.reduce((a, b) => a + b.h + 2, 0); let y = 22 + Math.min(0, (H2 - 40) - total);
  X.save(); phT(); X.beginPath(); X.rect(0, 20, W2, H2 - 38); X.clip();
  for (const b of B) { if (b.when) { phTxt(b.when, W2 / 2, y, '#666', 3.4, 'center'); y += 6 } const bw = Math.max(...b.lines.map(l => l.length * 2.1)) + 6, bx = b.w == 'm' ? W2 - 4 - Math.min(40, bw) : 4;
    phRR(bx, y, Math.min(40, bw), 3 + b.lines.length * 5, 2.5, b.w == 'm' ? '#2a5aa8' : b.w == 'n' ? '#4a4630' : '#2c2c38'); b.lines.forEach((l, k) => phTxt(l, bx + 3, y + 1.5 + k * 5, '#eee', 4.2)); y += b.h - (b.when ? 6 : 0) + 2 }
  X.restore(); const hv = m[1] > 116; phRR(W2 / 2 - 12, H2 - 14, 24, 9, 4, hv ? '#3a3a46' : '#24242c'); phTxt('back', W2 / 2, H2 - 12.2, '#aaa', 4.2, 'center');
}
