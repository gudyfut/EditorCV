import path from 'node:path';
import { ensureNewOutput, isMain, parseFileArgs, PROJECT_ROOT, reportError, saveOutput } from './lib/cli.mjs';
import { readResume } from './lib/resume-json.mjs';
import { renderPdf } from './lib/render-pdf.mjs';

export async function main(args = process.argv.slice(2)) {
  const values = parseFileArgs(args, { browser: true });
  if (values.help) {
    console.log('Uso: node scripts/export-resume-pdf.mjs [curriculo.json] [saida.pdf] [--force]\n  ou node scripts/export-resume-pdf.mjs --input curriculo.json --output saida.pdf\nOpções: -i/--input, -o/--output, -f/--force, -h/--help, --browser chromium|msedge|chrome\nSem argumentos: public/resumes/resume-data.json → output/resumes/resume-data.pdf\nInforme um arquivo .pdf na saída; as pastas são criadas automaticamente. Caminhos relativos usam a pasta atual.\nAtalho: npm run resume:pdf -- [argumentos] (no PowerShell, use npm.cmd para flags).');
    return;
  }
  if (!['chromium', 'msedge', 'chrome'].includes(values.browser)) throw new Error('--browser deve ser chromium, msedge ou chrome.');
  const input = path.resolve(values.input ?? path.join(PROJECT_ROOT, 'public/resumes/resume-data.json'));
  const output = path.resolve(values.output ?? path.join(PROJECT_ROOT, 'output/resumes', `${path.basename(input, path.extname(input))}.pdf`));
  if (path.extname(output).toLowerCase() !== '.pdf') throw new Error('O arquivo de saída deve ter extensão .pdf.');
  const data = await readResume(input);
  await ensureNewOutput(input, output, values.force);
  console.log('Gerando PDF com o layout do aplicativo...');
  const buffer = await renderPdf(data, { browser: values.browser });
  await saveOutput(output, buffer, values.force);
  console.log(`PDF salvo: ${output}`);
}

if (isMain(import.meta.url)) main().catch(reportError);
