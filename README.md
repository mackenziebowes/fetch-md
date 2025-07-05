![fetch-md: parse the planet]()

# fetch-md: parse the planet!

## What does it do?

CLI version of turndown - give it a url of text heavy content like (docker docs)[https://docs.docker.com/engine/network/] and get nice clean markdown for use with local LLMs.

### Outputs

Outputs are stored by default in a cache folder in your HOME path, you can name them by passing a second arg (see Usage later on)

## Installation

```bash
git clone https://github.com/mackenziebowes/fetch-md.git ~/your-install-here
```

```bash
bun install
```

```bash
bun link
```

## Usage

### in CLI help tool

```bash
fetch-md -h
```

### default operation

```bash
fetch-md fetch <url> <output file name>
```

The program uses `join` from `node:path` under the hood, so the filename can be a path/to/thing for nesting.

#### Default Cache

We add a `fetch-md` directory to your HOME path for storing stuff, it's otherwise flat after that.

---

This project was created using `bun init` in bun v1.2.16. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
