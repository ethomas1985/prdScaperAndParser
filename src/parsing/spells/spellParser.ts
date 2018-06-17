import { ISpell } from "./spell";

import { Logger, LogInvocation } from '../../logger';
import { NodeListOfIterator } from "../../NodeListOfIterator";
import { AbstractElementParser, ParserBuilder } from '../abstractElementParser';

import { CastingTimeParser } from "./parsers/castingTimeParser";
import { SpellResistanceParser } from "./parsers/spellResistanceParser";
import { HasSpellResistanceParser } from "./parsers/hasSpellResistanceParser";
import { DescriptionParser } from "./parsers/descriptionParser";
import { SavingThrowParser } from "./parsers/savingThrowParser";
import { LevelParser } from "./parsers/levelParser";
import { MagicParser } from "./parsers/magicParser";
import { ComponentsParser } from './parsers/componentsParser';

export class SpellParser implements IParser {

	private _elementParsers: AbstractElementParser<ISpell>;
	constructor() {
		this._elementParsers = new ParserBuilder<ISpell>()
			.next(x => new MagicParser(x))
			.next(x => new LevelParser(x))
			.next(x => new CastingTimeParser(x))
			.next(x => new SavingThrowParser(x))
			.next(x => new ComponentsParser(x))
			.next(x => new DescriptionParser(x))
			.next(x => new HasSpellResistanceParser(x))
			.next(x => new SpellResistanceParser(x))
			.build();
	}

	getKey(): string {
		return "Spell";
	}

	toJson(element: Element): { success: boolean, result?: {} } {
		Logger.debug(`SpellParser.toJson(element)`);
		if (!element) {
			return SpellParser.false();
		}
		const spell = <ISpell>{};

		const paragraphs = new NodeListOfIterator(element.querySelectorAll("p"));
		paragraphs.forEach(paragraphElement => {
			if (!paragraphElement) {
				Logger.warning(`ITERATED OVER NULL ELEMENT: "${JSON.stringify(paragraphElement)}"`);
				return;
			}
			const cloned = paragraphElement.cloneNode(true) as HTMLParagraphElement;
			if (!cloned) {
				Logger.warning(`Clone was null: "${JSON.stringify(paragraphElement)}"`);
				return;
			}

			const p_class = paragraphElement.getAttribute("class");
			if (p_class === "stat-block-title") {
				SpellParser.setSpellName(spell, cloned);
			} else if (p_class === "stat-block-1") {
				this.setSpellProperty(spell, cloned);
			} else if (p_class === null) {
				// Description is a classless paragraph block !!!
			}
		});
		Logger.debug(`Parsed Spell: ${JSON.stringify(spell, null, 4)}`);

		return SpellParser.true(spell);
	}

	private static setSpellName(spell: ISpell, paragraphElement: HTMLParagraphElement) {
		Logger.debug(`SpellParser|setSpellName|${paragraphElement.innerHTML}`);
		spell.Name = SpellParser.getName(paragraphElement);
	}

	@LogInvocation
	private static getName(element: HTMLParagraphElement): string {
		const boldElement = element.querySelector("b");
		if (!boldElement) {
			return null;
		}
		return boldElement.innerHTML;
	}

	@LogInvocation
	private setSpellProperty(spell: ISpell, paragraphElement: HTMLParagraphElement) {
		const properties = SpellParser.getProperties(paragraphElement);
		for (const property of properties) {
			// Logger.debug(`SpellParser|setSpellProperty|for|${JSON.stringify(property)}`);
			this._elementParsers.process(property, spell);
		}
	}

	private static getProperties(element: HTMLParagraphElement): Property[] {
		const boldElements = new NodeListOfIterator(element.querySelectorAll("b"));
		if (!boldElements.any()) {
			return null;
		}

		return boldElements.map((x, i) => SpellParser.getProperty(x, element, i));
	}

	private static getProperty(boldElement: HTMLElement, element: HTMLParagraphElement, index: number) {
		// Logger.DEBUG(`SpellParser|getProperty|boldElement|${boldElement.outerHTML}|element|${element.outerHTML}|index|${index}`);
		element.removeChild(boldElement);
		const propName = boldElement.innerHTML;
		let propValue = element.textContent;
		if (index >= 0) {
			propValue = propValue.split(/;\n/g)[index];
		}
		if (propValue) {
			propValue = propValue.replace(/\n|\t/g, "").trim();
		}
		const property: Property = {
			Name: propName,
			Value: propValue,
			toJSON: () => `Property|${propName}|${propValue}`
		};
		// Logger.debug(`SpellParser|getProperty|${JSON.stringify(property)}`);
		return property;
	}

	private static false(): { success: boolean, result?: {} } {
		return { success: false };
	}

	private static true(result: {}): { success: boolean, result?: {} } {
		return { success: true, result: result };
	}
}
