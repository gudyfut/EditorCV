# PDFs exportados

Os PDFs gerados pelo terminal são salvos aqui por padrão. Eles são ignorados pelo Git.

```bash
npm run resume:pdf -- resumes/meu-curriculo.json
```

Para escolher o destino e regenerar um PDF existente:

```bash
node scripts/export-resume-pdf.mjs --input "resumes/meu-curriculo.json" --output "output/resumes/meu curriculo final.pdf" --force
```

Também é possível informar entrada e saída como dois argumentos posicionais. Inclua o nome e a extensão `.pdf`; as pastas são criadas automaticamente. Consulte o [guia dos comandos](../../docs/cli.md) para caminhos absolutos, atalhos e uso no PowerShell.
