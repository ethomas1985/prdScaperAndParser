/// <reference path="./iterable.d.ts" />

import { Logger, LogInvocation } from '../logger';

export class Iterable<T> implements IIterable<T> {
	private _current: T;
	private _index: number;

	constructor(
		private _values: T[]) {
		Logger.verbose(`Iterable|ctor|values|${JSON.stringify(_values.map((x: any) => x["name"] || x["tagName"]))}`);
		this._index = -1;
		this._current = undefined;
	}

	protected get values(): T[] {
		return this._values;
	}
	public get current(): T {
		return this._current;
	}
	public get index(): number {
		return this._index;
	}

	@LogInvocation
	moveNext(): boolean {
		Logger.debug(`Iterable|moveNext|pre action|index: ${this.index}|current|${JSON.stringify(this.current)}`);
		this._index++;
		// this.setCurrent(this.values[this.index]);
		this._current = this.values[this.index];
		Logger.debug(`Iterable|moveNext|post action|index: ${this.index}|current|${JSON.stringify(this.current)}`);
		return this.current !== undefined;
	}
}
