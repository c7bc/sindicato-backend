import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { pt } from '@payloadcms/translations/languages/pt'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { ActsCcts } from './collections/ActsCcts'
import { AnnouncementCards } from './collections/AnnouncementCards'
import { Categories } from './collections/Categories'
import { Denuncias } from './collections/Denuncias'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { CTASections } from './collections/CTASections'
import { JuridicoPage } from './collections/JuridicoPage'
import { Media } from './collections/Media'
import { NewsletterSubmissions } from './collections/NewsletterSubmissions'
import { Posts } from './collections/Posts'
import { ServicosPage } from './collections/ServicosPage'
import { SindicalizeSubmissions } from './collections/SindicalizeSubmissions'
import { SindicatoPage } from './collections/SindicatoPage'
import { Sites } from './collections/Sites'
import { Users } from './collections/Users'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Celular',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Computador',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // Configuração de internacionalização para português brasileiro
  i18n: {
    fallbackLanguage: 'pt',
    supportedLanguages: {
      pt,
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
    push: false, // Desabilitado - usar migrations
  }),
  collections: [
    Sites,
    Posts,
    Media,
    Categories,
    Users,
    ContactSubmissions,
    NewsletterSubmissions,
    SindicalizeSubmissions,
    SindicatoPage,
    JuridicoPage,
    ServicosPage,
    CTASections,
    AnnouncementCards,
    ActsCcts,
    Denuncias,
  ],
  cors: [
    getServerSideURL(),
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:5173',
    process.env.NEXT_PUBLIC_FRONTEND_URL,
  ].filter((url): url is string => Boolean(url)),
  globals: [],
  plugins: [
    ...plugins,
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
