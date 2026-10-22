# EditorCV

- Para criar, editar, traduzir ou importar um currículo (incluindo PDF → JSON), leia e use `.agents/skills/editorcv-resume/SKILL.md`.
- O contrato verificável dos dados fica em `schemas/resume.schema.json`; o guia de preenchimento está em `docs/resume-json.md`. Valide os JSONs alterados com `npm run resume:validate -- <arquivo>`.
- Currículos pessoais ficam em `resumes/`, PDFs de origem em `input/resumes/` e exportações em `output/resumes/`. Os exemplos públicos existentes pertencem ao autor; não reutilize seus dados ao criar o currículo de outra pessoa.
- A exportação de terminal deve reutilizar `ResumePreview`, os estilos de impressão e `normalizeResumeData`. Ao mudar o formato ou o layout, mantenha schema, modelo, documentação e exportação compatíveis.
- Para alterações no exportador, execute `npm test` e `npm run build`. O teste de integração usa Chromium (`npm run pdf:setup`); alternativamente, `EDITORCV_TEST_BROWSER=msedge` ou `chrome` seleciona um navegador instalado.
