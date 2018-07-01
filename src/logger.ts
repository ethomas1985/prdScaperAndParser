/// <reference path="./logger.d.ts" />

import * as fs from "fs";
import * as path from 'path';

enum LogLevel {
	ERROR, WARNING, INFO, DEBUG, VERBOSE
}

class LoggerImpl implements ILogger {

	_toFile: boolean = false;;
	_toConsole: boolean = false;
	_filepath: string = `logs/${LoggerImpl.getDate()}.log`;
	_level: LogLevel = LogLevel.INFO;

	private static getDate(): string {
		const now = new Date();
		const year = now.getFullYear();
		const month = ("0" + (now.getMonth() + 1)).slice(-2);
		const day = now.getDate();
		return `${year}-${month}-${day}`;
	}

	get level(): LogLevel {
		return this._level;
	}

	setLevel(level: "VERBOSE" | "DEBUG" | "INFO" | "WARNING" | "ERROR"): void {
		this._level = LogLevel[level];
	}

	newLog(): void {
		if (fs.existsSync(this._filepath)) {
			fs.unlinkSync(this._filepath);
		}
	}

	toConsole(): LoggerImpl {
		this._toConsole = true;

		return this;
	}

	toFile(value?: string): LoggerImpl {
		this._toFile = true;
		if (value) {
			this._filepath = value;
		}

		return this;
	}

	error(message: string): void {
		if (this._level >= LogLevel.ERROR) {
			this.log(LogLevel.ERROR, message);
		}
	}
	warning(message: string): void {
		if (this._level >= LogLevel.WARNING) {
			this.log(LogLevel.WARNING, message);
		}
	}
	info(message: string): void {
		if (this._level >= LogLevel.INFO) {
			this.log(LogLevel.INFO, message);
		}
	}
	debug(message: string): void {
		if (this._level >= LogLevel.DEBUG) {
			this.log(LogLevel.DEBUG, message);
		}

	}
	verbose(message: string): void {
		if (this._level >= LogLevel.VERBOSE) {
			this.log(LogLevel.VERBOSE, message);
		}
	}

	private log(logLevel: LogLevel, message: string) {
		const levelText = (LogLevel[logLevel] + "          ").substr(0, 8);
		const fullMsg = `${new Date().toISOString()}| ${levelText}|${message}`

		if (this.toConsole) {
			const writer = logLevel <= 1
				? console.error
				: console.log;
			writer(fullMsg);
		}

		if (!this._toFile) {
			return;
		}

		const logDir = path.dirname(this._filepath);
		if (!fs.existsSync(logDir)) {
			fs.mkdirSync(logDir);
		}
		fs.appendFileSync(this._filepath, fullMsg + "\n");
	}

}

const _logger = new LoggerImpl()
	.toConsole()
	.toFile();

export function LogInvocation(
	target: { name?: string, constructor: { name: string } },
	propertyKey: string,
	descriptor: TypedPropertyDescriptor<any>) {
	const originalMethod = descriptor.value;
	descriptor.value = function (...args: any[]) {
		const targetName = target.name || target.constructor.name;
		const paramsList = args.map(toString);
		const params = paramsList.length > 1
			? `\n\t${paramsList.join(",\n\t")}\n`
			: paramsList[0];
		_logger.verbose(`LogInvocation|${targetName}|${propertyKey}|params|[${params}]`);

		const result = originalMethod.apply(this, args);
		if (result) {
			_logger.verbose(`LogInvocation|${targetName}|${propertyKey}|result|${JSON.stringify(result)}`);
		}

		return result;
	}
}

export function LogNotImplemented(
	target: { name?: string, constructor: { name: string } },
	propertyKey: string,
	descriptor: TypedPropertyDescriptor<any>) {
	const originalMethod = descriptor.value;
	descriptor.value = function (...args: any[]) {
		const targetName = target.name || target.constructor.name;
		_logger.warning(`NOT IMPLEMENTED|${targetName}|${propertyKey}`);

		return originalMethod.apply(this, args);
	}
}

function toString(x: any): string {
	const MAX_LENGTH = 100;
	const asJson = JSON.stringify(x);
	if (typeof x === typeof "" && asJson.length > MAX_LENGTH) {
		return asJson.substr(0, MAX_LENGTH) + "[...]\"";
	}
	return asJson;
}

export const Logger: ILogger = _logger;