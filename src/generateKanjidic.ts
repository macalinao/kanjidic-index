import { createReadStream } from "fs";
import * as fs from "fs/promises";
import type { Element } from "kanjidic2stream";
import { Parser } from "kanjidic2stream";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const base = `${__dirname}../../`;
const path = `${base}kanjidic2.xml`;
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
    promises.push(
      (async () => {
        await fs.writeFile(
          `${out}by-literal/${e.literal}.json`,
          JSON.stringify(e)
        );
        console.log("wrote character", e.literal);
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
