# Formato dos currículos

O contrato verificável está em [`schemas/resume.schema.json`](../schemas/resume.schema.json). Comece pelo [modelo neutro](../examples/resume-template.json). Os tipos do aplicativo ficam em `src/app/types/resume.ts`, e os padrões de layout são compartilhados pelo editor e pela exportação.

## Arquivos e comandos

| Local | Finalidade |
| --- | --- |
| `input/resumes/` | PDFs originais e textos extraídos, locais |
| `resumes/` | JSONs pessoais, locais |
| `output/resumes/` | PDFs finais, locais |
| `examples/resume-template.json` | Modelo sem informações pessoais |
| `public/resumes/` | Exemplos públicos; `resume-data.json` é o padrão do aplicativo |

Nas três pastas locais, os arquivos pessoais são ignorados pelo Git. O editor abre um JSON pessoal pelo botão **Abrir JSON**. `public/` entra no site publicado; substituir o padrão é uma escolha explícita.

O [guia de CLI](cli.md) detalha os caminhos de entrada e saída, opções nomeadas, aspas e sobrescrita.

```bash
npm run resume:validate -- resumes/meu-curriculo.json
npm run resume:pdf -- resumes/meu-curriculo.json
```

## Estrutura principal

`meta` e `secoes` são obrigatórios. `layout` pode ser omitido ou parcial para compatibilidade com currículos antigos; os campos ausentes recebem os padrões abaixo. `$schema` é opcional e pode apontar para `../schemas/resume.schema.json` em um arquivo dentro de `resumes/`.

Se salvar o JSON em outra pasta, ajuste esse caminho relativo ao local real do schema ou omita `$schema`. Ele serve para a assistência do editor de código; a validação de terminal já utiliza o schema do projeto.

`secoes` é um **array**, nunca um objeto organizado por nome de seção. Os textos são strings simples, com `\n` para quebras de linha. Arrays não devem ser substituídos por strings separadas por vírgula. Não use `null`, comentários, vírgulas finais, HTML ou Markdown nos dados.

## Dados pessoais (`meta`)

`nome` é uma string obrigatória. Inclua os demais campos como strings vazias quando não houver informação: `cargo`, `telefone`, `email`, `github`, `githubTexto`, `linkedin`, `linkedinTexto`, `portfolio`, `portfolioTexto`.

GitHub, LinkedIn e portfólio têm **URL de destino** e **texto exibido** separados. Prefira URLs completas `https://...`. Email não precisa de `mailto:` no JSON. Telefone deve permanecer string para preservar `+`, parênteses e espaços.

Os booleanos opcionais `telefoneVisivel`, `emailVisivel`, `githubVisivel`, `linkedinVisivel` e `portfolioVisivel` controlam a exibição; quando omitidos, o contato preenchido aparece. `cargo` é guardado e editável, mas o template principal atual não o imprime no cabeçalho; para exibir um objetivo/cargo, use uma seção `text` preenchida.

## Campos comuns das seções

| Campo | Tipo e regra |
| --- | --- |
| `id` | String não vazia e única em `secoes`; preserve em edições |
| `tipo` | `text`, `list`, `grouped_list` ou `timeline` |
| `visivel` | Booleano; `false` oculta a seção inteira |
| `ordem` | Inteiro não negativo e único; recomenda-se 1, 2, 3… |
| `titulo` | String; preencha para evitar o título de fallback do template |

A renderização filtra as seções visíveis e ordena pelo número `ordem`. Nomes e IDs são livres: não é necessário usar os mesmos módulos dos exemplos. Seções vazias podem ser removidas ou mantidas com `visivel: false`.

### `text`: resumo, objetivo ou texto livre

```json
{ "id": "resumo", "tipo": "text", "visivel": true, "ordem": 1, "titulo": "RESUMO", "conteudo": "Texto fornecido pela pessoa.\nOutro parágrafo." }
```

### `list`: idiomas e listas simples

```json
{ "id": "idiomas", "tipo": "list", "visivel": true, "ordem": 2, "titulo": "IDIOMAS", "itens": ["Português: nativo", "Inglês: nível informado pela pessoa"] }
```

Cada elemento de `itens` deve ser string. Não infira fluência.

### `grouped_list`: habilidades por categoria

```json
{ "id": "habilidades", "tipo": "grouped_list", "visivel": true, "ordem": 3, "titulo": "HABILIDADES", "grupos": [{ "label": "Ferramentas", "itens": ["Ferramenta informada"] }] }
```

Cada grupo precisa de `label` string e `itens` array de strings. Não há `id` de grupo no formato atual.

### `timeline`: experiência, formação e projetos

```json
{
  "id": "experiencia", "tipo": "timeline", "visivel": true, "ordem": 4, "titulo": "EXPERIÊNCIA",
  "itens": [
    {
      "id": "experiencia-1",
      "titulo": "Cargo informado",
      "descricao": "Empresa informada\nAtividades e resultados presentes na fonte.",
      "data": "Período informado",
      "local": "Local informado",
      "dataVisivel": true,
      "localVisivel": true
    }
  ]
}
```

Um item exige `id` e `titulo` strings; o ID deve ser único dentro da seção. `descricao`, `data` e `local` são strings opcionais. Os dois booleanos de visibilidade são opcionais e equivalem a `true` quando omitidos. A ordem dos itens é a do array.

**Não use** `cargo`, `empresa`, `instituicao`, `periodo`, `status` ou `bullets` dentro de itens: o template não lê esses campos. Coloque cargo/curso em `titulo`, empresa/instituição e realizações em `descricao`, período em `data`. Para educação, inclua status de conclusão em `titulo` ou `descricao`, apenas se informado. Não invente datas para preencher o layout.

## Layout

| Campo | Padrão | Valores aceitos |
| --- | --- | --- |
| `fontFamily` | `system` | `system`, `arial`, `calibri`, `segoe-ui`, `verdana`, `trebuchet`, `georgia`, `cambria`, `times`, `courier` |
| `baseFontSize` | 12.5 | 8–24, em px |
| `fontScale` | 1 | 0.5–2 |
| `headingScale` | 1 | 0.5–2 |
| `lineHeight` | 1.35 | 1–2 |
| `pageMargin` | 14 | 5–30, em mm |
| `sectionSpacing` | 14 | 0–40, em px |
| `itemSpacing` | 6 | 0–24, em px |
| `accentColor` | `#0f172a` | Cor hexadecimal de seis dígitos |
| `textAlign` | `justify` | `justify` ou `left` |

Fontes dependem das opções instaladas no sistema; existem alternativas de fallback. Uma exportação em outro sistema pode ter quebras diferentes se a fonte não estiver disponível.

## Verificação

`npm run resume:validate -- <arquivo.json>` verifica tipos, propriedades desconhecidas, payload correto de cada módulo, limites de layout, IDs repetidos e ordens duplicadas. Aceita vários arquivos no mesmo comando. A validação não verifica a veracidade dos fatos; revise os dados contra a fonte.

Depois de alterar conteúdo ou layout, gere e confira o PDF quando ele fizer parte da entrega. Conteúdo maior pode legitimamente ocupar mais páginas. Preserve os fatos e os links; não corte conteúdo automaticamente para caber em uma página.
