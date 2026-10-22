import { useEffect, useRef, useState } from 'react';
import { FileJson, FolderOpen, Search, X } from 'lucide-react';
import { getResumeCatalog, ResumeFileEntry } from '../resume-files';

interface Props { onSelect: (entry: ResumeFileEntry) => Promise<void>; onBrowse: () => void; onClose: () => void }

export function ResumeFileDialog({ onSelect, onBrowse, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [files, setFiles] = useState<ResumeFileEntry[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    dialogRef.current?.showModal();
    let alive = true;
    void getResumeCatalog().then(catalog => { if (alive) { setFiles(catalog.files); setLoading(false); } });
    return () => { alive = false; dialogRef.current?.close(); };
  }, []);

  const filtered = files.filter(file => `${file.name} ${file.folder}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  const choose = async (entry: ResumeFileEntry) => {
    setBusy(true);
    try { await onSelect(entry); onClose(); }
    catch (error) { setError(error instanceof Error ? error.message : 'Não foi possível abrir o currículo.'); }
    finally { setBusy(false); }
  };

  return (
    <dialog ref={dialogRef} className="resume-file-dialog" aria-labelledby="resume-file-title" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="resume-file-heading">
        <div><h2 id="resume-file-title">Abrir currículo</h2><p>JSONs nas pastas do projeto</p></div>
        <button type="button" aria-label="Fechar seleção de currículo" onClick={onClose}><X size={20} /></button>
      </div>
      <label className="resume-file-search"><Search size={17} /><input autoFocus aria-label="Buscar currículo" placeholder="Buscar pelo nome do arquivo..." value={search} onChange={event => setSearch(event.target.value)} /></label>
      <div className="resume-file-list" aria-busy={loading || busy}>
        {loading ? <p>Carregando currículos...</p> : ['resumes', 'public/resumes'].map(folder => (
          <section key={folder}>
            <h3><FolderOpen size={14} /> {folder}/</h3>
            {filtered.filter(file => file.folder === folder).map(file => (
              <button type="button" key={file.id} disabled={busy} onClick={() => void choose(file)}><FileJson size={18} /><span>{file.name}</span><span>Abrir</span></button>
            ))}
            {!filtered.some(file => file.folder === folder) && <p>{folder === 'resumes' && !search ? 'Coloque seus JSONs pessoais nesta pasta.' : 'Nenhum arquivo encontrado.'}</p>}
          </section>
        ))}
      </div>
      {error && <p className="resume-file-error" role="alert">{error}</p>}
      <div className="resume-file-footer"><button type="button" disabled={busy} onClick={onBrowse}><FolderOpen size={16} /> Escolher em outra pasta</button></div>
    </dialog>
  );
}
