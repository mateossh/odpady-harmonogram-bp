import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import umami from "@yeskunall/astro-umami";
import { stripHTMLComments } from "@zade/vite-plugin-strip-html-comments";
import og from "astro-og";
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://odpady.zochow.ski",
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
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Geist",
      cssVariable: "--font-geist",
    },
    {
      provider: fontProviders.google(),
      name: "Fraunces",
      cssVariable: "--astro-font-fraunces",
    },

    {
      provider: fontProviders.google(),
      name: "Outfit",
      cssVariable: "--astro-font-outfit",
    },
    {
      provider: fontProviders.google(),
      name: "Sometype Mono",
      cssVariable: "--font-sometype-mono",
    },
  ],
});
