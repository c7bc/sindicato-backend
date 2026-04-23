import type { Block } from 'payload'

export const PdfEmbedBlock: Block = {
  slug: 'pdfEmbed',
  interfaceName: 'PdfEmbedBlock',
  labels: {
    singular: 'PDF embutido',
    plural: 'PDFs embutidos',
  },
  fields: [
    {
      name: 'file',
      label: 'Arquivo PDF',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: {
        mimeType: { contains: 'pdf' },
      },
      admin: {
        description: 'Selecione um PDF da biblioteca de mídias. Ele será exibido na notícia com visualizador embutido.',
      },
    },
    {
      name: 'titulo',
      label: 'Título (opcional)',
      type: 'text',
      admin: {
        description: 'Exibido acima do PDF como cabeçalho.',
      },
    },
    {
      name: 'altura',
      label: 'Altura do visualizador (px)',
      type: 'number',
      defaultValue: 600,
      min: 300,
      max: 1200,
      admin: {
        description: 'Entre 300 e 1200 pixels. Padrão 600.',
      },
    },
  ],
}
