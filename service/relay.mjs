// Public write-only collector. Feishu credentials exist only in deployment secrets.
const fields = ['event_id', 'person', 'event', 'occurred_at', 'week', 'count', 'skill', 'skill_version', 'agent'];
const agents = ['codex', 'claude-code', 'cursor', 'other'];
const reply = (status, code, extra = {}) => Response.json({ code, ...extra }, {
  status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
});

export function validEvent(p) {
  return p && typeof p === 'object' && !Array.isArray(p)
    && Object.keys(p).length === fields.length && fields.every(k => Object.hasOwn(p, k))
    && fields.filter(k => k !== 'count').every(k => typeof p[k] === 'string')
    && /^[a-f0-9]{64}$/.test(p.event_id) && typeof p.person === 'string'
    && p.person.length > 0 && p.person.length <= 80 && !/[\x00-\x1f\x7f]/.test(p.person)
    && ['install', 'run'].includes(p.event) && p.count === 1
    && typeof p.occurred_at === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+08:00$/.test(p.occurred_at)
    && Number.isFinite(Date.parse(p.occurred_at)) && /^\d{4}-W(?:0[1-9]|[1-4]\d|5[0-3])$/.test(p.week)
    && p.skill === 'lymow-web-design' && /^\d+\.\d+\.\d+$/.test(p.skill_version)
    && agents.includes(p.agent);
}

export async function receive(request, { env = process.env, send = fetch } = {}) {
  if (request.method === 'GET') return reply(200, 0, { service: 'lymow-skill-reporting', writes: 'POST only' });
  if (request.method !== 'POST') return reply(405, 'method_not_allowed');
  if (env.REPORTING_PAUSED === '1') return reply(503, 'temporarily_unavailable');
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return reply(415, 'json_required');
  if (Number(request.headers.get('content-length')) > 2048) return reply(413, 'too_large');
  let payload;
  try {
    // Bound actual streamed bytes too; do not trust Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return reply(400, 'invalid_event');
    const chunks = []; let length = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 2048) { await reader.cancel(); return reply(413, 'too_large'); }
      chunks.push(value);
    }
    payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch { return reply(400, 'invalid_event'); }
  if (!validEvent(payload)) return reply(400, 'invalid_event');
  try {
    const target = new URL(env.FEISHU_WEBHOOK);
    if (target.protocol !== 'https:' || !target.hostname.endsWith('.feishu.cn')
        || target.username || target.password || (target.port && target.port !== '443')
        || !target.pathname.startsWith('/base/automation/webhook/event/') || !env.FEISHU_TOKEN) {
      return reply(503, 'receiver_not_configured');
    }
    const response = await send(target, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(6000),
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.FEISHU_TOKEN}` },
      body: JSON.stringify(payload),
    });
    if (!response.ok || (await response.json()).code !== 0) return reply(502, 'delivery_not_accepted');
    return reply(200, 0);
  } catch {
    // Never log incoming bodies, names, credentials or upstream exception details.
    console.error('usage_delivery_failed');
    return reply(502, 'delivery_not_accepted');
  }
}
