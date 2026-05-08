export interface ResumeMeta {
  nome: string;
  cargo: string;
  telefone: string;
  email: string;
  telefoneVisivel?: boolean;
  emailVisivel?: boolean;
}

export interface BaseSection {
  id: string;
  tipo: 'text' | 'list' | 'grouped_list' | 'timeline';
  visivel: boolean;
  ordem: number;
  titulo?: string;
}

export interface TextSection extends BaseSection {
  tipo: 'text';
  conteudo: string;
}

export interface ListSection extends BaseSection {
  tipo: 'list';
  itens: string[];
}

export interface SkillsGroup {
  label: string;
  itens: string[];
}

export interface GroupedListSection extends BaseSection {
  tipo: 'grouped_list';
  grupos: SkillsGroup[];
}

export interface TimelineItem {
  id: string;
  titulo: string;
  descricao?: string;
  data?: string;
  dataVisivel?: boolean;
  local?: string;
  localVisivel?: boolean;
}

export interface TimelineSection extends BaseSection {
  tipo: 'timeline';
  itens: TimelineItem[];
}

export type ResumeSection = TextSection | ListSection | GroupedListSection | TimelineSection;

export interface ResumeLayout {
  baseFontSize: number;
  fontScale: number;
  headingScale: number;
  lineHeight: number;
}

export const DEFAULT_RESUME_LAYOUT: ResumeLayout = {
  baseFontSize: 12.5,
  fontScale: 1,
  headingScale: 1,
  lineHeight: 1.35,
};

export interface ResumeData {
  meta: ResumeMeta;
  layout: ResumeLayout;
  secoes: ResumeSection[];
}
