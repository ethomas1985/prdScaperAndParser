import { Logger } from './logger';

interface Iterable<T> {
	current: T;
	moveNext(): boolean;

	forEach(action: (node: T) => void): void;
}

export class NodeListOfIterator<T extends Node> implements Iterable<T> {
	private _current: T = null;
	private _index: number = -1;

	constructor(
		private values: NodeListOf<T>) { }

	private get length(): number {
		return this.values.length;
	}

	get current(): T {
		return this._current;
	}
	set current(v: T) {
		this._current = v;
	}

	private get index(): number {
		return this._index;
	}
	private set index(v: number) {
		this._index = v;
	}

	moveNext(): boolean {
		if (this.index++ < this.length) {
			this.current = this.values[this.index];
			return true;
		}

		this.current = null;
		return false;
	}
	any(): boolean {
		if (!this.current) {
			return this.index + 1 < this.length;
		}
		return true;
	}

	first(): T {
		if (!this.current) {
			this.moveNext();
		}
		return this.current;
	}

	forEach(action: (node: T) => void): void {
		while (this.moveNext()) {
			// if moveNext returns true, then current will not be null
			action(<T>this.current);
		}
	}

	map<R>(mapFunction: (node: T, index?: number) => R): R[] {
		let result: R[] = [];
		while (this.moveNext()) {
			if (!this.current) {
				Logger.warning("No items to iterate...")
				break;
			}
			// if moveNext returns true, then current will not be null
			result.push(mapFunction(<T>this.current, this.index));
		}
		return result;
	}
}
