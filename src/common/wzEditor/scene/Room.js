/**
* @Description: 房间
* @Author: wg
* @Date: 2021-12-15 13:40:47
* */
import * as THREE from 'three';
// import RoomGround from './RoomGround';
// import RoomRoof from './RoomRoof';

class Room {
    constructor(scene) {
        this.scene = scene;
        this.points = [];
        this.node = new THREE.Group();
        // this.ground = new RoomGround(scene);
        // this.roof = new RoomRoof(scene);
    }

    // FIXME 将创建地板的操作移出单独的对象
    create_node() {
        // 创建天花板，天花板默认是隐藏的  这里需要考虑后续的层级管理的设计，读取当前所在的层级
        // 创建地板
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

export default Room;
