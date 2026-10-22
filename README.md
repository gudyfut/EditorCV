# EditorCV

Editor de currículo com prévia em tempo real e exportação para PDF. Os dados ficam em JSON: você pode editá-los pelo formulário, diretamente no arquivo ou com a skill do Codex incluída no projeto.

---

## Início rápido

Use **Node.js 22.13 ou superior**. Execute os comandos a partir da raiz do repositório.

```bash
git clone https://github.com/gudyfut/EditorCV.git
cd EditorCV
npm ci
npm run pdf:setup
npm run dev
```

Abra `http://localhost:5173` no navegador. O aplicativo carrega o currículo padrão; se a porta estiver ocupada, use o endereço informado no terminal. Se já tiver clonado o projeto, comece por `npm ci` na raiz.

Para entender as pastas e as limpezas realizadas, consulte o [guia da estrutura do projeto](docs/project-structure.md). No uso diário, você trabalha principalmente com `input/resumes/` (PDF antigo), `resumes/` (JSON pessoal) e `output/resumes/` (PDF exportado).

---

## Criar seu currículo com Codex

O projeto inclui a skill [`editorcv-resume`](.agents/skills/editorcv-resume/SKILL.md), com criação, edição, tradução e importação de PDF para JSON. Ela fica em `.agents/skills/`, o diretório de skills de repositório [reconhecido pelo Codex](https://developers.openai.com/codex/skills/). O arquivo `AGENTS.md` também orienta o Codex a usá-la ao trabalhar com currículos. Se ela não aparecer após abrir o projeto, reinicie o Codex ou indique diretamente o caminho do `SKILL.md` no pedido.

Para começar do zero, forneça suas informações ao Codex e peça:

> Use $editorcv-resume para criar resumes/meu-curriculo.json com os meus dados. Use o modelo neutro do projeto e valide o resultado.

Para aproveitar um currículo existente:

1. Coloque o PDF em `input/resumes/`, por exemplo `input/resumes/curriculo-antigo.pdf`.
2. Abra o repositório no Codex e peça:

> Use $editorcv-resume para ler input/resumes/curriculo-antigo.pdf, criar resumes/meu-curriculo.json e exportar o PDF. Preserve os fatos do documento e me avise se faltar alguma informação.

O projeto inclui um extrator local de texto e links:

```bash
npm run resume:extract -- input/resumes/curriculo-antigo.pdf
```

O TXT será salvo em `input/resumes/curriculo-antigo.txt`. O Codex interpreta as informações e preenche o JSON; o extrator não cria o JSON sozinho. PDFs digitalizados exigem leitura visual ou OCR. Documentos com colunas podem exigir conferência da ordem dos trechos.

| Pasta | Conteúdo |
| --- | --- |
| `input/resumes/` | Seus PDFs antigos e textos extraídos |
| `resumes/` | Seus currículos pessoais em JSON |
| `output/resumes/` | PDFs exportados |
| `examples/` | Modelo neutro, sem os dados do autor |

Os arquivos pessoais nas três primeiras pastas são ignorados pelo Git. Os JSONs em `public/resumes/` são exemplos públicos e entram no site publicado. Para editar um JSON pessoal na interface, clique em **Abrir JSON**. Para mudar o padrão do aplicativo, substitua explicitamente `public/resumes/resume-data.json`.

## Exportar PDF pelo terminal

Instale as dependências e o navegador de impressão uma vez:

```bash
npm ci
npm run pdf:setup
```

Depois, edite o JSON e execute:

```bash
npm run resume:pdf -- resumes/meu-curriculo.json
```

O PDF será salvo em `output/resumes/meu-curriculo.pdf`. **Não é necessário executar `npm run dev`, abrir a interface ou manter um servidor.** O comando compila o renderizador em memória e usa Chromium sem janela, com o mesmo componente, estilos A4, margens, fontes e links do editor. A geração é local; depois da instalação, não precisa de internet.

Exemplos:

```bash
# Exportar o currículo padrão
npm run resume:pdf

# Definir o arquivo de saída
npm run resume:pdf -- public/resumes/resume-data-en.json output/resumes/curriculo-en.pdf

# Entrada e saída com nomes explícitos e espaços
node scripts/export-resume-pdf.mjs --input "resumes/meu curriculo.json" --output "output/resumes/versao final.pdf"

# Regenerar uma saída existente
node scripts/export-resume-pdf.mjs resumes/meu-curriculo.json output/resumes/meu-curriculo.pdf --force

# Usar Edge ou Chrome já instalado, como alternativa ao pdf:setup
node scripts/export-resume-pdf.mjs --input resumes/meu-curriculo.json --browser msedge
node scripts/export-resume-pdf.mjs --input resumes/meu-curriculo.json --browser chrome

# Verificar o formato sem gerar PDF
npm run resume:validate -- resumes/meu-curriculo.json
```

Use aspas nos caminhos com espaços. O comando cria as pastas de saída e evita substituir arquivos sem `--force`. **No PowerShell, use `npm.cmd` no lugar de `npm` ao passar opções como `--force` ou `--browser`**, pois o lançador `npm.ps1` de algumas instalações consome essas opções. O comando direto funciona em todos os sistemas:

```bash
node scripts/export-resume-pdf.mjs resumes/meu-curriculo.json output/resumes/meu-curriculo.pdf --force
```

As fontes usam as instaladas no computador, com alternativas de fallback; em outro sistema, a disponibilidade de fontes pode alterar as quebras de página. No Linux, instale também as dependências de sistema do Chromium quando necessário: `npx playwright install --with-deps chromium`.

O [guia completo dos comandos](docs/cli.md) explica todos os argumentos, atalhos `-i`/`-o`, caminhos absolutos e relativos, saída TXT e mensagens de erro. Informe sempre o nome do arquivo em `--output`; as pastas necessárias são criadas automaticamente.

---

## Como Usar

### Paineis

O app tem dois paineis lado a lado:

| Esquerda (Formulario) | Direita (Preview) |
| --- | --- |
| Edita dados pessoais, modulos, ordem e ajustes visuais | Mostra o curriculo A4 em tempo real |

### Dados Pessoais

Campos disponiveis no formulario:

- **Nome** — exibido como titulo grande no topo do curriculo
- **Cargo / Título** — informação editável e salva no JSON; o template principal atual não a exibe no cabeçalho. Use uma seção de texto para exibir um objetivo profissional.
- **Telefone** e **Email** — com botao de visibilidade (olho)
- **GitHub** — campo de URL + campo de texto exibido no PDF (ex: URL `github.com/gudyfut`, texto `gudyfut`)
- **LinkedIn** e **Portfólio** — mesmo esquema: URL + texto exibido

Os links de GitHub, LinkedIn e Email sao clicaveis no PDF exportado.

### Modulos (Secoes)

Cada secao do curriculo e um modulo com tipo, visibilidade e ordem:

| Tipo | Uso |
| --- | --- |
| `text` | Texto livre (ex: sobre mim) |
| `list` | Lista de itens (ex: competencias) |
| `grouped_list` | Lista agrupada por categoria (ex: habilidades) |
| `timeline` | Entradas com titulo, descricao, data e local (ex: experiencia, formacao) |

Voce pode:
- Reordenar os módulos e itens pelas alças na seção **Conteúdo dos Módulos**
- Ocultar/mostrar qualquer modulo com o botao de olho
- Criar novos modulos com os botoes Text, List, Timeline, Grouped List

### Ajustes Visuais

Controles no formulario:
- **Fonte do currículo** — seletor com busca, categorias e amostra de dez fontes
- **Tamanho da Fonte** — base em px (8 a 24)
- **Escala da Fonte** — multiplica todos os textos
- **Escala dos Titulos** — multiplica apenas titulos de secao
- **Altura da Linha** — espacamento entre linhas
- **Margens da página** — de 5 a 30 mm, aplicadas na prévia e no PDF
- **Espaço entre seções e itens** — controla a densidade do conteúdo
- **Cor dos títulos e divisórias** e **Alinhamento do texto**
- **Restaurar ajustes padrão** — recupera os valores iniciais

Todos os ajustes são salvos no JSON. Arquivos antigos recebem os valores padrão dos novos controles. As fontes usam as opções instaladas no dispositivo, com alternativas compatíveis.

### Salvar e Exportar

- **Salvar JSON** — salva os dados atuais em `.json` (para reabrir depois)
- **Abrir JSON** — mostra os arquivos de `resumes/` e `public/resumes/`, com busca. **Escolher em outra pasta** permite importar um arquivo externo.
- **Exportar PDF** — no aplicativo local (`npm run dev`), gera e baixa o PDF sem data, hora, endereço ou paginação automática do navegador. Requer `npm run pdf:setup` na primeira instalação.

Em uma hospedagem puramente estática, a impressão continua disponível; desative **Cabeçalhos e rodapés** no diálogo do navegador. A geração pelo terminal sempre usa o renderizador controlado.

---

## Arquivos JSON

### Onde ficam

```
public/resumes/
  resume-data.json       ← carregado por padrao ao abrir o app
  resume-data-en.json    ← exemplo em ingles
  resume-data-2.json     ← segundo exemplo em portugues
  resume-data-2-en.json  ← segundo exemplo em ingles
```

Para trocar o curriculo padrao, substitua o conteudo de `resume-data.json` ou edite o campo `DEFAULT_JSON_PATH` em `src/app/App.tsx`.

### Schema

O [guia do JSON](docs/resume-json.md) descreve todos os campos, os quatro tipos de módulos e os ajustes visuais. O [JSON Schema](schemas/resume.schema.json) permite verificar o contrato, e o [modelo completo](examples/resume-template.json) é um ponto de partida válido sem informações pessoais.

O validador aceita layouts antigos ou parciais, preenchidos com os mesmos padrões no editor e no PDF. Ele rejeita campos incompatíveis, listas no formato errado, IDs repetidos e ordens duplicadas:

```bash
npm run resume:validate -- resumes/meu-curriculo.json
```

---

## Editando com IA

Como o curriculo e um JSON simples, voce pode usar qualquer IA (ChatGPT, Claude, Copilot, etc.) para editar. Exemplos de prompts:

> "Melhore o texto da secao SOBRE neste JSON de curriculo mantendo o formato"

> "Adicione uma nova experiencia profissional no meu curriculo: [descricao do cargo]"

> "Traduza todo o conteudo do JSON para ingles mantendo a estrutura"

> "Reescreva as competencias de forma mais impactante"

Salve o resultado em `resumes/<nome>.json` e valide com `npm run resume:validate -- resumes/<nome>.json`. Para trabalhar com Codex neste repositório, prefira a skill `editorcv-resume`, que conhece o contrato dos dados. Os exemplos públicos do autor não devem servir como fonte dos dados pessoais de outra pessoa.

---

## Build para Producao

```bash
npm run build
```

Gera a pasta `dist/` com os arquivos estaticos prontos para deploy.

---

## Estrutura do Projeto

```
EditorCV/
  .agents/skills/
    editorcv-resume/       ← skill do Codex e guia de importação de PDF
  AGENTS.md               ← orientações para agentes neste projeto
  examples/               ← modelo neutro de currículo
  schemas/                ← contrato JSON verificável
  docs/                   ← guias de CLI, formato JSON e estrutura
  input/resumes/          ← PDFs de origem e textos extraídos (locais)
  resumes/                ← JSONs pessoais (locais)
  output/resumes/         ← PDFs exportados (locais)
  scripts/                ← comandos de validação, extração e exportação
  tests/                  ← testes do contrato e da exportação
  public/
    resumes/              ← JSONs de curriculo
    favicon-clipboard.svg
  src/
    app/
      App.tsx             ← componente principal, carrega JSON e orquestra tudo
      types/
        resume.ts         ← interfaces TypeScript (ResumeData, ResumeMeta, etc.)
      components/
        ResumeForm.tsx    ← formulario de edicao (painel esquerdo)
        ResumePreview.tsx ← preview do curriculo A4 (painel direito)
        ResumeFileDialog.tsx ← seletor dos JSONs do projeto
        ui/               ← accordion e auxiliar de estilos usados pelo formulário
    styles/
      globals.css         ← estilos globais e do curriculo
    export/
      render.tsx          ← usa o mesmo preview para exportação sem servidor
  package.json
  vite.config.ts
```

---

## Stack

- **React 18** + **TypeScript 5.6**
- **Vite 6** — build e dev server
- **Tailwind CSS 4** — utilitarios de estilo
- **Radix UI** + **dnd-kit** — componentes acessiveis e drag-and-drop
- **Lucide React** — icones
- **Playwright / Chromium** — impressão pelo terminal
- **PDF.js** — extração local de texto e links
- **Ajv** — validação de JSON Schema

## Verificação de desenvolvimento

```bash
npm run pdf:setup
npm test
npm run typecheck
npm run build
```

Os testes conferem o contrato dos JSONs, a compatibilidade dos exemplos antigos, texto e links nos PDFs, paginação sem páginas vazias e proteção contra sobrescrita. Também cobrem PDF sem texto extraível, o seletor de arquivos e o download sem cabeçalhos do navegador. O teste da interface inicia e encerra seu próprio servidor temporário; não é necessário executar `npm run dev` manualmente.

---

## Licenca

MIT
