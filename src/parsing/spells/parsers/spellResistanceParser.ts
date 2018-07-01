import { LogInvocation, Logger } from '../../../logger';
import { ISpell } from '../spell';
import { AbstractElementParser } from "../../abstractElementParser";

export class SpellResistanceParser extends AbstractElementParser<ISpell> {

	constructor(next?: AbstractElementParser<ISpell>) {
		super("SpellResistanceParser", next);
	}

	@LogInvocation
	process(property: Property, spell: ISpell): void {
		if (property.Name === "Spell Resistance") {
			SpellResistanceParser.setSpellResistance(property, spell);
			return;
		}
		super.process(property, spell);
	}

	@LogInvocation
	private static setSpellResistance(property: Property, spell: ISpell) {
		const rawValue = property.Value;
		const spellResistance = rawValue.replace(property.Name, "").trim();
		Logger.debug(`setSpellResistance: ${JSON.stringify(spellResistance)}`);

		spell.HasSpellResistance = (spellResistance != "no");
		if (spell.HasSpellResistance) {
			spell.SpellResistance = spellResistance;
		}
	}
}
