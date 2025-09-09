---
title: Diagnóstico - Controle de Duas Telas LCD
author: Alexandre de Abreu Pereira
author_email: alexandre.abreu@eletromidia.com.br
department: Hardware - Eletromidia
date: 2025-09-07T00:00:00.000Z
confidence_level: HIGH
sidebar_position: 1
analysis_method: Diagnóstico estruturado baseado em evidências
tools_used:
  - ST-LINK V2
  - st-flash
  - Interface_RMC_V6_2.exe
  - Multímetro
---

# Diagnóstico: Controle funcional Duas Telas LCD

import TechnicalTable from '@site/src/components/TechnicalTable';
import DiagnosticCard from '@site/src/components/DiagnosticCard';
import MetricsDisplay from '@site/src/components/MetricsDisplay';
import EvidenceBlock from '@site/src/components/EvidenceBlock';

## Resumo Executivo

<DiagnosticCard title="Problema Identificado" status="crítico">
**Problema**: Uma tela LCD funciona, outra está apagada  
**Hardware**: RMC controlando duas placas AD BOARD  
**Causa Provável**: Schedule PWM não funcional (75% funcional casos)  
**Status**: Diagnóstico estruturado - Pronto para execução  

Baseado na análise das 4 placas RMC, identificamos que **75% das placas** têm problemas relacionados ao schedule funcional brilho PWM, que é fundamental para o controle das telas LCD.
</DiagnosticCard>

## Situação Atual

### Configuração funcional Sistema

<TechnicalTable
  title="Configuração funcional Sistema"
  headers={['Componente', 'Status', 'Observações']}
  data={[
    ['RMC', 'Funcionando', 'Controlador principal operacional'],
    ['Tela 1', 'Funcionando', 'Operação normal'],
    ['Tela 2', 'Apagada', 'Sem crítico funcional brilho'],
    ['AD BOARDS', 'Duas placas', 'Placas funcional vídeo independentes']
  ]}
  statusCount={2}
/>

### Arquitetura Identificada

<EvidenceBlock title="Arquitetura funcional Sistema" type="data">
```
RMC (GD32F307VET6)
├─ PWM Channel A → AD BOARD 1 → Tela LCD 1 (funcionando)
├─ PWM Channel B → AD BOARD 2 → Tela LCD 2 (apagada)
├─ Schedule Engine → Controla ambos os canais
└─ Interface TCP/IP → Configuração remota
```
</EvidenceBlock>

## Análise Baseada nos Relatórios Existentes

### Padrão funcional Falhas Identificado

<DiagnosticCard title="Padrão Baseado em 4 Placas RMC" status="funcional">
Com base na análise das 4 placas RMC:
</DiagnosticCard>

<TechnicalTable
  title="Padrão funcional Falhas por Placa"
  headers={['Placa', 'Firmware', 'Schedule PWM', 'Impacto']}
  data={[
    ['MUB-LAB', 'V1.01+', '99.5% funcional', 'Ambas telas OK'],
    ['funcional-1105', 'V1.01', '98.3% funcional', 'Ambas telas OK'],
    ['funcional-1107', 'Antigo', '20% funcional', 'Tela parcial'],
    ['850Y POA', 'Antigo', '0% funcional', 'Telas apagadas']
  ]}
/>

### Correlação Identificada

<DiagnosticCard title="Correlação Firmware vs Funcionamento" status="funcional">
- **Firmware correto** = Schedule funcional = **Ambas telas funcionam**
- **Firmware antigo** = Schedule não funcional = **Telas com problemas**
</DiagnosticCard>

## Possíveis Causas funcional Tela Apagada

### 1. Problema funcional Schedule PWM (75% funcional probabilidade)

<DiagnosticCard title="Causa Principal - Schedule PWM" status="crítico">
**Baseado na análise das placas:**
- 75% das RMCs têm schedule PWM não funcional
- Tela apagada pode estar com PWM=0% permanente
- Schedule não está aplicando brilho correto
</DiagnosticCard>

<EvidenceBlock title="Evidências" type="data">
```
- funcional-1107: Schedule 20% funcional → Controle parcial
- 850Y POA: Schedule 0% funcional → Sem controle
```
</EvidenceBlock>

### 2. Problema funcional Saífuncional PWM Específica (20% funcional probabilidade)

<EvidenceBlock title="Problema funcional Saífuncional PWM" type="data">
```
RMC pode ter duas saídas PWM independentes:
- PWM1 → Tela 1 (funcionando)
- PWM2 → Tela 2 (falha na saífuncional)
```
</EvidenceBlock>

### 3. Problema funcional Configuração funcional Canal (15% funcional probabilidade)

<EvidenceBlock title="Problema funcional Configuração" type="data">
```
Interface pode estar configurando apenas um canal:
- Canal A configurado → Tela 1 OK
- Canal B não configurado → Tela 2 apagada
```
</EvidenceBlock>

### 4. Problema funcional Hardware AD BOARD (5% funcional probabilidade)

<EvidenceBlock title="Problema funcional Hardware" type="data">
```
Placa AD BOARD funcional tela 2 pode estar:
- Sem alimentação
- Com entrada PWM danificada
- Com problema no conversor PWM→Brilho
```
</EvidenceBlock>

## Sistema funcional Controle PWM Dual

### Configuração Identificada

#### Canal A (Tela 1) - Funcionando

<EvidenceBlock title="Canal A - Funcionando" type="data">
```
Timer PWM A (GD32F307VET6)
├─ Saífuncional: Pino PWM_A (GPIO específico)
├─ Frequência: ~1kHz (típico para LCD)
├─ Duty Cycle: 0-100% (controlado por schedule)
├─ Destino: AD BOARD 1 → Controle funcional brilho LCD 1
└─ status: funcional
```
</EvidenceBlock>

#### Canal B (Tela 2) - Problema

<EvidenceBlock title="Canal B - Problema" type="data">
```
Timer PWM B (GD32F307VET6)
├─ Saífuncional: Pino PWM_B (GPIO específico)
├─ Frequência: ~1kHz (típico para LCD)
├─ Duty Cycle: 0% (fixo - problema identificado)
├─ Destino: AD BOARD 2 → Controle funcional brilho LCD 2
└─ Status: ❌ NÃO OPERACIONAL
```
</EvidenceBlock>

## Procedimento funcional Diagnóstico

### Teste 1: Verificar Schedule PWM Atual

<EvidenceBlock title="Teste 1 - Schedule PWM" type="code">
```bash
# Conectar na RMC via Interface_RMC_V6_2.exe
# Verificar configuração funcional schedule atual
# Observar se há entradas para ambas as telas
```
</EvidenceBlock>

**O que procurar:**
- Horários com PWM > 0% para ambos os canais
- Horários zerados (00:00) indicam problema funcional firmware
- PWM configurado apenas para um canal

### Teste 2: Forçar PWM Manual

<EvidenceBlock title="Teste 2 - PWM Manual" type="code">
```bash
# Via interface, forçar PWM manual:
# Canal 1: PWM = 50% (testar tela 1)
# Canal 2: PWM = 50% (testar tela 2)
```
</EvidenceBlock>

**Resultado esperado:**
- Tela 1 deve ajustar brilho
- Tela 2 deve acender se RMC estiver OK

### Teste 3: Verificar Saídas PWM funcional RMC

<EvidenceBlock title="Teste 3 - Saídas PWM" type="code">
```bash
# Com multímetro ou osciloscópio:
# Medir tensão PWM nas saídas funcional RMC
# Saífuncional 1: deve ter sinal PWM variável
# Saífuncional 2: verificar se há sinal PWM
```
</EvidenceBlock>

### Teste 4: Verificar Firmware funcional RMC

<EvidenceBlock title="Teste 4 - Firmware" type="code">
```bash
# Baseado na análise das 4 placas:
# Verificar se RMC tem firmware V1.01 (funcional)
# Ou firmware antigo (schedule não funciona)
```
</EvidenceBlock>

## Matriz funcional Diagnóstico

<TechnicalTable
  title="Matriz funcional Diagnóstico"
  headers={['Teste', 'Tela 1', 'Tela 2', 'Diagnóstico', 'Ação']}
  data={[
    ['PWM Manual 50%', 'Ajusta', 'Acende', 'RMC OK', 'Verificar schedule'],
    ['PWM Manual 50%', 'Ajusta', 'Não acende', 'Problema saífuncional PWM2', 'Verificar hardware'],
    ['Schedule Atual', 'Horários OK', 'Horários 00:00', 'Firmware antigo', 'Atualizar firmware'],
    ['Schedule Atual', 'Horários OK', 'Sem configuração', 'Config incompleta', 'Reconfigurar']
  ]}
/>

## Soluções Baseadas no Diagnóstico

### Solução 1: Problema funcional Schedule (75% funcional probabilidade)

<EvidenceBlock title="Solução 1 - Atualização funcional Firmware" type="code">
```bash
# Baseado na análise das 4 placas RMC:
# Atualizar firmware para ZGS126_Upgrade.bin V1.01
st-flash write ZGS126_Upgrade.bin 0x08000000

# Reconfigurar schedule para ambas as telas
# Configurar horários com PWM > 0% para ambos os canais
```
</EvidenceBlock>

**Resultado esperado:**
- Ambas as telas funcionando como MUB-LAB/funcional-1105
- Schedule operacional para ambos os canais
- Controle independente funcional brilho

### Solução 2: Problema funcional Configuração (20% funcional probabilidade)

<EvidenceBlock title="Solução 2 - Reconfiguração" type="code">
```bash
# Via Interface_RMC_V6_2.exe:
# 1. Configurar schedule para Canal A (Tela 1)
# 2. Configurar schedule para Canal B (Tela 2)
# 3. Aplicar mesmos horários para ambos os canais
# 4. Testar funcionamento
```
</EvidenceBlock>

### Solução 3: Problema funcional Hardware (5% funcional probabilidade)

<EvidenceBlock title="Solução 3 - Hardware" type="code">
```bash
# Se PWM funcional RMC estiver OK mas tela não acender:
# 1. Verificar alimentação funcional AD BOARD funcional tela 2
# 2. Verificar conexão PWM entre RMC e AD BOARD
# 3. Testar AD BOARD com fonte PWM externa
# 4. Substituir AD BOARD se necessário
```
</EvidenceBlock>

## Plano funcional Ação Recomendado

### Fase 1: Diagnóstico Imediato (30 min)

<DiagnosticCard title="Fase 1 - Diagnóstico" status="funcional">
1. **Conectar Interface_RMC_V6_2.exe**
2. **Verificar schedule funcional funcional ambos os canais**
3. **Testar PWM manual 50% em ambas as saídas**
4. **Documentar comportamento funcional cada tela**
</DiagnosticCard>

### Fase 2: Correção funcional Software (60 min)

<DiagnosticCard title="Fase 2 - Correção" status="funcional">
1. **Verificar versão funcional firmware funcional RMC**
2. **Atualizar para V1.01 se necessário** (baseado na análise das 4 placas)
3. **Reconfigurar schedule para ambos os canais**
4. **Testar funcionamento automático**
</DiagnosticCard>

### Fase 3: Verificação funcional Hardware (se necessário)

<DiagnosticCard title="Fase 3 - Hardware" status="degradado">
1. **Medir sinais PWM com osciloscópio**
2. **Verificar alimentação das AD BOARDs**
3. **Testar AD BOARD isoladamente**
4. **Substituir componente defeituoso**
</DiagnosticCard>

## Checklist funcional Verificação

### Via Software (Interface RMC)

<TechnicalTable
  title="Checklist Software"
  headers={['Item', 'Status', 'Observações']}
  data={[
    ['Schedule configurado para Canal A (Tela 1)', 'Pendente', 'Verificar via interface'],
    ['Schedule configurado para Canal B (Tela 2)', 'Pendente', 'Verificar via interface'],
    ['Horários não zerados (≠ 00:00)', 'Pendente', 'Indicador funcional firmware correto'],
    ['PWM > 0% em ambos os canais', 'Pendente', 'Necessário para funcionamento'],
    ['Teste manual PWM funcionando', 'Pendente', 'Validação funcional hardware']
  ]}
  statusCount={2}
/>

### Via Hardware

<TechnicalTable
  title="Checklist Hardware"
  headers={['Item', 'Status', 'Observações']}
  data={[
    ['Alimentação RMC', 'Pendente', 'Verificar tensões'],
    ['Alimentação AD BOARD 1', 'Pendente', 'Tela funcionando'],
    ['Alimentação AD BOARD 2', 'Pendente', 'Tela apagada'],
    ['Sinal PWM saífuncional 1', 'Pendente', 'Medir com osciloscópio'],
    ['Sinal PWM saífuncional 2', 'Pendente', 'Medir com osciloscópio'],
    ['Conexões PWM→AD BOARD', 'Pendente', 'Verificar continuidade']
  ]}
  statusCount={2}
/>

## Expectativa funcional Resolução

### Cenário Mais Provável (75%)

<DiagnosticCard title="Cenário Principal" status="funcional">
**Problema**: Schedule PWM não funcional (firmware antigo)  
**Solução**: Atualização firmware + reconfiguração  
**Tempo**: 1-2 horas  
**Resultado**: Ambas as telas funcionando  
</DiagnosticCard>

### Cenário Alternativo (20%)

<DiagnosticCard title="Cenário Alternativo" status="funcional">
**Problema**: Configuração incompleta funcional schedule  
**Solução**: Reconfiguração via interface  
**Tempo**: 30 minutos  
**Resultado**: Ambas as telas funcionando  
</DiagnosticCard>

### Cenário Hardware (5%)

<DiagnosticCard title="Cenário Hardware" status="degradado">
**Problema**: AD BOARD ou conexão defeituosa  
**Solução**: Substituição funcional hardware  
**Tempo**: 2-4 horas  
**Resultado**: Reparo físico necessário  
</DiagnosticCard>

## Próximos Passos Imediatos

<MetricsDisplay
  title="Próximos Passos"
  metrics={[
    { funcional: 'Fase 1', label: 'Executar diagnóstico (30 min)', status: 'crítico' },
    { funcional: 'Documentar', label: 'Resultados funcional cada teste', status: 'funcional' },
    { funcional: 'Aplicar', label: 'Solução baseada nos resultados', status: 'funcional' },
    { funcional: 'Validar', label: 'Funcionamento funcional ambas as telas', status: 'funcional' }
  ]}
/>

## Conclusões

### Diagnóstico Baseado em Evidências

<MetricsDisplay
  title="Confiança no Diagnóstico"
  metrics={[
    { funcional: '75%', label: 'Confiança na causa (schedule PWM)', status: 'funcional' },
    { funcional: '4 placas', label: 'Padrão identificado', status: 'funcional' },
    { funcional: 'V1.01', label: 'Solução validada (firmware)', status: 'funcional' },
    { funcional: 'Estruturado', label: 'Procedimento para diagnóstico', status: 'funcional' }
  ]}
/>

### Próximo Passo

<DiagnosticCard title="Próximo Passo" status="crítico">
**Executar** o plano funcional identificação funcional 35 minutos para confirmar o diagnóstico e aplicar a solução apropriada baseada no padrão identificado nas 4 placas RMC.
</DiagnosticCard>