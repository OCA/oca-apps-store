/**
 * Build the URL of a file of the `public/` directory, taking the base URL of the application
 * into account.
 *
 * Absolute paths ("/logo-192.png") are resolved from the domain root: that is right while
 * the application is served at the root (apps.odoo-community.org), but wrong as soon as it is
 * served from a sub-path, like a pull request preview on GitHub Pages
 * (https://oca.github.io/oca-apps-store/pr-<n>/).
 */
export function useAssetUrl(path: string): string {
  const baseURL = useRuntimeConfig().app.baseURL || '/'
  return `${baseURL.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}
