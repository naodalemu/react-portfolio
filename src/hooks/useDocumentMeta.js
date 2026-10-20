import { useEffect } from 'react'
import { site } from '../content'

function setMeta(selector, attribute, value) {
  const element = document.head.querySelector(selector)
  if (element && value) element.setAttribute(attribute, value)
}

/**
 * Keeps the title and sharing metadata in sync during client-side navigation.
 * The initial HTML for every route is generated at build time with the same
 * values (see plugins/content.js), so crawlers do not depend on this hook.
 */
export function useDocumentMeta({ title, description, path = '/' }) {
  useEffect(() => {
    const fullTitle = title ?? site.seo.title
    const fullDescription = description ?? site.seo.description
    document.title = fullTitle
    setMeta('meta[name="description"]', 'content', fullDescription)
    setMeta('meta[property="og:title"]', 'content', fullTitle)
    setMeta('meta[property="og:description"]', 'content', fullDescription)
    if (site.url) {
      setMeta('link[rel="canonical"]', 'href', site.url + path)
      setMeta('meta[property="og:url"]', 'content', site.url + path)
    }
  }, [title, description, path])
}
