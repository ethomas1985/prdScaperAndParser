import { ISpell } from "./spell";

import { Logger, LogInvocation } from '../../logger';
import { NodeListOfIterator } from "../../Iterables/nodeListOfIterator";
import { AbstractElementParser, ParserBuilder } from '../abstractElementParser';

import { CastingTimeParser } from "./parsers/castingTimeParser";
import { SpellResistanceParser } from "./parsers/spellResistanceParser";
import { DescriptionParser } from "./parsers/descriptionParser";
import { SavingThrowParser } from "./parsers/savingThrowParser";
import { LevelParser } from "./parsers/levelParser";
import { MagicParser } from "./parsers/magicParser";
import { ComponentsParser } from './parsers/componentsParser';
import { RangeParser } from './parsers/rangeParser';
import { EffectParser } from './parsers/effectParser';
import { DurationParser } from "./parsers/durationParser";


class PropertyImpl implements Property {
	constructor(
		private _name: string,
		private _value?: string) { }

	get Name(): string { return this._name }
	get Value(): string { return this._value }

	toJSON(): string {
		return `Property|${this.Name}|${this.Value}`
	}
}

export class SpellParser implements IParser {

	private _elementParsers: AbstractElementParser<ISpell>;
	constructor() {
		this._elementParsers = new ParserBuilder<ISpell>()
			.next(x => new MagicParser(x))
			.next(x => new LevelParser(x))
			.next(x => new CastingTimeParser(x))
			.next(x => new ComponentsParser(x))
			.next(x => new RangeParser(x))
			.next(x => new EffectParser(x))
			.next(x => new DurationParser(x))
			.next(x => new SavingThrowParser(x))
			.next(x => new SpellResistanceParser(x))
			.next(x => new DescriptionParser(x))
			.build();
	}

	getKey(): string {
		return "Spell";
	}

	toJson(element: Element): { success: boolean, result?: {} } {
		const self = this;

		Logger.debug(`SpellParser.toJson(${JSON.stringify(element.outerHTML)})`);
		if (!element) {
			return SpellParser.false();
		}
		const spell = <ISpell>{};

		const paragraphs = new NodeListOfIterator(element.querySelectorAll("p"));
		paragraphs.forEach(handleParagraph);
		Logger.debug(`Parsed Spell: ${JSON.stringify(spell, null, 4)}`);

		return SpellParser.true(spell);

		function handleParagraph(paragraphElement: HTMLParagraphElement) {
			Logger.debug(`SpellParser|toJson|handleParagraph|paragraphElement: ${JSON.stringify(paragraphElement.outerHTML, null, 4)}`);

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
			Logger.debug(`p_class := "${p_class}"`)
			if (p_class === "stat-block-title") {
				SpellParser.setSpellName(spell, cloned);
			} else if (p_class === null
				|| p_class === "stat-block-1") {
				self.setSpellProperty(spell, cloned);
			}
		}
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
		const properties = this.getProperties(paragraphElement);
		for (const property of properties) {
			Logger.debug(`SpellParser|setSpellProperty|for|${JSON.stringify(property)}`);
			this._elementParsers.process(property, spell);
		}
	}

	@LogInvocation
	private getProperties(element: HTMLParagraphElement): Property[] {
		Logger.debug(`SpellParser|getProperties|element|${element.outerHTML}`);
		const self = this;

		const boldElements = new NodeListOfIterator(element.querySelectorAll("b"));
		if (!boldElements.any()) {
			Logger.debug(`SpellParser|getProperties|Element has not Bold elements|${JSON.stringify(element.innerHTML)}`);
			return [new PropertyImpl("Description", element.textContent)];
		}

		Logger.debug(`SpellParser|getProperties|boldElements|["${boldElements.map(x => x.innerHTML).toArray().join("\", \"")}"]`);
		return boldElements.map(processBoldElement).toArray();

		function processBoldElement(x: HTMLElement, i: number): Property {
			Logger.debug(`SpellParser|getProperties|processBoldElement|boldElement|${x.outerHTML.replace(/\n|\t/g, "")}|element|${element.innerHTML.replace(/\n|\t/g, "")}|index|${i}`);
			if (element.contains(x)) {
				element.removeChild(x);
			}
			return self.getProperty(x, element, i);
		}
	}

	@LogInvocation
	private getProperty(boldElement: HTMLElement, element: HTMLParagraphElement, index: number): Property {
		Logger.debug(`SpellParser|getProperty|boldElement|${boldElement.outerHTML.replace(/\n|\t/g, "")}|element|${element.textContent.replace(/\n|\t/g, "")}|index|${index}`);
		let propertyName = SpellParser.getPropertyName(boldElement);

		return SpellParser.toProperty(propertyName, element.textContent, index);
	}

	private static getPropertyName(boldElement: HTMLElement): string {
		let propertyName = boldElement.innerHTML;
		if (boldElement.childElementCount > 1) {
			Logger.warning(`SpellParser|getProperty|boldElement has more than one child element|${propertyName}`);
		}
		else if (boldElement.childElementCount == 1) {
			propertyName = boldElement.firstElementChild.innerHTML;
		}
		return propertyName;
	}

	@LogInvocation
	private static toProperty(nameHtml: string, elementText: string, index: number) {
		let propName = nameHtml;
		if (propName && propName.match(/\W/)) {
			propName = propName.replace(/\n|\t/g, "");//.replace("\t", "");
			Logger.debug(`SpellParser|getProperty|stripping whitespace|${JSON.stringify(propName)}`);
		}
		let propValue = elementText;
		if (index >= 0) {
			propValue = propValue.split(/;\n/g)[index];
		}
		if (propValue) {
			propValue = propValue.replace(/\n|\t/g, "").trim();
		}
		const property: Property = new PropertyImpl(propName, propValue);
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
