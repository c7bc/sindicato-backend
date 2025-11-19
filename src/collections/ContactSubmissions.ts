import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import {
  revalidateCacheAfterChange,
  revalidateCacheAfterDelete,
} from '../hooks/revalidateCache'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Envio de Contato',
    plural: 'Envios de Contato',
  },
  access: {
    create: anyone,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'email', 'assunto', 'site', 'createdAt'],
  },
  fields: [
    {
      name: 'nome',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'telefone',
      type: 'text',
      required: true,
      admin: {
        placeholder: '(00) 00000-0000',
        description: 'Formato: (00) 00000-0000',
      },
    },
    {
      name: 'assunto',
      type: 'text',
      required: true,
    },
    {
      name: 'mensagem',
      type: 'textarea',
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
