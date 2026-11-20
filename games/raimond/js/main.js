// ==================== MAIN LOOP ====================
function loop() {
  tick++; sU(); X.fillStyle = '#000'; X.fillRect(0, 0, W, H);
  try {
    let want = 'menu';
    if (sc == 'world') { worldUpdate(); if (sc == 'world') drawWorld(); if (shake > 0) shake--; if (S) want = trackFor() }
    else if (sc == 'battle') { battleUpdate(); if (sc == 'battle') drawBattle(); want = trackFor() }
    else if (sc == 'mini') { miniUpdate(); if (sc == 'mini') miniDraw(); want = 'scary' }
    else if (sc == 'daycard') { dayUpdate(); if (sc == 'daycard') dayDraw(); want = 'menu' }
    else if (sc == 'xmenu') { xmenuUpdateDraw(); want = trackFor() }
    else if (sc == 'pol') { polaroid(); want = trackFor() }
    else if (sc == 'shop') { shopUD(); want = trackFor() }
    else if (sc == 'slots') { slotsUpdate(); if (sc == 'slots') slotsDraw(); want = trackFor() }
    else if (typeof XSC != 'undefined' && XSC[sc]) { XSC[sc](); want = trackFor() }
    else if (sc == 'end') { endDraw(); want = 'none' }
    else if (sc == 'quit' || sc == 'quit2') { r(0, 0, W, H, '#000'); txt(sc == 'quit' ? 'Thanks for playing. You can close this tab.' : 'S Y N C H R O N I C I T Y', W / 2, 80, '#fff', 'center', 8); if (ok()) title() }
    if (sc == 'menu') { menuUpdateDraw(); want = MN && MN.over && S ? trackFor() : 'menu' }
    music(want); if (typeof drawNowPlaying == 'function') drawNowPlaying();
    sU(); if (fade > 0) { r(0, 0, W, H, 'rgba(0,0,0,' + fade + ')'); fade -= .03 }
  } catch (e) { console.error(e); if (sc == 'battle') { try { endBattle() } catch (e2) { sc = 'world'; B = null } } }   // never let a battle error freeze the game
  for (const k in hit) delete hit[k];
}
let last = 0, acc = 0;
(function f(t) { acc += Math.min(100, t - last); last = t; while (acc >= 16.67) { loop(); acc -= 16.67 } requestAnimationFrame(f) })(0);
if (document.fonts) { document.fonts.load('16px "Synchronicity Hand"'); document.fonts.ready.then(() => { for (const k in MP) delete MP[k] }) }
// Show the privacy notice before beginning telemetry on this browser.
// Re-show it whenever the policy version changes.
const PRIVACY_NOTICE_VERSION = '2026-11-16';
const PRIVACY_NOTICE_KEY = 'syn_privacy_notice_seen';
const privacyGate = document.getElementById('privacy-gate') || Object.assign(document.createElement('div'), { hidden: true });   // (a page without the notice, like the test page: nothing to show, no telemetry)
const privacyContinue = document.getElementById('privacy-continue') || Object.assign(document.createElement('div'), { hidden: true });   // (a page without the notice, like the test page: nothing to show, no telemetry)
const privacyShortcut = document.getElementById('privacy-shortcut') || Object.assign(document.createElement('div'), { hidden: true });   // (a page without the notice, like the test page: nothing to show, no telemetry)
let privacyNoticeSeen = false;
try {
  privacyNoticeSeen = localStorage.getItem(PRIVACY_NOTICE_KEY) === PRIVACY_NOTICE_VERSION;
} catch (_) { /* Storage may be unavailable. */ }

function launchGameSessionAfterNotice() {
  if (privacyGate.hidden) return;
  privacyGate.hidden = true;
  privacyShortcut.hidden = false;
  try { localStorage.setItem(PRIVACY_NOTICE_KEY, PRIVACY_NOTICE_VERSION); }
  catch (_) { /* Continue without saving preference. */ }
  ensureGameSessionStarted();
}

// Capture inputs while the notice is visible so they cannot control the game underneath.
window.addEventListener('keydown', event => {
  if (!privacyGate.hidden) {
    if (privacyGate.contains(event.target)) return; // Let links and buttons work.
    if (event.key === 'Tab') return; // Keep standard keyboard navigation.
    event.stopImmediatePropagation();
    if (event.key !== 'Enter' && event.key !== ' ') event.preventDefault();
  }
}, true);
window.addEventListener('keyup', event => {
  if (!privacyGate.hidden && !privacyGate.contains(event.target)) event.stopImmediatePropagation();
}, true);
privacyGate.addEventListener('keydown', event => event.stopPropagation());
privacyGate.addEventListener('keyup', event => event.stopPropagation());
privacyContinue.addEventListener('click', launchGameSessionAfterNotice);

title();
if (privacyNoticeSeen) {
  privacyGate.hidden = true;
  privacyShortcut.hidden = false;
  ensureGameSessionStarted();
} else {
  privacyContinue.focus();
}

