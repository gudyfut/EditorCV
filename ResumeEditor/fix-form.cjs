const fs = require('fs');

// 1. UPDATE GLOBALS.CSS
const cssPath = 'C:/Users/T-GAMER/Documents/GitHub/EditorCV/FigmaResume/src/styles/globals.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

const newCSS = `
/* --- FRESH FORM DESIGN --- */
.content-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px 0;
}

.item-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.item-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.item-card-title {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin: 0;
}

.item-card-remove {
  color: #94a3b8;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.item-card-remove:hover {
  color: #ef4444;
  background: #fee2e2;
}

.item-card-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.input-grid-1 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-size: 12px;
  font-weight: 500;
  color: #475569;
}

.form-control {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
  color: #0f172a;
  background: #ffffff;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

textarea.form-control {
  min-height: 80px;
  resize: vertical;
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  color: #3b82f6;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  min-height: 42px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 2px 8px;
  border-radius: 100px;
  font-size: 12px;
  color: #334155;
}

.chip button {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.chip button:hover {
  color: #ef4444;
}

/* FIX PREVIEW SCROLLING */
.preview-panel {
  border-radius: 14px;
  background: radial-gradient(circle at center, #f4f7fb 0%, #e2e8f0 100%);
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.05);
  overflow-y: auto !important; /* CRITICAL FIX FOR TRUNCATION */
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

/* Make sure container doesn't force hidden */
.editor-layout {
  overflow: hidden;
}
`;

// Replace preview-panel if exists, otherwise append
cssContent = cssContent.replace(/\.preview-panel\s*\{[^}]+\}/g, '');
cssContent += '\n\n' + newCSS;

fs.writeFileSync(cssPath, cssContent);

// 2. UPDATE RESUMEFORM.TSX
const formPath = 'C:/Users/T-GAMER/Documents/GitHub/EditorCV/FigmaResume/src/app/components/ResumeForm.tsx';
let formContent = fs.readFileSync(formPath, 'utf8');

const regex = /const renderSectionContent = \(sectionKey: SectionKey\) => \{[\s\S]*?return \([\s\S]*?<\/[a-z]+>\s*\);\s*\};\s*return \(/m;

const newRender = `const renderSectionContent = (sectionKey: SectionKey) => {
    if (sectionKey === "sobre") {
      return (
        <div className="content-section">
          <div className="form-group">
            <label>Resumo Profissional</label>
            <textarea
              className="form-control"
              value={data.secoes.sobre.conteudo}
              onChange={(event) => updateSobre(event.target.value)}
              placeholder="Escreva um breve resumo sobre você..."
            />
          </div>
        </div>
      );
    }

    if (sectionKey === "skills") {
      return (
        <div className="content-section">
          {data.secoes.skills.grupos.map((group, groupIndex) => (
            <div className="item-card" key={\`skill-group-\${groupIndex}\`}>
              <div className="item-card-header">
                <h3 className="item-card-title">Grupo de Skills {groupIndex + 1}</h3>
                <button
                  type="button"
                  className="item-card-remove"
                  onClick={() => removeSkillGroup(groupIndex)}
                  title="Remover grupo"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="item-card-body">
                <div className="form-group">
                  <label>Nome do Grupo (ex: Linguagens)</label>
                  <input
                    className="form-control"
                    value={group.label}
                    onChange={(event) => updateSkillGroupLabel(groupIndex, event.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Skills Adicionadas</label>
                  <div className="chips-container">
                    {group.itens.map((item, itemIndex) => (
                      <span className="chip" key={\`skill-item-\${groupIndex}-\${itemIndex}\`}>
                        {item}
                        <button type="button" onClick={() => removeSkillItem(groupIndex, itemIndex)}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {group.itens.length === 0 && <span style={{ color: '#94a3b8', fontSize: '12px' }}>Nenhuma skill adicionada.</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Adicionar nova skill (pressione Enter ou separe por vírgula)</label>
                  <input
                    className="form-control"
                    value={draftInputs[\`skills-\${groupIndex}\`] ?? ""}
                    placeholder="React, TypeScript..."
                    onChange={(event) => setDraftValue(\`skills-\${groupIndex}\`, event.target.value)}
                    onKeyDown={(event) =>
                      onDraftKeyDown(event, \`skills-\${groupIndex}\`, (items) => addSkillItems(groupIndex, items))
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addSkillGroup}>
            <Plus size={16} /> Adicionar Grupo de Skills
          </button>
        </div>
      );
    }

    if (sectionKey === "formacao") {
      return (
        <div className="content-section">
          {data.secoes.formacao.itens.map((item, index) => (
            <div className="item-card" key={\`formacao-\${index}\`}>
              <div className="item-card-header">
                <h3 className="item-card-title">Formação {index + 1}</h3>
                <button
                  type="button"
                  className="item-card-remove"
                  onClick={() => removeFormacao(index)}
                >
                  <X size={14} />
                </button>
              </div>
              <div className="item-card-body">
                <div className="input-grid-2">
                  <div className="form-group">
                    <label>Curso / Titulação</label>
                    <input
                      className="form-control"
                      value={item.titulo}
                      onChange={(event) => updateFormacao(index, "titulo", event.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Instituição</label>
                    <input
                      className="form-control"
                      value={item.instituicao}
                      onChange={(event) => updateFormacao(index, "instituicao", event.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Período (ex: 2020 - 2024)</label>
                    <input
                      className="form-control"
                      value={item.periodo}
                      onChange={(event) => updateFormacao(index, "periodo", event.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status (ex: Concluído)</label>
                    <input
                      className="form-control"
                      value={item.status}
                      onChange={(event) => updateFormacao(index, "status", event.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addFormacao}>
            <Plus size={16} /> Adicionar Formação
          </button>
        </div>
      );
    }

    if (sectionKey === "experiencia") {
      return (
        <div className="content-section">
          {data.secoes.experiencia.itens.map((item, index) => (
            <div className="item-card" key={\`experiencia-\${index}\`}>
              <div className="item-card-header">
                <h3 className="item-card-title">Experiência {index + 1}</h3>
                <button
                  type="button"
                  className="item-card-remove"
                  onClick={() => removeExperiencia(index)}
                >
                  <X size={14} />
                </button>
              </div>
              <div className="item-card-body">
                <div className="input-grid-2">
                  <div className="form-group">
                    <label>Cargo</label>
                    <input
                      className="form-control"
                      value={item.cargo}
                      onChange={(event) => updateExperiencia(index, "cargo", event.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Empresa</label>
                    <input
                      className="form-control"
                      value={item.empresa}
                      onChange={(event) => updateExperiencia(index, "empresa", event.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Período (ex: Jan 2021 - Presente)</label>
                    <input
                      className="form-control"
                      value={item.periodo || ''}
                      onChange={(event) => updateExperiencia(index, "periodo", event.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Atividades e Conquistas (Bullets)</label>
                  <div className="chips-container" style={{ flexDirection: 'column', gap: '8px', padding: '12px' }}>
                    {item.bullets.map((bullet, bulletIndex) => (
                      <div className="chip" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '6px 12px', borderRadius: '6px' }} key={\`bullet-\${index}-\${bulletIndex}\`}>
                        <span style={{ flex: 1, whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '1.4' }}>{bullet}</span>
                        <button type="button" style={{ padding: '4px' }} onClick={() => removeBullet(index, bulletIndex)}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {item.bullets.length === 0 && <span style={{ color: '#94a3b8', fontSize: '12px' }}>Nenhuma atividade adicionada.</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Nova atividade (pressione Enter)</label>
                  <input
                    className="form-control"
                    value={draftInputs[\`bullets-\${index}\`] ?? ""}
                    placeholder="Liderou equipe de 5 pessoas..."
                    onChange={(event) => setDraftValue(\`bullets-\${index}\`, event.target.value)}
                    onKeyDown={(event) =>
                      onDraftKeyDown(event, \`bullets-\${index}\`, (items) => addBulletItems(index, items))
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addExperiencia}>
            <Plus size={16} /> Adicionar Experiência
          </button>
        </div>
      );
    }

    return (
      <div className="content-section">
        {data.secoes.competencias.itens.map((item, index) => (
          <div className="item-card" key={\`competencia-\${index}\`}>
            <div className="item-card-header">
              <h3 className="item-card-title">Competência {index + 1}</h3>
              <button
                type="button"
                className="item-card-remove"
                onClick={() => removeCompetencia(index)}
              >
                <X size={14} />
              </button>
            </div>
            <div className="item-card-body">
              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  className="form-control"
                  value={item}
                  placeholder="Descreva uma competência..."
                  onChange={(event) => updateCompetencia(index, event.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addCompetenciaCard}>
          <Plus size={16} /> Adicionar Competência
        </button>
      </div>
    );
  };

  return (`;

// 3. Replace Accordion header buttons inside ResumeForm content since we moved the buttons to the bottom 
formContent = formContent.replace(regex, newRender);

// Replace any occurrence of the old header actions
formContent = formContent.replace(/<div className="cv-editor-module-actions mb-2 flex justify-end">[\s\S]*?<\/div>/g, '');

fs.writeFileSync(formPath, formContent);
