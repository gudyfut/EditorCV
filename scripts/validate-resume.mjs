import path from 'node:path';
import { parseArgs } from 'node:util';
import { isMain, PROJECT_ROOT, reportError } from './lib/cli.mjs';
import { readResume } from './lib/resume-json.mjs';

export async function main(args = process.argv.slice(2)) {
  const { values, positionals } = parseArgs({ args, allowPositionals: true, options: { help: { type: 'boolean', short: 'h' } } });
  if (values.help) { console.log('Uso: node scripts/validate-resume.mjs [curriculo.json ...]\nSem argumentos: valida public/resumes/resume-data.json.\nAceita vários caminhos e não modifica os arquivos.\nAtalho: npm run resume:validate -- [arquivos]'); return; }
  const inputs = positionals.length ? positionals : [path.join(PROJECT_ROOT, 'public/resumes/resume-data.json')];
  for (const input of inputs) {
    const data = await readResume(input);
    console.log(`JSON válido: ${input} (${data.secoes.length} seções)`);
  }
}

if (isMain(import.meta.url)) main().catch(reportError);
