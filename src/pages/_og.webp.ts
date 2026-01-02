import { Renderer } from "@takumi-rs/core";
import { fromJsx } from "@takumi-rs/helpers/jsx";
import { ImageResponse } from "@takumi-rs/image-response";
import { write } from "bun";

import type { APIRoute } from "astro";

const markup = `<div style="background-color: white; color: black;">
  bye, world
</div>`;

const renderer = new Renderer({});
const node = await fromJsx(markup);
const webp = await renderer.render(node, {
  width: 1200,
  height: 630,
  format: "webp", // "webp" is recommended as well.
});

// NOTE: to powinno "działać"
await write("./og.webp", webp.buffer);

const qwer = new Uint8Array(webp).buffer;

export const GET: APIRoute = async () => {
  return new Response(qwer);

  // return new ImageResponse(webp.buffer, {
  //   width: 1200,
  //   height: 630,
  //   format: "webp",
  //   headers: {
  //     "Cache-Control": "public, max-age=3600",
  //   },
  // });
};
