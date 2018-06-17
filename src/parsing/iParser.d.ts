declare interface IParser {
	getKey(): string;
	toJson(element: Element): { success: boolean, result?: {} };
}