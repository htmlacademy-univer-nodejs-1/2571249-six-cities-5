import type { Command } from "../command.interface.js";

export class HelpCommand implements Command {
  getName(): string {
    return "--help";
  }

  execute(): void {
    console.log(
      "Программа для подготовки данных для REST API сервера.\n\n" +
      "Пример: cli.js --<command> [--arguments]\n\n" +
      "Команды:\n\n" +
      " --version:                   # выводит номер версии\n" +
      " --help:                      # печатает этот текст\n" +
      " --import <path>:             # импортирует данные из TSV\n" +
      " --generate <n> <path> <url>  # генерирует произвольное количество тестовых данных"
    );
  }
}

