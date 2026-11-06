const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../server');
test('Express application is created', () => { assert.equal(typeof app, 'function'); });
test('health endpoint is registered', async () => {
  const server = app.listen(0);
  try { const r = await fetch(`http://127.0.0.1:${server.address().port}/api/health`); const d = await r.json(); assert.equal(r.status, 200); assert.equal(d.status, 'ok'); }
  finally { server.close(); }
});
