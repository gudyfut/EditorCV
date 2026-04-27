import React from 'react';
import { Phone, Mail, Linkedin, MapPin, Globe } from 'lucide-react';

const DARK_GRAY = '#2F4F4F';

interface ResumeProps {
  className?: string;
  language?: 'en' | 'pt';
}

export const Resume: React.FC<ResumeProps> = ({ className = "", language = 'en' }) => {
  const content = {
    en: {
      title: "Finance Analyst / Controllership",
      seniority: "(Junior → Mid-level)",
      langInfo: "Portuguese (Native); English (Full Professional)",
      skills: "Technical Skills",
      skillsSub: "/ Habilidades",
      education: "Education",
      eduSub: "/ Formação",
      certs: "Certifications",
      certSub: "/ Certificados",
      languages: "Languages",
      langSub: "/ Idiomas",
      summary: "Profile",
      summarySub: "/ Perfil",
      achievements: "Key Results",
      achievSub: "/ Resultados",
      experience: "Professional Experience",
      expSub: "/ Experiência",
      summaryDetail: "Finance Analyst with experience in FP&A and controllership, specializing in revenue processes, accounting integration, and management report automation. Strong expertise in SAP, Power BI, and SQL, ensuring regulatory compliance and business integrity.",
      present: "Present",
      accountingTitle: "Bachelor of Accounting Sciences",
      isTitle: "B.S. Information Systems Management",
      isSub: "Focus on financial processes & technology",
      eduExpected: "Expected",
      eduInProg: "In Progress",
      billingFocus: "Controllership & Compliance",
      billingSub: "/ Foco em Controladoria",
      opsTax: "Revenue Integration",
      opsTaxText: "Validation between Commercial × Finance × Accounting systems; provisioning and variance analysis with technical rigor.",
      reconSupport: "Governance & Audit",
      reconSupportText: "Support for internal/external audits; revenue reconciliation and maintenance of data integrity across ERP systems (SAP FI/CO)."
    },
    pt: {
      title: "Analista Financeiro / Controladoria",
      seniority: "(Júnior → Pleno)",
      langInfo: "Português (Nativo); Inglês (Profissional Completo)",
      skills: "Habilidades Técnicas",
      skillsSub: "/ Skills",
      education: "Formação",
      eduSub: "/ Education",
      certs: "Certificados",
      certSub: "/ Certifications",
      languages: "Idiomas",
      langSub: "/ Languages",
      summary: "Perfil Profissional",
      summarySub: "/ Profile",
      achievements: "Principais Resultados",
      achievSub: "/ Key Results",
      experience: "Experiência Profissional",
      expSub: "/ Experience",
      summaryDetail: "Analista Financeiro com experiência em FP&A e controladoria, especializado em processos de receita, integração contábil e automação de relatórios gerenciais. Forte atuação em SAP, Power BI e SQL, garantindo conformidade regulatória e integridade do negócio.",
      present: "Atual",
      accountingTitle: "Bacharelado em Ciências Contábeis",
      isTitle: "Gestão de Sistemas de Informação",
      isSub: "Base sólida em processos e tecnologia financeira",
      eduExpected: "Previsto",
      eduInProg: "Em Andamento",
      billingFocus: "Controladoria & Compliance",
      billingSub: "/ Controllership Focus",
      opsTax: "Integração de Receita",
      opsTaxText: "Validação entre sistemas Comercial × Financeiro × Contábil; domínio em provisionamento e análise de variações.",
      reconSupport: "Governança & Auditoria",
      reconSupportText: "Suporte a auditorias; conciliação de receitas e manutenção da integridade de dados no ERP (SAP FI/CO)."
    }
  };

  const t = content[language];

  return (
    <div 
      className={`bg-white shadow-2xl mx-auto overflow-hidden print:shadow-none print:m-0 ${className}`}
      style={{ 
        width: '210mm', 
        height: '297mm',
        fontFamily: "'Inter', 'Roboto', sans-serif",
        color: DARK_GRAY
      }}
    >
      {/* Header */}
      <div className="p-10 pb-8 flex justify-between items-center border-b border-gray-100 bg-white">
        <div className="flex flex-col">
          <h1 className="text-[24px] font-bold tracking-tight text-[#0B3D91] leading-none mb-2">
            Heitor Penha
          </h1>
          <p className="text-[15px] text-[#2F4F4F] font-semibold italic">
            {t.title} <span className="text-[#6CA0DC] text-xs font-medium ml-1">{t.seniority}</span>
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-[12px] text-gray-600">
            <div className="flex items-center gap-1.5">
              <Phone size={13} className="text-[#6CA0DC]" />
              <span className="font-medium">+55 (34) 99667-1069</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail size={13} className="text-[#6CA0DC]" />
              <span className="font-medium">heitor.penha@email.com</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Linkedin size={13} className="text-[#6CA0DC]" />
              <span className="font-medium">linkedin.com/in/heitor-penha30/</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[#6CA0DC]" />
              <span className="font-medium">Uberlândia, MG - Brazil</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] font-bold text-[#0B3D91] bg-[#6CA0DC]/5 w-fit px-3 py-1 rounded-full border border-[#6CA0DC]/20">
            <Globe size={11} />
            <span>{t.langInfo}</span>
          </div>
        </div>
        
        <div className="w-16 h-16 rounded-xl bg-[#0B3D91] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          HP
        </div>
      </div>

      <div className="flex h-full">
        <div className={`w-[32%] bg-[#F7F9FB] p-8 flex flex-col gap-8 h-full border-r border-gray-100`}>
          <section>
            <h2 className="text-[14px] font-semibold uppercase tracking-wider text-[#0B3D91] border-b-2 border-[#6CA0DC] pb-1 mb-4 flex justify-between items-end">
              {t.skills} <span className="text-[9px] font-normal lowercase text-gray-500">{t.skillsSub}</span>
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-bold text-[#2F4F4F] mb-1.5">ERP & Analytics</p>
                <div className="flex flex-wrap gap-1.5">
                  {['SAP (FI/CO)', 'SAP SAC', 'Power BI', 'SQL', 'Excel (Adv)', 'Python'].map(skill => (
                    <span key={skill} className="px-2 py-0.5 bg-white border border-gray-200 text-[10px] font-medium rounded-sm shadow-sm">{skill}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#2F4F4F] mb-1.5">Expertise</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Revenue Recon', 'Controllership', 'Budget/Forecast', 'Audit Support'].map(skill => (
                    <span key={skill} className="px-2 py-0.5 bg-white border border-gray-200 text-[10px] font-medium rounded-sm shadow-sm">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[14px] font-semibold uppercase tracking-wider text-[#0B3D91] border-b-2 border-[#6CA0DC] pb-1 mb-4 flex justify-between items-end">
              {t.education} <span className="text-[9px] font-normal lowercase text-gray-500">{t.eduSub}</span>
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-bold text-[#2F4F4F]">UFU — Univ. Federal de Uberlândia</p>
                <p className="text-[10px] text-gray-700 italic">{t.accountingTitle}</p>
                <p className="text-[9px] text-[#6CA0DC] font-medium mt-0.5 tracking-wide">{t.eduInProg}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#2F4F4F]">UNINTER</p>
                <p className="text-[10px] text-gray-700 italic">{t.isTitle}</p>
                <p className="text-[9px] text-[#6CA0DC] font-medium mt-1">2024 – 2028 ({t.eduExpected})</p>
              </div>
            </div>
          </section>

          <section className="bg-[#0B3D91]/5 p-4 rounded-lg border border-[#6CA0DC]/20">
            <h2 className="text-[12px] font-bold uppercase tracking-widest text-[#0B3D91] mb-2">
              {t.billingFocus}
            </h2>
            <p className="text-[10px] text-gray-600 leading-relaxed italic">
              {t.opsTaxText}
            </p>
          </section>
        </div>

        <div className="w-[68%] p-8 flex flex-col gap-6 overflow-y-auto">
          <section>
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-[#0B3D91] mb-2.5 flex items-center gap-2">
              <span className="w-6 h-px bg-[#6CA0DC]"></span>
              {t.summary} <span className="text-[9px] font-normal lowercase text-gray-400">{t.summarySub}</span>
            </h2>
            <p className="text-[11px] leading-relaxed text-gray-700 font-medium">
              {t.summaryDetail}
            </p>
          </section>

          <section>
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-[#0B3D91] mb-3.5 flex items-center gap-2">
              <span className="w-6 h-px bg-[#6CA0DC]"></span>
              {t.experience} <span className="text-[9px] font-normal lowercase text-gray-400">{t.expSub}</span>
            </h2>
            <div className="space-y-6">
              {/* Job 1 */}
              <div>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-[12px] font-bold text-[#0B3D91]">
                      {language === 'en' ? 'Financial Analyst (North America)' : 'Analista Financeiro (North America)'}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">HR Path — Montreal, Canada</p>
                  </div>
                  <span className="text-[9.5px] bg-[#6CA0DC]/10 text-[#0B3D91] px-2 py-0.5 rounded font-bold">Nov 2025 – {t.present}</span>
                </div>
                <ul className="text-[10px] space-y-1 list-disc pl-4 marker:text-[#6CA0DC] text-gray-700 font-medium">
                  <li>{language === 'en' ? 'Structured P&L framework by Business Line, correcting SAP/WBS inconsistencies.' : 'Estruturei o framework de P&L por Linha de Negócio, corrigindo inconsistências de SAP e WBS.'}</li>
                  <li>{language === 'en' ? 'Developed integrated Revenue Planning in SAP for higher projection accuracy.' : 'Desenvolvi processo de Revenue Planning integrado ao SAP, gerando projeções mais aderentes.'}</li>
                  <li>{language === 'en' ? 'Automated finance routines, reducing manual effort and strengthening data governance.' : 'Automatizei rotinas críticas de finanças, reduzindo esforço manual e fortalecendo a governança.'}</li>
                </ul>
              </div>

              {/* Job 2 */}
              <div>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-[12px] font-bold text-[#0B3D91]">
                      {language === 'en' ? 'FP&A Analyst' : 'Analista de FP&A'}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">HR Path — São Paulo, Brazil</p>
                  </div>
                  <span className="text-[9.5px] bg-[#E5E7EB] text-gray-600 px-2 py-0.5 rounded font-bold">May 2025 – Nov 2025</span>
                </div>
                <ul className="text-[10px] space-y-1 list-disc pl-4 marker:text-[#6CA0DC] text-gray-700 font-medium">
                  <li>{language === 'en' ? 'New P&L model implementation: reduced indirect allocation from 3 days to 30 minutes.' : 'Novo modelo de P&L: redução do tempo de alocação de 3 dias para apenas 30 minutos.'}</li>
                  <li>{language === 'en' ? 'Created Power BI dashboard with API connections for improved strategic data access.' : 'Criação de dashboard em Power BI com APIs, ampliando o suporte à gestão estratégica.'}</li>
                  <li>{language === 'en' ? 'Ensured correct cost allocation and profitability analysis per project.' : 'Assegurei correta alocação de custos e análise de rentabilidade por projeto.'}</li>
                </ul>
              </div>

              {/* Job 3 */}
              <div>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-[12px] font-bold text-[#0B3D91]">
                      {language === 'en' ? 'FP&A Intern' : 'Estagiário de FP&A'}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Versuni — Brazil</p>
                  </div>
                  <span className="text-[9.5px] bg-[#E5E7EB] text-gray-600 px-2 py-0.5 rounded font-bold">Oct 2023 – Apr 2025</span>
                </div>
                <ul className="text-[10px] space-y-1 list-disc pl-4 marker:text-[#6CA0DC] text-gray-700 font-medium">
                  <li>{language === 'en' ? 'Sales forecasting and P&L analysis using Power BI, SAP Analytics, and Python.' : 'Forecast de vendas e análise de P&L via Power BI, SAP Analytics e Python.'}</li>
                  <li>{language === 'en' ? 'Developed SOPs and Work Instructions, ensuring standardization for FP&A/PtP routines.' : 'Desenvolvimento de SOPs e Work Instructions, garantindo padronização para rotinas de FP&A.'}</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
