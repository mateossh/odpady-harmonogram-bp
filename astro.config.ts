import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";
/*
NOTE from readme:
> It might also break your ability to send non-text data (i.e. images) from SSR
  pages. Maybe just don't use this for an SSR site, only use it for SSGs.
*/
import { stripHTMLComments } from "@zade/vite-plugin-strip-html-comments";

import og from "astro-og";

import umami from "@yeskunall/astro-umami";

// https://astro.build/config
export default defineConfig({
  site: "http://odpady.zochow.ski",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    // @ts-expect-error types mismatch
    stripHTMLComments(),
    sitemap(),
    og(),
    umami({
      id: "0c575de9-f36d-457b-99e3-25db16ead1aa",
      endpointUrl: "https://q.zochow.ski",
    }),
  ],
  server: {
    allowedHosts: ["odpady.zochow.ski"],
  },
});
