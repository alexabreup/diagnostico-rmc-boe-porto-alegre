import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Technical documentation sidebars for Diagnóstico RMC Platform
 * Author: Alexandre de Abreu Pereira - Eletromidia Hardware Department
 * 
 * Navigation structure organized by technical documentation categories:
 * - Individual component analyses (analises-individuais)
 * - Comparative analyses and benchmarks (comparativos)
 * - Problem identification and diagnostics (problemas-identificados)
 * - Technical specifications and procedures (especificacoes-tecnicas)
 * - Procedures and methodologies (procedimentos)
 * - Executive reports and summaries (relatorios-executivos)
 * 
 * This structure matches migrated content organization while providing
 * clear categorization for technical documentation standards.
 */
const sidebars: SidebarsConfig = {
  // Main technical documentation sidebar
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Análises Individuais',
      description: 'Análises técnicas detalhadas de componentes individuais RMC',
      collapsed: false,
      items: [
        'analises-individuais/index',
        'analises-individuais/rmc-850y-poa',
        'analises-individuais/rmc-md-1105',
        'analises-individuais/rmc-md-1107',
      ],
    },
    {
      type: 'category',
      label: 'Análises Comparativas',
      description: 'Estudos comparativos entre diferentes componentes e configurações',
      collapsed: false,
      items: [
        'comparativos/index',
        'comparativos/consolidado-3-placas',
        'comparativos/tres-placas-rmc',
      ],
    },
    {
      type: 'category',
      label: 'Problemas Identificados',
      description: 'Documentação de problemas técnicos identificados e suas evidências',
      collapsed: false,
      items: [
        'problemas-identificados/index',
      ],
    },
  ],
};

export default sidebars;