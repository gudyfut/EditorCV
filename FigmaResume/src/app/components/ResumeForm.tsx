import React, { useState } from "react";
import { ChevronUp, ChevronDown, Eye, EyeOff, Plus, X } from "lucide-react";
import { ResumeData } from "../types/resume";

interface ResumeFormProps {
  data: ResumeData;
  onDataChange: (nextData: ResumeData) => void;
}

type SectionKey = keyof ResumeData["secoes"];

const SECTION_LABELS: Record<SectionKey, string> = {
  sobre: "Sobre",
  skills: "Skills",
  formacao: "Formação",
  experiencia: "Experiência",
  competencias: "Competências",
};

export const ResumeForm: React.FC<ResumeFormProps> = ({ data, onDataChange }) => {
  const [draftInputs, setDraftInputs] = useState<Record<string, string>>({});

  const orderedSectionKeys = (Object.keys(data.secoes) as SectionKey[]).sort(
    (a, b) => data.secoes[a].ordem - data.secoes[b].ordem,
  );

  const parseInputItems = (raw: string): string[] =>
    raw
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

  const setDraftValue = (key: string, value: string) => {
    setDraftInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const commitDraftItems = (key: string, onItems: (items: string[]) => void) => {
    const items = parseInputItems(draftInputs[key] ?? "");
    if (items.length === 0) {
      return;
    }
    onItems(items);
    setDraftValue(key, "");
  };

  const onDraftKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    key: string,
    onItems: (items: string[]) => void,
  ) => {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    commitDraftItems(key, onItems);
  };

  const updateMeta = (field: keyof ResumeData["meta"], value: string) => {
    onDataChange({
      ...data,
      meta: {
        ...data.meta,
        [field]: value,
      },
    });
  };

  const updateLayout = (field: keyof ResumeData["layout"], value: number) => {
    onDataChange({
      ...data,
      layout: {
        ...data.layout,
        [field]: value,
      },
    });
  };

  const updateSectionVisibility = (section: keyof ResumeData["secoes"], visivel: boolean) => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        [section]: {
          ...data.secoes[section],
          visivel,
        },
      },
    });
  };

  const applySectionOrder = (nextOrder: SectionKey[]) => {
    const nextSecoes: ResumeData["secoes"] = {
      ...data.secoes,
    };

    nextOrder.forEach((sectionKey, index) => {
      nextSecoes[sectionKey] = {
        ...nextSecoes[sectionKey],
        ordem: index + 1,
      };
    });

    onDataChange({
      ...data,
      secoes: nextSecoes,
    });
  };

  const moveSection = (sectionKey: SectionKey, direction: "up" | "down") => {
    const currentIndex = orderedSectionKeys.indexOf(sectionKey);
    if (currentIndex === -1) {
      return;
    }

    const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (nextIndex < 0 || nextIndex >= orderedSectionKeys.length) {
      return;
    }

    const nextOrder = [...orderedSectionKeys];
    const [moved] = nextOrder.splice(currentIndex, 1);
    nextOrder.splice(nextIndex, 0, moved);
    applySectionOrder(nextOrder);
  };

  const updateSobre = (conteudo: string) => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        sobre: {
          ...data.secoes.sobre,
          conteudo,
        },
      },
    });
  };

  const addSkillGroup = () => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        skills: {
          ...data.secoes.skills,
          grupos: [...data.secoes.skills.grupos, { label: "Novo Grupo", itens: [] }],
        },
      },
    });
  };

  const removeSkillGroup = (groupIndex: number) => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        skills: {
          ...data.secoes.skills,
          grupos: data.secoes.skills.grupos.filter((_, idx) => idx !== groupIndex),
        },
      },
    });
  };

  const updateSkillGroupLabel = (groupIndex: number, label: string) => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        skills: {
          ...data.secoes.skills,
          grupos: data.secoes.skills.grupos.map((group, idx) =>
            idx === groupIndex ? { ...group, label } : group,
          ),
        },
      },
    });
  };

  const addSkillItems = (groupIndex: number, itemsToAdd: string[]) => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        skills: {
          ...data.secoes.skills,
          grupos: data.secoes.skills.grupos.map((group, idx) =>
            idx === groupIndex ? { ...group, itens: [...group.itens, ...itemsToAdd] } : group,
          ),
        },
      },
    });
  };

  const removeSkillItem = (groupIndex: number, itemIndex: number) => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        skills: {
          ...data.secoes.skills,
          grupos: data.secoes.skills.grupos.map((group, idx) =>
            idx === groupIndex
              ? { ...group, itens: group.itens.filter((_, skillIdx) => skillIdx !== itemIndex) }
              : group,
          ),
        },
      },
    });
  };

  const addFormacao = () => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        formacao: {
          ...data.secoes.formacao,
          itens: [
            ...data.secoes.formacao.itens,
            { titulo: "", instituicao: "", periodo: "", status: "" },
          ],
        },
      },
    });
  };

  const removeFormacao = (index: number) => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        formacao: {
          ...data.secoes.formacao,
          itens: data.secoes.formacao.itens.filter((_, idx) => idx !== index),
        },
      },
    });
  };

  const updateFormacao = (
    index: number,
    field: keyof ResumeData["secoes"]["formacao"]["itens"][number],
    value: string,
  ) => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        formacao: {
          ...data.secoes.formacao,
          itens: data.secoes.formacao.itens.map((item, idx) =>
            idx === index ? { ...item, [field]: value } : item,
          ),
        },
      },
    });
  };

  const addExperiencia = () => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        experiencia: {
          ...data.secoes.experiencia,
          itens: [...data.secoes.experiencia.itens, { cargo: "", empresa: "", bullets: [] }],
        },
      },
    });
  };

  const removeExperiencia = (index: number) => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        experiencia: {
          ...data.secoes.experiencia,
          itens: data.secoes.experiencia.itens.filter((_, idx) => idx !== index),
        },
      },
    });
  };

  const updateExperiencia = (
    index: number,
    field: keyof ResumeData["secoes"]["experiencia"]["itens"][number],
    value: string,
  ) => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        experiencia: {
          ...data.secoes.experiencia,
          itens: data.secoes.experiencia.itens.map((item, idx) =>
            idx === index ? { ...item, [field]: value } : item,
          ),
        },
      },
    });
  };

  const addBulletItems = (experienceIndex: number, itemsToAdd: string[]) => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        experiencia: {
          ...data.secoes.experiencia,
          itens: data.secoes.experiencia.itens.map((item, idx) =>
            idx === experienceIndex ? { ...item, bullets: [...item.bullets, ...itemsToAdd] } : item,
          ),
        },
      },
    });
  };

  const removeBullet = (experienceIndex: number, bulletIndex: number) => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        experiencia: {
          ...data.secoes.experiencia,
          itens: data.secoes.experiencia.itens.map((item, idx) =>
            idx === experienceIndex
              ? { ...item, bullets: item.bullets.filter((_, bIdx) => bIdx !== bulletIndex) }
              : item,
          ),
        },
      },
    });
  };

  const addCompetencias = (itemsToAdd: string[]) => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        competencias: {
          ...data.secoes.competencias,
          itens: [...data.secoes.competencias.itens, ...itemsToAdd],
        },
      },
    });
  };

  const removeCompetencia = (index: number) => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        competencias: {
          ...data.secoes.competencias,
          itens: data.secoes.competencias.itens.filter((_, idx) => idx !== index),
        },
      },
    });
  };

  const addCompetenciaCard = () => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        competencias: {
          ...data.secoes.competencias,
          itens: [...data.secoes.competencias.itens, ""],
        },
      },
    });
  };

  const updateCompetencia = (index: number, value: string) => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        competencias: {
          ...data.secoes.competencias,
          itens: data.secoes.competencias.itens.map((item, idx) => (idx === index ? value : item)),
        },
      },
    });
  };

  const renderSectionContent = (sectionKey: SectionKey) => {
    if (sectionKey === "sobre") {
      return (
        <label>
          Conteudo
          <textarea value={data.secoes.sobre.conteudo} onChange={(event) => updateSobre(event.target.value)} />
        </label>
      );
    }

    if (sectionKey === "skills") {
      return (
        <div className="stack-sm tight-stack dense-cards-grid skills-cards-grid">
          {data.secoes.skills.grupos.map((group, groupIndex) => (
            <div className="editor-block" key={`skill-group-${groupIndex}`}>
              <button
                type="button"
                className="item-remove-btn"
                title="Remover grupo"
                onClick={() => removeSkillGroup(groupIndex)}
              >
                <X size={12} />
              </button>

              <div className="skills-top">
                <input
                  className="group-title-input"
                  value={group.label}
                  onChange={(event) => updateSkillGroupLabel(groupIndex, event.target.value)}
                />
                <div className="chip-entry-row inline-chip-entry">
                  <input
                    value={draftInputs[`skills-${groupIndex}`] ?? ""}
                    placeholder="item1, item2"
                    onChange={(event) => setDraftValue(`skills-${groupIndex}`, event.target.value)}
                    onKeyDown={(event) =>
                      onDraftKeyDown(event, `skills-${groupIndex}`, (items) => addSkillItems(groupIndex, items))
                    }
                  />
                </div>
              </div>

              <div className="chip-box">
                <div className="chip-list">
                  {group.itens.map((item, itemIndex) => (
                    <span className="item-chip" key={`skill-item-${groupIndex}-${itemIndex}`}>
                      {item}
                      <button type="button" onClick={() => removeSkillItem(groupIndex, itemIndex)}>
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (sectionKey === "formacao") {
      return (
        <div className="stack-sm tight-stack dense-cards-grid">
          {data.secoes.formacao.itens.map((item, index) => (
            <div className="editor-block" key={`formacao-${index}`}>
              <button
                type="button"
                className="item-remove-btn"
                title="Remover item"
                onClick={() => removeFormacao(index)}
              >
                <X size={12} />
              </button>

              <div className="field-grid compact-grid">
                <label>
                  Titulo
                  <input
                    value={item.titulo}
                    onChange={(event) => updateFormacao(index, "titulo", event.target.value)}
                  />
                </label>
                <label>
                  Instituicao
                  <input
                    value={item.instituicao}
                    onChange={(event) => updateFormacao(index, "instituicao", event.target.value)}
                  />
                </label>
                <label>
                  Periodo
                  <input
                    value={item.periodo}
                    onChange={(event) => updateFormacao(index, "periodo", event.target.value)}
                  />
                </label>
                <label>
                  Status
                  <input
                    value={item.status}
                    onChange={(event) => updateFormacao(index, "status", event.target.value)}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (sectionKey === "experiencia") {
      return (
        <div className="stack-sm tight-stack dense-cards-grid">
          {data.secoes.experiencia.itens.map((item, index) => (
            <div className="editor-block" key={`experiencia-${index}`}>
              <button
                type="button"
                className="item-remove-btn"
                title="Remover item"
                onClick={() => removeExperiencia(index)}
              >
                <X size={12} />
              </button>

              <div className="field-grid compact-grid">
                <label>
                  Cargo
                  <input value={item.cargo} onChange={(event) => updateExperiencia(index, "cargo", event.target.value)} />
                </label>
                <label>
                  Empresa
                  <input
                    value={item.empresa}
                    onChange={(event) => updateExperiencia(index, "empresa", event.target.value)}
                  />
                </label>
              </div>

              <div className="chip-box">
                <div className="chip-list">
                  {item.bullets.map((bullet, bulletIndex) => (
                    <span className="item-chip" key={`bullet-${index}-${bulletIndex}`}>
                      {bullet}
                      <button type="button" onClick={() => removeBullet(index, bulletIndex)}>
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="chip-entry-row">
                <input
                  value={draftInputs[`bullets-${index}`] ?? ""}
                  placeholder="bullet 1, bullet 2"
                  onChange={(event) => setDraftValue(`bullets-${index}`, event.target.value)}
                  onKeyDown={(event) =>
                    onDraftKeyDown(event, `bullets-${index}`, (items) => addBulletItems(index, items))
                  }
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="stack-sm tight-stack dense-cards-grid competencias-cards-grid">
        {data.secoes.competencias.itens.map((item, index) => (
          <div className="editor-block" key={`competencia-${index}`}>
            <button
              type="button"
              className="item-remove-btn"
              title="Remover topico"
              onClick={() => removeCompetencia(index)}
            >
              <X size={12} />
            </button>

            <label>
              Topico {index + 1}
              <textarea
                value={item}
                placeholder="Descreva uma competencia"
                onChange={(event) => updateCompetencia(index, event.target.value)}
              />
            </label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="cv-editor-shell cv-editor-pro">
      <section className="editor-session">
        <header className="session-header">
          <h2>Dados Pessoais</h2>
          <p>Informações básicas exibidas no topo do currículo</p>
        </header>

        <div className="session-grid">
          <label>
            Nome
            <input value={data.meta.nome} onChange={(e) => updateMeta("nome", e.target.value)} />
          </label>
          <label>
            Título
            <input value={data.meta.cargo} onChange={(e) => updateMeta("cargo", e.target.value)} />
          </label>
          <label>
            Telefone
            <input value={data.meta.telefone} onChange={(e) => updateMeta("telefone", e.target.value)} />
          </label>
          <label>
            Email
            <input value={data.meta.email} onChange={(e) => updateMeta("email", e.target.value)} />
          </label>
        </div>
      </section>

      <section className="editor-session">
        <header className="session-header">
          <h2>Ajustes Visuais</h2>
          <p>Controle profissional de tipografia e ritmo de leitura</p>
        </header>

        <div className="layout-tuning-grid">
          <label>
            Escala Geral ({Math.round(data.layout.fontScale * 100)}%)
            <input
              type="range"
              min={0.9}
              max={1.35}
              step={0.01}
              value={data.layout.fontScale}
              onChange={(event) => updateLayout("fontScale", Number(event.target.value))}
            />
          </label>
          <label>
            Escala de Títulos ({Math.round(data.layout.headingScale * 100)}%)
            <input
              type="range"
              min={0.9}
              max={1.4}
              step={0.01}
              value={data.layout.headingScale}
              onChange={(event) => updateLayout("headingScale", Number(event.target.value))}
            />
          </label>
          <label>
            Altura de Linha ({data.layout.lineHeight.toFixed(2)})
            <input
              type="range"
              min={1.15}
              max={1.55}
              step={0.01}
              value={data.layout.lineHeight}
              onChange={(event) => updateLayout("lineHeight", Number(event.target.value))}
            />
          </label>
        </div>
      </section>

      <section className="editor-session">
        <header className="session-header">
          <h2>Ordem dos Módulos</h2>
          <p>Reordene e controle visibilidade sem editar os módulos manualmente</p>
        </header>

        <div className="module-order-list">
          {orderedSectionKeys.map((sectionKey, index) => (
            <article className="order-item" key={`order-${sectionKey}`}>
              <div className="order-item-main">
                <span className="order-index">{index + 1}</span>
                <span className="order-title">{SECTION_LABELS[sectionKey]}</span>
              </div>

              <div className="order-item-actions">
                <button
                  type="button"
                  className="cv-icon-btn"
                  title={data.secoes[sectionKey].visivel ? "Ocultar seção" : "Mostrar seção"}
                  onClick={() => updateSectionVisibility(sectionKey, !data.secoes[sectionKey].visivel)}
                >
                  {data.secoes[sectionKey].visivel ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button type="button" className="cv-rail-arrow" title="Mover para cima" onClick={() => moveSection(sectionKey, "up")}>
                  <ChevronUp size={16} />
                </button>
                <button
                  type="button"
                  className="cv-rail-arrow"
                  title="Mover para baixo"
                  onClick={() => moveSection(sectionKey, "down")}
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="editor-session">
        <header className="session-header">
          <h2>Conteúdo dos Módulos</h2>
          <p>Edite cada bloco de conteúdo mantendo consistência e legibilidade</p>
        </header>

        {orderedSectionKeys.map((sectionKey) => (
          <section className={`cv-editor-module ${data.secoes[sectionKey].visivel ? "" : "is-muted"}`} key={sectionKey}>
            <div className="cv-editor-module-main">
              <div className="cv-editor-module-header">
                <h2>{SECTION_LABELS[sectionKey].toUpperCase()}</h2>

                <div className="cv-editor-module-actions">
                  {sectionKey === "skills" && (
                    <button type="button" className="tiny-btn cv-accent-btn" onClick={addSkillGroup}>
                      <Plus size={13} />
                    </button>
                  )}
                  {sectionKey === "formacao" && (
                    <button type="button" className="tiny-btn cv-accent-btn" onClick={addFormacao}>
                      <Plus size={13} />
                    </button>
                  )}
                  {sectionKey === "experiencia" && (
                    <button type="button" className="tiny-btn cv-accent-btn" onClick={addExperiencia}>
                      <Plus size={13} />
                    </button>
                  )}
                  {sectionKey === "competencias" && (
                    <button type="button" className="tiny-btn cv-accent-btn" onClick={addCompetenciaCard}>
                      <Plus size={13} />
                    </button>
                  )}
                </div>
              </div>

              {renderSectionContent(sectionKey)}
            </div>
          </section>
        ))}
      </section>
    </div>
  );
};
