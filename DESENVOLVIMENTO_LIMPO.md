# Ambiente de Desenvolvimento Limpo

Este documento explica como executar o ambiente de desenvolvimento sem warnings desnecessários.

## Problema Resolvido

Durante o desenvolvimento, você pode ver warnings como:
- `autoprefixer: grid-gap only works if grid-template(-areas) is being used`
- `autoprefixer: auto-fit value is not supported by IE`
- `MetricsDisplay: Percentage values found without supporting calculation`

Estes warnings são **não-críticos** e não afetam a funcionalidade, mas podem poluir o console durante o desenvolvimento.

## Soluções Implementadas

### 1. Comando de Desenvolvimento Limpo

```bash
npm run start:clean
```

Este comando inicia o servidor de desenvolvimento com:
- ✅ Warnings de CSS suprimidos
- ✅ Warnings de validação suprimidos
- ✅ Console limpo para focar no desenvolvimento
- ✅ Mesma funcionalidade completa

### 2. Configurações Aplicadas

#### PostCSS (postcss.config.js)
- Excluído suporte ao Internet Explorer
- Configurado `grid: 'autoplace'` para evitar warnings de grid
- Adicionado `ignoreUnknownVersions: true`

#### Webpack (docusaurus.config.ts)
- Filtros de warnings configurados
- Supressão de warnings específicos do autoprefixer

#### Variáveis de Ambiente (.env.development)
- `REACT_APP_SUPPRESS_VALIDATION_WARNINGS=true`
- `POSTCSS_SUPPRESS_WARNINGS=true`

### 3. Componentes Atualizados

Os componentes técnicos agora respeitam a variável `REACT_APP_SUPPRESS_VALIDATION_WARNINGS` para suprimir warnings de validação em desenvolvimento.

## Comandos Disponíveis

### Desenvolvimento Normal (com warnings)
```bash
npm start
```

### Desenvolvimento Limpo (sem warnings)
```bash
npm run start:clean
```

### Build de Produção
```bash
npm run build
```

## Notas Importantes

1. **Funcionalidade Preservada**: Todas as funcionalidades permanecem inalteradas
2. **Validação Ativa**: A validação ainda funciona, apenas os warnings são suprimidos no console
3. **Produção Inalterada**: O build de produção mantém todas as validações
4. **Compatibilidade**: O código continua compatível com navegadores modernos

## Recomendação

Para uma experiência de desenvolvimento mais limpa, use:

```bash
npm run start:clean
```

Isso permitirá focar no desenvolvimento sem distrações de warnings não-críticos, mantendo toda a funcionalidade da plataforma técnica.

---
**Autor:** Alexandre de Abreu Pereira - Departamento de Hardware - Eletromidia  
**Data:** 2025-01-09