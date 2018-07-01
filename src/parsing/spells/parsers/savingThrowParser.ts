import { LogInvocation, LogNotImplemented, Logger } from '../../../logger';
import { ISpell } from '../spell';
import { AbstractElementParser } from "../../abstractElementParser";

export class SavingThrowParser extends AbstractElementParser<ISpell> {

	constructor(next?: AbstractElementParser<ISpell>) {
		super("SavingThrowParser", next);
	}

	@LogInvocation
	process(property: Property, spell: ISpell): void {
		if (property.Name === "Saving Throw") {
			SavingThrowParser.setSavingThrow(property, spell);
			return;
		}
		super.process(property, spell);
	}

	@LogInvocation
	private static setSavingThrow(property: Property, spell: ISpell) {
		const rawValue = property.Value;
		const savingThrow = rawValue.replace(property.Name, "");
		Logger.debug(`setSavingThrow: ${JSON.stringify(savingThrow)}`);

		spell.SavingThrow = savingThrow.trim();
	}
}