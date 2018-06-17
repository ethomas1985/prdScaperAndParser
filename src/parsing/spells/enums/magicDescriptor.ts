import { NamedObject } from './namedObject';

const NAME_None = "None";
const NAME_Universal = "Universal";
const NAME_Acid = "Acid";
const NAME_Air = "Air";
const NAME_Chaotic = "Chaotic";
const NAME_Cold = "Cold";
const NAME_Darkness = "Darkness";
const NAME_Death = "Death";
const NAME_Earth = "Earth";
const NAME_Electricity = "Electricity";
const NAME_Evil = "Evil";
const NAME_Fear = "Fear";
const NAME_Fire = "Fire";
const NAME_Force = "Force";
const NAME_Good = "Good";
const NAME_LanguageDependent = "LanguageDependent";
const NAME_Lawful = "Lawful";
const NAME_Light = "Light";
const NAME_MindAffecting = "MindAffecting";
const NAME_Sonic = "Sonic";
const NAME_Water = "Water";

export class MagicDescriptor extends NamedObject {
	static get None(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_None); }
	static get Universal(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_Universal); }
	static get Acid(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_Acid); }
	static get Air(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_Air); }
	static get Chaotic(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_Chaotic); }
	static get Cold(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_Cold); }
	static get Darkness(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_Darkness); }
	static get Death(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_Death); }
	static get Earth(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_Earth); }
	static get Electricity(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_Electricity); }
	static get Evil(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_Evil); }
	static get Fear(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_Fear); }
	static get Fire(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_Fire); }
	static get Force(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_Force); }
	static get Good(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_Good); }
	static get LanguageDependent(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_LanguageDependent); }
	static get Lawful(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_Lawful); }
	static get Light(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_Light); }
	static get MindAffecting(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_MindAffecting); }
	static get Sonic(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_Sonic); }
	static get Water(): MagicDescriptor { return MagicDescriptor.valueOf(NAME_Water); }

	private static _isInitialized: boolean = false;
	private static initialize() {
		if (MagicDescriptor._isInitialized) {
			return;
		}
		MagicDescriptor._isInitialized = true;

		/*
		 * The only way to get at these is through either the static NAME properties, or valueOf method.
		 *
		 * Or, someone can cheat and inspect this object and see all the fields.
		 */
		new MagicDescriptor(NAME_None);
		new MagicDescriptor(NAME_Universal);
		new MagicDescriptor(NAME_Acid);
		new MagicDescriptor(NAME_Air);
		new MagicDescriptor(NAME_Chaotic);
		new MagicDescriptor(NAME_Cold);
		new MagicDescriptor(NAME_Darkness);
		new MagicDescriptor(NAME_Death);
		new MagicDescriptor(NAME_Earth);
		new MagicDescriptor(NAME_Electricity);
		new MagicDescriptor(NAME_Evil);
		new MagicDescriptor(NAME_Fear);
		new MagicDescriptor(NAME_Fire);
		new MagicDescriptor(NAME_Force);
		new MagicDescriptor(NAME_Good);
		new MagicDescriptor(NAME_LanguageDependent);
		new MagicDescriptor(NAME_Lawful);
		new MagicDescriptor(NAME_Light);
		new MagicDescriptor(NAME_MindAffecting);
		new MagicDescriptor(NAME_Sonic);
		new MagicDescriptor(NAME_Water);
	}

	static _keys: string[] = [];
	static _map: { [key: string]: MagicDescriptor } = {};

	static valueOf(value: string): null | MagicDescriptor {
		if (!MagicDescriptor._isInitialized) {
			MagicDescriptor.initialize();
		}
		if (MagicDescriptor._keys.indexOf(value) >= 0) {
			return MagicDescriptor._map[value];
		}
		return null;
	}

	private constructor(name: string) {
		super(name);
		// Logger.DEBUG(`Instantiating MagicDescriptor: '${name}'`)
		MagicDescriptor._keys.push(name.toLowerCase());
		MagicDescriptor._map[name.toLowerCase()] = this;
	}
}