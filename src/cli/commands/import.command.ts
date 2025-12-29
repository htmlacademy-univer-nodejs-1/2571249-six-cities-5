import { createReadStream } from "node:fs";
import { resolve as resolvePath } from "node:path";
import { createInterface } from "node:readline";

import chalk from "chalk";

import { printOffer } from "../../utils/print.js";
import type { Offer } from "../../types/entities.js";
import { parseTSVLine, parseTSVRow } from "../../utils/tsv.js";

import type { Command } from "../command.interface.js";

function validateArgs(args: string[]): void {
  if (args.length < 1) {
    throw new Error("Неправильные аргументы. Используйте: --import <filepath>");
  }
}

function processTSVLine(
  line: string,
  headers: string[] | null
): { headers: string[] | null; offer: Offer | null } {
  if (!headers) {
    return { headers: parseTSVLine(line), offer: null };
  }

  const offer = parseTSVRow(parseTSVLine(line), headers);
  return { headers, offer };
}

function printImportResult(count: number): void {
  console.log(
    chalk.green(
      `Успешно импортировано ${chalk.bold(String(count))} предложений.\n`
    )
  );
}

async function readTSVFile(filePath: string): Promise<number> {
  const fileStream = createReadStream(filePath);
  const rl = createInterface({
    input: fileStream,
  });

  let headers: string[] | null = null;
  let importedCount = 0;

  return new Promise<number>((resolve) => {
    rl.on("line", (line) => {
      const result = processTSVLine(line, headers);
      headers = result.headers;

      if (result.offer) {
        importedCount++;
        printOffer(result.offer);
      }
    });

    rl.on("close", () => {
      resolve(importedCount);
    });
  });
}

export class ImportCommand implements Command {
  getName(): string {
    return "--import";
  }

  async execute(args: string[]): Promise<void> {
    try {
      validateArgs(args);

      const filePath = args[0];
      const fullPath = resolvePath(process.cwd(), filePath);

      const importedCount = await readTSVFile(fullPath);
      printImportResult(importedCount);
    } catch (error) {
      console.error(chalk.red(`Ошибка: ${error instanceof Error ? error.message : String(error)}`));
      process.exitCode = 1;
    }
  }
}

