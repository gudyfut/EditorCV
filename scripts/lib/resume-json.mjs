import { readFile } from 'node:fs/promises';
import Ajv from 'ajv';

const schema = JSON.parse(await readFile(new URL('../../schemas/resume.schema.json', import.meta.url), 'utf8'));
const validateSchema = new Ajv({ allErrors: true }).compile(schema);

export function validateResume(data) {
  if (!validateSchema(data)) {
    const errors = validateSchema.errors.map(error => `${error.instancePath || '/'}: ${error.message}${error.params.additionalProperty ? ` (${error.params.additionalProperty})` : ''}`);
    throw new Error(`JSON incompatível com o EditorCV:\n${errors.join('\n')}`);
  }
  const sectionIds = new Set();
  const orders = new Set();
  for (const section of data.secoes) {
    if (sectionIds.has(section.id)) throw new Error(`ID de seção repetido: ${section.id}`);
    if (orders.has(section.ordem)) throw new Error(`Ordem de seção repetida: ${section.ordem}`);
    sectionIds.add(section.id);
    orders.add(section.ordem);
    if (section.tipo === 'timeline') {
      const ids = new Set();
      for (const item of section.itens) {
        if (ids.has(item.id)) throw new Error(`ID de item repetido em ${section.id}: ${item.id}`);
        ids.add(item.id);
      }
    }
  }
  return data;
}

export async function readResume(input) {
  let data;
  try { data = JSON.parse((await readFile(input, 'utf8')).replace(/^\uFEFF/, '')); }
  catch (error) { throw new Error(`Não foi possível ler o JSON ${input}: ${error.message}`); }
  return validateResume(data);
}
