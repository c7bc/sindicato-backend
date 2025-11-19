import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import {
  revalidateCacheAfterChange,
  revalidateCacheAfterDelete,
} from '../hooks/revalidateCache'

export const ServicosPage: CollectionConfig = {
  slug: 'servicos-page',
  labels: {
    singular: 'Página Serviços',
    plural: 'Páginas Serviços',
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
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                {
                  name: 'badge',
                  type: 'text',
                  admin: {
                    placeholder: 'Ex: Vantagens Exclusivas',
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
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'imageAlt',
                  label: 'Texto alternativo da imagem',
                  type: 'text',
                },
                {
                  name: 'features',
                  type: 'array',
                  fields: [
                    {
                      name: 'icon',
                      type: 'text',
                      admin: {
                        placeholder: 'Nome do ícone (ex: shield, heart, star)',
                      },
                    },
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'description',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Convênios/Benefícios',
          fields: [
            {
              name: 'benefits',
              type: 'group',
              fields: [
                {
                  name: 'badge',
                  type: 'text',
                  admin: {
                    placeholder: 'Ex: Convênios',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'subtitle',
                  type: 'text',
                },
                {
                  name: 'categories',
                  label: 'Categorias de Benefícios',
                  type: 'array',
                  fields: [
                    {
                      name: 'id',
                      label: 'ID (slug)',
                      type: 'text',
                      required: true,
                      admin: {
                        placeholder: 'Ex: educacao',
                      },
                    },
                    {
                      name: 'name',
                      label: 'Nome da Categoria',
                      type: 'text',
                      required: true,
                      admin: {
                        placeholder: 'Ex: Educação, Automóveis, Saúde',
                      },
                    },
                    {
                      name: 'benefits',
                      label: 'Benefícios/Estabelecimentos',
                      type: 'array',
                      fields: [
                        {
                          name: 'name',
                          label: 'Nome do estabelecimento',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'discount',
                          label: 'Desconto',
                          type: 'text',
                          admin: {
                            placeholder: 'Ex: 40% nas mensalidades',
                          },
                        },
                        {
                          name: 'address',
                          label: 'Endereço',
                          type: 'text',
                        },
                        {
                          name: 'phone',
                          label: 'Telefone',
                          type: 'text',
                        },
                        {
                          name: 'hours',
                          label: 'Horário',
                          type: 'text',
                        },
                        {
                          name: 'observations',
                          label: 'Observações',
                          type: 'textarea',
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
          label: 'Instalações',
          fields: [
            {
              name: 'facilities',
              label: 'Instalações',
              type: 'array',
              admin: {
                description: 'Ex: Alojamento para Radialistas, Ginásio, etc.',
              },
              fields: [
                {
                  name: 'badge',
                  type: 'text',
                  admin: {
                    placeholder: 'Ex: Instalações Próprias',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'Ex: Alojamento para Radialistas',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'imageAlt',
                  label: 'Texto alternativo da imagem',
                  type: 'text',
                },
                {
                  name: 'priceTable',
                  label: 'Tabela de Preços',
                  type: 'array',
                  fields: [
                    {
                      name: 'description',
                      label: 'Descrição',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'price',
                      label: 'Preço',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'generalInfo',
                  label: 'Informações Gerais',
                  type: 'array',
                  fields: [
                    {
                      name: 'info',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'contactInfo',
                  label: 'Informações de Contato',
                  type: 'group',
                  fields: [
                    {
                      name: 'hours',
                      label: 'Horário',
                      type: 'text',
                    },
                    {
                      name: 'email',
                      type: 'email',
                    },
                    {
                      name: 'phone',
                      label: 'Telefone',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'regulations',
                  label: 'Normas/Regras',
                  type: 'array',
                  fields: [
                    {
                      name: 'rule',
                      label: 'Regra',
                      type: 'text',
                      required: true,
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
        description: 'Cada site pode ter apenas uma página de Serviços',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateCacheAfterChange],
    afterDelete: [revalidateCacheAfterDelete],
  },
}
