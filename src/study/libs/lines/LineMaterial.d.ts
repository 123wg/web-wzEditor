import {
	Color,
	MaterialParameters,
	ShaderMaterial,
	Vector2
} from 'three';

export interface LineMaterialParameters extends MaterialParameters {
	color?: number;
	dashed?: boolean;
	dashScale?: number;
	dashSize?: number;
	gapSize?: number;
	linewidth?: number;
	resolution?: Vector2;
	opacity?:number
}

export class LineMaterial extends ShaderMaterial {

	constructor( parameters?: LineMaterialParameters );
	color: Color;
	dashed: boolean;
	dashScale: number;
	dashSize: number;
	gapSize: number;
	readonly isLineMaterial: true;
	linewidth: number;
	resolution: Vector2;
	opacity:number

}
