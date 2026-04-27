import React from 'react';
import { Phone, Mail, Linkedin, MapPin } from 'lucide-react';

const DARK_GRAY = '#2F4F4F';

interface ATSResumeProps {
  language?: 'en' | 'pt';
}

export const ATSResume: React.FC<ATSResumeProps> = ({ language = 'en' }) => {
  const content = {
    en: {
      title: "Finance Analyst / Controllership (Junior → Mid-level)",
      summaryHeader: "Professional Profile",
      summaryDetail: "Finance Analyst with experience in FP&A and controllership, specializing in revenue processes, accounting integration, and management report automation. Strong expertise in SAP, Power BI, and SQL, ensuring regulatory compliance and business integrity.",
      achievementsHeader: "Key Results",
      experienceHeader: "Professional Experience",
      skillsHeader: "Technical Skills",
      educationHeader: "Education",
      accountingTitle: "Bachelor of Accounting Sciences",
      isTitle: "B.S. Information Systems Management",
      isSub: "Focus on financial processes and technology applied to finance.",
      present: "Present",
      accounting: "Accounting",
      systems: "Information Systems",
      inProgress: "In Progress"
    },
    pt: {
      title: "Analista Financeiro / Controladoria (Júnior → Pleno)",
      summaryHeader: "Perfil Profissional",
      summaryDetail: "Analista Financeiro com experiência em FP&A e controladoria, especializado em processos de receita, integração contábil e automação de relatórios gerenciais. Forte atuação em SAP, Power BI e SQL, garantindo conformidade regulatória e integridade do negócio.",
      achievementsHeader: "Principais Resultados",
      experienceHeader: "Experiência Profissional",
      skillsHeader: "Habilidades Técnicas",
      educationHeader: "Formação Acadêmica",
      accountingTitle: "Bacharelado em Ciências Contábeis",
      isTitle: "Gestão de Sistemas de Informação",
      isSub: "Base sólida em tecnologia e processos financeiros aplicada à área financeira.",
      present: "Atual",
      accounting: "Ciências Contábeis",
      systems: "Sistemas de Informação",
      inProgress: "Em Andamento"
    }
  };

  const t = content[language];

  return (
    <div 
      className="bg-white shadow-2xl mx-auto overflow-hidden p-12 print:shadow-none print:m-0"
      style={{ 
        width: '210mm', 
        height: '297mm',
        fontFamily: "'Inter', sans-serif",
        color: DARK_GRAY
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-900 pb-4">
          <h1 className="text-2xl font-bold text-black uppercase tracking-tight">Heitor Penha</h1>
          <p className="text-sm font-semibold text-gray-700 mt-1 uppercase tracking-wider">{t.title}</p>
          <div className="flex justify-center gap-4 mt-3 text-[11px] text-black">
            <span className="flex items-center gap-1 font-bold"><Phone size={10} /> +55 (34) 99667-1069</span>
            <span className="flex items-center gap-1 font-bold"><Mail size={10} /> heitor.penha@email.com</span>
            <span className="flex items-center gap-1 font-bold"><Linkedin size={10} /> linkedin.com/in/heitor-penha30/</span>
            <span className="flex items-center gap-1 font-bold"><MapPin size={10} /> Uberlândia, Brazil</span>
          </div>
          <p className="text-[11px] mt-2 font-bold bg-gray-50 inline-block px-3 py-1 rounded">Languages: Portuguese (Native), English (Full Professional)</p>
        </div>

        {/* Summary */}
        <section>
          <h2 className="text-xs font-bold border-b border-black mb-2 uppercase tracking-widest">{t.summaryHeader}</h2>
          <p className="text-[11px] leading-relaxed font-medium italic">
            {t.summaryDetail}
          </p>
        </section>

        {/* Experience */}
        <section>
          <h2 className="text-xs font-bold border-b border-black mb-3 uppercase tracking-widest">{t.experienceHeader}</h2>
          
          <div className="space-y-6">
            {/* Job 1 */}
            <div>
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="text-[12px] font-bold uppercase">HR Path – Financial Analyst (North America)</h3>
                <span className="text-[10px] font-bold">Nov 2025 – {t.present} | Montreal, Canada</span>
              </div>
              <p className="text-[10.5px] font-medium text-gray-700 mb-1.5 leading-relaxed">
                {language === 'en' 
                  ? 'Part of the North America Finance team, focusing on process optimization, data integration, and financial performance visibility.' 
                  : 'Atuação na equipe de Finanças da América do Norte, com foco em otimização de processos, integração de dados e visibilidade da performance financeira.'}
              </p>
              <ul className="text-[10.5px] list-disc pl-5 space-y-1 font-medium text-gray-800">
                <li>{language === 'en' ? 'Structured the P&L framework by Line of Business, correcting SAP and WBS inconsistencies and ensuring higher data accuracy.' : 'Estruturei o framework de P&L por Linha de Negócio, corrigindo inconsistências de SAP e WBS e garantindo maior acuracidade dos dados.'}</li>
                <li>{language === 'en' ? 'Developed an integrated Revenue Planning process in SAP, creating projections more aligned with business dynamics.' : 'Desenvolvi processo de Revenue Planning integrado ao SAP, criando projeções mais aderentes à dinâmica do negócio.'}</li>
                <li>{language === 'en' ? 'Automated critical finance routines, reducing manual effort and strengthening data governance.' : 'Automatizei rotinas críticas de finanças, reduzindo esforço manual e fortalecendo governança de dados.'}</li>
                <li>{language === 'en' ? 'Collaborated with cross-functional teams to align financial operations with strategic needs, eliminating bottlenecks and increasing efficiency.' : 'Colaborei com times multifuncionais para alinhar operações financeiras às necessidades estratégicas, eliminando gargalos e aumentando eficiência.'}</li>
                <li>{language === 'en' ? 'Produced reliable management reports and revenue indicators to support decision-making.' : 'Produzi relatórios gerenciais confiáveis e indicadores de receita para suporte à tomada de decisão.'}</li>
              </ul>
            </div>

            {/* Job 2 */}
            <div>
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="text-[12px] font-bold uppercase">HR Path – FP&A Analyst (Brazil)</h3>
                <span className="text-[10px] font-bold">May 2025 – Nov 2025 | São Paulo, Brazil</span>
              </div>
              <p className="text-[10.5px] font-medium text-gray-700 mb-1.5 leading-relaxed">
                {language === 'en' 
                  ? 'Responsible for month-end close, budget and forecast preparation, and variance analysis versus actuals.' 
                  : 'Responsável por fechamento mensal, preparação de budget e forecast, além de análises de variação versus realizado.'}
              </p>
              <ul className="text-[10.5px] list-disc pl-5 space-y-1 font-medium text-gray-800">
                <li>{language === 'en' ? 'Structured and maintained the P&L model, ensuring correct cost allocation and profitability analysis per project.' : 'Estruturei e mantive modelo de P&L, assegurando correta alocação de custos e análise de rentabilidade por projeto.'}</li>
                <li>{language === 'en' ? 'Performed detailed profitability assessments on strategic projects.' : 'Realizei avaliações detalhadas de lucratividade em projetos estratégicos.'}</li>
                <li>{language === 'en' ? 'Implemented a new P&L model that reduced indirect cost allocation time from 3 days to just 30 minutes.' : 'Implementei novo modelo de P&L que reduziu tempo de alocação de custos indiretos de 2–3 dias para apenas 30 minutos.'}</li>
                <li>{language === 'en' ? 'Created an integrated Power BI dashboard with API connections, expanding data accessibility and management support.' : 'Criei dashboard integrado em Power BI com conexões via API, ampliando acessibilidade dos dados e suporte à gestão.'}</li>
              </ul>
            </div>

            {/* Job 3 */}
            <div>
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="text-[12px] font-bold uppercase">Versuni – FP&A Intern</h3>
                <span className="text-[10px] font-bold">Oct 2023 – Apr 2025 | Varginha, Brazil</span>
              </div>
              <p className="text-[10.5px] font-medium text-gray-700 mb-1.5 leading-relaxed">
                {language === 'en' 
                  ? 'Responsible for executing quarterly sales and expense forecasting, as well as financial analysis for the Latam region.' 
                  : 'Responsável por execução de forecast trimestral de vendas e despesas, além de análises financeiras para a região Latam.'}
              </p>
              <ul className="text-[10.5px] list-disc pl-5 space-y-1 font-medium text-gray-800">
                <li>{language === 'en' ? 'Performed P&L and sales expense analysis using Power BI, Excel, SAP Analytics, and Python.' : 'Realizei análises de P&L e despesas de vendas utilizando Power BI, Excel, SAP Analytics e Python.'}</li>
                <li>{language === 'en' ? 'Developed SOPs and Work Instructions for FP&A and PtP routines, ensuring standardization and efficiency.' : 'Desenvolvi SOPs e Work Instructions para rotinas de FP&A e PtP, garantindo padronização e eficiência.'}</li>
                <li>{language === 'en' ? 'Supported continuous improvement initiatives in financial and procurement processes, focusing on optimization and operational excellence.' : 'Apoiei iniciativas de melhoria contínua em processos financeiros e de procurement, com foco em otimização e excelência operacional.'}</li>
                <li>{language === 'en' ? 'Contributed to higher reliability of financial reports and forecasts, strengthening regional decision-making.' : 'Contribuí para maior confiabilidade dos relatórios e previsões financeiras, fortalecendo a tomada de decisão regional.'}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Technical Skills */}
        <section>
          <h2 className="text-xs font-bold border-b border-black mb-2 uppercase tracking-widest">{t.skillsHeader}</h2>
          <div className="text-[11px] space-y-2 font-medium">
            <p><strong>ERP & Analytics:</strong> SAP ERP (FI/CO, Revenue Modules), SAP Analytics Cloud (SAC), Power BI, SQL, Excel (Advanced), Python.</p>
            <p><strong>Competencies:</strong> Revenue Reconciliation, Variance Analysis, Controllership, Provisioning, Accounting Integration, Audit Support, Data Governance.</p>
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-xs font-bold border-b border-black mb-2 uppercase tracking-widest">{t.educationHeader}</h2>
          <div className="space-y-3 font-medium text-black">
            <div className="flex justify-between items-baseline">
              <p className="text-[11px] font-bold uppercase">UFU — Federal University of Uberlândia</p>
              <span className="text-[10px] font-bold">{t.inProgress}</span>
            </div>
            <p className="text-[10px] text-gray-600 -mt-2.5 font-bold italic">{t.accountingTitle}</p>
            
            <div className="flex justify-between items-baseline">
              <div>
                <p className="text-[11px] font-bold uppercase">UNINTER</p>
                <p className="text-[10px] text-gray-600 font-bold italic">{t.isTitle} ({t.isSub})</p>
              </div>
              <span className="text-[10px] font-bold">2024 – 2028</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
