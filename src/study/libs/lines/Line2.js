/**
 * @author WestLangley / http://github.com/WestLangley
 *
 */

import { LineSegments2 } from '../lines/LineSegments2.js'
import { LineGeometry } from '../lines/LineGeometry.js'
import { LineMaterial } from '../lines/LineMaterial.js'
import { Vector2 } from 'three'

var Line2 = function (geometry, material) {
  LineSegments2.call(this)

  this.type = 'Line2'
  this.renderOrder = 30
  this.geometry = geometry !== undefined ? geometry : new LineGeometry()
  this.material = material !== undefined ? material : this.material = new LineMaterial({
    color: 0x19588C,
    linewidth: 3.0,
    dashed: false,
    resolution: new Vector2(window.innerWidth, window.innerHeight), // resolution of the viewport
    dashScale: 0.5,
    dashSize: 0.5,
    gapSize: 0.5,
    depthWrite: false,
    depthTest: false
  })
}

Line2.prototype = Object.assign(Object.create(LineSegments2.prototype), {

  constructor: Line2,

  isLine2: true

})

export { Line2 }
