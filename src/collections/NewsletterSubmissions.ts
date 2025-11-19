import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import {
  revalidateCacheAfterChange,
  revalidateCacheAfterDelete,
} from '../hooks/revalidateCache'

export const NewsletterSubmissions: CollectionConfig = {
  slug: 'newsletter-submissions',
  labels: {
    singular: 'Inscrição Newsletter',
    plural: 'Inscrições Newsletter',
  },
  access: {
    create: anyone,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'nomeCompleto',
    defaultColumns: ['nomeCompleto', 'email', 'celular', 'newsletterAccepted', 'site', 'createdAt'],
  },
  fields: [
    {
      name: 'nomeCompleto',
      label: 'Nome Completo',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'celular',
      type: 'text',
      required: true,
      admin: {
        placeholder: '(00) 00000-0000',
        description: 'Formato: (00) 00000-0000',
      },
    },
    {
      name: 'newsletterAccepted',
      label: 'Aceita receber newsletter',
      type: 'checkbox',
      required: true,
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
