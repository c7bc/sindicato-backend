'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'
import { TextFieldClientComponent } from 'payload'

export const Base64ImageField: TextFieldClientComponent = ({ field, path }) => {
  const { value } = useField<string>({ path })

  const handleDownload = () => {
    if (!value) return

    const link = document.createElement('a')
    link.href = value
    link.download = 'assinatura-digital.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: 500,
        }}
      >
        {typeof field.label === 'string' ? field.label : field.name}
      </label>

      {value && value.startsWith('data:image') ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Assinatura Digital"
            style={{
              maxWidth: '300px',
              maxHeight: '150px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#fff',
            }}
          />
          <button
            type="button"
            onClick={handleDownload}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0066cc',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Baixar
          </button>
        </div>
      ) : value ? (
        <p style={{ color: '#666', fontSize: '0.875rem' }}>
          Imagem não disponível
        </p>
      ) : (
        <p style={{ color: '#666', fontSize: '0.875rem' }}>
          Nenhuma assinatura enviada
        </p>
      )}
    </div>
  )
}

export default Base64ImageField
