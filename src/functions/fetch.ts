import TurndownService from "turndown";
const turndownPluginGfm = require("turndown-plugin-gfm");
import type { Command } from "../core/cli";
import cache from "../data/cache";
import { join } from "node:path";

export const FetchCmd: Command = {
	name: "fetch",
	description: "fetches & converts a url",
	instructions: "",
	run: (args) => fetchFn(args),
};

export const fetchFn = async (args: string[]) => {
	const [url, output] = args;
	if (!url) {
		throw new Error("First argument must be a url");
	}
	try {
		const res = await fetch(url);
		if (!res.ok) {
			console.error(`Error: HTTP ${res.status}`);
			process.exit(1);
		}
		const html = await res.text();

		// Clean and convert using Turndown
		const td = new TurndownService({ headingStyle: "atx" });
		td.use(turndownPluginGfm.gfm);
		const markdown = td.turndown(html);

		cache.ensure();

		if (output) {
			await Bun.write(join(cache.name, output), markdown);
			console.log(`Saved Markdown to ${output}`);
		} else {
			const now = new Date();
			const iso = now.toISOString();
			const sanitizedUrl = url.replace(/[^a-zA-Z0-9]/g, "_");
			const fileName = `${sanitizedUrl}-${iso}.md`;
			await Bun.write(join(cache.name, fileName), markdown);
		}
	} catch (e) {
		console.error("Fetch or conversion failed:", e);
		process.exit(1);
	}
};
