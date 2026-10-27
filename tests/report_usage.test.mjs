import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { run, timeFields } from '../skills/lymow-web-design/scripts/report_usage.mjs';

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lymow-report-test-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const sent = [];
  const opts = { root, log: () => {}, disabled: false,
    settings: { endpoint: 'https://collector.example/api/events', version: '1.2.0' },
    send: async (_url, request) => { sent.push(JSON.parse(request.body)); return Response.json({ code: 0 }); },
  };
  return { root, sent, opts };
}

test('fresh use automatically registers install and run; repeated task is deduplicated', async t => {
  const { root, sent, opts } = await fixture(t);
  for (const task of ['a', 'a', 'b']) await run(['record', '--task-id', task, '--agent', 'codex'], opts);
  assert.deepEqual(sent.map(e => e.event), ['install', 'run', 'run']);
  assert.match(sent[0].person, /^同事-[a-f0-9]{16}$/);
  assert.equal(new Set(sent.map(e => e.person)).size, 1);
  assert.equal(new Set(sent.map(e => e.event_id)).size, 3);
  assert.equal(sent[0].person, JSON.parse(await fs.readFile(path.join(root, 'config.json'))).person);
  assert.deepEqual(Object.keys(sent[0]).sort(), ['agent','count','event','event_id','occurred_at','person','skill','skill_version','week']);
});

test('fresh configurations have distinct anonymous identities', async t => {
  const a = await fixture(t), b = await fixture(t);
  await run(['record', '--task-id', 'same'], a.opts);
  await run(['record', '--task-id', 'same'], b.opts);
  assert.notEqual(a.sent[0].person, b.sent[0].person);
  assert.notEqual(a.sent[1].event_id, b.sent[1].event_id);
});

test('first explicit name persists; later mentions do not silently switch people', async t => {
  const { sent, opts } = await fixture(t);
  await run(['record', '--task-id', 'a', '--person', 'TEST-operator'], opts);
  await run(['record', '--task-id', 'b', '--person', 'Another'], opts);
  assert.ok(sent.every(e => e.person === 'TEST-operator'));
});

test('disabled before first use does not enroll or send', async t => {
  const { root, sent, opts } = await fixture(t);
  await run(['disable'], opts);
  await run(['record', '--task-id', 'a'], opts);
  assert.equal(sent.length, 0);
  assert.equal(JSON.parse(await fs.readFile(path.join(root,'config.json'))).registration_id, undefined);
  await assert.rejects(fs.access(path.join(root, 'report-events.json')));
});

test('environment opt-out and status make no network call', async t => {
  const { sent, opts } = await fixture(t);
  await run(['record', '--task-id', 'a'], { ...opts, disabled: true });
  await run(['status'], opts);
  assert.equal(sent.length, 0);
});

test('failed delivery is retried with original identity and timestamps', async t => {
  const { root, sent, opts } = await fixture(t);
  await run(['record', '--task-id', 'offline'], { ...opts, send: async () => { throw new Error('offline'); } });
  const queued = JSON.parse(await fs.readFile(path.join(root,'report-events.json')));
  await run(['flush'], opts);
  assert.deepEqual(sent, queued.map(e => e.payload));
});

test('legacy enrollment identity and opt-out are respected; no duplicate installation', async t => {
  const { root, sent, opts } = await fixture(t);
  await fs.writeFile(path.join(root,'config.json'), JSON.stringify({ enabled:true, person:'Existing',registration_id:'old-id',consent_at:'2026-10-27',token:'PRIVATE',webhook:'PRIVATE' }));
  await run(['record', '--task-id', 'a'], opts);
  assert.equal(sent.length, 1); assert.equal(sent[0].event, 'run');
  assert.equal(sent[0].person, 'Existing'); assert.ok(!JSON.stringify(sent).includes('PRIVATE'));
});

test('concurrent same-task invocations send a single install and run', async t => {
  const { sent, opts } = await fixture(t);
  await Promise.all([run(['record','--task-id','a'], opts), run(['record','--task-id','a'], opts)]);
  assert.equal(sent.length, 2);
});

test('ISO week respects Shanghai calendar across year boundaries', () => {
  assert.deepEqual(timeFields(new Date('2021-01-03T16:00:00Z')), { occurred_at:'2021-01-04T00:00:00+08:00',week:'2021-W01' });
  assert.equal(timeFields(new Date('2021-01-01T00:00:00Z')).week, '2020-W53');
});
