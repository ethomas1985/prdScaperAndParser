declare interface ILogger {
	newLog(): void;
	setLevel(level: "VERBOSE" | "DEBUG" | "INFO" | "WARNING" | "ERROR"): void;
	toConsole(): ILogger;
	toFile(value?: string): ILogger;
	error(message: string): void;
	warning(message: string): void;
	info(message: string): void;
	debug(message: string): void;
	verbose(message: string): void;
}