import { LogInvocation, LogNotImplemented } from '../../../logger';
import { ISpell } from '../spell';
import { AbstractElementParser } from "../../abstractElementParser";

export class SpellResistanceParser extends AbstractElementParser<ISpell> {

	constructor(next?: AbstractElementParser<ISpell>) {
		super("SpellResistanceParser", next);
	}

	@LogNotImplemented
	@LogInvocation
	process(property: Property, obj: ISpell): void {
		super.process(property, obj);
	}
}
