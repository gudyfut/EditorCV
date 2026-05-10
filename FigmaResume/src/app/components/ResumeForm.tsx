import React, { useCallback, useRef, useState } from "react";
import { ChevronUp, ChevronDown, ChevronRight, Eye, EyeOff, Plus, X, Settings2, User, FileText, LayoutList, GripVertical, Trash2 } from "lucide-react";
import { ResumeData, ResumeSection, SkillsGroup } from "../types/resume";
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

const getSectionTitle = (section: ResumeSection) => section.titulo?.trim() || "Nova Seção";

interface SortableOrderItemProps {
  id: string;
  index: number;
  label: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onDelete: () => void;
}

const SortableOrderItem: React.FC<SortableOrderItemProps> = ({
  id,
  index,
  label,
  isVisible,
  onToggleVisibility,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
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

      <div className="order-item-actions" style={{ display: 'flex', gap: '4px' }}>
        <button
          type="button"
          className="cv-icon-btn"
          title={isVisible ? "Ocultar seção" : "Mostrar seção"}
          onClick={onToggleVisibility}
        >
          {isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
        <button
          type="button"
          className="cv-icon-btn"
          title="Excluir seção"
          onClick={onDelete}
          style={{ color: '#ef4444' }}
        >
          <Trash2 size={15} />
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

  const orderedSections = Array.isArray(data.secoes) ? [...data.secoes].sort((a, b) => a.ordem - b.ordem) : [];

  const updateSection = (id: string, updates: Partial<ResumeSection>) => {
    onDataChange({
      ...data,
      secoes: orderedSections.map(sec => sec.id === id ? { ...sec, ...updates } : sec) as ResumeSection[]
    });
  };

  const updateMeta = (field: keyof ResumeData["meta"], value: any) => {
    onDataChange({ ...data, meta: { ...data.meta, [field]: value } });
  };

  const updateLayout = (field: keyof ResumeData["layout"], value: number) => {
    onDataChange({ ...data, layout: { ...data.layout, [field]: value } });
  };

  const applySectionOrder = (reordered: ResumeSection[]) => {
    onDataChange({
      ...data,
      secoes: reordered.map((sec, idx) => ({ ...sec, ordem: idx + 1 })) as ResumeSection[]
    });
  };

  const parseInputItems = (raw: string): string[] => raw.split(",").map(v => v.trim()).filter(v => v.length > 0);

  const renderSectionContent = (section: ResumeSection) => {
    if (section.tipo === "text") {
      return (
        <div className="content-section">
          <div className="form-group">
            <label>Conteúdo</label>
            <textarea
              className="form-control"
              value={(section as any).conteudo || ""}
              onChange={(e) => updateSection(section.id, { conteudo: e.target.value })}
            />
          </div>
        </div>
      );
    }

    if (section.tipo === "grouped_list") {
      return (
        <div className="content-section">
          {(section as any).grupos?.map((group: SkillsGroup, groupIndex: number) => (
            <CollapsibleItem key={groupIndex} title={group.label} onRemove={() => {
              const newGrupos = [...(section as any).grupos];
              newGrupos.splice(groupIndex, 1);
              updateSection(section.id, { grupos: newGrupos });
            }}>
              <div className="form-group">
                <label>Nome do Grupo</label>
                <input className="form-control" value={group.label} onChange={e => {
                  const newGrupos = [...(section as any).grupos];
                  newGrupos[groupIndex].label = e.target.value;
                  updateSection(section.id, { grupos: newGrupos });
                }} />
              </div>
              <div className="form-group">
                <label>Itens Adicionados</label>
                <div className="chips-container">
                  {group.itens.map((item, itemIndex) => (
                    <span className="chip" key={itemIndex}>
                      {item}
                      <button onClick={() => {
                        const newGrupos = [...(section as any).grupos];
                        newGrupos[groupIndex].itens.splice(itemIndex, 1);
                        updateSection(section.id, { grupos: newGrupos });
                      }}><X size={12} /></button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Adicionar item (Enter ou vírgula)</label>
                <input className="form-control" value={draftInputs[`${section.id}-g${groupIndex}`] || ""} onChange={e => setDraftInputs(p => ({...p, [`${section.id}-g${groupIndex}`]: e.target.value}))} onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const items = parseInputItems(draftInputs[`${section.id}-g${groupIndex}`] || "");
                    if (items.length > 0) {
                      const newGrupos = [...(section as any).grupos];
                      newGrupos[groupIndex].itens.push(...items);
                      updateSection(section.id, { grupos: newGrupos });
                      setDraftInputs(p => ({...p, [`${section.id}-g${groupIndex}`]: ""}));
                    }
                  }
                }}/>
              </div>
            </CollapsibleItem>
          ))}
          <button className="add-btn" onClick={() => updateSection(section.id, { grupos: [...((section as any).grupos || []), { label: "Novo", itens: [] }] })}><Plus size={16}/> Adicionar Grupo</button>
        </div>
      );
    }

    if (section.tipo === "timeline") {
      return (
        <div className="content-section">
          {(section as any).itens?.map((item, index) => (
            <CollapsibleItem key={index} title={item.titulo || "Item"} onRemove={() => {
              const newItens = [...(section as any).itens];
              newItens.splice(index, 1);
              updateSection(section.id, { itens: newItens });
            }}>
              <div className="form-group"><label>Título</label><input className="form-control" value={item.titulo} onChange={e => { const newItens = [...(section as any).itens]; newItens[index].titulo = e.target.value; updateSection(section.id, { itens: newItens }); }} /></div>
              <div className="form-group"><label>Descrição</label><textarea className="form-control" rows={3} value={item.descricao || ""} onChange={e => { const newItens = [...(section as any).itens]; newItens[index].descricao = e.target.value; updateSection(section.id, { itens: newItens }); }} /></div>
              <div className="input-grid-2">
                <div className="form-group">
                  <label>Data / Período / Status</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input className="form-control" style={{ flex: 1 }} value={item.data || ""} onChange={e => { const newItens = [...(section as any).itens]; newItens[index].data = e.target.value; updateSection(section.id, { itens: newItens }); }} />
                    <button type="button" className="cv-icon-btn" onClick={() => { const newItens = [...(section as any).itens]; newItens[index].dataVisivel = newItens[index].dataVisivel === false ? true : false; updateSection(section.id, { itens: newItens }); }}>
                      {item.dataVisivel === false ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Local</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input className="form-control" style={{ flex: 1 }} value={item.local || ""} onChange={e => { const newItens = [...(section as any).itens]; newItens[index].local = e.target.value; updateSection(section.id, { itens: newItens }); }} />
                    <button type="button" className="cv-icon-btn" onClick={() => { const newItens = [...(section as any).itens]; newItens[index].localVisivel = newItens[index].localVisivel === false ? true : false; updateSection(section.id, { itens: newItens }); }}>
                      {item.localVisivel === false ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            </CollapsibleItem>
          ))}
          <button className="add-btn" onClick={() => updateSection(section.id, { itens: [...((section as any).itens || []), { id: Date.now().toString(), titulo: "", descricao: "", data: "", dataVisivel: true, local: "", localVisivel: true }] })}><Plus size={16}/> Adicionar Item</button>
        </div>
      );
    }

    if (section.tipo === "list") {
      return (
        <div className="content-section">
          {(section as any).itens?.map((item, index) => (
            <CollapsibleItem key={index} title={item || "Item"} onRemove={() => {
              const newItens = [...(section as any).itens];
              newItens.splice(index, 1);
              updateSection(section.id, { itens: newItens });
            }}>
              <textarea className="form-control" value={item} onChange={e => {
                const newItens = [...(section as any).itens];
                newItens[index] = e.target.value;
                updateSection(section.id, { itens: newItens });
              }} />
            </CollapsibleItem>
          ))}
          <button className="add-btn" onClick={() => updateSection(section.id, { itens: [...((section as any).itens || []), ""] })}><Plus size={16}/> Adicionar Item</button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="cv-editor-shell cv-editor-pro">
      <Accordion type="single" collapsible defaultValue="dados-pessoais" className="w-full space-y-3">
        <AccordionItem value="dados-pessoais" className="border-none">
          <section className="editor-session">
            <AccordionTrigger className="hover:no-underline py-0">Dados Pessoais</AccordionTrigger>
            <AccordionContent>
              <div className="session-grid">
                <label>Nome<input value={data.meta.nome} onChange={e => updateMeta("nome", e.target.value)} /></label>
                <label>Cargo / Título do Currículo<input value={data.meta.cargo} onChange={e => updateMeta("cargo", e.target.value)} /></label>
                <label>Telefone
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input value={data.meta.telefone} onChange={e => updateMeta("telefone", e.target.value)} style={{ flex: 1 }} />
                    <button type="button" className="cv-icon-btn" onClick={() => updateMeta("telefoneVisivel", data.meta.telefoneVisivel === false ? true : false)}>
                      {data.meta.telefoneVisivel === false ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </label>
                <label>Email
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input value={data.meta.email} onChange={e => updateMeta("email", e.target.value)} style={{ flex: 1 }} />
                    <button type="button" className="cv-icon-btn" onClick={() => updateMeta("emailVisivel", data.meta.emailVisivel === false ? true : false)}>
                      {data.meta.emailVisivel === false ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </label>
              </div>
            </AccordionContent>
          </section>
        </AccordionItem>

        <AccordionItem value="ajustes-visuais" className="border-none">
          <section className="editor-session">
            <AccordionTrigger className="hover:no-underline py-0">Ajustes Visuais</AccordionTrigger>
            <AccordionContent>
              <div className="layout-tuning-grid">
                <label>Tamanho da Fonte (px)
                  <input type="number" className="form-control" min="8" max="24" step="0.5" value={data.layout.baseFontSize ?? 12.5} onChange={e => updateLayout("baseFontSize", parseFloat(e.target.value) || 12.5)} />
                </label>
                <label>Escala da Fonte
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="range" style={{ flex: 1, accentColor: '#1f5fbf' }} min="0.5" max="2" step="0.05" value={data.layout.fontScale} onChange={e => updateLayout("fontScale", parseFloat(e.target.value))} />
                    <span style={{ minWidth: '36px', textAlign: 'right', fontSize: '11px', color: '#475569' }}>{data.layout.fontScale.toFixed(2)}x</span>
                  </div>
                </label>
                <label>Escala dos Títulos
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="range" style={{ flex: 1, accentColor: '#1f5fbf' }} min="0.5" max="2" step="0.05" value={data.layout.headingScale} onChange={e => updateLayout("headingScale", parseFloat(e.target.value))} />
                    <span style={{ minWidth: '36px', textAlign: 'right', fontSize: '11px', color: '#475569' }}>{data.layout.headingScale.toFixed(2)}x</span>
                  </div>
                </label>
                <label>Altura da Linha
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="range" style={{ flex: 1, accentColor: '#1f5fbf' }} min="1" max="2" step="0.05" value={data.layout.lineHeight} onChange={e => updateLayout("lineHeight", parseFloat(e.target.value))} />
                    <span style={{ minWidth: '36px', textAlign: 'right', fontSize: '11px', color: '#475569' }}>{data.layout.lineHeight.toFixed(2)}</span>
                  </div>
                </label>
              </div>
            </AccordionContent>
          </section>
        </AccordionItem>

        <AccordionItem value="ordem-modulos" className="border-none">
          <section className="editor-session">
            <AccordionTrigger className="hover:no-underline py-0">Ordem dos Módulos</AccordionTrigger>
            <AccordionContent>
              <DndContext
                sensors={useSensors(
                  useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
                  useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
                )}
                collisionDetection={closestCenter}
                onDragEnd={(event: DragEndEvent) => {
                  const { active, over } = event;
                  if (!over || active.id === over.id) return;
                  const oldIndex = orderedSections.findIndex(s => s.id === active.id);
                  const newIndex = orderedSections.findIndex(s => s.id === over.id);
                  if (oldIndex !== -1 && newIndex !== -1) {
                    applySectionOrder(arrayMove(orderedSections, oldIndex, newIndex));
                  }
                }}
              >
                <SortableContext items={orderedSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="module-order-list">
                    {orderedSections.map((section, index) => (
                      <SortableOrderItem
                        id={section.id}
                        key={section.id}
                        index={index}
                        label={getSectionTitle(section)}
                        isVisible={section.visivel}
                        onToggleVisibility={() => updateSection(section.id, { visivel: !section.visivel })}
                        onDelete={() => {
                          onDataChange({
                            ...data,
                            secoes: orderedSections.filter(s => s.id !== section.id) as ResumeSection[]
                          });
                        }}
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
            <AccordionTrigger className="hover:no-underline py-0">Conteúdo dos Módulos</AccordionTrigger>
            <AccordionContent>
              <Accordion type="multiple" defaultValue={[]} className="space-y-2">
                {orderedSections.map((section) => (
                  <AccordionItem value={section.id} key={section.id} className="border-none">
                    <section className={`cv-editor-module ${section.visivel ? "" : "is-muted"}`}>
                      <div className="cv-editor-module-main">
                        <AccordionTrigger className="hover:no-underline py-3 px-2">
                          <h2 style={{ fontSize: '14px', fontWeight: 600 }}>{getSectionTitle(section)}</h2>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label>Nome do módulo</label>
                            <input className="form-control" value={section.titulo || ""} onChange={e => updateSection(section.id, { titulo: e.target.value })} />
                          </div>
                          {renderSectionContent(section)}
                          
                          <button style={{ marginTop: '16px', color: 'red' }} onClick={() => {
                            onDataChange({
                              ...data,
                              secoes: orderedSections.filter(s => s.id !== section.id) as ResumeSection[]
                            });
                          }}>Excluir Seção</button>
                        </AccordionContent>
                      </div>
                    </section>
                  </AccordionItem>
                ))}
              </Accordion>

              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <button className="add-btn" style={{ flex: 1 }} onClick={() => {
                  const newId = Date.now().toString();
                  onDataChange({
                    ...data,
                    secoes: [...orderedSections, { id: `text_${newId}`, tipo: 'text', visivel: true, ordem: orderedSections.length + 1, titulo: "Novo Texto", conteudo: "" }] as ResumeSection[]
                  });
                }}><Plus size={14}/> Text</button>
                <button className="add-btn" style={{ flex: 1 }} onClick={() => {
                  const newId = Date.now().toString();
                  onDataChange({
                    ...data,
                    secoes: [...orderedSections, { id: `list_${newId}`, tipo: 'list', visivel: true, ordem: orderedSections.length + 1, titulo: "Nova Lista", itens: [] }] as ResumeSection[]
                  });
                }}><Plus size={14}/> List</button>
                <button className="add-btn" style={{ flex: 1 }} onClick={() => {
                  const newId = Date.now().toString();
                  onDataChange({
                    ...data,
                    secoes: [...orderedSections, { id: `timeline_${newId}`, tipo: 'timeline', visivel: true, ordem: orderedSections.length + 1, titulo: "Nova Linha do Tempo", itens: [] }] as ResumeSection[]
                  });
                }}><Plus size={14}/> Timeline</button>
                <button className="add-btn" style={{ flex: 1 }} onClick={() => {
                  const newId = Date.now().toString();
                  onDataChange({
                    ...data,
                    secoes: [...orderedSections, { id: `grouped_list_${newId}`, tipo: 'grouped_list', visivel: true, ordem: orderedSections.length + 1, titulo: "Novo Grupo de Lista", grupos: [] }] as ResumeSection[]
                  });
                }}><Plus size={14}/> Grouped List</button>
              </div>
            </AccordionContent>
          </section>
        </AccordionItem>

      </Accordion>
    </div>
  );
};
