#!/usr/bin/env bun

import { runCLI, registerCommand } from "./src/core/cli";
import { FetchCmd } from "./src/functions/fetch";
const cmds = [FetchCmd];
async function main() {
	cmds.forEach((cmd) => {
		registerCommand(cmd);
	});
	runCLI();
}

main();
