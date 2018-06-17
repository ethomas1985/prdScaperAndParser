import { LogInvocation } from '../../../logger';
import { ISpell } from '../spell';
import { AbstractElementParser } from "../../abstractElementParser";

export class LevelParser extends AbstractElementParser<ISpell> {

	constructor(next?: AbstractElementParser<ISpell>) {
		super("LevelParser", next);
	}

	@LogInvocation
	process(property: Property, spell: ISpell): void {
		if (property.Name === "Level") {
			LevelParser.setLevelRequirements(property.Value, spell);
			return;
		}
		super.process(property, spell);
	}

	@LogInvocation
	private static setLevelRequirements(value: String, spell: ISpell) {

		// Logger.debug(`setLevelRequirements|${value}`);
		let rawLevelRequirements = value.split(",");

		let map: { [key: string]: number } = {};
		for (let rawLevelReq of rawLevelRequirements) {
			// Logger.debug(`\trawLevelReq: ${rawLevelReq}`);
			const split = rawLevelReq.split(" ");
			let classes = split[0].split("/");
			let level: number = parseInt(split[1]);
			for (let _class of classes) {
				// Logger.debug(`\t${_class}: ${level}`);

				map[_class] = level;
			}
		}

		spell.LevelRequirements = map;
	}
}