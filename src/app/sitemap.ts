import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fossai.netlify.app';

  // Add all your static pages here
  const staticRoutes = [
    '/',
    '/about',
    '/account-settings',
    '/api-docs',
    '/contact',
    '/dashboard',
    '/docs',
    '/features',
    '/file-report',
    '/login',
    '/notes',
    '/privacy-policy',
    '/signup',
    '/terms-conditions'
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }));
}