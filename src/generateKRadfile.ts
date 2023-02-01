import * as fs from "fs/promises";
import * as url from "url";

import { generateRadicals, parseKRadfile } from "./utils/kradfile.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const base = `${__dirname}../../`;
const out = `${base}out/`;

const kanji = await parseKRadfile(`${base}data/kradfile-u`);
const radicals = generateRadicals(kanji);

await fs.mkdir(`${out}kradfile`, { recursive: true });
await fs.writeFile(`${out}kradfile/kanji.json`, JSON.stringify(kanji));
await fs.writeFile(`${out}kradfile/radicals.json`, JSON.stringify(radicals));
