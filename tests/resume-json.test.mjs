import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readResume, validateResume } from '../scripts/lib/resume-json.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const template = JSON.parse(await readFile(new URL('../examples/resume-template.json', import.meta.url), 'utf8'));
const fresh = () => structuredClone(template);

test('os exemplos antigos e o modelo passam pelo contrato atual', async () => {
  for (const name of ['resume-data.json', 'resume-data-en.json', 'resume-data-2.json', 'resume-data-2-en.json']) {
    await readResume(path.join(root, 'public/resumes', name));
  }
  validateResume(template);
  validateResume({ meta: { nome: 'Pessoa' }, secoes: [] });
});

test('rejeita estrutura antiga, tipos incorretos e campos que o template não lê', () => {
  for (const change of [
    data => { data.secoes = {}; },
    data => { data.secoes[0].visivel = 'true'; },
    data => { data.secoes[3].grupos = [{ label: 'Stack', itens: 'React, Node' }]; },
    data => { data.secoes[1].itens = [{ id: '1', titulo: 'Cargo', empresa: 'Empresa' }]; },
    data => { data.secoes[0].itens = ['Texto']; },
    data => { data.layout.fontFamily = 'Fonte inexistente'; },
    data => { data.layout.pageMargin = 0; },
    data => { data.meta.email = null; },
  ]) {
    const data = fresh(); change(data);
    assert.throws(() => validateResume(data), /JSON incompatível/);
  }
});

test('rejeita IDs e ordens duplicadas sem alterar os dados', () => {
  const data = fresh(); data.secoes[1].id = data.secoes[0].id;
  assert.throws(() => validateResume(data), /ID de seção repetido/);
  const order = fresh(); order.secoes[1].ordem = 1;
  assert.throws(() => validateResume(order), /Ordem de seção repetida/);
  const items = fresh(); items.secoes[1].itens = [{ id: 'mesmo', titulo: 'A' }, { id: 'mesmo', titulo: 'B' }];
  assert.throws(() => validateResume(items), /ID de item repetido/);
});

test('aceita UTF-8 com BOM e retorna status de erro no terminal para dados inválidos', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'editorcv-json-'));
  try {
    const input = path.join(directory, 'currículo com espaços.json');
    await writeFile(input, '\uFEFF' + JSON.stringify(template));
    await readResume(input);
    await writeFile(input, '{"meta":{},"secoes":[]}');
    const result = spawnSync(process.execPath, [path.join(root, 'scripts/validate-resume.mjs'), input], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /nome/);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
