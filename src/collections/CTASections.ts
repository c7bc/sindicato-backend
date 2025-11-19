import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import {
  revalidateCacheAfterChange,
  revalidateCacheAfterDelete,
} from '../hooks/revalidateCache'

export const CTASections: CollectionConfig = {
  slug: 'cta-sections',
  labels: {
    singular: 'Seção CTA',
    plural: 'Seções CTA',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'page', 'site', 'updatedAt'],
  },
  fields: [
    {
      name: 'page',
      label: 'Página',
      type: 'select',
      required: true,
      options: [
        { label: 'Sindicato', value: 'sindicato' },
        { label: 'Jurídico', value: 'juridico' },
        { label: 'Serviços', value: 'servicos' },
      ],
    },
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Descrição',
      type: 'textarea',
    },
    {
      name: 'primaryButtonText',
      label: 'Texto do Botão Primário',
      type: 'text',
    },
    {
      name: 'primaryButtonHref',
      label: 'Link do Botão Primário',
      type: 'text',
    },
    {
      name: 'secondaryButtonText',
      label: 'Texto do Botão Secundário',
      type: 'text',
    },
    {
      name: 'secondaryButtonHref',
      label: 'Link do Botão Secundário',
      type: 'text',
    },
    {
      name: 'image',
      label: 'Imagem',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'imageAlt',
      label: 'Texto alternativo da imagem',
      type: 'text',
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
    afterChange: [revalidateCacheAfterChange],
    afterDelete: [revalidateCacheAfterDelete],
  },
}
