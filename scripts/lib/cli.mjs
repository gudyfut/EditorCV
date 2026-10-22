import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

export const PROJECT_ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const isMain = url => Boolean(process.argv[1]) && url === pathToFileURL(path.resolve(process.argv[1])).href;

export function parseFileArgs(args, { browser = false } = {}) {
  const { values, positionals } = parseArgs({ args, allowPositionals: true, options: {
    input: { type: 'string', short: 'i' }, output: { type: 'string', short: 'o' },
    force: { type: 'boolean', short: 'f' }, help: { type: 'boolean', short: 'h' },
    ...(browser ? { browser: { type: 'string', default: 'chromium' } } : {}),
  } });
  if (positionals.length > 2) throw new Error('Informe no máximo dois caminhos: entrada e saída.');
  if (positionals.length && (values.input !== undefined || values.output !== undefined)) throw new Error('Use caminhos posicionais ou --input/--output, sem misturar as duas formas.');
  const input = values.input ?? positionals[0];
  const output = values.output ?? positionals[1];
  if (input === '' || output === '') throw new Error('Os caminhos de entrada e saída não podem ser vazios.');
  return { ...values, input, output };
}

async function statIfExists(file) {
  try { return await stat(file); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

export async function ensureNewOutput(input, output, force) {
  if (path.resolve(input) === path.resolve(output)) throw new Error('A saída não pode substituir o arquivo de entrada.');
  const [source, destination] = await Promise.all([statIfExists(input), statIfExists(output)]);
  if (source && destination && source.dev === destination.dev && source.ino === destination.ino) throw new Error('A saída não pode substituir o arquivo de entrada, mesmo por outro nome ou link.');
  if (destination?.isDirectory()) throw new Error('A saída deve incluir o nome do arquivo, não somente uma pasta.');
  if (destination && !force) throw new Error(`A saída já existe: ${output}. Use --force para substituí-la.`);
}

export async function saveOutput(output, content, force = false) {
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, content, { flag: force ? 'w' : 'wx' });
}

export function reportError(error) {
  console.error(`Erro: ${error.message}`);
  process.exitCode = 1;
}
