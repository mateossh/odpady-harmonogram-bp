import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";
/*
NOTE from readme:
> It might also break your ability to send non-text data (i.e. images) from SSR
  pages. Maybe just don't use this for an SSR site, only use it for SSGs.
*/
import { stripHTMLComments } from "@zade/vite-plugin-strip-html-comments";

// https://astro.build/config
export default defineConfig({
  site: "http://odpady.zochow.ski",
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ["@takumi-rs/image-response"],
    },
    optimizeDeps: {
      exclude: ["@takumi-rs/image-response"],
    },
  },
  // @ts-expect-error types mismatch
  integrations: [stripHTMLComments(), sitemap()],
  server: {
    allowedHosts: ["odpady.zochow.ski"],
  },
});
