#!/usr/bin/env node

import { CliManager } from "./cli-manager.js";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const cliManager = new CliManager();
  await cliManager.execute(args);
}

main();
