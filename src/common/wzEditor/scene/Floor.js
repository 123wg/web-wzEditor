/**
* @Description: 楼层
* @Author: wg
* @Date: 2021-12-15 13:28:47
* */
import * as THREE from 'three';
import Graph from './BFS';
import Room from './Room';

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
            // const wall_arr = info._lines;
            room_arr.forEach((c_area) => {
                const room = new Room(this.scene);
                // const pos = c_area.map((item) => new THREE.Vector3(item.x, 0, item.y));
                room.points = c_area;
                // 开始绘制地板和天花板
                room.create_node();
                this.scene.add(room.node);
                this.rooms.push(room);
            });
            // wall_arr.forEach((w_point) => {
            //     // 围墙重绘
            // });
        }
        // 只有一个点 啥也不干
        // 大于一个点 利用多边形算法 生成围墙
    }
}

export default Floor;
