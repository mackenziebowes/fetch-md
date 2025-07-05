import log from "./log";
import { join } from "node:path";

export type Command = {
	name: string;
	description: string;
	instructions: string;
	run: (args: string[]) => Promise<void> | void;
};

const commands = new Map<string, Command>();

export function registerCommand(cmd: Command) {
	commands.set(cmd.name, cmd);
}

export async function runCLI(argv = Bun.argv.slice(2)) {
	const [name, ...args] = argv;
	// -- TS Defense --
	if (!name) {
		log.single.err("ARGS", "No Argument Supplied");
		return;
	}
	if (["-h", "--help"].includes(name)) {
		const multiLog: any[] = [];
		multiLog.push({
			t: "About",
			m: "fetch-md is a tool for collecting structured HTML (docs, blog content, etc) and converting it to Markdown for further processing.",
		});
		multiLog.push({
			t: "Commands",
			m: "Available Commands",
		});
		for (const cmd of commands.values()) {
			multiLog.push({
				t: cmd.name,
				m: `${cmd.description}\n  |->  [Instructions]: ${cmd.instructions}\n`,
			});
		}
		multiLog.push({
			t: "More Info",
			m: "See https://fetchmd.studiolongbow.com for more detailed instructions",
		});
		log.multi.info(multiLog);
		return;
	}

	if (["-v", "--version"].includes(name)) {
		const pkgLocation = join("../../", "package.json");
		const pkg = await import(pkgLocation);
		log.multi.info([
			{
				t: "Package Name",
				m: pkg.name,
			},
			{
				t: "Package Version",
				m: pkg.version,
			},
		]);
		return;
	}

	const command = commands.get(name);
	if (!command) {
		log.single.err("Command", "No Command Supplied");
		process.exit(1);
	}

	try {
		await command.run(args);
	} catch (err) {
		const multilog: any[] = [];
		multilog.push({
			t: "Panic",
			m: `Failed to run ${name}`,
		});
		if (err instanceof Error) {
			multilog.push({
				t: "Error",
				m: err.message,
			});
		} else {
			multilog.push({
				t: "Unknown Error",
				m: JSON.stringify(err),
			});
		}
		log.multi.err(multilog);
		process.exit(1);
	}
}
