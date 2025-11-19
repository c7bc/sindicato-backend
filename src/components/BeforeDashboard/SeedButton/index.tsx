'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { toast } from '@payloadcms/ui'

import './index.scss'

const SuccessMessage: React.FC = () => (
  <div>
    Banco de dados populado! Agora você pode{' '}
    <a target="_blank" href="/">
      visitar seu site
    </a>
  </div>
)

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (seeded) {
        toast.info('Banco de dados já foi populado.')
        return
      }
      if (loading) {
        toast.info('Populando banco de dados...')
        return
      }
      if (error) {
        toast.error(`Ocorreu um erro, atualize a página e tente novamente.`)
        return
      }

      setLoading(true)

      try {
        toast.promise(
          new Promise((resolve, reject) => {
            try {
              fetch('/next/seed', { method: 'POST', credentials: 'include' })
                .then((res) => {
                  if (res.ok) {
                    resolve(true)
                    setSeeded(true)
                  } else {
                    reject('Ocorreu um erro ao popular o banco.')
                  }
                })
                .catch((error) => {
                  reject(error)
                })
            } catch (error) {
              reject(error)
            }
          }),
          {
            loading: 'Populando com dados....',
            success: <SuccessMessage />,
            error: 'Ocorreu um erro ao popular o banco.',
          },
        )
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err)
        setError(error)
      }
    },
    [loading, seeded, error],
  )

  let message = ''
  if (loading) message = ' (populando...)'
  if (seeded) message = ' (pronto!)'
  if (error) message = ` (erro: ${error})`

  return (
    <Fragment>
      <button className="seedButton" onClick={handleClick}>
        Popular banco de dados
      </button>
      {message}
    </Fragment>
  )
}
