/**
* @Description: 房间天花板
* @Author: wg
* @Date: 2021-12-15 13:46:00
* */
import * as THREE from 'three';

class RoomRoof {
    constructor(scene) {
        this.scene = scene;
        this.points = [];
        this.node = new THREE.Group();
    }

    create_node() {
        const shape = new THREE.Shape(this.points);
        const geometry = new THREE.ShapeGeometry(shape);
        const loader = new THREE.TextureLoader();
        const img = loader.load('/static/img/ground.jpg');
        const material = new THREE.MeshLambertMaterial({
            side: THREE.DoubleSide,
            map: img,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotateX(Math.PI / 2);
        mesh.translateZ(-30);
        mesh.visible = false;
        this.node.add(mesh);
    }
}

export default RoomRoof;
