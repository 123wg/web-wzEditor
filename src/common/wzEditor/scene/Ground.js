/**
* @Description: 地板类
* @Author: wg
* @Date: 2021-11-08 09:39:14
* */
import * as THREE from 'three';

class Ground {
    constructor(scene) {
        this.scene = scene; // FIXME 场景 -- 是否需要添加上层对象
        this._type = 'Ground';
        this._auxiliary_line = []; // 辅助线
        this._aux_width = 5;// 辅助线长度
        this._aux_depth = 5;// 辅助线宽度
        this._aux_height = 0.1;// 辅助线高度
        // this._ground_width = 0;// 地板的长度
        // this._ground_height = 1; // 地板高度
        // this._ground_depth = 0; // 地板的宽度
        this._start = new THREE.Vector3();// 起点
        this._end = new THREE.Vector3(); // 终点
        this._node = null; // 地板节点
    }

    // 创建辅助线
    _create_aux_line() {
        for (let i = 0; i < 4; i += 1) {
            const geometry = new THREE.BoxGeometry(this._aux_width, this._aux_height, this._aux_depth);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            cube.visible = false;
            cube.position.x = this._start.x;
            cube.position.z = this._start.z;
            this._auxiliary_line.push(cube);
        }
    }

    // 更新辅助线
    _update_aux_line() {
        const start_x = this._start.x;
        const end_x = this._end.x;
        const start_z = this._start.z;
        const end_z = this._end.z;
        const obj = this._get_cen_wh();
        const pos = [[start_x, start_z], [end_x, start_z], [end_x, end_z], [start_x, end_z]];
        for (let i = 0; i < this._auxiliary_line.length; i += 1) {
            if (i % 2 !== 0) {
                this._auxiliary_line[i].position.z = obj.cen_z;
                [this._auxiliary_line[i].position.x] = pos[i];
                this._auxiliary_line[i].scale.z = obj.height / this._aux_depth;
            } else {
                this._auxiliary_line[i].position.x = obj.cen_x;
                [, this._auxiliary_line[i].position.z] = pos[i];
                this._auxiliary_line[i].scale.x = obj.width / this._aux_width;
            }
        }
    }

    // 显示隐藏辅助线
    show_aux_line(type) {
        this._auxiliary_line.forEach((item) => { item.visible = type; });
    }

    // 创建地板
    _create_node() {
        const obj = this._get_cen_wh();
        const loader = new THREE.TextureLoader();
        return new Promise((resolve) => {
            loader.load('/static/img/floor.jpg', (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(10, 10);
                const geometry = new THREE.BoxGeometry(obj.width, 1, obj.height);
                const geometryMaterial = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide,
                });
                const node = new THREE.Mesh(geometry, geometryMaterial);
                node.position.y = 0.1;
                node.position.x = obj.cen_x;
                node.position.z = obj.cen_z;
                node.name = this._type;
                this._node = node;
                resolve();
            });
        });
    }

    // 获取中心点和宽高
    _get_cen_wh() {
        const start_x = this._start.x;
        const end_x = this._end.x;
        const start_z = this._start.z;
        const end_z = this._end.z;
        const cen_x = (start_x + end_x) / 2;
        const cen_z = (start_z + end_z) / 2;
        const width = end_x - start_x;
        const height = end_z - start_z;
        return {
            cen_x,
            cen_z,
            width,
            height,
        };
    }
}

export default Ground;
