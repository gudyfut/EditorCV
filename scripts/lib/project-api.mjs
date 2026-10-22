import { readdir, realpath } from 'node:fs/promises';
import path from 'node:path';
import { PROJECT_ROOT } from './cli.mjs';
import { readResume, validateResume } from './resume-json.mjs';

const virtualId = 'virtual:resume-catalog';
const resolvedId = '\0' + virtualId;

export async function listResumes(root, personal = true) {
  const entries = [];
  for (const [source, folder] of [['personal', 'resumes'], ['public', 'public/resumes']]) {
    if (!personal && source === 'personal') continue;
    let files;
    try { files = await readdir(path.resolve(root, folder), { withFileTypes: true }); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    for (const file of files) {
      if (!file.isFile() || !file.name.toLowerCase().endsWith('.json')) continue;
      entries.push({ id: `${source}/${file.name}`, name: file.name, folder,
        url: source === 'public' ? `/resumes/${encodeURIComponent(file.name)}` : `/api/resumes/file?source=personal&name=${encodeURIComponent(file.name)}` });
    }
  }
  return entries.sort((a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name));
}

export async function readProjectResume(root, source, name) {
  if (!['personal', 'public'].includes(source) || !name || name.includes('/') || name.includes('\\') || !name.toLowerCase().endsWith('.json')) throw new Error('Arquivo de currículo inválido.');
  const directory = await realpath(path.resolve(root, source === 'personal' ? 'resumes' : 'public/resumes'));
  const file = await realpath(path.join(directory, name));
  if (path.dirname(file) !== directory) throw new Error('Arquivo fora da pasta de currículos.');
  return readResume(file);
}

function sendJson(response, status, value) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(value));
}

export function createProjectMiddleware(root = PROJECT_ROOT) {
  // Cache the bundle, never the person's data. Source edits invalidate it.
  let renderer;
  const middleware = async (request, response, next) => {
    const url = new URL(request.url, 'http://localhost');
    if (!url.pathname.startsWith('/api/resumes')) return next();
    if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(request.socket.remoteAddress) || request.headers['sec-fetch-site'] === 'cross-site') return sendJson(response, 403, { error: 'Acesso disponível somente no computador local.' });
    if (request.headers.origin && ![`http://${request.headers.host}`, `https://${request.headers.host}`].includes(request.headers.origin)) return sendJson(response, 403, { error: 'Origem não permitida.' });
    try {
      if (url.pathname === '/api/resumes' && request.method === 'GET') return sendJson(response, 200, { files: await listResumes(root), exportPdf: true });
      if (url.pathname === '/api/resumes/file' && request.method === 'GET') return sendJson(response, 200, await readProjectResume(root, url.searchParams.get('source'), url.searchParams.get('name')));
      if (url.pathname === '/api/resumes/pdf' && request.method === 'POST') {
        const chunks = []; let size = 0;
        for await (const chunk of request) {
          size += chunk.length;
          if (size > 2_000_000) return sendJson(response, 413, { error: 'O currículo excede o limite de 2 MB.' });
          chunks.push(chunk);
        }
        const data = validateResume(JSON.parse(Buffer.concat(chunks).toString('utf8')));
        const { buildRenderer, renderPdf } = await import('./render-pdf.mjs');
        renderer ??= buildRenderer().catch(error => { renderer = undefined; throw error; });
        const pdf = await renderPdf(data, { renderer: await renderer });
        response.writeHead(200, { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="curriculo.pdf"', 'Cache-Control': 'no-store' });
        return response.end(pdf);
      }
      return sendJson(response, 404, { error: 'Recurso não encontrado.' });
    } catch (error) { return sendJson(response, 400, { error: error.message }); }
  };
  middleware.invalidate = () => { renderer = undefined; };
  return middleware;
}

export function editorCvProject() {
  let root = PROJECT_ROOT;
  return {
    name: 'editorcv-project',
    configResolved(config) { root = config.root; },
    resolveId(id) { if (id === virtualId) return resolvedId; },
    async load(id) { if (id === resolvedId) return `export default ${JSON.stringify(await listResumes(root, false))};`; },
    configureServer(server) {
      const middleware = createProjectMiddleware(root);
      server.middlewares.use(middleware);
      server.watcher.on('change', file => { if (path.relative(root, file).startsWith('src' + path.sep)) middleware.invalidate(); });
    },
  };
}
