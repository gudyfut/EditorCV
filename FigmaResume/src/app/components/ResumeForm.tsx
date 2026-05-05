import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronUp, ChevronDown, ChevronRight, Eye, EyeOff, Plus, X, Settings2, User, FileText, LayoutList, GripVertical } from "lucide-react";
import { ResumeData } from "../types/resume";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

const getSectionTitle = (sectionKey: SectionKey, section: ResumeData["secoes"][SectionKey]) =>
  section.titulo?.trim() || SECTION_LABELS[sectionKey];

interface SortableOrderItemProps {
  id: string;
  sectionKey: SectionKey;
  index: number;
  label: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  itemRef?: (node: HTMLElement | null) => void;
}

const SortableOrderItem: React.FC<SortableOrderItemProps> = ({
  id,
  sectionKey,
  index,
  label,
  isVisible,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  itemRef,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition: dndTransition,
    isDragging,
  } = useSortable({ id });

  const mergedRef = useCallback(
    (node: HTMLElement | null) => {
      setNodeRef(node);
      if (itemRef) itemRef(node);
    },
    [setNodeRef, itemRef],
  );

  return (
    <article
      ref={mergedRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: dndTransition,
        opacity: isDragging ? 0.92 : 1,
        zIndex: isDragging ? 50 : 'auto',
        position: 'relative' as const,
        boxShadow: isDragging ? '0 12px 28px rgba(0,0,0,0.15)' : undefined,
      }}
      className={isDragging ? 'order-item is-dragging' : 'order-item'}
    >
      <span className="order-index">{index + 1}</span>

      <div
        {...attributes}
        {...listeners}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          cursor: 'grab',
          padding: '4px 2px',
          touchAction: 'none',
        }}
        title="Arrastar para reordenar"
      >
        <GripVertical size={18} />
      </div>

      <span className="order-title" style={{ flex: 1 }}>{label}</span>

      <div className="order-item-actions">
        <button
          type="button"
          className="cv-icon-btn"
          title={isVisible ? "Ocultar seção" : "Mostrar seção"}
          onClick={onToggleVisibility}
        >
          {isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
        <button type="button" className="cv-rail-arrow" title="Mover para cima" onClick={onMoveUp}>
          <ChevronUp size={16} />
        </button>
        <button
          type="button"
          className="cv-rail-arrow"
          title="Mover para baixo"
          onClick={onMoveDown}
        >
          <ChevronDown size={16} />
        </button>
      </div>
    </article>
  );
};

interface CollapsibleItemProps {
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}

const CollapsibleItem: React.FC<CollapsibleItemProps> = ({ title, onRemove, children }) => {
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
};

export const ResumeForm: React.FC<ResumeFormProps> = ({ data, onDataChange }) => {
  const [draftInputs, setDraftInputs] = useState<Record<string, string>>({});
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  const pendingLayoutSnapshot = useRef<Map<string, number> | null>(null);

  const orderedSectionKeys = (Object.keys(data.secoes) as SectionKey[]).sort(
    (a, b) => data.secoes[a].ordem - data.secoes[b].ordem,
  );
  const orderedSectionKeySignature = orderedSectionKeys.join("|");

  const capturePositions = useCallback(() => {
    const map = new Map<string, number>();
    for (const key of orderedSectionKeys) {
      const el = itemRefs.current.get(key);
      if (el) map.set(key, el.getBoundingClientRect().top);
    }
    return map;
  }, [orderedSectionKeys]);

  const animateFromPositions = useCallback(
    (firstMap: Map<string, number>) => {
      for (const key of orderedSectionKeys) {
        const el = itemRefs.current.get(key);
        const firstTop = firstMap.get(key);
        if (!el || firstTop === undefined) continue;
        const lastTop = el.getBoundingClientRect().top;
        const delta = firstTop - lastTop;
        if (Math.abs(delta) < 0.5) continue;

        el.style.transition = 'none';
        el.style.transform = `translateY(${delta}px)`;

        requestAnimationFrame(() => {
          el.style.transition = 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)';
          el.style.transform = '';
          const cleanup = () => {
            el.style.transition = '';
            el.style.transform = '';
            el.removeEventListener('transitionend', cleanup);
          };
          el.addEventListener('transitionend', cleanup);
        });
      }
    },
    [orderedSectionKeys],
  );

  useLayoutEffect(() => {
    const snapshot = pendingLayoutSnapshot.current;
    if (!snapshot) {
      return;
    }

    pendingLayoutSnapshot.current = null;
    animateFromPositions(snapshot);
  }, [animateFromPositions, orderedSectionKeySignature]);

  const setItemRef = useCallback(
    (id: string) => (node: HTMLElement | null) => {
      if (node) itemRefs.current.set(id, node);
      else itemRefs.current.delete(id);
    },
    [],
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

  const updateSectionTitle = (section: SectionKey, titulo: string) => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        [section]: {
          ...data.secoes[section],
          titulo,
        },
      },
    });
  };

  const applySectionOrder = (nextOrder: SectionKey[]) => {
    pendingLayoutSnapshot.current = capturePositions();

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

  const updateBullet = (experienceIndex: number, bulletIndex: number, newValue: string) => {
    onDataChange({
      ...data,
      secoes: {
        ...data.secoes,
        experiencia: {
          ...data.secoes.experiencia,
          itens: data.secoes.experiencia.itens.map((item, idx) =>
            idx === experienceIndex ? {
              ...item,
              bullets: item.bullets.map((bullet, bIdx) => bIdx === bulletIndex ? newValue : bullet)
            } : item,
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
            <CollapsibleItem 
              key={`skill-group-${groupIndex}`} 
              title={group.label || `Grupo de Skills ${groupIndex + 1}`}
              onRemove={() => removeSkillGroup(groupIndex)}
            >
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
                    <span className="chip" key={`skill-item-${groupIndex}-${itemIndex}`}>
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
                  value={draftInputs[`skills-${groupIndex}`] ?? ""}
                  placeholder="React, TypeScript..."
                  onChange={(event) => setDraftValue(`skills-${groupIndex}`, event.target.value)}
                  onKeyDown={(event) =>
                    onDraftKeyDown(event, `skills-${groupIndex}`, (items) => addSkillItems(groupIndex, items))
                  }
                />
              </div>
            </CollapsibleItem>
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
            <CollapsibleItem
              key={`formacao-${index}`}
              title={item.titulo || `Formação ${index + 1}`}
              onRemove={() => removeFormacao(index)}
            >
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
            </CollapsibleItem>
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
            <CollapsibleItem
              key={`experiencia-${index}`}
              title={item.cargo || `Experiência ${index + 1}`}
              onRemove={() => removeExperiencia(index)}
            >
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
                    <div className="chip" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', padding: '6px 12px', borderRadius: '6px' }} key={`bullet-${index}-${bulletIndex}`}>
                      <textarea 
                        className="form-control" 
                        style={{ flex: 1, minHeight: '40px', marginRight: '8px', resize: 'vertical' }} 
                        value={bullet} 
                        onChange={(e) => updateBullet(index, bulletIndex, e.target.value)}
                      />
                      <button type="button" style={{ padding: '4px', marginTop: '4px' }} onClick={() => removeBullet(index, bulletIndex)}>
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
                  value={draftInputs[`bullets-${index}`] ?? ""}
                  placeholder="Liderou equipe de 5 pessoas..."
                  onChange={(event) => setDraftValue(`bullets-${index}`, event.target.value)}
                  onKeyDown={(event) =>
                    onDraftKeyDown(event, `bullets-${index}`, (items) => addBulletItems(index, items))
                  }
                />
              </div>
            </CollapsibleItem>
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
          <CollapsibleItem
            key={`competencia-${index}`}
            title={item ? (item.length > 40 ? item.substring(0, 40) + '...' : item) : `Competência ${index + 1}`}
            onRemove={() => removeCompetencia(index)}
          >
            <div className="form-group">
              <label>Descrição</label>
              <textarea
                className="form-control"
                value={item}
                placeholder="Descreva uma competência..."
                onChange={(event) => updateCompetencia(index, event.target.value)}
              />
            </div>
          </CollapsibleItem>
        ))}
        <button type="button" className="add-btn" onClick={addCompetenciaCard}>
          <Plus size={16} /> Adicionar Competência
        </button>
      </div>
    );
  };

  return (
    <div className="cv-editor-shell cv-editor-pro">
      <Accordion type="single" collapsible defaultValue="dados-pessoais" className="w-full space-y-3">
        <AccordionItem value="dados-pessoais" className="border-none">
          <section className="editor-session">
            <AccordionTrigger className="hover:no-underline py-0">
              <header style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px', marginBottom: '0', padding: '4px 0', width: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', flexShrink: 0 }}>
      <User size={20} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left', flex: 1 }}>
      <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0f172a', textTransform: 'none', letterSpacing: 'normal' }}>Dados Pessoais</h2>
      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Informações básicas exibidas no topo do currículo</p>
    </div>
  </header>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-0">
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
            </AccordionContent>
          </section>
        </AccordionItem>

        <AccordionItem value="ajustes-visuais" className="border-none">
          <section className="editor-session">
            <AccordionTrigger className="hover:no-underline py-0">
              <header style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px', marginBottom: '0', padding: '4px 0', width: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', background: '#f5f3ff', color: '#8b5cf6', flexShrink: 0 }}>
      <Settings2 size={20} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left', flex: 1 }}>
      <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0f172a', textTransform: 'none', letterSpacing: 'normal' }}>Ajustes Visuais</h2>
      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Controle profissional de tipografia e ritmo</p>
    </div>
  </header>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-0">
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
            </AccordionContent>
          </section>
        </AccordionItem>

        <AccordionItem value="ordem-modulos" className="border-none">
          <section className="editor-session">
            <AccordionTrigger className="hover:no-underline py-0">
              <header style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px', marginBottom: '0', padding: '4px 0', width: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', background: '#fffbeb', color: '#d97706', flexShrink: 0 }}>
      <LayoutList size={20} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left', flex: 1 }}>
      <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0f172a', textTransform: 'none', letterSpacing: 'normal' }}>Ordem dos Módulos</h2>
      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Reordene e controle a visibilidade</p>
    </div>
  </header>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-0">
              <DndContext
                sensors={useSensors(
                  useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
                  useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
                )}
                collisionDetection={closestCenter}
                onDragEnd={(event: DragEndEvent) => {
                  const { active, over } = event;
                  if (!over || active.id === over.id) return;
                  const oldIndex = orderedSectionKeys.indexOf(active.id as SectionKey);
                  const newIndex = orderedSectionKeys.indexOf(over.id as SectionKey);
                  if (oldIndex === -1 || newIndex === -1) return;
                  applySectionOrder(arrayMove(orderedSectionKeys, oldIndex, newIndex));
                }}
              >
                <SortableContext
                  items={orderedSectionKeys}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="module-order-list">
                    {orderedSectionKeys.map((sectionKey, index) => (
                      <SortableOrderItem
                        id={sectionKey}
                        key={sectionKey}
                        sectionKey={sectionKey}
                        index={index}
                        label={getSectionTitle(sectionKey, data.secoes[sectionKey])}
                        isVisible={data.secoes[sectionKey].visivel}
                        onToggleVisibility={() => updateSectionVisibility(sectionKey, !data.secoes[sectionKey].visivel)}
                        onMoveUp={() => moveSection(sectionKey, "up")}
                        onMoveDown={() => moveSection(sectionKey, "down")}
                        itemRef={setItemRef(sectionKey)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </AccordionContent>
          </section>
        </AccordionItem>

        <AccordionItem value="conteudo-modulos" className="border-none">
          <section className="editor-session">
            <AccordionTrigger className="hover:no-underline py-0">
              <header style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px', marginBottom: '0', padding: '4px 0', width: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', flexShrink: 0 }}>
      <FileText size={20} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left', flex: 1 }}>
      <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0f172a', textTransform: 'none', letterSpacing: 'normal' }}>Conteúdo dos Módulos</h2>
      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Edite cada bloco de conteúdo em detalhes</p>
    </div>
  </header>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-0">
              <Accordion type="multiple" defaultValue={[]} className="space-y-2">
                {orderedSectionKeys.map((sectionKey) => (
                  <AccordionItem value={sectionKey} key={sectionKey} className="border-none">
                    <section className={`cv-editor-module ${data.secoes[sectionKey].visivel ? "" : "is-muted"}`}>
                      <div className="cv-editor-module-main">
                        <AccordionTrigger className="hover:no-underline py-3 px-2" style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc', borderRadius: '6px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div>
      <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#334155', textTransform: 'none', letterSpacing: 'normal' }}>
        {getSectionTitle(sectionKey, data.secoes[sectionKey])}
      </h2>
    </div>
  </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-0">
                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label>Nome do módulo</label>
                            <input
                              className="form-control"
                              value={data.secoes[sectionKey].titulo ?? ""}
                              onChange={(event) => updateSectionTitle(sectionKey, event.target.value)}
                              placeholder={SECTION_LABELS[sectionKey]}
                            />
                          </div>
                          
                          {renderSectionContent(sectionKey)}
                        </AccordionContent>
                      </div>
                    </section>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionContent>
          </section>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
