import * as fs from "fs/promises";
import { Iconv } from "iconv";
import invariant from "tiny-invariant";

export interface KRadfile {
  /**
   * Map of kanji to its radicals.
   */
  [kanji: string]: readonly string[];
}

export interface Radkfile {
  /**
   * Map of radicals to its kanji.
   */
  [radical: string]: readonly string[];
}

export const generateRadicals = (kradfile: KRadfile): Radkfile => {
  const radicals: Record<string, string[]> = {};
  Object.entries(kradfile).forEach(([kanji, kradicals]) => {
    kradicals.forEach((radical) => {
      radicals[radical] = radicals[radical] || [];
      radicals[radical]?.push(kanji);
    });
  });
  return radicals;
};

export async function parseKRadfile(path: string): Promise<KRadfile> {
  const data = await fs.readFile(path);
  const iconv = new Iconv("EUC-JP", "UTF-8");
  const converted = iconv.convert(data).toString();
  const list = converted
    .split("\n")
    .filter((l) => !l.startsWith("#") && !!l)
    .map((line) => {
      const [kanji, radicals] = line.split(" : ");
      if (!kanji) {
        throw new Error(`Kanji missing: ${line}`);
      }
      invariant(radicals, "radicals missing");
      return {
        kanji,
        radicals: radicals.split(" "),
      };
    });
  const kanji: Record<string, string[]> = {};
  const radicals: Record<string, string[]> = {};
  list.forEach((el) => {
    kanji[el.kanji] = el.radicals;
    el.radicals.forEach((radical) => {
      radicals[radical] = radicals[radical] || [];
      radicals[radical]?.push(el.kanji);
    });
  });
  return kanji;
}
