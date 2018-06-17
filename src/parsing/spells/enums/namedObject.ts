export abstract class NamedObject {
	constructor(protected name: string) {}

	get Name(): string {
		return this.name;
	}

	toJSON(): string {
		return this.Name;
	}
}