
# 📋 EditorCV — Editor de Currículo Dinâmico

Uma aplicação web moderna para editar e personalizar currículos de forma intuitiva, com pré-visualização em tempo real, suporte bilíngue (PT/EN) e exportação para PDF.

![License](https://img.shields.io/badge/license-MIT-blue)
![Vite](https://img.shields.io/badge/built%20with-Vite-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/powered%20by-React%2018-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/typed%20with-TypeScript-3178c6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/styled%20with-Tailwind%20CSS-06b6d4?logo=tailwindcss)

---

## 🎯 Visão Geral

**EditorCV** é um editor de currículo baseado em JSON que oferece:

- ✨ **Edição intuitiva em tempo real** — Painel duplo com formulário e pré-visualização sincronizados
- 🎨 **Design profissional** — Layout A4 responsivo com múltiplas visualizações (Resume, ATS Resume, Figma Export)
- 🌐 **Suporte bilíngue** — Edite em português e inglês com tradução automática de títulos de seções
- 📊 **Controle total de layout** — Ajuste escala de fonte, títulos e altura de linha
- 🔄 **Reordenação visual** — Arraste ou use setas para reorganizar módulos com animação FLIP
- 📁 **Gerenciamento de arquivos** — Abra, salve e exporte JSON com suporte a File Picker API
- 📄 **Exportação PDF** — Print ou PDF via navegador
- 🎛️ **Personalização de módulos** — Edite nomes, visibilidade e ordem de cada seção

---

## 🚀 Quick Start

### Pré-requisitos
- **Node.js** 18+ 
- **npm** 9+

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

## 🔍 Recursos Internos

### Componentes UI Personalizados
- `accordion.tsx` — Acordeões expansíveis
- Diversos componentes Radix UI pré-configurados
- Custom styling consistente com Tailwind

### Utilitários
- `utils.ts` — Helper functions (cn, classNames)
- `types/resume.ts` — Type-safe resume data

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

## 🤝 Contribuindo

Sugestões de melhorias:
1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📞 Suporte

Para dúvidas ou issues:
- Abra uma [GitHub Issue](https://github.com/seu-usuario/EditorCV/issues)
- Consulte a documentação de tecnologias usadas:
  - [React Docs](https://react.dev)
  - [Vite Guide](https://vitejs.dev/guide/)
  - [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🎓 Aprendizados

Este projeto demonstra:
- ✅ State management em React com hooks
- ✅ TypeScript type-safe development
- ✅ Drag & drop com dnd-kit e animações FLIP
- ✅ CSS custom properties para escalabilidade
- ✅ Componentes acessíveis com Radix UI
- ✅ Build otimizado com Vite
- ✅ Responsividade com Tailwind CSS
- ✅ JSON schema validation e normalização

---

**Desenvolvido com ❤️ usando React, TypeScript e Tailwind CSS.**
  