export const RESUME_FONTS = [
  { id: 'system', name: 'Padrão (sistema)', category: 'Sem serifa', family: '"Inter", "Segoe UI", sans-serif' },
  { id: 'arial', name: 'Arial', category: 'Sem serifa', family: 'Arial, Helvetica, sans-serif' },
  { id: 'calibri', name: 'Calibri', category: 'Sem serifa', family: 'Calibri, "Segoe UI", sans-serif' },
  { id: 'segoe-ui', name: 'Segoe UI', category: 'Sem serifa', family: '"Segoe UI", Arial, sans-serif' },
  { id: 'verdana', name: 'Verdana', category: 'Sem serifa', family: 'Verdana, Geneva, sans-serif' },
  { id: 'trebuchet', name: 'Trebuchet MS', category: 'Sem serifa', family: '"Trebuchet MS", Arial, sans-serif' },
  { id: 'georgia', name: 'Georgia', category: 'Com serifa', family: 'Georgia, "Times New Roman", serif' },
  { id: 'cambria', name: 'Cambria', category: 'Com serifa', family: 'Cambria, Georgia, serif' },
  { id: 'times', name: 'Times New Roman', category: 'Com serifa', family: '"Times New Roman", Times, serif' },
  { id: 'courier', name: 'Courier New', category: 'Monoespaçada', family: '"Courier New", Courier, monospace' },
] as const;

export const getResumeFont = (id: string) => RESUME_FONTS.find(font => font.id === id) ?? RESUME_FONTS[0];
