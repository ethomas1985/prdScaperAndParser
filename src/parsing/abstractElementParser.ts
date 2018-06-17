import { Logger } from '../logger';

export abstract class AbstractElementParser<T> {

	constructor(
		private _name: string,
		private _next?: AbstractElementParser<T>) {

	}

	get next(): AbstractElementParser<T> { return this._next; }
	set next(value: AbstractElementParser<T>) { this._next = value; }

	process(property: Property, obj: T): void {
		if (this.next) {
			this.next.process(property, obj);
		}
	}
}

export interface IParserGetter<T> {
	(prev: AbstractElementParser<T>): AbstractElementParser<T>;
}

export class ParserBuilder<T> {
	private _parsers: IParserGetter<T>[];

	constructor() {
		this._parsers = []
	}

	next(getter: IParserGetter<T>): ParserBuilder<T> {
		this._parsers.push(getter)
		return this;
	}

	build(): AbstractElementParser<T> {
		const first = this._parsers.pop();
		const firstParser = first(null);
		Logger.debug(`ParserBuilder|build|firstParser|${JSON.stringify(firstParser)}`);
		return this._parsers.reverse().reduce(reducer, firstParser);

		function reducer(previous: AbstractElementParser<T>, current: IParserGetter<T>): AbstractElementParser<T> {
			const newParser = current(previous);
			Logger.debug(`ParserBuilder|build|reducer|newParser|${JSON.stringify(newParser)}`);
			return newParser;
		}
	}
}