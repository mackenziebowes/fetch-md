import figlet from "figlet";

const infoLogSingle = (title: string, message: string) => {
	console.log("");
	console.info("  [INFO]");
	console.info(`  [${title}]: ${message}`);
	console.log("");
};

type MultiLogArgs = {
	t: string;
	m: string;
}[];

const infoLogMulti = (args: MultiLogArgs) => {
	console.log("");
	console.info("  [INFO]");
	for (const arg of args) {
		console.info(`  [${arg.t}]: ${arg.m}`);
	}
	console.log("");
};

const warnLogSingle = (title: string, message: string) => {
	console.log("");
	console.warn("  [WARNING]");
	console.warn(`  [${title}]: ${message}`);
	console.log("");
};

const warnLogMulti = (args: MultiLogArgs) => {
	console.log("");
	console.warn("  [WARNING]");
	for (const arg of args) {
		console.warn(`  [${arg.t}]: ${arg.m}`);
	}
	console.log("");
};

const errLogSingle = (title: string, message: string) => {
	console.log("");
	console.error("  [ERROR]");
	console.error(`  [${title}]: ${message}`);
	console.log("");
};

const errLogMulti = (args: MultiLogArgs) => {
	console.log("");
	console.error("  [ERROR]");
	for (const arg of args) {
		console.error(`  [${arg.t}]: ${arg.m}`);
	}
	console.log("");
};

const title = (title: string, subtitle?: string) => {
	console.clear();
	console.log();
	console.log(figlet.textSync(title, "ANSI Regular"));
	console.log(`  [${subtitle}]`);
	console.log();
};

const log = {
	single: {
		info: infoLogSingle,
		warn: warnLogSingle,
		err: errLogSingle,
	},
	multi: {
		info: infoLogMulti,
		warn: warnLogMulti,
		err: errLogMulti,
	},
	title,
};

export default log;
