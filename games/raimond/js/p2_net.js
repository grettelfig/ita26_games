// ==================== PART TWO: the computer is online now (v73) ====================
// The internet works, but only a little: Edge reaches a handful of sites (YouTube, a search engine with canned results,
// the news, the weather, an encyclopedia, a map, her social page). Anything else won't load, and search only knows a few
// things. Every app opens and does something, in a cut-down way. Loaded after p2_pc.js and overrides parts of it.
const NET = {
  sites: { 'youtube': 'yt', 'yt': 'yt', 'seek': 'search', 'google': 'search', 'bing': 'search', 'search': 'search', 'news': 'news', 'lantern': 'news', 'weather': 'weather', 'skycast': 'weather',
    'wiki': 'wiki', 'map': 'maps', 'maps': 'maps', 'lumen': 'social', 'social': 'social', 'facebook': 'social', 'instagram': 'social', 'outlook': 'cant', 'mail': 'cant' },
  host: { yt: 'www.youtube.com', search: 'seek.net', news: 'dailylantern.city', weather: 'skycast.city', wiki: 'openwiki.org', maps: 'maps.seek.net', social: 'lumen.social' },
};
// what Seek knows about. Anything else gets a thin page of results that won't open.
const SEEKR = [
  { k: ['sister', 'hikari', 'missing', 'where did she go', 'find someone', 'left'], r: [['How to find someone who doesn\'t want to be found', 'forum.askaround.net', 'Honestly? If she left on purpose, give her time. She\'ll reach out when she\'s ready…', 'cant'],
    ['Missing persons: how to file a report', 'police.city.gov', 'An adult who leaves of their own free will is not considered missing…', 'cant'], ['Coach timetable: Stop 4 — Aunt\'s village line', 'coachlines.city', 'Departs 06:00 daily. One way from €14.', 'cant']] },
  { k: ['voices', 'hearing', 'whisper', 'schizo', 'psychosis', 'paranoi', 'walls'], r: [['Hearing voices: you\'re not alone', 'openwiki.org', 'Many people hear voices. It is a symptom, not a verdict. It can be treated…', 'wiki:schizo'],
    ['Why do I feel like everyone is talking about me?', 'mindline.org', 'Feeling watched or talked about is common when we\'re unwell, exhausted, or alone…', 'cant']] },
  { k: ['med', 'pill', 'stop taking', 'antipsychotic', 'side effect'], r: [['What happens if you stop taking your medication suddenly?', 'healthline.city', 'Stopping antipsychotics suddenly can bring symptoms back, often worse. Talk to your doctor before…', 'cant'],
    ['Pharmacy near me — open now', 'maps.seek.net', '2 results within 1 km', 'maps']] },
  { k: ['sad', 'depress', 'hurt', 'alone', 'kill', 'die', 'help', 'want to disappear', 'tired of'], help: 1, r: [['You don\'t have to go through this alone', 'mindline.org', 'Talking to someone can help, even when it feels like it won\'t.', 'cant']] },
  { k: ['mochi', 'cat'], r: [['How long do cats live?', 'openwiki.org', 'Domestic cats usually live 12 to 18 years…', 'cant'], ['Lost cat posters — what to write', 'petsplace.city', 'Use a clear photo and…', 'cant']] },
  { k: ['synchron', 'jung', 'coincidence'], r: [['Synchronicity — OpenWiki', 'openwiki.org', 'Meaningful coincidences: events with no causal link that seem to belong together…', 'wiki:sync']] },
  { k: ['weather', 'rain', 'forecast'], r: [['Night City weather — Skycast', 'skycast.city', 'Rain tonight. 11°. Wind from the bay.', 'weather']] },
  { k: ['news', 'today', 'metro', 'subway', 'train'], r: [['Daily Lantern — City news', 'dailylantern.city', 'Night line delays, a new tower on the river, and more.', 'news']] },
  { k: ['sleep', 'insomnia', 'nightmare', 'dream'], r: [['Can\'t sleep? 12 things that actually help', 'healthline.city', 'Keep the same wake-up time, get daylight in the morning…', 'cant'], ['rain on a window at night (10 hours, no ads)', 'youtube.com', 'quiet rooms · 2.1M views', 'yt']] },
  { k: ['steven', 'caroline', 'uku', 'friend'], r: [['Lumen — people named "' + 'Caroline' + '"', 'lumen.social', 'Log in to see more.', 'social'], ['When your friends stop answering', 'forum.askaround.net', 'Sometimes people pull away because they don\'t know how to help…', 'cant']] },
];
function netPage(w, p, q) { w.page = p; w.np = { y: 0 }; if (p == 'search') w.q = q || w.q || ''; if (p.startsWith('wiki:')) { w.page = 'wiki'; w.art = p.slice(5) } else if (p == 'wiki') w.art = w.art || 'sync'; if (p == 'yt') w.ytp = 'home'; beep(700, .03, .3) }
// typing in the address bar: a known site opens; anything that looks like a search goes to Seek; the rest can't be reached
edgeGo = function (u, w) {
  const a = w.addr.trim().toLowerCase(); u.focus = null; if (!a) return;
  for (const k in NET.sites) if (a.replace(/^https?:\/\//, '').replace(/^www\./, '').startsWith(k)) { const p = NET.sites[k]; if (p == 'cant') { w.page = 'cant'; w.addr = a } else netPage(w, p); return }
  if (/\.[a-z]{2,}/.test(a) && !a.includes(' ')) { w.page = 'cant'; w.addr = a; return }
  netPage(w, 'search', w.addr.trim());
};
function netBlocked(u, w, px, py, pw, ph) {
  R2(px, py, pw, ph, '#1a1a1e'); T2('Hmm… can\'t reach this page', px + 40, py + 50, '#fff', 15, 600);
  T2(w.addr + ' took too long to respond.', px + 40, py + 76, '#ccc', 9); T2('The connection here is very slow, and some sites are blocked on this network.', px + 40, py + 90, '#ccc', 9);
  T2('ERR_CONNECTION_TIMED_OUT', px + 40, py + 112, '#888', 8);
}
// ---- Seek (the search engine)
function netSearch(u, w, px, py, pw, ph, B) {
  R2(px, py, pw, ph, '#18181c'); T2('Seek', px + 16, py + 10, '#7ab8ff', 16, 700);
  const sb = [px + 70, py + 10, Math.min(300, pw - 90), 20], sf = u.focus && u.focus.o == w && u.focus.k == 'sq';
  RR(...sb, 10, '#26262c', sf ? '#4a8ae0' : '#3a3a42'); T2(sf ? w.sq : (w.q || 'Search'), sb[0] + 10, sb[1] + 6, '#ddd', 8.5); if (sf && (u.t >> 4) % 2) R2(sb[0] + 10 + TW2(w.sq, 8.5) + 1, sb[1] + 5, 1, 11, '#ddd');
  B(sb, () => { w.sq = ''; u.focus = { o: w, k: 'sq', enter: () => { u.focus = null; if (w.sq.trim()) netPage(w, 'search', w.sq.trim()) } } });
  const q = (w.q || '').toLowerCase(); let y = py + 40;
  if (!q) { T2('Type something to search.', px + 70, y + 10, '#999', 9); return }
  const hits = SEEKR.filter(s => s.k.some(k => q.includes(k)));
  T2(hits.length ? 'About ' + hits.reduce((n, h) => n + h.r.length, 0) + ' results (slow connection: some results are hidden)' : 'Only a few results could load on this connection.', px + 70, y, '#888', 7.5); y += 16;
  if (hits.some(h => h.help)) { RR(px + 70, y, pw - 100, 42, 5, '#26324a'); T2('You don\'t have to go through this alone.', px + 80, y + 7, '#fff', 9, 600); T2('Emotional support line, any time, free: 116 123. Or talk to someone you trust today.', px + 80, y + 22, '#c8d8f0', 8); y += 50;
    if (!u.said.help) { u.said.help = 1; say3(['Hitori|...', 'Hitori|Maybe. Maybe tomorrow.']) } }
  const res = hits.length ? hits.flatMap(h => h.r) : [['Results for "' + w.q + '"', 'seek.net', 'This page couldn\'t be loaded. Try again later.', 'cant'], ['Did you mean: where did she go', 'seek.net', '', 'search:where did she go']];
  res.slice(0, 5).forEach(([t, host, sn, go]) => { const hv = IN(u, px + 70, y, pw - 100, 34);
    T2(host, px + 70, y, '#9a9aa0', 7); T2(fit2(t, pw - 110, 10, 600), px + 70, y + 9, hv ? '#a8d0ff' : '#7ab8ff', 10, 600); T2(fit2(sn, pw - 110, 7.5), px + 70, y + 23, '#bbb', 7.5);
    B([px + 70, y, pw - 100, 34], () => { if (go.startsWith('search:')) return netPage(w, 'search', go.slice(7)); if (go == 'cant') { w.page = 'cant'; w.addr = host } else netPage(w, go) }); y += 40 });
}
// ---- the Daily Lantern
const NEWS = [['Night line delays continue: "signal fault" near the river tunnel', 'The last train home will run fifteen minutes late all week.'], ['New tower lights up the bay', 'Residents complain about the giant face advert.'],
  ['Rain, rain and more rain', 'Skycast says the week stays wet.'], ['Missing-person posters "not ours," says council', 'Posters of a grey, blurred photo have appeared across the old district. Nobody admits putting them up.'], ['Pharmacies extend night hours', 'Six late pharmacies in the city will stay open until 2 a.m.']];
function netNews(u, w, px, py, pw, ph, B) {
  R2(px, py, pw, ph, '#f2eee4'); R2(px, py, pw, 30, '#1a1a1a'); T2('THE DAILY LANTERN', px + pw / 2, py + 8, '#f2eee4', 13, 700, 'center');
  if (w.art2 != null) { const [h, s] = NEWS[w.art2]; T2(fit2(h, pw - 40, 11, 700), px + 20, py + 42, '#111', 11, 700); T2(s, px + 20, py + 62, '#333', 8.5);
    R2(px + 20, py + 80, pw - 40, 60, '#ddd6c6'); T2('Subscribe to keep reading', px + pw / 2, py + 96, '#111', 10, 700, 'center'); T2('This article is for subscribers. The page stopped loading.', px + pw / 2, py + 114, '#555', 8, 400, 'center');
    RR(px + 20, py + ph - 26, 60, 16, 3, '#1a1a1a'); T2('‹ Back', px + 50, py + ph - 22, '#fff', 8, 600, 'center'); B([px + 20, py + ph - 26, 60, 16], () => { w.art2 = null }); return }
  NEWS.forEach(([h, s], i) => { const y = py + 40 + i * 34, hv = IN(u, px + 16, y, pw - 32, 30); T2(fit2(h, pw - 40, 9.5, 700), px + 20, y, hv ? '#a03020' : '#111', 9.5, 700); T2(fit2(s, pw - 40, 7.5), px + 20, y + 13, '#555', 7.5); R2(px + 16, y + 27, pw - 32, 1, '#cfc8b8');
    B([px + 16, y, pw - 32, 30], () => { w.art2 = i; if (i == 3 && !u.said.poster) { u.said.poster = 1; say3(['Hitori|...A grey, blurred photo.', 'Hitori|Like the one in my dream.']) } }) });
}
// ---- Skycast
function netWeather(u, w, px, py, pw, ph) {
  const g = G.createLinearGradient(0, py, 0, py + ph); g.addColorStop(0, '#1a2440'); g.addColorStop(1, '#3a2a50'); G.fillStyle = g; G.fillRect(px, py, pw, ph);
  T2('Night City', px + 20, py + 14, '#fff', 12, 600); T2('11°', px + 20, py + 32, '#fff', 34, 300); T2('Rain · feels like 8°', px + 20, py + 74, '#c8d0f0', 9); T2('Wind 22 km/h from the bay · Humidity 94%', px + 20, py + 88, '#a8b0d0', 8);
  ['Tonight', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'].forEach((d, i) => { const x = px + 20 + i * ((pw - 40) / 6); RR(x, py + 112, (pw - 40) / 6 - 6, 60, 5, 'rgba(255,255,255,.08)'); T2(d, x + 6, py + 118, '#ddd', 8); T2(['11°', '12°', '10°', '13°', '9°', '11°'][i], x + 6, py + 132, '#fff', 12, 600); T2(['rain', 'rain', 'storm', 'rain', 'rain', 'cloud'][i], x + 6, py + 152, '#a8b0d0', 7.5) });
  T2('Radar unavailable on slow connections.', px + 20, py + ph - 18, '#8890b0', 7.5);
}
// ---- OpenWiki: two articles; everything else doesn't exist
const WIKI = {
  sync: ['Synchronicity', ['Synchronicity is a concept, first described by the psychiatrist Carl Jung, that holds that events can be', '"meaningful coincidences" when they occur with no causal relationship yet seem to be meaningfully related.', '', 'Jung used it to describe the moments when something in the world seems to answer something in the mind:', 'thinking of a person a moment before they call, or dreaming of a place you then find.', '', 'Critics point out that people notice the coincidences that matter to them and forget the rest.']],
  schizo: ['Hearing voices', ['Hearing voices (auditory hallucinations) means hearing something that others around you don\'t. It is', 'common in schizophrenia, but also happens with severe stress, grief and lack of sleep.', '', 'Voices are often critical, and they often sound like people the person knows. They tend to say the things', 'the person already fears are true.', '', 'Treatment (medication and talking therapy) helps most people. Stopping medication suddenly can bring the', 'voices back.']] };
function netWiki(u, w, px, py, pw, ph, B) {
  R2(px, py, pw, ph, '#fafafa'); R2(px, py, pw, 26, '#eaecf0'); T2('OpenWiki', px + 14, py + 7, '#202122', 11, 700);
  [['sync', 'Synchronicity'], ['schizo', 'Hearing voices']].forEach(([k, n], i) => { const bx = px + 100 + i * 90; T2(n, bx, py + 9, w.art == k ? '#202122' : '#3366cc', 8, w.art == k ? 600 : 400); B([bx, py + 5, 84, 16], () => { w.art = k }) });
  const [t, L] = WIKI[w.art] || WIKI.sync; T2(t, px + 20, py + 36, '#202122', 15, 400, 'left'); R2(px + 20, py + 56, pw - 40, 1, '#a2a9b1');
  L.forEach((l, i) => T2(fit2(l, pw - 40, 7.5), px + 20, py + 64 + i * 11, '#202122', 7.5));
  T2('The rest of this page didn\'t load.', px + 20, py + ph - 16, '#999', 7);
}
// ---- the map: home, the stop, the pharmacy
function netMaps(u, w, px, py, pw, ph) {
  R2(px, py, pw, ph, '#e8e4dc'); G.strokeStyle = '#fff'; G.lineWidth = 6; for (let i = 0; i < 6; i++) { G.beginPath(); G.moveTo(px, py + 30 + i * 40); G.lineTo(px + pw, py + 10 + i * 44); G.stroke(); G.beginPath(); G.moveTo(px + 40 + i * 90, py); G.lineTo(px + 20 + i * 96, py + ph); G.stroke() }
  R2(px, py + ph - 60, pw, 30, '#a8c8e8'); T2('the bay', px + pw - 60, py + ph - 52, '#5a7aa0', 8);
  const pin = (x, y, c, n) => { C2(x, y, 5, c); R2(x - 1, y + 4, 2, 6, c); RR(x + 8, y - 7, TW2(n, 8, 600) + 10, 14, 4, '#fff'); T2(n, x + 13, y - 4, '#222', 8, 600) };
  pin(px + 140, py + 120, '#d03030', 'Home'); pin(px + 260, py + 80, '#3060c0', 'Stop 4 (coaches)'); pin(px + 330, py + 170, '#30a050', 'Pharmacy (open late)');
  RR(px + 10, py + 10, 200, 22, 11, '#fff'); T2('Directions unavailable on this connection', px + 20, py + 17, '#888', 7.5);
}
// ---- Lumen: her own page, logged out after the first few posts
function netSocial(u, w, px, py, pw, ph, B) {
  R2(px, py, pw, ph, '#121216'); R2(px, py, pw, 70, '#2a1a3a'); C2(px + 40, py + 66, 22, '#5a3a6a'); T2('h', px + 40, py + 54, '#fff', 18, 600, 'center');
  T2('hitori', px + 70, py + 76, '#fff', 12, 700); T2('last active 6 weeks ago · 312 followers', px + 70, py + 92, '#999', 7.5);
  const posts = [['6 weeks ago', '...'], ['7 weeks ago', 'she said shes sorry. she still went.'], ['2 months ago', 'last train home with my favourite people ♡ (5 on a seat for 3)'], ['5 months ago', 'mochi has claimed my lap. i live here now']];
  posts.forEach(([d, t], i) => { const y = py + 108 + i * 30; RR(px + 20, y, pw - 40, 26, 5, '#1e1e26'); T2(d, px + 28, y + 4, '#888', 7); T2(fit2(t, pw - 60, 8.5), px + 28, y + 13, '#e8e8f0', 8.5) });
  R2(px, py + ph - 40, pw, 40, 'rgba(18,18,22,.95)'); T2('Log in to see more', px + pw / 2, py + ph - 30, '#fff', 9, 600, 'center'); T2('(she can\'t remember the password)', px + pw / 2, py + ph - 17, '#888', 7.5, 400, 'center');
  if (!u.said.social) { u.said.social = 1; say3(['Hitori|"Five on a seat for three."', 'Hitori|...There were only four of us.']) }
}
// Edge's page: the new sites, then everything else as before
const _drawEdge73 = drawEdge;
drawEdge = function (u, w, x, y, ww, hh, B) {
  const p = w.page; if (!['search', 'news', 'weather', 'wiki', 'maps', 'social'].includes(p) && p != 'cant' && p != 'newtab') return _drawEdge73(u, w, x, y, ww, hh, B);
  // the toolbar (back goes to the new tab page)
  R2(x, y, ww, 24, '#2c2c32'); T2('←', x + 14, y + 5, '#ddd', 11, 400, 'center'); T2('→', x + 34, y + 5, '#666', 11, 400, 'center'); T2('↻', x + 54, y + 5, '#ddd', 11, 400, 'center');
  B([x + 6, y + 2, 18, 20], () => { w.page = 'newtab' });
  const url = p == 'cant' ? w.addr : p == 'newtab' ? '' : 'https://' + NET.host[p] + (p == 'search' ? '/?q=' + encodeURIComponent(w.q || '').replace(/%20/g, '+') : p == 'wiki' ? '/wiki/' + (WIKI[w.art] || WIKI.sync)[0].replace(/ /g, '_') : '');
  const ab = [x + 66, y + 3, ww - 110, 18]; RR(...ab, 9, '#1e1e24'); const fa = u.focus && u.focus.o == w && u.focus.k == 'addr';
  T2(fit2(fa ? w.addr : url || 'Search or enter web address', ww - 130, 8.5), x + 86, y + 7, fa || url ? '#ddd' : '#888', 8.5); if (fa && (u.t >> 4) % 2) R2(x + 86 + TW2(w.addr, 8.5) + 1, y + 6, 1, 11, '#ddd');
  B(ab, () => { w.addr = ''; u.focus = { o: w, k: 'addr', enter: () => edgeGo(u, w) } });
  T2('☆', x + ww - 38, y + 6, '#ccc', 10, 400, 'center'); T2('···', x + ww - 16, y + 4, '#ccc', 11, 400, 'center'); B([x + ww - 28, y + 2, 24, 20], () => { if (!u.wins.some(o => o.app == 'history')) openApp(u, 'history') });
  const px = x, py = y + 24, pw = ww, ph = hh - 24;
  if (p == 'cant') return netBlocked(u, w, px, py, pw, ph);
  if (p == 'newtab') { R2(px, py, pw, ph, '#1a1a1e'); T2('Seek', px + pw / 2, py + 30, '#7ab8ff', 20, 700, 'center');
    const sb = [px + pw / 2 - 140, py + 62, 280, 24]; RR(...sb, 12, '#2c2c32'); ico('search', sb[0] + 10, sb[1] + 4, .9); T2('Search the web', sb[0] + 28, sb[1] + 7, '#999', 9); B(sb, () => { w.addr = ''; u.focus = { o: w, k: 'addr', enter: () => edgeGo(u, w) } });
    [['YouTube', 'yt', 'yt'], ['News', 'news', 'mail'], ['Weather', 'weather', 'clock'], ['OpenWiki', 'wiki', 'notepad'], ['Maps', 'maps', 'explorer'], ['Lumen', 'social', 'photos']].forEach(([n, pg, ic], i) => {
      const bx = px + pw / 2 - 186 + i * 64, by = py + 104; RR(bx, by, 52, 52, 6, IN(u, bx, by, 52, 52) ? '#34343a' : '#2a2a30'); ico(ic, bx + 18, by + 10, 1); T2(n, bx + 26, by + 34, '#ccc', 7.5, 400, 'center'); B([bx, by, 52, 52], () => netPage(w, pg)) });
    T2('Connected · slow · some sites are blocked on this network', px + pw / 2, py + ph - 18, '#777', 7.5, 400, 'center'); return }
  ({ search: netSearch, news: netNews, weather: netWeather, wiki: netWiki, maps: netMaps, social: netSocial })[p](u, w, px, py, pw, ph, B);
};
// Edge opens on the new tab page now; the tab strip names the new pages
const _openApp73 = openApp;
openApp = function (u, a, o = {}) { const fresh = !u.wins.some(w => w.app == a); const w = _openApp73(u, a, o); if (w && a == 'edge' && fresh && !o.page) { w.page = 'newtab'; w.addr = '' } return w };
const _edgeTabs73 = edgeTabs;
edgeTabs = function (u, w, x, y, B) { const p = w.page, nm = { search: 'Seek — ' + (w.q || ''), news: 'The Daily Lantern', weather: 'Skycast', wiki: 'OpenWiki', maps: 'Maps', social: 'hitori · Lumen' }[p];
  if (!nm) return _edgeTabs73(u, w, x, y, B);
  RR(x + 6, y + 3, 150, 19, [6, 6, 0, 0], '#2c2c32'); ico('edge', x + 12, y + 6, .8); T2(fit2(nm, 110, 8), x + 30, y + 8, '#ddd', 8);
  T2('+', x + 168, y + 5, '#bbb', 12); B([x + 160, y + 3, 18, 18], () => { w.page = 'newtab'; w.addr = ''; u.focus = { o: w, k: 'addr', enter: () => edgeGo(u, w) } }) };

// ================================================================ every app does something now (cut-down versions)
Object.assign(APPDRAW, {
  // the Store: you can browse, but downloads never finish
  store(u, w, x, y, ww, hh, B) { const st = w.st; R2(x, y, ww, hh, '#1c1c22'); T2('Microsoft Store', x + 14, y + 10, '#fff', 11, 600); T2('Top free apps', x + 14, y + 30, '#bbb', 8.5, 600);
    [['Sleep Sounds', 'Health', '★ 4.6'], ['Pocket Diary', 'Productivity', '★ 4.2'], ['Cat Café', 'Games', '★ 4.8'], ['Night Radio', 'Music', '★ 4.4'], ['Mood Tracker', 'Health', '★ 4.1'], ['Metro Map', 'Travel', '★ 3.9']].forEach(([n, c, r], i) => {
      const bx = x + 14 + (i % 3) * ((ww - 28) / 3), by = y + 48 + (i / 3 | 0) * 74, bw = (ww - 28) / 3 - 8; RR(bx, by, bw, 66, 5, '#26262e'); RR(bx + 8, by + 8, 22, 22, 5, ['#4a7ad8', '#d89a4a', '#c84a7a', '#4ac8a8', '#8a6ad8', '#d8c84a'][i]);
      T2(n, bx + 36, by + 10, '#fff', 8.5, 600); T2(c + '  ' + r, bx + 36, by + 22, '#999', 7); const gb = [bx + 8, by + 42, bw - 16, 16], d = st['d' + i];
      RR(...gb, 3, d ? '#2c2c34' : IN(u, ...gb) ? '#2a8ae0' : '#0f6cbd'); if (d) { R2(gb[0] + 2, gb[1] + 12, Math.min(gb[2] - 4, (gb[2] - 4) * Math.min(.37, (u.t - d) / 600)), 2, '#4cc2ff'); T2((u.t - d) > 220 ? 'Download paused' : 'Downloading…', gb[0] + gb[2] / 2, gb[1] + 3, '#bbb', 7.5, 400, 'center') } else T2('Get', gb[0] + gb[2] / 2, gb[1] + 4, '#fff', 8, 600, 'center');
      B(gb, () => { if (!st['d' + i]) st['d' + i] = u.t }) });
    T2('Connection too slow: downloads may pause.', x + 14, y + hh - 16, '#777', 7.5) },
  // Word: her unfinished letter. You can add a line to it
  word(u, w, x, y, ww, hh, B) { const st = w.st; if (st.line == null) st.line = ''; R2(x, y, ww, hh, '#2b2b30'); R2(x, y, ww, 18, '#185abd'); T2('letter.docx · Read-only (unlicensed product)', x + 8, y + 4, '#fff', 8);
    R2(x + 30, y + 26, ww - 60, hh - 34, '#fff'); ['Dear —,', '', 'I don\'t know how to start this. Dr. Laan said writing it down', 'might help, so I\'m writing it down.', '', 'I\'m sorry about the things I said. I don\'t remember all of them.', 'I remember the door. I remember you crying on the other side of it.', '', 'If you come home I\'ll take them every day. I promise.', ''].forEach((l, i) => T2(l, x + 42, y + 34 + i * 11, '#222', 8.5));
    const ly = y + 34 + 10 * 11, sf = u.focus && u.focus.o == st; T2(st.line || (sf ? '' : '(click to keep writing)'), x + 42, ly, st.line ? '#222' : '#aaa', 8.5); if (sf && (u.t >> 4) % 2) R2(x + 42 + TW2(st.line, 8.5) + 1, ly - 1, 1, 11, '#222');
    B([x + 30, ly - 4, ww - 60, 16], () => { u.focus = { o: st, k: 'line', enter: () => { u.focus = null; if (st.line.trim() && !u.said.wordline) { u.said.wordline = 1; say3(['Hitori|...It won\'t save. Unlicensed.', 'Hitori|Figures.']) } } } }) },
  // Excel: the house budget, in her sister's handwriting style of neat columns
  excel(u, w, x, y, ww, hh, B) { const st = w.st; R2(x, y, ww, hh, '#fff'); R2(x, y, ww, 18, '#107c41'); T2('budget.xlsx · Read-only', x + 8, y + 4, '#fff', 8);
    const rows = [['', 'March', 'April', 'May'], ['Rent', '640', '640', '640'], ['Food', '210', '190', '35'], ['Pharmacy', '28', '28', '0'], ['Bus', '40', '40', '0'], ['Mochi', '25', '0', '0'], ['', '', '', ''], ['Total', '943', '898', '675']], cw = (ww - 40) / 4;
    rows.forEach((r, j) => r.forEach((c, i) => { const cx = x + 30 + i * cw, cy = y + 30 + j * 15, sel = st.sel && st.sel[0] == i && st.sel[1] == j; R2(cx, cy, cw, 15, j == 0 || i == 0 ? '#f3f3f3' : '#fff'); G.strokeStyle = sel ? '#107c41' : '#ddd'; G.lineWidth = sel ? 2 : 1; G.strokeRect(cx, cy, cw, 15); T2(c, cx + 4, cy + 4, '#222', 8, j == 0 || j == 7 ? 600 : 400); B([cx, cy, cw, 15], () => { st.sel = [i, j] }) }));
    T2(st.sel ? 'Cell ' + 'ABCD'[st.sel[0]] + (st.sel[1] + 1) + ' · This workbook is read-only.' : 'Click a cell.', x + 30, y + hh - 18, '#666', 7.5);
    if (!u.said.excel) { u.said.excel = 1; say3(['Hitori|Pharmacy: twenty-eight, twenty-eight... zero.', 'Hitori|...Mochi: zero.']) } },
  // PowerPoint: a birthday slideshow that was never shown
  ppt(u, w, x, y, ww, hh, B) { const st = w.st; st.i = st.i || 0; R2(x, y, ww, hh, '#2b2b30'); R2(x, y, ww, 18, '#c43e1c'); T2('for_her_birthday.pptx · Read-only', x + 8, y + 4, '#fff', 8);
    const S = [['HAPPY 17TH!!', 'from your favourite sister'], ['Remember the beach?', 'you got sunburnt and blamed me'], ['Remember the last train?', 'five of us on a seat for three'], ['I\'m proud of you', '(slide unfinished)']], [t, s] = S[st.i];
    R2(x + 30, y + 30, ww - 60, hh - 64, '#fff'); T2(t, x + ww / 2, y + 60, '#c43e1c', 16, 700, 'center'); T2(s, x + ww / 2, y + 86, '#555', 9, 400, 'center');
    T2('Slide ' + (st.i + 1) + ' of ' + S.length + '   (click for the next slide)', x + 30, y + hh - 26, '#aaa', 7.5); B([x + 30, y + 30, ww - 60, hh - 64], () => { st.i = (st.i + 1) % S.length; beep(600, .02, .3) }) },
  // Xbox: friends list, nobody online; the game needs an update that never finishes
  xbox(u, w, x, y, ww, hh, B) { const st = w.st; R2(x, y, ww, hh, '#101010'); T2('Xbox', x + 14, y + 10, '#9bf00b', 12, 700); T2('hitori_exe · Gamerscore 4,210', x + 60, y + 13, '#ccc', 8);
    T2('Friends', x + 14, y + 34, '#fff', 9, 600); [['Steven', 'Last seen 6 weeks ago'], ['Caroline', 'Last seen 6 weeks ago'], ['Uku', 'Last seen 3 days ago'], ['♡', 'Last seen 9 weeks ago']].forEach(([n, s], i) => { const by = y + 50 + i * 24; C2(x + 24, by + 8, 7, '#333'); T2(n, x + 36, by + 2, '#eee', 8.5, 600); T2(s, x + 36, by + 12, '#888', 7) });
    const gx = x + ww / 2 + 10; T2('Jump back in', gx, y + 34, '#fff', 9, 600); RR(gx, y + 50, ww / 2 - 30, 70, 5, '#1c3a1c'); T2('Cat Café Deluxe', gx + 10, y + 58, '#fff', 9, 600); T2('Co-op · 2 players', gx + 10, y + 72, '#aaa', 7.5);
    const pb = [gx + 10, y + 96, 60, 16]; RR(...pb, 3, IN(u, ...pb) ? '#2a9a2a' : '#107c10'); T2(st.up ? 'Updating…' : 'Play', pb[0] + 30, pb[1] + 4, '#fff', 8, 600, 'center'); B(pb, () => { st.up = u.t });
    if (st.up) { T2(u.t - st.up > 200 ? 'Update failed. 0x87e00017' : 'Update required (2.1 GB)', gx + 76, y + 100, u.t - st.up > 200 ? '#e88' : '#aaa', 7.5); if (u.t - st.up == 201 && !u.said.xbox) { u.said.xbox = 1; say3(['Hitori|Two players.', 'Hitori|...We never finished it.']) } } },
  // the terminal: a few commands work
  terminal(u, w, x, y, ww, hh) { const st = w.st; if (!st.log) { st.log = ['Windows PowerShell', 'Type "help" for the commands that work here.', '']; st.cmd = '' } R2(x, y, ww, hh, '#0c0c0c');
    const L = st.log.slice(-13); L.forEach((l, i) => T2(fit2(l, ww - 16, 8.5), x + 8, y + 6 + i * 11, '#ccc', 8.5)); const ly = y + 6 + L.length * 11, sf = u.focus && u.focus.o == st;
    T2('PS C:\\Users\\hitori> ' + st.cmd + (sf && (u.t >> 4) % 2 ? '_' : ''), x + 8, ly, '#eee', 8.5);
    if (!sf && u.wins.filter(v => !v.min).slice(-1)[0] == w && !(u.focus && u.focus.o)) u.focus = { o: st, k: 'cmd', enter: () => { const c = st.cmd.trim().toLowerCase(); st.log.push('PS C:\\Users\\hitori> ' + st.cmd); st.cmd = '';
      const R = { help: ['help, dir, ping, whoami, date, cls'], dir: ['Desktop  Documents  Downloads  Pictures  unsent.txt'], whoami: ['desktop-h1t0r1\\hitori'], date: [new Date().toDateString()], ping: ['Pinging seek.net:', 'Reply from seek.net: time=1840ms', 'Request timed out.', 'Reply from seek.net: time=2210ms'] };
      if (c == 'cls') st.log = []; else if (c) st.log.push(...(R[c.split(' ')[0]] || [c.split(' ')[0] + ' : The term is not recognized, or is not available on this PC.'])) } } },
  // Media Player: a small library; only one track still plays
  media(u, w, x, y, ww, hh, B) { const st = w.st; R2(x, y, ww, hh, '#1c1c20'); R2(x, y, 96, hh, '#18181c'); ['Home', 'Music library', 'Video library', 'Play queue', 'Playlists'].forEach((n, i) => T2(n, x + 10, y + 12 + i * 18, i == 1 ? '#fff' : '#ccc', 8.5));
    if (w.st.err) { T2('voicemail.m4a', x + 110, y + 14, '#fff', 11, 600); RR(x + 110, y + 40, ww - 120, 40, 4, '#3a2020'); T2('Can\'t play', x + 120, y + 46, '#ffd0d0', 9, 600); T2('This file is corrupted or can\'t be played. 0xc00d36c4', x + 120, y + 60, '#d0a0a0', 7.5); return }
    T2('Music library', x + 110, y + 14, '#fff', 11, 600);
    const T = [['music box (her phone recording)', '0:48', 1], ['last train singalong', '2:12', 0], ['rain loop', '10:00', 0], ['our song', '3:31', 0]];
    T.forEach(([n, d, ok], i) => { const by = y + 36 + i * 18, hv = IN(u, x + 106, by, ww - 116, 16), on = st.play == i; if (hv || on) R2(x + 106, by, ww - 116, 16, on ? '#2c3a4a' : '#26262c'); T2(n, x + 112, by + 4, ok ? '#eee' : '#999', 8); T2(d, x + ww - 16, by + 4, '#888', 7.5, 400, 'right');
      B([x + 106, by, ww - 116, 16], () => { if (ok) { st.play = i; st.pt = u.t } else { st.play = null; st.msg = u.t } }) });
    if (st.msg && u.t - st.msg < 160) T2('Can\'t play: the licence for this file couldn\'t be checked.', x + 112, y + 112, '#e8a0a0', 7.5);
    if (st.play != null) { const k = (u.t - st.pt); if (k % 24 == 0 && k < 48 * 60) { const N = [784, 659, 587, 523, 587, 659, 784, 880, 784, 659, 587, 659]; beep(N[(k / 24 | 0) % N.length], .25, .25) } }
    R2(x, y + hh - 26, ww, 26, '#26262c'); C2(x + ww / 2, y + hh - 13, 8, '#3a3a40'); G.fillStyle = '#fff'; G.beginPath(); G.moveTo(x + ww / 2 - 2.5, y + hh - 17); G.lineTo(x + ww / 2 + 3.5, y + hh - 13); G.lineTo(x + ww / 2 - 2.5, y + hh - 9); G.fill();
    if (st.play != null) T2('Playing: ' + T[st.play][0], x + 110, y + hh - 18, '#ccc', 7.5) },
  // anything else: opens, says what little it can do
  generic(u, w, x, y, ww, hh, B) { R2(x, y, ww, hh, '#1c1c20'); T2(APPS[w.app] ? APPS[w.app].n : 'App', x + ww / 2, y + hh / 2 - 14, '#fff', 11, 600, 'center'); T2('This app is in a limited mode on this PC.', x + ww / 2, y + hh / 2 + 4, '#aaa', 8, 400, 'center') },
});
