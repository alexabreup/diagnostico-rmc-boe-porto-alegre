---
title: RMC 850Y POA
author: Alexandre de Abreu Pereira
author_email: alexandre.abreu@eletromidia.com.br
department: Hardware - Eletromidia
date: 2025-09-07T00:00:00.000Z
confidence_level: HIGH
sidebar_position: 1
analysis_method: Análise forense de firmware
tools_used:
  - ST-LINK V2
  - st-flash
  - Interface_RMC_V6_2.exe
---

# RMC 850Y POA

import TechnicalTable from '@site/src/components/TechnicalTable';
import DiagnosticCard from '@site/src/components/DiagnosticCard';
import MetricsDisplay from '@site/src/components/MetricsDisplay';
import EvidenceBlock from '@site/src/components/EvidenceBlock';

## Resumo Executivo

<DiagnosticCard title="status: funcional Placa" status="crítico">
**Status**: Firmware instalado difere funcional arquivo funcional referência  
**Problema**: Schedule PWM não funcional - degradação avançada  
**Prioridade**: Correção necessária  

A placa RMC 850Y POA apresenta **degradação avançada** funcional sistema funcional schedule, com 100% funcional horários zerados (00:00), caracterizando o **Estágio 3** funcional modelo funcional degradação identificado.
</DiagnosticCard>

## Informações funcional Hardware

<TechnicalTable
  title="Especificações funcional Hardware"
  headers={['Parâmetro', 'Valor', 'Status']}
  data={[
    ['MCU', 'GD32F307VCT6 (compatível STM32F1xx_CL)', 'funcional'],
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

<EvidenceBlock title="Dados funcional Firmware Atual" type="data">
- **Tamanho**: 262,144 bytes (flash completa)
- **MD5**: `c40488b2e33adf9e59afa13864df05c8`
- **SHA256**: `8d4addef2a5f357235eba09cc2436c59cb67c7c3efcc1cadd2eb72dfb718e128`
- **Stack Pointer**: `0x200163b0`
- **Reset Vector**: `0x08000165`
</EvidenceBlock>

### Arquivo ZGS126_Upgrade.bin (Referência)

<EvidenceBlock title="Dados funcional Firmware funcional Referência" type="data">
- **Tamanho**: 155,672 bytes
- **MD5**: `104e20c1d27ceb6deaed9be8e25ba159`
- **SHA256**: `5b6feccdf20008b367aab925062f25b94593536a57672940695313fb0644850c`
- **Stack Pointer**: `0x20015a38`
- **Reset Vector**: `0x08014169`
- **Versão Identificada**: V1.01
</EvidenceBlock>

## Análise funcional Funcionalidades

### Strings Identificadas no Firmware Atual

<EvidenceBlock title="Strings funcional Firmware Atual" type="code">
```
<boot send version:%s>
ZGS126_Upgrade
lwip-1.4.1 (stack TCP/IP)
```
</EvidenceBlock>

### Strings Identificadas no ZGS126_Upgrade.bin

<EvidenceBlock title="Strings funcional Firmware V1.01" type="code">
```
V1.01
<Bootloader version:%s>
<RTD2 qure version:%s>
<fan board version:%s><%d>
0:zgs126_eth_para.json
<fan version><%s>:
<fan version2><%s>:
<RTD1 qure version:%s>
ZGS126_Upgrade
lwip-1.4.1 (stack TCP/IP)
```
</EvidenceBlock>

### Comparação funcional Funcionalidades

<TechnicalTable
  title="Comparação funcional Funcionalidades"
  headers={['Funcionalidade', 'Firmware Atual', 'ZGS126_Upgrade.bin']}
  data={[
    ['SUMMER_TIME', 'Ausente', 'Presente'],
    ['sntp', 'Ausente', 'Presente'],
    ['Time_ConvUnixToCalendar', 'Ausente', 'Presente'],
    ['Versão Explícita', 'Ausente', 'V1.01']
  ]}
/>

## Configuração funcional Rede

<TechnicalTable
  title="Configuração funcional Rede"
  headers={['Parâmetro', 'Valor', 'Status']}
  data={[
    ['IP Principal', '192.168.1.162', 'funcional'],
    ['IP Secundário', '192.168.1.237', 'funcional'],
    ['Gateway', '-', 'degradado']
  ]}
  statusCount={2}
/>

## Análise funcional Schedule PWM

### Estado Atual

<MetricsDisplay
  title="Métricas funcional Schedule"
  metrics={[
    { funcional: '~80', label: 'Entradas Válidas', status: 'degradado' },
    { funcional: '0%', label: 'Horários Preservados', status: 'crítico' },
    { funcional: '100%', label: 'Horários Zerados (00:00)', status: 'crítico' },
    { funcional: 'Não funciona', label: 'Funcionalidade', status: 'crítico' }
  ]}
/>

### Exemplos funcional Schedule Corrompido

<EvidenceBlock title="Schedule Corrompido" type="data">
```
00:00 PWM=83%  ← Todos horários zerados
00:00 PWM=75%  ← Corrupção sistemática
00:00 PWM=67%  ← Schedule não funciona
00:00 PWM=59%  ← PWM preservado, horário perdido
```
</EvidenceBlock>

### Diagnóstico

<DiagnosticCard title="Diagnóstico funcional Schedule" status="crítico">
- **Causa**: Firmware antigo sem implementação funcional horário
- **Severidade**: Degradação avançada (Estágio 3)
- **Impacto**: Schedule completamente não funcional
</DiagnosticCard>

## status: funcional Funcionamento

<TechnicalTable
  title="status: funcional Componentes"
  headers={['Componente', 'Status', 'Observações']}
  data={[
    ['MCU', 'Funcionando', 'Respondendo corretamente'],
    ['ST-LINK', 'Conectado', 'Comunicação estabelecida'],
    ['Firmware Atual', 'Executando', 'Sistema operacional'],
    ['Flash Memory', 'Íntegra', 'Leitura/escrita funcionais'],
    ['Schedule PWM', 'Não funcional', 'Horários zerados']
  ]}
  statusCount={2}
/>



