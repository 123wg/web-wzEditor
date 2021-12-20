/**
* @Description: 房间
* @Author: wg
* @Date: 2021-12-15 13:40:47
* */
import * as THREE from 'three';
import RoomGround from './RoomGround';
import RoomRoof from './RoomRoof';

class Room {
    constructor(scene) {
        this.scene = scene;
        this.points = [];
        this.node = new THREE.Group();
        this.ground = new RoomGround(scene);
        this.roof = new RoomRoof(scene);
    }

    create_node() {
        this.ground.points = this.points;
        this.roof.points = this.points;
        this.ground.create_node();
        this.roof.create_node();
        this.node.add(this.ground.node);
        this.node.add(this.roof.node);
    }
}

export default Room;
