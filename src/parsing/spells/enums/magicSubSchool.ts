import { NamedObject } from './namedObject';

const NAME_Universal = "Universal";
const NAME_None = "None";
const NAME_Calling = "Calling";
const NAME_Creation = "Creation";
const NAME_Healing = "Healing";
const NAME_Summoning = "Summoning";
const NAME_Teleportation = "Teleportation";
const NAME_Scrying = "Scrying";
const NAME_Charm = "Charm";
const NAME_Compulsion = "Compulsion";
const NAME_Figment = "Figment";
const NAME_Glamer = "Glamer";
const NAME_Pattern = "Pattern";
const NAME_Phantasm = "Phantasm";
const NAME_Shadow = "Shadow";
const NAME_Polymorph = "Polymorph";

export class MagicSubSchool extends NamedObject {
	static get Universal(): MagicSubSchool { return MagicSubSchool.valueOf(NAME_Universal); }
	static get None(): MagicSubSchool { return MagicSubSchool.valueOf(NAME_None); }
	static get Calling(): MagicSubSchool { return MagicSubSchool.valueOf(NAME_Calling); }
	static get Creation(): MagicSubSchool { return MagicSubSchool.valueOf(NAME_Creation); }
	static get Healing(): MagicSubSchool { return MagicSubSchool.valueOf(NAME_Healing); }
	static get Summoning(): MagicSubSchool { return MagicSubSchool.valueOf(NAME_Summoning); }
	static get Teleportation(): MagicSubSchool { return MagicSubSchool.valueOf(NAME_Teleportation); }
	static get Scrying(): MagicSubSchool { return MagicSubSchool.valueOf(NAME_Scrying); }
	static get Charm(): MagicSubSchool { return MagicSubSchool.valueOf(NAME_Charm); }
	static get Compulsion(): MagicSubSchool { return MagicSubSchool.valueOf(NAME_Compulsion); }
	static get Figment(): MagicSubSchool { return MagicSubSchool.valueOf(NAME_Figment); }
	static get Glamer(): MagicSubSchool { return MagicSubSchool.valueOf(NAME_Glamer); }
	static get Pattern(): MagicSubSchool { return MagicSubSchool.valueOf(NAME_Pattern); }
	static get Phantasm(): MagicSubSchool { return MagicSubSchool.valueOf(NAME_Phantasm); }
	static get Shadow(): MagicSubSchool { return MagicSubSchool.valueOf(NAME_Shadow); }
	static get Polymorph(): MagicSubSchool { return MagicSubSchool.valueOf(NAME_Polymorph); }

	private static _isInitialized: boolean = false;
	private static initialize() {
		if (MagicSubSchool._isInitialized) {
			return;
		}
		MagicSubSchool._isInitialized = true;

		/*
		 * The only way to get at these is through either the static NAME properties, or valueOf method.
		 *
		 * Or, someone can cheat and inspect this object and see all the fields.
		 */
		new MagicSubSchool(NAME_Universal);
		new MagicSubSchool(NAME_None);
		new MagicSubSchool(NAME_Calling);
		new MagicSubSchool(NAME_Creation);
		new MagicSubSchool(NAME_Healing);
		new MagicSubSchool(NAME_Summoning);
		new MagicSubSchool(NAME_Teleportation);
		new MagicSubSchool(NAME_Scrying);
		new MagicSubSchool(NAME_Charm);
		new MagicSubSchool(NAME_Compulsion);
		new MagicSubSchool(NAME_Figment);
		new MagicSubSchool(NAME_Glamer);
		new MagicSubSchool(NAME_Pattern);
		new MagicSubSchool(NAME_Phantasm);
		new MagicSubSchool(NAME_Shadow);
		new MagicSubSchool(NAME_Polymorph);
	}

	static _keys: string[] = [];
	static _map: { [key: string]: MagicSubSchool } = {};

	static valueOf(value: string): null | MagicSubSchool {
		if (!MagicSubSchool._isInitialized) {
			MagicSubSchool.initialize();
		}
		if (MagicSubSchool._keys.indexOf(value) >= 0) {
			return MagicSubSchool._map[value];
		}
		return null;
	}

	private constructor(name: string) {
		super(name);
		// Logger.DEBUG(`Instantiating MagicSubSchool: '${name}'`)
		MagicSubSchool._keys.push(name.toLowerCase());
		MagicSubSchool._map[name.toLowerCase()] = this;
	}
}