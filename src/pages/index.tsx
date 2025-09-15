import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/intro">
            Acessar Documentação Técnica 📋
          </Link>
        </div>
      </div>
    </header>
  );
}

function TechnicalNavigation() {
  return (
    <section className={styles.technicalNav}>
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <Heading as="h2" className="text--center margin-bottom--lg">
              Navegação Técnica
            </Heading>
          </div>
        </div>
        <div className="row">
          <div className="col col--3">
            <div className="card">
              <div className="card__header">
                <h3>Análises Individuais</h3>
              </div>
              <div className="card__body">
                <p>
                  Documentação técnica detalhada de cada placa RMC com métricas
                  objetivas e evidências.
                </p>
              </div>
              <div className="card__footer">
                <Link
                  className="button button--primary button--block"
                  to="/analises-individuais"
                >
                  Ver Análises
                </Link>
              </div>
            </div>
          </div>
          <div className="col col--3">
            <div className="card">
              <div className="card__header">
                <h3>Problemas Identificados</h3>
              </div>
              <div className="card__body">
                <p>
                  Identificação sistemática de problemas com evidências técnicas
                  e correlações estatísticas.
                </p>
              </div>
              <div className="card__footer">
                <Link
                  className="button button--primary button--block"
                  to="/problemas-identificados"
                >
                  Ver Problemas
                </Link>
              </div>
            </div>
          </div>
          <div className="col col--3">
            <div className="card">
              <div className="card__header">
                <h3>Análises Comparativas</h3>
              </div>
              <div className="card__body">
                <p>
                  Comparações técnicas entre placas com dados estatísticos e
                  métricas de performance.
                </p>
              </div>
              <div className="card__footer">
                <Link
                  className="button button--primary button--block"
                  to="/comparativos"
                >
                  Ver Comparativos
                </Link>
              </div>
            </div>
          </div>
          <div className="col col--3">
            <div className="card">
              <div className="card__header">
                <h3>Especificações Técnicas</h3>
              </div>
              <div className="card__body">
                <p>
                  Análises comparativas e consolidações técnicas
                  validadas entre diferentes placas RMC.
                </p>
              </div>
              <div className="card__footer">
                <Link
                  className="button button--primary button--block"
                  to="/comparativos"
                >
                  Ver Comparativos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AuthorAttribution() {
  const { siteConfig } = useDocusaurusContext();
  const author = siteConfig.customFields?.author as string;
  const authorEmail = siteConfig.customFields?.authorEmail as string;
  const department = siteConfig.customFields?.department as string;

  return (
    <section className={styles.authorSection}>
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <div className="card">
              <div className="card__header">
                <Heading as="h3" className="text--center">
                  Autoria e Responsabilidade Técnica
                </Heading>
              </div>
              <div className="card__body text--center">
                <div className={styles.authorInfo}>
                  <div className={styles.authorDetails}>
                    <h4>{author}</h4>
                    <p className="text--secondary">{department}</p>
                    <p>
                      <strong>Contato:</strong>{' '}
                      <Link href={`mailto:${authorEmail}`}>{authorEmail}</Link>
                    </p>
                  </div>
                  <div className={styles.brandingInfo}>
                    <h4>Eletromidia</h4>
                    <p className="text--secondary">
                      Plataforma Técnica de Documentação de Hardware
                    </p>
                    <p className="text--secondary">
                      Documentação baseada em evidências técnicas e métricas
                      objetivas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Eletromidia Hardware`}
      description="Plataforma técnica de documentação de hardware para diagnóstico RMC - Departamento de Hardware Eletromidia por Alexandre de Abreu Pereira"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <TechnicalNavigation />
        <AuthorAttribution />
      </main>
    </Layout>
  );
}
