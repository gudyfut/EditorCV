import React from "react";
import { Mail, Phone } from "lucide-react";
import { ResumeData } from "../types/resume";

type SectionEntry = [keyof ResumeData["secoes"], ResumeData["secoes"][keyof ResumeData["secoes"]]];

interface ResumePreviewProps {
  data: ResumeData;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  const orderedVisibleSections = (Object.entries(data.secoes) as SectionEntry[])
    .filter(([, section]) => section.visivel)
    .sort((a, b) => a[1].ordem - b[1].ordem);

  return (
    <article
      className="resume-paper"
      style={
        {
          "--resume-font-scale": data.layout.fontScale,
          "--resume-heading-scale": data.layout.headingScale,
          "--resume-line-height": data.layout.lineHeight,
        } as React.CSSProperties
      }
    >
      <header className="resume-header">
        <h1 style={{ color: "var(--accent-color, #0f172a)" }}>{data.meta.cargo || <span style={{ color: "#d1d5db" }}>Cargo / Profissão</span>}</h1>
        <p className="resume-name">{data.meta.nome.toUpperCase() || <span style={{ color: "#d1d5db", textTransform: "none" }}>Seu Nome Completo</span>}</p>
        <hr style={{ borderColor: "var(--accent-color, #0f172a)" }} />
        <div className="resume-contact">
          <span>
            <Phone size={12} style={{ color: "var(--accent-color, #0f172a)" }} /> {data.meta.telefone || <span style={{ color: "#d1d5db" }}>(00) 00000-0000</span>}
          </span>
          <span className="divider" style={{ color: "var(--accent-color, #0f172a)" }}>|</span>
          <span>
            <Mail size={12} style={{ color: "var(--accent-color, #0f172a)" }} /> {data.meta.email || <span style={{ color: "#d1d5db" }}>email@exemplo.com</span>}
          </span>
        </div>
        <hr style={{ borderColor: "var(--accent-color, #0f172a)" }} />
      </header>

      {orderedVisibleSections.map(([key, section]) => {
        const tituloFromJson = (section as any).titulo as string | undefined;
        const getFallbackTitle = (k: string) => {
          switch (k) {
            case "sobre":
              return "SOBRE";
            case "skills":
              return "SKILLS";
            case "formacao":
              return "FORMAÇÃO";
            case "experiencia":
              return "EXPERIÊNCIA";
            default:
              return "COMPETÊNCIAS";
          }
        };

        const title = tituloFromJson ?? getFallbackTitle(key as string);

        if (key === "sobre") {
          return (
            <section className="resume-section" key={key}>
              <h2>{title}</h2>
              <p>{section.conteudo || <span style={{ color: "#d1d5db", fontStyle: "italic" }}>Escreva um breve resumo sobre você...</span>}</p>
            </section>
          );
        }

        if (key === "skills") {
          return (
            <section className="resume-section" key={key}>
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
        }

        if (key === "formacao") {
          return (
            <section className="resume-section" key={key}>
              <h2>{title}</h2>
              <div className="stack-md">
                {section.itens.map((item, itemIndex) => (
                  <div key={`${item.titulo}-${itemIndex}`}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                      <p style={{ margin: 0 }}>
                        <strong>{item.titulo || <span style={{ color: "#d1d5db" }}>Formação/Curso</span>}</strong>
                      </p>
                      <p style={{ margin: 0, fontSize: "0.9em", color: "#4b5563", whiteSpace: "nowrap" }}>
                        {item.periodo || <span style={{ color: "#d1d5db" }}>Período</span>}
                      </p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <p style={{ margin: 0 }}>{item.instituicao || <span style={{ color: "#d1d5db" }}>Instituição de Ensino</span>}</p>
                      <p style={{ margin: 0, fontStyle: "italic", fontSize: "0.9em" }}>{item.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (key === "experiencia") {
          return (
            <section className="resume-section" key={key}>
              <h2>{title}</h2>
              <div className="stack-md">
                {section.itens.map((item, itemIndex) => (
                  <div key={`${item.cargo}-${itemIndex}`}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                      <p style={{ margin: 0 }}>
                        <strong>{item.cargo || <span style={{ color: "#d1d5db" }}>Cargo</span>}</strong>
                        {(item.cargo && item.empresa) ? " - " : ""}
                        {item.empresa || <span style={{ color: "#d1d5db", fontWeight: "normal" }}>Empresa</span>}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.9em", color: "#4b5563", whiteSpace: "nowrap" }}>
                        {item.periodo || <span style={{ color: "#d1d5db" }}>Período</span>}
                      </p>
                    </div>
                    <ul>
                      {item.bullets.length > 0 ? (
                        item.bullets.map((bullet, bulletIndex) => (
                          <li key={`${bullet}-${bulletIndex}`}>{bullet}</li>
                        ))
                      ) : (
                        <li style={{ color: "#d1d5db" }}>Descreva suas atividades e conquistas...</li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        return (
          <section className="resume-section" key={key}>
            <h2>{title}</h2>
            {section.itens.length > 0 ? (
              <ul className="resume-topic-list">
                {section.itens.map((item, itemIndex) => (
                  <li key={`${item}-${itemIndex}`}>{item}</li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "#d1d5db", fontStyle: "italic" }}>Adicione suas competências...</p>
            )}
          </section>
        );
      })}
    </article>
  );
};
