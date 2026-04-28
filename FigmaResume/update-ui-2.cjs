const fs = require('fs');

// --- 1. GLOBALS.CSS ---
const cssPath = 'C:/Users/T-GAMER/Documents/GitHub/EditorCV/FigmaResume/src/styles/globals.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Append the scaling logic. It overrides previous rules because it's at the bottom + !important
css += `\n
/* --- PERFECT FIT A4 PREVIEW --- */
.preview-panel {
  border-radius: 14px;
  background: radial-gradient(circle at center, #f1f5f9 0%, #e2e8f0 100%);
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.05);
  overflow: hidden !important; 
  padding: 0 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

@media screen {
  .resume-paper {
    width: 210mm !important;
    height: 297mm !important;
    min-height: 297mm !important;
    padding: 14mm !important;
    margin: 0 !important;
    transform-origin: center center;
    /* Scale dynamically to viewport minus 88px of toolbar/padding padding */
    transform: scale(min(calc((100dvh - 88px) / 1123), calc((50vw - 40px) / 794))) !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
  }
}

/* Improve Left Panel editor sessions padding */
.editor-session {
  padding: 16px 20px !important;
  border-radius: 14px !important;
}
`;

fs.writeFileSync(cssPath, css);


// --- 2. RESUMEFORM.TSX ---
const formPath = 'C:/Users/T-GAMER/Documents/GitHub/EditorCV/FigmaResume/src/app/components/ResumeForm.tsx';
let form = fs.readFileSync(formPath, 'utf8');

// Replace Dados Pessoais
form = form.replace(
  /<header className="session-header !mb-0 flex-row items-center gap-2">[\s\S]*?<\/header>/,
  `<header style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px', marginBottom: '0', padding: '4px 0', width: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', flexShrink: 0 }}>
      <User size={20} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left', flex: 1 }}>
      <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0f172a', textTransform: 'none', letterSpacing: 'normal' }}>Dados Pessoais</h2>
      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Informações básicas exibidas no topo do currículo</p>
    </div>
  </header>`
);

// Replace Ajustes Visuais
form = form.replace(
  /<header className="session-header !mb-0 flex-row items-center gap-2">[\s\S]*?<\/header>/,
  `<header style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px', marginBottom: '0', padding: '4px 0', width: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', background: '#f5f3ff', color: '#8b5cf6', flexShrink: 0 }}>
      <Settings2 size={20} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left', flex: 1 }}>
      <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0f172a', textTransform: 'none', letterSpacing: 'normal' }}>Ajustes Visuais</h2>
      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Controle profissional de tipografia e ritmo</p>
    </div>
  </header>`
);

// Replace Ordem dos Módulos
form = form.replace(
  /<header className="session-header !mb-0 flex-row items-center gap-2">[\s\S]*?<\/header>/,
  `<header style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px', marginBottom: '0', padding: '4px 0', width: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', background: '#fffbeb', color: '#d97706', flexShrink: 0 }}>
      <LayoutList size={20} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left', flex: 1 }}>
      <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0f172a', textTransform: 'none', letterSpacing: 'normal' }}>Ordem dos Módulos</h2>
      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Reordene e controle a visibilidade</p>
    </div>
  </header>`
);

// Replace Conteúdo dos Módulos
form = form.replace(
  /<header className="session-header !mb-0 flex-row items-center gap-2">[\s\S]*?<\/header>/,
  `<header style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px', marginBottom: '0', padding: '4px 0', width: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', flexShrink: 0 }}>
      <FileText size={20} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left', flex: 1 }}>
      <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0f172a', textTransform: 'none', letterSpacing: 'normal' }}>Conteúdo dos Módulos</h2>
      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Edite cada bloco de conteúdo em detalhes</p>
    </div>
  </header>`
);

// Replace Inner Accordion Header
form = form.replace(
  /<AccordionTrigger className="hover:no-underline py-1 cv-editor-module-header">[\s\S]*?<\/AccordionTrigger>/g,
  `<AccordionTrigger className="hover:no-underline py-3 px-2" style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc', borderRadius: '6px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div>
      <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#334155', textTransform: 'none', letterSpacing: 'normal' }}>
        {SECTION_LABELS[sectionKey]}
      </h2>
    </div>
  </AccordionTrigger>`
);

// Replace CollapsibleItem implementation
form = form.replace(
  /const CollapsibleItem: React\.FC<CollapsibleItemProps> = \(\{ title, onRemove, children \}\) => \{[\s\S]*?return \([\s\S]*?<\/div>\s*\);\s*\};/m,
  `const CollapsibleItem: React.FC<CollapsibleItemProps> = ({ title, onRemove, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="item-card" style={{ marginBottom: '10px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
      <div 
        className="item-card-header" 
        style={{ cursor: 'pointer', userSelect: 'none', padding: '14px 16px', background: isOpen ? '#f1f5f9' : '#ffffff', transition: 'background 0.2s', borderBottom: isOpen ? '1px solid #cbd5e1' : 'none' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          {isOpen ? <ChevronDown size={18} className="text-blue-500" /> : <ChevronRight size={18} className="text-slate-400" />}
          <h3 className="item-card-title" style={{ fontSize: '14px', color: isOpen ? '#0f172a' : '#475569', fontWeight: isOpen ? 600 : 500 }}>{title}</h3>
        </div>
        <button
          type="button"
          className="item-card-remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title="Remover item"
        >
          <X size={16} />
        </button>
      </div>
      {isOpen && (
        <div className="item-card-body" style={{ padding: '18px', background: '#ffffff' }}>
          {children}
        </div>
      )}
    </div>
  );
};`
);

fs.writeFileSync(formPath, form);
console.log("Done");