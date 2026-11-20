// ==================== v63: portraits from your two emotion charts ====================
// black backgrounds: every normal text box (and the emotion guide); colour backgrounds: the battle cards
const P63 = { hitori: 'hitori', steven: 'steven', caroline: 'caroline', uku: 'uku', npc_hikari: 'hikari' };
// the game's dialogue moods -> the chart's twelve faces
const EMO63 = { neutral: 'neutral', happy: 'happy', laugh: 'manic', blush: 'ecstatic', smug: 'happy', sad: 'sad', worried: 'depressed', angry: 'angry', shock: 'afraid', scared: 'stressed', dark: 'furious',
  ecstatic: 'ecstatic', manic: 'manic', depressed: 'depressed', miserable: 'miserable', enraged: 'enraged', furious: 'furious', afraid: 'afraid', stressed: 'stressed' };
for (const k in P63) for (const e in EMO63) PORTRAITS[k + ':' + e] = loadImg('assets/portraits_v63/blk_' + P63[k] + '_' + EMO63[e] + '.png');
const PCOL63 = {};
const _cutPortrait63 = cutPortrait;
cutPortrait = function (i, e) {
  const w = P63[CH[i].key]; if (!w) return _cutPortrait63(i, e);
  const k = w + '_' + (EMO63[e] || 'neutral'); if (!PCOL63[k]) { PCOL63[k] = loadImg('assets/portraits_v63/blk_' + k + '.png'); PCOL63[k].v63 = 1 } return PCOL63[k];
};
