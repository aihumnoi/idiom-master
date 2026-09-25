/** ทำช่องว่างในประโยคตัวอย่าง — รองรับ inflection / someone / วงเล็บ / phrasal verb */

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function stripParenthetical(phrase: string): string {
  return phrase.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
}

const SLOT_WORDS = /^(someone|somebody|something|somebody's|someone's|one's|oneself|it)$/i;
const DET_WORDS = /^(the|a|an)$/i;
const POSS_WORDS = /^(their|his|her|my|your|our|its|one's)$/i;

const IRREGULAR: Record<string, string> = {
  drop: 'drop|drops|dropping|dropped',
  drag: 'drag|drags|dragging|dragged',
  be: 'be|am|is|are|was|were|been|being',
  give: 'give|gives|given|giving|gave',
  break: 'break|breaks|breaking|broke|broken',
  grow: 'grow|grows|growing|grew|grown',
  go: 'go|goes|going|went|gone',
  sweep: 'sweep|sweeps|sweeping|swept',
  keep: 'keep|keeps|keeping|kept',
  fall: 'fall|falls|falling|fell|fallen',
  drive: 'drive|drives|driving|drove|driven',
  take: 'take|takes|taking|took|taken',
  come: 'come|comes|coming|came',
  get: 'get|gets|getting|got|gotten',
  make: 'make|makes|making|made',
  have: 'have|has|having|had',
  do: 'do|does|doing|did|done',
  see: 'see|sees|seeing|saw|seen',
  run: 'run|runs|running|ran',
  know: 'know|knows|knowing|knew|known',
  leave: 'leave|leaves|leaving|left',
  feel: 'feel|feels|feeling|felt',
  find: 'find|finds|finding|found',
  tell: 'tell|tells|telling|told',
  catch: 'catch|catches|catching|caught',
  buy: 'buy|buys|buying|bought',
  win: 'win|wins|winning|won',
  throw: 'throw|throws|throwing|threw|thrown',
  stick: 'stick|sticks|sticking|stuck',
  hold: 'hold|holds|holding|held',
  lose: 'lose|loses|losing|lost',
  pay: 'pay|pays|paying|paid',
  meet: 'meet|meets|meeting|met',
  send: 'send|sends|sending|sent',
  sit: 'sit|sits|sitting|sat',
  stand: 'stand|stands|standing|stood',
  hit: 'hit|hits|hitting',
  cut: 'cut|cuts|cutting',
  put: 'put|puts|putting',
  set: 'set|sets|setting',
  let: 'let|lets|letting',
  wear: 'wear|wears|wearing|wore|worn',
  steal: 'steal|steals|stealing|stole|stolen',
  blow: 'blow|blows|blowing|blew|blown',
  hang: 'hang|hangs|hanging|hung|hanged',
  hide: 'hide|hides|hiding|hid|hidden',
  shake: 'shake|shakes|shaking|shook|shaken',
  wake: 'wake|wakes|waking|woke|woken',
  fly: 'fly|flies|flying|flew|flown',
  draw: 'draw|draws|drawing|drew|drawn',
  rise: 'rise|rises|rising|rose|risen',
  beat: 'beat|beats|beating|beaten',
  bite: 'bite|bites|biting|bit|bitten',
  freeze: 'freeze|freezes|freezing|froze|frozen',
  lead: 'lead|leads|leading|led',
  understand: 'understand|understands|understanding|understood',
  mean: 'mean|means|meaning|meant',
  build: 'build|builds|building|built',
  sell: 'sell|sells|selling|sold',
  sleep: 'sleep|sleeps|sleeping|slept',
  strike: 'strike|strikes|striking|struck',
};

function verbFlex(word: string): string {
  const w = word.toLowerCase();
  if (IRREGULAR[w]) return `(?:${IRREGULAR[w]})`;
  const stem = w.replace(/e$/i, '');
  const alts = new Set([w, `${w}s`, `${w}es`, `${stem}ed`, `${stem}ing`, `${w}ing`, `${w}ed`]);
  return `(?:${[...alts].map(escapeRegExp).join('|')})`;
}

function wordPattern(word: string, isFirst: boolean): string {
  if (SLOT_WORDS.test(word)) return '(?:himself|herself|myself|yourself|themselves|itself|ourselves|oneself|\\S+(?:\\s+\\S+)?\\s+)?';
  if (DET_WORDS.test(word)) return '(?:(?:the|a|an)\\s+)?';
  if (POSS_WORDS.test(word)) return '(?:their|his|her|my|your|our|its|\\S+)';
  if (isFirst) return verbFlex(word);
  return escapeRegExp(word);
}

function buildFlexPattern(phrase: string): string {
  const words = stripParenthetical(phrase).split(' ').filter(Boolean);
  return words.map((w, i) => wordPattern(w, i === 0)).join('\\s*').replace(/\\s\*$/g, '').replace(/\\s\*\\s\*/g, '\\s*');
}

export function blankPhraseInSentence(phrase: string, sentence: string): string {
  if (!phrase || !sentence) return sentence || '____';
  const clean = stripParenthetical(phrase);
  const tryReplace = (pattern: string): string | null => {
    if (!pattern) return null;
    const re = new RegExp(pattern, 'i');
    if (!re.test(sentence)) return null;
    return sentence.replace(re, '____');
  };

  const exact = tryReplace(escapeRegExp(clean));
  if (exact) return exact;

  const flexed = tryReplace(buildFlexPattern(phrase));
  if (flexed) return flexed;

  const words = clean.split(' ').filter(Boolean);
  const content = words.filter(w => !SLOT_WORDS.test(w));
  const tail = content.slice(-Math.min(3, content.length)).join(' ');
  if (tail.length >= 6 && tail.toLowerCase() !== clean.toLowerCase()) {
    const tailed = tryReplace(escapeRegExp(tail));
    if (tailed) return tailed;
  }

  return `____ — ${sentence}`;
}

export function sentenceHasPhrase(phrase: string, sentence: string): boolean {
  const blanked = blankPhraseInSentence(phrase, sentence);
  return blanked.includes('____') && blanked !== `____ — ${sentence}`;
}
