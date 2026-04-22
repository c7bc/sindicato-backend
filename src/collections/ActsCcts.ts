import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import {
  revalidateCacheAfterChange,
  revalidateCacheAfterDelete,
} from '../hooks/revalidateCache'

export const ActsCcts: CollectionConfig = {
  slug: 'acts-ccts',
  labels: {
    singular: 'ACT / CCT',
    plural: 'ACTs e CCTs',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'year', 'company', 'site'],
  },
  fields: [
    {
      name: 'type',
      label: 'Tipo',
      type: 'select',
      required: true,
      options: [
        { label: 'ACT — Acordo Coletivo de Trabalho', value: 'ACT' },
        { label: 'CCT — Convenção Coletiva de Trabalho', value: 'CCT' },
      ],
    },
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Ex: ACT Rádio Liberal 2025/2026',
      },
    },
    {
      name: 'year',
      label: 'Ano / Vigência',
      type: 'number',
      required: true,
      admin: {
        placeholder: 'Ex: 2025',
      },
    },
    {
      name: 'company',
      label: 'Empresa / Veículo',
      type: 'text',
      required: false,
      admin: {
        description: 'Empresa/veículo ao qual o acordo se aplica (opcional)',
      },
    },
    {
      name: 'description',
      label: 'Descrição',
      type: 'textarea',
      required: false,
    },
    {
      name: 'file',
      label: 'Arquivo (PDF)',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Documento em PDF do acordo/convenção',
      },
    },
    {
      name: 'publishedAt',
      label: 'Publicado em',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
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
    afterChange: [revalidateCacheAfterChange],
    afterDelete: [revalidateCacheAfterDelete],
  },
}
