import { createReadStream } from "fs";
import * as fs from "fs/promises";
import type { Element } from "kanjidic2stream";
import { Parser } from "kanjidic2stream";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const base = `${__dirname}../../`;
const path = `${base}data/kanjidic2.xml`;
const out = `${base}out/`;

// Read the KANJIDIC file and starts parsing.
const stream = createReadStream(path, "utf8").pipe(new Parser());

await fs.mkdir(out, { recursive: true });
await fs.mkdir(`${out}by-literal/`, { recursive: true });

const promises: Promise<void>[] = [];

// Print the KANJIDIC database version followed by each character.
// Output is like:
//   database version: 2019-313
//   character: 亜
//   character: 唖
//   character: 娃
//   ...
stream.on("data", (e: Element) => {
  if (e.type === "character") {
    const literal = e.literal;
    const unicode = literal
      // Normally we use NFKC because we're using Japanese.
      // https://towardsdatascience.com/difference-between-nfd-nfc-nfkd-and-nfkc-explained-with-python-code-e2631f96ae6c
      // However, normalization has multiple characters which map to the same codepoint, e.g.
      // 練 vs 練
      // .normalize("NFKC")
      // Thus we encode to hex here to explicitly opt out of normalization.
      .codePointAt(0)
      ?.toString(16)
      .toUpperCase();
    if (!unicode) {
      throw new Error(`Unknown unicode codepoint for ${literal}.`);
    }
    promises.push(
      (async () => {
        await fs.writeFile(
          `${out}by-literal/U+${unicode}.json`,
          JSON.stringify(e)
        );
        console.log("wrote character", literal);
      })()
    );
  }
});

await new Promise<void>((resolve) => {
  stream.on("end", () => {
    resolve();
  });
});

await Promise.allSettled(promises);

console.log(`Indexed ${promises.length} characters`);
