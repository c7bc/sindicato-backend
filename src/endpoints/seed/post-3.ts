import { RequiredDataFromCollectionSlug } from 'payload'
import type { PostArgs } from './post-1'

export const post3: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  author,
  sites,
}) => {
  return {
    slug: 'dinheiro-e-sentido-previsao-financeira',
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
                text: 'Dinheiro não é apenas moeda; é uma linguagem',
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
                text: 'Dinheiro, em sua essência, transcende o mero conceito de moedas e notas de papel; torna-se uma linguagem profunda que fala de valor, confiança e estruturas sociais. Como qualquer linguagem, possui nuances e sutilezas intricadas que requerem uma compreensão criteriosa.',
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
                text: 'Dinâmicas do Mercado de Ações: Touros, Ursos e o Meio Incerto',
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
                text: 'O mercado de ações é um reino de vasta oportunidade, mas também apresenta riscos. Descubra as forças que impulsionam as tendências do mercado e as estratégias empregadas pelos principais traders para navegar neste ecossistema complexo.',
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
      description: `Dinheiro não é apenas moeda; é uma linguagem. Mergulhe profundamente em suas nuances, onde estratégia encontra intuição no vasto mar das finanças.`,
      image: heroImage.id,
      title: 'Dinheiro e Sentido: A Previsão Financeira',
    },
    title: 'Dinheiro e Sentido: A Previsão Financeira',
  }
}
