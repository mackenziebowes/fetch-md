import { describe, it, expect, jest, mock } from "bun:test";
import { fetchFn } from "./fetch";
import cache from "../data/cache";

mock.module("../data/cache", () => ({
	ensure: jest.fn(),
	name: "mock-cache",
}));

mock.module("node:path", () => ({
	join: jest.fn((...args: string[]) => args.join("/")),
}));

mock.module("bun", () => ({
	write: jest.fn(async () => true),
}));

describe("fetchFn", () => {
	it("throws an error if no URL is provided", async () => {
		await expect(fetchFn([])).rejects.toThrow("First argument must be a url");
	});

	it("logs an error and exits if the fetch fails", async () => {
		const mockedFetch = mock(fetch).mockResolvedValue(
			new Response(null, {
				status: 404,
				headers: { "Content-Type": "text/html" },
			})
		);
		global.fetch = mockedFetch as unknown as typeof fetch;

		const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
			throw new Error("Error: HTTP 404");
		});
		const consoleSpy = jest
			.spyOn(console, "error")
			.mockImplementation(() => {});
		try {
			await fetchFn(["https://example.com"]);
		} catch (e) {
			expect(consoleSpy).toHaveBeenCalledWith("Error: HTTP 404");
			expect(exitSpy).toHaveBeenCalledWith(1);
			consoleSpy.mockRestore();
			exitSpy.mockRestore();
		}
	});

	it("saves markdown to a default file if no output is specified", async () => {
		const mockedFetch = mock(fetch).mockResolvedValue(
			new Response("<h1>Title</h1><p>Content</p>", {
				status: 200,
				headers: { "Content-Type": "text/html" },
			})
		);
		global.fetch = mockedFetch as unknown as typeof fetch;

		const writeSpy = jest.spyOn(Bun, "write");
		try {
			await fetchFn(["https://example.com"]);
			expect(cache.ensure).toHaveBeenCalled();
			expect(writeSpy).toHaveBeenCalledWith(
				expect.stringMatching(/mock-cache\/https:\/\/example\.com-.*\.md/),
				expect.stringContaining("# Title\n\nContent")
			);
		} catch (e) {}

		writeSpy.mockRestore();
	});

	it("saves markdown to the specified output file", async () => {
		const mockedFetch = mock(fetch).mockResolvedValue(
			new Response("<h1>Title</h1><p>Content</p>", {
				status: 200,
				headers: { "Content-Type": "text/html" },
			})
		);
		global.fetch = mockedFetch as unknown as typeof fetch;

		const writeSpy = jest.spyOn(Bun, "write");
		try {
			await fetchFn(["https://example.com", "output.md"]);
			expect(cache.ensure).toHaveBeenCalled();
			expect(writeSpy).toHaveBeenCalledWith(
				"mock-cache/output.md",
				expect.stringContaining("# Title\n\nContent")
			);
		} catch (e) {}

		writeSpy.mockRestore();
	});
});
