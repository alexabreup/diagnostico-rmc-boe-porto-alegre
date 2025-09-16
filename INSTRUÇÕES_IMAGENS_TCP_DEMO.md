# Instruções para Adicionar Imagens do TCP Server Test Demo

## Localização das Imagens

As imagens devem ser salvas na pasta: `static/img/tcp-server-demo/`

## Nomes dos Arquivos

Renomeie as capturas de tela conforme abaixo:

1. **Primeira imagem** → `tcp-demo-screenshot-1.png`
   - Interface principal com MAC Address 54:e1:ad:83:78:e5
   - RTC: 2022.4.28 4 22:06:09
   - Sensores em standby

2. **Segunda imagem** → `tcp-demo-screenshot-2.png` 
   - Interface com dados atualizados
   - RTC: 2022.4.28 4 22:09:07
   - Sensores com leituras ativas

3. **Terceira imagem** → `tcp-demo-screenshot-3.png`
   - Interface completa com logs extensos
   - RTC: 2022.4.28 4 21:57:17
   - Sistema totalmente operacional

## Passos para Adicionar

1. Salve as 3 capturas de tela na pasta `static/img/tcp-server-demo/`
2. Renomeie conforme os nomes acima
3. As imagens já estão referenciadas na documentação em `docs/procedimentos/reparos-placas-rmc.md`
4. Execute o build do site para verificar se as imagens aparecem corretamente

## Verificação

Após adicionar as imagens, acesse a página de reparos no site e verifique se:
- As 3 imagens são exibidas corretamente
- As legendas estão adequadas
- O layout não foi quebrado
- As imagens são responsivas

## Comando para Build Local

```bash
npm run build
npm run serve
```

Acesse: http://localhost:3000/docs/procedimentos/reparos-placas-rmc

## Observações

- As imagens mostram evidências reais do funcionamento das placas RMC
- Servem como referência visual para validação pós-reparo
- Demonstram a interface do TCP Server Test Demo v1.16
- Comprovam a comunicação TCP ativa na porta 55502