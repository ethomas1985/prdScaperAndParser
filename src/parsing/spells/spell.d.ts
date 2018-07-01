import { MagicSchool } from "./enums/magicSchool";
import { MagicSubSchool } from "./enums/magicSubSchool";
import { MagicDescriptor } from "./enums/magicDescriptor";
import { ComponentType } from "./enums/componentType";

declare interface ISpell {
	Name: string;
	School: MagicSchool;
	SubSchools: MagicSubSchool[];
	MagicDescriptors: MagicDescriptor[];
	SavingThrow: string;
	Description: string;
	HasSpellResistance: boolean;
	SpellResistance: string;
	CastingTime: string;
	Range: string;
	Effect: string;
	LevelRequirements: {
		[key: string]: number;
	};
	Duration: string;
	Components: ISpellComponent[];
}

declare interface ISpellComponent {
	ComponentType: ComponentType;
	Description: string;
}