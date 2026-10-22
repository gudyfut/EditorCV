import test from 'node:test';
import assert from 'node:assert/strict';
import { link, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { ensureNewOutput, parseFileArgs, saveOutput } from '../scripts/lib/cli.mjs';

test('CLI aceita caminhos posicionais, nomeados e com espaços sem ambiguidades', () => {
  assert.equal(parseFileArgs(['entrada com espaços.json', 'pasta nova/saída.pdf']).output, 'pasta nova/saída.pdf');
  const named = parseFileArgs(['--input', 'entrada com espaços.json', '--output', 'pasta nova/saída.pdf', '--force'], { browser: true });
  assert.equal(named.input, 'entrada com espaços.json'); assert.equal(named.output, 'pasta nova/saída.pdf'); assert.equal(named.force, true);
  const short = parseFileArgs(['-i', 'entrada.json', '-o', 'saída.pdf', '-f']);
  assert.equal(short.force, true); assert.equal(short.output, 'saída.pdf');
  assert.throws(() => parseFileArgs(['a.json', '--output', 'b.pdf']), /sem misturar/);
  assert.throws(() => parseFileArgs(['a', 'b', 'c']), /máximo/);
  assert.throws(() => parseFileArgs(['--output', '']), /vazios/);
  assert.throws(() => parseFileArgs(['--ouput', 'typo.pdf']), /Unknown option/);
});

test('saídas criam pastas, recusam sobrescrita e preservam a entrada inclusive por outro link', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'editorcv-cli-'));
  try {
    const input = path.join(directory, 'origem.json'); const alias = path.join(directory, 'alias.pdf');
    const output = path.join(directory, 'nova pasta', 'currículo.pdf');
    await writeFile(input, 'original');
    await ensureNewOutput(input, output, false); await saveOutput(output, 'PDF teste');
    await assert.rejects(ensureNewOutput(input, output, false), /já existe/);
    await ensureNewOutput(input, output, true); await saveOutput(output, 'novo PDF', true);
    assert.equal(await readFile(output, 'utf8'), 'novo PDF');
    await assert.rejects(ensureNewOutput(input, input, true), /arquivo de entrada/);
    await link(input, alias);
    await assert.rejects(ensureNewOutput(input, alias, true), /arquivo de entrada/);
    assert.equal(await readFile(input, 'utf8'), 'original');
    const folder = path.join(directory, 'pasta.pdf'); await mkdir(folder);
    await assert.rejects(ensureNewOutput(input, folder, true), /não somente uma pasta/);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
