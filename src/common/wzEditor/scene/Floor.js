/**
* @Description: 楼层
* @Author: wg
* @Date: 2021-12-15 13:28:47
* */
import * as THREE from 'three';
import Graph from './BFS';
import Room from './Room';
import Wall from './Wall';

/**
TODO
1.墙壁添加门窗
2.房间内设备摆放
3.自动吸附功能
*/

class Floor {
    constructor(scene) {
        this.scene = scene; // 场景
        this.node = new THREE.Group(); // 楼层下所有的节点
        this.rooms = []; // 房间
        this.walls = []; // 围墙组
        this.points = []; // 构成的节点
    }

    // 点位更新的时候执行方法
    update() {
        if (this.points.length > 1) {
            const point_arr = this.points.map((item) => new THREE.Vector2(item.x, item.z));
            const info = new Graph(point_arr);
            const room_arr = info.closed_area;
            const wall_arr = info._lines;

            this.clear_room();
            this.clear_wall();

            room_arr.forEach((c_area) => {
                const room = new Room(this.scene);
                room.points = c_area;
                // 开始绘制地板和天花板
                room.create_node();
                // this.scene.add(room.node);
                this.node.add(room.node);
                this.rooms.push(room);
            });

            wall_arr.forEach((w_point) => {
                const start = new THREE.Vector3(w_point.start.x, 0, w_point.start.y);
                const end = new THREE.Vector3(w_point.end.x, 0, w_point.end.y);
                const wall = new Wall();
                wall.start = start;
                wall.end = end;
                wall._create_node();
                this.add_wall(wall);
            });
        }
    }

    // 删除当前所有墙的方法
    clear_wall() {
        // 删除当前楼层的所有墙体
        this.walls.forEach((wall) => {
            this.node.remove(wall.node);
        });
        this.walls = [];
    }

    // 清除房间
    clear_room() {
        this.rooms.forEach((room) => {
            this.node.remove(room.node);
        });
        this.rooms = [];
    }

    // 添加墙
    add_wall(wall) {
        this.walls.push(wall);
        this.node.add(wall.node);
    }
}

export default Floor;
