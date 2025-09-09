# Diagnóstico RMC - Plataforma Técnica de Documentação

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/alexabreup/diagnostico-rmc-boe-porto-alegre)
[![Documentation](https://img.shields.io/badge/docs-live-blue)](https://alexabreup.github.io/diagnostico-rmc-boe-porto-alegre)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 📋 Sobre o Projeto

Plataforma técnica de documentação desenvolvida para o diagnóstico completo das placas RMC (Remote Management Controller) da Eletromidia. Este projeto documenta a análise forense de firmware, identificação de causas raiz e procedimentos de correção para problemas de schedule PWM em controladores de telas LCD.

### 🎯 Objetivo

Documentar de forma técnica e estruturada o diagnóstico realizado em 3 placas RMC que apresentavam falhas no sistema de schedule de brilho, incluindo:

- **Análise forense de firmware** com dados hexadecimais
- **Comparação de versões** e identificação de downgrades
- **Procedimentos de reprogramação** detalhados
- **Relatórios executivos** consolidados
- **Evidências técnicas** com métricas e validações

## 🔧 Tecnologias Utilizadas

- **[Docusaurus 3.6.3](https://docusaurus.io/)** - Gerador de sites estáticos
- **React 18** - Componentes interativos
- **TypeScript** - Tipagem estática
- **CSS3** - Estilização customizada
- **Jest** - Testes automatizados
- **Webpack** - Bundling otimizado

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/alexabreup/diagnostico-rmc-boe-porto-alegre.git

# Entre no diretório
cd diagnostico-rmc-boe-porto-alegre

# Instale as dependências
npm install
# ou
yarn
```

### Desenvolvimento Local

```bash
# Inicia o servidor de desenvolvimento
npm start
# ou
yarn start
```

Acesse `http://localhost:3000` para visualizar a documentação.

### Build de Produção

```bash
# Gera os arquivos estáticos
npm run build
# ou
yarn build
```

### Testes

```bash
# Executa todos os testes
npm test
# ou
yarn test

# Executa testes com coverage
npm run test:coverage
```

## 📊 Estrutura do Projeto

```
diagnostico-rmc-poa-elt/
├── docs/                          # Documentação técnica
│   ├── analises-individuais/       # Análises das 3 placas RMC
│   ├── comparativos/              # Comparações e consolidações
│   ├── especificacoes-tecnicas/   # Specs técnicas detalhadas
│   ├── procedimentos/             # Procedimentos de reprogramação
│   └── relatorios-executivos/     # Relatórios consolidados
├── src/
│   ├── components/                # Componentes React customizados
│   │   ├── DiagnosticCard/        # Cards de diagnóstico
│   │   ├── EvidenceBlock/         # Blocos de evidência
│   │   ├── MetricsDisplay/        # Display de métricas
│   │   └── TechnicalTable/        # Tabelas técnicas
│   ├── css/                       # Estilos customizados
│   └── pages/                     # Páginas adicionais
├── scripts/                       # Scripts de automação
└── static/                        # Arquivos estáticos
```

## 🔍 Principais Descobertas

### Análise das Placas RMC

| Placa | Status | Firmware | Schedule PWM | Prioridade |
|-------|--------|----------|--------------|------------|
| **MD-1105** | ✅ Funcional | V1.01 | 98.3% | Referência |
| **MD-1107** | ⚠️ Degradado | Antigo | 20% | Urgente (24h) |
| **850Y POA** | ❌ Crítico | Antigo | 0% | Alta (48h) |

### Dados Hexadecimais Identificados

```
MD-1105 (Saudável):  MD5: bf0d4880beb409cacae7518ae14d9024
MD-1107 (Parcial):   MD5: 543afe06f1703e03e4a505ea44b58ae0  
850Y POA (Crítico):  MD5: c40488b2e33adf9e59afa13864df05c8
Referência V1.01:    MD5: 104e20c1d27ceb6deaed9be8e25ba159
```

### Causa Raiz Identificada

**Downgrade de firmware** combinado com uso IoT intensivo, resultando em:
- Corrupção progressiva do schedule PWM
- Perda de funcionalidades de horário (SUMMER_TIME, sntp)
- Degradação da EEPROM por escritas excessivas

## 📈 Componentes Técnicos

### DiagnosticCard
Componente para exibir status de diagnóstico com cores semânticas.

### EvidenceBlock  
Blocos de evidência técnica com syntax highlighting.

### MetricsDisplay
Display de métricas com indicadores visuais de status.

### TechnicalTable
Tabelas técnicas responsivas com contadores de status.

## 🎨 Design System

Baseado no design do [Relay.dev](https://relay.dev) com:
- **Cor primária**: #ff4e00 (Eletromidia)
- **Tipografia**: Inter font family
- **Modo escuro**: Suporte completo
- **Responsividade**: Mobile-first

## 🧪 Testes e Qualidade

- **Testes unitários**: Jest + React Testing Library
- **Testes de acessibilidade**: WCAG 2.1 AA
- **Testes de performance**: Lighthouse CI
- **Validação de conteúdo**: Scripts automatizados

## 📝 Documentação

A documentação completa está disponível em:
- **Local**: `http://localhost:3000` (desenvolvimento)
- **Online**: [GitHub Pages](https://alexabreup.github.io/diagnostico-rmc-boe-porto-alegre)

### Seções Principais

1. **[Introdução](docs/intro.md)** - Visão geral do problema
2. **[Análises Individuais](docs/analises-individuais/)** - Detalhes de cada placa
3. **[Comparativos](docs/comparativos/)** - Análises comparativas
4. **[Procedimentos](docs/procedimentos/)** - Guias de reprogramação
5. **[Relatórios Executivos](docs/relatorios-executivos/)** - Consolidações

## 👥 Equipe

**Alexandre de Abreu Pereira**  
*Departamento de Hardware - Eletromidia*  
📧 alexandre.abreu@eletromidia.com.br

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📊 Status do Projeto

- ✅ **Análise técnica**: Completa
- ✅ **Documentação**: Finalizada  
- ✅ **Componentes React**: Implementados
- ✅ **Testes**: Cobertura > 80%
- ✅ **Deploy**: Automatizado
- ✅ **Performance**: Otimizada

## 🚀 Deploy

### GitHub Pages

```bash
# Deploy automático para GitHub Pages
GIT_USER=alexabreup yarn deploy
```

### Netlify/Vercel

O projeto está configurado para deploy automático em plataformas como Netlify ou Vercel através do diretório `build/`.

---

**Desenvolvido com ❤️ pela equipe de Hardware da Eletromidia**