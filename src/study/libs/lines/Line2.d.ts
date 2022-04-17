import { LineGeometry } from './LineGeometry';
import { LineSegments2 } from './LineSegments2';
import { LineMaterial } from './LineMaterial';
import { LineSegmentsGeometry } from './LineSegmentsGeometry';

export class Line2 extends LineSegments2 {

	constructor( geometry?: LineGeometry | LineSegmentsGeometry, material?: LineMaterial );
	readonly isLine2: true;

}
