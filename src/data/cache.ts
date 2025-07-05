import fs from "node:fs";
import { cwd } from "node:process";
import { join } from "node:path";

const CACHE_DEFAULT_NAME = "fetch-md";

const getRoot = () => {
	const here = cwd();
	const homeDir = process.env.HOME || here;
	return join(homeDir, CACHE_DEFAULT_NAME);
};

const checkCacheExists = () => {
	const dir = getRoot();
	const exists = fs.existsSync(dir);
	if (!exists) return false;
	const isDir = fs.statSync(dir).isDirectory();
	if (!isDir) {
		fs.rmSync(dir);
		return false;
	}
	return true;
};

const ensureCacheExists = () => {
	const exists = checkCacheExists();
	if (!exists) {
		const dir = getRoot();
		fs.mkdirSync(dir);
	}
};

const cache = {
	check: checkCacheExists,
	ensure: ensureCacheExists,
	name: getRoot(),
};

export default cache;
