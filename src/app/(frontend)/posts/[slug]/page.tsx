import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ShareButtons } from '@/components/preview'
import {
  lexicalToHtml,
  formatDate,
  getImageUrl,
  getCategoryTags,
} from '@/utilities/previewHelpers'
import PageClient from './page.client'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function PostPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/posts/' + slug
  const post = await queryPostBySlug({ slug })

  if (!post) return <PayloadRedirects url={url} />

  // Transform post data
  const imageUrl = getImageUrl(post.heroImage, 'large')
  const date = formatDate(post.publishedAt)
  const tags = getCategoryTags(post)
  const contentHtml = lexicalToHtml(post.content)
  const description = post.meta?.description || ''

  return (
    <div className="flex min-h-screen flex-col">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="flex w-full flex-col items-center">
              {/* Metadata */}
              <div className="flex w-full flex-col items-center text-center">
                <span className="text-sm font-semibold text-gray-500 md:text-base">
                  Publicado em {date}
                </span>
                <h1 className="mt-3 text-display-md font-semibold text-gray-900 md:text-display-lg">
                  {post.title}
                </h1>
                {description && (
                  <p className="mt-4 text-lg text-tertiary md:mt-6 md:text-xl">{description}</p>
                )}
              </div>

              {/* Category Tags */}
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex bg-utility-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 ring-1 ring-inset ring-utility-brand-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Featured Image */}
            {imageUrl && imageUrl !== '/placeholder.jpg' && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="mt-8 h-60 w-full rounded object-cover md:mt-12 md:h-120"
                src={imageUrl}
                alt={
                  typeof post.heroImage === 'object' && post.heroImage?.alt
                    ? post.heroImage.alt
                    : post.title || ''
                }
              />
            )}
          </div>
        </section>

        {/* Article Content */}
        <section className="bg-white py-8 md:py-12">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mx-auto max-w-3xl">
              {/* Main Content */}
              <article
                className="prose prose-lg max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              {/* Share Section */}
              <div className="mt-12 border-t border-gray-200 pt-8">
                <ShareButtons url={`/posts/${slug}`} title={post.title} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
