import type { Media, Post, Category } from '@/payload-types'

// Lexical node types
interface LexicalNode {
  type?: string
  tag?: string
  text?: string
  format?: number
  listType?: string
  fields?: {
    url?: string
    newTab?: boolean
    blockType?: string
    caption?: string
    file?: unknown
    titulo?: string
    altura?: number
    alinhamento?: string
  }
  children?: LexicalNode[]
  value?: unknown
  relationTo?: string
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/,
  )
  return match ? match[1] : null
}

function resolveMediaUrlFromValue(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'number') return undefined
  const media = value as { url?: string | null }
  return media.url || undefined
}

interface LexicalContent {
  root?: {
    children?: LexicalNode[]
  }
}

// Convert Lexical JSON to HTML
export function lexicalToHtml(content: LexicalContent | null | undefined): string {
  if (!content?.root?.children) return ''

  return content.root.children
    .map((node: LexicalNode) => processNode(node))
    .join('')
}

function processNode(node: LexicalNode): string {
  if (!node) return ''

  switch (node.type) {
    case 'paragraph':
      const pContent = node.children?.map((child: LexicalNode) => processNode(child)).join('') || ''
      return pContent ? `<p>${pContent}</p>` : ''

    case 'heading':
      const level = node.tag || 'h2'
      const hContent = node.children?.map((child: LexicalNode) => processNode(child)).join('') || ''
      return `<${level}>${hContent}</${level}>`

    case 'text':
      let text = node.text || ''
      if (node.format && node.format & 1) text = `<strong>${text}</strong>` // bold
      if (node.format && node.format & 2) text = `<em>${text}</em>` // italic
      if (node.format && node.format & 8) text = `<u>${text}</u>` // underline
      return text

    case 'link':
      const linkContent = node.children?.map((child: LexicalNode) => processNode(child)).join('') || ''
      const url = node.fields?.url || '#'
      const target = node.fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${url}"${target} class="text-brand-600 hover:underline">${linkContent}</a>`

    case 'list':
      const tag = node.listType === 'number' ? 'ol' : 'ul'
      const listItems = node.children?.map((child: LexicalNode) => processNode(child)).join('') || ''
      return `<${tag}>${listItems}</${tag}>`

    case 'listitem':
      const liContent = node.children?.map((child: LexicalNode) => processNode(child)).join('') || ''
      return `<li>${liContent}</li>`

    case 'quote':
      const quoteContent = node.children?.map((child: LexicalNode) => processNode(child)).join('') || ''
      return `<blockquote>${quoteContent}</blockquote>`

    case 'horizontalrule':
      return '<hr />'

    case 'upload': {
      const media = node.value as { url?: string; alt?: string; mimeType?: string } | null
      const url = resolveMediaUrlFromValue(media)
      if (!url) return ''
      const alt = escapeHtml(media?.alt || '')
      const caption = node.fields?.caption ? escapeHtml(node.fields.caption) : ''
      const alignment = node.fields?.alinhamento || 'centro'
      const alignClass =
        alignment === 'esquerda'
          ? 'mr-auto max-w-[50%]'
          : alignment === 'direita'
            ? 'ml-auto max-w-[50%]'
            : alignment === 'largura-total'
              ? 'w-full'
              : 'mx-auto max-w-[80%]'
      if (media?.mimeType?.includes('pdf')) {
        return `<div class="my-6 ${alignClass}"><iframe src="${url}#toolbar=1" class="w-full rounded-lg border border-gray-200" style="height:600px"></iframe>${caption ? `<p class="mt-2 text-sm text-gray-600 text-center italic">${caption}</p>` : ''}</div>`
      }
      return `<figure class="my-6 ${alignClass}"><img src="${url}" alt="${alt}" class="w-full rounded-lg shadow-md" />${caption ? `<figcaption class="mt-2 text-sm text-gray-600 text-center italic">${caption}</figcaption>` : ''}</figure>`
    }

    case 'block': {
      const fields = node.fields
      if (!fields) return ''
      if (fields.blockType === 'youtube') {
        const videoUrl = fields.url || ''
        const videoId = extractYouTubeId(videoUrl)
        if (!videoId) return ''
        const caption = fields.caption ? escapeHtml(fields.caption) : ''
        return `<div class="my-6"><div class="relative w-full overflow-hidden rounded-lg shadow-md" style="aspect-ratio:16/9"><iframe src="https://www.youtube.com/embed/${videoId}" class="absolute inset-0 w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen title="${caption || 'Vídeo YouTube'}"></iframe></div>${caption ? `<p class="mt-2 text-sm text-gray-600 text-center italic">${caption}</p>` : ''}</div>`
      }
      if (fields.blockType === 'pdfEmbed') {
        const url = resolveMediaUrlFromValue(fields.file)
        if (!url) return ''
        const altura = typeof fields.altura === 'number' ? fields.altura : 600
        const titulo = fields.titulo ? escapeHtml(fields.titulo) : ''
        return `<div class="my-6">${titulo ? `<h3 class="mb-2 font-semibold text-gray-800">${titulo}</h3>` : ''}<iframe src="${url}#toolbar=1" class="w-full rounded-lg border border-gray-200 shadow-sm" style="height:${altura}px" title="${titulo || 'Documento PDF'}"></iframe><p class="mt-2 text-sm"><a href="${url}" target="_blank" rel="noopener noreferrer" class="text-brand-600 hover:underline">Baixar PDF</a></p></div>`
      }
      return ''
    }

    default:
      if (node.children) {
        return node.children.map((child: LexicalNode) => processNode(child)).join('')
      }
      return ''
  }
}

// Format date to Brazilian format
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ''

  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

// Get image URL from Media object
export function getImageUrl(
  image: Media | string | number | null | undefined,
  size?: 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge' | 'og'
): string {
  if (!image) return '/placeholder.jpg'

  if (typeof image === 'string' || typeof image === 'number') {
    return '/placeholder.jpg'
  }

  // Try to get sized image first
  if (size && image.sizes?.[size]?.url) {
    return image.sizes[size].url
  }

  // Fallback to main URL
  return image.url || '/placeholder.jpg'
}

// Get category name from post
export function getCategoryName(post: Post): string {
  if (!post.categories || post.categories.length === 0) {
    return 'Notícias'
  }

  const firstCategory = post.categories[0]
  if (typeof firstCategory === 'string' || typeof firstCategory === 'number') {
    return 'Notícias'
  }

  return (firstCategory as Category).title || 'Notícias'
}

// Get all category names as tags
export function getCategoryTags(post: Post): string[] {
  const tags: string[] = []

  if (post.categories && post.categories.length > 0) {
    post.categories.forEach(cat => {
      if (typeof cat !== 'string' && typeof cat !== 'number') {
        tags.push((cat as Category).title)
      }
    })
  }

  if (tags.length === 0) {
    tags.push(getCategoryName(post))
  }

  return tags
}
