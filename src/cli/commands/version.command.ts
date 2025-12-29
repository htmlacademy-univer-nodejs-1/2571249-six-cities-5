import { readFileSync } from "node:fs";
import { resolve as resolvePath } from "node:path";

import type { Command } from "../command.interface.js";

export class VersionCommand implements Command {
  getName(): string {
    return "--version";
  }

  execute(): void {
    const packageJsonPath = resolvePath(process.cwd(), "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    console.log(packageJson.version);
  }
}

