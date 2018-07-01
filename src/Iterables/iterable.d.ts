declare interface IIterable<T> {
	index: number;
	current: T;
	moveNext(): boolean;
}

declare interface IIterator<T> {
	any(): boolean;
	first(predicate?: IPredicate<T>): T;
	filter(predicate: IPredicate<T>): IIterator<T>;
	map<R>(mapFunction: IProjection<T, R>): IIterator<R>;
	toArray(): T[];
	forEach(action: IAction<T>): void;
}

declare interface IProjection<T, R> {
	(node: T, index?: number): R;
}

declare interface IPredicate<T> {
	(item: T): boolean;
}

declare interface IAction<T> {
	(item: T): void;
}