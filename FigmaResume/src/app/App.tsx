import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Download, FileJson, FolderOpen, Save } from "lucide-react";
import { ResumeForm } from "./components/ResumeForm";
import { ResumePreview } from "./components/ResumePreview";
import { DEFAULT_RESUME_LAYOUT, ResumeData } from "./types/resume";

type JsonFileHandle = {
  name: string;
  getFile: () => Promise<File>;
  createWritable: () => Promise<{
    write: (data: Blob | string) => Promise<void> | void;
    close: () => Promise<void> | void;
  }>;
};

type PickerWindow = Window & {
  showOpenFilePicker?: (options?: {
    multiple?: boolean;
    excludeAcceptAllOption?: boolean;
    types?: Array<{
      description?: string;
      accept: Record<string, string[]>;
    }>;
  }) => Promise<JsonFileHandle[]>;
  showSaveFilePicker?: (options?: {
    suggestedName?: string;
    excludeAcceptAllOption?: boolean;
    types?: Array<{
      description?: string;
      accept: Record<string, string[]>;
    }>;
  }) => Promise<JsonFileHandle>;
};

const DEFAULT_JSON_PATH = "/resume-data.json";

const normalizeResumeData = (raw: ResumeData | Omit<ResumeData, "layout">): ResumeData => {
  const candidate = raw as ResumeData;
  const layout = candidate.layout;

  return {
    ...candidate,
    layout: {
      baseFontSize: layout?.baseFontSize ?? DEFAULT_RESUME_LAYOUT.baseFontSize,
      fontScale: layout?.fontScale ?? DEFAULT_RESUME_LAYOUT.fontScale,
      headingScale: layout?.headingScale ?? DEFAULT_RESUME_LAYOUT.headingScale,
      lineHeight: layout?.lineHeight ?? DEFAULT_RESUME_LAYOUT.lineHeight,
    },
  };
};

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [sourceName, setSourceName] = useState("resume-data.json");
  const [statusMessage, setStatusMessage] = useState("Carregando JSON...");
  const [previewScale, setPreviewScale] = useState(1);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileHandleRef = useRef<JsonFileHandle | null>(null);
  const previewStageRef = useRef<HTMLDivElement | null>(null);
  const previewContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;

    const loadDefaultJson = async () => {
      try {
        const response = await fetch(DEFAULT_JSON_PATH);
        if (!response.ok) {
          throw new Error(`Falha ao carregar ${DEFAULT_JSON_PATH}`);
        }

        const json = normalizeResumeData((await response.json()) as ResumeData);
        if (!alive) {
          return;
        }

        setResumeData(json);
        setStatusMessage(`Padrão carregado de ${DEFAULT_JSON_PATH}`);
      } catch (error) {
        if (!alive) {
          return;
        }

        setStatusMessage("Nao foi possivel carregar o JSON padrão.");
      }
    };

    void loadDefaultJson();

    return () => {
      alive = false;
    };
  }, []);

  const updateResumeData = (nextData: ResumeData) => {
    setResumeData(nextData);
    setStatusMessage("Alteracoes prontas para salvar");
  };

  useLayoutEffect(() => {
    const stage = previewStageRef.current;
    const content = previewContentRef.current;

    if (!stage || !content || !resumeData) {
      return;
    }

    const recomputeScale = () => {
      const stageWidth = stage.clientWidth;
      const stageHeight = stage.clientHeight;
      const contentWidth = content.scrollWidth;
      const contentHeight = content.scrollHeight;

      if (stageWidth <= 0 || stageHeight <= 0 || contentWidth <= 0 || contentHeight <= 0) {
        return;
      }

      const widthRatio = (stageWidth - 4) / contentWidth;
      const heightRatio = (stageHeight - 4) / contentHeight;
      const nextScale = Math.max(Math.min(Math.min(widthRatio, heightRatio) * 0.98, 1), 0.25);

      setPreviewScale((current) => (Math.abs(current - nextScale) < 0.005 ? current : nextScale));
    };

    const rafId = requestAnimationFrame(recomputeScale);
    const stageObserver = new ResizeObserver(recomputeScale);
    const contentObserver = new ResizeObserver(recomputeScale);

    stageObserver.observe(stage);
    contentObserver.observe(content);
    window.addEventListener("resize", recomputeScale);

    return () => {
      cancelAnimationFrame(rafId);
      stageObserver.disconnect();
      contentObserver.disconnect();
      window.removeEventListener("resize", recomputeScale);
    };
  }, [resumeData]);

  const getPickerWindow = () => window as PickerWindow;

  const loadJsonText = async (file: File) => {
    const parsed = normalizeResumeData(JSON.parse(await file.text()) as ResumeData);
    setResumeData(parsed);
    setSourceName(file.name);
    setStatusMessage(`JSON carregado: ${file.name}`);
  };

  const handleOpenJson = async () => {
    const pickerWindow = getPickerWindow();

    if (pickerWindow.showOpenFilePicker) {
      try {
        const [handle] = await pickerWindow.showOpenFilePicker({
          multiple: false,
          excludeAcceptAllOption: false,
          types: [
            {
              description: "JSON",
              accept: {
                "application/json": [".json"],
              },
            },
          ],
        });

        const file = await handle.getFile();
        await loadJsonText(file);
        fileHandleRef.current = handle;
        return;
      } catch {
        setStatusMessage("Abertura de JSON cancelada.");
        return;
      }
    }

    fileInputRef.current?.click();
  };

  const handleFallbackFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      await loadJsonText(file);
      fileHandleRef.current = null;
      setStatusMessage(`JSON carregado: ${file.name}. O salvar fará download.`);
    } catch {
      setStatusMessage("Arquivo JSON invalido.");
    } finally {
      event.target.value = "";
    }
  };

  const downloadJson = (jsonText: string, fileName: string) => {
    const blob = new Blob([jsonText], { type: "application/json;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  };

  const handleSaveJson = async () => {
    if (!resumeData) {
      return;
    }

    const jsonText = JSON.stringify(resumeData, null, 2);
    const pickerWindow = getPickerWindow();

    if (fileHandleRef.current) {
      try {
        const writable = await fileHandleRef.current.createWritable();
        await writable.write(jsonText);
        await writable.close();
        setStatusMessage(`JSON salvo no arquivo ${fileHandleRef.current.name}`);
        return;
      } catch {
        setStatusMessage("Falha ao salvar no arquivo selecionado.");
        return;
      }
    }

    if (pickerWindow.showSaveFilePicker) {
      try {
        const handle = await pickerWindow.showSaveFilePicker({
          suggestedName: sourceName,
          excludeAcceptAllOption: false,
          types: [
            {
              description: "JSON",
              accept: {
                "application/json": [".json"],
              },
            },
          ],
        });

        const writable = await handle.createWritable();
        await writable.write(jsonText);
        await writable.close();
        fileHandleRef.current = handle;
        setSourceName(handle.name);
        setStatusMessage(`JSON salvo em ${handle.name}`);
        return;
      } catch {
        setStatusMessage("Salvamento cancelado.");
        return;
      }
    }

    downloadJson(jsonText, sourceName);
    setStatusMessage(`JSON baixado como ${sourceName}`);
  };

  const handleExportPDF = () => {
    if (!resumeData) return;
    window.print();
  };

  return (
    <div className="editor-page">
      <header className="app-toolbar">
        <div className="toolbar-brand">
          <div className="toolbar-badge">
            <FileJson size={14} /> JSON UI
          </div>
          <div>
            <p className="app-kicker">EditorCV MVP</p>
            <h1>Editor de Currículo Dinâmico</h1>
          </div>
        </div>

        <div className="toolbar-center">
          <span className="toolbar-status">{statusMessage}</span>
          <span className="toolbar-source">{sourceName}</span>
        </div>

        <div className="toolbar-actions">
          <button type="button" onClick={handleOpenJson} style={{ background: "#ffffff", color: "#1e293b", borderColor: "#cbd5e1" }}>
            <FolderOpen size={14} /> Abrir JSON
          </button>
          <button type="button" onClick={handleSaveJson} style={{ background: "#eff6ff", color: "#1d4ed8", borderColor: "#bfdbfe" }}>
            <Save size={14} /> Salvar JSON
          </button>
          <button type="button" onClick={handleExportPDF} style={{ background: "#0f172a", color: "#ffffff", borderColor: "#0f172a" }}>
            <Download size={14} /> Exportar PDF
          </button>
        </div>
      </header>

      <main className="editor-layout">
        <aside className="form-panel">
          {resumeData ? (
            <ResumeForm data={resumeData} onDataChange={updateResumeData} />
          ) : (
            <div className="loading-state">Carregando JSON base...</div>
          )}
        </aside>

        <section className="preview-panel">
          {resumeData ? (
            <div className="preview-fit-stage" ref={previewStageRef}>
              <div className="preview-fit-content" ref={previewContentRef} style={{ transform: `scale(${previewScale})` }}>
                <ResumePreview data={resumeData} />
              </div>
            </div>
          ) : (
            <div className="loading-state">Carregando PDF...</div>
          )}
        </section>
      </main>

      <input ref={fileInputRef} type="file" accept="application/json,.json" hidden onChange={handleFallbackFileChange} />
    </div>
  );
};

export default App;
