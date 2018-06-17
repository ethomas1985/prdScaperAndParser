import { LogInvocation, Logger } from '../../../logger';
import { ISpell } from '../spell';
import { AbstractElementParser } from "../../abstractElementParser";

export class CastingTimeParser extends AbstractElementParser<ISpell> {

	constructor(next?: AbstractElementParser<ISpell>) {
		super("CastingTimeParser", next);
	}

	@LogInvocation
	process(property: Property, spell: ISpell): void {
		if (property.Name === "Casting Time") {
			CastingTimeParser.setCastingTime(property, spell);
			return;
		}
		super.process(property, spell);
	}

	@LogInvocation
	private static setCastingTime(property: Property, spell: ISpell) {
		const rawValue = property.Value;
		const rawCastingTime = rawValue.replace(property.Name, "");
		Logger.debug(`setCastingTime: ${JSON.stringify(rawCastingTime)}`);

		spell.CastingTime = rawCastingTime;
	}
}
