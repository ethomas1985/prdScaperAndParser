import { LogInvocation, Logger } from '../../../logger';
import { ISpell } from '../spell';
import { AbstractElementParser } from "../../abstractElementParser";

export class DurationParser extends AbstractElementParser<ISpell> {

	constructor(next?: AbstractElementParser<ISpell>) {
		super("EffectParser", next);
	}

	@LogInvocation
	process(property: Property, spell: ISpell): void {
		if (property.Name === "Duration") {
			DurationParser.setDuration(property, spell);
			return;
		}
		super.process(property, spell);
	}

	@LogInvocation
	private static setDuration(property: Property, spell: ISpell) {
		const rawValue = property.Value;
		const duration = rawValue.replace(property.Name, "");
		Logger.debug(`setDuration: ${JSON.stringify(duration)}`);

		spell.Duration = duration.trim();
	}
}
