import React, { useState } from "react";
import { ChevronDown, ChevronRight, Eye, EyeOff, GripVertical, Plus, Trash2, X } from "lucide-react";
import { ResumeData, ResumeSection, SkillsGroup, TimelineItem } from "../types/resume";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
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

const useCvSensors = () =>
  useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

const chipCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  return pointerCollisions.length > 0 ? pointerCollisions : closestCenter(args);
};

const resolveSortIndexes = (ids: string[], activeId: string | number, overId: string | number | undefined) => {
  if (overId == null || activeId === overId) return null;
  const oldIndex = ids.indexOf(String(activeId));
  const newIndex = ids.indexOf(String(overId));
  if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return null;
  return { oldIndex, newIndex };
};

const buildSortableIds = (base: string, keys: Array<string | undefined>) => {
  const seen = new Set<string>();
  return keys.map((key, index) => {
    const candidate = key && key.trim() ? `${base}::${key}` : `${base}::${index}`;
    let id = candidate;
    let attempt = 2;
    while (seen.has(id)) {
      id = `${candidate}#${attempt++}`;
    }
    seen.add(id);
    return id;
  });
};

interface DragHandleProps {
  attributes: Record<string, any>;
  listeners?: Record<string, any>;
  title?: string;
}

const HandleIcon: React.FC<DragHandleProps> = ({ attributes, listeners, title }) => (
  <div
    {...attributes}
    {...listeners}
    className="cv-sort-handle"
    title={title || "Arrastar para reordenar"}
    onClick={(e) => e.stopPropagation()}
  >
    <GripVertical size={16} />
  </div>
);

interface SortableSectionCardProps {
  section: ResumeSection;
  onToggleVisibility: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}

const SortableSectionCard: React.FC<SortableSectionCardProps> = ({ section, onToggleVisibility, onDelete, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.92 : 1,
        zIndex: isDragging ? 60 : "auto",
        position: "relative" as const,
      }}
      className={isDragging ? "cv-sortable-section is-dragging" : "cv-sortable-section"}
    >
      <AccordionItem value={section.id} className="border-none">
        <section className={`cv-editor-module ${section.visivel ? "" : "is-muted"}`}>
          <div className="cv-editor-module-main">
            <div className="module-card-header">
              <HandleIcon attributes={attributes} listeners={listeners} title="Arrastar para reordenar o módulo" />
              <AccordionTrigger className="hover:no-underline py-2 px-1">
                <h2 className="module-card-title">{getSectionTitle(section)}</h2>
              </AccordionTrigger>
              <span className="module-type-badge">{section.tipo}</span>
              <div className="module-card-actions">
                <button
                  type="button"
                  className="cv-icon-btn"
                  title={section.visivel ? "Ocultar módulo no PDF" : "Mostrar módulo no PDF"}
                  onClick={onToggleVisibility}
                >
                  {section.visivel ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  type="button"
                  className="cv-icon-btn"
                  title="Excluir módulo"
                  onClick={onDelete}
                  style={{ color: "#ef4444" }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <AccordionContent>{children}</AccordionContent>
          </div>
        </section>
      </AccordionItem>
    </div>
  );
};

interface SortableItemCardProps {
  sortableId: string;
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}

const SortableItemCard: React.FC<SortableItemCardProps> = ({ sortableId, title, onRemove, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sortableId });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.92 : 1,
        zIndex: isDragging ? 40 : "auto",
        position: "relative" as const,
      }}
      className={isDragging ? "item-card is-dragging" : "item-card"}
    >
      <div
        className="item-card-header"
        style={{ background: isOpen ? "#f1f5f9" : "#ffffff", borderBottom: isOpen ? "1px solid #cbd5e1" : "none" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <HandleIcon attributes={attributes} listeners={listeners} />
        {isOpen ? <ChevronDown size={18} className="text-blue-500" /> : <ChevronRight size={18} className="text-slate-400" />}
        <h3 className="item-card-title" style={{ fontSize: "14px", color: isOpen ? "#0f172a" : "#475569", fontWeight: isOpen ? 600 : 500 }}>
          {title}
        </h3>
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
        <div className="item-card-body" style={{ padding: "18px", background: "#ffffff" }}>
          {children}
        </div>
      )}
    </div>
  );
};

interface SortableChipProps {
  sortableId: string;
  label: string;
  onRemove: () => void;
}

const SortableChip: React.FC<SortableChipProps> = ({ sortableId, label, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sortableId });

  return (
    <span
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={isDragging ? "chip is-dragging" : "chip"}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 30 : "auto",
        position: "relative" as const,
        cursor: "grab",
      }}
      title="Arrastar para reordenar"
    >
      {label}
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        title="Remover item"
      >
        <X size={12} />
      </button>
    </span>
  );
};

export const ResumeForm: React.FC<ResumeFormProps> = ({ data, onDataChange }) => {
  const [draftInputs, setDraftInputs] = useState<Record<string, string>>({});
  const sensors = useCvSensors();

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

  const deleteSection = (id: string) => {
    onDataChange({
      ...data,
      secoes: orderedSections.filter(s => s.id !== id) as ResumeSection[]
    });
  };

  const parseInputItems = (raw: string): string[] => raw.split(",").map(v => v.trim()).filter(v => v.length > 0);

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const oldIndex = orderedSections.findIndex(s => s.id === active.id);
    const newIndex = orderedSections.findIndex(s => s.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      applySectionOrder(arrayMove(orderedSections, oldIndex, newIndex));
    }
  };

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
      const grupos: SkillsGroup[] = (section as any).grupos || [];
      const groupIds = grupos.map((_, groupIndex) => `${section.id}::grupo::${groupIndex}`);

      return (
        <div className="content-section">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              const indexes = resolveSortIndexes(groupIds, event.active.id, event.over?.id);
              if (indexes) {
                updateSection(section.id, { grupos: arrayMove(grupos, indexes.oldIndex, indexes.newIndex) });
              }
            }}
          >
            <SortableContext items={groupIds} strategy={verticalListSortingStrategy}>
              {grupos.map((group, groupIndex) => {
                const itemIds = group.itens.map((_, itemIndex) => `${section.id}::g${groupIndex}::i${itemIndex}`);

                return (
                  <SortableItemCard
                    key={groupIds[groupIndex]}
                    sortableId={groupIds[groupIndex]}
                    title={group.label || "Novo Grupo"}
                    onRemove={() => {
                      const newGrupos = grupos.filter((_, idx) => idx !== groupIndex);
                      updateSection(section.id, { grupos: newGrupos });
                    }}
                  >
                    <div className="form-group">
                      <label>Nome do Grupo</label>
                      <input className="form-control" value={group.label} onChange={e => {
                        const newGrupos = [...grupos];
                        newGrupos[groupIndex] = { ...group, label: e.target.value };
                        updateSection(section.id, { grupos: newGrupos });
                      }} />
                    </div>
                    <div className="form-group">
                      <label>Itens (arraste os chips para reordenar)</label>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={chipCollisionDetection}
                        onDragEnd={(event) => {
                          const indexes = resolveSortIndexes(itemIds, event.active.id, event.over?.id);
                          if (indexes) {
                            const newGrupos = [...grupos];
                            newGrupos[groupIndex] = { ...group, itens: arrayMove(group.itens, indexes.oldIndex, indexes.newIndex) };
                            updateSection(section.id, { grupos: newGrupos });
                          }
                        }}
                      >
                        <SortableContext items={itemIds} strategy={rectSortingStrategy}>
                          <div className="chips-container">
                            {group.itens.map((item, itemIndex) => (
                              <SortableChip
                                key={itemIds[itemIndex]}
                                sortableId={itemIds[itemIndex]}
                                label={item}
                                onRemove={() => {
                                  const newGrupos = [...grupos];
                                  newGrupos[groupIndex] = { ...group, itens: group.itens.filter((_, idx) => idx !== itemIndex) };
                                  updateSection(section.id, { grupos: newGrupos });
                                }}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>
                    <div className="form-group">
                      <label>Adicionar item (Enter ou vírgula)</label>
                      <input className="form-control" value={draftInputs[`${section.id}-g${groupIndex}`] || ""} onChange={e => setDraftInputs(p => ({...p, [`${section.id}-g${groupIndex}`]: e.target.value}))} onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const items = parseInputItems(draftInputs[`${section.id}-g${groupIndex}`] || "");
                          if (items.length > 0) {
                            const newGrupos = [...grupos];
                            newGrupos[groupIndex] = { ...group, itens: [...group.itens, ...items] };
                            updateSection(section.id, { grupos: newGrupos });
                            setDraftInputs(p => ({...p, [`${section.id}-g${groupIndex}`]: ""}));
                          }
                        }
                      }}/>
                    </div>
                  </SortableItemCard>
                );
              })}
            </SortableContext>
          </DndContext>
          <button className="add-btn" onClick={() => updateSection(section.id, { grupos: [...grupos, { label: "Novo", itens: [] }] })}><Plus size={16}/> Adicionar Grupo</button>
        </div>
      );
    }

    if (section.tipo === "timeline") {
      const itens: TimelineItem[] = (section as any).itens || [];
      const itemIds = buildSortableIds(`${section.id}::item`, itens.map(item => item.id));

      return (
        <div className="content-section">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              const indexes = resolveSortIndexes(itemIds, event.active.id, event.over?.id);
              if (indexes) {
                updateSection(section.id, { itens: arrayMove(itens, indexes.oldIndex, indexes.newIndex) });
              }
            }}
          >
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
              {itens.map((item, index) => (
                <SortableItemCard
                  key={itemIds[index]}
                  sortableId={itemIds[index]}
                  title={item.titulo || "Item"}
                  onRemove={() => {
                    updateSection(section.id, { itens: itens.filter((_, idx) => idx !== index) });
                  }}
                >
                  <div className="form-group"><label>Título</label><input className="form-control" value={item.titulo} onChange={e => { const newItens = [...itens]; newItens[index] = { ...item, titulo: e.target.value }; updateSection(section.id, { itens: newItens }); }} /></div>
                  <div className="form-group"><label>Descrição</label><textarea className="form-control" rows={3} value={item.descricao || ""} onChange={e => { const newItens = [...itens]; newItens[index] = { ...item, descricao: e.target.value }; updateSection(section.id, { itens: newItens }); }} /></div>
                  <div className="input-grid-2">
                    <div className="form-group">
                      <label>Data / Período / Status</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input className="form-control" style={{ flex: 1 }} value={item.data || ""} onChange={e => { const newItens = [...itens]; newItens[index] = { ...item, data: e.target.value }; updateSection(section.id, { itens: newItens }); }} />
                        <button type="button" className="cv-icon-btn" onClick={() => { const newItens = [...itens]; newItens[index] = { ...item, dataVisivel: item.dataVisivel === false ? true : false }; updateSection(section.id, { itens: newItens }); }}>
                          {item.dataVisivel === false ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Local</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input className="form-control" style={{ flex: 1 }} value={item.local || ""} onChange={e => { const newItens = [...itens]; newItens[index] = { ...item, local: e.target.value }; updateSection(section.id, { itens: newItens }); }} />
                        <button type="button" className="cv-icon-btn" onClick={() => { const newItens = [...itens]; newItens[index] = { ...item, localVisivel: item.localVisivel === false ? true : false }; updateSection(section.id, { itens: newItens }); }}>
                          {item.localVisivel === false ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </SortableItemCard>
              ))}
            </SortableContext>
          </DndContext>
          <button className="add-btn" onClick={() => updateSection(section.id, { itens: [...itens, { id: Date.now().toString(), titulo: "", descricao: "", data: "", dataVisivel: true, local: "", localVisivel: true }] })}><Plus size={16}/> Adicionar Item</button>
        </div>
      );
    }

    if (section.tipo === "list") {
      const itens: string[] = (section as any).itens || [];
      const itemIds = itens.map((_, index) => `${section.id}::item::${index}`);

      return (
        <div className="content-section">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              const indexes = resolveSortIndexes(itemIds, event.active.id, event.over?.id);
              if (indexes) {
                updateSection(section.id, { itens: arrayMove(itens, indexes.oldIndex, indexes.newIndex) });
              }
            }}
          >
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
              {itens.map((item, index) => (
                <SortableItemCard
                  key={itemIds[index]}
                  sortableId={itemIds[index]}
                  title={item || "Item"}
                  onRemove={() => {
                    updateSection(section.id, { itens: itens.filter((_, idx) => idx !== index) });
                  }}
                >
                  <textarea className="form-control" value={item} onChange={e => {
                    const newItens = [...itens];
                    newItens[index] = e.target.value;
                    updateSection(section.id, { itens: newItens });
                  }} />
                </SortableItemCard>
              ))}
            </SortableContext>
          </DndContext>
          <button className="add-btn" onClick={() => updateSection(section.id, { itens: [...itens, ""] })}><Plus size={16}/> Adicionar Item</button>
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
                <label>Cargo / Título<input value={data.meta.cargo} onChange={e => updateMeta("cargo", e.target.value)} /></label>
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
                <label>GitHub
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input value={data.meta.github || ""} onChange={e => updateMeta("github", e.target.value)} placeholder="URL (link)" style={{ flex: 1 }} />
                    <button type="button" className="cv-icon-btn" onClick={() => updateMeta("githubVisivel", data.meta.githubVisivel === false ? true : false)}>
                      {data.meta.githubVisivel === false ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <input value={data.meta.githubTexto || ""} onChange={e => updateMeta("githubTexto", e.target.value)} placeholder="Texto exibido no PDF" style={{ marginTop: '4px' }} />
                </label>
                <label>LinkedIn
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input value={data.meta.linkedin || ""} onChange={e => updateMeta("linkedin", e.target.value)} placeholder="URL (link)" style={{ flex: 1 }} />
                    <button type="button" className="cv-icon-btn" onClick={() => updateMeta("linkedinVisivel", data.meta.linkedinVisivel === false ? true : false)}>
                      {data.meta.linkedinVisivel === false ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <input value={data.meta.linkedinTexto || ""} onChange={e => updateMeta("linkedinTexto", e.target.value)} placeholder="Texto exibido no PDF" style={{ marginTop: '4px' }} />
                </label>
                <label>Portfolio
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input value={data.meta.portfolio || ""} onChange={e => updateMeta("portfolio", e.target.value)} placeholder="URL (link)" style={{ flex: 1 }} />
                    <button type="button" className="cv-icon-btn" onClick={() => updateMeta("portfolioVisivel", data.meta.portfolioVisivel === false ? true : false)}>
                      {data.meta.portfolioVisivel === false ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <input value={data.meta.portfolioTexto || ""} onChange={e => updateMeta("portfolioTexto", e.target.value)} placeholder="Texto exibido no PDF" style={{ marginTop: '4px' }} />
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

        <AccordionItem value="conteudo-modulos" className="border-none">
          <section className="editor-session">
            <AccordionTrigger className="hover:no-underline py-0">Conteúdo dos Módulos</AccordionTrigger>
            <AccordionContent>
              <div className="sortable-hint">
                <GripVertical size={13} />
                Arraste módulos e itens pelo ícone de alça para reordenar
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
                <SortableContext items={orderedSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  <Accordion type="multiple" defaultValue={[]} className="module-sortable-list">
                    {orderedSections.map((section) => (
                      <SortableSectionCard
                        key={section.id}
                        section={section}
                        onToggleVisibility={() => updateSection(section.id, { visivel: !section.visivel })}
                        onDelete={() => deleteSection(section.id)}
                      >
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label>Nome do módulo</label>
                          <input className="form-control" value={section.titulo || ""} onChange={e => updateSection(section.id, { titulo: e.target.value })} />
                        </div>
                        {renderSectionContent(section)}

                        <button
                          type="button"
                          className="cv-danger-btn"
                          onClick={() => deleteSection(section.id)}
                        >
                          <Trash2 size={14} /> Excluir Seção
                        </button>
                      </SortableSectionCard>
                    ))}
                  </Accordion>
                </SortableContext>
              </DndContext>

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
