import { Logger } from '../logger';
import { Iterator } from "./iterator";

export class NodeListOfIterator<T extends Node> extends Iterator<T> {
	constructor(values: NodeListOf<T>) {
		super(Array.from(values));
		Logger.verbose(`NodeListOfIterator|ctor`);
	}
}