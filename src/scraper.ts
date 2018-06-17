import * as process from "process";

import commandLineArgs from "command-line-args";

import * as scrape from "website-scraper";
import phantomHtml from "website-scraper-phantom";


interface INewScraperOptions extends scrape.Options {
	httpResponseHandler: (response: any) => void | any;
	onResourceSaved: (response: any) => void | any;
	requestConcurrency: number;
}

const optionDefinitions: commandLineArgs.OptionDefinition[] = [
	{ name: "url", type: String },
	{ name: "outDir", type: String },
];

const options = commandLineArgs(optionDefinitions)
if (!options.url) {
	console.error("URL is required.");
	process.exit(1);
}

if (!options.outDir) {
	console.error("outDir is required.");
	process.exit(1);
}

const config: INewScraperOptions = {
	directory: options.outDir,
	httpResponseHandler: phantomHtml,
	filenameGenerator: "bySiteStructure",
	recursive: true,
	requestConcurrency: 4,
	urls: [options.url],
	urlFilter: url => {
		const doContinue = startsWith(url, "http://paizo.com/pathfinderRPG/");

		console.log(`${new Date().toISOString()}|urlFilter|url|${url}|doContinue|${doContinue}`)
		return doContinue;
	},
	onResourceSaved: (resource) => {
		console.log(`${new Date().toISOString()}|Resource ${resource} was saved to fs`);
	},
};

scrape(config)
	// .then(console.log)
	.catch(console.error);


function startsWith(url: string, prefix: string): boolean {
	return url.indexOf(prefix) === 0;
}