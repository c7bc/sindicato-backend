import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import {
  revalidateCacheAfterChange,
  revalidateCacheAfterDelete,
} from '../hooks/revalidateCache'
import { slugField } from 'payload'

export const Sites: CollectionConfig = {
  slug: 'sites',
  labels: {
    singular: 'Site',
    plural: 'Sites',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      required: true,
    },
    slugField({
      fieldToUse: 'name',
    }),
    {
      name: 'webhookUrl',
      label: 'URL do Webhook',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'URL para invalidação de cache do frontend',
        placeholder: 'https://seusite.com/api/revalidate',
      },
    },
    {
      name: 'webhookSecret',
      label: 'Secret do Webhook',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Token secreto para autenticação',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contato',
          fields: [
            {
              name: 'contact',
              type: 'group',
              fields: [
                {
                  name: 'phone',
                  label: 'Telefone',
                  type: 'text',
                  admin: {
                    placeholder: '(91) 3344-7769',
                  },
                },
                {
                  name: 'email',
                  type: 'email',
                  admin: {
                    placeholder: 'contato@sindicato.org.br',
                  },
                },
                {
                  name: 'address',
                  label: 'Endereço',
                  type: 'text',
                  admin: {
                    placeholder: 'Rua dos Radialistas, 123 - Belém/PA',
                  },
                },
                {
                  name: 'whatsapp',
                  label: 'WhatsApp',
                  type: 'text',
                  admin: {
                    placeholder: '(91) 99999-9999',
                    description: 'Opcional',
                  },
                },
                {
                  name: 'workingHours',
                  label: 'Horário de Funcionamento',
                  type: 'text',
                  admin: {
                    placeholder: 'Segunda a Sexta: 8h às 18h',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Cabeçalho',
          fields: [
            {
              name: 'header',
              type: 'group',
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'logoAlt',
                  label: 'Texto alternativo do logo',
                  type: 'text',
                },
                {
                  name: 'navItems',
                  label: 'Itens de Navegação',
                  type: 'array',
                  maxRows: 8,
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      admin: {
                        placeholder: 'Ex: INÍCIO',
                      },
                    },
                    {
                      name: 'href',
                      label: 'Link',
                      type: 'text',
                      required: true,
                      admin: {
                        placeholder: 'Ex: /',
                      },
                    },
                    {
                      name: 'isButton',
                      label: 'É Botão?',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        description: 'Renderizar como botão no frontend',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Rodapé',
          fields: [
            {
              name: 'footer',
              type: 'group',
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'description',
                  label: 'Descrição',
                  type: 'textarea',
                  admin: {
                    description: 'Texto sobre o sindicato que aparece no footer',
                  },
                },
                {
                  name: 'socialLinks',
                  label: 'Redes Sociais',
                  type: 'group',
                  fields: [
                    {
                      name: 'facebook',
                      type: 'text',
                      admin: {
                        placeholder: 'https://facebook.com/...',
                      },
                    },
                    {
                      name: 'instagram',
                      type: 'text',
                      admin: {
                        placeholder: 'https://instagram.com/...',
                      },
                    },
                    {
                      name: 'twitter',
                      type: 'text',
                      admin: {
                        placeholder: 'https://twitter.com/...',
                      },
                    },
                    {
                      name: 'youtube',
                      type: 'text',
                      admin: {
                        placeholder: 'https://youtube.com/...',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Banner (Home)',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  label: 'Título',
                  type: 'text',
                },
                {
                  name: 'description',
                  label: 'Descrição',
                  type: 'textarea',
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
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateCacheAfterChange],
    afterDelete: [revalidateCacheAfterDelete],
  },
}
