import { Logger, LogInvocation } from "../logger";

export class FilteredIterable<T> implements IIterable<T> {
	constructor(
		private _source: IIterable<T>,
		private _predicate: IPredicate<T>) {
		Logger.verbose(`FilteredIterable|ctor`);
	}

	get index(): number {
		return this._source.index;
	}

	get current(): T {
		return this._source.current;
	}

	@LogInvocation
	moveNext(): boolean {
		let moved: boolean;
		let found: boolean;

		do {
			moved = this._source.moveNext();
		} while (moved && !(found = this._predicate(this.current)));

		return moved && found;
	}
}