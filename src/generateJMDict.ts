import * as fs from "fs/promises";
import * as url from "url";

import { groupByKanji, loadJMDict } from "./jmdict.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const base = `${__dirname}../../`;
const path = `${base}data/jmdict.xml`;
const out = `${base}out/`;

const parsed = await loadJMDict(path);
const { entries: _, byKanji } = groupByKanji(parsed);

// remove word lookup for now because it's really bulky
// await fs.mkdir(`${out}by-word/`, { recursive: true });
// await Promise.all(
//   Object.entries(entries).map(async ([word, entries]) => {
//     await fs.writeFile(`${out}by-word/${word}.json`, JSON.stringify(entries));
//   })
// );

await fs.mkdir(`${out}by-kanji/`, { recursive: true });

await Promise.all(
  Object.entries(byKanji).map(async ([kanji, entries]) => {
    await fs.writeFile(`${out}by-kanji/${kanji}.json`, JSON.stringify(entries));
  })
);
