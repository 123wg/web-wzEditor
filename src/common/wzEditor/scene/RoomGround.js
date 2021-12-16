/**
* @Description: 房间地板
* @Author: wg
* @Date: 2021-12-15 13:42:43
* */
import * as THREE from 'three';

class RoomGround {
    constructor(scene) {
        this.scene = scene;
        this.points = [];
        this.node = new THREE.Group();
    }

    // TODO 创建房间节点
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
        this.node.add(mesh);
    }
}

export default RoomGround;
