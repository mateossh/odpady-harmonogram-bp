# odpady-harmonogram-bp

![landing-preview](./public/og.png)

Waste collection schedule for Boguty-Pianki, Poland as ICS (iCalendar) file.

Project inspired by [HLTV Events](https://www.hltv.events/) by [Jack LaFond](https://github.com/jacc)

## Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── .config/              # tool configs
│   ├── .oxlintrc.json
│   ├── Caddyfile
│   └── Corefile
├── public/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css    # TailwindCSS config
├── data.jsonl            # schedule in JSONL format used when generating .ics
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## Testing locally

1. `brew install caddy coredns`
2. update A record and your local IP address in Corefile and Caddyfile
3. update `server.allowedHosts` in astro.config.ts
4. set your local DNS on phone
5. `bun coredns` (in one terminal)
6. `bun caddy` (in another terminal)
7. `bun dev`

## Commands

All commands are run from the root of the project, from a terminal:

| Command               | Action                                           |
| :-------------------- | :----------------------------------------------- |
| `bun install`         | Installs dependencies                            |
| `bun dev`             | Starts local dev server at `localhost:4321`      |
| `bun lint`            | Lint code changes                                |
| `bun build`           | Build your production site to `./dist/`          |
| `bun preview`         | Preview your build locally, before deploying     |
| `bun astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help` | Get help using the Astro CLI                     |

This project was created using `bun init` in bun v1.3.4. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

Icons: [svgl](https://svgl.app) and [Lucide](https://lucide.dev)
