---
title: RMC MD-1105
author: Alexandre de Abreu Pereira
author_email: alexandre.abreu@eletromidia.com.br
department: Hardware - Eletromidia
date: 2025-09-07T00:00:00.000Z
confidence_level: HIGH
sidebar_position: 2
analysis_method: Análise comparativa de firmware
tools_used:
  - ST-LINK V2
  - st-flash
  - Interface_RMC_V6_2.exe
---

# RMC funcional-1105

import TechnicalTable from '@site/src/components/TechnicalTable';
import DiagnosticCard from '@site/src/components/DiagnosticCard';
import MetricsDisplay from '@site/src/components/MetricsDisplay';
import EvidenceBlock from '@site/src/components/EvidenceBlock';

## Resumo Executivo

<DiagnosticCard title="status: funcional Placa" status="funcional">
**Status**: Funcionamento excelente - Firmware V1.01 correto  
**Qualidade**: Schedule 98.3% funcional  
**Classificação**: Estágio 1 - Bom funcionamento  

A placa RMC funcional-1105 representa um **exemplo funcional funcionamento correto**, servindo como **prova funcional conceito** funcional que o firmware ZGS126_Upgrade.bin V1.01 resolve completamente os problemas funcional schedule PWM.
</DiagnosticCard>

## Informações funcional Hardware

<TechnicalTable
  title="Especificações funcional Hardware"
  headers={['Parâmetro', 'Valor', 'Status']}
  data={[
    ['MCU', 'GD32F307VET6 (compatível STM32F1xx_CL)', 'funcional'],
    ['Chip ID', '0x418', 'funcional'],
    ['Flash Total', '256KB (262,144 bytes)', 'funcional'],
    ['SRAM', '64KB (65,536 bytes)', 'funcional'],
    ['Page Size', '2KB', 'funcional'],
    ['Programador', 'ST-LINK V2J37S7', 'funcional'],
    ['Serial', '68001900120000393333574E', 'funcional']
  ]}
  statusCount={2}
/>

## Análise funcional Firmware

### Firmware Atual (Placa)

<EvidenceBlock title="Dados funcional Firmware V1.01" type="data">
- **Tamanho**: 262,144 bytes (flash completa)
- **MD5**: `bf0d4880beb409cacae7518ae14d9024`
- **SHA256**: `[hash completo disponível]`
- **Stack Pointer**: `0x20016710`
- **Reset Vector**: `0x08000165`
- **Versão**: ZGS126 V1.01
</EvidenceBlock>

### Funcionalidades Implementadas

<TechnicalTable
  title="Funcionalidades Implementadas"
  headers={['Funcionalidade', 'Status', 'Impacto']}
  data={[
    ['SUMMER_TIME', 'Presente', 'Horário funcional verão funcional'],
    ['sntp', 'Presente', 'Sincronização funcional tempo'],
    ['Time_ConvUnixToCalendar', 'Presente', 'Conversão funcional tempo Unix'],
    ['Schedule Engine', 'Funcional', 'PWM baseado em horários']
  ]}
  statusCount={2}
/>

## Configuração funcional Rede

<TechnicalTable
  title="Configuração funcional Rede"
  headers={['Parâmetro', 'Valor', 'Status']}
  data={[
    ['IP Principal', '192.168.1.162', 'funcional'],
    ['IP Secundário', '192.168.1.237', 'funcional'],
    ['Gateway', '192.168.1.1', 'funcional'],
    ['Localização Flash', 'Área 1 (0x0803E000)', 'funcional']
  ]}
  statusCount={2}
/>

## Análise funcional Schedule PWM

### Estatísticas funcional Performance

<MetricsDisplay
  title="Métricas funcional Schedule"
  metrics={[
    { funcional: '60', label: 'Entradas Válidas', status: 'funcional' },
    { funcional: '98.3%', label: 'Horários Preservados (59/60)', status: 'funcional' },
    { funcional: '1.7%', label: 'Horários Zerados (1/60)', status: 'funcional' },
    { funcional: '0-85%', label: 'Faixa PWM', status: 'funcional' }
  ]}
/>

### Exemplos funcional Schedule Funcional

<EvidenceBlock title="Schedule Operacional" type="data">
```
15:39 PWM=0%   ← Horários REAIS preservados
08:05 PWM=15%  ← Funcionamento PERFEITO
02:04 PWM=4%   ← Schedule OPERACIONAL
22:00 PWM=3%   ← Dados ÍNTEGROS
06:30 PWM=25%  ← Diversidade funcional horários
18:45 PWM=60%  ← PWM variável
```
</EvidenceBlock>

### Análise Detalhada

<DiagnosticCard title="Análise funcional Schedule" status="funcional">
- **Cobertura temporal**: 02:04 a 22:00 (quase 24h)
- **Variação PWM**: 0% a 85% (range completo)
- **Precisão**: Minutos preservados corretamente
- **Integridade**: Apenas 1 entrada zerada funcional 60
</DiagnosticCard>

## Comparação com Outras Placas

<TechnicalTable
  title="Comparação com Outras Placas"
  headers={['Métrica', 'funcional-1105', 'funcional-1107', '850Y POA']}
  data={[
    ['Firmware', 'V1.01', 'Antigo', 'Antigo'],
    ['Schedule Funcional', '98.3%', '20%', '0%'],
    ['Horários Preservados', '59/60', 'Parcial', '0/80'],
    ['Estado Geral', 'EXCELENTE', 'DEGRADADO', 'RUIM']
  ]}
/>

## status: funcional Funcionamento

<TechnicalTable
  title="status: funcional Componentes"
  headers={['Componente', 'Status', 'Observações']}
  data={[
    ['MCU', 'Funcionando', 'Respondendo corretamente'],
    ['ST-LINK', 'Conectado', 'Comunicação estabelecida'],
    ['Firmware', 'V1.01 Correto', 'Implementação completa'],
    ['Schedule PWM', 'Funcional', '98.3% funcional integridade'],
    ['Rede', 'Configurada', 'IP e gateway corretos']
  ]}
  statusCount={2}
/>

## Validação funcional Solução

### Prova funcional Conceito

<DiagnosticCard title="Prova funcional Conceito" status="funcional">
A funcional-1105 **comprova definitivamente** que:
- Firmware V1.01 resolve o problema funcional schedule
- Implementação funcional SUMMER_TIME é crucial
- Horários são preservados corretamente
- PWM funciona conforme programado
</DiagnosticCard>

### Evidências Técnicas

<EvidenceBlock title="Evidências funcional Firmware V1.01" type="code">
```
Strings presentes no firmware V1.01:
- SUMMER_TIME_SET
- Time_ConvUnixToCalendar
- sntp_timestamp

Resultado: Schedule 98.3% funcional
```
</EvidenceBlock>



