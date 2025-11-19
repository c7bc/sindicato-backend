import type { Media, User } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type PostArgs = {
  heroImage: Media
  blockImage: Media
  author: User
  sites: number[]
}

export const post1: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  author,
  sites,
}) => {
  return {
    slug: 'horizontes-digitais',
    _status: 'published',
    authors: [author],
    sites,
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Mergulhe nas maravilhas da inovação moderna',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Encontramo-nos em uma era transformadora onde a inteligência artificial (IA) está na vanguarda da evolução tecnológica. Os efeitos de seus avanços estão remodelando indústrias em um ritmo sem precedentes.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'IoT: Conectando o Mundo ao Nosso Redor',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'No cenário tecnológico em rápida evolução de hoje, a Internet das Coisas (IoT) se destaca como uma força revolucionária. De transformar nossas residências com sistemas de casas inteligentes a redefinir o transporte através de carros conectados, a influência da IoT é palpável em quase todas as facetas de nossas vidas diárias.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    heroImage: heroImage.id,
    meta: {
      description:
        'Mergulhe nas maravilhas da inovação moderna, onde a única constante é a mudança. Uma jornada onde pixels e dados convergem para criar o futuro.',
      image: heroImage.id,
      title: 'Horizontes Digitais: Um Vislumbre do Amanhã',
    },
    title: 'Horizontes Digitais: Um Vislumbre do Amanhã',
  }
}
