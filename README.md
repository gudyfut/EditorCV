# 📋 EditorCV — Editor de Currículo JSON Dinâmico

Programa profissional para editar, personalizar e exportar currículos em tempo real, com suporte bilíngue (PT/EN) e múltiplos layouts.

![Repository Status](https://img.shields.io/badge/status-active-success)
![Last Commit](https://img.shields.io/github/last-commit/seu-usuario/EditorCV)
![Languages](https://img.shields.io/badge/languages-Portuguese%20%26%20English-blue)

---

## 📁 Estrutura do Repositório

```
EditorCV/
├── FigmaResume/               # ⭐ Aplicação principal
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md              # 📖 Documentação completa
│
├── LICENSE                    # Licença MIT
└── README.md                  # Este arquivo
```

---

## 🚀 Quick Start

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

## 🎯 Casos de Uso

### Para Profissionais
- ✅ Criar currículo em português e inglês lado a lado
- ✅ Ajustar visual para diferentes setores
- ✅ Exportar para PDF sem deixar o navegador
- ✅ Versionar currículo com Git (JSON é legível)

### Para Recrutadores
- ✅ Criar templates personalizados
- ✅ Compartilhar JSON com candidatos
- ✅ Coletar dados estruturados

### Para Desenvolvedores
- ✅ Aprender padrões React/TypeScript
- ✅ Base para ferramentas customizadas
- ✅ Exemplo de drag & drop com FLIP animation
- ✅ Componentização Radix UI

---

## 🔧 Requisitos do Sistema

- **Node.js** 18 ou superior
- **npm** 9 ou superior
- Navegador moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

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

## 🤝 Contribuindo

Interessado em melhorar EditorCV?

1. **Fork** este repositório
2. **Crie uma branch** para sua feature: `git checkout -b feature/minha-feature`
3. **Commit** suas mudanças: `git commit -m "Add minha-feature"`
4. **Push** para a branch: `git push origin feature/minha-feature`
5. **Abra um Pull Request**

### Áreas com Potencial de Contribuição
- 🎨 Novos templates de currículo
- 🌍 Mais idiomas (além de PT e EN)
- 📱 Melhorias de responsividade
- 🔌 Integrações com APIs (LinkedIn, Indeed, etc)
- 🧪 Mais testes unitários
- 📖 Documentação adicional

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

## 📞 Contato & Suporte

### Issues e Sugestões
- Abra uma [GitHub Issue](https://github.com/seu-usuario/EditorCV/issues)
- Use templates de Issue para melhor rastreamento

### Recursos Úteis
- 📖 [React Documentation](https://react.dev)
- 📖 [Vite Guide](https://vitejs.dev)
- 📖 [Tailwind CSS](https://tailwindcss.com)
- 📖 [Radix UI](https://www.radix-ui.com)
- 📖 [dnd-kit](https://docs.dndkit.com)

---

## 🎓 Aprendizados & Inspiração

Este projeto foi inspirado por:
- ✅ Dificuldade em encontrar ferramentas gratuitas para editar currículo
- ✅ Necessidade de versionar currículo com Git
- ✅ Vontade de aprender padrões modernos React/TypeScript
- ✅ Interesse em UI/UX de aplicações de produtividade

**Desenvolvido com ❤️ por desenvolvedores que entendem a importância de um bom currículo.**

---

## 🚀 Roadmap Futuro

- [ ] Suporte a tema claro/escuro
- [ ] Mais templates de layout
- [ ] Editor de cores customizadas
- [ ] Sincronização com cloud (Firebase, Supabase)
- [ ] Compartilhamento público de currículos
- [ ] Análise de conteúdo (word count, keywords)
- [ ] Integração com LinkedIn
- [ ] Mobile app (React Native)

---

**⭐ Se este projeto foi útil, considere dar uma star! ⭐**
