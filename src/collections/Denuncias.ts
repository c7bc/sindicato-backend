import type { CollectionConfig, CollectionBeforeValidateHook } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import {
  revalidateCacheAfterChange,
  revalidateCacheAfterDelete,
} from '../hooks/revalidateCache'

// Gera protocolo no formato DEN-YYYY-NNNN (sequencial dentro do ano)
const generateProtocolo: CollectionBeforeValidateHook = async ({ data, req, operation }) => {
  if (operation !== 'create') return data
  if (data?.protocolo) return data

  const year = new Date().getFullYear()
  const prefix = `DEN-${year}-`

  // Conta quantas denúncias já existem nesse ano
  const { totalDocs } = await req.payload.count({
    collection: 'denuncias',
    where: {
      protocolo: { like: prefix },
    },
  })

  const seq = String(totalDocs + 1).padStart(4, '0')
  return {
    ...data,
    protocolo: `${prefix}${seq}`,
  }
}

export const Denuncias: CollectionConfig = {
  slug: 'denuncias',
  labels: {
    singular: 'Denúncia',
    plural: 'Denúncias',
  },
  access: {
    create: anyone,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'protocolo',
    defaultColumns: ['protocolo', 'categoria', 'status', 'createdAt', 'site'],
  },
  fields: [
    {
      name: 'protocolo',
      label: 'Protocolo',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: 'Gerado automaticamente no envio.',
      },
    },
    {
      name: 'categoria',
      label: 'Categoria',
      type: 'select',
      required: true,
      options: [
        { label: 'Assédio moral', value: 'assedio-moral' },
        { label: 'Assédio sexual', value: 'assedio-sexual' },
        { label: 'Discriminação', value: 'discriminacao' },
        { label: 'Irregularidade trabalhista', value: 'irregularidade-trabalhista' },
        { label: 'Outra', value: 'outra' },
      ],
    },
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'textarea',
      required: true,
    },
    {
      name: 'anonimo',
      label: 'Denúncia anônima',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'nome',
      label: 'Nome do denunciante',
      type: 'text',
    },
    {
      name: 'email',
      label: 'E-mail do denunciante',
      type: 'email',
    },
    {
      name: 'telefone',
      label: 'Telefone do denunciante',
      type: 'text',
    },
    {
      name: 'empresa',
      label: 'Empresa / Veículo denunciado',
      type: 'text',
    },
    {
      name: 'anexo',
      label: 'Anexo (documento/prova)',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 'recebida',
      options: [
        { label: 'Recebida', value: 'recebida' },
        { label: 'Em análise', value: 'em-analise' },
        { label: 'Encaminhada', value: 'encaminhada' },
        { label: 'Resolvida', value: 'resolvida' },
        { label: 'Arquivada', value: 'arquivada' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notaInterna',
      label: 'Notas internas',
      type: 'textarea',
      admin: {
        description: 'Visível apenas para administradores.',
      },
    },
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeValidate: [generateProtocolo],
    afterChange: [revalidateCacheAfterChange],
    afterDelete: [revalidateCacheAfterDelete],
  },
}
