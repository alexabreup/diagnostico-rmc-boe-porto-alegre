---
title: "Problema: [PROBLEM_NAME]"
description: "Identificação e análise do problema [PROBLEM_NAME]"
author: Alexandre de Abreu Pereira
author_email: alexandre.abreu@eletromidia.com.br
department: Hardware - Eletromidia
date: "[YYYY-MM-DD]"
analysis_method: "[METHOD_USED]"
tools_used: 
  - "[TOOL_1]"
  - "[TOOL_2]"
confidence_level: "HIGH"
problem_severity: "[CRITICAL/HIGH/MEDIUM/LOW]"
affected_systems: 
  - "[SYSTEM_1]"
  - "[SYSTEM_2]"
---

# Análise do Problema: [PROBLEM_NAME]

**Data:** [DD/MM/YYYY]  
**Problema:** [DETAILED_PROBLEM_DESCRIPTION]  
**Sistema Afetado:** [AFFECTED_SYSTEM]  
**Severidade:** [SEVERITY_LEVEL]  

---

## 🚨 Descrição do Problema

### Sintomas Observados

import DiagnosticCard from '@site/src/components/DiagnosticCard';

<DiagnosticCard title="Sintoma Principal" status="crítico">
[MAIN_SYMPTOM_DESCRIPTION]

**Frequência:** [FREQUENCY]  
**Impacto:** [IMPACT_DESCRIPTION]
</DiagnosticCard>

<DiagnosticCard title="Sintomas Secundários" status="degradado">
- [SECONDARY_SYMPTOM_1]
- [SECONDARY_SYMPTOM_2]
- [SECONDARY_SYMPTOM_3]
</DiagnosticCard>

### Condições de Reprodução

| Condição | Valor/Estado | Necessário para Reprodução |
|----------|--------------|----------------------------|
| [CONDITION_1] | [VALUE_1] | ✅ Sim |
| [CONDITION_2] | [VALUE_2] | ❌ Não |
| [CONDITION_3] | [VALUE_3] | ⚠️ Opcional |

---

## 🔍 Evidências Técnicas

import EvidenceBlock from '@site/src/components/EvidenceBlock';

### Logs de Erro

<EvidenceBlock title="Log do Sistema" type="log">
[TIMESTAMP] ERROR: [ERROR_MESSAGE_1]
[TIMESTAMP] WARN:  [WARNING_MESSAGE_1]
[TIMESTAMP] ERROR: [ERROR_MESSAGE_2]
[TIMESTAMP] INFO:  [INFO_MESSAGE_1]
</EvidenceBlock>

### Dados de Diagnóstico

<EvidenceBlock title="Saída do Diagnóstico" type="data">
Status: [STATUS_VALUE]
Error_Code: [ERROR_CODE]
Timestamp: [TIMESTAMP]
Component_State: [COMPONENT_STATE]
Memory_Usage: [MEMORY_VALUE]%
CPU_Load: [CPU_VALUE]%
</EvidenceBlock>

### Comandos de Investigação

<EvidenceBlock title="Comandos Utilizados" type="code">
```bash
# Comando para reproduzir o problema
[REPRODUCTION_COMMAND]

# Comando para coletar diagnóstico
[DIAGNOSTIC_COMMAND]

# Resultado obtido
[COMMAND_OUTPUT]
```
</EvidenceBlock>

---

## 📊 Análise de Impacto

import MetricsDisplay from '@site/src/components/MetricsDisplay';

<MetricsDisplay
  title="Métricas de Impacto"
  metrics={[
    { value: '[DOWNTIME]', label: 'Tempo de Inatividade', unit: 'horas', status: 'crítico' },
    { value: '[AFFECTED_UNITS]', label: 'Unidades Afetadas', unit: 'unidades', status: 'crítico' },
    { value: '[FREQUENCY]', label: 'Frequência', unit: 'ocorrências/dia', status: 'degradado' },
    { value: '[RECOVERY_TIME]', label: 'Tempo de Recuperação', unit: 'minutos', status: 'degradado' }
  ]}
/>

### Análise Quantitativa

import TechnicalTable from '@site/src/components/TechnicalTable';

<TechnicalTable
  title="Impacto por Sistema"
  headers={['Sistema', 'Unidades Afetadas', 'Percentual', 'Status']}
  data={[
    ['[SYSTEM_1]', '[COUNT_1]', '[PERCENTAGE_1]%', 'Crítico'],
    ['[SYSTEM_2]', '[COUNT_2]', '[PERCENTAGE_2]%', 'Degradado'],
    ['[SYSTEM_3]', '[COUNT_3]', '[PERCENTAGE_3]%', 'Funcional']
  ]}
  statusColumn={3}
/>

---

## 🔬 Investigação de Causa Raiz

### Hipóteses Investigadas

<DiagnosticCard title="Hipótese 1: [HYPOTHESIS_1]" status="crítico">
**Probabilidade:** [PROBABILITY_1]%  
**Evidências:**
- [EVIDENCE_1_1]
- [EVIDENCE_1_2]

**Teste realizado:** [TEST_DESCRIPTION_1]  
**Resultado:** [TEST_RESULT_1]
</DiagnosticCard>

<DiagnosticCard title="Hipótese 2: [HYPOTHESIS_2]" status="degradado">
**Probabilidade:** [PROBABILITY_2]%  
**Evidências:**
- [EVIDENCE_2_1]
- [EVIDENCE_2_2]

**Teste realizado:** [TEST_DESCRIPTION_2]  
**Resultado:** [TEST_RESULT_2]
</DiagnosticCard>

### Correlações Identificadas

| Variável A | Variável B | Correlação (R²) | Significância (p-value) | Conclusão |
|------------|------------|-----------------|-------------------------|-----------|
| [VAR_A1] | [VAR_B1] | [R2_VALUE_1] | [P_VALUE_1] | [CONCLUSION_1] |
| [VAR_A2] | [VAR_B2] | [R2_VALUE_2] | [P_VALUE_2] | [CONCLUSION_2] |

---

## 🎯 Causa Raiz Identificada

<DiagnosticCard title="Causa Raiz Confirmada" status="crítico">
**[ROOT_CAUSE_TITLE]**

**Descrição:** [ROOT_CAUSE_DESCRIPTION]

**Evidências Definitivas:**
- [DEFINITIVE_EVIDENCE_1]
- [DEFINITIVE_EVIDENCE_2]
- [DEFINITIVE_EVIDENCE_3]

**Confiança:** [CONFIDENCE_LEVEL]% (baseado em [EVIDENCE_COUNT] evidências)
</DiagnosticCard>

### Sequência de Eventos

```
1. [EVENT_1] → [CONSEQUENCE_1]
2. [EVENT_2] → [CONSEQUENCE_2]
3. [EVENT_3] → [CONSEQUENCE_3]
4. [FINAL_EVENT] → [PROBLEM_MANIFESTATION]
```

---

## 💡 Soluções Propostas

### Solução Primária (Recomendada)

<DiagnosticCard title="[SOLUTION_1_TITLE]" status="funcional">
**Descrição:** [SOLUTION_1_DESCRIPTION]

**Passos de Implementação:**
1. [STEP_1_1]
2. [STEP_1_2]
3. [STEP_1_3]

**Tempo Estimado:** [TIME_1]  
**Recursos Necessários:** [RESOURCES_1]  
**Taxa de Sucesso Esperada:** [SUCCESS_RATE_1]%
</DiagnosticCard>

### Soluções Alternativas

<DiagnosticCard title="[SOLUTION_2_TITLE]" status="degradado">
**Descrição:** [SOLUTION_2_DESCRIPTION]

**Vantagens:**
- [ADVANTAGE_2_1]
- [ADVANTAGE_2_2]

**Desvantagens:**
- [DISADVANTAGE_2_1]
- [DISADVANTAGE_2_2]

**Taxa de Sucesso Esperada:** [SUCCESS_RATE_2]%
</DiagnosticCard>

---

## 📋 Plano de Ação

### Fase 1: Implementação Imediata

| Ação | Responsável | Prazo | Status |
|------|-------------|-------|---------|
| [ACTION_1_1] | [RESPONSIBLE_1] | [DEADLINE_1] | 🔄 Pendente |
| [ACTION_1_2] | [RESPONSIBLE_2] | [DEADLINE_2] | 🔄 Pendente |
| [ACTION_1_3] | [RESPONSIBLE_3] | [DEADLINE_3] | 🔄 Pendente |

### Fase 2: Validação

| Ação | Responsável | Prazo | Status |
|------|-------------|-------|---------|
| [ACTION_2_1] | [RESPONSIBLE_1] | [DEADLINE_1] | 🔄 Pendente |
| [ACTION_2_2] | [RESPONSIBLE_2] | [DEADLINE_2] | 🔄 Pendente |

### Fase 3: Prevenção

| Ação | Responsável | Prazo | Status |
|------|-------------|-------|---------|
| [ACTION_3_1] | [RESPONSIBLE_1] | [DEADLINE_1] | 🔄 Pendente |
| [ACTION_3_2] | [RESPONSIBLE_2] | [DEADLINE_2] | 🔄 Pendente |

---

## ⚠️ Riscos e Mitigações

<TechnicalTable
  title="Análise de Riscos"
  headers={['Risco', 'Probabilidade', 'Impacto', 'Mitigação']}
  data={[
    ['[RISK_1]', '[PROB_1]', '[IMPACT_1]', '[MITIGATION_1]'],
    ['[RISK_2]', '[PROB_2]', '[IMPACT_2]', '[MITIGATION_2]'],
    ['[RISK_3]', '[PROB_3]', '[IMPACT_3]', '[MITIGATION_3]']
  ]}
/>

---

## 📈 Critérios de Sucesso

### Métricas de Validação

<MetricsDisplay
  title="KPIs de Resolução"
  metrics={[
    { value: '[TARGET_1]', label: '[METRIC_1]', unit: '[UNIT_1]', status: 'funcional' },
    { value: '[TARGET_2]', label: '[METRIC_2]', unit: '[UNIT_2]', status: 'funcional' },
    { value: '[TARGET_3]', label: '[METRIC_3]', unit: '[UNIT_3]', status: 'funcional' }
  ]}
/>

### Testes de Validação

1. **[TEST_1]:** [TEST_DESCRIPTION_1]
2. **[TEST_2]:** [TEST_DESCRIPTION_2]
3. **[TEST_3]:** [TEST_DESCRIPTION_3]

---

## 📞 Próximos Passos

1. **[NEXT_STEP_1]** - Prazo: [DEADLINE_1]
2. **[NEXT_STEP_2]** - Prazo: [DEADLINE_2]
3. **[NEXT_STEP_3]** - Prazo: [DEADLINE_3]

---

## 📋 Documentos Relacionados

- [RELATED_DOC_1]: [DESCRIPTION_1]
- [RELATED_DOC_2]: [DESCRIPTION_2]
- [RELATED_DOC_3]: [DESCRIPTION_3]

---

**Status:** [STATUS_INDICATOR] **[CURRENT_STATUS]**  
**Prioridade:** [PRIORITY_INDICATOR] **[PRIORITY_LEVEL]**

---

*Análise de problema realizada por Alexandre de Abreu Pereira - Departamento de Hardware - Eletromidia*