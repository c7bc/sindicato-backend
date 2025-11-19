import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import {
  revalidateCacheAfterChange,
  revalidateCacheAfterDelete,
} from '../hooks/revalidateCache'

export const SindicalizeSubmissions: CollectionConfig = {
  slug: 'sindicalize-submissions',
  labels: {
    singular: 'Solicitação de Sindicalização',
    plural: 'Solicitações de Sindicalização',
  },
  access: {
    create: anyone,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'nomeCompleto',
    defaultColumns: ['nomeCompleto', 'cpf', 'email', 'empresaVeiculo', 'site', 'createdAt'],
  },
  fields: [
    {
      name: 'nomeCompleto',
      label: 'Nome Completo',
      type: 'text',
      required: true,
    },
    {
      name: 'cpf',
      label: 'CPF',
      type: 'text',
      required: true,
      admin: {
        placeholder: '000.000.000-00',
        description: 'Formato: 000.000.000-00',
      },
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
      name: 'dataNascimento',
      label: 'Data de Nascimento',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'empresaVeiculo',
      label: 'Empresa/Veículo',
      type: 'text',
      required: true,
    },
    {
      name: 'cargoFuncao',
      label: 'Cargo/Função',
      type: 'text',
      required: true,
    },
    {
      name: 'assinaturaDigital',
      label: 'Assinatura Digital',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'declaracaoLida',
      label: 'Declaro que li e aceito os termos',
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
