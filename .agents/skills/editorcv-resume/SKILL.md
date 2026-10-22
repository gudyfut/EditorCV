---
name: editorcv-resume
description: "Crie, edite ou traduza currículos JSON do EditorCV, inclusive a partir de um currículo em PDF, e valide ou exporte o resultado. Use para dados de currículo deste repositório."
---

# Currículos do EditorCV

Trabalhe a partir da raiz do repositório. Leia [o contrato de preenchimento](../../../docs/resume-json.md) antes de escrever JSON; o schema executável é `schemas/resume.schema.json` e o modelo neutro é `examples/resume-template.json`.

## Criar ou editar

- Identifique a pessoa, o arquivo de destino e o idioma a partir do pedido e dos arquivos indicados. Crie novos currículos pessoais em `resumes/<nome>.json`, a menos que outro destino tenha sido solicitado. Para editar, preserve IDs, seções, visibilidade e layout que não façam parte da mudança.
- Use somente informações fornecidas pela pessoa ou presentes nos documentos indicados. Não copie nome, contatos ou experiências dos exemplos em `public/resumes/`. Não invente datas, resultados, competências ou níveis de idioma. Pergunte somente pelo que for necessário para concluir; campos opcionais ausentes podem ficar vazios e seções vazias podem ficar ocultas.
- Para origem em PDF, leia [importação de PDF](references/pdf-import.md). Para texto ou informações no pedido, preencha diretamente o modelo; não é preciso converter para PDF primeiro.
- `secoes` é um array de módulos tipados. Não crie um objeto com chaves como `experiencia` e `formacao`. Use exclusivamente os campos do contrato, strings para textos e arrays reais para listas. Texto é simples, sem HTML ou Markdown. Em traduções, traduza o conteúdo exibido e preserve as chaves, IDs, URLs e a estrutura.
- Salve em UTF-8, com JSON válido e indentação de dois espaços. Ative as seções preenchidas. Campos opcionais desconhecidos ficam omitidos ou como string vazia, nunca como `null`. Mantenha informações incertas fora do JSON final e informe a dúvida à pessoa.
- Ao copiar o modelo para outra pasta, ajuste o caminho relativo de `$schema` ou omita esse campo opcional; ele não deve continuar apontando para um arquivo inexistente.

## Validar e entregar

```bash
node scripts/validate-resume.mjs "resumes/<nome>.json"
node scripts/export-resume-pdf.mjs --input "resumes/<nome>.json" --output "output/resumes/<nome>.pdf"
```

Execute a validação após criar ou alterar o arquivo. Corrija os erros de estrutura sem mudar fatos para fazê-los passar. Quando o pedido incluir PDF, gere-o pelo segundo comando. Respeite o caminho de saída solicitado pela pessoa, inclusive caminhos absolutos ou fora do projeto; sem destino solicitado, use `output/resumes/<nome>.pdf`. Se ela indicar somente uma pasta, acrescente um nome `.pdf` apropriado. Use aspas nos caminhos com espaços e não misture caminhos posicionais com `--input`/`--output`. Consulte o [guia de CLI](../../../docs/cli.md) quando precisar de outras opções ou regras de caminhos.

A primeira instalação requer Node.js 22.13+, `npm ci` e `npm run pdf:setup` (ou um Chrome/Edge instalado, selecionado por `--browser`). O exportador usa o template real do editor e não exige `npm run dev`, servidor ou serviços externos.

Se a saída já existir e o pedido for regenerá-la, use `--force`; preserve o documento de origem. No PowerShell, passe flags por `npm.cmd` ou use `node scripts/export-resume-pdf.mjs <entrada.json> <saida.pdf> --force`, pois alguns lançadores `npm.ps1` consomem opções. Confira o PDF e suas quebras de página com os recursos de leitura disponíveis. Não reduza ou remova experiências para caber em uma página sem que isso faça parte do pedido.

Entregue o caminho do JSON e, se gerado, do PDF, e mencione dúvidas que dependam da pessoa. O JSON pessoal pode ser aberto pelo botão **Abrir JSON**. Só substitua `public/resumes/resume-data.json` quando a pessoa quiser mudar o currículo padrão, pois os arquivos em `public/` são publicados com o aplicativo.
