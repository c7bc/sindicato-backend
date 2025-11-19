import { RequiredDataFromCollectionSlug } from 'payload'
import type { PostArgs } from './post-1'

export const post2: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  author,
  sites,
}) => {
  return {
    slug: 'olhar-global',
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
                text: 'Explore o não contado e negligenciado',
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
                text: 'Ao longo da história, regiões em todo o mundo enfrentaram o impacto devastador de desastres naturais, a turbulência de agitação política e as ondulações desafiadoras de recessões econômicas. Nesses momentos de crise profunda, uma força frequentemente subestimada emerge: a resiliência indomável do espírito humano.',
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
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'De vizinhos formando equipes improvisadas de resgate durante enchentes a cidades inteiras se unindo para reconstruir após colapso econômico, a essência da humanidade é mais evidente nesses atos de solidariedade.',
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
        'Explore o não contado e negligenciado. Uma visão ampliada dos cantos do mundo, onde cada história merece seu destaque.',
      image: heroImage.id,
      title: 'Olhar Global: Além das Manchetes',
    },
    title: 'Olhar Global: Além das Manchetes',
  }
}
