/**
* @Description: 墙 对象
* @Author: wg
* @Date: 2021-11-12 13:50:20
* */
import * as THREE from 'three';

import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper';

class Wall {
    constructor(scene) {
        this.scene = scene;
        this.start = new THREE.Vector3(); // 起点
        this.end = new THREE.Vector3();// 终点
        // this.width = 0;// 长度
        this.height = 20;// 宽度
        this.depth = 2;// 高度
        this._node = new THREE.Group();
    }

    // 创建墙体
    _create_node() {
        // 计算长度
        const width = this.start.distanceTo(this.end);
        // 生成墙面
        const right_face = this._create_wall_face(width, this.depth, this.height, this.start, this.end, 'right');
        const left_face = this._create_wall_face(width, this.depth, this.height, this.start, this.end, 'left');
        // 生成边缘
        const wall_edge = this._create_wall_edge(width, this.depth, this.height, this.start, this.end);
        // 计算旋转角度

        // const vec1 = new THREE.Vector3(1, 0, 0);
        // const vec2 = this.end.clone().sub(this.start.clone());// 直接使用sub方法会改变之前的对象
        // let angle = vec2.angleTo(vec1);
        // const direc = vec2.cross(vec1).y;
        // if (direc > 0) angle = 0 - angle;

        this._node.position.set(this.start.x, this.start.y, this.start.z);
        this._node.add(left_face, right_face, wall_edge);
        this._node.position.y = 1;
        // this._node.position.set(this.start.x, 0, this.start.y);
        // this._node.rotation.y = angle;
    }

    // 创建边缘
    _create_wall_edge(width, depth, height, start, end) {
        const edge_geometry = new THREE.BufferGeometry();
        const depth_offset = depth / 2;
        // 生成顶点数据
        const position = new Float32Array([
            // 左面四个点
            start.x, 0, -depth_offset, // 0 -- left       0
            start.x, 0, depth_offset, // 1 --left         1
            start.x, height, depth_offset, // 2 --left    2
            start.x, height, -depth_offset, // 3 --left   3

            start.x, 0, -depth_offset, // 0 --bottom      4
            start.x, 0, depth_offset, // 1 --bottom       5
            start.x, height, depth_offset, // 2 --top     6
            start.x, height, -depth_offset, // 3 --top    7

            // 右面四个点
            end.x, 0, -depth_offset, // 4 --right         8
            end.x, 0, depth_offset, // 5 --right          9
            end.x, height, depth_offset, // 6 --right     10
            end.x, height, -depth_offset, // 7 --right    11

            end.x, 0, -depth_offset, // 4 --bottom        12
            end.x, 0, depth_offset, // 5 --bottom         13
            end.x, height, depth_offset, // 6 --top       14
            end.x, height, -depth_offset, // 7 --top      15
        ]);

        // 顶点索引
        const index = new Uint16Array([
            // 左面
            0, 1, 2,
            0, 2, 3,
            // 右面
            9, 8, 11,
            9, 11, 10,
            // 上面
            6, 14, 15,
            6, 15, 7,
            // 下面
            4, 12, 13,
            4, 13, 5,
        ]);
        // 法向数据
        const normal = new Float32Array([
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0, // 向左

            0, -1, 0,
            0, -1, 0, // 向下
            0, 1, 0, // 向上
            0, 1, 0,

            1, 0, 0, // 向右
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,

            0, -1, 0, // 向下
            0, -1, 0,
            0, 1, 0, // 向上
            0, 1, 0,

        ]);
        // uv贴图
        const uv = new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            0, 1,

            0, 0,
            0, 1,
            0, 0,
            0, 1,

            1, 0,
            0, 0,
            0, 1,
            1, 1,

            1, 0,
            1, 1,
            1, 0,
            1, 1,
        ]);

        edge_geometry.attributes.position = new THREE.BufferAttribute(position, 3);
        edge_geometry.index = new THREE.BufferAttribute(index, 1);
        edge_geometry.attributes.normal = new THREE.BufferAttribute(normal, 3);
        edge_geometry.attributes.uv = new THREE.BufferAttribute(uv, 2);

        const loader = new THREE.TextureLoader();
        const map_texture = loader.load('/static/img/wall_side.png');
        const edge_material = new THREE.MeshPhongMaterial({
            map: map_texture,
        });

        const edge_mesh = new THREE.Mesh(edge_geometry, edge_material);
        return edge_mesh;
    }

    // 创建墙面
    _create_wall_face(width, depth, height, start, end, side) {
        // 几何体
        const wall_geometry = new THREE.BufferGeometry();

        const depth_offset = side === 'right' ? depth / 2 : -depth / 2;
        // 顶点
        const wall_vertices = new Float32Array([
            start.x, 0, depth_offset,
            end.x, 0, depth_offset,
            end.x, height, depth_offset,
            start.x, height, depth_offset,
        ]);

        // 顶点索引
        const arr = side === 'right' ? [0, 1, 2, 0, 2, 3] : [1, 0, 3, 1, 3, 2];
        const wall_index = new Uint16Array(arr);

        const normal_direc = side === 'righgt' ? 1 : -1;

        // 法线
        const wall_normal = new Float32Array([
            0, 0, normal_direc,
            0, 0, normal_direc,
            0, 0, normal_direc,
            0, 0, normal_direc,
        ]);

        // uv坐标
        const wall_uv = new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            0, 1,
        ]);

        wall_geometry.attributes.position = new THREE.BufferAttribute(wall_vertices, 3);
        wall_geometry.index = new THREE.BufferAttribute(wall_index, 1);
        wall_geometry.attributes.normal = new THREE.BufferAttribute(wall_normal, 3);
        wall_geometry.attributes.uv = new THREE.BufferAttribute(wall_uv, 2);

        const loader = new THREE.TextureLoader();
        const texture = loader.load('/static/img/RoomWall.png');
        const wall_material = new THREE.MeshPhongMaterial({
            map: texture,
        });

        const wall_mesh = new THREE.Mesh(wall_geometry, wall_material);

        return wall_mesh;
    }
}

export default Wall;
