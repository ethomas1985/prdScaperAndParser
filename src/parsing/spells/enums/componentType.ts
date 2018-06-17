import { NamedObject } from './namedObject';
import { Logger } from '../../../logger';

const NAME_Verbal = "Verbal";
const NAME_Somatic = "Somatic";
const NAME_Material = "Material";
const NAME_Focus = "Focus";
const NAME_DivineFocus = "DivineFocus";

export class ComponentType extends NamedObject {
	static get Verbal(): ComponentType { return ComponentType.valueOf(NAME_Verbal); }
	static get Somatic(): ComponentType { return ComponentType.valueOf(NAME_Somatic); }
	static get Material(): ComponentType { return ComponentType.valueOf(NAME_Material); }
	static get Focus(): ComponentType { return ComponentType.valueOf(NAME_Focus); }
	static get DivineFocus(): ComponentType { return ComponentType.valueOf(NAME_DivineFocus); }

	private static _isInitialized: boolean = false;
	private static initialize() {
		if (ComponentType._isInitialized) {
			return;
		}
		ComponentType._isInitialized = true;

		/*
		 * The only way to get at these is through either the static NAME properties, or valueOf method.
		 *
		 * Or, someone can cheat and inspect this object and see all the fields.
		 */
		new ComponentType(NAME_Verbal);
		new ComponentType(NAME_Somatic);
		new ComponentType(NAME_Material);
		new ComponentType(NAME_Focus);
		new ComponentType(NAME_DivineFocus);

		// Logger.debug(`Instantiating ComponentType: '${JSON.stringify(ComponentType._map, null, 4)}'`)
	}

	static _keys: string[] = [];
	static _map: { [key: string]: ComponentType } = {};

	static valueOf(value: string): null | ComponentType {
		if (!ComponentType._isInitialized) {
			ComponentType.initialize();
		}

		let component = null;
		const _value = value.length == 1
			? value.toUpperCase()
			: value.toLowerCase();
		if (ComponentType._keys.indexOf(_value) >= 0) {
			component = ComponentType._map[_value];
			// return component;
		}
		// Logger.debug(`ComponentType.valueOf("${_value}") => ${component ? component.Name : "{null}"}`);
		return component;
	}

	private _initial: string;

	private constructor(name: string) {
		super(name);

		this._initial = name[0].toUpperCase();

		ComponentType._keys.push(this._initial);
		ComponentType._map[this._initial] = this;

		ComponentType._keys.push(name.toLowerCase());
		ComponentType._map[name.toLowerCase()] = this;
	}

	get initial(): string {
		return this._initial;
	}
}