import { Renderer } from "@takumi-rs/core";
import { fromJsx } from "@takumi-rs/helpers/jsx";
import ImageResponse from "@takumi-rs/image-response";
import { write } from "bun";

// import { html } from "satori-html";

const markup = `<div style="background-color: white; color: black;">
  bye, world
</div>`;

const renderer = new Renderer({});
const node = await fromJsx(markup);
const png = await renderer.render(node, {
  width: 600,
  height: 400,
  format: "png",
});

// NOTE: to "działa" -> daje valid plik png
await write("./og.png", png.buffer);

const a = png.buffer;

const arr = new Uint8ClampedArray(png.buffer);
const qwer = arr.slice();

export async function GET() {
  // NOTE: to NIE DZIAŁA !!!!! >:(
  return new Response(arr);

  // return new ImageResponse(png.buffer, {
  //   width: 600,
  //   height: 400,
  //   format: "png",
  //   headers: {
  //     "Cache-Control": "public, max-age=3600",
  //     "Content-Type": "image/png",
  //   },
  // });
}
