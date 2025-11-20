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
  }
  children?: LexicalNode[]
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
