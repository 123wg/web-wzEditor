import { CylinderBufferGeometry, Vector3 } from 'three';
import * as THREE from 'three';

/**
* @Description: 拖拽辅助箭头
* @Author: wanggang
* @Date: 2022-03-20 16:52:57
* */
export default class ManipulatorArrowControl extends THREE.ArrowHelper {
    _cyliderHeight = 0.5

    cylinder: THREE.Mesh;

    constructor(
        public dir:Vector3,
        public origin:Vector3,
        public length:number,
        public hex:number,
        public headLength:number,
        public headWidth:number,
        // hasLine = false,
        radialSegments = 20,
    ) {
        super(dir, origin, length, hex, headLength, headWidth);

        // 重写椎体
        const coneMaterial:THREE.MeshBasicMaterial = this.cone.material as any;

        const coneGeo = new CylinderBufferGeometry(0, 0.5, 1, radialSegments, 1);
        coneGeo.translate(0, -0.5, 0);
        this.cone.geometry.dispose();
        this.cone.geometry = coneGeo;

        this.cone.position.y = length;
        this.cone.updateMatrix();

        const lineGeo = new CylinderBufferGeometry(0.16, 0.16, 1, radialSegments, 1);
        this.cylinder = new THREE.Mesh(lineGeo, coneMaterial);
        this.cylinder.position.y=this._cyliderHeight * 1
        this.cylinder.updateMatrix();

        this.add(this.cylinder);
    }
}
