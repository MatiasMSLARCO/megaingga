export type SiteMode = 'landing' | 'multipage'

export const SITE_MODE_STORAGE_KEY = 'megaingga_site_mode'

export function readSiteMode(): SiteMode {
  const stored = localStorage.getItem(SITE_MODE_STORAGE_KEY)
  return stored === 'multipage' ? 'multipage' : 'landing'
}
