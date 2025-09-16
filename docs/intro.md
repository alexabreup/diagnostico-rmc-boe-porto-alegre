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
baseadas no microcontrolador **GD32F307VCT6**. O objetivo principal foi identificar e resolver
problemas relacionados ao sistema de schedule de brilho PWM que afetavam o controle das telas LCD.

## Contexto Operacional

A **Eletromidia**, empresa especializada em mídia externa digital, opera uma extensa rede de mobiliários urbanos digitais (MUBs) equipados com telões de display LCD na cidade de Porto Alegre, RS. Estes equipamentos utilizam placas RMC (Remote Media Controller) baseadas no microcontrolador **GD32F307VCT6** para controle de brilho adaptativo, garantindo visibilidade otimizada e economia energética através de ajustes automáticos de PWM conforme horário e luminosidade ambiente.

## Problema Relatado

Em agosto de 2025, o líder operacional do departamento de operações de Porto Alegre, **Fernando Ceccato**, reportou falhas sistemáticas no programa de controle de schedule de brilho dos mobiliários urbanos digitais da cidade. Os sintomas identificados incluíam:

- **Perda de controle de PWM**: Telas permanecendo com brilho fixo em 0% (apagadas)
- **Schedule não funcional**: Horários de programação zerados (00:00)
- **Ausência de resposta**: MCUs não registrando comandos de configuração

## Processo de Diagnóstico Inicial

### Treinamento Remoto
Nossa equipe de São Paulo implementou inicialmente uma abordagem de suporte remoto, utilizando o **Treinamento do Departamento de Projetos** disponível em https://intercomelt.netlify.app/ para capacitar a equipe local de Porto Alegre. Durante as sessões remotas foram demonstrados:

- Procedimentos de atualização de firmware
- Instalação de scripts de controle de brilho
- Configuração de agendamentos (schedules)
- Protocolos de diagnóstico básico

### Confirmação do Problema
Mesmo após o treinamento especializado e implementação dos procedimentos corretos, a equipe de Porto Alegre confirmou a **ineficiência persistente** dos MCUs das placas RMC, evidenciando que o problema não estava relacionado a procedimentos operacionais, mas sim a questões técnicas de firmware.

import TechnicalTable from '@site/src/components/TechnicalTable';
import DiagnosticCard from '@site/src/components/DiagnosticCard';
import MetricsDisplay from '@site/src/components/MetricsDisplay';

## Contexto Técnico

### Hardware Analisado

![Microcontrolador ARM STM32](/img/arm-stm32.png)

<TechnicalTable 
  title="Especificações do Hardware" 
  headers={['Componente', 'Especificação', 'Status']} 
  data={[
    ['Microcontrolador', 'GD32F307VCT6 (ARM Cortex-M4)', 'funcional'],
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
- Horários zerados (00:00) na configuração
</DiagnosticCard>

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
- Schedule PWM não funcional
</DiagnosticCard>

### Solução Validada

<DiagnosticCard title="Solução Comprovada" status="funcional">
Atualização para firmware **ZGS126_Upgrade.bin V1.01** resolve 100% dos casos identificados.
</DiagnosticCard>

## Estrutura da Documentação

Esta documentação está organizada para fornecer:

### Diagnósticos Individuais

Análise detalhada de cada uma das três placas recebidas de Porto Alegre, incluindo:

- Estado do firmware e configurações de rede
- Funcionalidade do schedule PWM
- Informações de hardware
- Análise de firmware

### Análise Comparativa

Estudo comparativo entre firmwares desatualizados, atualizados e versão BOE padrão, identificando padrões de degradação e validando soluções.

### Diagnósticos Específicos

Análises focadas em problemas específicos, como controle de múltiplas telas LCD.

### Procedimentos Técnicos

Protocolos passo-a-passo para correção e reprogramação das placas, aplicáveis pela equipe de campo.

### Relatórios Executivos

Resumos executivos com conclusões, recomendações e planos de ação.

### Recomendações Operacionais

Diretrizes para implementação da solução em toda a rede de Porto Alegre e prevenção de recorrências.



## Relevância Estratégica

A resolução deste problema técnico impacta diretamente:
- **Qualidade de exibição** dos conteúdos publicitários
- **Eficiência energética** da rede de equipamentos
- **Satisfação do cliente** com a performance dos MUBs
- **Redução de chamados técnicos** e custos operacionais

Este relatório documenta não apenas a solução técnica identificada, mas estabelece as bases para um protocolo preventivo que garanta a confiabilidade operacional da rede Eletromidia em Porto Alegre e demais praças.

## Próximos Passos

1. **Implementação em campo**: Aplicar a solução em todas as placas RMC
2. **Monitoramento preventivo**: Estabelecer processo de QA
3. **Otimização IoT**: Reduzir consultas para prevenir degradação
4. **Padronização**: Garantir uso exclusivo do firmware V1.01 em produção
