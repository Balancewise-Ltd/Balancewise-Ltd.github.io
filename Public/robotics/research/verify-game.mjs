import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const context = vm.createContext({ console });
for (const name of ['course', 'engine', 'slide-index']) vm.runInContext(read(`assets/${name}.js`), context);
const course = vm.runInContext('COURSE', context);
const sections = course.weeks.flatMap(week => week.sections);
const E = context.CourseEngine;
assert.equal(sections.length, 112);
assert.equal(sections.reduce((n, s) => n + s.cards.length, 0), 455);
assert.equal(sections.reduce((n, s) => n + s.quiz.length, 0), 337);
assert.equal(new Set(sections.map(s => s.id)).size, 112);
assert.equal(JSON.stringify(course), JSON.stringify(JSON.parse(read('research/course.json'))));
assert.equal(course.version, E.VERSION);
const index = JSON.parse(read('research/slide-index.json'));
assert.equal(JSON.stringify(vm.runInContext('SLIDE_INDEX', context)), JSON.stringify(index.documents));
assert.equal(JSON.stringify(vm.runInContext('SLIDE_ALIASES', context)), JSON.stringify(index.aliases));
assert.equal(Object.keys(index.documents).length, 20);
assert.equal(Object.values(index.documents).reduce((n, rows) => n + rows.length, 0), 517);
for (const file of Object.values(index.aliases)) assert(index.documents[file]);
for (const week of course.weeks) {
  if (week.support) continue;
  let seenDemonstration = false;
  for (const section of week.sections) {
    const demonstration = section.source.file.includes('Demonstration');
    assert(!(seenDemonstration && !demonstration), section.id);
    seenDemonstration ||= demonstration;
  }
}

const state = E.fresh();
assert(E.unlocked(state, sections, sections[0].id));
assert(!E.unlocked(state, sections, sections[1].id));
assert.throws(() => E.choose(state, sections, sections[1].id));
for (const section of sections) {
  assert(section.source.file && section.source.pages);
  const rows = index.documents[index.aliases[section.source.file] || section.source.file];
  assert(rows, section.id);
  const pages = new Set(rows.map(row => row.page));
  const ranges = [...section.source.pages.matchAll(/(\d+)(?:\s*[–-]\s*(\d+))?/g)];
  assert(ranges.length > 0);
  for (const [, start, end] of ranges) for (let page = +start; page <= +(end || start); page++) assert(pages.has(page), section.id);
  assert(section.cards.length >= 3 && section.quiz.length >= 3);
  for (const card of section.cards) assert(card.title && card.text.length && card.text.every(t => typeof t === 'string' && t));
  for (const q of section.quiz) {
    assert(q.choices.length >= 3 && q.prompt && q.why && q.remediate);
    assert.equal(new Set(q.choices).size, q.choices.length);
    assert(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.choices.length);
  }
  for (const reference of section.research || []) assert(reference.url.startsWith('https://') && reference.title && reference.addition && reference.anchor);
  const session = E.choose(state, sections, section.id);
  assert.throws(() => E.startQuiz(state, session));
  while (session.card < section.cards.length - 1) E.advance(session);
  E.startQuiz(state, session);
  const previous = state.completed.length;
  assert(!E.answer(state, sections, session, (section.quiz[0].answer + 1) % section.quiz[0].choices.length));
  assert.equal(session.stage, 'failed');
  assert.equal(session.card, 0);
  assert.equal(state.completed.length, previous);
  assert.throws(() => E.nextQuestion(state, sections, session));
  E.restart(session);
  assert.throws(() => E.startQuiz(state, session));
  while (session.card < section.cards.length - 1) E.advance(session);
  E.startQuiz(state, session);
  for (const [index, q] of section.quiz.entries()) {
    assert(E.answer(state, sections, session, q.answer));
    assert.throws(() => E.answer(state, sections, session, q.answer));
    assert.equal(E.nextQuestion(state, sections, session), index === section.quiz.length - 1);
  }
  assert.equal(state.completed.length, previous + 1);
  assert.equal(E.shuffle(section.quiz[0], section.id).filter(c => c.index === section.quiz[0].answer).length, 1);
}
assert.equal(E.clean(JSON.parse(JSON.stringify(state)), sections).completed.length, 112);
const replay = E.choose(state, sections, sections[0].id);
while (replay.card < replay.section.cards.length - 1) E.advance(replay);
E.startQuiz(state, replay);
E.answer(state, sections, replay, (replay.section.quiz[0].answer + 1) % replay.section.quiz[0].choices.length);
assert.equal(state.completed.length, 112, 'A failed replay preserves earlier completion');
const legacy = { ...JSON.parse(JSON.stringify(state)), version: 'study1234-2026-10-11-v1' };
assert.equal(E.clean(legacy, sections).completed.length, 112);
assert.equal(E.clean(legacy, sections).version, E.VERSION);
assert.equal(E.clean({ ...legacy, version: 'other' }, sections).completed.length, 0);
const gap = E.clean({ version: E.VERSION, completed: [sections[0].id, sections[2].id], attempts: { [sections[0].id]: -7 }, resume: { id: sections[2].id, card: 999 } }, sections);
assert.equal(gap.completed.length, 1);
assert.equal(gap.resume, null);
assert.equal(gap.attempts[sections[0].id], undefined);
for (const file of ['app', 'audio-player']) new vm.Script(read(`assets/${file}.js`));
console.log('PASS: all 112 sections, 455 steps, 337 questions, 517 index entries, source ranges, reading gates, retries, unlocks, imports and legacy compatibility.');

if (!process.argv.includes('--source-only')) {
  vm.runInContext(read('assets/audio-manifest.js'), context);
  const manifest = context.COURSE_AUDIO;
  assert.equal(manifest.courseSha256, hash(readFileSync(new URL('research/course.json', root))));
  assert.equal(Object.keys(manifest.sections).length, sections.length);
  const files = new Set();
  for (const section of sections) {
    const group = manifest.sections[section.id];
    assert.equal(group.steps.length, section.cards.length);
    assert(group.section.duration > group.steps.reduce((sum, track) => sum + track.duration, 0));
    for (const track of [...group.steps, group.section]) {
      assert(track.src.startsWith(`audio/${section.id}/`));
      assert(!track.src.includes('..'));
      assert(track.duration > 0);
      const bytes = readFileSync(new URL(track.src, root));
      assert.equal(bytes.length, track.bytes);
      assert.equal(hash(bytes), track.sha256, fileURLToPath(new URL(track.src, root)));
      assert(!files.has(track.src));
      files.add(track.src);
    }
  }
  assert.equal(files.size, 567);
  const inventory = readdirSync(new URL('audio/', root), { recursive: true, withFileTypes: true });
  assert.equal(inventory.filter(entry => entry.isFile()).length, files.size, 'Remove obsolete or partial audio files before release');
  console.log('PASS: all 567 audio files match the course, manifest, sizes and content hashes.');
}
