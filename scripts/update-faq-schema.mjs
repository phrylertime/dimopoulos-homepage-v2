// Rebuilds the FAQPage JSON-LD in faq.html from the visible Q&A, so the
// structured data always matches the page word for word (Google requires
// that). Run after editing any question or answer on /faq:
//   node scripts/update-faq-schema.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = 'faq.html';
const html = readFileSync(FILE, 'utf8');

const decode = (text) =>
  text
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

const blocks = [...html.matchAll(/<details>([\s\S]*?)<\/details>/g)].map((match) => match[1]);
const questions = blocks.map((block) => {
  const ask = block.match(/<span class="ask">([\s\S]*?)<\/span>/);
  const answer = block.match(/<div class="answer">([\s\S]*?)<\/div>/);
  if (!ask || !answer) throw new Error(`Unparseable FAQ block:\n${block.slice(0, 200)}`);
  return {
    '@type': 'Question',
    name: decode(ask[1]),
    acceptedAnswer: { '@type': 'Answer', text: decode(answer[1]) },
  };
});
if (questions.length === 0) throw new Error('No questions found in faq.html');

const leftover = questions.flatMap((q) => [q.name, q.acceptedAnswer.text]).join(' ').match(/&[a-z#0-9]+;/gi);
if (leftover) throw new Error(`Undecoded HTML entities: ${[...new Set(leftover)].join(' ')}; add them to decode()`);

const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://www.dimolaw.com/faq#faq',
  url: 'https://www.dimolaw.com/faq',
  mainEntity: questions,
};
const json = JSON.stringify(schema, null, 2).replace(/^/gm, '  ');
const block = `  <script type="application/ld+json">\n${json}\n  </script>\n`;

const existing = /  <script type="application\/ld\+json">\n  \{\n    "@context": "https:\/\/schema\.org",\n    "@type": "FAQPage"[\s\S]*?<\/script>\n/;
let updated;
if (existing.test(html)) {
  updated = html.replace(existing, block);
} else {
  if ((html.match(/<\/head>/g) || []).length !== 1) throw new Error('Expected exactly one </head> in faq.html');
  updated = html.replace('</head>', `${block}</head>`);
}

writeFileSync(FILE, updated);
console.log(`faq.html: ${questions.length} questions written to FAQPage schema${updated === html ? ' (no change)' : ''}`);
