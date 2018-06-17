import { NamedObject } from './namedObject';

const NAME_Universal = "Universal";
const NAME_Abjuration = "Abjuration";
const NAME_Conjuration = "Conjuration";
const NAME_Divination = "Divination";
const NAME_Enchantment = "Enchantment";
const NAME_Evocation = "Evocation";
const NAME_Illusion = "Illusion";
const NAME_Necromancy = "Necromancy";
const NAME_Transmutation = "Transmutation";

export class MagicSchool extends NamedObject {
	static get Universal(): MagicSchool { return MagicSchool.valueOf(NAME_Universal); }
	static get Abjuration(): MagicSchool { return MagicSchool.valueOf(NAME_Abjuration); }
	static get Conjuration(): MagicSchool { return MagicSchool.valueOf(NAME_Conjuration); }
	static get Divination(): MagicSchool { return MagicSchool.valueOf(NAME_Divination); }
	static get Enchantment(): MagicSchool { return MagicSchool.valueOf(NAME_Enchantment); }
	static get Evocation(): MagicSchool { return MagicSchool.valueOf(NAME_Evocation); }
	static get Illusion(): MagicSchool { return MagicSchool.valueOf(NAME_Illusion); }
	static get Necromancy(): MagicSchool { return MagicSchool.valueOf(NAME_Necromancy); }
	static get Transmutation(): MagicSchool { return MagicSchool.valueOf(NAME_Transmutation); }

	private static _isInitialized: boolean = false;
	private static initialize() {
		if (MagicSchool._isInitialized) {
			return;
		}
		MagicSchool._isInitialized = true;

		/*
		 * The only way to get at these is through either the static NAME properties, or valueOf method.
		 *
		 * Or, someone can cheat and inspect this object and see all the fields.
		 */
		new MagicSchool(NAME_Universal);
		new MagicSchool(NAME_Abjuration);
		new MagicSchool(NAME_Conjuration);
		new MagicSchool(NAME_Divination);
		new MagicSchool(NAME_Enchantment);
		new MagicSchool(NAME_Evocation);
		new MagicSchool(NAME_Illusion);
		new MagicSchool(NAME_Necromancy);
		new MagicSchool(NAME_Transmutation);
	}

	static _keys: string[] = [];
	static _map: { [key: string]: MagicSchool } = {};

	static valueOf(value: string): null | MagicSchool {
		if (!MagicSchool._isInitialized) {
			MagicSchool.initialize();
		}
		if (MagicSchool._keys.indexOf(value.toLowerCase()) >= 0) {
			return MagicSchool._map[value.toLowerCase()];
		}
		return null;
	}

	private constructor(name: string) {
		super(name);
		// Logger.DEBUG(`Instantiating MagicSchool: '${name}'`)
		MagicSchool._keys.push(name.toLowerCase());
		MagicSchool._map[name.toLowerCase()] = this;
	}
}
