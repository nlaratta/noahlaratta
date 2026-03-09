const productionBasePath =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_BASE_PATH || '/noahlaratta'
    : ''

export const siteBasePath =
  productionBasePath === '/' ? '' : productionBasePath.replace(/\/$/, '')

export const isInternalHref = (href: string) =>
  href.startsWith('/') && !href.startsWith('//')

export const withBasePath = (href: string) => {
  if (!isInternalHref(href)) {
    return href
  }

  if (!siteBasePath) {
    return href
  }

  return `${siteBasePath}${href}`
}
