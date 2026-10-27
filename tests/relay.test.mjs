import test from 'node:test';
import assert from 'node:assert/strict';
import { receive } from '../service/relay.mjs';
const env = { FEISHU_WEBHOOK:'https://example.feishu.cn/base/automation/webhook/event/test', FEISHU_TOKEN:'PRIVATE' };
const payload = { event_id:'a'.repeat(64),person:'TEST-operator',event:'run',occurred_at:'2026-10-27T21:00:00+08:00',week:'2026-W44',count:1,skill:'lymow-web-design',skill_version:'1.2.0',agent:'codex' };
const req = body => new Request('https://collector.example/api/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});

test('valid event forwards only allowlisted payload; secret only sent to Feishu', async () => {
  let called = 0;
  const result = await receive(req(payload), {env, send:async (url, options) => {
    called++; assert.equal(url.hostname,'example.feishu.cn');
    assert.equal(options.headers.Authorization,'Bearer PRIVATE');
    assert.equal(options.redirect,'error'); assert.deepEqual(JSON.parse(options.body),payload);
    return Response.json({code:0});
  }});
  assert.equal(called,1); assert.equal(result.status,200); assert.deepEqual(await result.json(),{code:0});
});

test('extra fields, invalid types and oversized body are rejected without forwarding', async () => {
  for (const body of [{...payload,chat:'private'}, {...payload,count:2}, {...payload,skill_version:['1.2.0']}, {...payload,person:'x'.repeat(3000)}]) {
    const result = await receive(req(body), {env,send:() => { throw new Error('must not forward'); }});
    assert.ok([400,413].includes(result.status));
  }
});

test('downstream business error is not acknowledged; public health contains no secrets', async () => {
  const failed = await receive(req(payload), {env,send:async()=>Response.json({code:125401})});
  assert.equal(failed.status,502);
  const health = await receive(new Request('https://collector.example/api/events'), {env});
  const text=await health.text(); assert.ok(!text.includes('PRIVATE')); assert.ok(!text.includes('feishu.cn'));
});

test('paused collector and bad destination fail closed', async () => {
  const send=()=>{throw new Error('must not forward');};
  assert.equal((await receive(req(payload),{env:{...env,REPORTING_PAUSED:'1'},send})).status,503);
  assert.equal((await receive(req(payload),{env:{...env,FEISHU_WEBHOOK:'https://evil.test'},send})).status,503);
});
