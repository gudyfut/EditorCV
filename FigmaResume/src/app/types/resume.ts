export interface ResumeMeta {
  nome: string;
  cargo: string;
  telefone: string;
  email: string;
}

export interface SobreSection {
  visivel: boolean;
  ordem: number;
  conteudo: string;
  titulo?: string;
}

export interface SkillsGroup {
  label: string;
  itens: string[];
}

export interface SkillsSection {
  visivel: boolean;
  ordem: number;
  grupos: SkillsGroup[];
  titulo?: string;
}

export interface FormacaoItem {
  titulo: string;
  instituicao: string;
  periodo: string;
  status: string;
}

export interface FormacaoSection {
  visivel: boolean;
  ordem: number;
  itens: FormacaoItem[];
  titulo?: string;
}

export interface ExperienciaItem {
  cargo: string;
  empresa: string;
  bullets: string[];
}

export interface ExperienciaSection {
  visivel: boolean;
  ordem: number;
  itens: ExperienciaItem[];
  titulo?: string;
}

export interface CompetenciasSection {
  visivel: boolean;
  ordem: number;
  itens: string[];
  titulo?: string;
}

export interface ResumeLayout {
  fontScale: number;
  headingScale: number;
  lineHeight: number;
}

export const DEFAULT_RESUME_LAYOUT: ResumeLayout = {
  fontScale: 1,
  headingScale: 1,
  lineHeight: 1.35,
};

export interface ResumeData {
  meta: ResumeMeta;
  layout: ResumeLayout;
  secoes: {
    sobre: SobreSection;
    skills: SkillsSection;
    formacao: FormacaoSection;
    experiencia: ExperienciaSection;
    competencias: CompetenciasSection;
  };
}
