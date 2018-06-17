import { LogInvocation, Logger } from '../../../logger';
import { ISpell, ISpellComponent } from '../spell';
import { AbstractElementParser } from "../../abstractElementParser";
import { ComponentType } from '../enums/componentType';

export class ComponentsParser extends AbstractElementParser<ISpell> {

	constructor(next?: AbstractElementParser<ISpell>) {
		super("CastingTimeParser", next);
	}

	@LogInvocation
	process(property: Property, spell: ISpell): void {
		if (property.Name === "Components") {
			ComponentsParser.setComponents(property, spell);
			return;
		}
		super.process(property, spell);
	}

	@LogInvocation
	private static setComponents(property: Property, spell: ISpell) {
		const rawValue = property.Value;
		const rawComponents = rawValue.replace(property.Name, "");

		const rawComponentsSplit = rawComponents.split(', ');
		let components = rawComponentsSplit
			.filter(isComponent)
			.map(toSpellComponent);

		spell.Components = components;
	}
}

function isComponent(x: string): boolean {
	if (!x) {
		return false;
	}

	let value = x;
	if (x.length > 1) {
		value = value[0];
	}

	const maybe = ComponentType.valueOf(value) !== null;
	return maybe;
}

function toSpellComponent(x: string): ISpellComponent {
	let initial = x;
	let capture: RegExpMatchArray;
	if (x.length > 1) {
		initial = x[0];
		capture = x.match(/\((.+)\)/);
	}

	const spellComponent = <ISpellComponent>{
		ComponentType: ComponentType.valueOf(initial)
	};

	if (capture) {
		spellComponent.Description = capture[1];
	}

	return spellComponent;
}
