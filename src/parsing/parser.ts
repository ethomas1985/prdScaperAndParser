require('source-map-support').install();

import * as fs from "fs";
import * as path from "path";
import * as commandLineArgs from "command-line-args";
import * as Enumerable from "linq";
import { JSDOM } from "jsdom";
import { SpellParser } from './spells/spellParser';

import { Logger, LogInvocation } from '../logger';

const HTML_EXTENSION = ".html";
const JSON_EXTENSION = ".json";

interface IEphemeralState {
	basePath: string;
	sourcePath: string;
	resultPath: string;

	contents?: string;

	document?: Document;

	element?: Element;

	object?: {};
}

class Parser {
	private parsers: IParser[];
	constructor(
		private sourceDir: string,
		private outDir: string) {
		Logger.info(`Instantiating new Parser with sourceDir "${sourceDir}" and outDir "${outDir}"`);
		this.parsers = [];
	}

	@LogInvocation
	register<T extends IParser>(parser: T): Parser {
		this.parsers.push(parser);

		return this;
	}

	@LogInvocation
	parse() {
		const self = this;
		Enumerable
			.from(Parser.scanDirectory(self.sourceDir))
			.select(x => self.loadFile(x))
			.select(x => self.parseToHtml(x))
			.select(x => self.getImportantPart(x))
			.select(x => self.toJson(x))
			.forEach(x => self.writeToFile(x));
	}

	@LogInvocation
	private static scanDirectory(dir: string, depth: number = 0): string[] {
		const indent = Array(depth).join("    ");
		// Logger.INFO(`${indent}scanning directory: "${dir}"`);
		let files: string[] = [];

		const contents = fs.readdirSync(dir);

		for (const entry of contents) {
			const absolutePath = path.join(dir, entry);
			const stats = fs.statSync(absolutePath);
			if (stats.isDirectory()) {
				files = files.concat(Parser.scanDirectory(absolutePath, depth + 1));
				continue;
			}

			if (Parser.endsWith(absolutePath, HTML_EXTENSION)) {
				files = files.concat(absolutePath);
			}
		}
		// Logger.INFO(`${indent}<- returning ${files.length} file(s)`);
		return files;
	}

	@LogInvocation
	private loadFile(filePath: string): IEphemeralState {
		const basePath = this.sourceDir;
		const sourcePath = path.relative(this.sourceDir, filePath);
		const resultPath = path.resolve(path.join(this.outDir, [sourcePath.split('.')[0], JSON_EXTENSION].join("")));

		const state = {
			basePath: basePath,
			sourcePath: sourcePath,
			resultPath: resultPath,
			contents: fs.readFileSync(filePath, "utf8"),
			toJSON: () => `IEphemeralState|${sourcePath}`
		};
		Logger.debug(`state: {`);
		Logger.debug(`\tbasePath: "${state.basePath}",`);
		Logger.debug(`\tsourcePath: "${state.sourcePath}",`);
		Logger.debug(`\tresultPath: "${state.resultPath}"`);
		Logger.debug(`}`);

		return state;
	}

	@LogInvocation
	private parseToHtml(state: IEphemeralState): IEphemeralState {
		state.document = new JSDOM(state.contents).window.document;

		return state;
	}

	@LogInvocation
	private getImportantPart(state: IEphemeralState): IEphemeralState {
		if (!state.document) {
			throw new Error("Element was undefined!");
		}

		const element = state.document.querySelector("div.body-content div.body");
		Logger.info(`filtering down to what we care about`);

		if (element) {
			state.element = element;
		} else {
			Logger.warning("Did not find any elements...");
		}

		return state;
	}

	@LogInvocation
	private toJson(state: IEphemeralState): IEphemeralState {
		if (!state.element) {
			Logger.warning("Element was undefined!");
			return state;
		}

		const element = state.element;

		for (let parser of this.parsers) {
			const returned = parser.toJson(element);
			if (returned.success) {
				Logger.info("Parser succeeded!");

				state.object = returned.result;
				break;
			}
		}

		// if (!state.object) {
		// 	throw new Error("failed to find a registered Parser for file!");
		// }

		return state;
	}

	@LogInvocation
	private writeToFile(state: IEphemeralState): void {
		if (!state.object) {
			Logger.warning(`No output object! ${JSON.stringify(state, Parser.replacer)}`);
			return;
		}
		Logger.debug(`state object: "${JSON.stringify(state, Parser.replacer)}"`);
		Logger.info(`writing out to file: "${state.resultPath}"`);

		if (!fs.existsSync(state.resultPath)) {
			fs.mkdirSync(path.dirname(state.resultPath));
		}

		/*
		 * @todo this needs to figure out a file/folder structure to save the file to...
		 *
		 * might need each step to pass a STATE object that stores each steps result along
		 *  with the original filename????
		 */
		fs.writeFileSync(state.resultPath, JSON.stringify(state.object, null, 4));
	}

	@LogInvocation
	private static endsWith(x: string, suffix: string): boolean {
		const index = x.indexOf(suffix);
		const result = index === (x.length - suffix.length);
		// console.debug(`TESTING THAT "${x}" ENDS IN "${suffix}"|${result}|${index} === ${x.length - suffix.length}`);
		return result;
	}

	private static replacer(key: string, value: any): any {
		if (key === "basePath" || key === "sourcePath" || key === "resultPath") {
			return value;
		}
		return "";
	}
}

function main(): void {
	const optionDefinitions: commandLineArgs.OptionDefinition[] = [
		{ name: "sourceDir", type: String },
		{ name: "outDir", type: String },
		{ name: "debug", type: Boolean },
		{ name: "newLog", type: Boolean },
	];

	const options = commandLineArgs(optionDefinitions)
	const sourceDir = path.resolve(options.sourceDir);
	const outDir = path.resolve(options.outDir);
	if (options.debug) {
		Logger.setLevel("DEBUG");
	}

	if (options.newLog) {
		Logger.newLog();
	}

	if (!sourceDir) {
		console.error("Source is required.");
		process.exit(1);
	}

	if (!outDir) {
		console.error("outDir is required.");
		process.exit(1);
	}

	if (!fs.existsSync(sourceDir)) {
		console.error(`Source directory does not exist: ${sourceDir}`)
	}

	new Parser(sourceDir, outDir)
		// .register(ClassParser)
		// .register(MagicItemParser)
		// .register(SkillParser)
		// .register(FeatParser)
		// .register(RaceParser)
		.register(new SpellParser())
		.parse();
}

main();