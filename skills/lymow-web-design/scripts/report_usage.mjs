#!/usr/bin/env node
// Disclosed task-start reporting. No dependencies; never reads project/chat content.
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const hash = value => createHash('sha256').update(value).digest('hex');
export const NOTICE = 'Lymow 使用统计：自动发送固定匿名编号（或明确提供的姓名）、安装登记/任务开始、时间、周、版本和Agent到维护者飞书表；不发送聊天、文案、文件或素材。可用 disable 停止。';
const defaultRoot = () => process.env.LYMOW_USAGE_HOME || path.join(os.homedir(), '.config', 'lymow-skill-usage');
async function read(file, fallback) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); }
  catch (e) { if (e.code === 'ENOENT') return fallback; throw e; }
}
async function save(file, value) {
  const temp = `${file}.${randomUUID()}.tmp`;
  await fs.writeFile(temp, JSON.stringify(value, null, 2), { mode: 0o600 });
  await fs.rename(temp, file);
}
export function timeFields(now = new Date()) {
  const local = new Date(now.getTime() + 8 * 3600000);
  const occurred_at = local.toISOString().slice(0, 19) + '+08:00';
  const day = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()));
  day.setUTCDate(day.getUTCDate() + 4 - (day.getUTCDay() || 7));
  const year = day.getUTCFullYear();
  const week = Math.ceil((((day - new Date(Date.UTC(year, 0, 1))) / 86400000) + 1) / 7);
  return { occurred_at, week: `${year}-W${String(week).padStart(2, '0')}` };
}
async function releaseSettings() {
  const dir = path.dirname(fileURLToPath(import.meta.url));
  const settings = await read(path.join(dir, '../references/reporting.json'), {});
  const skill = await fs.readFile(path.join(dir, '../SKILL.md'), 'utf8');
  return { endpoint: settings.endpoint, version: skill.match(/^  version: ["']?([0-9.]+)/m)?.[1] };
}

export async function run(args, { root = defaultRoot(), send = fetch, log = console.log,
  settings, now = () => new Date(), disabled = process.env.LYMOW_USAGE_DISABLED === '1' } = {}) {
  const [command, ...options] = args;
  if (!['record', 'status', 'disable', 'enable', 'flush'].includes(command)) throw new Error('invalid command');
  const allowed = new Set(['--task-id', '--agent', '--person']);
  const values = {};
  for (let i = 0; i < options.length; i += 2) {
    if (!allowed.has(options[i]) || options[i + 1] === undefined) throw new Error('invalid argument');
    values[options[i]] = options[i + 1];
  }
  const task = values['--task-id']; const agent = values['--agent'] || 'other';
  const person = values['--person']?.trim();
  if (!['codex', 'claude-code', 'cursor', 'other'].includes(agent)) throw new Error('invalid agent');
  if (command === 'record' && (!task || task.length > 200)) throw new Error('task ID required');
  if (person && (person.length > 80 || /[\x00-\x1f\x7f]/.test(person))) throw new Error('invalid name');
  const configFile = path.join(root, 'config.json');
  if (command === 'status') {
    const cfg = await read(configFile, {});
    log(JSON.stringify({ enabled: !disabled && cfg.enabled !== false, person: cfg.person || null, mode: 'automatic' }));
    return;
  }
  if (disabled && !['disable', 'enable'].includes(command)) { log('统计已由环境设置停用。'); return; }
  await fs.mkdir(root, { recursive: true, mode: 0o700 });
  const lockFile = path.join(root, 'report.lock');
  let lock;
  for (let i = 0; i < 25; i++) {
    try { lock = await fs.open(lockFile, 'wx', 0o600); break; }
    catch (e) {
      if (e.code !== 'EEXIST') throw e;
      // Recover a lock left by a crashed process; normal calls take under 40 seconds.
      try { if (Date.now() - (await fs.stat(lockFile)).mtimeMs > 120000) await fs.unlink(lockFile); }
      catch (err) { if (err.code !== 'ENOENT') throw err; }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  if (!lock) { log('统计繁忙，未新增记录；页面工作可继续。'); return; }
  try {
    let cfg = await read(configFile, {});
    if (command === 'disable' || command === 'enable') {
      cfg.enabled = command === 'enable';
      await save(configFile, cfg);
      log(command === 'disable' ? '统计已停用。' : NOTICE);
      return;
    }
    if (cfg.enabled === false) { log('统计已停用。'); return; }
    if (command === 'flush' && !cfg.registration_id) { log('没有待发送记录。'); return; }
    settings ||= await releaseSettings();
    const endpoint = new URL(settings.endpoint);
    if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.search || endpoint.hash) throw new Error('invalid receiver');
    const queueFile = path.join(root, 'report-events.json');
    const events = await read(queueFile, []);
    if (!Array.isArray(events)) throw new Error('invalid queue');
    if (!cfg.registration_id) {
      const id = randomUUID();
      cfg = { ...cfg, enabled: true, registration_id: id, person: person || `同事-${hash(id).slice(0, 16)}` };
      await save(configFile, cfg);
      log(NOTICE);
      log(`统计身份：${cfg.person}`);
    }
    const add = (kind, taskID) => {
      const event_id = hash(`${cfg.registration_id}:${kind}:${taskID}`);
      if (!events.some(e => e.payload.event_id === event_id)) events.push({ accepted: false, payload: {
        event_id, person: cfg.person, event: kind, ...timeFields(now()), count: 1,
        skill: 'lymow-web-design', skill_version: settings.version, agent,
      } });
    };
    if (command === 'record') {
      // v1.1 enrolled copies already registered installation in the legacy SQLite queue.
      if (!cfg.consent_at) add('install', 'first-enrollment');
      add('run', task);
    }
    await save(queueFile, events);
    let accepted = 0;
    for (const event of events.filter(e => !e.accepted).slice(0, 3)) {
      try {
        const result = await send(endpoint, { method: 'POST', redirect: 'error',
          signal: AbortSignal.timeout(10000), headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event.payload) });
        if (!result.ok || (await result.json()).code !== 0) throw new Error('not accepted');
        event.accepted = true; accepted++;
        await save(queueFile, events);
      } catch { log('统计暂未送达，已留在本机，下次调用补发；页面工作可继续。'); break; }
    }
    log(JSON.stringify({ webhook_accepted: accepted, pending: events.filter(e => !e.accepted).length }));
  } finally {
    await lock.close(); await fs.unlink(lockFile);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run(process.argv.slice(2)).catch(() => {
    console.error('统计操作未完成，请检查本机运行环境；不影响页面任务。'); process.exitCode = 1;
  });
}
