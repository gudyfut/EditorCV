import path from 'node:path';
import { build } from 'vite';
import { chromium } from 'playwright';
import { PROJECT_ROOT } from './cli.mjs';

export async function buildRenderer() {
  const result = await build({
    root: PROJECT_ROOT,
    configFile: path.join(PROJECT_ROOT, 'vite.config.ts'),
    publicDir: false,
    logLevel: 'error',
    mode: 'production',
    esbuild: { jsxDev: false },
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    build: {
      write: false,
      emptyOutDir: false,
      lib: { entry: path.join(PROJECT_ROOT, 'src/export/render.tsx'), name: 'EditorCVExport', formats: ['iife'] },
      rollupOptions: { output: { inlineDynamicImports: true } },
    },
  });
  const outputs = (Array.isArray(result) ? result : [result]).flatMap(item => item.output);
  return {
    script: outputs.filter(item => item.type === 'chunk').map(item => item.code).join('\n'),
    css: outputs.filter(item => item.type === 'asset' && item.fileName.endsWith('.css')).map(item => String(item.source)).join('\n'),
  };
}

export async function renderPdf(data, { browser: channel = 'chromium', renderer } = {}) {
  const assets = renderer ?? await buildRenderer();
  let browser;
  try { browser = await chromium.launch({ headless: true, ...(channel === 'chromium' ? {} : { channel }) }); }
  catch (error) {
    throw new Error(`Não foi possível abrir ${channel}. Execute npm run pdf:setup para instalar o Chromium, ou use --browser msedge/--browser chrome se já estiver instalado.\n${error.message}`);
  }
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    // Everything is supplied in memory. No HTTP server or remote resources.
    await page.route('**/*', route => route.abort());
    await page.setContent('<!doctype html><html><head><meta charset="utf-8"><title>EditorCV</title></head><body><div id="root"></div></body></html>');
    await page.addStyleTag({ content: assets.css });
    await page.addScriptTag({ content: assets.script });
    if (errors.length) throw new Error(`Falha ao carregar o template: ${errors.join('; ')}`);
    await page.evaluate(data => window.renderEditorCVResume(data), data);
    await page.emulateMedia({ media: 'print' });
    await page.evaluate(() => document.fonts.ready);
    if (errors.length) throw new Error(`Falha na renderização: ${errors.join('; ')}`);
    return await page.pdf({ preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false, tagged: true });
  } finally { await browser.close(); }
}
