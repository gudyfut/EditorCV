import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { ensureNewOutput, isMain, parseFileArgs, PROJECT_ROOT, reportError, saveOutput } from './lib/cli.mjs';

export async function extractPdf(input) {
  const task = getDocument({ data: new Uint8Array(await readFile(input)), isEvalSupported: false, useSystemFonts: true });
  try {
    const document = await task.promise;
    const pages = [];
    for (let number = 1; number <= document.numPages; number++) {
      const page = await document.getPage(number);
      const content = await page.getTextContent();
      const text = content.items.filter(item => 'str' in item).map(item => item.str + (item.hasEOL ? '\n' : ' ')).join('').trim();
      const links = (await page.getAnnotations()).filter(item => item.subtype === 'Link' && item.url).map(item => item.url);
      pages.push({ number, text, links: [...new Set(links)] });
      page.cleanup();
    }
    return pages;
  } finally { await task.destroy(); }
}

export async function main(args = process.argv.slice(2)) {
  const values = parseFileArgs(args);
  if (values.help) { console.log('Uso: node scripts/extract-resume-pdf.mjs entrada.pdf [saida.txt] [--force]\n  ou node scripts/extract-resume-pdf.mjs --input entrada.pdf --output saida.txt\nOpções: -i/--input, -o/--output, -f/--force, -h/--help\nSaída padrão: input/resumes/<nome-do-pdf>.txt, dentro do projeto.\nInforme um arquivo .txt na saída; as pastas são criadas automaticamente. Caminhos relativos usam a pasta atual.\nExtrai texto e links locais; não executa OCR nem cria o JSON automaticamente.'); return; }
  if (!values.input) throw new Error('Informe um PDF de entrada e, opcionalmente, um TXT de saída.');
  const input = path.resolve(values.input);
  const output = path.resolve(values.output ?? path.join(PROJECT_ROOT, 'input/resumes', `${path.basename(input, path.extname(input))}.txt`));
  if (path.extname(output).toLowerCase() !== '.txt') throw new Error('O arquivo de saída deve ter extensão .txt.');
  await ensureNewOutput(input, output, values.force);
  const pages = await extractPdf(input);
  const empty = pages.filter(page => !page.text.trim());
  if (empty.length === pages.length) throw new Error('PDF sem texto extraível. Pode ser digitalizado: use leitura visual/OCR antes de criar o JSON.');
  const text = pages.map(page => `--- Página ${page.number} ---\n${page.text}\n${page.links.length ? `\nLinks:\n${page.links.join('\n')}\n` : ''}`).join('\n');
  await saveOutput(output, text, values.force);
  console.log(`Texto e links extraídos: ${output} (${pages.length} páginas)`);
  if (empty.length) console.warn(`Sem texto nas páginas ${empty.map(page => page.number).join(', ')}. Confira essas páginas visualmente ou com OCR.`);
}

if (isMain(import.meta.url)) main().catch(reportError);
