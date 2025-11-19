import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import {
  revalidateCacheAfterChange,
  revalidateCacheAfterDelete,
} from '../hooks/revalidateCache'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const SindicatoPage: CollectionConfig = {
  slug: 'sindicato-page',
  labels: {
    singular: 'Página Sindicato',
    plural: 'Páginas Sindicato',
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
          label: 'Localizações',
          fields: [
            {
              name: 'locationsSection',
              type: 'group',
              fields: [
                {
                  name: 'badge',
                  type: 'text',
                  admin: {
                    placeholder: 'Ex: Nossas sedes',
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
                  name: 'mapEmbedUrl',
                  label: 'URL do Google Maps Embed',
                  type: 'text',
                  admin: {
                    description: 'URL de incorporação do Google Maps',
                  },
                },
                {
                  name: 'locations',
                  type: 'array',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      admin: {
                        placeholder: 'Ex: Sede Principal - Belém',
                      },
                    },
                    {
                      name: 'description',
                      type: 'text',
                      admin: {
                        placeholder: 'Ex: Horário de funcionamento',
                      },
                    },
                    {
                      name: 'address',
                      label: 'Endereço',
                      type: 'richText',
                      editor: lexicalEditor({
                        features: ({ rootFeatures }) => [
                          ...rootFeatures,
                          FixedToolbarFeature(),
                          InlineToolbarFeature(),
                        ],
                      }),
                    },
                    {
                      name: 'mapUrl',
                      label: 'Link do Google Maps',
                      type: 'text',
                    },
                    {
                      name: 'icon',
                      type: 'select',
                      options: [
                        { label: 'Mapa', value: 'map-pin' },
                        { label: 'Prédio', value: 'building' },
                        { label: 'Escritório', value: 'office' },
                      ],
                      defaultValue: 'map-pin',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Equipe',
          fields: [
            {
              name: 'teamSections',
              label: 'Seções da Equipe',
              type: 'array',
              admin: {
                description: 'Adicione seções como Diretoria Executiva, Conselho Fiscal, etc.',
              },
              fields: [
                {
                  name: 'title',
                  label: 'Título da Seção',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'Ex: Diretoria Executiva, Conselho Fiscal',
                  },
                },
                {
                  name: 'badge',
                  type: 'text',
                  admin: {
                    placeholder: 'Ex: Gestão 2023-2026',
                  },
                },
                {
                  name: 'description',
                  label: 'Descrição',
                  type: 'textarea',
                },
                {
                  name: 'members',
                  label: 'Membros',
                  type: 'array',
                  fields: [
                    {
                      name: 'name',
                      label: 'Nome',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'role',
                      label: 'Cargo',
                      type: 'text',
                      required: true,
                      admin: {
                        placeholder: 'Ex: Presidente',
                      },
                    },
                    {
                      name: 'image',
                      label: 'Foto',
                      type: 'upload',
                      relationTo: 'media',
                    },
                    {
                      name: 'imageAlt',
                      label: 'Texto alternativo da imagem',
                      type: 'text',
                    },
                  ],
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
        description: 'Cada site pode ter apenas uma página de Sindicato',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateCacheAfterChange],
    afterDelete: [revalidateCacheAfterDelete],
  },
}
