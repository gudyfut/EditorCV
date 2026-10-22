import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { PROJECT_ROOT } from '../scripts/lib/cli.mjs';

test('Abrir JSON mostra arquivos do projeto e Exportar PDF baixa sem dados do navegador', { timeout: 120000 }, async () => {
  const output = await mkdtemp(path.join(os.tmpdir(), 'editorcv-ui-'));
  const server = await createServer({ root: PROJECT_ROOT, logLevel: 'error', server: { host: '127.0.0.1', port: 0 } });
  let browser;
  try {
    await server.listen();
    browser = await chromium.launch({ headless: true, ...(process.env.EDITORCV_TEST_BROWSER && process.env.EDITORCV_TEST_BROWSER !== 'chromium' ? { channel: process.env.EDITORCV_TEST_BROWSER } : {}) });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.httpServer.address().port}`);
    await page.locator('.resume-paper').waitFor();
    await page.getByRole('button', { name: 'Abrir JSON', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Abrir currículo' });
    await dialog.waitFor();
    await page.getByLabel('Buscar currículo').fill('resume-data-en');
    await page.getByRole('button', { name: 'resume-data-en.json Abrir', exact: true }).click();
    await dialog.waitFor({ state: 'hidden' });
    assert.equal(await page.locator('.toolbar-source').textContent(), 'resume-data-en.json');
    await page.getByLabel('Nome', { exact: true }).fill('Pessoa de teste');
    // The local export must bypass window.print even when browser printing is configured with headers.
    await page.evaluate(() => { window.print = () => { throw new Error('Impressão nativa não deve ser usada na exportação local'); }; });
    const responsePromise = page.waitForResponse(response => response.url().endsWith('/api/resumes/pdf'));
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Exportar PDF', exact: true }).click();
    const response = await responsePromise;
    assert.equal(response.status(), 200, await response.text().catch(() => ''));
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), 'resume-data-en.pdf');
    const file = path.join(output, download.suggestedFilename());
    await download.saveAs(file);
    const task = getDocument({ data: new Uint8Array(await readFile(file)) });
    try {
      const pdf = await task.promise;
      assert.equal(pdf.numPages, 1);
      const text = (await (await pdf.getPage(1)).getTextContent()).items.map(item => item.str ?? '').join(' ');
      assert.match(text, /PROFESSIONAL OBJECTIVE/);
      assert.match(text, /PESSOA DE TESTE/);
      assert.match(text, /Portuguese: native/);
      assert.doesNotMatch(text, /localhost|127\.0\.0\.1|EditorCV|\b\d{1,2}:\d{2}\b|\b1\/1\b/);
    } finally { await task.destroy(); }
    assert.deepEqual(errors, []);
    await page.getByRole('button', { name: 'Abrir JSON', exact: true }).click();
    await dialog.waitFor();
    await page.getByLabel('Buscar currículo').press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    // A static deployment must retain the public catalog and browser-print fallback.
    await page.route('**/api/resumes', route => route.fulfill({ status: 404, body: 'Not found' }));
    await page.reload();
    await page.locator('.resume-paper').waitFor();
    await page.getByRole('button', { name: 'Abrir JSON', exact: true }).click();
    await page.getByRole('button', { name: 'resume-data-en.json Abrir', exact: true }).waitFor();
    await page.getByLabel('Buscar currículo').press('Escape');
    await page.evaluate(() => { window.__printed = false; window.print = () => { window.__printed = true; }; });
    await page.getByRole('button', { name: 'Exportar PDF', exact: true }).click();
    await page.waitForFunction(() => window.__printed);
    assert.match(await page.locator('.toolbar-status').textContent(), /Cabeçalhos e rodapés/);
  } finally {
    await browser?.close();
    await server.close();
    await rm(output, { recursive: true, force: true });
  }
});
