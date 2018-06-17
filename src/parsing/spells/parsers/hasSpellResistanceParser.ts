import { LogInvocation, LogNotImplemented } from '../../../logger';
import { ISpell } from '../spell';
import { AbstractElementParser } from "../../abstractElementParser";

export class HasSpellResistanceParser extends AbstractElementParser<ISpell> {

	constructor(next?: AbstractElementParser<ISpell>) {
		super("HasSpellResistanceParser", next);
	}

	@LogNotImplemented
	@LogInvocation
	process(property: Property, obj: ISpell): void {
		super.process(property, obj);
	}
}
