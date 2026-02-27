import { getMoonPhaseForDate, getMoonIllumination, getMoonZodiac, isMoonWaxing, getNextVollmond, getNextNeumond, getExakteHauptphasen, formatMondDatum } from './lib/moon-phase';

// Test today (26 Feb 2026)
const today = new Date('2026-02-26T12:00:00Z');
const phase = getMoonPhaseForDate(today);
const illum = getMoonIllumination(today);
const zodiac = getMoonZodiac(today);
const waxing = isMoonWaxing(today);
const nextVM = getNextVollmond();
const nextNM = getNextNeumond();

console.log('=== HEUTE 26. Feb 2026 ===');
console.log('Phase:', phase.name, phase.emoji);
console.log('Beleuchtung:', illum, '%');
console.log('Tierkreis:', zodiac.name, zodiac.symbol);
console.log('Zunehmend:', waxing);
console.log('Nächster Vollmond:', nextVM.toISOString());
console.log('Nächster Neumond:', nextNM.toISOString());

// Test key dates
const testDates = [
  { date: '2026-03-03T11:37:00Z', expected: 'Vollmond' },
  { date: '2026-03-19T01:23:00Z', expected: 'Neumond' },
  { date: '2026-02-24T12:27:00Z', expected: 'Erstes Viertel' },
  { date: '2026-02-17T12:01:00Z', expected: 'Neumond' },
  { date: '2026-02-09T12:43:00Z', expected: 'Letztes Viertel' },
  { date: '2026-02-01T22:09:00Z', expected: 'Vollmond' },
];

console.log('\n=== HAUPTPHASEN-TEST ===');
for (const t of testDates) {
  const d = new Date(t.date);
  const p = getMoonPhaseForDate(d);
  const z = getMoonZodiac(d);
  const ok = p.name === t.expected ? 'OK' : 'FEHLER';
  console.log(`${t.date}: ${p.name} ${p.emoji} (${z.name} ${z.symbol}) - erwartet: ${t.expected} → ${ok}`);
}

// Test illumination progression
console.log('\n=== BELEUCHTUNG FEBRUAR 2026 ===');
for (let day = 1; day <= 28; day++) {
  const d = new Date(`2026-02-${String(day).padStart(2,'0')}T12:00:00Z`);
  const p = getMoonPhaseForDate(d);
  const i = getMoonIllumination(d);
  const z = getMoonZodiac(d);
  console.log(`${day}. Feb: ${p.emoji} ${p.name.padEnd(20)} ${String(i).padStart(3)}% ${z.symbol} ${z.name}`);
}
