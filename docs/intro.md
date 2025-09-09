---
title: Introdução
author: Alexandre de Abreu Pereira
author_email: alexandre.abreu@eletromidia.com.br
department: Hardware - Eletromidia
date: 2025-09-07T00:00:00.000Z
confidence_level: HIGH
sidebar_position: 1
analysis_method: Análise técnica comparativa
tools_used:
  - ST-LINK V2
  - st-flash
  - Interface_RMC_V6_2.exe
---

# Introdução

## Visão Geral do Projeto

Este projeto documenta uma análise técnica abrangente das placas RMC (Remote Media Controller)
baseadas no microcontrolador **GD32F307VET6**. O objetivo principal foi identificar e resolver
problemas relacionados ao sistema de schedule de brilho PWM que afetavam o controle das telas LCD.

import TechnicalTable from '@site/src/components/TechnicalTable';
import DiagnosticCard from '@site/src/components/DiagnosticCard';
import MetricsDisplay from '@site/src/components/MetricsDisplay';

## Contexto Técnico

### Hardware Analisado

<TechnicalTable 
  title="Especificações do Hardware" 
  headers={['Componente', 'Especificação', 'Status']} 
  data={[
    ['Microcontrolador', 'GD32F307VET6 (ARM Cortex-M4)', 'funcional'],
    ['Flash Memory', '256KB', 'funcional'],
    ['SRAM', '64KB', 'funcional'],
    ['Aplicação', 'Controle de brilho das telas LCD via PWM', 'funcional']
  ]} 
  statusCount={2} 
/>

### Problema Identificado

<DiagnosticCard title="Problema Principal" status="crítico">
Falhas no sistema de schedule de brilho em placas RMC, resultando em:

- Telas com PWM fixo em 0% (apagadas)
- Schedule de horários não funcional
- Horários zerados (00:00) na configuração </DiagnosticCard>

## Metodologia de Análise

### Ferramentas Utilizadas

<TechnicalTable 
  title="Ferramentas de Análise" 
  headers={['Ferramenta', 'Função', 'Status']}
  data={[
    ['ST-LINK V2', 'Programador/debugger', 'funcional'],
    ['st-flash', 'Ferramenta de programação', 'funcional'],
    ['Interface_RMC_V6_2.exe', 'Interface de configuração', 'funcional'],
    ['Análise de firmware', 'Comparação de checksums e strings', 'funcional']
  ]} 
  statusCount={2} 
/>

### Processo de Diagnóstico

1. **Extração de firmware** das placas
2. **Análise comparativa** entre versões
3. **Identificação de padrões** de degradação
4. **Validação de soluções** através de placas funcionais
5. **Documentação completa** dos achados

## Descobertas Principais

### Causa Raiz Identificada

<DiagnosticCard title="Causa Raiz" status="crítico">
**Downgrade de firmware** combinado com uso IoT intensivo, resultando em:

- Perda da implementação de horário de verão (SUMMER_TIME)
- Ausência de funções de conversão de tempo Unix
- Schedule PWM não funcional </DiagnosticCard>

### Solução Validada

<DiagnosticCard title="Solução Comprovada" status="funcional">
Atualização para firmware **ZGS126_Upgrade.bin V1.01** resolve 100% dos casos identificados.
</DiagnosticCard>

## Estrutura da Documentação

Esta documentação está organizada nas seguintes seções:

### Análises Individuais

Diagnósticos detalhados de cada placa analisada, incluindo:

- Informações de hardware
- Análise de firmware
- Estado do schedule PWM
- Configuração de rede

### Análises Comparativas

Estudos que comparam múltiplas placas para identificar padrões de degradação e validar
soluções.

### Diagnósticos Específicos

Análises focadas em problemas específicos, como controle de múltiplas telas LCD.

### Procedimentos Técnicos

Guias passo-a-passo para reprogramação e correção de placas.

### Relatórios Executivos

Resumos executivos com conclusões, recomendações e planos de ação.

## Impacto dos Resultados

<MetricsDisplay 
  title="Métricas de Impacto" 
  metrics={[
    { value: '33%', label: 'Placas funcionais (antes)', status: 'crítico' },
    { value: '100%', label: 'Placas funcionais (após)', status: 'funcional' },
    { value: '0', label: 'Chamados técnicos (após)', status: 'funcional' },
    { value: '+200%', label: 'Melhoria de confiabilidade', status: 'funcional' }
  ]} 
/>

## Próximos Passos

1. **Implementação em campo**: Aplicar a solução em todas as placas RMC
2. **Monitoramento preventivo**: Estabelecer processo de QA
3. **Otimização IoT**: Reduzir consultas para prevenir degradação
4. **Padronização**: Garantir uso exclusivo do firmware V1.01 em produção
