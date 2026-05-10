import React from "react";
import { Mail, Phone } from "lucide-react";
import { ResumeData, ResumeSection } from "../types/resume";

interface ResumePreviewProps {
  data: ResumeData;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  const orderedVisibleSections = Array.isArray(data.secoes) ? data.secoes
    .filter((section) => section.visivel)
    .sort((a, b) => a.ordem - b.ordem) : [];

  return (
    <article
      className="resume-paper"
      style={
        {
          "--resume-base-font-size": `${data.layout.baseFontSize ?? 12.5}px`,
          "--resume-font-scale": data.layout.fontScale,
          "--resume-heading-scale": data.layout.headingScale,
          "--resume-line-height": data.layout.lineHeight,
        } as React.CSSProperties
      }
    >
      <header className="resume-header">
        <h1 style={{ color: "var(--accent-color, #0f172a)" }}>{data.meta.cargo || <span style={{ color: "#d1d5db" }}>Cargo / Profisso</span>}</h1>
        <p className="resume-name">{data.meta.nome.toUpperCase() || <span style={{ color: "#d1d5db", textTransform: "none" }}>Seu Nome Completo</span>}</p>
        <hr style={{ borderColor: "var(--accent-color, #0f172a)" }} />
        <div className="resume-contact">
          {(data.meta.telefoneVisivel !== false && data.meta.telefone?.trim()) ? (
            <span>
              <Phone size={12} style={{ color: "var(--accent-color, #0f172a)" }} /> {data.meta.telefone}
            </span>
          ) : null}
          {(data.meta.telefoneVisivel !== false && data.meta.telefone?.trim() && data.meta.emailVisivel !== false && data.meta.email?.trim()) ? (
            <span className="divider" style={{ color: "var(--accent-color, #0f172a)" }}>|</span>
          ) : null}
          {(data.meta.emailVisivel !== false && data.meta.email?.trim()) ? (
            <span>
              <Mail size={12} style={{ color: "var(--accent-color, #0f172a)" }} /> {data.meta.email}
            </span>
          ) : null}
        </div>
        <hr style={{ borderColor: "var(--accent-color, #0f172a)" }} />
      </header>

      {orderedVisibleSections.map((section) => {
        const title = section.titulo || "SEO";

        switch (section.tipo) {
          case "text":
            return (
              <section className="resume-section" key={section.id}>
                <h2>{title}</h2>
                <p style={{ whiteSpace: "pre-line" }}>{section.conteudo || <span style={{ color: "#d1d5db", fontStyle: "italic" }}>Escreva um breve resumo sobre voc...</span>}</p>
              </section>
            );

          case "grouped_list":
            return (
              <section className="resume-section" key={section.id}>
                <h2>{title}</h2>
                {section.grupos.length > 0 ? (
                  <ul>
                    {section.grupos.map((group, groupIndex) => (
                      <li key={`${group.label}-${groupIndex}`}>
                        <strong>{group.label || "Habilidade"}:</strong> {group.itens.length > 0 ? group.itens.join(", ") : <span style={{ color: "#d1d5db" }}>Item 1, Item 2...</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "#d1d5db", fontStyle: "italic" }}>Adicione seus grupos de habilidades...</p>
                )}
              </section>
            );

          case "timeline":
            return (
              <section className="resume-section" key={section.id}>
                <h2>{title}</h2>
                <div className="stack-md">
                  {section.itens.map((item, itemIndex) => (
                    <div key={`${item.id}-${itemIndex}`}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2px" }}>
                        <div style={{ margin: 0, display: "flex", flexDirection: "column" }}>
                          <strong>{item.titulo || <span style={{ color: "#d1d5db" }}>Título/Cargo</span>}</strong>
                          {item.descricao?.trim() ? (
                            <span style={{ fontSize: "0.95em", color: "#374151", whiteSpace: "pre-line" }}>
                              {item.descricao}
                            </span>
                          ) : null}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", whiteSpace: "nowrap", paddingLeft: "1rem" }}>
                          {item.dataVisivel !== false && item.data?.trim() ? (
                            <span style={{ fontSize: "0.9em", color: "#4b5563" }}>{item.data}</span>
                          ) : <span style={{ fontSize: "0.9em" }}>&nbsp;</span>}
                          {item.localVisivel !== false && item.local?.trim() ? (
                            <span style={{ fontSize: "0.9em", color: "#4b5563" }}>{item.local}</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );

          case "list":
          default:
            return (
              <section className="resume-section" key={section.id}>
                <h2>{title}</h2>
                {section.itens.length > 0 ? (
                  <ul className="resume-topic-list">
                    {section.itens.map((item, itemIndex) => (
                      <li key={`${item}-${itemIndex}`} style={{ whiteSpace: "pre-line" }}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "#d1d5db", fontStyle: "italic" }}>Adicione seus itens...</p>
                )}
              </section>
            );
        }
      })}
    </article>
  );
};
