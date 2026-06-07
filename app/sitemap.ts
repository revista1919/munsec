// app/sitemap.ts

import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const appDir = path.join(process.cwd(), 'app')

  const routes = fs
    .readdirSync(appDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith('_') &&
        !entry.name.startsWith('(')
    )
    .map((entry) => `/${entry.name}`)

  return [
    {
      url: 'https://www.munsec.org',
      lastModified: new Date(),
      priority: 1,
    },
    ...routes.map((route) => ({
      url: `https://www.munsec.org${route}`,
      lastModified: new Date(),
      priority: 0.8,
    })),
  ]
}