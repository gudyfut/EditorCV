import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { ResumePreview } from '../app/components/ResumePreview';
import { normalizeResumeData, ResumeInput } from '../app/resume-data';
import '../styles/index.css';

declare global {
  interface Window {
    renderEditorCVResume: (data: ResumeInput) => void;
  }
}

const root = createRoot(document.getElementById('root')!);
window.renderEditorCVResume = data => {
  flushSync(() => root.render(<ResumePreview data={normalizeResumeData(data)} />));
};
