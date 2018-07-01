import { LogInvocation, Logger } from '../../../logger';
import { ISpell } from '../spell';
import { AbstractElementParser } from "../../abstractElementParser";

export class DescriptionParser extends AbstractElementParser<ISpell> {

	constructor(next?: AbstractElementParser<ISpell>) {
		super("DescriptionParser", next);
	}

	@LogInvocation
	process(property: Property, spell: ISpell): void {
		if (property.Name === "Description") {
			DescriptionParser.setDescription(property, spell);
			return;
		}
		super.process(property, spell);
	}

	private static setDescription(property: Property, spell: ISpell): void {
		const rawValue = property.Value;

		let rawDescription = rawValue.replace(property.Name, "");
		Logger.debug(`setDescription: ${JSON.stringify(rawDescription)}`);

		if (rawDescription && rawDescription.match(/\W/)) {
			rawDescription = rawDescription.replace(/\n/g, "").replace(/\t+/g, " ");
		}

		spell.Description = rawDescription;
	}
}
