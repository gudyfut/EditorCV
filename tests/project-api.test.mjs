import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { once } from 'node:events';
import { createProjectMiddleware, listResumes, readProjectResume } from '../scripts/lib/project-api.mjs';

test('catálogo local separa currículos pessoais dos exemplos públicos', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'editorcv-catalog-'));
  try {
    await mkdir(path.join(root, 'resumes'));
    await mkdir(path.join(root, 'public/resumes'), { recursive: true });
    const data = { meta: { nome: 'Pessoa de teste' }, secoes: [] };
    await writeFile(path.join(root, 'resumes', 'currículo pessoal.json'), JSON.stringify(data));
    await writeFile(path.join(root, 'resumes', 'README.md'), '# Guia');
    await writeFile(path.join(root, 'public/resumes', 'exemplo.json'), JSON.stringify(data));
    const catalog = await listResumes(root);
    assert.equal(catalog.length, 2);
    assert.ok(catalog.some(file => file.url.includes('curr%C3%ADculo%20pessoal.json')));
    assert.equal((await listResumes(root, false)).length, 1);
    assert.deepEqual(await readProjectResume(root, 'personal', 'currículo pessoal.json'), data);
    await assert.rejects(readProjectResume(root, 'personal', '../package.json'), /inválido/);
    await assert.rejects(readProjectResume(root, 'personal', '..\\package.json'), /inválido/);
    await assert.rejects(readProjectResume(root, 'arbitrary', 'file.json'), /inválido/);
    const middleware = createProjectMiddleware(root);
    const server = http.createServer((req, res) => void middleware(req, res, () => { res.writeHead(404); res.end(); }));
    server.listen(0, '127.0.0.1'); await once(server, 'listening');
    try {
      const base = `http://127.0.0.1:${server.address().port}`;
      const response = await fetch(`${base}/api/resumes`);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      const result = await response.json();
      assert.equal(result.exportPdf, true);
      assert.equal(result.files.length, 2);
      const file = result.files.find(entry => entry.folder === 'resumes');
      assert.deepEqual(await (await fetch(base + file.url)).json(), data);
      assert.equal((await fetch(`${base}/api/resumes`, { headers: { Origin: 'https://other.example' } })).status, 403);
      assert.equal((await fetch(`${base}/api/resumes/pdf`, { method: 'POST', body: '{"meta":{}}' })).status, 400);
    } finally { await new Promise(resolve => server.close(resolve)); }
  } finally { await rm(root, { recursive: true, force: true }); }
});
