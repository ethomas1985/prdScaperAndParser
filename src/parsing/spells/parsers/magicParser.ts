import { LogInvocation, Logger } from '../../../logger';
import { ISpell } from '../spell';
import { AbstractElementParser } from "../../abstractElementParser";

import { MagicSchool } from '../enums/magicSchool';
import { MagicSubSchool } from '../enums/magicSubSchool';
import { MagicDescriptor } from '../enums/magicDescriptor';

export class MagicParser extends AbstractElementParser<ISpell> {

	constructor(next?: AbstractElementParser<ISpell>) {
		super("MagicParser", next);
	}

	@LogInvocation
	process(property: Property, spell: ISpell): void {
		if (property.Name === "School") {
			MagicParser.setMagicSchool(property, spell);
			MagicParser.setMagicSubSchools(property.Value, spell);
			MagicParser.setMagicDescriptors(property.Value, spell);
			return;
		}
		super.process(property, spell);
	}

	@LogInvocation
	private static setMagicSchool(property: Property, spell: ISpell) {
		const rawValue = property.Value;
		const rawMagicSchool = rawValue.replace(property.Name, "").split(" ")[0];
		// Logger.debug(`\trawMagicSchool: ${JSON.stringify(rawMagicSchool)}`);
		const magicSchool = MagicSchool.valueOf(rawMagicSchool);
		if (!magicSchool) {
			Logger.warning(`Invalid value for MagicSchool; was "${rawMagicSchool}"`);
		}
		spell.School = magicSchool;
	}

	@LogInvocation
	private static setMagicSubSchools(rawValue: string, spell: ISpell) {
		const capture = rawValue.match(/\(.+\)/g);
		if (!capture) {
			Logger.warning(`No sub-schools were captured.`);
			return;
		}
		const rawSubSchools = capture[0];
		const subSchoolMatches = rawSubSchools.match(/\w+/g);
		if (!subSchoolMatches) {
			Logger.warning(`No sub-schools were captured with parentheses.`);
			return;
		}
		// Logger.debug(`\tsubSchoolMatches: ${JSON.stringify(subSchoolMatches)}`);
		let subSchools: MagicSubSchool[] = [];
		for (let i = 0; i < subSchoolMatches.length; i++) {
			const rawMagicSubSchool = subSchoolMatches[i];
			if (!rawMagicSubSchool) {
				Logger.warning(`rawMagicSubSchool was "${rawMagicSubSchool}"`);
				continue;
			}
			const subSchool = MagicSubSchool.valueOf(rawMagicSubSchool);
			if (!subSchool) {
				Logger.warning(`Invalid value for MagicSubSchool; was "${rawMagicSubSchool}"`);
				continue;
			}
			subSchools.push(subSchool);
		}
		spell.SubSchools = subSchools;
	}
	@LogInvocation
	private static setMagicDescriptors(rawValue: string, spell: ISpell) {
		const capture = rawValue.match(/\[(.+)\]/g);
		if (!capture) {
			Logger.warning(`No descriptors were captured.`);
			return;
		}
		const rawDescriptors = capture[0];
		const descriptors = rawDescriptors.match(/\w+/g);
		if (!descriptors) {
			Logger.warning(`No descriptors were captured with parentheses.`);
			return;
		}
		// Logger.debug(`\tdescriptors: ${JSON.stringify(descriptors)}`);
		let magicDescriptors: MagicDescriptor[] = [];
		for (let i = 0; i < descriptors.length; i++) {
			const rawMagicDescriptor = descriptors[i];
			if (!rawMagicDescriptor) {
				Logger.warning(`rawMagicDescriptor was "${rawMagicDescriptor}"`);
				continue;
			}
			const magicDescriptor = MagicDescriptor.valueOf(rawMagicDescriptor);
			if (!magicDescriptor) {
				Logger.warning(`Invalid value for MagicDescriptor; was "${rawMagicDescriptor}"`);
				continue;
			}
			magicDescriptors.push(magicDescriptor);
		}
		spell.MagicDescriptors = magicDescriptors;
	}
}