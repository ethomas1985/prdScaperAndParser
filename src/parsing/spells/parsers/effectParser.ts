import { LogInvocation, Logger } from '../../../logger';
import { ISpell } from '../spell';
import { AbstractElementParser } from "../../abstractElementParser";

export class EffectParser extends AbstractElementParser<ISpell> {

	constructor(next?: AbstractElementParser<ISpell>) {
		super("EffectParser", next);
	}

	@LogInvocation
	process(property: Property, spell: ISpell): void {
		if (property.Name === "Effect") {
			EffectParser.setEffect(property, spell);
			return;
		}
		super.process(property, spell);
	}

	@LogInvocation
	private static setEffect(property: Property, spell: ISpell) {
		const rawValue = property.Value;
		const effect = rawValue.replace(property.Name, "");
		Logger.debug(`setEffect: ${JSON.stringify(effect)}`);

		spell.Effect = effect.trim();
	}
}
