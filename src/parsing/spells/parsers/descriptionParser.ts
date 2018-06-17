import { LogInvocation, Logger, LogNotImplemented } from '../../../logger';
import { ISpell } from '../spell';
import { AbstractElementParser } from "../../abstractElementParser";

export class DescriptionParser extends AbstractElementParser<ISpell> {

	constructor(next?: AbstractElementParser<ISpell>) {
		super("DescriptionParser", next);
	}

	@LogNotImplemented
	@LogInvocation
	process(property: Property, spell: ISpell): void {
		if (property.Name === "") {
			DescriptionParser.setDescription(property, spell);
			return;
		}
		super.process(property, spell);
	}

	private static setDescription(property: Property, spell: ISpell): void {
		const rawValue = property.Value;
		const rawDescription = rawValue.replace(property.Name, "");
		Logger.debug(`setDescription: ${JSON.stringify(rawDescription)}`);
		spell.Description = rawDescription;
	}
}
