# EditorCV

Editor de curriculo dinamico com preview em tempo real. Os dados ficam em JSON, entao voce pode editar pelo formulario visual ou direto no arquivo — inclusive com ajuda de IA.

---

## Inicio Rapido

```bash
cd ResumeEditor
npm install
npm run dev
```

O app abre em `http://localhost:5173` ja carregando o curriculo padrao.

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
- **Cargo / Titulo** — subtitulo abaixo do nome
- **Telefone** e **Email** — com botao de visibilidade (olho)
- **GitHub** — campo de URL + campo de texto exibido no PDF (ex: URL `github.com/gudyfut`, texto `gudyfut`)
- **LinkedIn** — mesmo esquema: URL + texto exibido

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
- Reordenar os modulos arrastando na secao **Ordem dos Modulos**
- Ocultar/mostrar qualquer modulo com o botao de olho
- Criar novos modulos com os botoes Text, List, Timeline, Grouped List

### Ajustes Visuais

Controles no formulario:
- **Tamanho da Fonte** — base em px (8 a 24)
- **Escala da Fonte** — multiplica todos os textos
- **Escala dos Titulos** — multiplica apenas titulos de secao
- **Altura da Linha** — espacamento entre linhas

### Salvar e Exportar

- **Salvar JSON** — salva os dados atuais em `.json` (para reabrir depois)
- **Abrir JSON** — carrega um arquivo `.json` diferente
- **Exportar PDF** — usa `window.print()` do navegador para gerar PDF

---

## Arquivos JSON

### Onde ficam

```
ResumeEditor/public/resumes/
  resume-data.json       ← carregado por padrao ao abrir o app
  resume-data-en.json    ← exemplo em ingles
  resume-data-plp.json   ← outro exemplo
```

Para trocar o curriculo padrao, substitua o conteudo de `resume-data.json` ou edite o campo `DEFAULT_JSON_PATH` em `src/app/App.tsx`.

### Schema

```json
{
  "meta": {
    "nome": "string",
    "cargo": "string",
    "telefone": "string",
    "email": "string",
    "github": "string (URL)",
    "githubTexto": "string (texto exibido no PDF)",
    "linkedin": "string (URL)",
    "linkedinTexto": "string (texto exibido no PDF)"
  },
  "layout": {
    "baseFontSize": 12.5,
    "fontScale": 1.0,
    "headingScale": 1.0,
    "lineHeight": 1.35
  },
  "secoes": [
    {
      "id": "string",
      "tipo": "text | list | grouped_list | timeline",
      "visivel": true,
      "ordem": 1,
      "titulo": "string",
      "...campos especificos por tipo"
    }
  ]
}
```

---

## Editando com IA

Como o curriculo e um JSON simples, voce pode usar qualquer IA (ChatGPT, Claude, Copilot, etc.) para editar. Exemplos de prompts:

> "Melhore o texto da secao SOBRE neste JSON de curriculo mantendo o formato"

> "Adicione uma nova experiencia profissional no meu curriculo: [descricao do cargo]"

> "Traduza todo o conteudo do JSON para ingles mantendo a estrutura"

> "Reescreva as competencias de forma mais impactante"

Basta colar o JSON, pedir a edicao e colar o resultado de volta no arquivo `resume-data.json`.

---

## Build para Producao

```bash
npm run build
```

Gera a pasta `dist/` com os arquivos estaticos prontos para deploy.

---

## Estrutura do Projeto

```
ResumeEditor/
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
        ats-resume.tsx    ← template ATS alternativo
        resume.tsx        ← template visual alternativo
        ui/               ← componentes de UI (accordion, etc.)
    styles/
      globals.css         ← estilos globais e do curriculo
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

---

## Licenca

MIT
