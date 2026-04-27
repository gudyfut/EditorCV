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
        <h1>{data.meta.cargo}</h1>
        <p className="resume-name">{data.meta.nome.toUpperCase()}</p>
        <hr />
        <div className="resume-contact">
          <span>
            <Phone size={12} /> {data.meta.telefone}
          </span>
          <span className="divider">|</span>
          <span>
            <Mail size={12} /> {data.meta.email}
          </span>
        </div>
        <hr />
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
              <p>{section.conteudo}</p>
            </section>
          );
        }

        if (key === "skills") {
          return (
            <section className="resume-section" key={key}>
              <h2>{title}</h2>
              <ul>
                {section.grupos.map((group, groupIndex) => (
                  <li key={`${group.label}-${groupIndex}`}>
                    <strong>{group.label}:</strong> {group.itens.join(", ")}
                  </li>
                ))}
              </ul>
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
                    <p>
                      <strong>{item.titulo}</strong>
                    </p>
                    <p>{item.instituicao}</p>
                    <p>{item.periodo}</p>
                    <p>{item.status}</p>
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
                    <p>
                      <strong>
                        {item.cargo} - {item.empresa}
                      </strong>
                    </p>
                    <ul>
                      {item.bullets.map((bullet, bulletIndex) => (
                        <li key={`${bullet}-${bulletIndex}`}>{bullet}</li>
                      ))}
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
            <ul className="resume-topic-list">
              {section.itens.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          </section>
        );
      })}
    </article>
  );
};
