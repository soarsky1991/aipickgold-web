# aipickgold showcase

A small, static Vite + vanilla TypeScript site for the indie studio aipickgold. It is designed as both a portfolio front page and a future owned-traffic entry point for each playable game.

## Local development

```bash
npm install
npm run dev
```

The production build is fully static and is written to `dist/`:

```bash
npm run build
npm run preview
```

## Add or update games

Edit `public/games.json`. The file is the source of truth for the home-page game cards and the reusable `game.html` play template. Each game currently uses this shape:

```json
{
  "id": "unique-game-id",
  "title": "Game title",
  "status": "coming-soon",
  "description": "A short description.",
  "playUrl": null
}
```

For a playable game, set `status` to `playable` and set `playUrl` to the iframe URL. Add the resulting `game.html?id=...` URL to `public/sitemap.xml` when adding a new game.

## Deploying

Build the site first with `npm run build`, then configure the hosting target to publish the `dist/` directory. No server runtime, API route, or SSR is required.

### Cloudflare Pages

1. Create a Pages project and connect the repository, or upload the built `dist/` directory.
2. For a connected repository, use `npm install` as the install command and `npm run build` as the build command. Set the output directory to `dist`.
3. In the Pages project, open **Custom domains** and add `YOUR-SUBDOMAIN.aipickgold.com`.
4. At the DNS provider, create the CNAME record requested by Cloudflare for `YOUR-SUBDOMAIN` and wait for verification.

### GitHub Pages

1. Publish the repository through GitHub Pages using a workflow or a static-site action that runs `npm install`, `npm run build`, and uploads `dist/` as the Pages artifact.
2. In the repository's Pages settings, select the workflow as the source.
3. Enter `YOUR-SUBDOMAIN.aipickgold.com` in the Pages **Custom domain** field.
4. Create the CNAME record requested by GitHub Pages at the DNS provider. The `public/CNAME` file is intentionally a placeholder; replace its comment with the exact custom domain only when you are ready to use it.

### Vercel

1. Import the repository into Vercel.
2. Set the framework preset to **Vite**, the build command to `npm run build`, and the output directory to `dist`.
3. In the project settings, add `YOUR-SUBDOMAIN.aipickgold.com` under **Domains**.
4. Create the CNAME record shown by Vercel at the DNS provider and wait for the domain to become valid.

## Custom-domain note

DNS is intentionally outside this project. Keep `YOUR-SUBDOMAIN.aipickgold.com` as a placeholder in the documentation until the final subdomain is chosen. For GitHub Pages specifically, update `public/CNAME` with the final domain before building and deploying; for Cloudflare Pages and Vercel, the custom-domain setting is normally the authoritative configuration.
