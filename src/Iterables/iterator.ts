import { Logger, LogInvocation } from "../logger";
import { Iterable } from "./iterable";
import { FilteredIterable } from "./filteredIterable";
import { MappedIterable } from "./mappedIterable";

export class Iterator<T> implements IIterator<T> {
	constructor(
		private readonly _values: T[] | IIterable<T>) {
		if (_values instanceof Array) {
			Logger.verbose(`Iterator|ctor|values: []|${JSON.stringify(_values.map((x: any) => x.toString() || JSON.stringify(x)))}`);
		} else {
			Logger.verbose(`Iterator|ctor|values: Iterable`);
		}
	}

	private getIterable(): IIterable<T> {
		if (this._values instanceof Array) {
			return new Iterable(this._values);
		}
		return this._values;
	}

	@LogInvocation
	any(): boolean {
		const clone = this.getIterable();
		const hasOne = clone.moveNext();
		return hasOne;
	}

	@LogInvocation
	first(predicate?: IPredicate<T>): T {
		const clone = this.getIterable();

		if (!clone.current) {
			clone.moveNext();
		}
		return clone.current;
	}

	@LogInvocation
	filter(predicate: IPredicate<T>): IIterator<T> {
		const clone = this.getIterable();
		return new Iterator(new FilteredIterable<T>(clone, predicate));
	}

	@LogInvocation
	map<R>(mapFunction: IProjection<T, R>): IIterator<R> {
		const clone = this.getIterable();
		return new Iterator(new MappedIterable<T, R>(clone, mapFunction));
	}

	@LogInvocation
	forEach(action: IAction<T>): void {
		const clone = this.getIterable();

		while (clone.moveNext()) {
			// if moveNext returns true, then current will not be null
			action(<T>clone.current);
		}
	}

	@LogInvocation
	toArray(): T[] {
		const clone = this.getIterable();

		let result: T[] = [];
		while (clone.moveNext()) {
			if (!clone.current) {
				Logger.warning("No items to iterate...")
				break;
			}
			// if moveNext returns true, then current will not be null
			result.push(clone.current);
		}
		return result;
	}
}