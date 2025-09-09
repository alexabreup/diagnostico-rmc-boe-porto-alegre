---
title: Introdução Alternativa
author: Alexandre de Abreu Pereira
author_email: alexandre.pereira@eletromidia.com.br
department: Hardware Department - Eletromidia
date: 2025-01-09
sidebar_position: 2
---

# Introdução

## Contexto Operacional

A **Eletromidia**, empresa especializada em mídia externa digital, opera uma extensa rede de mobiliários urbanos digitais (MUBs) equipados com telões de display LCD na cidade de Porto Alegre, RS. Estes equipamentos utilizam placas RMC (Remote Media Controller) baseadas no microcontrolador **GD32F307VET6** para controle de brilho adaptativo, garantindo visibilidade otimizada e economia energética através de ajustes automáticos de PWM conforme horário e luminosidade ambiente.

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

## Objetivo desta Análise

Este documento registra a análise técnica abrangente de **três placas RMC** enviadas pela equipe de Porto Alegre para diagnóstico em laboratório. O estudo visa:

1. **Identificar a causa raiz** das falhas no sistema de schedule de brilho
2. **Comparar versões de firmware** instaladas vs. versões atualizadas vs. última versão BOE validada
3. **Validar soluções técnicas** através de testes controlados
4. **Estabelecer protocolo** de correção para implementação em campo

## Metodologia de Análise

### Hardware Sob Análise
- **Microcontrolador**: GD32F307VET6 (ARM Cortex-M4)
- **Aplicação**: Controle de brilho de telas LCD via PWM adaptativo
- **Origem**: Mobiliários urbanos digitais de Porto Alegre, RS

### Ferramentas Técnicas Utilizadas
- **ST-LINK V2**: Programador/debugger para extração e gravação de firmware
- **st-flash**: Ferramenta de linha de comando para programação
- **Interface_RMC_V6_2.exe**: Interface de configuração e diagnóstico
- **Análise comparativa**: Checksums, strings e funcionalidades de firmware

## Estrutura do Relatório

Esta documentação está organizada para fornecer:

### **Diagnósticos Individuais**
Análise detalhada de cada uma das três placas recebidas, incluindo estado do firmware, configurações de rede e funcionalidade do schedule PWM.

### **Análise Comparativa**
Estudo comparativo entre firmwares desatualizados, atualizados e versão BOE padrão, identificando padrões de degradação e validando soluções.

### **Procedimentos Técnicos**
Protocolos passo-a-passo para correção e reprogramação das placas, aplicáveis pela equipe de campo.

### **Recomendações Operacionais**
Diretrizes para implementação da solução em toda a rede de Porto Alegre e prevenção de recorrências.

## Relevância Estratégica

A resolução deste problema técnico impacta diretamente:
- **Qualidade de exibição** dos conteúdos publicitários
- **Eficiência energética** da rede de equipamentos
- **Satisfação do cliente** com a performance dos MUBs
- **Redução de chamados técnicos** e custos operacionais

Este relatório documenta não apenas a solução técnica identificada, mas estabelece as bases para um protocolo preventivo que garanta a confiabilidade operacional da rede Eletromidia em Porto Alegre e demais praças.