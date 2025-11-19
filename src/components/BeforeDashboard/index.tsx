import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Bem-vindo ao seu painel!</h4>
      </Banner>
      O que fazer agora:
      <ul className={`${baseClass}__instructions`}>
        <li>
          <SeedButton />
          {' com alguns posts para começar seu novo site, depois '}
          <a href="/" target="_blank">
            visite seu site
          </a>
          {' para ver os resultados.'}
        </li>
        <li>
          Se você criou este repositório usando Payload Cloud, vá ao GitHub e clone-o para sua
          máquina local. Ele estará no <i>GitHub Scope</i> que você selecionou ao criar este
          projeto.
        </li>
        <li>
          {'Modifique suas '}
          <a
            href="https://payloadcms.com/docs/configuration/collections"
            rel="noopener noreferrer"
            target="_blank"
          >
            collections
          </a>
          {' e adicione mais '}
          <a
            href="https://payloadcms.com/docs/fields/overview"
            rel="noopener noreferrer"
            target="_blank"
          >
            campos
          </a>
          {' conforme necessário. Se você é novo no Payload, recomendamos conferir a '}
          <a
            href="https://payloadcms.com/docs/getting-started/what-is-payload"
            rel="noopener noreferrer"
            target="_blank"
          >
            documentação inicial
          </a>
          {'.'}
        </li>
        <li>
          Faça commit e push das suas alterações para acionar um novo deploy do projeto.
        </li>
      </ul>
      {'Dica: Este bloco é um '}
      <a
        href="https://payloadcms.com/docs/custom-components/overview"
        rel="noopener noreferrer"
        target="_blank"
      >
        componente customizado
      </a>
      , você pode removê-lo a qualquer momento atualizando seu <strong>payload.config</strong>.
    </div>
  )
}

export default BeforeDashboard
