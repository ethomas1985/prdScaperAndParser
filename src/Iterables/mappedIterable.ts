import { Logger, LogInvocation } from '../logger';

export class MappedIterable<T, R> implements IIterable<R> {
	constructor(private _source: IIterable<T>, private _projection: IProjection<T, R>) {
		Logger.verbose(`MappedIterable|ctor`);
	}

	get index(): number {
		return this._source.index;
	}

	get current(): R {
		// FIXME - Should there be some sort of way to cache this?
		return this._projection(this._source.current, this._source.index);
	}

	@LogInvocation
	moveNext(): boolean {
		return this._source.moveNext();
	}
}