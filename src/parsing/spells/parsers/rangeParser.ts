import { LogInvocation, Logger } from '../../../logger';
import { ISpell } from '../spell';
import { AbstractElementParser } from "../../abstractElementParser";

export class RangeParser extends AbstractElementParser<ISpell> {

	constructor(next?: AbstractElementParser<ISpell>) {
		super("RangeParser", next);
	}

	@LogInvocation
	process(property: Property, spell: ISpell): void {
		if (property.Name === "Range") {
			RangeParser.setRange(property, spell);
			return;
		}
		super.process(property, spell);
	}

	@LogInvocation
	private static setRange(property: Property, spell: ISpell) {
		const rawValue = property.Value;
		const rawRange = rawValue.replace(property.Name, "");
		Logger.debug(`setRange: ${JSON.stringify(rawRange)}`);

		spell.Range = rawRange.trim();
	}
}
