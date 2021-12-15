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
        // 创建天花板，天花板默认是隐藏的  这里需要考虑后续的层级管理的设计，读取当前所在的层级
        // 创建地板
        const shape = new THREE.Shape(this.points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const mesh = new THREE.Mesh(geometry, material);
        this.node.add(mesh);
    }
}

export default RoomGround;
