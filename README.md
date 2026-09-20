# OCA Appstore

## Setup

Node 24+ is required. You can use NVM to manage your Node version.
Make sure to install the dependencies:

```bash
# pnpm
pnpm install
```

## Setup API Proxy (optional)

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# pnpm
pnpm run dev

```

## Production

Build the application for production:

```bash
# pnpm
pnpm run build

```

Locally preview production build:

```bash
# pnpm
pnpm run preview

```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Pull request previews

Every pull request gets a build of its rendering (single page application) published on the
GitHub Pages site of this repository:

```
https://oca.github.io/oca-apps-store/pr-<number>/
```

Two workflows do the job:

- **`Preview build (PR)`** (`.github/workflows/pages-preview.yml`) — on `pull_request`,
  builds the merge commit with `OCA_PREVIEW=true` and the base URL of the preview, and
  uploads the result as an artifact. It holds **no secret** and runs with a read-only token,
  because the code of a pull request is untrusted.
- **`Preview deploy (GitHub Pages)`** (`.github/workflows/pages-deploy.yml`) — on
  `workflow_run`, downloads the artifact, checks it (no absolute path, no `..`, no symlink,
  bounded size), publishes it to the `gh-pages` branch under `pr-<n>/` and comments the link
  on the pull request. The same workflow publishes the site root (the current `main`) on every
  push to `main` and removes the previews of closed pull requests once a day (the 15 most
  recent previews are kept).

Deep links (`/pr-12/modules/foo` as well as `/modules/foo`) are handled by a dispatcher served
as the site 404 (`.github/preview/404.html`), because GitHub Pages only ever serves the
`404.html` of the site root, never the one of a sub-directory.

Nothing has to be installed or configured on the fork of a contributor: the build reads the
pull request, whatever its origin, and the result is published here, in a directory named
after the pull request number.

### Required repository configuration

1. **Settings → Pages** → Source: *Deploy from a branch* → branch `gh-pages`, folder `/ (root)`.
2. **Settings → Actions → General → Workflow permissions** → *Read and write permissions*, so
   the deploy job can push to `gh-pages` with the workflow `GITHUB_TOKEN`.
3. Optional: repository variables `NUXT_PUBLIC_SEARCH_URL`, `NUXT_PUBLIC_SEARCH_KEY` and
   `NUXT_PUBLIC_SEARCH_INDICES_*` to override the public search settings.

Because a preview is served from a sub-path, references to files of `public/` go through
`useAssetUrl()` (see `app/composables/useAssetUrl.ts`): a path like `/logo-192.png` would
otherwise be resolved from the domain root and return a 404.

`OCA_PREVIEW=true` switches the build to client side rendering (SPA) and disables indexing,
source maps, public asset compression, the sitemap and the service worker. Without it the
configuration is the production one, unchanged.
