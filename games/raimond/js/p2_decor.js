// ==================== PART TWO: furnishing the house ====================
// More things in every room (built straight onto the new plan: x 0-16.4, z 0-14; upstairs floor at y 3), her sister's
// room as she left it, the things day 2 uses (the cat's bowl, the post, the blinds, the steamed-up mirror), and soft
// shadows on the floor under the furniture.
// Fronts of the furniture models face local -z; FACE turns them to face north / south / west / east.
const FACE = { n: 0, s: Math.PI, w: Math.PI / 2, e: -Math.PI / 2 };
function decorTex() {
  if (TX.blobshadow) return;
  tex('blobshadow', 32, (g, s) => { g.clearRect(0, 0, s, s); const im = g.createImageData(s, s); for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) { const u = Math.abs(x + .5 - s / 2) / (s / 2), v = Math.abs(y + .5 - s / 2) / (s / 2), e = Math.max(u, v), a = clamp((1 - e) / .34, 0, 1); im.data[(y * s + x) * 4 + 3] = Math.round(255 * .46 * a * a * (3 - 2 * a)) } g.putImageData(im, 0, 0) });
  tex('calendar', 64, (g, s) => { g.fillStyle = '#f0ece0'; g.fillRect(0, 0, s, s); g.fillStyle = '#a03030'; g.fillRect(0, 0, s, 14); g.fillStyle = '#222'; for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) g.fillRect(5 + c * 8, 20 + r * 8, 4, 3);
    g.strokeStyle = '#c02020'; g.lineWidth = 1.5; for (let i = 0; i < 9; i++) { const x = 5 + (i % 7) * 8, y = 20 + (i / 7 | 0) * 8; g.beginPath(); g.moveTo(x - 1, y - 1); g.lineTo(x + 5, y + 4); g.moveTo(x + 5, y - 1); g.lineTo(x - 1, y + 4); g.stroke() } });   // the days crossed off stop six weeks ago
  tex('giftwrap', 32, (g, s) => { g.fillStyle = '#c8b8d8'; g.fillRect(0, 0, s, s); g.fillStyle = '#f4f0f8'; for (let y = 0; y < s; y += 8) for (let x = (y / 8 % 2) * 4; x < s; x += 8) g.fillRect(x, y, 2, 2); g.fillStyle = '#b02a3a'; g.fillRect(13, 0, 6, s); g.fillRect(0, 13, s, 6) });
  tex('envelope', 32, (g, s) => { g.fillStyle = '#e8e2d2'; g.fillRect(0, 0, s, s); g.strokeStyle = '#b8b0a0'; g.beginPath(); g.moveTo(0, 0); g.lineTo(s / 2, s * .55); g.lineTo(s, 0); g.stroke(); g.fillStyle = '#9a3030'; g.fillRect(s - 9, 3, 6, 7); g.fillStyle = '#334'; g.fillRect(8, 18, 14, 1.5); g.fillRect(8, 22, 10, 1.5) });
  tex('diary', 32, (g, s) => { texNoise(g, s, '#7a3848', .1, 601, 1); g.fillStyle = '#d8b860'; g.fillRect(s - 5, 0, 2, s); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(8, 10, 12, 8) });
  tex('cork', 64, (g, s) => { texNoise(g, s, '#a8804c', .22, 602, 1); const R = rng(603); for (let i = 0; i < 9; i++) { const x = 4 + R() * 44, y = 4 + R() * 44, w = 8 + R() * 10, h = 8 + R() * 10; g.fillStyle = ['#f0ece0', '#d8e4f0', '#f0d8dc', '#e8e0b8'][i % 4]; g.fillRect(x, y, w, h); g.fillStyle = 'rgba(40,30,40,.55)'; g.fillRect(x + 2, y + 2, w - 4, h * .55); g.fillStyle = '#c03030'; g.fillRect(x + w / 2 - 1, y, 2, 2) } });
  tex('steamheart', 64, (g, s) => { g.clearRect(0, 0, s, s); g.strokeStyle = 'rgba(40,50,60,1)'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(32, 50); g.bezierCurveTo(4, 30, 14, 8, 32, 22); g.bezierCurveTo(50, 8, 60, 30, 32, 50); g.stroke(); g.beginPath(); g.moveTo(30, 50); g.lineTo(29, 58); g.stroke() });
  tex('steam', 16, (g, s) => { texNoise(g, s, '#aab2b8', .06, 604, 1) });
  tex('daywin', 64, (g, s) => { const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, '#dfe8f0'); gr.addColorStop(.6, '#f4f0e0'); gr.addColorStop(1, '#c8c4b0'); g.fillStyle = gr; g.fillRect(0, 0, s, s); g.fillStyle = '#8a8a80'; g.fillRect(0, 44, s, 20); g.fillStyle = '#6c6c66'; g.fillRect(6, 30, 14, 34); g.fillRect(40, 36, 20, 28); g.fillStyle = '#3a3a3a'; g.fillRect(31, 0, 2, s); g.fillRect(0, 31, s, 2) });
  tex('kibble', 16, (g, s) => { texNoise(g, s, '#7a5030', .3, 605, 2) });
  tex('navy', 32, (g, s) => texNoise(g, s, '#232a44', .12, 606, 1));
  tex('magcover', 32, (g, s) => { g.fillStyle = '#c84a4a'; g.fillRect(0, 0, s, s); g.fillStyle = '#f0e8d8'; g.fillRect(3, 3, s - 6, 7); g.fillStyle = '#2a3a5a'; g.fillRect(6, 13, 20, 15) });
  Object.assign(SPEC, { giftwrap: .25, steam: .1 });
}
function buildDecor() {
  decorTex(); const mb = new MB(), R = rng(88);
  const put = (x, y, z, face, fn, w, d, h) => { mb.at(x, y, z, FACE[face], fn); if (w) { const ns = face == 'n' || face == 's', sw = ns ? w : d, sd = ns ? d : w; hs(x - sw / 2, y, z - sd / 2, x + sw / 2, y + h, z + sd / 2) } };
  const mug = (x, y, z, c = [.9, .9, .9, 0]) => mb.lathe('porcelain', [[.0, y], [.035, y], [.04, y + .09], [.034, y + .09]], { cx: x, cz: z, seg: 8, col: c });
  const books = (x, y, z, n, ry = 0) => mb.at(x, y, z, ry, m => { for (let i = 0; i < n; i++) m.box('paper', -.1 - R() * .02, i * .03, -.07, .1 + R() * .02, i * .03 + .028, .07 + R() * .02, { col: [[.6, .3, .3, 0], [.3, .4, .6, 0], [.75, .7, .5, 0], [.3, .5, .4, 0]][(i + n) % 4] }) });
  const frame = (t, face, x, y, z, w, h) => mFrame(mb, t, face, x, y, z, w, h, 'walnut');
  const bin = (x, y, z) => { mb.lathe('darkplastic', [[.11, y], [.14, y + .3], [.145, y + .31]], { cx: x, cz: z, seg: 10, cap: 'b' }); for (let i = 0; i < 3; i++) mb.sphere('paper', x + (R() - .5) * .1, y + .27 + R() * .04, z + (R() - .5) * .1, .04, .035, .04, { seg: 6, rings: 4 }) };
  const pile = (x, y, z, cols) => cols.forEach((c, i) => mb.sphere('linen', x + (R() - .5) * .3, y + .08 + i * .03, z + (R() - .5) * .3, .22 + R() * .08, .09, .2 + R() * .08, { seg: 8, rings: 5, col: c }));

  // ================================================== GROUND FLOOR
  // ---- the storage room: shelves, boxes, a ladder, an armchair under a sheet, the vacuum cleaner
  put(.26, 0, 3.1, 'e', m => MOD.bookshelf(m, 1.7, 1.9, .34, 51), 1.7, .36, 1.9);
  for (const [x, z, sd, n] of [[4.9, .55, 11, 3], [4.1, .5, 12, 2], [5.1, 1.5, 13, 3], [5.1, 4.4, 14, 2]]) { mb.at(x, 0, z, R() * .4, m => MOD.boxes(m, sd, n)); hs(x - .35, 0, z - .3, x + .35, .9, z + .3) }
  mb.with(M4.chain(M4.tr(5.4, 0, 2.9), M4.rz(.16)), m => { for (const z of [-.2, .2]) m.box('oak', -.02, 0, z - .02, .02, 2.1, z + .02); for (let i = 0; i < 7; i++) m.box('oak', -.015, .25 + i * .27, -.2, .015, .28 + i * .27, .2) });
  mb.box('dustsheet', 3.3, 0, 4.1, 4.2, .5, 4.9, { bev: .08 }); mb.box('dustsheet', 3.3, .45, 4.6, 4.2, 1.0, 4.95, { bev: .1 }); hs(3.3, 0, 4.1, 4.2, 1, 4.95);
  mb.lathe('darkplastic', [[.14, 0], [.16, .06], [.16, .3], [.1, .36]], { cx: 1.3, cz: 4.6, seg: 10, cap: 'b', col: [.7, .2, .2, 0] }); mb.tube('darkplastic', [[1.3, .34, 4.6], [1.5, .5, 4.5], [1.8, .3, 4.4], [2.0, .04, 4.5]], [.025, .025, .025, .025], { seg: 6 });
  mb.box('oak', .9, 0, .3, 1.0, 1.5, .34); mb.box('oak', 2.0, 0, .3, 2.1, 1.5, .34);   // skis against the wall
  // ---- the living room
  put(4.3, 0, 5.52, 's', m => MOD.dresser(m, 1.5, .8), 1.5, .5, .8); mb.at(3.85, .8, 5.5, 0, m => MOD.tableLamp(m, .42)); frame('portrait', 's', 4.5, 1.02, 5.36, .22, .3); mug(4.85, .8, 5.55, [.5, .6, .8, 0]);
  frame('painting', 's', 4.3, 1.75, 5.27, .9, .6);
  put(.4, 0, 11.3, 'n', m => MOD.floorLamp(m), .4, .4, 1.6);
  put(3.9, 0, 13.76, 'n', m => MOD.bookshelf(m, 1.5, 1.8, .32, 33), 1.5, .34, 1.8);
  put(5.25, 0, 7.9, 'n', m => MOD.plant(m, false), .4, .4, .9);
  put(3.35, 0, 9.6, 'n', m => MOD.table(m, .45, .45, .5, 'walnut'), .45, .45, .5); mug(3.3, .5, 9.55, [.85, .8, .7, 0]); mb.box('magcover', 3.25, .5, 9.62, 3.45, .51, 9.78, { fit: 1 });
  mb.box('magcover', 2.25, .9 - .47, 6.8, 2.45, .9 - .46, 7.06, { fit: 1 }); mb.box('paper', 2.5, .43, 6.95, 2.72, .44, 7.2); mb.box('darkplastic', 2.75, .43, 6.75, 2.8, .45, 6.92); mug(2.3, .43, 7.25);
  for (const [z, c] of [[8.85, [.75, .45, .4, 0]], [10.3, [.45, .5, .65, 0]]]) mb.sphere('linen', .5, .58, z, .2, .1, .2, { seg: 8, rings: 5, col: c });
  mb.box('blanket2', .15, .46, 9.2, .95, .5, 9.9, { bev: .02 });
  frame('painting', 'e', .075, 1.75, 12.2, .7, .5); frame('portrait', 'n', 1.6, 1.7, 13.925, .4, .52); frame('poster3', 'n', 2.5, 1.65, 13.925, .34, .46);
  // ---- the hall: a bench and umbrellas by the front door, a sideboard by the back door, pictures up the stairs
  mb.box('oak', 6.1, .4, 13.55, 7.2, .45, 13.9); for (const x of [6.15, 7.1]) mb.box('oak', x, 0, 13.58, x + .05, .4, 13.88); mb.box('cushion', 6.15, .45, 13.58, 7.15, .5, 13.88, { bev: .02 }); hs(6.1, 0, 13.55, 7.2, .5, 13.9);
  mb.box('walnut', 6.1, 1.6, 13.9, 7.2, 1.68, 13.94); for (let i = 0; i < 4; i++) mb.box('brass', 6.25 + i * .27, 1.56, 13.86, 6.27 + i * .27, 1.62, 13.9);
  mb.box('navy', 6.2, .95, 13.82, 6.5, 1.6, 13.9, { bev: .03 }); mb.box('fabric', 6.75, .85, 13.82, 7.08, 1.6, 13.9, { bev: .03, col: [1.5, 1.1, .8, 0] });
  mb.lathe('darkplastic', [[.09, 0], [.1, .5], [.11, .52]], { cx: 7.55, cz: 13.72, seg: 10, cap: 'b' }); for (const [a, c] of [[.1, [.2, .2, .25, 0]], [-.12, [.7, .2, .2, 0]]]) mb.with(M4.chain(M4.tr(7.55, .05, 13.72), M4.rz(a)), m => m.lathe('linen', [[.012, 0], [.035, .2], [.03, .7], [.008, .8]], { seg: 6, col: c }));
  hs(7.42, 0, 13.6, 7.68, .6, 13.86);
  put(10.35, 0, .34, 's', m => MOD.dresser(m, 1.4, .85), 1.4, .5, .85); mb.at(10.75, .85, .34, 0, m => MOD.plant(m, false)); mb.box('trimw', 9.85, .85, .2, 10.15, .86, .45); for (let i = 0; i < 5; i++) mb.box('brass', 9.9 + i * .04, .86, .3, 9.93 + i * .04, .865, .36);   // keys in a dish
  frame('portrait', 's', 10.35, 1.6, .075, .4, .5);
  // (the three little pictures up the stairs are gone: the big painting over the stairs is enough)
  // ---- the kitchen: a sideboard, the calendar, the bin, things left on the table and the worktops
  put(13.2, 0, 13.7, 'n', m => MOD.dresser(m, 1.6, .9), 1.6, .5, .9); mb.lathe('oak', [[.0, .9], [.1, .9], [.17, .97], [.175, .98]], { cx: 12.9, cz: 13.7, seg: 12 }); for (const [dx, dz, c] of [[0, 0, [.9, .5, .15, 0]], [.07, .03, [.8, .2, .15, 0]], [-.05, .05, [.9, .8, .2, 0]]]) mb.sphere('linen', 12.9 + dx, 1.0, 13.7 + dz, .045, .045, .045, { seg: 6, rings: 4, col: c });
  books(13.6, .9, 13.7, 3, .3); mb.decal('calendar', 13.2, 1.65, 13.925, .42, .46, 'n');
  bin(15.25, 0, 13.6); hs(15.1, 0, 13.45, 15.4, .35, 13.75);
  mb.lathe('steel', [[.08, .92], [.09, .94], [.085, 1.12], [.05, 1.16], [.02, 1.17]], { cx: 13.85, cz: 4.95, seg: 10 }); mb.box('darkplastic', 13.93, 1.0, 4.94, 13.99, 1.12, 4.96);   // kettle
  mb.box('steel', 14.3, .92, 4.8, 14.62, 1.1, 5.0, { bev: .02 }); mb.box('dark', 14.36, 1.1, 4.86, 14.56, 1.102, 4.89); mb.box('dark', 14.36, 1.1, 4.92, 14.56, 1.102, 4.95);   // toaster
  mb.box('walnut', 14.9, .92, 4.78, 15.02, 1.14, 4.95); for (let i = 0; i < 4; i++) mb.box('darkplastic', 14.91 + i * .028, 1.14, 4.82, 14.925 + i * .028, 1.2, 4.9);   // knife block
  mb.box('steel', 15.85, .92, 9.1, 16.25, .94, 9.6); for (let i = 0; i < 4; i++) mb.with(M4.chain(M4.tr(15.92 + i * .09, .95, 9.35), M4.rz(.25)), m => m.lathe('porcelain', [[0, 0], [.09, .004], [.1, .012]], { seg: 10, cap: 'b' }));   // a rack of plates somebody washed once
  mb.lathe('paper', [[.05, .92], [.05, 1.16]], { cx: 16.1, cz: 5.72, seg: 10, cap: 't' });
  mug(12.8, .78, 11.85, [.9, .85, .8, 0]); mug(13.55, .78, 12.2, [.5, .7, .6, 0]); mb.lathe('porcelain', [[0, .78], [.11, .784], [.125, .8]], { cx: 13.2, cz: 12.0, seg: 12 }); mb.box('paper', 12.7, .78, 12.1, 12.98, .785, 12.35); mb.box('magcover', 13.5, .78, 11.7, 13.7, .785, 11.95, { fit: 1 });
  // Mochi's bowl, by the wall where the kitchen opens to the hall
  mb.lathe('porcelain', [[.0, .005], [.07, .005], [.1, .06], [.09, .06], [.065, .015]], { cx: 12.1, cz: 10.9, seg: 12, col: [.5, .7, .85, 0] }); mb.box('rug2', 11.85, .003, 10.65, 12.35, .008, 11.15, { skip: 'nsewb', fit: 1, col: [.7, .6, .5, 0] });
  inter('bowl', [11.9, 0, 10.7, 12.3, .25, 11.1], 'Cat bowl', () => P2S.bowl());
  // the post under the letterbox
  for (let i = 0; i < 7; i++) mb.with(M4.chain(M4.tr(9.55 + (R() - .5) * .3, .004 + i * .004, 13.55 + (R() - .5) * .25), M4.ry(R() * 3)), m => m.box(i == 6 ? 'envelope' : 'paper', -.11, 0, -.08, .11, .004, .08, { fit: 1, col: i == 6 ? [1, 1, 1, 0] : [[1, 1, 1, 0], [.9, .8, .6, 0], [.7, .8, .9, 0]][i % 3] }));
  inter('mail', [9.3, 0, 13.3, 9.85, .2, 13.85], 'Post', () => P2S.mail(), () => P2.day <= 2);

  // ================================================== UPSTAIRS
  const Y = 3;
  // ---- the landing: a reading corner, a laundry basket by the bathroom
  put(5.84, Y, 4.5, 'e', m => MOD.bookshelf(m, 1.3, 1.5, .3, 71), 1.3, .32, 1.5);
  mb.at(10.05, Y, .62, FACE.s, m => MOD.sofa(m, .9)); hs(9.55, Y, .15, 10.55, Y + .9, 1.1); put(6.12, Y, .35, 's', m => MOD.floorLamp(m), .35, .35, 1.6);   // v73: moved clear of the new doorway into the wing
  mb.lathe('wicker', [[.2, Y], [.24, Y + .5], [.25, Y + .52]], { cx: 6.0, cz: 3.35, seg: 12, cap: 'b' }); pile(6.0, Y + .42, 3.35, [[.8, .8, .85, 0], [.5, .4, .45, 0]]); hs(5.75, Y, 3.1, 6.25, Y + .6, 3.6);
  frame('painting', 'w', 11.325, Y + 1.7, 11.2, .6, .45);
  // ---- the parents' room: a wardrobe, a dressing table, pictures over the bed, slippers
  put(5.22, Y, 8.6, 'w', m => MOD.wardrobe(m, 1.7, .58, 2.15), 1.7, .62, 2.15);
  // the dressing table and its mirror: beside the window now, not over it
  put(1.05, Y, 13.62, 'n', m => MOD.desk(m, 1.2, .5, .75), 1.2, .55, .76); mb.box('walnut', .65, Y + 1.0, 13.9, 1.45, Y + 1.75, 13.94); mb.box('glassw', .7, Y + 1.05, 13.895, 1.4, Y + 1.7, 13.9);
  mb.lathe('cushion', [[.17, Y + .4], [.18, Y + .45], [.0, Y + .46]], { cx: 1.05, cz: 13.0, seg: 10 }); mb.lathe('walnut', [[.14, Y], [.15, Y + .4]], { cx: 1.05, cz: 13.0, seg: 8 }); hs(.87, Y, 12.82, 1.23, Y + .46, 13.18);
  for (let i = 0; i < 3; i++) mb.lathe('lacquer', [[.025, Y + .75], [.03, Y + .83 + i * .02], [.012, Y + .87 + i * .02]], { cx: .7 + i * .1, cz: 13.7, seg: 8, col: [[.9, .6, .7, .1], [.6, .8, .9, .1], [.9, .85, .6, .1]][i] });
  frame('painting', 'e', .075, Y + 1.75, 10.2, .8, .5); frame('portrait', 's', 1.4, Y + 1.6, 5.875, .36, .46);
  for (const z of [10.2, 10.35]) mb.box('linen', 2.25, Y, z, 2.5, Y + .06, z + .1, { bev: .02, col: [.6, .45, .5, 0] });
  mb.box('rug2', 2.3, Y + .003, 9.3, 3.7, Y + .01, 11.2, { skip: 'nsewb', fit: 1, col: [.8, .75, .8, 0] });
  // ---- Hitori's room: laundry on the floor, a low bookshelf, a bin by the desk, cans, a stack of manga
  pile(14.75, Y, 7.5, [[.3, .25, .3, 0], [.6, .3, .35, 0], [.75, .75, .8, 0], [.25, .3, .4, 0]]);
  put(11.63, Y, 10.75, 'e', m => MOD.bookshelf(m, 1.2, 1.1, .3, 44), 1.2, .32, 1.1); mb.at(11.63, Y + 1.1, 10.5, 0, m => MOD.plant(m, true));
  bin(15.45, Y, 11.0); for (const [x, z] of [[16.1, 9.38], [16.18, 9.47], [15.95, 10.5]]) mb.lathe('steel', [[.03, Y + .752], [.03, Y + .87], [.02, Y + .875]], { cx: x, cz: z, seg: 8, cap: 't', col: [.5, .8, .5, 0] });
  books(13.75, Y, 13.7, 6, .2); books(13.95, Y, 13.45, 3, -.4);
  mb.box('blanket2', 11.5, Y + .585, 12.4, 12.45, Y + .62, 13.2, { bev: .02 });
  // her blinds: pull them up (day 2) and there is daylight behind them
  inter('blinds', [16.15, Y + .9, 12.3, 16.4, Y + 2.2, 13.6], 'Blinds', () => P2S.blinds());
  // the blinds pulled up: rolled at the top of the window, and the city outside (the same city every other window shows)
  H3.extra.daywin = single(m => { m.box('trimw', 16.27, Y + 1.98, 12.3, 16.335, Y + 2.14, 13.6, { col: [.62, .62, .66, 0] }); m.decal('cityview', 16.328, Y + 1.42, 12.95, 1.26, 1.12, 'w', [1, 1, 1, 1]) }, false);
  // ---- the upstairs bathroom mirror, steamed up after a shower, with a heart drawn in it
  H3.extra.steam = single(m => { m.decal('steam', 3.25, Y + 1.68, .084, 1.45, .8, 's'); m.decal('steamheart', 3.5, Y + 1.72, .087, .3, .3, 's') }, false);
  inter('shower', [.06, Y, .06, 1.85, Y + 1.9, .95], 'Shower', () => P2S.shower());

  // ================================================== HER SISTER'S ROOM (x 11.4-16.4, z 0-6.4; door on the west wall, window on the east)
  mb.box('rug2', 12.9, Y + .003, 2.2, 14.7, Y + .011, 4.5, { skip: 'nsewb', fit: 1, col: [.75, .85, .8, 0] });
  mb.at(15.78, Y, 1.13, FACE.s, m => MOD.bed(m, 1.05, 2.05, 'duvet2', 'oak')); hs(15.22, Y, .06, 16.34, Y + .6, 2.2);
  mb.sphere('linen', 15.6, Y + .68, 1.5, .1, .09, .1, { seg: 8, rings: 5, col: [.75, .6, .45, 0] }); mb.sphere('linen', 15.6, Y + .8, 1.46, .07, .065, .07, { seg: 8, rings: 5, col: [.75, .6, .45, 0] }); for (const s of [-1, 1]) mb.sphere('linen', 15.6 + s * .05, Y + .86, 1.46, .025, .03, .02, { seg: 6, rings: 4, col: [.7, .55, .4, 0] });   // a bear
  put(14.85, Y, .3, 's', m => MOD.nightstand(m), .5, .42, .56); mb.at(14.85, Y + .55, .3, 0, m => MOD.tableLamp(m, .4));
  put(12.65, Y, .24, 's', m => MOD.bookshelf(m, 1.5, 1.8, .32, 61), 1.5, .34, 1.8);
  put(16.04, Y, 3.85, 'w', m => MOD.desk(m, 1.3, .6, .75), 1.3, .62, .76); mb.at(15.4, Y, 3.85, FACE.e, m => MOD.chair(m, 'oak', 'cushion')); hs(15.2, Y, 3.62, 15.62, Y + .5, 4.08);
  mb.at(16.12, Y + .75, 4.3, 0, m => MOD.tableLamp(m, .38)); books(16.1, Y + .75, 3.35, 4, 1.4); mb.lathe('porcelain', [[.035, Y + .75], [.04, Y + .85]], { cx: 15.9, cz: 4.35, seg: 8, cap: 'b', col: [.8, .6, .7, 0] }); for (let i = 0; i < 4; i++) mb.box('oak', 15.88 + i * .012, Y + .85, 4.34, 15.886 + i * .012, Y + .93, 4.346, { col: [[1.4, .4, .4, 0], [.4, .6, 1.4, 0], [1.2, 1.1, .3, 0], [.5, 1.2, .5, 0]][i] });
  mb.with(M4.chain(M4.tr(15.92, Y + .752, 3.8), M4.ry(1.2)), m => m.box('diary', -.085, 0, -.06, .085, .025, .06, { fit: 1 }));
  inter('diary', [15.75, Y + .7, 3.6, 16.1, Y + .9, 4.0], 'Diary', () => P2S.diary());
  put(14.95, Y, 6.05, 'n', m => MOD.wardrobe(m, 1.6, .58, 2.1), 1.6, .62, 2.1);
  mb.box('navy', 14.35, Y + .95, 5.69, 14.8, Y + 1.75, 5.74, { bev: .02 }); mb.box('trimw', 14.5, Y + 1.5, 5.685, 14.65, Y + 1.74, 5.69); mb.tube('chrome', [[14.57, Y + 1.75, 5.715], [14.57, Y + 1.83, 5.715], [14.6, Y + 1.86, 5.74]], [.006, .006, .006], { seg: 4 });
  inter('uniform', [14.3, Y + .9, 5.55, 14.85, Y + 1.9, 5.76], 'Blazer', () => P2S.sis('uniform'));
  put(12.55, Y, 6.1, 'n', m => MOD.dresser(m, 1.1, .8), 1.1, .5, .8);
  mb.box('giftwrap', 12.3, Y + .8, 5.98, 12.62, Y + .98, 6.22, { fit: 1 }); mb.box('paper', 12.5, Y + .98, 6.0, 12.6, Y + .983, 6.08);
  inter('gift', [12.25, Y + .78, 5.9, 12.7, Y + 1.05, 6.3], 'Present', () => P2S.gift(), () => !P2.ch.gift);
  H3.extra.ribbon = single(m => { m.box('linen', 12.36, Y + .8, 6.05, 12.56, Y + .815, 6.15, { col: [.75, .1, .16, 0], bev: .005 }); m.box('paper', 12.72, Y + .8, 6.0, 12.86, Y + .803, 6.1) }, false);
  mb.box('trimw', 12.85, Y + .8, 6.12, 13.0, Y + .81, 6.22); for (let i = 0; i < 3; i++) mb.box('brass', 12.87 + i * .04, Y + .81, 6.14, 12.89 + i * .04, Y + .815, 6.2, { col: [[2, .5, .5, 0], [.5, .5, 2, 0], [1, 1, 1, 0]][i] });
  mb.box('cork', 11.465, Y + 1.25, 4.3, 11.48, Y + 1.95, 5.3, { fit: 1 }); mb.box('oak', 11.462, Y + 1.23, 4.28, 11.468, Y + 1.97, 5.32);
  inter('corkboard', [11.4, Y + 1.2, 4.25, 11.6, Y + 2, 5.35], 'Corkboard', () => P2S.sis('corkboard'));
  frame('poster2', 'n', 13.6, Y + 1.7, 6.335, .46, .62); frame('poster5', 'e', 11.475, Y + 1.7, 1.3, .4, .54); frame('poster4', 's', 14.0, Y + 1.75, .075, .4, .54);
  mb.at(12.15, Y, 5.25, .3, m => { m.box('cardboard', -.3, 0, -.25, .3, .45, .25, { us: .5 }); m.box('boxname', -.25, .1, -.255, .25, .4, -.25, { fit: 1 }); m.box('linen', -.25, .4, -.2, .2, .5, .2, { bev: .03, col: [.6, .5, .55, 0] }) }); hs(11.8, Y, 4.95, 12.5, Y + .5, 5.55);
  inter('sisbox', [11.8, Y, 4.9, 12.5, Y + .6, 5.6], 'Box', () => P2S.look('sisbox'));
  inter('sisroom', [15.2, Y, .1, 16.35, Y + .7, 2.2], 'Bed', () => P2S.look('sisroom'));
  mb.at(13.8, Y, 3.2, 0, m => MOD.ceilingLamp(m, 2.8));

  H3.extra.decor = mb.build();
  H3.extra.bowlfood = single(m => m.lathe('kibble', [[0, .05], [.085, .052]], { cx: 12.1, cz: 10.9, seg: 12 }), false);
  // ---- soft shadows under everything that stands on the floor
  const sm = new MB();
  for (const b of H3.solids) { const w = b.x1 - b.x0, d = b.z1 - b.z0, h = b.y1 - b.y0, fl = b.y0 > 2.9 ? 3 : 0; if (b.off || Math.abs(b.y0 - fl) > .06 || h < .2 || w > 3.4 || d > 3.4 || Math.min(w, d) < .16 || (b.y0 > 2.9 && b.y0 > 3.06)) continue;
    const e = .16; sm.quad('blobshadow', [b.x0 - e, fl + .017, b.z0 - e], [b.x1 + e, fl + .017, b.z0 - e], [b.x1 + e, fl + .017, b.z1 + e], [b.x0 - e, fl + .017, b.z1 + e], [[0, 0], [1, 0], [1, 1], [0, 1]]) }
  H3.extra.shadows = sm.build();
}
