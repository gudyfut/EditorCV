# 📋 EditorCV — Editor de Currículo JSON Dinâmico

Ferramenta pessoal para editar, personalizar e exportar currículos rapidamente em tempo real. Suporte bilíngue (português/inglês) e múltiplos ajustes de layout.

---

## � Como Usar

### 1. Entre na pasta do projeto
```bash
cd FigmaResume
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Inicie o desenvolvimento
```bash
npm run dev
```

O app abrirá em `http://localhost:5173`

### 4. Build para produção
```bash
npm run build
```

---

## ✨ Funcionalidades Principais

- 🎨 **Design moderno e responsivo** — Layout A4 com pré-visualização em tempo real
- 📝 **Edição intuitiva** — Painel duplo (formulário + preview)
- 🌐 **Bilíngue** — Suporte para português e inglês nativamente
- 🎯 **Controle visual** — Ajuste escala, títulos, altura de linha
- 🔄 **Reordenação visual** — Drag & drop com animação suave
- 📊 **Dados em JSON** — Portável, compartilhável e versionável
- 💾 **Salve/Exporte** — JSON ou PDF diretamente do navegador
- ♿ **Acessível** — Componentes Radix UI com suporte a keyboard

---

## 📚 Documentação Completa

Para documentação detalhada, guias de uso avançado e arquitetura, consulte:

👉 **[FigmaResume/README.md](./FigmaResume/README.md)**

Lá você encontrará:
- ✅ Guia de uso completo
- ✅ Arquitetura e fluxo de dados
- ✅ Schema JSON detalhado
- ✅ Stack tecnológico
- ✅ Instruções de personalização
- ✅ Troubleshooting e FAQ

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18.3** — Componentes reactivos
- **TypeScript 5.6** — Type safety
- **Vite 6.3** — Build rápido
- **Tailwind CSS 4.1** — Styling utilitário

### Componentes & Efeitos
- **Radix UI** — UI acessível
- **dnd-kit** — Drag and drop
- **Lucide React** — Ícones
- **Motion** — Animações

---

## 📸 Screenshots & Exemplos

### Painel Duplo de Edição
```
┌─────────────────────────────────┬──────────────────────────────┐
│  Formulário de Edição           │   Pré-visualização A4        │
│  ├─ Dados Pessoais              │   ┌────────────────────────┐ │
│  ├─ Ajustes Visuais             │   │ Nome                   │ │
│  ├─ Ordem dos Módulos           │   │ Cargo                  │ │
│  └─ Conteúdo dos Módulos        │   │ ────────────────────   │ │
│                                 │   │ SOBRE                  │ │
│                                 │   │ [Texto profissional]   │ │
│                                 │   │ SKILLS                 │ │
│                                 │   │ • Linguagens: ...      │ │
│                                 │   └────────────────────────┘ │
└─────────────────────────────────┴──────────────────────────────┘
```

---

## 📊 Fluxo de Dados

```
JSON (resume-data.json)
				↓
		App.tsx
				↓
		┌───┴───┐
		↓       ↓
 ResumeForm  ResumePreview
 (Edição)    (Visualização)
		↓       ↓
		└───┬───┘
				↓
	Alterações
				↓
	Salvar → JSON / PDF
```

---

## 📖 Estrutura de Dados

Currículos são armazenados em **JSON** com esta estrutura:

```json
{
	"meta": { "nome", "cargo", "telefone", "email" },
	"layout": { "fontScale", "headingScale", "lineHeight" },
	"secoes": {
		"sobre": { "visivel", "ordem", "titulo", "conteudo" },
		"skills": { "visivel", "ordem", "titulo", "grupos" },
		"formacao": { "visivel", "ordem", "titulo", "itens" },
		"experiencia": { "visivel", "ordem", "titulo", "itens" },
		"competencias": { "visivel", "ordem", "titulo", "itens" }
	}
}
```

Veja exemplos: `FigmaResume/public/resume-data.json` e `resume-data-en.json`

---

## 📜 Licença

Este projeto é distribuído sob a licença **MIT**.

### Atribuições
- Design original baseado em [Bilingual A4 Resume Design (Figma)](https://www.figma.com/design/zRwiNPYOL2iNqLM1CSn4Ve/Bilingual-A4-Resume-Design)
- Componentes [shadcn/ui](https://ui.shadcn.com/) — MIT License
- Ícones [Lucide React](https://lucide.dev/) — ISC License
- Imagens [Unsplash](https://unsplash.com/) — Unsplash License

Veja [FigmaResume/Attributions.md](./FigmaResume/Attributions.md) para detalhes completos.

---

**Desenvolvido para uso pessoal — edição rápida e customização de currículos.**
