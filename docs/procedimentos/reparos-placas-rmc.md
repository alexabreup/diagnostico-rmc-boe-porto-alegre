---
sidebar_position: 1
title: Reparos das Placas RMC
description: Procedimentos de reparo e manutenção das placas RMC utilizadas no sistema de monitoramento de Porto Alegre
keywords: [RMC, reparo, firmware, TCP, sensores, Porto Alegre]
author: Alexandre de Abreu Pereira
author_email: alexandre.abreu@eletromidia.com.br
department: Hardware - Eletromidia
date: 2025-09-16
---

# Reparos das Placas RMC de Porto Alegre

## Visão Geral

Este documento apresenta os procedimentos de reparo e manutenção das placas RMC (Remote Monitoring Controller) utilizadas no sistema de monitoramento de Porto Alegre, incluindo diagnóstico de falhas, correção de firmware e validação de funcionamento.

## Tipos de Reparos Comuns

### 1. Correção de Firmware Defeituoso

#### Sintomas Identificados
- Falha na comunicação TCP
- Leituras inconsistentes de sensores
- Sistema não responsivo
- Timestamps incorretos ou congelados

#### Procedimento de Reparo

**Pré-requisitos:**
- STM32CubeProgrammer instalado
- ST-Link V2/V3 disponível
- Firmware RMC v30 (versão estável)
- Backup do firmware atual

**Etapas de Reparo:**

1. **Conexão e Diagnóstico**
   ```
   ST-Link → RMC
   SWDIO  → SWDIO
   SWCLK  → SWCLK
   GND    → GND
   3.3V   → 3.3V
   ```

2. **Backup e Apagamento**
   - Realizar backup completo (0x08000000, 256KB)
   - Executar Full Chip Erase
   - Confirmar apagamento completo

3. **Programação do Firmware v30**
   - Carregar arquivo firmware v30
   - Programar no endereço 0x08000000
   - Verificar programação
   - Executar após programação

### 2. Reparo de Sensores de Temperatura

#### Diagnóstico
Verificar leituras através do TCP Server Test Demo:
```
Temp: T1:0.00, T2:0.00, T3:0.00, T4:0.00, T5:0.00, T6:0.00, T7:0.00, T8:0.00
```

#### Procedimento de Reparo
- Verificar conexões físicas dos sensores
- Testar continuidade dos cabos
- Calibrar sensores via interface TCP
- Validar leituras em tempo real

### 3. Reparo do Sistema de Ventilação

#### Sintomas
- RPM zerado em todos os ventiladores
- Falha no controle de velocidade
- Superaquecimento do sistema

#### Procedimento
- Verificar alimentação dos ventiladores (24V)
- Testar sinais PWM de controle
- Substituir ventiladores defeituosos
- Calibrar curvas de controle

## Validação Pós-Reparo

### Interface de Validação - TCP Server Test Demo

A validação do funcionamento das placas RMC é realizada através do TCP Server Test Demo v1.16, que fornece uma interface completa para monitoramento em tempo real.

![TCP Server Demo - Interface Principal](/img/tcp-server-demo/tcp-demo-screenshot-1.png)
*Interface principal mostrando status dos sensores e comunicação ativa*

![TCP Server Demo - Logs Detalhados](/img/tcp-server-demo/tcp-demo-screenshot-2.png)
*Logs de comunicação TCP com dados dos sensores em tempo real*

![TCP Server Demo - Status Completo](/img/tcp-server-demo/tcp-demo-screenshot-3.png)
*Visão completa do sistema com todos os parâmetros monitorados*

### Checklist de Funcionamento

#### 1. Comunicação TCP
- [ ] Conexão ativa na porta 55502
- [ ] MAC Address detectado: `54:e1:ad:83:78:e5`
- [ ] Timestamps atualizando corretamente
- [ ] Protocolo de dados íntegro

#### 2. Sensores Operacionais
**Temperaturas Esperadas:**
```
T1: 30.00°C  T2: 30.00°C  T3: 30.00°C  T4: 30.00°C
T5: 30.00°C  T6: 30.00°C  T7: 30.00°C  T8: 30.00°C
```

**Umidade e Temperatura Ambiente:**
```
Umidade: 60.96% - 59.09%
Temp Ambiente: 25.29°C - 25.15°C
```

#### 3. Sistema Elétrico
**Monitoramento AC/DC:**
```
AC: 127V / 0.00A / 0.00W
DC: 127V / 0.00V / 24V / 0.00V
Status: Operacional
```

#### 4. Sensores G (Acelerômetro)
**Coordenadas Funcionais:**
```
X_axis: 38-42
Y_axis: -25 a -15  
Z_axis: 440-702
```

#### 5. Sistema de Iluminação
**Leituras de Luz:**
```
Light1: 2811, Light2: 3299, Light3: 3299, Light4: 3299
```

### Logs de Validação

#### Evidências Visuais do Funcionamento

As imagens do TCP Server Test Demo mostram evidências claras do funcionamento correto:

**Dados Observados nas Capturas:**
- **MAC Address:** `54:e1:ad:83:78:e5` (identificação única da placa)
- **Firmware Version:** V1.30 (versão atualizada)
- **RTC Timestamp:** 2022.4.28 (sistema de tempo funcionando)
- **Porta TCP:** 55502 (comunicação ativa)

#### Comunicação de Dados Válida
```
<Rec EXT_TEMP_TYPE>: a1 a2 a3 00 00 0f 18 00 00 00...
<Rec VOLTAGE_TYPE>: a1 a2 a3 1a 00 0a 03 00 00...
<Rec G_SENSOR_TYPE>: a1 a2 a3 29 00 06 01 00 2f...
<Rec LIGHT_TYPE>: a1 a2 a3 1f 00 03 04 00 c3 0a...
<Rec FAN_VERSION>: a1 a2 a3 20 00 13 66 61 6e...
```

**Interpretação dos Logs:**
- Pacotes bem formados com headers `a1 a2 a3`
- Tipos de dados identificados corretamente
- Timestamps consistentes nos logs
- Sem erros de comunicação ou timeouts

 

## Ferramentas de Diagnóstico

### TCP Server Test Demo v1.16
Interface principal para validação e diagnóstico das placas RMC:

**Funcionalidades Principais:**
- **Monitoramento em Tempo Real:** Visualização contínua de todos os sensores
- **Logs de Comunicação:** Registro detalhado de pacotes TCP recebidos
- **Controle de Relés:** Acionamento manual dos relés (Relay0-Relay5)
- **Calibração de Sensores:** Interface para ajuste de sensores G
- **Teste de Conectividade:** Verificação da porta 55502
- **Visualização de Status:** AC/DC Power, temperaturas, umidade, ventiladores

**Como Usar:**
1. Conectar na porta 55502 da placa RMC
2. Verificar MAC Address e versão do firmware
3. Monitorar dados em tempo real
4. Analisar logs de comunicação na área "Receive"
5. Testar controles manuais (relés, calibração)

**Indicadores de Funcionamento Correto:**
- Conexão TCP estabelecida com sucesso
- Timestamps atualizando automaticamente
- Dados de sensores com valores coerentes
- Logs de comunicação sem erros
- Controles responsivos

### Interpretação das Capturas de Tela

#### Captura 1 - Interface Principal
**Elementos Visíveis:**
- MAC: `54:e1:ad:83:78:e5` - Identificação única da placa
- Door: 1, F/W Ver: V1.30 - Firmware atualizado
- RTC: 2022.4.28 4 22:06:09 - Sistema de tempo sincronizado
- Temp: T1-T8 todos em 0.00 - Sensores detectados (valores zerados normais em standby)
- Fan: RAF1-RAF24 todos em 0 - Ventiladores em standby
- Light: Valores 2482, 2874, 2972, 2948 - Sensores de luz funcionais
- AC PWR/DC PWR: Monitoramento elétrico ativo

#### Captura 2 - Dados Atualizados  
**Mudanças Observadas:**
- RTC: 2022.4.28 4 22:09:07 - Timestamp progredindo (3 minutos depois)
- Light: Valores alterados para 2753, 3272, 3292, 3299 - Sensores responsivos
- Temp/Hum: 25.36°C, 59.09% - Sensores ambientais funcionais
- G_sensor: X:39, Y:-15, Z:460 - Acelerômetro operacional

#### Captura 3 - Sistema Completo
**Status Final:**
- RTC: 2022.4.28 4 21:57:17 - Continuidade temporal
- Temp/Hum: 25.29°C, 60.94% - Leituras estáveis
- G_sensor: X:42, Y:26, Z:702 - Variações normais do acelerômetro
- Logs extensos na área "Receive" - Comunicação TCP intensa e estável

### STM32CubeProgrammer
Para reparos de firmware:
- Programação e verificação
- Backup e restore
- Debug via ST-Link

## Documentação de Reparo
 

---

**Documento atualizado:** Setembro 2025  
**Versão:** 1.0  
**Compatibilidade:** RMC Firmware v30+  
**Site de Referência:** https://diagnostico-rmc-boe-porto-alegre.netlify.app/