import chalk from "chalk";

import { HelpCommand } from "./commands/help.command.js";
import { VersionCommand } from "./commands/version.command.js";
import { ImportCommand } from "./commands/import.command.js";
import { GenerateCommand } from "./commands/generate.command.js";

import type { Command } from "./command.interface.js";

export class CliManager {
  private commands: Map<string, Command> = new Map();

  constructor() {
    this.registerCommand(new HelpCommand());
    this.registerCommand(new VersionCommand());
    this.registerCommand(new ImportCommand());
    this.registerCommand(new GenerateCommand());
  }

  registerCommand(command: Command): void {
    this.commands.set(command.getName(), command);
  }

  async execute(args: string[]): Promise<void> {
    const commandName = args[0] ?? "--help";
    const command = this.commands.get(commandName);

    if (!command) {
      console.error(chalk.red(`Неизвестная команда: ${chalk.yellow(commandName)}`));
      console.error("Используйте --help для просмотра доступных команд.");
      process.exitCode = 1;
      return;
    }

    const commandArgs = args.slice(1);
    await command.execute(commandArgs);
  }
}

