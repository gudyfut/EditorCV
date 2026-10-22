# Estrutura do projeto e auditoria

## As pastas que você usa

| Pasta | O que colocar ou encontrar nela |
| --- | --- |
| `input/resumes/` | PDF do seu currículo antigo e texto extraído dele |
| `resumes/` | Seus currículos pessoais em JSON |
| `output/resumes/` | PDFs gerados pelo comando de terminal |
| `public/resumes/` | Exemplos públicos e `resume-data.json`, carregado por padrão |

As três pastas locais têm papéis diferentes: **origem → dados editáveis → documento final**. Não são cópias umas das outras. Seus conteúdos são ignorados pelo Git, exceto os guias `README.md`. `public/` é diferente: seu conteúdo entra no site publicado.

Ao clicar em **Abrir JSON** no aplicativo local, o seletor mostra diretamente os arquivos de `resumes/` e `public/resumes/`. Não é necessário navegar pelas pastas do computador. **Escolher em outra pasta** abre o seletor nativo para arquivos externos.

## Pastas de desenvolvimento

| Pasta | Função |
| --- | --- |
| `.agents/skills/editorcv-resume/` | Skill do Codex para criar, editar e importar currículos |
| `src/app/` | Interface, tipos, fontes e normalização dos dados |
| `src/app/components/` | Formulário, prévia, seletor de fontes e seletor de arquivos |
| `src/app/components/ui/` | Apenas os auxiliares de interface efetivamente usados |
| `src/styles/` | Estilos e tema, com uma única definição do tema |
| `src/export/` | Ponto de entrada que reutiliza a prévia na exportação |
| `scripts/` | Comandos de terminal |
| `scripts/lib/` | Validação, renderização e integração do aplicativo local |
| `schemas/` | Contrato JSON verificável |
| `examples/` | Modelo neutro para criar um currículo, sem dados do autor |
| `tests/` | Testes da interface, arquivos, contrato JSON e PDFs |
| `docs/` | Guias mantidos do formato e desta estrutura |

Guias principais: [formato JSON](resume-json.md), [comandos de terminal](cli.md) e [skill do Codex](../.agents/skills/editorcv-resume/SKILL.md). O README da raiz orienta a instalação inicial.

O schema descreve as regras; o exemplo mostra um documento vazio válido. Eles têm funções distintas. Os pontos de entrada da interface e da exportação também são distintos, mas ambos renderizam `ResumePreview` e usam `normalizeResumeData`; não há dois templates ativos de currículo para manter.

## Pastas geradas ou internas

| Pasta | Função |
| --- | --- |
| `node_modules/` | Dependências instaladas por `npm install`; não editar ou versionar |
| `dist/` | Site gerado por `npm run build`; não editar ou versionar |
| `.git/` | Histórico e metadados do Git |

`node_modules/` e `dist/` não são cópias do projeto-fonte. Elas são regeneráveis. A antiga pasta `ResumeEditor/` não é mais utilizada nem necessária.

## Auditoria de 22/10/2026

Foram revisados os arquivos do projeto, seus imports, referências na documentação, configurações de build, regras do Git e os caminhos dos comandos.

- Retirados 49 arquivos de componentes herdados do template, sem imports nos pontos de entrada do aplicativo ou do exportador. Eles foram comparados com os originais do Git antes da remoção. O formulário, a prévia e os dois auxiliares de UI usados foram preservados.
- Removidos `fix-form.cjs` e `update-ui-2.cjs`: eram scripts pontuais de geração que reescreviam componentes e acrescentavam estilos antigos. Não participavam do desenvolvimento, build ou exportação.
- Removido `guidelines/Guidelines.md`, um modelo vazio de instruções. As orientações reais ficam em `AGENTS.md` e na skill.
- Removido o README histórico com instruções desatualizadas. O `README.md` da raiz e os guias em `docs/` são as referências atuais.
- Créditos consolidados em `ATTRIBUTIONS.md`; retirada a cópia interna redundante.
- Retirado `default_theme.css`, que repetia variáveis já definidas e sobrescritas por `globals.css`.
- Removidas 46 dependências diretas sem uso. O arquivo de dependências travadas foi atualizado.
- Atualizado Vite de 6.3.5 para 6.4.5, mantendo a versão principal, e aplicadas correções compatíveis às dependências indiretas. A verificação `npm audit` terminou sem vulnerabilidades reportadas na data da auditoria.
- Mantidos os quatro JSONs públicos existentes e o modelo neutro. Nenhum dado de currículo foi removido ou reescrito durante a limpeza.
- As pastas locais de entrada, dados pessoais e saída continuam separadas dos arquivos públicos. A integração local lê apenas JSONs dessas pastas previstas, recusa caminhos externos e não inclui currículos pessoais no build.

## Exportação no aplicativo local e no site estático

Com `npm run dev`, **Exportar PDF** gera e baixa o arquivo usando o mesmo renderizador do terminal, com cabeçalhos e rodapés do navegador desativados. Isso remove URL, data, hora, título e paginação automática.

Um site estático servido somente a partir de `dist/` não executa ferramentas Node nem acessa as pastas privadas do computador. Nesse caso, o catálogo mostra os exemplos públicos e permite importar um arquivo externo; a exportação usa o diálogo de impressão. Desative **Cabeçalhos e rodapés** nesse diálogo, ou use o comando de terminal para uma geração controlada. O aplicativo informa essa condição ao imprimir.
