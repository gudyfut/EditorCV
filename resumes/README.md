# Seus currículos em JSON

Salve os arquivos pessoais aqui, por exemplo `meu-curriculo.json` e `meu-curriculo-en.json`. O conteúdo desta pasta é ignorado pelo Git, exceto este guia.

Comece copiando `examples/resume-template.json` para esta pasta ou peça ao Codex para preenchê-lo a partir das suas informações. Ative (`visivel: true`) apenas as seções preenchidas.

```bash
npm run resume:validate -- resumes/meu-curriculo.json
npm run resume:pdf -- resumes/meu-curriculo.json
```

O PDF será salvo em `output/resumes/meu-curriculo.pdf`. Para abrir o JSON na interface, use **Abrir JSON**. Para torná-lo o currículo padrão, substitua explicitamente `public/resumes/resume-data.json` (esse arquivo é público e entra no build).

Para escolher outro destino de PDF, use `node scripts/export-resume-pdf.mjs --input "resumes/meu-curriculo.json" --output "output/resumes/versao final.pdf"`. Consulte o [formato do JSON](../docs/resume-json.md), o [guia dos comandos](../docs/cli.md) e a [skill do projeto](../.agents/skills/editorcv-resume/SKILL.md).
