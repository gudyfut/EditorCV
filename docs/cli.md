# Comandos de terminal

Use Node.js 22.13 ou superior. Após clonar o repositório, execute na raiz:

```bash
npm ci
npm run pdf:setup
```

`pdf:setup` instala o Chromium usado na exportação. No Linux, se faltarem bibliotecas do sistema, use `npx playwright install --with-deps chromium`. Também é possível usar Chrome ou Edge já instalado, com `--browser chrome` ou `--browser msedge`.

Os comandos abaixo funcionam sem `npm run dev` e sem uma interface aberta. A geração de PDF, a extração e a validação são locais, sem API de IA ou envio de currículos a serviços externos. O Codex interpreta as informações ao usar a skill; os scripts fazem operações determinísticas com os arquivos.

## Exportar JSON para PDF

```bash
# Entrada e saída explícitas
node scripts/export-resume-pdf.mjs --input "resumes/meu curriculo.json" --output "output/resumes/versao final.pdf"

# Forma curta equivalente
node scripts/export-resume-pdf.mjs -i "resumes/meu curriculo.json" -o "output/resumes/versao final.pdf"

# Caminhos posicionais, mantendo a sintaxe anterior
node scripts/export-resume-pdf.mjs "resumes/meu curriculo.json" "output/resumes/versao final.pdf"

# Atualizar uma saída existente
node scripts/export-resume-pdf.mjs -i "resumes/meu curriculo.json" -o "output/resumes/versao final.pdf" --force

# Usar Edge instalado
node scripts/export-resume-pdf.mjs -i "resumes/meu curriculo.json" -o "output/resumes/versao final.pdf" --browser msedge
```

| Argumento | Comportamento |
| --- | --- |
| `--input`, `-i` | Caminho do JSON. Se omitido, usa `public/resumes/resume-data.json` do projeto |
| `--output`, `-o` | Caminho completo do arquivo `.pdf`, com nome e extensão |
| Saída omitida | `output/resumes/<nome-do-json>.pdf`, dentro do projeto |
| `--force`, `-f` | Permite substituir um PDF existente; nunca o arquivo de entrada |
| `--browser` | `chromium` (padrão), `chrome` ou `msedge` |
| `--help`, `-h` | Exibe a ajuda e termina sem gerar arquivo |

Não misture caminhos posicionais com `--input`/`--output` na mesma chamada. Outras opções, como `--force` e `--browser`, funcionam nas duas formas.

O comando valida o JSON antes de renderizar, usa o template real do aplicativo e desativa cabeçalhos e rodapés do navegador. Conteúdo longo pode ocupar várias páginas; nenhuma informação é removida automaticamente para fazê-lo caber.

## Extrair texto e links de um PDF

```bash
node scripts/extract-resume-pdf.mjs --input "input/resumes/curriculo antigo.pdf" --output "input/resumes/texto extraido.txt"
```

Aceita as mesmas duas formas de caminhos e os atalhos `-i`, `-o`, `-f` e `-h`. O arquivo de entrada é obrigatório. A saída deve terminar em `.txt`; quando omitida, será `input/resumes/<nome-do-pdf>.txt`, dentro do projeto, mesmo que o PDF esteja em outra pasta.

O texto inclui separadores de páginas e os destinos dos links. O extrator **não cria o JSON**, não traduz nem executa OCR. PDFs digitalizados precisam de leitura visual ou OCR. A skill [editorcv-resume](../.agents/skills/editorcv-resume/SKILL.md) orienta o Codex a interpretar a extração e escrever o currículo no formato correto.

## Validar JSON

```bash
node scripts/validate-resume.mjs "resumes/meu curriculo.json"
node scripts/validate-resume.mjs "resumes/meu curriculo.json" "resumes/meu curriculo-en.json"
```

Sem argumentos, valida o currículo padrão. Aceita vários caminhos posicionais e `--help`/`-h`; não usa `--input`/`--output`, pois não gera arquivos. A verificação cobre estrutura, campos, tipos, limites de layout, IDs e ordens duplicadas. Ela não verifica a veracidade das informações.

## Caminhos e arquivos de saída

- Coloque caminhos com espaços entre aspas. Acentos são aceitos.
- Caminhos relativos informados no comando são resolvidos a partir da pasta atual do terminal. Execute da raiz para usar os exemplos deste guia sem adaptações.
- Caminhos absolutos também funcionam, inclusive fora do projeto. As pastas de saída são criadas automaticamente.
- `--output` deve incluir o **nome do arquivo**, não somente a pasta. Se o destino desejado é uma pasta, acrescente um nome terminado em `.pdf` ou `.txt`.
- Saídas existentes são preservadas sem `--force`. Entrada e saída não podem apontar para o mesmo arquivo, mesmo por um link com nome diferente.
- Os padrões de saída sempre ficam dentro do projeto. Arquivos exportados para outra pasta não herdam automaticamente as regras do `.gitignore`.
- Uma execução bem-sucedida termina com código `0`; erros de argumentos, leitura, validação ou exportação terminam com código `1` e uma mensagem no terminal.

Exemplo com caminho absoluto no Windows:

```powershell
node scripts/export-resume-pdf.mjs -i "C:\Curriculos\meu curriculo.json" -o "C:\Curriculos\PDFs\curriculo final.pdf" --force
```

Exemplo em macOS/Linux:

```bash
node scripts/export-resume-pdf.mjs -i "/home/pessoa/curriculos/meu curriculo.json" -o "/home/pessoa/curriculos/PDFs/curriculo final.pdf" --force
```

## Atalhos npm e PowerShell

```bash
npm run resume:pdf
npm run resume:pdf -- "resumes/meu curriculo.json" "output/resumes/curriculo.pdf"
npm run resume:extract -- "input/resumes/curriculo antigo.pdf"
npm run resume:validate -- "resumes/meu curriculo.json"
```

Em algumas instalações do PowerShell, `npm.ps1` consome opções como `--output`, `--force` e `--help`. Prefira os comandos `node scripts/...` deste guia, ou use `npm.cmd`:

```powershell
npm.cmd run resume:pdf -- --input "resumes/meu curriculo.json" --output "output/resumes/curriculo.pdf" --force
```

Ao usar npm, coloque os argumentos do programa depois do separador `--`. Nenhum desses comandos requer copiar a skill para uma pasta global: ela acompanha o repositório em `.agents/skills/editorcv-resume/`.
