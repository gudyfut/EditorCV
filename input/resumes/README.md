# Currículos de origem

Coloque aqui o PDF do currículo antigo, por exemplo `curriculo-antigo.pdf`. Depois peça ao Codex:

> Use $editorcv-resume para ler input/resumes/curriculo-antigo.pdf e criar resumes/meu-curriculo.json com as minhas informações.

Os PDFs, textos extraídos e imagens nesta pasta são locais e ignorados pelo Git. A pasta não é publicada pelo aplicativo.

Para extrair texto e links sem ferramentas externas:

```bash
npm run resume:extract -- input/resumes/curriculo-antigo.pdf
```

O resultado será `input/resumes/curriculo-antigo.txt`. PDFs digitalizados exigem leitura visual ou OCR; o extrator não inventa o texto ausente. Em documentos com colunas, confira a associação entre cargos, empresas e datas.

Para outro destino, use `node scripts/extract-resume-pdf.mjs --input "input/resumes/curriculo-antigo.pdf" --output "input/resumes/texto extraido.txt"`. O [guia dos comandos](../../docs/cli.md) explica as opções e a instalação inicial.
