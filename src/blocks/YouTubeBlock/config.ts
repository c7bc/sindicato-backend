import type { Block } from 'payload'

export const YouTubeBlock: Block = {
  slug: 'youtube',
  interfaceName: 'YouTubeBlock',
  labels: {
    singular: 'Vídeo YouTube',
    plural: 'Vídeos YouTube',
  },
  fields: [
    {
      name: 'url',
      label: 'URL do vídeo',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'https://youtube.com/watch?v=... ou https://youtu.be/...',
        description: 'Cole a URL inteira do YouTube. O vídeo será embutido na notícia.',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return 'URL é obrigatória'
        const match = value.match(
          /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/,
        )
        if (!match) return 'URL do YouTube inválida. Use formato https://youtube.com/watch?v=... ou youtu.be/...'
        return true
      },
    },
    {
      name: 'caption',
      label: 'Legenda (opcional)',
      type: 'text',
      admin: {
        description: 'Texto exibido abaixo do vídeo.',
      },
    },
  ],
}
