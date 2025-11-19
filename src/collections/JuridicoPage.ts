import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import {
  revalidateCacheAfterChange,
  revalidateCacheAfterDelete,
} from '../hooks/revalidateCache'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const JuridicoPage: CollectionConfig = {
  slug: 'juridico-page',
  labels: {
    singular: 'Página Jurídico',
    plural: 'Páginas Jurídico',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'site',
    defaultColumns: ['site', 'updatedAt'],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Informações de Contato',
          fields: [
            {
              name: 'contactInfo',
              type: 'group',
              fields: [
                {
                  name: 'badge',
                  type: 'text',
                  admin: {
                    placeholder: 'Ex: Fale conosco',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'contacts',
                  label: 'Contatos',
                  type: 'array',
                  fields: [
                    {
                      name: 'icon',
                      type: 'select',
                      options: [
                        { label: 'Email', value: 'mail' },
                        { label: 'Localização', value: 'map-pin' },
                        { label: 'Telefone', value: 'phone' },
                      ],
                      required: true,
                    },
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      admin: {
                        placeholder: 'Ex: E-mail',
                      },
                    },
                    {
                      name: 'description',
                      type: 'text',
                    },
                    {
                      name: 'linkText',
                      label: 'Texto do link/info',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'linkHref',
                      label: 'Link (mailto:, tel:, https://)',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Abas do Jurídico',
          fields: [
            {
              name: 'tabs',
              type: 'array',
              admin: {
                description: 'Abas: Atendimento, Plantão Jurídico, Escritórios Conveniados, Homologação, Consulta Processual, Ações Coletivas',
              },
              fields: [
                {
                  name: 'id',
                  label: 'ID (slug único)',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'Ex: atendimento',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'Ex: Atendimento',
                  },
                },
                {
                  name: 'badge',
                  type: 'text',
                  admin: {
                    placeholder: 'Ex: Novo (opcional)',
                  },
                },
                {
                  name: 'content',
                  label: 'Conteúdo',
                  type: 'richText',
                  required: true,
                  editor: lexicalEditor({
                    features: ({ rootFeatures }) => [
                      ...rootFeatures,
                      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                      FixedToolbarFeature(),
                      InlineToolbarFeature(),
                    ],
                  }),
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Cada site pode ter apenas uma página Jurídico',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateCacheAfterChange],
    afterDelete: [revalidateCacheAfterDelete],
  },
}
