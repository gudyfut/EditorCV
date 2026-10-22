import { DEFAULT_RESUME_LAYOUT, ResumeData, ResumeLayout } from './types/resume';

export type ResumeInput = Omit<ResumeData, 'layout'> & { layout?: Partial<ResumeLayout> };

// Shared by the editor and the terminal renderer so older JSON files look alike.
export function normalizeResumeData(raw: ResumeInput): ResumeData {
  const layout = raw.layout;
  return {
    ...raw,
    layout: {
      ...DEFAULT_RESUME_LAYOUT,
      ...layout,
      baseFontSize: layout?.baseFontSize ?? DEFAULT_RESUME_LAYOUT.baseFontSize,
      fontScale: layout?.fontScale ?? DEFAULT_RESUME_LAYOUT.fontScale,
      headingScale: layout?.headingScale ?? DEFAULT_RESUME_LAYOUT.headingScale,
      lineHeight: layout?.lineHeight ?? DEFAULT_RESUME_LAYOUT.lineHeight,
    },
  };
}
