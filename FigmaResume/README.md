
# 📋 EditorCV — Editor de Currículo Dinâmico

Aplicação para editar, customizar e exportar currículos rapidamente em tempo real, com pré-visualização em A4, suporte bilíngue (português/inglês) e exportação para PDF.

---

## ✨ O que É

**EditorCV** permite editar currículos via formulário e visualizar em tempo real:

- **Painel duplo** — Formulário de edição + pré-visualização A4 sincronizados
- **Bilíngue** — Crie versões em português e inglês
- **Layout customizável** — Ajuste escala, títulos, altura de linha
- **Reordenação visual** — Arraste ou use setas para reorganizar seções
- **Salve em JSON** — Dados portáveis para reutilização
- **Exporte para PDF** — Imprima ou salve como PDF direto do navegador

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- npm 9+

### Instalação e Desenvolvimento

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/EditorCV.git
cd EditorCV/FigmaResume

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo abrirá em `http://localhost:5173`.

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`.

---

## 📱 Como Usar

### 1. **Carregar Dados**
- Clique em **"Abrir JSON"** para importar um arquivo `resume-data.json` existente
- O app carrega automaticamente `/public/resume-data.json` como padrão

### 2. **Editar Dados Pessoais**
Na aba **"Dados Pessoais"**:
- Nome, título profissional, telefone, email
- Essas informações aparecem no topo do currículo

### 3. **Ajustar Visualização**
Na aba **"Ajustes Visuais"**:
- **Escala Geral** — Aumenta/diminui todo o documento (90%–135%)
- **Escala de Títulos** — Controla apenas os cabeçalhos de seção (90%–140%)
- **Altura de Linha** — Espacejamento entre linhas (1.15–1.55)

### 4. **Reordenar Módulos**
Na aba **"Ordem dos Módulos"**:
- **Arraste** os módulos para reorganizar
- Use **setas ↑/↓** para mover de um em um
- Clique no **olho** para mostrar/ocultar seções
- Veja as mudanças em tempo real na pré-visualização

### 5. **Editar Conteúdo**
Na aba **"Conteúdo dos Módulos"**:
- **Nome do módulo** — Customize o título que aparece no currículo (ex: "Sobre" → "Quem Sou")
- **Sobre** — Resumo profissional
- **Skills** — Grupos de habilidades (ex: Linguagens, Ferramentas)
- **Formação** — Educação e cursos
- **Experiência** — Histórico profissional com bullets
- **Competências** — Qualidades e atributos pessoais

### 6. **Salvar e Exportar**
- **Salvar JSON** — Clique em "Salvar JSON" para atualizar o arquivo
  - Se suportado, usa File Picker API para salvar no local
  - Caso contrário, faz download automático
- **Exportar PDF** — Use Ctrl+P ou clique em "Exportar PDF" para imprimir

### 7. **Bilíngue**
- Crie arquivos `resume-data.json` (português) e `resume-data-en.json` (inglês)
- Edite os campos `titulo` em cada seção para traduzir os nomes dos módulos
- O app respeita automaticamente os títulos salvos no JSON

---

## 🏗️ Arquitetura

### Estrutura de Pastas

```
FigmaResume/
├── src/
│   ├── app/
│   │   ├── App.tsx                 # Componente principal (orquestração)
│   │   ├── components/
│   │   │   ├── ResumeForm.tsx      # Editor com painéis de formulário
│   │   │   ├── ResumePreview.tsx   # Pré-visualização A4
│   │   │   ├── resume.tsx          # Template moderno (2-colunas)
│   │   │   ├── ats-resume.tsx      # Versão ATS (simples, legível)
│   │   │   ├── figma/
│   │   │   │   └── ImageWithFallback.tsx
│   │   │   └── ui/                 # Componentes Radix UI (accordion, etc)
│   │   ├── types/
│   │   │   └── resume.ts           # Interfaces TypeScript
│   │   ├── data/                   # Dados estáticos (se houver)
│   │   └── Attributions.md         # Créditos de bibliotecas
│   ├── main.tsx                    # Ponto de entrada
│   └── styles/
│       ├── globals.css             # Estilos globais + classes custom
│       └── index.css               # Import de estilos
├── public/
│   ├── resume-data.json            # Dados padrão (português)
│   └── resume-data-en.json         # Dados para versão em inglês
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

### Fluxo de Dados

```
App.tsx (estado global)
  ├── ResumeForm
  │   ├── Ordem dos Módulos (dnd-kit FLIP animation)
  │   ├── Conteúdo dos Módulos
  │   │   ├── Sobre
  │   │   ├── Skills
  │   │   ├── Formação
  │   │   ├── Experiência
  │   │   └── Competências
  │   └── Ajustes Visuais
  │
  └── ResumePreview
      ├── Processa JSON → renderiza A4
      ├── Aplica escala CSS custom props
      └── Suporta múltiplas visualizações
```

---

## 📊 Estrutura de Dados (JSON)

### Formato do `resume-data.json`

```json
{
  "meta": {
    "nome": "string",
    "cargo": "string",
    "telefone": "string",
    "email": "string"
  },
  "layout": {
    "fontScale": 1,           // Escala geral (0.9 a 1.35)
    "headingScale": 1,        // Escala de títulos (0.9 a 1.4)
    "lineHeight": 1.35        // Altura de linha (1.15 a 1.55)
  },
  "secoes": {
    "sobre": {
      "visivel": boolean,
      "ordem": number,
      "titulo": "string",     // Nome customizável (ex: "Quem Sou")
      "conteudo": "string"
    },
    "skills": {
      "visivel": boolean,
      "ordem": number,
      "titulo": "string",     // Ex: "COMPETÊNCIAS TÉCNICAS"
      "grupos": [
        {
          "label": "string",  // Ex: "Linguagens"
          "itens": ["string"]
        }
      ]
    },
    "formacao": {
      "visivel": boolean,
      "ordem": number,
      "titulo": "string",
      "itens": [
        {
          "titulo": "string",
          "instituicao": "string",
          "periodo": "string",
          "status": "string"
        }
      ]
    },
    "experiencia": {
      "visivel": boolean,
      "ordem": number,
      "titulo": "string",
      "itens": [
        {
          "cargo": "string",
          "empresa": "string",
          "periodo": "string",
          "bullets": ["string"]
        }
      ]
    },
    "competencias": {
      "visivel": boolean,
      "ordem": number,
      "titulo": "string",
      "itens": ["string"]
    }
  }
}
```

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18.3** — UI framework
- **TypeScript 5.6** — Type safety
- **Vite 6.3** — Build tool (HMR rápido)
- **Tailwind CSS 4.1** — Styling utilitário

### UI & Animação
- **Radix UI** — Componentes acessíveis (Accordion, Dialog, etc)
- **dnd-kit** — Drag & drop com animação FLIP
- **Lucide React** — Ícones SVG
- **Motion** — Animações suaves

### Funcionalidades
- **React Hook Form** — Gerenciamento de formulários
- **React Router** — Roteamento (preparado para expansão)
- **Sonner** — Notificações toast

### Desenvolvimento
- **Node 18+**
- **npm** para gerenciamento de pacotes

---

## 🎨 Personalização

### Temas e Estilos
- Edite `src/styles/globals.css` para mudanças globais
- Use Tailwind CSS para componentes customizados
- CSS custom properties no ResumePreview (ex: `--resume-font-scale`)

### Adicionar Novas Seções
1. Atualize o tipo em `src/app/types/resume.ts`
2. Adicione defaults em `package.json` → `DEFAULT_RESUME_LAYOUT`
3. Implemente renderização em `ResumePreview.tsx`
4. Crie UI de edição em `ResumeForm.tsx`

### Múltiplas Visualizações
O projeto suporta diferentes templates de currículo:
- **ResumePreview** — Layout principal editável
- **resume.tsx** — Template moderno 2-colunas (Figma export)
- **ats-resume.tsx** — Versão ATS simples e legível pelos robôs

---

## 📈 Funcionalidades Avançadas

### Animação FLIP
A reordenação de módulos usa [FLIP Animation](https://aerotwist.com/blog/flip-your-animations/):
- Capture posição **First** (antes da mudança)
- Aplique mudança no DOM
- Calcule diferença **Last** (após)
- Execute animação suave com `transform: translateY()`

Implementado em `ResumeForm.tsx` com `useLayoutEffect` para sincronismo perfeito.

### File Picker API
Suporta abertura/salvamento nativo de arquivos (Chrome, Edge, Firefox):
- Fallback para input `<input type="file">` em navegadores sem suporte
- Detecta automaticamente a disponibilidade

### Responsive Design
- Painel de edição ajustável (50% / 50%)
- Pré-visualização com zoom automático
- Suporte para tablets e telas pequenas

---



## 📖 Guia de Desenvolvimento

### Adicionar um Novo Campo

1. **Tipo** (`types/resume.ts`):
   ```typescript
   export interface ExperienciaItem {
     cargo: string;
     empresa: string;
     periodo: string;  // ← Novo campo
     bullets: string[];
   }
   ```

2. **Editor** (`ResumeForm.tsx`):
   ```typescript
   const updateExperiencia = (index: number, field: keyof ExperienciaItem, value: string) => {
     // Implementar lógica de atualização
   };
   ```

3. **Preview** (`ResumePreview.tsx`):
   ```jsx
   <p>{item.periodo}</p>
   ```

### Debug
- Use React DevTools para inspecionar estado
- Console do navegador para logs
- Inspecione o JSON via `F12` → Network

---

## 🐛 Troubleshooting

### JSON não carrega
- Verifique se o arquivo está em `public/resume-data.json`
- Confirme o formato JSON (use [jsonlint.com](https://jsonlint.com/))
- Abra o console do navegador para mensagens de erro

### Animação não funciona ao clicar nas setas
- Certifique-se de que `useLayoutEffect` é executado (verificar React DevTools)
- Teste em navegadores modernos (Chrome 90+, Firefox 88+)

### Styles não aplicados
- Limpe o cache (Ctrl+Shift+Delete ou F12 → Network → Disable cache)
- Reconstrua o projeto: `npm run build`

---

## 📄 Exportação

### PDF
1. Clique em **"Exportar PDF"** ou use Ctrl+P
2. O navegador abre o diálogo de impressão
3. Configure papel A4 e margens
4. Clique em "Salvar como PDF"

### JSON
- Salve o arquivo JSON via **"Salvar JSON"**
- Reutilize em outro navegador ou compartilhe

---

## 📜 Licença

Este projeto utiliza componentes e recursos de terceiros:

- **shadcn/ui** — Componentes Radix UI ([MIT License](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md))
- **Unsplash** — Fotos ([Unsplash License](https://unsplash.com/license))
- **Figma Make** — Template original ([Bilingual A4 Resume Design](https://www.figma.com/design/zRwiNPYOL2iNqLM1CSn4Ve/Bilingual-A4-Resume-Design))

Veja `Attributions.md` para detalhes completos.

---

**Desenvolvido para editar currículos de forma rápida e eficiente.**
  