import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { chromium } from 'playwright';
import { readResume } from '../scripts/lib/resume-json.mjs';
import { buildRenderer, renderPdf } from '../scripts/lib/render-pdf.mjs';
import { main as exportMain } from '../scripts/export-resume-pdf.mjs';
import { extractPdf, main as extractMain } from '../scripts/extract-resume-pdf.mjs';
import { PROJECT_ROOT } from '../scripts/lib/cli.mjs';

const browser = process.env.EDITORCV_TEST_BROWSER ?? 'chromium';

async function readPdf(buffer) {
  const task = getDocument({ data: new Uint8Array(buffer), isEvalSupported: false });
  try {
    const document = await task.promise;
    const pages = [];
    for (let i = 1; i <= document.numPages; i++) {
      const page = await document.getPage(i);
      const text = (await page.getTextContent()).items.filter(item => 'str' in item).map(item => item.str).join(' ');
      const links = (await page.getAnnotations()).filter(item => item.url).map(item => item.url);
      pages.push({ text, links, width: page.view[2], height: page.view[3] });
    }
    return pages;
  } finally { await task.destroy(); }
}

test('exportação real, extração e paginação, sem servidor web', { timeout: 120000 }, async t => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'editorcv-pdf-'));
  try {
    const renderer = await buildRenderer();
    await t.test('o inglês antigo exporta em uma página A4 com conteúdo e links', async () => {
      const data = await readResume(path.join(PROJECT_ROOT, 'public/resumes/resume-data-en.json'));
      const pdf = await renderPdf(data, { browser, renderer });
      const pages = await readPdf(pdf);
      assert.equal(pages.length, 1);
      assert.match(pages[0].text, /PROFESSIONAL OBJECTIVE/);
      assert.match(pages[0].text, /Portuguese: native/);
      assert.ok(pages[0].links.includes('https://github.com/gudyfut'));
      assert.ok(Math.abs(pages[0].width - 595.28) < 1);
      assert.ok(Math.abs(pages[0].height - 841.89) < 1);
    });

    await t.test('currículo longo preserva todos os tipos de módulo e não gera páginas vazias', async () => {
      const data = await readResume(path.join(PROJECT_ROOT, 'examples/resume-template.json'));
      data.meta.nome = 'Pessoa de teste';
      data.meta.portfolio = 'https://example.com/portfolio';
      data.meta.portfolioTexto = 'Meu portfólio';
      data.layout = { fontFamily: 'georgia', pageMargin: 20, sectionSpacing: 18, itemSpacing: 8, accentColor: '#2563eb', textAlign: 'left' };
      data.secoes = [
        { id: 'resumo', tipo: 'text', titulo: 'RESUMO', visivel: true, ordem: 1, conteudo: 'Informações de teste com acentuação.' },
        { id: 'skills', tipo: 'grouped_list', titulo: 'FERRAMENTAS', visivel: true, ordem: 2, grupos: [{ label: 'Stack', itens: ['React', 'TypeScript'] }] },
        { id: 'timeline', tipo: 'timeline', titulo: 'EXPERIÊNCIA', visivel: true, ordem: 3, itens: [{ id: 'trabalho', titulo: 'Cargo de teste', descricao: 'Empresa de teste\nDescrição fornecida.', data: '2020–2026', local: 'Brasil' }] },
        { id: 'lista', tipo: 'list', titulo: 'ATIVIDADES', visivel: true, ordem: 4, itens: Array.from({ length: 100 }, (_, i) => `Atividade número ${i}: descrição detalhada para verificar a preservação do conteúdo no PDF gerado.`) },
        { id: 'oculto', tipo: 'text', titulo: 'OCULTO', visivel: false, ordem: 5, conteudo: 'NÃO DEVE APARECER' },
      ];
      const pdf = await renderPdf(data, { browser, renderer });
      const pages = await readPdf(pdf);
      assert.ok(pages.length > 1);
      assert.ok(pages.every(page => page.text.trim().length > 0));
      const text = pages.map(page => page.text).join(' ').replace(/\s+/g, ' ');
      for (let i = 0; i < 100; i++) assert.ok(text.includes(`Atividade número ${i}:`), `Atividade ${i} ausente`);
      for (const value of ['RESUMO', 'React', 'Cargo de teste', 'Empresa de teste', 'Brasil']) assert.ok(text.includes(value));
      assert.ok(!text.includes('NÃO DEVE APARECER'));
      assert.ok(pages[0].links.includes('https://example.com/portfolio'));
    });

    await t.test('comando aceita caminhos com espaços, extrai links e protege arquivos existentes', async () => {
      const input = path.join(directory, 'meu currículo.json');
      const output = path.join(directory, 'subpasta', 'meu currículo.pdf');
      const textOutput = path.join(directory, 'texto do currículo.txt');
      const data = await readResume(path.join(PROJECT_ROOT, 'public/resumes/resume-data-en.json'));
      await writeFile(input, JSON.stringify(data));
      await exportMain([input, output, '--browser', browser]);
      assert.equal((await readFile(output)).subarray(0, 5).toString(), '%PDF-');
      await assert.rejects(exportMain([input, output, '--browser', browser]), /saída já existe/);
      await exportMain(['--input', input, '--output', output, '--browser', browser, '--force']);
      await extractMain(['-i', output, '-o', textOutput]);
      const text = await readFile(textOutput, 'utf8');
      assert.match(text, /PROFESSIONAL OBJECTIVE/);
      assert.match(text, /https:\/\/github.com\/gudyfut/);
      await assert.rejects(extractMain([output, textOutput]), /saída já existe/);
      const pages = await extractPdf(output);
      assert.equal(pages.length, 1);
    });

    await t.test('PDF sem camada de texto exige leitura visual ou OCR', async () => {
      const instance = await chromium.launch({ headless: true, ...(browser === 'chromium' ? {} : { channel: browser }) });
      const input = path.join(directory, 'digitalizado.pdf');
      const output = path.join(directory, 'nao-deve-existir.txt');
      try {
        const page = await instance.newPage();
        await page.setContent('<html><body><div style="height:50px;background:#000"></div></body></html>');
        await page.pdf({ path: input });
      } finally { await instance.close(); }
      await assert.rejects(extractMain([input, output]), /PDF sem texto extraível/);
      await assert.rejects(readFile(output), { code: 'ENOENT' });
    });

    await t.test('CLI executável resolve caminhos relativos fora da raiz do projeto', async () => {
      const input = 'entrada relativa.json';
      const output = path.join('destino com espaços', 'currículo final.pdf');
      const data = await readResume(path.join(PROJECT_ROOT, 'public/resumes/resume-data-en.json'));
      await writeFile(path.join(directory, input), JSON.stringify(data));
      const result = spawnSync(process.execPath, [path.join(PROJECT_ROOT, 'scripts/export-resume-pdf.mjs'), '-i', input, '-o', output, '--browser', browser], { cwd: directory, encoding: 'utf8', timeout: 90000 });
      assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
      assert.equal((await readFile(path.join(directory, output))).subarray(0, 5).toString(), '%PDF-');
      const invalid = spawnSync(process.execPath, [path.join(PROJECT_ROOT, 'scripts/export-resume-pdf.mjs'), '--input', input, '--output', 'sem-extensao'], { cwd: directory, encoding: 'utf8' });
      assert.equal(invalid.status, 1);
      assert.match(invalid.stderr, /extensão .pdf/);
    });
  } finally { await rm(directory, { recursive: true, force: true }); }
});
