# Correção: Arquitetura de Memória do GD32F307

## Correção Técnica Realizada

**Data**: 9 de dezembro de 2024  
**Autor**: Alexandre de Abreu Pereira  
**Departamento**: Hardware - Eletromidia  

## Problema Identificado

Durante a revisão da documentação técnica, foram encontradas referências incorretas ao **EEPROM** como tipo de memória utilizada pelo microcontrolador GD32F307VET6. Esta informação estava incorreta conforme o datasheet oficial.

## Correção Aplicada

### Arquitetura Real do GD32F307VET6

Conforme o **GD32F307xx Datasheet Rev3.0, Seção 3.2 (On-chip memory)**, o microcontrolador utiliza:

#### 1. Flash Memory (Memória Flash)
- **Capacidade**: 1024 KB (1 MB)
- **Tipo**: Memória não-volátil
- **Função**: Armazenamento do firmware, configurações e dados constantes
- **Endereçamento**: Inclui as áreas identificadas nos diagnósticos:
  - Área 1 (0x0803E000): Configurações de rede + Schedule
  - Área 2 (0x0803C000): Backup ou área secundária

#### 2. SRAM (Static Random-Access Memory)
- **Capacidade**: 96 KB
- **Tipo**: Memória volátil estática
- **Função**: Processamento em tempo real, variáveis, buffers e stack
- **Uso no RMC**: Processamento dos dados PWM e operações em tempo real

### ❌ Informação Incorreta (Removida)
- ~~EEPROM~~ - **Não existe no GD32F307**

### ✅ Informação Correta (Aplicada)
- **Flash Memory (1024KB)** - Armazenamento não-volátil
- **SRAM (96KB)** - Processamento em tempo real

## Arquivos Corrigidos

### 1. `docs/analises-individuais/rmc-md-1105.md`
```diff
- ['Localização EEPROM', 'Área 1 (0x0803E000)', 'funcional']
+ ['Localização Flash', 'Área 1 (0x0803E000)', 'funcional']
```

### 2. `docs/problemas-identificados/index.md`
```diff
- Corrupção funcional dados EEPROM
+ Corrupção funcional dados Flash
```

### 3. `docs/especificacoes-tecnicas/mapeamento-controle-telas.md`
```diff
- <DiagnosticCard title="Padrão funcional Armazenamento EEPROM" status="funcional">
- - **Área 1 (0x0803E000)**: Configuração funcional rede + Schedule
- - **Área 2 (0x0803C000)**: Backup ou área secundária
+ <DiagnosticCard title="Padrão funcional Armazenamento Flash Memory" status="funcional">
+ - **Flash Memory (1024KB)**: Armazenamento não-volátil do firmware e configurações
+ - **Área 1 (0x0803E000)**: Configuração funcional rede + Schedule (Flash)
+ - **Área 2 (0x0803C000)**: Backup ou área secundária (Flash)
+ - **SRAM (96KB)**: Processamento em tempo real dos dados PWM e variáveis
```

## Impacto da Correção

### Técnico
- ✅ Documentação agora reflete corretamente a arquitetura do GD32F307
- ✅ Endereços de memória mantidos (corretos conforme análise)
- ✅ Funcionalidade do diagnóstico preservada

### Diagnóstico
- ✅ As análises realizadas permanecem válidas
- ✅ Os endereços identificados (0x0803E000, 0x0803C000) são corretos para Flash
- ✅ O comportamento observado nas placas RMC está consistente com Flash Memory

## Validação

A correção foi validada contra:
1. **GD32F307xx Datasheet Rev3.0** - Seção 3.2 (On-chip memory)
2. **Análises práticas realizadas** - Endereços e comportamento observado
3. **Funcionalidade do firmware** - Compatível com arquitetura Flash + SRAM

## Conclusão

A documentação técnica agora reflete corretamente a arquitetura de memória do GD32F307VET6, eliminando referências incorretas ao EEPROM e fornecendo informações precisas sobre Flash Memory (1024KB) e SRAM (96KB) conforme especificação do fabricante.