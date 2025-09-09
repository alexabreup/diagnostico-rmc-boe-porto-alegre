import React from 'react';
import Layout from '@theme/Layout';
import DiagnosticCard from '../components/DiagnosticCard';

export default function DiagnosticCardDemo(): JSX.Element {
  const sampleEvidence = `Medições realizadas:
- Tensão de alimentação: 3.3V ± 0.05V
- Corrente de operação: 150mA ± 10mA
- Temperatura de operação: 45°C ± 2°C
- Taxa de erro: 0.001%
- Tempo de resposta: 2.3ms`;

  const longEvidence = `Análise técnica detalhada:
- Tensão de entrada: 5.0V ± 0.1V (dentro da especificação)
- Corrente de consumo: 200mA ± 15mA (acima do esperado)
- Temperatura do processador: 65°C ± 3°C (próximo ao limite)
- Integridade do sinal: Boa (SNR > 40dB)
- Taxa de erro de comunicação: 0.05% (aceitável)
- Tempo de inicialização: 3.2s (dentro do esperado)
- Memória disponível: 75% (adequado)
- Status da EEPROM: Funcional com 2 setores degradados`;

  return (
    <Layout
      title="DiagnosticCard Component Demo"
      description="Demonstração do componente DiagnosticCard para documentação técnica"
    >
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--12">
            <h1>DiagnosticCard Component Demo</h1>
            <p>
              Este componente é usado para exibir informações de diagnóstico com
              indicadores de status visuais e seções de evidência técnica.
            </p>
          </div>
        </div>

        <div className="row margin-vert--lg">
          <div className="col col--6">
            <h2>Status: Funcional</h2>
            <DiagnosticCard
              title="Controlador Principal RMC-850Y"
              status="funcional"
              evidence={sampleEvidence}
            >
              <p>
                O controlador principal está operando dentro dos parâmetros
                normais. Todas as funções de controle estão respondendo
                adequadamente e os valores de tensão e corrente estão dentro das
                especificações.
              </p>
            </DiagnosticCard>
          </div>

          <div className="col col--6">
            <h2>Status: Degradado</h2>
            <DiagnosticCard
              title="Sistema de Comunicação"
              status="degradado"
              evidence="Taxa de erro: 0.05%&#10;Latência média: 150ms&#10;Pacotes perdidos: 2/1000"
            >
              <p>
                O sistema de comunicação apresenta degradação na performance. A
                taxa de erro está ligeiramente elevada, mas ainda dentro dos
                limites operacionais aceitáveis.
              </p>
            </DiagnosticCard>
          </div>
        </div>

        <div className="row margin-vert--lg">
          <div className="col col--6">
            <h2>Status: Crítico</h2>
            <DiagnosticCard
              title="Fonte de Alimentação"
              status="crítico"
              evidence="Tensão de saída: 2.8V (especificação: 3.3V ± 0.1V)&#10;Ripple: 150mV (máximo: 50mV)&#10;Temperatura: 85°C (máximo: 70°C)"
            >
              <p>
                A fonte de alimentação está operando fora das especificações.
                Tensão de saída abaixo do mínimo e temperatura excessiva.
                <strong> Intervenção imediata necessária.</strong>
              </p>
            </DiagnosticCard>
          </div>

          <div className="col col--6">
            <h2>Status: Offline</h2>
            <DiagnosticCard
              title="Display LCD Secundário"
              status="offline"
              evidence="Sem resposta aos comandos de inicialização&#10;Tensão de alimentação: 0V&#10;Status de comunicação: Timeout"
            >
              <p>
                O display LCD secundário não está respondendo. Não há tensão de
                alimentação detectada e todos os comandos de comunicação
                resultam em timeout.
              </p>
            </DiagnosticCard>
          </div>
        </div>

        <div className="row margin-vert--lg">
          <div className="col col--12">
            <h2>Exemplo com Evidência Extensa</h2>
            <DiagnosticCard
              title="Análise Completa do Sistema RMC-MD-1107"
              status="degradado"
              evidence={longEvidence}
            >
              <p>
                Análise completa do sistema RMC-MD-1107 revelou operação
                degradada devido ao consumo de corrente elevado e temperatura
                próxima ao limite. O sistema continua funcional, mas requer
                monitoramento contínuo.
              </p>
              <ul>
                <li>Processador operando dentro dos parâmetros</li>
                <li>Comunicação estável com taxa de erro aceitável</li>
                <li>EEPROM com setores degradados identificados</li>
                <li>Recomendação: substituição preventiva em 30 dias</li>
              </ul>
            </DiagnosticCard>
          </div>
        </div>

        <div className="row margin-vert--lg">
          <div className="col col--12">
            <h2>Sem Evidência Técnica</h2>
            <DiagnosticCard title="Status Geral do Sistema" status="funcional">
              <p>
                Este exemplo mostra um DiagnosticCard sem seção de evidência
                técnica. Útil para informações gerais ou quando os dados
                técnicos detalhados não são necessários.
              </p>
            </DiagnosticCard>
          </div>
        </div>
      </div>
    </Layout>
  );
}
