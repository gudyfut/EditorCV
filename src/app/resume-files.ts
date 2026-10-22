import publicFiles from 'virtual:resume-catalog';

export interface ResumeFileEntry { id: string; name: string; folder: string; url: string }

export async function getResumeCatalog(): Promise<{ files: ResumeFileEntry[]; exportPdf: boolean }> {
  try {
    const response = await fetch('/api/resumes', { cache: 'no-store' });
    if (response.ok && response.headers.get('content-type')?.includes('application/json')) return await response.json();
  } catch { /* Static deployments offer the public examples and native file picker. */ }
  return { files: publicFiles, exportPdf: false };
}
